import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, INITIAL_USERS } from '../../data/mockData';
import {
  GraduationCap,
  Shield,
  UserCheck,
  User,
  Phone,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  Check,
  Info,
  Eye,
  EyeOff,
  School,
} from 'lucide-react';

export const LoginView = () => {
  const { loginWithCredentials, loginWithRole } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState(ROLES.ADMIN);
  const [phoneInput, setPhoneInput] = useState(INITIAL_USERS.find(u => u.role === ROLES.ADMIN)?.phone || '9876543210');
  const [dobInput, setDobInput] = useState(INITIAL_USERS.find(u => u.role === ROLES.ADMIN)?.dob || '1980-01-01');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleDefinitions = {
    [ROLES.ADMIN]: {
      label: 'School Administrator',
      subtitle: 'Institutional Governance & Faculty Onboarding',
      icon: Shield,
      dotColor: '#EF4444', // Red dot as in screenshot
      textColor: '#4f46e5',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.ADMIN),
      demoPhone: '9876543210',
      demoDob: '1980-01-01',
      dobFormatted: '01011980 (DDMMYYYY)',
      scopeNote: 'Administrator manages Faculty, Classes, Subjects & Finances.',
    },
    [ROLES.TEACHER]: {
      label: 'Faculty Member',
      subtitle: 'Class Incharge, Attendance & Student Registration',
      icon: UserCheck,
      dotColor: '#3B82F6', // Blue dot as in screenshot
      textColor: '#2563eb',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.TEACHER),
      demoPhone: '9876543211',
      demoDob: '1990-01-01',
      dobFormatted: '01011990 (DDMMYYYY)',
      scopeNote: 'Faculty onboards Students and manages Classroom.',
    },
    [ROLES.STUDENT]: {
      label: 'Enrolled Student',
      subtitle: 'Digital ID Pass, Timetable, Homework & Results',
      icon: User,
      dotColor: '#10B981', // Green dot as in screenshot
      textColor: '#059669',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.STUDENT),
      demoPhone: '9876543212',
      demoDob: '2010-01-01',
      dobFormatted: '01012010 (DDMMYYYY)',
      scopeNote: 'Log in with Registered Mobile Number & Date of Birth.',
    },
  };

  const currentRoleConfig = roleDefinitions[activeRoleTab];

  // Auto-fill demo credentials on tab change or click
  const handleTabSelect = (roleKey) => {
    setActiveRoleTab(roleKey);
    setErrorMsg('');
    setPhoneInput(roleDefinitions[roleKey].demoPhone);
    setDobInput(roleDefinitions[roleKey].demoDob);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const targetPhone = phoneInput || currentRoleConfig.demoPhone;
    const targetDob = dobInput || currentRoleConfig.demoDob;

    const res = loginWithCredentials(targetPhone, targetDob, activeRoleTab);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  const handleFastDemoLaunch = () => {
    loginWithRole(activeRoleTab);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.12) 0%, rgba(248, 250, 252, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', maxWidth: '540px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 1.1rem',
            background: '#ffffff',
            borderRadius: '999px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            marginBottom: '0.85rem',
          }}
        >
          <img
            src="/edusphere-icon.png"
            alt="EduSphere Logo"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              objectFit: 'contain',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            EduSphere <span style={{ color: '#4f46e5' }}>360</span>
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              background: '#ecfdf5',
              color: '#059669',
              padding: '2px 7px',
              borderRadius: '6px',
              border: '1px solid #a7f3d0',
            }}
          >
            Secure Portal
          </span>
        </div>

        <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 0.4rem 0' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
          Select your institutional role to sign in to your workspace.
        </p>
      </div>

      {/* Main Login Card with Vertical Role List */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 12px 36px -4px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Exact Vertical Role Selector List from screenshot */}
        <div style={{ padding: '1rem 1rem 0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(roleDefinitions).map(([key, config]) => {
            const isSelected = activeRoleTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabSelect(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
                  border: isSelected ? '1.5px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Colored Dot Indicator (Red, Blue, Green, Purple) */}
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: config.dotColor,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? '#4f46e5' : '#1e293b',
                    }}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Blue/Purple Checkmark on right when selected */}
                {isSelected && (
                  <Check
                    size={20}
                    style={{
                      color: '#4f46e5',
                      strokeWidth: 2.8,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 1rem' }} />

        {/* Selected Role Scope Badge */}
        <div style={{ padding: '0.5rem 1.25rem' }}>
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} color="#64748b" style={{ flexShrink: 0 }} />
              <span>{currentRoleConfig.scopeNote}</span>
            </div>
            <button
              type="button"
              onClick={handleFastDemoLaunch}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                flexShrink: 0,
              }}
              title="Skip typing and sign in directly"
            >
              <Sparkles size={11} />
              <span>1-Click</span>
            </button>
          </div>
        </div>

        {/* Login Form Body */}
        <div style={{ padding: '1rem 1.25rem 1.5rem 1.25rem' }}>
          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 0.9rem',
                background: '#fef2f2',
                color: '#b91c1c',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: '600',
                marginBottom: '1rem',
                border: '1px solid #fecaca',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Phone Number Field (Login ID) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                  Phone Number (User ID)
                </label>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Demo: <strong>{currentRoleConfig.demoPhone}</strong>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder={`e.g. ${currentRoleConfig.demoPhone}`}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4f46e5')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Phone
                  size={16}
                  color="#64748b"
                  style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Date of Birth Field (Login Password) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                  Date of Birth (Password)
                </label>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Demo: <strong>{currentRoleConfig.demoDob}</strong>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={`YYYY-MM-DD or DDMMYYYY (e.g. ${currentRoleConfig.demoDob})`}
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.4rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4f46e5')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Calendar
                  size={16}
                  color="#64748b"
                  style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  marginTop: '4px',
                }}
              >
                Format: <code>YYYY-MM-DD</code> or <code>DDMMYYYY</code> ({currentRoleConfig.dobFormatted})
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                marginTop: '0.4rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isLoading ? 'Signing In...' : `Sign In as ${currentRoleConfig.label}`}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
