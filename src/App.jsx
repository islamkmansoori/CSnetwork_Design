import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Auth            from './pages/Auth';
import OAuthCallback   from './pages/OAuthCallback';
import CompleteProfile from './pages/CompleteProfile';
import Plans           from './pages/Plans';
import Checkout        from './pages/Checkout';
import Dashboard       from './pages/Dashboard';

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

        {/* Public */}
        <Route path="/"               element={<Auth />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Protected Flow */}
        <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/plans"            element={<ProtectedRoute><Plans /></ProtectedRoute>} />
        <Route path="/checkout"         element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}