import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RotateCcw, ArrowLeft, Send } from 'lucide-react';

export default function OTPVerification({
  phoneNumber,
  onVerify,
  onResend,
  onChangeNumber,
  error,
  setError,
  isLoading,
}) {
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [shake, setShake]     = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // ── Countdown Timer ─────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ── Focus First Input ───────────────────────────────────────
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ── Shake on Error ──────────────────────────────────────────
  useEffect(() => {
    if (error) triggerShake();
  }, [error]);

  // ── Input Change ────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (isNaN(value) || isLoading) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto move to next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✅ Auto submit jab 6th digit enter ho
    if (index === 5 && value) {
      const fullOtp = [...newOtp];
      if (fullOtp.every(d => d !== '')) {
        setTimeout(() => {
          onVerify(fullOtp.join(''));
        }, 100);
      }
    }
  };

  // ── Backspace ───────────────────────────────────────────────
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Paste ───────────────────────────────────────────────────
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      setError('');
      // ✅ Auto submit on paste
      setTimeout(() => onVerify(pasted), 100);
    }
  };

  // ── Resend ──────────────────────────────────────────────────
  const handleResend = async () => {
    if (timeLeft > 0 || resending || isLoading) return;

    setResending(true);
    try {
      await onResend(); // ✅ Actually call karo parent ka onResend
      setTimeLeft(59);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLoading) return;

    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      triggerShake();
      return;
    }

    // ✅ Real API call - parent handle karega
    onVerify(otpCode);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <div
      className="fade-in-el"
      style={{ width: '100%' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {/* WhatsApp Icon */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          justifyContent: 'center',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(37,211,102,0.12)',
          border: '2px solid rgba(37,211,102,0.3)',
          marginBottom: '16px',
        }}>
          <svg viewBox="0 0 448 512" width="26" height="26" fill="#25D366">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.9c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.5-29.6-28.2-64.1-28.2-99.1 0-101.9 83-184.8 184.9-184.8 49.3 0 95.8 19.3 130.7 54.2 34.9 34.9 54.1 81.3 54.1 130.9 0 101.9-82.9 184.8-185.1 184.8zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </div>

        <h3 style={{
          fontSize: '20px', fontWeight: '700',
          color: '#fff', marginBottom: '8px',
        }}>
          Enter Verification Code
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: '1.5',
        }}>
          6-digit OTP sent via WhatsApp to{' '}
          <strong style={{ color: '#fff' }}>{phoneNumber}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* OTP Boxes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            margin: '4px 0',
            // ✅ Shake animation inline
            animation: shake ? 'shake 0.4s ease' : 'none',
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              style={{
                width: '100%',
                maxWidth: '52px',
                height: '56px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: '700',
                background: digit
                  ? 'rgba(0,82,255,0.12)'
                  : 'rgba(0,0,0,0.25)',
                border: '1.5px solid',
                borderColor: error
                  ? 'rgba(239,68,68,0.6)'
                  : digit
                    ? 'rgba(0,82,255,0.5)'
                    : 'rgba(255,255,255,0.1)',
                borderRadius: '14px',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s',
                cursor: isLoading ? 'not-allowed' : 'text',
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary, #0052ff)';
                e.target.style.boxShadow = '0 0 12px rgba(0,82,255,0.3)';
              }}
              onBlur={e => {
                e.target.style.borderColor = error
                  ? 'rgba(239,68,68,0.6)'
                  : digit
                    ? 'rgba(0,82,255,0.5)'
                    : 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px', padding: '12px 14px',
            color: '#fca5a5', fontSize: '13px',
            display: 'flex', alignItems: 'flex-start',
            gap: '10px', lineHeight: '1.4',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isComplete}
          className="btn btn-primary"
          style={{
            opacity: isLoading || !isComplete ? 0.6 : 1,
            cursor: isLoading || !isComplete ? 'not-allowed' : 'pointer',
          }}
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
                Verifying...
              </span>
            : <span style={{
                display: 'flex', alignItems: 'center',
                gap: '8px', justifyContent: 'center',
              }}>
                Verify OTP <Send size={15} />
              </span>
          }
        </button>

        {/* Resend + Change Number */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '13px',
        }}>
          {/* Resend */}
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || resending || isLoading}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: timeLeft > 0 || resending || isLoading
                ? 'rgba(255,255,255,0.25)'
                : '#0052ff',
              cursor: timeLeft > 0 || resending || isLoading
                ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              gap: '6px', fontSize: '13px', fontWeight: '500',
            }}
          >
            <RotateCcw size={13} />
            {resending
              ? 'Sending...'
              : timeLeft > 0
                ? `Resend in 00:${timeLeft.toString().padStart(2, '0')}`
                : 'Resend OTP'
            }
          </button>

          {/* Change Number */}
          <button
            type="button"
            onClick={onChangeNumber}
            disabled={isLoading}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: 'rgba(255,255,255,0.4)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              gap: '6px', fontSize: '13px', fontWeight: '500',
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <ArrowLeft size={13} /> Change number
          </button>
        </div>
      </form>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}