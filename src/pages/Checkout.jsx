import React from 'react';
import { useNavigate } from 'react-router-dom';
import CCAvenueCheckout from '../components/CCAvenueCheckout';

export default function Checkout() {
  const navigate = useNavigate();

  // Get selected plan from sessionStorage
  const raw  = sessionStorage.getItem('selected_plan');
  const plan = raw ? JSON.parse(raw) : {
    id:    'enterprise',
    name:  'Enterprise Pro',
    price: 10,
    isTrial: false,
  };

  const handleSuccess = (paymentData) => {
    console.log('✅ Payment success:', paymentData);
    sessionStorage.removeItem('selected_plan');
    // Go to dashboard
    navigate('/dashboard', { replace: true });
  };

  const handleCancel = () => {
    navigate('/plans', { replace: true });
  };

  return (
    <CCAvenueCheckout
      plan={plan}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}