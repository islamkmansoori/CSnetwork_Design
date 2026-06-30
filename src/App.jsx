import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';

// ─── Protected Route ─────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('cs_isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth / Login Page */}
        <Route path="/" element={<Auth />} />

        {/* Google OAuth Callback */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}