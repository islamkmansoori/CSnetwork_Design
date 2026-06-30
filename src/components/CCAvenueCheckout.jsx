import React, { useState } from 'react';
import { CreditCard, Shield, Landmark, Smartphone, Wallet, ArrowRight, Loader2, Sparkles, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

const banks = [
  'Emirates NBD',
  'HSBC Bank',
  'Standard Chartered',
  'CitiBank',
  'ICICI Bank',
  'Saudi National Bank',
  'Barclays Bank'
];

export default function CCAvenueCheckout({ plan, onSuccess, onCancel }) {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'netbanking', 'upi', 'wallet'
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // 'input', 'verifying', 'success'
  
  // Card Fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Extra Fields
  const [selectedBank, setSelectedBank] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('paypal');
  
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const basePrice = plan.price;
  const isTrial = plan.isTrial;
  const tax = isTrial ? 0 : Number((basePrice * 0.05).toFixed(2));
  const processingFee = isTrial ? 0 : 0.25;
  const totalAmount = isTrial ? 0 : Number((basePrice + tax + processingFee).toFixed(2));
  const orderId = `CSN-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < input.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += input[i];
    }
    setCardNumber(formatted);
    setError('');
  };

  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (input.length > 0) {
      formatted += input.slice(0, 2);
      if (input.length > 2) {
        formatted += '/' + input.slice(2, 4);
      }
    }
    setCardExpiry(formatted);
    setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (processing) return;

    if (activeTab === 'card') {
      if (!cardName.trim()) { setError('Cardholder name is required'); triggerShake(); return; }
      if (cardNumber.replace(/\s/g, '').length < 16) { setError('Enter a valid 16-digit card number'); triggerShake(); return; }
      if (cardExpiry.length < 5) { setError('Enter expiration date (MM/YY)'); triggerShake(); return; }
      if (cardCvv.length < 3) { setError('Enter 3-digit CVV code'); triggerShake(); return; }
    } else if (activeTab === 'netbanking') {
      if (!selectedBank) { setError('Select your Net Banking partner'); triggerShake(); return; }
    } else if (activeTab === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) { setError('Enter a valid UPI ID (e.g., name@okaxis)'); triggerShake(); return; }
    }

    setError('');
    setProcessing(true);
    setPaymentStep('verifying');

    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onSuccess({
          transactionId: `CCA-${Math.floor(10000000 + Math.random() * 90000000)}`,
          totalAmount,
          planName: plan.name,
          isTrial
        });
      }, 1500);
    }, 2500);
  };

  // Styled flat input field to mimic official CCAvenue style instead of glassmorphism
  const flatInputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: '#ffffff',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    color: '#2d3748',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#f4f5f7',
      color: '#2d3748',
      zIndex: 9999,
      overflowY: 'auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left'
    }}>
      
      {/* Official CCAvenue Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '2px solid #e2e8f0',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={16} /> Cancel & Return
          </button>
          
          <div style={{ height: '24px', width: '1px', background: '#cbd5e0' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#b71c1c', letterSpacing: '0.5px' }}>
              CCAvenue
            </span>
            <span style={{ fontSize: '9px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', marginTop: '-2px' }}>
              Payment Gateway
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4a5568', fontWeight: '500' }}>
          <Shield size={16} color="#38a169" /> Secure 128-bit SSL Connection
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flexGrow: 1,
        maxWidth: '1000px',
        width: '100%',
        margin: '30px auto',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        {processing ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            padding: '80px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {paymentStep === 'verifying' ? (
              <>
                <Loader2 size={48} color="#b71c1c" style={{ animation: 'spin-slow 1s linear infinite' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
                  Processing Your Transaction
                </h3>
                <p style={{ color: '#718096', fontSize: '13px', maxWidth: '360px', margin: '0 auto', lineHeight: '1.5' }}>
                  Connecting securely to CCAvenue authorization core. Do not close, reload, or press back on your browser.
                </p>
              </>
            ) : (
              <>
                <div style={{
                  background: '#c6f6d5',
                  color: '#22543d',
                  borderRadius: '50%',
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#22543d' }}>
                  Payment Captured Successfully
                </h3>
                <p style={{ color: '#718096', fontSize: '13px' }}>
                  Redirecting you back to CS Network.
                </p>
              </>
            )}
          </div>
        ) : (
          /* Main Form Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1.2fr',
            gap: '24px'
          }} className="ccavenue-grid">
            
            {/* Left Box: Payment Details */}
            <div style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* Payment Tabs selector */}
              <div style={{
                display: 'flex',
                background: '#f7fafc',
                borderBottom: '1px solid #e2e8f0'
              }}>
                {['card', 'netbanking', 'upi', 'wallet'].map((tab) => {
                  const labelMap = { card: '💳 Cards', netbanking: '🏛️ Bank', upi: '📱 UPI / QR', wallet: '💼 Wallets' };
                  const isSelected = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => { setActiveTab(tab); setError(''); }}
                      style={{
                        flex: 1,
                        background: isSelected ? '#ffffff' : 'transparent',
                        border: 'none',
                        borderBottom: isSelected ? '3px solid #b71c1c' : 'none',
                        color: isSelected ? '#b71c1c' : '#4a5568',
                        fontWeight: '700',
                        padding: '16px 12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        outline: 'none',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Form container */}
              <form onSubmit={handlePayment} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* CREDIT CARD */}
                {activeTab === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Card details
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ fontSize: '9px', background: '#edf2f7', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>VISA</span>
                        <span style={{ fontSize: '9px', background: '#edf2f7', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>MASTERCARD</span>
                        <span style={{ fontSize: '9px', background: '#edf2f7', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>AMEX</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => { setCardName(e.target.value); setError(''); }}
                        placeholder="Name as printed on card"
                        style={flatInputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Card Number</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          style={{ ...flatInputStyle, paddingRight: '40px' }}
                        />
                        <CreditCard size={16} color="#a0aec0" style={{ position: 'absolute', right: '12px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Expiration Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          style={{ ...flatInputStyle, textAlign: 'center' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>CVV Code</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                          placeholder="123"
                          maxLength={4}
                          style={{ ...flatInputStyle, textAlign: 'center' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NET BANKING */}
                {activeTab === 'netbanking' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Choose Banking Partner</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => { setSelectedBank(e.target.value); setError(''); }}
                      style={{ ...flatInputStyle, cursor: 'pointer', background: '#fff' }}
                    >
                      <option value="">Select Bank...</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: '11px', color: '#718096', lineHeight: '1.4' }}>
                      You will be securely redirected to authorize credentials on your selected bank interface.
                    </span>
                  </div>
                )}

                {/* UPI / QR */}
                {activeTab === 'upi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setError(''); }}
                        placeholder="operator@upi"
                        style={flatInputStyle}
                      />
                    </div>
                    
                    <div style={{
                      border: '1px dashed #cbd5e0',
                      borderRadius: '6px',
                      padding: '16px',
                      textAlign: 'center',
                      background: '#f7fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '90px',
                        height: '90px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                          backgroundSize: '12px 12px',
                          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                          opacity: 0.6
                        }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#718096' }}>
                        Or scan code from your BHIM or banking app to pay
                      </span>
                    </div>
                  </div>
                )}

                {/* WALLETS */}
                {activeTab === 'wallet' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>International Wallet Partner</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedWallet('paypal')}
                        style={{
                          flex: 1,
                          background: selectedWallet === 'paypal' ? '#ebf8ff' : '#fff',
                          border: '2px solid',
                          borderColor: selectedWallet === 'paypal' ? '#3182ce' : '#cbd5e0',
                          borderRadius: '6px',
                          padding: '12px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: selectedWallet === 'paypal' ? '#2b6cb0' : '#4a5568',
                          transition: 'all 0.2s'
                        }}
                      >
                        PayPal Express
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedWallet('apple')}
                        style={{
                          flex: 1,
                          background: selectedWallet === 'apple' ? '#f7fafc' : '#fff',
                          border: '2px solid',
                          borderColor: selectedWallet === 'apple' ? '#1a202c' : '#cbd5e0',
                          borderRadius: '6px',
                          padding: '12px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: selectedWallet === 'apple' ? '#1a202c' : '#4a5568',
                          transition: 'all 0.2s'
                        }}
                      >
                        Apple Pay
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation errors */}
                {error && (
                  <div style={{
                    background: '#fff5f5',
                    border: '1px solid #feb2b2',
                    color: '#c53030',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Sandbox Info */}
                <div style={{
                  background: '#feebc8',
                  border: '1px solid #fbd38d',
                  color: '#c05621',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>
                  🛡️ <strong>Sandbox Mode active</strong>. Card details will be validated locally but not charged. Any mock numbers (e.g. Test Visa card 4111) can be used.
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    background: '#d32f2f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#b71c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#d32f2f'}
                >
                  {isTrial ? 'Confirm Free Trial Registration' : `Pay Securely $${totalAmount.toFixed(2)} USD`} <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Right Box: Order Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Order invoice block */}
              <div style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                padding: '24px',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                  Order Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Merchant Name:</span>
                    <strong style={{ color: '#2d3748' }}>CS Network Global</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Order ID Reference:</span>
                    <strong style={{ color: '#2d3748', fontFamily: 'monospace' }}>{orderId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Network Tier:</span>
                    <strong style={{ color: '#2d3748' }}>{plan.name}</strong>
                  </div>
                  
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Base Surcharge:</span>
                    <strong style={{ color: '#2d3748' }}>${basePrice.toFixed(2)} USD</strong>
                  </div>
                  
                  {!isTrial && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>Taxes (VAT 5%):</span>
                        <strong style={{ color: '#2d3748' }}>${tax.toFixed(2)} USD</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>CCAvenue Gateway Surcharge:</span>
                        <strong style={{ color: '#2d3748' }}>${processingFee.toFixed(2)} USD</strong>
                      </div>
                    </>
                  )}

                  <div style={{ height: '1px', background: '#cbd5e0', margin: '8px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800' }}>
                    <span style={{ color: '#1a202c' }}>Total Settle:</span>
                    <span style={{ color: '#b71c1c' }}>${totalAmount.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Security indicators block */}
              <div style={{
                background: '#ebf8ff',
                border: '1px solid #bee3f8',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <ShieldAlert size={20} color="#2b6cb0" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#2c5282', display: 'block', marginBottom: '4px' }}>
                    Authorized Gateway Protection
                  </strong>
                  <p style={{ fontSize: '11px', color: '#2b6cb0', lineHeight: '1.4' }}>
                    This transaction is processed securely through CCAvenue Payment Infrastructure using 3D-Secure authentication protocols and PCI-DSS compliance checks.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Corporate footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#718096',
        marginTop: 'auto'
      }}>
        © {new Date().getFullYear()} CCAvenue Payment Processing Services. All rights reserved. PCI-DSS Certified.
      </footer>

    </div>
  );
}
export { banks };