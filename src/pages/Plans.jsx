import React from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidBackground from '../components/LiquidBackground';
import CSLogo from '../components/CSLogo';
import SubscriptionPlans from '../components/SubscriptionPlans';

export default function Plans() {
  const navigate = useNavigate();

  const handlePlanSubmit = (plan) => {
    // Save selected plan
    sessionStorage.setItem('selected_plan', JSON.stringify(plan));

    if (plan.isTrial) {
      // Free trial → skip payment → go dashboard
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/checkout', { replace: true });
    }
  };

  return (
    <LiquidBackground>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '40px 20px',
        width: '100%', zIndex: 2, boxSizing: 'border-box',
      }}>
        <div className="glass-panel slide-up-el" style={{
          width: '100%', maxWidth: '600px',
          padding: '44px 36px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', boxSizing: 'border-box',
          marginBottom: '24px',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '28px', textAlign: 'center', width: '100%' }}>
            <CSLogo size="medium" />
          </div>

          {/* Step Indicator */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '8px', marginBottom: '28px', width: '100%',
            justifyContent: 'center',
          }}>
            {['Profile', 'Plan', 'Payment', 'Dashboard'].map((label, i) => (
              <React.Fragment key={label}>
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '4px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i === 1
                      ? 'linear-gradient(135deg, #0052ff, #00e5ff)'
                      : i < 1
                        ? 'rgba(16,185,129,0.3)'
                        : 'rgba(255,255,255,0.08)',
                    border: i === 1
                      ? '2px solid #0052ff'
                      : i < 1
                        ? '2px solid #10b981'
                        : '2px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700',
                    color: i <= 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}>
                    {i < 1 ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    color: i <= 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontWeight: i === 1 ? '600' : '400',
                  }}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{
                    flex: 1, height: '1px',
                    background: i < 1
                      ? 'rgba(16,185,129,0.3)'
                      : 'rgba(255,255,255,0.08)',
                    marginBottom: '16px',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <SubscriptionPlans onSubmit={handlePlanSubmit} />
        </div>
      </div>
    </LiquidBackground>
  );
}