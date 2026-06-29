import React, { useState } from 'react';
import { User, Building2, Globe, Languages, Shield, Check, Info, ArrowRight } from 'lucide-react';

const sectors = [
  'Franchise Development',
  'Technology & Software',
  'Real Estate & Construction',
  'Finance & Investment',
  'Healthcare & Pharmaceuticals',
  'Retail & Consumer Goods',
  'Energy & Resources',
  'Logistics & Supply Chain',
  'Professional Services'
];

const geographies = [
  'United Arab Emirates',
  'Saudi Arabia',
  'India',
  'United States',
  'United Kingdom',
  'Singapore',
  'Australia',
  'Canada',
  'European Union',
  'Latin America'
];

const roleMetadata = {
  buyer: {
    title: 'Buyer',
    desc: 'Sourcing deals, products, or looking to invest capital.',
    color: 'rgba(0, 229, 255, 0.15)',
    border: '#00E5FF'
  },
  seller: {
    title: 'Seller',
    desc: 'Offering products, services, licenses, or assets.',
    color: 'rgba(245, 158, 11, 0.15)',
    border: '#F59E0B'
  },
  connector: {
    title: 'Connector',
    desc: 'Connecting buyers and sellers to broker transactions.',
    color: 'rgba(16, 185, 129, 0.15)',
    border: '#10B981'
  },
  franchise_operator: {
    title: 'Franchise Operator',
    desc: 'Orchestrating regional franchise groups and networks.',
    color: 'rgba(0, 82, 255, 0.15)',
    border: '#0052FF'
  }
};

export default function UserProfileCompletion({ initialName, onSubmit }) {
  const [name, setName] = useState(initialName || '');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [geography, setGeography] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');

  const toggleRole = (roleKey) => {
    setError('');
    if (selectedRoles.includes(roleKey)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleKey));
    } else {
      setSelectedRoles([...selectedRoles, roleKey]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name.');
    if (selectedRoles.length === 0) return setError('Please select at least one role to define your deal participation model.');
    if (!company.trim()) return setError('Please enter your company or organization name.');
    if (!sector) return setError('Please select your business sector.');
    if (!geography) return setError('Please select your primary geography.');

    setError('');
    onSubmit({
      name,
      company,
      sector,
      geography,
      roles: selectedRoles,
      language
    });
  };

  return (
    <div className="fade-in-el" style={{ width: '100%' }}>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
          Complete Operator Profile
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Provide details to finalize your membership in the CS Network Operators Group.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} /> Full Name
            </span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="e.g. John Doe"
            className="form-input"
            required
            autoComplete="name"
          />
        </div>

        {/* Multi-Role Selection */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: '4px' }}>
            Multi-Role deal participation
          </label>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Why: Enables flexible participation models across different deals. Select all that apply.
          </span>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {Object.entries(roleMetadata).map(([key, role]) => {
              const isSelected = selectedRoles.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleRole(key)}
                  style={{
                    background: isSelected ? role.color : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isSelected ? role.border : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    width: '100%',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                      {role.title}
                    </span>
                    {isSelected && (
                      <span style={{
                        background: role.border,
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000'
                      }}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                    {role.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Name */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} /> Company / Organization
            </span>
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => { setCompany(e.target.value); setError(''); }}
            placeholder="e.g. Global Trade Corp"
            className="form-input"
            required
          />
        </div>

        {/* Two column layout for Sector and Geography */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%'
        }}>
          
          {/* Sector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={13} /> Business Sector
              </span>
            </label>
            <select
              value={sector}
              onChange={(e) => { setSector(e.target.value); setError(''); }}
              className="form-input"
              style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              required
            >
              <option value="" disabled>Select sector...</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Geography */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={13} /> Geography
              </span>
            </label>
            <select
              value={geography}
              onChange={(e) => { setGeography(e.target.value); setError(''); }}
              className="form-input"
              style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              required
            >
              <option value="" disabled>Select country/region...</option>
              {geographies.map(geo => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Language Preference */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Languages size={13} /> Language Preferences
            </span>
          </label>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Why: Supports seamless cross-border deal interactions from launch.
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['English', 'Spanish'].map(lang => {
              const isActive = language === lang;
              const flag = lang === 'English' ? '🇬🇧' : '🇪🇸';
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  style={{
                    flex: 1,
                    background: isActive ? 'rgba(0, 82, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{flag}</span>
                  {lang === 'English' ? 'English (EN)' : 'Spanish (ES)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="form-error-msg" style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
          Save & Activate Account <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
