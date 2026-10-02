import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, INITIAL_USERS } from '../../data/mockData';
import {
  GraduationCap,
  Shield,
  UserCheck,
  User,
  Users,
  Phone,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const LoginView = () => {
  const { loginWithCredentials, loginWithRole } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState(ROLES.ADMIN);
  const [phoneInput, setPhoneInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleDefinitions = {
    [ROLES.ADMIN]: {
      label: 'School Administrator',
      subtitle: 'Institutional Governance & Faculty Management',
      icon: Shield,
      dotColor: '#EF4444', // Red dot as in screenshot
      badgeBg: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#EF4444',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.ADMIN),
      demoPhone: '9876543210',
      demoDob: '1980-01-01',
      dobFormatted: '01/01/1980 (01011980)',
      scopeNote: 'Administrator adds and manages Faculty & Staff only.',
    },
    [ROLES.TEACHER]: {
      label: 'Faculty Member',
      subtitle: 'Class Incharge, Attendance & Student Registration',
      icon: UserCheck,
      dotColor: '#3B82F6', // Blue dot as in screenshot
      badgeBg: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3B82F6',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.TEACHER),
      demoPhone: '9876543211',
      demoDob: '1988-05-15',
      dobFormatted: '15/05/1988 (15051988)',
      scopeNote: 'Faculty adds and manages Students & Parents directly.',
    },
    [ROLES.STUDENT]: {
      label: 'Enrolled Student',
      subtitle: 'Digital ID, Timetable, Homework & Results',
      icon: User,
      dotColor: '#10B981', // Green dot as in screenshot
      badgeBg: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10B981',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.STUDENT),
      demoPhone: '9876543212',
      demoDob: '2010-04-14',
      dobFormatted: '14/04/2010 (14042010)',
      scopeNote: 'Log in with Registered Mobile Number & Date of Birth.',
    },
    [ROLES.PARENT]: {
      label: 'Guardian / Parent',
      subtitle: 'Multi-Child 360° Monitor, Fee Payments & Leave',
      icon: Users,
      dotColor: '#8B5CF6', // Purple dot as in screenshot
      badgeBg: 'rgba(139, 92, 246, 0.1)',
      borderColor: '#8B5CF6',
      demoUser: INITIAL_USERS.find((u) => u.role === ROLES.PARENT),
      demoPhone: '9876543213',
      demoDob: '1985-04-12',
      dobFormatted: '12/04/1985 (12041985)',
      scopeNote: 'Monitor linked children, attendance & pay term fees.',
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
        background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.15), transparent 70%), var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1.25rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
          }}
        >
          <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
            <GraduationCap size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            EduSphere <span style={{ color: 'var(--primary)' }}>360</span>
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            Portal Login
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          School Management Sign In
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
          Enter your registered <strong>Phone Number (ID)</strong> and <strong>Date of Birth (Password)</strong>.
        </p>
      </div>

      {/* Main Login Card with Role Selector */}
      <div
        className="card-elevated"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        {/* Role Selection Tabs (Matches screenshot colors & labels) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            padding: '0.75rem',
            background: 'var(--bg-input)',
            borderBottom: '1px solid var(--border)',
          }}
        >
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
                  gap: '0.65rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--bg-card)' : 'transparent',
                  border: isSelected ? `2px solid ${config.dotColor}` : '1px solid transparent',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {/* Colored Dot Indicator */}
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: config.dotColor,
                    boxShadow: isSelected ? `0 0 10px ${config.dotColor}80` : 'none',
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? '800' : '600',
                      color: isSelected ? config.dotColor : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {config.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Banner */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: currentRoleConfig.badgeBg,
            borderBottom: `1px solid ${currentRoleConfig.dotColor}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: currentRoleConfig.dotColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <currentRoleConfig.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {currentRoleConfig.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {currentRoleConfig.subtitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFastDemoLaunch}
            className="btn-primary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem',
              background: currentRoleConfig.dotColor,
            }}
          >
            <Sparkles size={13} />
            <span>1-Click Launch</span>
          </button>
        </div>

        {/* Login Form Body */}
        <div style={{ padding: '1.75rem' }}>
          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                border: '1px solid #fca5a5',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Phone Number Field (Login ID) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Phone Number (User ID)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Demo: <strong>{currentRoleConfig.demoPhone}</strong>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder={`e.g. ${currentRoleConfig.demoPhone}`}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Phone
                  size={16}
                  color={currentRoleConfig.dotColor}
                  style={{ position: 'absolute', left: '12px', top: '13px' }}
                />
              </div>
            </div>

            {/* Date of Birth Field (Login Password) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Date of Birth (Password)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Demo DOB: <strong>{currentRoleConfig.demoDob}</strong>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder={`YYYY-MM-DD or DDMMYYYY (e.g. ${currentRoleConfig.demoDob})`}
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Calendar
                  size={16}
                  color={currentRoleConfig.dotColor}
                  style={{ position: 'absolute', left: '12px', top: '13px' }}
                />
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Info size={12} />
                <span>Format: DDMMYYYY or YYYY-MM-DD (e.g. {currentRoleConfig.dobFormatted})</span>
              </div>
            </div>

            {/* Scope Information Note */}
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color={currentRoleConfig.dotColor} style={{ flexShrink: 0 }} />
              <span>{currentRoleConfig.scopeNote}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.95rem',
                background: `linear-gradient(135deg, ${currentRoleConfig.dotColor}, ${currentRoleConfig.dotColor}dd)`,
                boxShadow: `0 4px 14px ${currentRoleConfig.dotColor}40`,
                marginTop: '0.5rem',
              }}
            >
              <span>{isLoading ? 'Authenticating...' : `Log In as ${currentRoleConfig.label}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
