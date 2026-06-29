import React from 'react';
import logoImg from '../assets/cslogo.png';

export default function CSLogo({ className = '', size = 'medium' }) {
  // Sizing mapping (larger sizes)
  const logoHeight = size === 'small' ? '36px' : size === 'large' ? '72px' : '52px';
  
  return (
    <div className={`flex items-center select-none ${className}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      {/* Logo Mark and Text integrated from image */}
      <img
        src={logoImg}
        alt="CS Network Logo"
        style={{
          height: logoHeight,
          width: 'auto',
          objectFit: 'contain',
          flexShrink: 0,
          mixBlendMode: 'normal',
          filter: 'invert(1) hue-rotate(180deg)'
        }}
      />
    </div>
  );
}
