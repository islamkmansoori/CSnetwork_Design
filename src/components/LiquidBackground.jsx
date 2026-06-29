import React from 'react';
import networkBg from '../assets/network-bg.png';

export default function LiquidBackground({ children }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#070a13',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Background Graphic Layers */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Underlay Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${networkBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          mixBlendMode: 'screen',
        }} />

        {/* Ambient Gradient Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 82, 255, 0.45) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float 20s infinite alternate ease-in-out',
        }} />

        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, rgba(0, 0, 0, 0) 75%)',
          filter: 'blur(100px)',
          animation: 'float 25s infinite alternate-reverse ease-in-out',
        }} />

        <div style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'pulse-soft 15s infinite ease-in-out',
        }} />
        
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.8
        }} />
      </div>

      {/* Content wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    </div>
  );
}
