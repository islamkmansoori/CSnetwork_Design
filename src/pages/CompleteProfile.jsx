import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidBackground from '../components/LiquidBackground';
import CSLogo from '../components/CSLogo';
import UserProfileCompletion from '../components/UserProfileCompletion';

const BASE_URL = 'https://4ecc-2401-4900-8822-3223-7452-2a92-525f-6d6.ngrok-free.app';
const MEMBER_URL = `${BASE_URL}/member`;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const raw = localStorage.getItem('cs_userData');
  const userData = raw ? JSON.parse(raw) : {};

  useEffect(() => {
    if (userData.isFormFill === true) {
      navigate('/plans', { replace: true });
    }
  }, []);

  const handleProfileSubmit = async (profileData) => {
    setIsLoading(true);
    setApiError('');

    try {
      const accessToken = localStorage.getItem('cs_accessToken');

      console.log('📤 Sending payload:', JSON.stringify(profileData, null, 2));
      console.log('🔑 Access Token:', accessToken);

      if (!accessToken) {
        throw new Error('Access token missing. Please login again.');
      }

      const res = await fetch(MEMBER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json().catch(() => ({}));

      console.log('📥 Response status:', res.status);
      console.log('📥 Response body:', data);

      if (!res.ok) {
        throw new Error(data.message || data.error || `Error ${res.status}`);
      }

      const updatedUser = {
        ...userData,
        company: profileData.companyName,
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        roles: profileData.roles,
        position: profileData.position,
        isFormFill: true,
      };

      localStorage.setItem('cs_userData', JSON.stringify(updatedUser));

      navigate('/plans', { replace: true });
    } catch (err) {
      console.error('❌ Profile submit error:', err);
      setApiError(err.message || 'Failed to save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LiquidBackground>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        width: '100%',
        zIndex: 2,
        boxSizing: 'border-box',
      }}>
        <div className="glass-panel slide-up-el" style={{
          width: '100%',
          maxWidth: '600px',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          marginBottom: '24px',
        }}>
          <div style={{ marginBottom: '28px', textAlign: 'center', width: '100%' }}>
            <CSLogo size="medium" />
          </div>

          {apiError && (
            <div style={{
              width: '100%',
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#fca5a5',
            }}>
              ⚠️ {apiError}
            </div>
          )}

          <UserProfileCompletion
            initialName={userData.fullName || ''}
            onSubmit={handleProfileSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </LiquidBackground>
  );
}