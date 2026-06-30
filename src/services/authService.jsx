// ✅ All Backend API Calls

import {
  saveTokens,
  saveUserData,
  getRefreshToken,
  getAccessToken,
  isTokenExpired,
  clearAuthData,
} from '../utils/authStorage';

// ─── Config ─────────────────────────────────────────
const BASE_URL = 'https://7576-2401-4900-8820-88ee-ec31-17d2-fa1e-7662.ngrok-free.app';

// Auth operations endpoint
const AUTH_OPS_URL = `${BASE_URL}/auth-operations`;

// Google OAuth URL - opens in same tab, backend redirects back
export const GOOGLE_AUTH_URL = `${BASE_URL}/oauth2/authorization/google`;
export const APPLE_AUTH_URL  = `${BASE_URL}/oauth2/authorization/apple`;

// ─── Refresh Token State ─────────────────────────────
let isRefreshing = false;
let refreshPromise = null;

// ─── Helper: Make Request ────────────────────────────
const makeRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

// ────────────────────────────────────────────────────
// 🔹 GOOGLE AUTH
// Flow: Redirect user → Backend handles OAuth → Returns userData
// ────────────────────────────────────────────────────

/**
 * Redirect user to Google OAuth
 * Backend will redirect back to your app's callback URL
 */
export const initiateGoogleAuth = () => {
  console.log('🔐 Redirecting to Google OAuth...');
  // Save current path to return after auth
  sessionStorage.setItem('auth_redirect', window.location.pathname);
  window.location.href = GOOGLE_AUTH_URL;
};

export const initiateAppleAuth = () => {
  console.log('🔐 Redirecting to Apple OAuth...');
  sessionStorage.setItem('auth_redirect', window.location.pathname);
  window.location.href = APPLE_AUTH_URL;
};

/**
 * Handle Google OAuth callback
 * Call this when user is redirected back after Google login
 * Backend returns userData in response body (not in URL params)
 * 
 * @param {Object} responseData - Data from backend after OAuth redirect
 * Expected: { userId, fullName, email, phoneVerified, accessToken, refreshToken, message }
 */
export const handleGoogleAuthResponse = async (responseData) => {
  try {
    console.log('📩 Google Auth Response:', responseData);

    const {
      userId,
      fullName,
      email,
      phoneVerified,
      accessToken,
      refreshToken,
      message,
    } = responseData;

    if (!userId) {
      throw new Error('No userId in response');
    }

    // ✅ New user - phone not verified yet
    if (!phoneVerified || !accessToken) {
      console.log('📱 New user - phone verification required');
      return {
        success: true,
        isNewUser: true,
        requiresPhoneVerification: true,
        userId,
        fullName,
        email,
        message,
      };
    }

    // ✅ Existing user - fully authenticated
    saveTokens({ accessToken, refreshToken });
    saveUserData({
      userId,
      fullName,
      email,
      phoneVerified: true,
      loginTime: new Date().toISOString(),
    });

    return {
      success: true,
      isNewUser: false,
      requiresPhoneVerification: false,
      userId,
      fullName,
      email,
      accessToken,
      refreshToken,
      message,
    };
  } catch (error) {
    console.error('❌ handleGoogleAuthResponse error:', error);
    return { success: false, error: error.message };
  }
};

// ────────────────────────────────────────────────────
// 🔹 OTP OPERATIONS  
// All go to POST /auth-operations with requestType
// ────────────────────────────────────────────────────

/**
 * Send Signup OTP (after Google auth for new users)
 */
export const sendSignupOTP = async ({ userId, phoneNumber }) => {
  try {
    console.log('📤 Sending Signup OTP to:', phoneNumber);

    const response = await makeRequest(AUTH_OPS_URL, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        phoneNumber,
        requestType: 'SEND_SIGNUP_OTP',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    console.log('✅ Signup OTP sent');
    return { success: true, message: data.message || 'OTP sent successfully' };
  } catch (error) {
    console.error('❌ sendSignupOTP error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify Signup OTP
 * Returns accessToken + refreshToken on success
 */
export const verifySignupOTP = async ({ userId, phoneNumber, otp }) => {
  try {
    console.log('🔐 Verifying Signup OTP...');

    const response = await makeRequest(AUTH_OPS_URL, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        phoneNumber,
        otp,
        requestType: 'VERIFY_SIGNUP_OTP',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Verification failed: ${response.status}`);
    }

    const { accessToken, refreshToken, fullName, email } = data;

    if (!accessToken) {
      throw new Error('No access token received after OTP verification');
    }

    // ✅ Save tokens & user data
    saveTokens({ accessToken, refreshToken });
    saveUserData({
      userId,
      fullName: fullName || '',
      email: email || '',
      phone: phoneNumber,
      phoneVerified: true,
      loginTime: new Date().toISOString(),
    });

    console.log('✅ Signup OTP verified, user registered');
    return {
      success: true,
      userId,
      accessToken,
      refreshToken,
      fullName,
      email,
      message: data.message,
    };
  } catch (error) {
    console.error('❌ verifySignupOTP error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Login OTP (WhatsApp first flow)
 */
export const sendLoginOTP = async ({ phoneNumber }) => {
  try {
    console.log('📤 Sending Login OTP to:', phoneNumber);

    const response = await makeRequest(AUTH_OPS_URL, {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        requestType: 'SEND_LOGIN_OTP',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // ✅ 404 = user not found = new user needs signup flow
      if (response.status === 404) {
        return {
          success: false,
          isNewUser: true,
          error: 'Phone number not registered. Please sign up first.',
        };
      }
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    console.log('✅ Login OTP sent');
    return { success: true, message: data.message || 'OTP sent' };
  } catch (error) {
    console.error('❌ sendLoginOTP error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify Login OTP
 */
export const verifyLoginOTP = async ({ phoneNumber, otp }) => {
  try {
    console.log('🔐 Verifying Login OTP...');

    const response = await makeRequest(AUTH_OPS_URL, {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        otp,
        requestType: 'VERIFY_LOGIN_OTP',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Verification failed: ${response.status}`);
    }

    const { accessToken, refreshToken, userId, fullName, email } = data;

    if (!accessToken) {
      throw new Error('No access token in login response');
    }

    // ✅ Save tokens
    saveTokens({ accessToken, refreshToken });
    saveUserData({
      userId,
      fullName: fullName || '',
      email: email || '',
      phone: phoneNumber,
      phoneVerified: true,
      loginTime: new Date().toISOString(),
    });

    console.log('✅ Login OTP verified');
    return {
      success: true,
      userId,
      accessToken,
      refreshToken,
      fullName,
      email,
    };
  } catch (error) {
    console.error('❌ verifyLoginOTP error:', error);
    return { success: false, error: error.message };
  }
};

// ────────────────────────────────────────────────────
// 🔹 REFRESH TOKEN
// ────────────────────────────────────────────────────

export const refreshAccessToken = async () => {
  // ✅ Prevent multiple simultaneous refresh calls
  if (isRefreshing && refreshPromise) {
    console.log('🔄 Already refreshing, waiting...');
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        console.warn('⚠️ No refresh token available');
        return null;
      }

      console.log('🔄 Refreshing access token...');

      const response = await makeRequest(AUTH_OPS_URL, {
        method: 'POST',
        body: JSON.stringify({
          refreshToken,
          requestType: 'REFRESH_TOKEN',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // ✅ Only clear auth if token is rejected
        if (response.status === 401 || response.status === 403) {
          console.error('❌ Refresh token rejected - logging out');
          clearAuthData();
          return null;
        }
        console.warn('⚠️ Server error during refresh, will retry later');
        return null;
      }

      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;

      if (!newAccessToken) {
        console.error('❌ No access token in refresh response');
        return null;
      }

      saveTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || getRefreshToken(),
      });

      console.log('✅ Token refreshed successfully');
      return newAccessToken;
    } catch (error) {
      console.error('❌ Refresh error:', error.message);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// ────────────────────────────────────────────────────
// 🔹 AUTHENTICATED REQUEST (Auto refresh on 401)
// ────────────────────────────────────────────────────

export const makeAuthenticatedRequest = async (url, options = {}) => {
  let token = getAccessToken();

  // ✅ Proactive refresh if expired
  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  if (!token) {
    throw new Error('No valid access token');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await makeRequest(url, { ...options, headers });

  // ✅ Retry once on 401
  if (response.status === 401) {
    console.log('🔄 Got 401, retrying with fresh token...');
    const newToken = await refreshAccessToken();

    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      return makeRequest(url, { ...options, headers });
    }
  }

  return response;
};

export default {
  initiateGoogleAuth,
  initiateAppleAuth,
  handleGoogleAuthResponse,
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
  refreshAccessToken,
  makeAuthenticatedRequest,
  GOOGLE_AUTH_URL,
  APPLE_AUTH_URL,
};