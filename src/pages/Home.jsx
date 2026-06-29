import React, { useState } from 'react';
import { LogOut, ShieldCheck, Mail, CheckCircle2, Info, Building2, User, ExternalLink } from 'lucide-react';
import LiquidBackground from './components/LiquidBackground';
import CSLogo from './components/CSLogo';
import CountryPhoneInput from './components/CountryPhoneInput';
import OTPVerification from './components/OTPVerification';

const AppleIcon = ({ size = 24, fill = "currentColor", style }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill={fill} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.7-119.3-65.2-30.7-61.7-90-61.7-91.3zM207.8 102.6c20.8-25 41-55.8 37.1-91-28.7 1.2-61.4 19.3-83.1 44.4-19.1 22.1-41.4 53.7-36.6 88.2 32.1 2.5 64.9-16.7 82.6-41.6z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 24, fill = "currentColor", style }) => (
  <svg viewBox="0 0 448 512" width={size} height={size} fill={fill} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.9c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.5-29.6-28.2-64.1-28.2-99.1 0-101.9 83-184.8 184.9-184.8 49.3 0 95.8 19.3 130.7 54.2 34.9 34.9 54.1 81.3 54.1 130.9 0 101.9-82.9 184.8-185.1 184.8zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

export default function App() {
  const [flow, setFlow] = useState(null); // 'A' (Social First) or 'B' (WhatsApp First)
  const [step, setStep] = useState('dashboard'); // 'dashboard', 'social-popup', 'whatsapp-input', 'otp-verify', 'social-connect', 'success'
  const [authProvider, setAuthProvider] = useState(null); // 'google', 'apple', 'whatsapp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // User info gathered from mock login
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  // Simulated Social Window Popup State
  const [socialPopup, setSocialPopup] = useState({
    isOpen: false,
    provider: '',
    loading: false
  });

  // Trigger Mock Native Authentication Popup
  const triggerSocialAuth = (provider) => {
    setAuthProvider(provider);
    setSocialPopup({ isOpen: true, provider, loading: true });
    
    // Simulate loading/authenticating in native popups
    setTimeout(() => {
      setSocialPopup(prev => ({ ...prev, loading: false }));
    }, 1200);
  };

  // Complete simulated login from native popup
  const completeSocialAuth = (name, email, avatar) => {
    setUserInfo(prev => ({
      ...prev,
      name,
      email,
      avatar
    }));
    setSocialPopup({ isOpen: false, provider: '', loading: false });

    if (flow === 'A' || flow === null) {
      // Social First Flow
      setFlow('A');
      setStep('whatsapp-input');
    } else if (flow === 'B') {
      // Connecting Social after WhatsApp in WhatsApp-First Flow
      setStep('success');
    }
  };

  // Handle WhatsApp Phone number submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setPhoneError('Please enter your WhatsApp mobile number.');
      return;
    }
    // Verify length of digits
    if (phoneNumber.length < 8) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }

    setPhoneError('');
    setOtpError('');
    
    if (flow === null) {
      // WhatsApp First Flow
      setFlow('B');
      setAuthProvider('whatsapp');
    }
    
    setStep('otp-verify');
  };

  // Handle WhatsApp OTP Success verification
  const handleOTPVerify = (code) => {
    setUserInfo(prev => ({
      ...prev,
      phone: phoneNumber
    }));

    if (flow === 'A') {
      // Social First: after OTP, we are fully authenticated
      setStep('success');
    } else if (flow === 'B') {
      // WhatsApp First: after OTP, we prompt to connect Social (Google/Apple)
      setStep('social-connect');
    }
  };

  // Reset back to entry dashboard
  const handleLogout = () => {
    setFlow(null);
    setStep('dashboard');
    setAuthProvider(null);
    setPhoneNumber('');
    setUserInfo({ name: '', email: '', phone: '', avatar: '' });
  };

  return (
    <LiquidBackground>
      {/* Outer Flex Container for centering authentication card */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        width: '100%',
        zIndex: 2,
        boxSizing: 'border-box'
      }}>
        
        {/* Main Frosted Liquid Glass Card */}
        <div className="glass-panel slide-up-el" style={{
          width: '100%',
          maxWidth: '520px',
          padding: '44px 36px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          marginBottom: '24px'
        }}>
          {/* Header Area: CS Network Logo */}
          <div style={{ marginBottom: '32px', textAlign: 'center', width: '100%' }}>
            <CSLogo size="medium" />
          </div>

          {/* DYNAMIC SCREEN RENDERS */}
          
          {/* STEP 1: INITIAL ENTRY DASHBOARD */}
          {step === 'dashboard' && (
            <div className="fade-in-el" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '10px', letterSpacing: '-0.5px' }}>
                  Global Franchise Operators Group
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Collaborate, grow, and monetize your networks effectively. Create an official account to unlock structured networking and franchise opportunities.
                </p>
              </div>

              {/* Options Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                
                {/* Google Sign In (Flow A Start) */}
                <button 
                  onClick={() => {
                    setFlow('A');
                    triggerSocialAuth('Google');
                  }}
                  className="btn btn-social"
                >
                  {/* Inline Google Icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Apple Sign In (Flow A Start) */}
                <button 
                  onClick={() => {
                    setFlow('A');
                    triggerSocialAuth('Apple');
                  }}
                  className="btn btn-social"
                >
                  <AppleIcon size={18} fill="#fff" />
                  Continue with Apple
                </button>

                {/* Separator */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                  <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                  <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
                  <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                </div>

                {/* WhatsApp Sign In (Flow B Start) */}
                <button 
                  onClick={() => {
                    setFlow('B');
                    setStep('whatsapp-input');
                    setAuthProvider('whatsapp');
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 4px 20px rgba(37, 211, 102, 0.25)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                >
                  <WhatsAppIcon size={18} fill="#fff" />
                  Continue with WhatsApp
                </button>
              </div>

              {/* Help tip showing the user how to test both paths */}
              <div style={{
                marginTop: '28px',
                padding: '12px 16px',
                background: 'rgba(0, 82, 255, 0.06)',
                border: '1px solid rgba(0, 82, 255, 0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                <span style={{ fontWeight: '700', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>💡 Interactive Testing Guide:</span>
                • <strong>Flow A:</strong> Choose Google/Apple first, and you will be asked to confirm WhatsApp after. <br />
                • <strong>Flow B:</strong> Choose WhatsApp first, and you will be asked to link Google/Apple after.
              </div>
            </div>
          )}

          {/* STEP 2: WHATSAPP NUMBER ENTRY */}
          {step === 'whatsapp-input' && (
            <div className="fade-in-el" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                  Verify Your WhatsApp
                </h2>
                
                {/* Explain WHY WhatsApp is needed */}
                <div style={{
                  background: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  textAlign: 'left',
                  lineHeight: '1.45',
                  marginBottom: '16px'
                }}>
                  <Info size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Why WhatsApp?</strong> As a franchise operator, business networking happens in real-time. We send crucial transaction updates and networking leads directly to your WhatsApp so you never miss an opportunity.
                  </span>
                </div>
              </div>

              <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <CountryPhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  error={phoneError}
                  setError={setPhoneError}
                />

                <button type="submit" className="btn btn-primary">
                  Send OTP Code
                </button>

                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="btn btn-secondary"
                >
                  Back to options
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 'otp-verify' && (
            <OTPVerification
              phoneNumber={phoneNumber}
              onVerify={handleOTPVerify}
              onChangeNumber={() => setStep('whatsapp-input')}
              error={otpError}
              setError={setOtpError}
            />
          )}

          {/* STEP 4: WHATSAPP-FIRST SOCIAL CONNECT PROMPT (Flow B) */}
          {step === 'social-connect' && (
            <div className="fade-in-el" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                <CheckCircle2 size={44} style={{ color: 'var(--accent-green)', marginBottom: '12px' }} />
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  WhatsApp Verified Successfully
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Your phone number is confirmed. Next, connect your Google or Apple account to secure your profile and receive official email communications.
                </p>
              </div>

              {/* Options Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Connect Google */}
                <button
                  onClick={() => triggerSocialAuth('Google')}
                  className="btn btn-social"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Link Google Account
                </button>

                {/* Connect Apple */}
                <button
                  onClick={() => triggerSocialAuth('Apple')}
                  className="btn btn-social"
                >
                  <AppleIcon size={18} fill="#fff" />
                  Link Apple Account
                </button>
              </div>

              {/* Informative alert explaining data protection */}
              <div style={{
                marginTop: '20px',
                fontSize: '11px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
                We never store passwords or share your phone information.
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS / LOGGED IN LANDING PAGE */}
          {step === 'success' && (
            <div className="fade-in-el" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '2px solid var(--accent-green)',
                  color: 'var(--accent-green)',
                  marginBottom: '16px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                  Welcome Onboard!
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  You are registered under the CS Network Franchise Group
                </p>
              </div>

              {/* Profile Frosted Section */}
              <div className="glass-panel" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                width: '100%',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                
                {/* User avatar and name info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                  <img 
                    src={userInfo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'} 
                    alt="User Profile" 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '2px solid var(--primary)',
                      objectFit: 'cover'
                    }} 
                  />
                  <div>
                    <strong style={{ color: '#fff', fontSize: '15px', display: 'block' }}>{userInfo.name || 'Franchise Operator'}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={11} color="var(--secondary)" /> Verified Operator ID: CS-F9382
                    </span>
                  </div>
                </div>

                {/* Detail fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
                    <span style={{ color: '#fff', fontWeight: '500' }}>{userInfo.email || 'operator@connectsouq.com'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>WhatsApp Number:</span>
                    <span style={{ color: '#fff', fontWeight: '500' }}>{userInfo.phone || '+971 50 123 4567'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Franchise Status:</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Active Group Operator
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a 
                  href="https://www.connectsouq.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Go to Connect Souq Dashboard <ExternalLink size={14} />
                </a>

                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout <LogOut size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Franchise Operators Group Disclaimer / Notice Block */}
          <div style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            width: '100%',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>
              <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚠️ IMPORTANT FRANCHISE OPERATOR POLICY:
              </strong>
              Once a member is registered under a specific franchise, they cannot join or be reassigned to another franchise. Please ensure your credentials and referral associations are correct.
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '6px'
            }}>
              For support or inquiries, please email <a href="mailto:info@connectsouq.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>info@connectsouq.com</a>.
            </p>
          </div>
        </div>

        {/* Global Footer: Copyright, Disclaimer and Links */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          maxWidth: '520px',
          lineHeight: '1.6'
        }}>
          <div>
            © {new Date().getFullYear()} CS Network Global Franchise Operators Group. All rights reserved.
          </div>
          <div style={{ marginTop: '4px' }}>
            Built for operators to collaborate, grow, and monetize. Powered by <a href="https://www.connectsouq.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Connect Souq</a>.
          </div>
        </div>

      </div>

      {/* SIMULATED ACCOUNT POPUP WINDOW MODAL */}
      {socialPopup.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.25s ease'
        }}>
          
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '380px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(40px) saturate(150%)',
            WebkitBackdropFilter: 'blur(40px) saturate(150%)',
            color: '#1e293b',
            padding: '24px',
            borderRadius: '24px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            
            {/* Native Window Look Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingBottom: '12px',
              marginBottom: '16px',
              fontSize: '11px',
              color: '#475569',
              fontWeight: 500
            }}>
              <span>Sign in with {socialPopup.provider}</span>
              <button 
                onClick={() => setSocialPopup({ isOpen: false, provider: '', loading: false })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              >
                ✕
              </button>
            </div>
            
            {socialPopup.loading ? (
              /* Spinner State */
              <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(0, 82, 255, 0.1)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin-slow 0.8s linear infinite'
                }} />
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>Connecting secure credentials...</span>
              </div>
            ) : (
              /* Account Chooser State */
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                  {socialPopup.provider === 'Google' ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px' }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ) : (
                    <AppleIcon size={32} fill="#1e293b" style={{ margin: '0 auto 10px', color: '#1e293b' }} />
                  )}
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Choose an account</h4>
                  <span style={{ fontSize: '12px', color: '#475569' }}>to continue to csnetwork.global</span>
                </div>
                
                {/* Account list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Account 1 */}
                  <button 
                    onClick={() => completeSocialAuth('John Doe', 'john.doe@connectsouq.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '12px',
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" 
                      alt="" 
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block', color: '#1e293b', fontWeight: 600 }}>John Doe</strong>
                      <span style={{ fontSize: '11px', color: '#475569' }}>john.doe@connectsouq.com</span>
                    </div>
                  </button>
                  
                  {/* Account 2 */}
                  <button 
                    onClick={() => completeSocialAuth('Sarah Smith', 'sarah.smith@connectsouq.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '12px',
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" 
                      alt="" 
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block', color: '#1e293b', fontWeight: 600 }}>Sarah Smith</strong>
                      <span style={{ fontSize: '11px', color: '#475569' }}>sarah.smith@connectsouq.com</span>
                    </div>
                  </button>
                  
                </div>
                
                <div style={{
                  marginTop: '20px',
                  fontSize: '11.5px',
                  color: '#475569',
                  lineHeight: '1.4'
                }}>
                  To create a new operator credential, select one of the existing identities above. Google/Apple will automatically verify your profile details.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </LiquidBackground>
  );
}
