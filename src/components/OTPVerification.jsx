import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RotateCcw, ArrowLeft, Send } from 'lucide-react';

export default function OTPVerification({ phoneNumber, onVerify, onChangeNumber, error, setError }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  const MAX_ATTEMPTS = 3;

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only accept numeric inputs
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Keep only last char (in case of double press)
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Move to next input if filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
      setError('');
    }
  };

  const handleResend = () => {
    if (timeLeft > 0 || isLocked) return;
    setTimeLeft(59);
    setOtp(['', '', '', '', '', '']);
    setError('');
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    // Simulate WhatsApp Resending
    console.log("Simulating resending WhatsApp OTP to:", phoneNumber);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLocked) return;

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      triggerShake();
      return;
    }

    // Mock validation: Let's assume code '123456' is correct.
    // If it's anything else, fail it to demonstrate verification errors and lockouts.
    if (otpCode === '123456') {
      onVerify(otpCode);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      triggerShake();

      if (nextAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError('WhatsApp OTP maximum attempts exceeded. Your account has been temporarily locked for 15 minutes as per WhatsApp security policies.');
      } else {
        setError(`Incorrect OTP code. You have ${MAX_ATTEMPTS - nextAttempts} attempts remaining.`);
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };

  return (
    <div className={`fade-in-el ${shake ? 'shake-el' : ''}`} style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          Enter OTP Verification
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          We have sent a 6-digit WhatsApp OTP verification code to <strong style={{ color: '#fff' }}>{phoneNumber}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* OTP Input Boxes */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px',
          margin: '12px 0'
        }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLocked}
              style={{
                width: '100%',
                maxWidth: '48px',
                height: '54px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '700',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1.5px solid',
                borderColor: error ? 'var(--accent-red)' : 'var(--glass-border)',
                borderRadius: '12px',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              className="form-input"
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 10px rgba(0, 82, 255, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? 'var(--accent-red)' : 'var(--glass-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>

        {/* Demo Hint Helper */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '12px',
          color: 'var(--accent-gold)',
          textAlign: 'center'
        }}>
          💡 Demo Hint: Enter code <strong style={{ textDecoration: 'underline' }}>123456</strong> to verify successfully!
        </div>

        {/* Error Messaging */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--accent-red)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Verification */}
        <button
          type="submit"
          disabled={isLocked || otp.some(d => !d)}
          className="btn btn-primary"
        >
          Verify OTP <Send size={15} />
        </button>

        {/* Timer, Resend, and Change Phone Action Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          fontSize: '13px'
        }}>
          {/* Resend Link with countdown */}
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || isLocked}
            style={{
              background: 'none',
              border: 'none',
              color: timeLeft > 0 || isLocked ? 'var(--text-muted)' : 'var(--primary)',
              cursor: timeLeft > 0 || isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              outline: 'none',
              padding: 0
            }}
          >
            <RotateCcw size={13} />
            {timeLeft > 0 ? `Resend in 00:${timeLeft.toString().padStart(2, '0')}` : 'Resend OTP'}
          </button>

          {/* Change Phone Number */}
          <button
            type="button"
            onClick={onChangeNumber}
            disabled={isLocked}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              outline: 'none',
              padding: 0
            }}
            onMouseEnter={(e) => { if (!isLocked) e.target.style.color = '#fff'; }}
            onMouseLeave={(e) => { if (!isLocked) e.target.style.color = 'var(--text-secondary)'; }}
          >
            <ArrowLeft size={13} />
            Change number
          </button>
        </div>
      </form>
    </div>
  );
}
