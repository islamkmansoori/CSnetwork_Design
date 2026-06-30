// ✅ Auth State Hook

import { useState, useEffect, useCallback } from 'react';
import {
  isUserLoggedIn,
  getUserData,
  getUserId,
  clearAuthData,
} from '../utils/authStorage';
import {
  handleGoogleAuthResponse,
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
  refreshAccessToken,
} from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isLoading: true,       // true while checking stored auth
    userData: null,
    userId: null,
  });

  // ─── Check stored auth on mount ─────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = isUserLoggedIn();

        if (loggedIn) {
          const userData = getUserData();
          const userId = getUserId();

          // ✅ Try silent token refresh
          await refreshAccessToken().catch(() => {});

          setAuthState({
            isLoggedIn: true,
            isLoading: false,
            userData,
            userId,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  // ─── Set authenticated user ──────────────────────────
  const setAuthenticated = useCallback((userData) => {
    setAuthState({
      isLoggedIn: true,
      isLoading: false,
      userData,
      userId: userData.userId,
    });
  }, []);

  // ─── Logout ──────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuthData();
    setAuthState({
      isLoggedIn: false,
      isLoading: false,
      userData: null,
      userId: null,
    });
  }, []);

  return {
    ...authState,
    setAuthenticated,
    logout,
    // Expose service functions
    handleGoogleAuthResponse,
    sendSignupOTP,
    verifySignupOTP,
    sendLoginOTP,
    verifyLoginOTP,
  };
};

export default useAuth;