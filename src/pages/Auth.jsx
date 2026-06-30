import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import LiquidBackground from '../components/LiquidBackground';
import CSLogo from '../components/CSLogo';
import CountryPhoneInput from '../components/CountryPhoneInput';
import OTPVerification from '../components/OTPVerification';

// ─── Config ──────────────────────────────────────────────────
const BASE_URL     = 'https://4ecc-2401-4900-8822-3223-7452-2a92-525f-6d6.ngrok-free.app';
const GOOGLE_AUTH_URL = `${BASE_URL}/oauth2/authorization/google`;
const APPLE_AUTH_URL  = `${BASE_URL}/oauth2/authorization/apple`;
const AUTH_OPS_URL    = `${BASE_URL}/auth-operations`;

// ─── Icons ───────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = ({ size = 24, fill = 'currentColor' }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill={fill}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.7-119.3-65.2-30.7-61.7-90-61.7-91.3zM207.8 102.6c20.8-25 41-55.8 37.1-91-28.7 1.2-61.4 19.3-83.1 44.4-19.1 22.1-41.4 53.7-36.6 88.2 32.1 2.5 64.9-16.7 82.6-41.6z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 24, fill = 'currentColor' }) => (
  <svg viewBox="0 0 448 512" width={size} height={size} fill={fill}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.9c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.5-29.6-28.2-64.1-28.2-99.1 0-101.9 83-184.8 184.9-184.8 49.3 0 95.8 19.3 130.7 54.2 34.9 34.9 54.1 81.3 54.1 130.9 0 101.9-82.9 184.8-185.1 184.8zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

// ─── API Helper ───────────────────────────────────────────────
const callAuthOps = async (body) => {
  const res = await fetch(AUTH_OPS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
};

// ─── Save User to localStorage ────────────────────────────────
const saveUserSession = ({ userId, fullName, email, phone, accessToken, refreshToken }) => {
  localStorage.setItem('cs_isLoggedIn',   'true');
  localStorage.setItem('cs_userId',       String(userId || ''));
  localStorage.setItem('cs_accessToken',  accessToken  || '');
  localStorage.setItem('cs_refreshToken', refreshToken || '');
  localStorage.setItem('cs_userData', JSON.stringify({
    userId:   String(userId   || ''),
    fullName: fullName || '',
    email:    email    || '',
    phone:    phone    || '',
  }));
};

// ─── Main Auth Page ───────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  // steps: 'login' | 'phone-input' | 'otp-verify'
  const [step, setStep]           = useState('login');
  const [flow, setFlow]           = useState('A');
  // flow A = Google first → Phone OTP
  // flow B = WhatsApp OTP directly

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError]   = useState('');
  const [otpError, setOtpError]       = useState('');
  const [apiError, setApiError]       = useState('');
  const [isLoading, setIsLoading]     = useState(false);

  // Google se aaya pending user (phoneVerified: false)
  const [pendingUser, setPendingUser] = useState({
    userId:   '',
    fullName: '',
    email:    '',
    phone:    '',
  });

  // ── Already logged in check ─────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem('cs_isLoggedIn') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  // ── OAuthCallback ne /?step=phone-verify pe bheja ──────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('step') === 'phone-verify') {
      // URL clean karo
      window.history.replaceState({}, '', '/');

      const saved = sessionStorage.getItem('pending_google_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          sessionStorage.removeItem('pending_google_user');

          setPendingUser({
            userId:   parsed.userId   || '',
            fullName: parsed.fullName || '',
            email:    parsed.email    || '',
            phone:    '',
          });

          setFlow('A');
          setStep('phone-input');
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }, [location.search]);

  // ── Google / Apple redirect ─────────────────────────────────
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const handleAppleLogin = () => {
    window.location.href = APPLE_AUTH_URL;
  };

  // ── WhatsApp (Flow B) ───────────────────────────────────────
  const handleWhatsAppFlow = () => {
    setFlow('B');
    setPendingUser({ userId: '', fullName: '', email: '', phone: '' });
    setStep('phone-input');
  };

  // ── Send OTP ────────────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setApiError('');

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 8) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);

    try {
      if (flow === 'A') {
        // ✅ SEND_SIGNUP_OTP
        // userId STRING bhejo (as per backend docs)
        await callAuthOps({
          userId:      pendingUser.userId,   // ✅ String, not Number
          phoneNumber: phoneNumber,
          requestType: 'SEND_SIGNUP_OTP',
        });

      } else {
        // ✅ SEND_LOGIN_OTP
        await callAuthOps({
          phoneNumber: phoneNumber,
          requestType: 'SEND_LOGIN_OTP',
        });
      }

      // Phone save karo
      setPendingUser(prev => ({ ...prev, phone: phoneNumber }));
      setStep('otp-verify');

    } catch (err) {
      console.error('Send OTP error:', err);
      setPhoneError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────
  const handleOTPVerify = async (code) => {
    setOtpError('');
    setIsLoading(true);

    try {
      if (flow === 'A') {
        // ✅ VERIFY_SIGNUP_OTP
        const data = await callAuthOps({
          userId:      pendingUser.userId,   // ✅ String
          phoneNumber: pendingUser.phone,
          otp:         code,
          requestType: 'VERIFY_SIGNUP_OTP',
        });

        console.log('✅ Signup verified:', data);

        // Session save karo
        saveUserSession({
          userId:       data.userId   || pendingUser.userId,
          fullName:     data.fullName || pendingUser.fullName,
          email:        data.email    || pendingUser.email,
          phone:        pendingUser.phone,
          accessToken:  data.accessToken,
          refreshToken: data.refreshToken,
        });

        navigate('/dashboard', { replace: true });

      } else {
        // ✅ VERIFY_LOGIN_OTP
        const data = await callAuthOps({
          phoneNumber: pendingUser.phone,
          otp:         code,
          requestType: 'VERIFY_LOGIN_OTP',
        });

        console.log('✅ Login verified:', data);

        saveUserSession({
          userId:       data.userId,
          fullName:     data.fullName,
          email:        data.email,
          phone:        pendingUser.phone,
          accessToken:  data.accessToken,
          refreshToken: data.refreshToken,
        });

        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      console.error('OTP verify error:', err);
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (flow === 'A') {
      await callAuthOps({
        userId:      pendingUser.userId,
        phoneNumber: pendingUser.phone,
        requestType: 'SEND_SIGNUP_OTP',
      });
    } else {
      await callAuthOps({
        phoneNumber: pendingUser.phone,
        requestType: 'SEND_LOGIN_OTP',
      });
    }
  };

  // ────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────
  return (
    <LiquidBackground>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '40px 20px',
        width: '100%', zIndex: 2, boxSizing: 'border-box',
      }}>

        {/* ── Main Card ─────────────────────────────────────── */}
        <div className="glass-panel slide-up-el" style={{
          width: '100%', maxWidth: '520px',
          padding: '44px 36px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', boxSizing: 'border-box',
          marginBottom: '24px',
        }}>

          {/* Logo */}
          <div style={{ marginBottom: '32px', textAlign: 'center', width: '100%' }}>
            <CSLogo size="medium" />
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div style={{
              width: '100%', marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px', fontSize: '13px',
              color: '#fca5a5',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {apiError}
              <button
                onClick={() => setApiError('')}
                style={{
                  marginLeft: 'auto', background: 'none',
                  border: 'none', color: '#fca5a5',
                  cursor: 'pointer', fontSize: '16px',
                }}
              >✕</button>
            </div>
          )}

          {/* ════════════════════════════════ */}
          {/* STEP 1: LOGIN SCREEN            */}
          {/* ════════════════════════════════ */}
          {step === 'login' && (
            <div className="fade-in-el" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{
                  fontSize: '24px', fontWeight: '700',
                  color: '#fff', marginBottom: '10px',
                }}>
                  Global Franchise Operators Group
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: '1.6',
                }}>
                  Collaborate, grow, and monetize your networks.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>

                {/* Google */}
                <button onClick={handleGoogleLogin} className="btn btn-social">
                  <GoogleIcon /> Continue with Google
                </button>

                {/* Apple */}
                <button onClick={handleAppleLogin} className="btn btn-social">
                  <AppleIcon size={18} fill="#fff" /> Continue with Apple
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                  <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{
                    padding: '0 12px', fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>or</span>
                  <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppFlow}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 4px 20px rgba(37,211,102,0.25)',
                  }}
                >
                  <WhatsAppIcon size={18} fill="#fff" />
                  Continue with WhatsApp
                </button>
              </div>

              {/* Info Box */}
              <div style={{
                marginTop: '24px', padding: '12px 16px',
                background: 'rgba(0,82,255,0.06)',
                border: '1px solid rgba(0,82,255,0.15)',
                borderRadius: '12px', fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.6, textAlign: 'left',
              }}>
                <span style={{
                  fontWeight: '700', color: '#00e5ff',
                  display: 'block', marginBottom: '4px',
                }}>
                  💡 New user?
                </span>
                Sign in with Google → verify WhatsApp → you're in!<br />
                Already registered? Google or WhatsApp OTP both work.
              </div>
            </div>
          )}

          {/* ════════════════════════════════ */}
          {/* STEP 2: PHONE INPUT             */}
          {/* ════════════════════════════════ */}
          {step === 'phone-input' && (
            <div className="fade-in-el" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '22px', fontWeight: '700',
                  color: '#fff', marginBottom: '12px',
                }}>
                  {flow === 'A' ? 'Verify WhatsApp' : 'Login with WhatsApp'}
                </h2>

                {/* Flow A: Google account info show karo */}
                {flow === 'A' && pendingUser.email && (
                  <div style={{
                    background: 'rgba(16,185,129,0.07)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '10px', padding: '10px 14px',
                    display: 'flex', alignItems: 'center',
                    gap: '10px', marginBottom: '16px', textAlign: 'left',
                  }}>
                    <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
                        Google account linked
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                        {pendingUser.fullName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        {pendingUser.email}
                      </div>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div style={{
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid rgba(0,229,255,0.12)',
                  borderRadius: '12px', padding: '12px 14px',
                  color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                  display: 'flex', alignItems: 'flex-start',
                  gap: '10px', textAlign: 'left', lineHeight: '1.5',
                }}>
                  <Info size={16} style={{ color: '#00e5ff', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    {flow === 'A'
                      ? 'Enter your WhatsApp number to complete signup. OTP will be sent.'
                      : 'Enter your registered WhatsApp number. OTP will be sent.'
                    }
                  </span>
                </div>
              </div>

              <form
                onSubmit={handlePhoneSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <CountryPhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  error={phoneError}
                  setError={setPhoneError}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <span style={{
                        display: 'flex', alignItems: 'center',
                        gap: '8px', justifyContent: 'center',
                      }}>
                        <span style={{
                          width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff', borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Sending OTP...
                      </span>
                    : '📲 Send OTP on WhatsApp'
                  }
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('login');
                    setPhoneError('');
                    setPhoneNumber('');
                  }}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  ← Back
                </button>
              </form>
            </div>
          )}

          {/* ════════════════════════════════ */}
          {/* STEP 3: OTP VERIFY              */}
          {/* ════════════════════════════════ */}
          {step === 'otp-verify' && (
            <OTPVerification
              phoneNumber={pendingUser.phone}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onChangeNumber={() => {
                setStep('phone-input');
                setOtpError('');
              }}
              error={otpError}
              setError={setOtpError}
              isLoading={isLoading}
            />
          )}

          {/* ── Footer Notice ────────────────────────────────── */}
          <div style={{
            marginTop: '36px', paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            width: '100%',
          }}>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: '1.6',
            }}>
              <strong style={{
                color: '#f59e0b',
                display: 'block', marginBottom: '3px',
              }}>
                ⚠️ FRANCHISE OPERATOR POLICY:
              </strong>
              Once registered under a franchise, members cannot be reassigned.
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
              Support:{' '}
              <a
                href="mailto:info@connectsouq.com"
                style={{ color: '#0052ff', textDecoration: 'underline' }}
              >
                info@connectsouq.com
              </a>
            </p>
          </div>
        </div>

        {/* ── Page Footer ───────────────────────────────────── */}
        <div style={{
          textAlign: 'center', fontSize: '12px',
          color: 'rgba(255,255,255,0.2)',
          maxWidth: '520px', lineHeight: '1.6',
        }}>
          <div>© {new Date().getFullYear()} CS Network Global Franchise Operators Group.</div>
          <div style={{ marginTop: '4px' }}>
            Powered by{' '}
            <a
              href="https://www.connectsouq.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0052ff', textDecoration: 'none' }}
            >
              Connect Souq
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </LiquidBackground>
  );
}