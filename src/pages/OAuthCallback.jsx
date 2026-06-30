import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidBackground from '../components/LiquidBackground';
import CSLogo from '../components/CSLogo';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing your login...');
  const [error,  setError]  = useState('');

  useEffect(() => {
    const params        = new URLSearchParams(window.location.search);
    const userId        = params.get('userId');
    const phoneVerified = params.get('phoneVerified');
    const errorParam    = params.get('error');

    // ── Error case ────────────────────────────────────────────
    if (errorParam) {
      setError('Google login failed: ' + errorParam);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // ── Invalid params ────────────────────────────────────────
    if (!userId || phoneVerified === null) {
      setError('Invalid callback. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // ── phoneVerified = true → Existing user ──────────────────
    // Cookies mein tokens hain (backend ne set kiye)
    // Bas localStorage update karo → dashboard
    if (phoneVerified === 'true') {
      setStatus('Welcome back! Loading dashboard...');

      localStorage.setItem('cs_isLoggedIn', 'true');
      localStorage.setItem('cs_userId', userId);
      // userData baad mein dashboard fetch karega
      localStorage.setItem('cs_userData', JSON.stringify({
        userId,
        fullName: '',
        email:    '',
        phone:    '',
      }));

      setTimeout(() => navigate('/dashboard', { replace: true }), 800);

    // ── phoneVerified = false → New user ──────────────────────
    // Phone verify karna hai
    } else if (phoneVerified === 'false') {
      setStatus('One more step — verify your WhatsApp...');

      // userId sessionStorage mein save karo
      // (fullName, email URL mein nahi aaya - backend ne nahi bheja)
      sessionStorage.setItem('pending_google_user', JSON.stringify({
        userId,
        fullName: '',
        email:    '',
      }));

      setTimeout(() => navigate('/?step=phone-verify', { replace: true }), 500);

    } else {
      setError('Unexpected response. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, []);

  return (
    <LiquidBackground>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', gap: '28px', padding: '20px',
      }}>
        <CSLogo size="medium" />

        {error ? (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '14px', padding: '16px 24px',
            color: '#fca5a5', fontSize: '14px',
            textAlign: 'center', maxWidth: '360px',
          }}>
            ⚠️ {error}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {/* Spinner */}
            <div style={{
              width: '52px', height: '52px',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#0052ff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
              {status}
            </p>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </LiquidBackground>
  );
}