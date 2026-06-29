import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Mail, Users, Zap, Award } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Networker',
    price: 2,
    billing: 'billed monthly',
    icon: Users,
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
    features: [
      'Connect requests: 15 / month',
      'Direct messages: 5 / month',
      '1st-degree franchise reach',
      'Basic deal listing search'
    ],
    stats: {
      connects: 15,
      messages: 5,
      reach: 30,
      conversion: 20
    }
  },
  {
    id: 'growth',
    name: 'Growth Connector',
    price: 5,
    billing: 'billed monthly',
    icon: Zap,
    color: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.2)',
    features: [
      'Connect requests: Unlimited',
      'Direct messages: 30 / month',
      '10 direct broker introductions/mo',
      '2nd-degree franchise network search',
      'Standard deal governance filters'
    ],
    stats: {
      connects: 100, // Unlimited
      messages: 60,
      reach: 75,
      conversion: 55
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pro',
    price: 10,
    billing: 'billed monthly',
    icon: Award,
    color: '#0052FF',
    glow: 'rgba(0, 82, 255, 0.25)',
    isRecommended: true,
    features: [
      'Connect requests: Unlimited',
      'Direct messages: Unlimited',
      'Full auto-monetized introductions',
      'Global network deal matchmaking',
      'Priority deal governance & support',
      'Dedicated franchise manager'
    ],
    stats: {
      connects: 100, // Unlimited
      messages: 100, // Unlimited
      reach: 100,
      conversion: 90
    }
  }
];

export default function SubscriptionPlans({ onSubmit }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[2]); // Default to Enterprise Pro
  const [isTrialSelected, setIsTrialSelected] = useState(false);

  const handleProceed = () => {
    // If trial is selected, we pass the plan details with price 0 and isTrial = true
    if (isTrialSelected) {
      onSubmit({
        id: 'enterprise_trial',
        name: 'Enterprise Pro (30-Day Free Trial)',
        price: 0,
        isTrial: true,
        originalPlan: plans[2]
      });
    } else {
      onSubmit({
        id: selectedPlan.id,
        name: selectedPlan.name,
        price: selectedPlan.price,
        isTrial: false
      });
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsTrialSelected(false);
  };

  const handleTrialSelect = () => {
    setIsTrialSelected(true);
  };

  const currentStats = isTrialSelected ? plans[2].stats : selectedPlan.stats;
  const currentColor = isTrialSelected ? plans[2].color : selectedPlan.color;

  return (
    <div className="fade-in-el" style={{ width: '100%' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
          Choose Your Deal Network Plan
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Unlock premium deal matching, direct communication, and secure governance.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        width: '100%'
      }}>
        {plans.map((plan) => {
          const isSelected = !isTrialSelected && selectedPlan.id === plan.id;
          const PlanIcon = plan.icon;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => handlePlanSelect(plan)}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: isSelected ? plan.glow : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '2px solid' : '1px solid',
                borderColor: isSelected ? plan.color : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? `0 8px 24px ${plan.glow}` : 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.25s ease',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {plan.isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '24px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '0 0 6px 6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Recommended
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexGrow: 1 }}>
                <div style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: isSelected ? plan.color : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? plan.color : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}>
                  <PlanIcon size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {plan.name}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginTop: '3px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {plan.features.length} Premium Features
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Tag */}
              <div style={{ textAlign: 'right', minWidth: '70px' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                  ${plan.price}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/mo</span>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {plan.billing}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* LinkedIn-Style 30-Day Free Trial Banner */}
      <button
        type="button"
        onClick={handleTrialSelect}
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          background: isTrialSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.02)',
          border: '1.5px dashed',
          borderColor: isTrialSelected ? 'var(--accent-green)' : 'rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          transition: 'all 0.25s ease',
          outline: 'none',
          marginBottom: '24px'
        }}
      >
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '50%',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-green)',
        }}>
          <Zap size={20} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Enterprise Pro Trial <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 6px', fontSize: '9px' }}>Free</span>
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
            Start 30-Day Free Trial. Zero cost today. Gain full Enterprise Pro access and cancel anytime with no charges.
          </p>
        </div>
      </button>

      {/* Infographics Section - Changes Dynamically based on Selection */}
      <div className="glass-panel" style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '18px',
        padding: '20px',
        marginBottom: '28px',
        textAlign: 'left'
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📊 Networking Capacity Infographic ({isTrialSelected ? 'Trial' : selectedPlan.name})
        </h4>

        {/* Feature 1: Monthly Connections */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Monthly Connect Requests</span>
            <strong style={{ color: currentColor }}>
              {isTrialSelected || selectedPlan.id !== 'basic' ? 'Unlimited Capacity' : '15 requests'}
            </strong>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${currentStats.connects}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentColor}, #0077FF)`,
              borderRadius: '4px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Feature 2: InMail Direct Messages */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Direct Messages (InMail)</span>
            <strong style={{ color: currentColor }}>
              {isTrialSelected || selectedPlan.id === 'enterprise' ? 'Unlimited Messaging' : `${selectedPlan.stats.messages} / mo`}
            </strong>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${currentStats.messages}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentColor}, #0077FF)`,
              borderRadius: '4px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Feature 3: Global Franchise Reach */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Franchise Reach Scope</span>
            <strong style={{ color: currentColor }}>
              {currentStats.reach}% of Global Network
            </strong>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${currentStats.reach}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentColor}, #0077FF)`,
              borderRadius: '4px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Feature 4: Estimated Deal Match Rate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Estimated Deal Match Efficiency</span>
            <strong style={{ color: currentColor }}>
              {currentStats.conversion}% Match Speed
            </strong>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${currentStats.conversion}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentColor}, #0077FF)`,
              borderRadius: '4px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleProceed}
        className="btn btn-primary"
      >
        {isTrialSelected ? 'Activate 30-Day Free Trial' : 'Proceed to Checkout'} <ArrowRight size={16} />
      </button>

      {/* Safety Shield */}
      <div style={{
        marginTop: '16px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
        Secure payments processed internationally under CS Network policies.
      </div>

    </div>
  );
}
