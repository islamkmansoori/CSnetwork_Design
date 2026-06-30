import React, { useState } from 'react';
import {
  User, Building2, Globe, Languages,
  Shield, Check, Info, ArrowRight,
  Phone, MapPin, Briefcase, Mail,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────
const sectors = [
  'Franchise Development',
  'Technology & Software',
  'Real Estate & Construction',
  'Finance & Investment',
  'Healthcare & Pharmaceuticals',
  'Retail & Consumer Goods',
  'Energy & Resources',
  'Logistics & Supply Chain',
  'Professional Services',
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
  'Latin America',
];

const businessAgeOptions = [
  { value: 'LESS_THAN_ONE_YEAR',    label: 'Less than 1 year' },
  { value: 'ONE_TO_THREE_YEARS',    label: '1 – 3 years' },
  { value: 'THREE_TO_FIVE_YEARS',   label: '3 – 5 years' },
  { value: 'MORE_THAN_FIVE_YEARS',  label: 'More than 5 years' },
];

const positionOptions = [
  { value: 'FREELANCER',     label: 'Freelancer' },
  { value: 'EMPLOYEE',       label: 'Employee' },
  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
  { value: 'MANAGER',        label: 'Manager' },
  { value: 'DIRECTOR',       label: 'Director' },
  { value: 'C_LEVEL',        label: 'C-Level Executive' },
];

const contactMethodOptions = [
  { value: 'WHATSAPP', label: '💬 WhatsApp', },
  { value: 'EMAIL',    label: '📧 Email', },
  { value: 'PHONE',    label: '📞 Phone Call', },
];

const roleMetadata = {
  BUYER: {
    title: 'Buyer',
    desc: 'Sourcing deals, products, or looking to invest capital.',
    color: 'rgba(0,229,255,0.15)',
    border: '#00E5FF',
  },
  SELLER: {
    title: 'Seller',
    desc: 'Offering products, services, licenses, or assets.',
    color: 'rgba(245,158,11,0.15)',
    border: '#F59E0B',
  },
  CONNECTOR: {
    title: 'Connector',
    desc: 'Connecting buyers and sellers to broker transactions.',
    color: 'rgba(16,185,129,0.15)',
    border: '#10B981',
  },
  FRENCHISE_OPERATOR: {
    title: 'Franchise Operator',
    desc: 'Orchestrating regional franchise groups and networks.',
    color: 'rgba(0,82,255,0.15)',
    border: '#0052FF',
  },
};

// ─── Component ────────────────────────────────────────────────
export default function UserProfileCompletion({ initialName, onSubmit, isLoading }) {
  const [name,              setName]              = useState(initialName || '');
  const [company,           setCompany]           = useState('');
  const [sector,            setSector]            = useState('');
  const [country,           setCountry]           = useState('');
  const [state,             setState]             = useState('');
  const [city,              setCity]              = useState('');
  const [selectedRoles,     setSelectedRoles]     = useState([]);
  const [language,          setLanguage]          = useState('English');
  const [altPhone,          setAltPhone]          = useState('');
  const [contactMethod,     setContactMethod]     = useState('WHATSAPP');
  const [businessAge,       setBusinessAge]       = useState('');
  const [position,          setPosition]          = useState('');
  const [error,             setError]             = useState('');

  // ── Role Toggle ─────────────────────────────────────────────
  const toggleRole = (roleKey) => {
    setError('');
    setSelectedRoles(prev =>
      prev.includes(roleKey)
        ? prev.filter(r => r !== roleKey)
        : [...prev, roleKey]
    );
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim())              return setError('Please enter your full name.');
    if (selectedRoles.length === 0) return setError('Please select at least one role.');
    if (!company.trim())           return setError('Please enter your company name.');
    if (!sector)                   return setError('Please select your business sector.');
    if (!country)                  return setError('Please select your country.');
    if (!state.trim())             return setError('Please enter your state.');
    if (!city.trim())              return setError('Please enter your city.');
    if (!businessAge)              return setError('Please select your business age.');
    if (!position)                 return setError('Please select your position.');

    setError('');

    // ✅ Exact backend payload
    onSubmit({
      memberRequestType:      'SUBMIT_PERSONAL_FORM',
      alternatePhoneNumber:   altPhone || null,
      preferredContactMethod: contactMethod,
      companyName:            company,
      businessAge:            businessAge,
      position:               position,
      country:                country,
      state:                  state,
      city:                   city,
      languagePreference:     language,
      roles:                  selectedRoles,
    });
  };

  // ── Input Style ─────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="fade-in-el" style={{ width: '100%' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
          Complete Operator Profile
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          Provide details to finalize your CS Network membership.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Full Name ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={13} /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="e.g. John Doe"
            style={inputStyle}
            className="form-input"
          />
        </div>

        {/* ── Roles ───────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>
            Deal Participation Role(s)
          </label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
            Select all that apply to your participation model.
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '10px',
          }}>
            {Object.entries(roleMetadata).map(([key, role]) => {
              const isSelected = selectedRoles.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleRole(key)}
                  style={{
                    background: isSelected ? role.color : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? role.border : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {role.title}
                    </span>
                    {isSelected && (
                      <span style={{
                        background: role.border, borderRadius: '50%',
                        width: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', flexShrink: 0,
                      }}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.3' }}>
                    {role.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Company ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={13} /> Company / Organization
          </label>
          <input
            type="text"
            value={company}
            onChange={e => { setCompany(e.target.value); setError(''); }}
            placeholder="e.g. Global Trade Corp"
            style={inputStyle}
            className="form-input"
          />
        </div>

        {/* ── Position + Business Age ──────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={13} /> Position
            </label>
            <select
              value={position}
              onChange={e => { setPosition(e.target.value); setError(''); }}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              className="form-input"
            >
              <option value="" disabled>Select position...</option>
              {positionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={13} /> Business Age
            </label>
            <select
              value={businessAge}
              onChange={e => { setBusinessAge(e.target.value); setError(''); }}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              className="form-input"
            >
              <option value="" disabled>Select age...</option>
              {businessAgeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Country + Sector ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} /> Country
            </label>
            <select
              value={country}
              onChange={e => { setCountry(e.target.value); setError(''); }}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              className="form-input"
            >
              <option value="" disabled>Select country...</option>
              {geographies.map(geo => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} /> Business Sector
            </label>
            <select
              value={sector}
              onChange={e => { setSector(e.target.value); setError(''); }}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              className="form-input"
            >
              <option value="" disabled>Select sector...</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── State + City ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} /> State / Province
            </label>
            <input
              type="text"
              value={state}
              onChange={e => { setState(e.target.value); setError(''); }}
              placeholder="e.g. Dubai"
              style={inputStyle}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} /> City
            </label>
            <input
              type="text"
              value={city}
              onChange={e => { setCity(e.target.value); setError(''); }}
              placeholder="e.g. Dubai"
              style={inputStyle}
              className="form-input"
            />
          </div>
        </div>

        {/* ── Alternate Phone ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={13} /> Alternate Phone{' '}
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>(optional)</span>
          </label>
          <input
            type="tel"
            value={altPhone}
            onChange={e => setAltPhone(e.target.value)}
            placeholder="+919876543210"
            style={inputStyle}
            className="form-input"
          />
        </div>

        {/* ── Preferred Contact Method ─────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>
            Preferred Contact Method
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {contactMethodOptions.map(opt => {
              const isActive = contactMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setContactMethod(opt.value)}
                  style={{
                    flex: 1,
                    background: isActive ? 'rgba(0,82,255,0.12)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? '#0052ff' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    padding: '10px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Language ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Languages size={13} /> Language Preference
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { lang: 'English', flag: '🇬🇧', label: 'English (EN)' },
              { lang: 'Spanish', flag: '🇪🇸', label: 'Spanish (ES)' },
            ].map(({ lang, flag, label }) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  style={{
                    flex: 1,
                    background: isActive ? 'rgba(0,82,255,0.12)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? '#0052ff' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{flag}</span> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px', padding: '12px 14px',
            color: '#fca5a5', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Submit ──────────────────────────────────────── */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{
            marginTop: '8px',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading
            ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Saving Profile...
              </span>
            : <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                Save & Continue <ArrowRight size={15} />
              </span>
          }
        </button>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .form-input:focus {
          border-color: rgba(0, 82, 255, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(0, 82, 255, 0.1);
        }
        option { background: #1a1a2e; color: #fff; }
      `}</style>
    </div>
  );
}