import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, User, Mail, Phone, Hash,
  CheckCircle2, Building2, Globe,
  Bell, Settings, ChevronRight,
  TrendingUp, Users, DollarSign, Star,
} from 'lucide-react';
import LiquidBackground from '../components/LiquidBackground';
import CSLogo from '../components/CSLogo';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userId:   '',
    fullName: '',
    email:    '',
    phone:    '',
  });

  // ── Load User Data ──────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cs_userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserData(parsed);
      }
    } catch (e) {
      console.error('userData parse error:', e);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = () => {
    [
      'cs_isLoggedIn', 'cs_userId', 'cs_userData',
      'cs_accessToken', 'cs_refreshToken',
    ].forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  const displayName = userData.fullName || 'Franchise Operator';
  const avatar      = displayName[0].toUpperCase();

  // ── Stats Cards data ─────────────────────────────────────────
  const stats = [
    { icon: <Users size={20} />,      label: 'Network Members', value: '—',    color: '#0052ff' },
    { icon: <TrendingUp size={20} />, label: 'Growth Rate',     value: '—',    color: '#10b981' },
    { icon: <DollarSign size={20} />, label: 'Revenue',         value: '—',    color: '#f59e0b' },
    { icon: <Star size={20} />,       label: 'Rank',            value: '—',    color: '#8b5cf6' },
  ];

  // ── Quick Links ──────────────────────────────────────────────
  const quickLinks = [
    { label: 'My Network',        icon: <Users size={16} />,    href: '#' },
    { label: 'Earnings & Payouts',icon: <DollarSign size={16}/>,href: '#' },
    { label: 'Franchise Portal',  icon: <Globe size={16} />,    href: 'https://www.connectsouq.com' },
    { label: 'Settings',          icon: <Settings size={16} />, href: '#' },
  ];

  return (
    <LiquidBackground>
      <div style={{
        minHeight: '100vh',
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2, position: 'relative',
        boxSizing: 'border-box',
      }}>

        {/* ── Top Nav ──────────────────────────────────────── */}
        <div style={{
          width: '100%', maxWidth: '760px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}>
          <CSLogo size="small" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification Bell */}
            <button style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '8px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', display: 'flex',
            }}>
              <Bell size={18} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px', padding: '8px 14px',
                color: '#fca5a5', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600',
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ── Profile Card ─────────────────────────────────── */}
        <div className="glass-panel" style={{
          width: '100%', maxWidth: '760px',
          padding: '28px', marginBottom: '20px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0052ff, #00e5ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '800', color: '#fff',
              flexShrink: 0, boxShadow: '0 0 24px rgba(0,82,255,0.4)',
              border: '2px solid rgba(0,82,255,0.5)',
            }}>
              {avatar}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: 0 }}>
                  {displayName}
                </h2>
                {/* Verified Badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '20px', padding: '2px 10px',
                  fontSize: '11px', color: '#10b981', fontWeight: '600',
                }}>
                  <CheckCircle2 size={11} /> Verified Operator
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {userData.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    <Mail size={13} /> {userData.email}
                  </div>
                )}
                {userData.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    <Phone size={13} /> {userData.phone}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  <Hash size={13} /> Operator ID: {userData.userId || '—'}
                </div>
              </div>
            </div>

            {/* Network Badge */}
            <div style={{
              background: 'rgba(0,82,255,0.08)',
              border: '1px solid rgba(0,82,255,0.2)',
              borderRadius: '14px', padding: '12px 16px',
              textAlign: 'center',
            }}>
              <Building2 size={22} style={{ color: '#0052ff', marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Network</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>CS Global</div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────── */}
        <div style={{
          width: '100%', maxWidth: '760px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px', marginBottom: '20px',
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel" style={{
              padding: '20px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center',
                width: '40px', height: '40px',
                borderRadius: '12px',
                background: `${stat.color}15`,
                color: stat.color, marginBottom: '10px',
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Links ──────────────────────────────────── */}
        <div className="glass-panel" style={{
          width: '100%', maxWidth: '760px',
          borderRadius: '20px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '20px',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>
              Quick Access
            </h3>
          </div>

          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 20px', gap: '14px',
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none', fontSize: '14px',
                borderBottom: i < quickLinks.length - 1
                  ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{link.icon}</span>
              {link.label}
              <ChevronRight size={15} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }} />
            </a>
          ))}
        </div>

        {/* ── Policy Notice ────────────────────────────────── */}
        <div style={{
          width: '100%', maxWidth: '760px',
          padding: '14px 18px',
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: '14px', marginBottom: '16px',
          fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6',
        }}>
          <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '3px' }}>
            ⚠️ FRANCHISE OPERATOR POLICY
          </strong>
          Once registered under a franchise, members cannot be reassigned to another franchise.
          Contact <a href="mailto:info@connectsouq.com" style={{ color: '#0052ff' }}>info@connectsouq.com</a> for support.
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
          © {new Date().getFullYear()} CS Network · Powered by{' '}
          <a href="https://www.connectsouq.com" target="_blank" rel="noopener noreferrer"
            style={{ color: '#0052ff', textDecoration: 'none' }}>Connect Souq</a>
        </div>
      </div>
    </LiquidBackground>
  );
}