import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check, AlertCircle } from 'lucide-react';

const countries = [
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', length: 9, format: '5X XXX XXXX', placeholder: '50 123 4567' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', length: 9, format: '5X XXX XXXX', placeholder: '50 123 4567' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', length: 10, format: 'XXXXX-XXXXX', placeholder: '98765-43210' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', length: 10, format: '(XXX) XXX-XXXX', placeholder: '(201) 555-0123' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', length: 10, format: 'XXXX XXXX-XX', placeholder: '7700 900077' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', length: 10, format: '(XXX) XXX-XXXX', placeholder: '(201) 555-0123' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', length: 8, format: 'XXXX XXXX', placeholder: '9123 4567' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', length: 9, format: 'XXX XXX XXX', placeholder: '412 345 678' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', length: 11, format: 'XXX XXXXXXX', placeholder: '170 1234567' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', length: 9, format: 'X XX XX XX XX', placeholder: '6 12 34 56 78' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', length: 8, format: 'XXXX XXXX', placeholder: '5555 1234' },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', length: 8, format: 'XXXX XXXX', placeholder: '9123 4567' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', length: 8, format: 'XXXX XXXX', placeholder: '9123 4567' },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', length: 8, format: 'XXXX XXXX', placeholder: '3123 4567' },
];

export default function CountryPhoneInput({ value, onChange, error, setError }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    // Clear input when country changes to prevent invalid lengths
    onChange('');
    setError('');
  };

  const handlePhoneChange = (e) => {
    const rawInput = e.target.value;
    // Strip non-numeric characters
    const numericValue = rawInput.replace(/\D/g, '');
    
    // Enforce max length of selected country
    if (numericValue.length <= selectedCountry.length) {
      onChange(numericValue);
      
      // Auto-validate length on typing
      if (numericValue.length === 0) {
        setError('Phone number is required');
      } else if (numericValue.length < selectedCountry.length) {
        setError(`Phone number must be ${selectedCountry.length} digits for ${selectedCountry.name}`);
      } else {
        setError('');
      }
    }
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format the displayed phone number
  const formatPhoneNumber = (num, format) => {
    if (!num) return '';
    let formatted = '';
    let numIdx = 0;
    for (let i = 0; i < format.length; i++) {
      if (format[i] === 'X') {
        if (numIdx < num.length) {
          formatted += num[numIdx++];
        } else {
          break;
        }
      } else {
        if (numIdx < num.length) {
          formatted += format[i];
        }
      }
    }
    return formatted;
  };

  const formattedDisplay = formatPhoneNumber(value, selectedCountry.format);

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label className="form-label">WhatsApp Mobile Number</label>
      
      <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
        
        {/* Country Flag Button */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="form-input"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: 'rgba(255, 255, 255, 0.03)',
              minWidth: '95px',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '20px' }}>{selectedCountry.flag}</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedCountry.dialCode}</span>
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
          </button>

          {/* Search Dropdown Panel */}
          {isOpen && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              width: '280px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 100,
              padding: '10px',
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Search input inside dropdown */}
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0.4
                }} />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="form-input"
                  style={{
                    padding: '8px 12px 8px 32px',
                    fontSize: '13px',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                  autoFocus
                />
              </div>

              {/* Country List */}
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        background: selectedCountry.code === country.code ? 'rgba(0, 82, 255, 0.15)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#fff',
                        textAlign: 'left',
                        transition: 'background 0.2s',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCountry.code !== country.code) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCountry.code !== country.code) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{country.flag}</span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{country.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{country.dialCode}</span>
                        {selectedCountry.code === country.code && <Check size={12} color="var(--primary)" />}
                      </div>
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Text Input field */}
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="tel"
            inputMode="numeric"
            value={formattedDisplay}
            onChange={handlePhoneChange}
            placeholder={selectedCountry.placeholder}
            autoComplete="tel"
            className="form-input"
            style={{
              paddingLeft: '16px',
              borderColor: error ? 'var(--accent-red)' : undefined,
              boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined
            }}
          />
          {error && (
            <AlertCircle size={16} style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--accent-red)'
            }} />
          )}
        </div>
      </div>
      
      {error && (
        <span className="form-error-msg">
          <AlertCircle size={13} /> {error}
        </span>
      )}
      
      <span style={{
        display: 'block',
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginTop: '6px',
        marginLeft: '2px'
      }}>
        Format: {selectedCountry.flag} {selectedCountry.dialCode} {selectedCountry.format} ({selectedCountry.length} digits)
      </span>
    </div>
  );
}
export { countries };
