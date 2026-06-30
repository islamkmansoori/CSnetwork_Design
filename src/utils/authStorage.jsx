// ✅ Token & User Data Management (localStorage for React Web)

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'cs_accessToken',
  REFRESH_TOKEN: 'cs_refreshToken',
  USER_ID: 'cs_userId',
  IS_LOGGED_IN: 'cs_isLoggedIn',
  USER_DATA: 'cs_userData',
};

// ─── Save ───────────────────────────────────────────
export const saveTokens = ({ accessToken, refreshToken }) => {
  try {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (e) {
    console.error('❌ saveTokens error:', e);
  }
};

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userData.userId || '');
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (e) {
    console.error('❌ saveUserData error:', e);
  }
};

// ─── Get ────────────────────────────────────────────
export const getAccessToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (e) {
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (e) {
    return null;
  }
};

export const getUserId = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  } catch (e) {
    return null;
  }
};

export const getUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const isUserLoggedIn = () => {
  try {
    const flag = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return flag === 'true' && !!token;
  } catch (e) {
    return false;
  }
};

// ─── Clear ──────────────────────────────────────────
export const clearAuthData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    console.log('✅ Auth data cleared');
  } catch (e) {
    console.error('❌ clearAuthData error:', e);
  }
};

// ─── Token Expiry Check ─────────────────────────────
export const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    // 60s buffer
    return decoded.exp < Date.now() / 1000 + 60;
  } catch (e) {
    return true;
  }
};

export default {
  saveTokens,
  saveUserData,
  getAccessToken,
  getRefreshToken,
  getUserId,
  getUserData,
  isUserLoggedIn,
  clearAuthData,
  isTokenExpired,
};