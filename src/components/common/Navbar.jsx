import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_PERMISSIONS } from '../../data/mockData';
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Bell,
  Smartphone,
  Tablet,
  Monitor,
  Shield,
  UserCheck,
  Check,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ deviceMode, setDeviceMode }) => {
  const { currentUser, currentRole, toggleTheme, theme, loginWithRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleConfig = currentRole ? ROLE_PERMISSIONS[currentRole] : null;

  return (
    <header className="top-navbar">
      {/* Brand & Logo */}
      <div className="brand-logo-wrap">
        <div className="brand-icon-box">
          <GraduationCap size={24} />
        </div>
        <div>
          <div style={{ lineHeight: 1.1 }}>EduSphere <span style={{ color: 'var(--primary)', fontSize: '0.85em' }}>360</span></div>
          <div style={{ fontSize: '0.68rem', fontWeight: '500', color: 'var(--text-muted)' }}>
            Cross-Platform SIS
          </div>
        </div>
      </div>

      {/* Role Quick Switcher Pills */}
      <div className="nav-actions-wrap">
        {/* Device Switcher for Previewing Android, iOS, Desktop */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          gap: '2px'
        }}>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`role-switch-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
            title="Desktop / Web Fullscreen View"
          >
            <Monitor size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Web
          </button>
          <button
            onClick={() => setDeviceMode('iphone')}
            className={`role-switch-btn ${deviceMode === 'iphone' ? 'active' : ''}`}
            title="iOS iPhone 16 Pro View"
          >
            <Smartphone size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            iOS
          </button>
          <button
            onClick={() => setDeviceMode('android')}
            className={`role-switch-btn ${deviceMode === 'android' ? 'active' : ''}`}
            title="Android Galaxy S24 View"
          >
            <Smartphone size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Android
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`role-switch-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
            title="Tablet / iPad View"
          >
            <Tablet size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            iPad
          </button>
        </div>

        {/* Interactive Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="role-badge-pill"
            style={{
              background: roleConfig?.bgLight || 'var(--primary-light)',
              color: roleConfig?.badgeColor || 'var(--primary)',
              border: `1px solid ${roleConfig?.badgeColor || 'var(--primary)'}33`,
              cursor: 'pointer'
            }}
          >
            <Shield size={14} />
            <span>{currentRole}</span>
            <ChevronDown size={14} />
          </button>

          {showRoleMenu && (
            <div
              className="card-elevated"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '260px',
                padding: '0.5rem',
                zIndex: 100,
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                SWITCH ROLE (RBAC DEMO)
              </div>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    loginWithRole(role);
                    setShowRoleMenu(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: currentRole === role ? '700' : '500',
                    color: currentRole === role ? 'var(--primary)' : 'var(--text-primary)',
                    background: currentRole === role ? 'var(--bg-input)' : 'transparent',
                    marginTop: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: ROLE_PERMISSIONS[role].badgeColor,
                      }}
                    />
                    <span>{ROLE_PERMISSIONS[role].title}</span>
                  </div>
                  {currentRole === role && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User profile avatar & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            className="avatar-img"
          />
          <div style={{ display: 'none', flexDirection: 'column' }} className="user-text-meta">
            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
          </div>
          <button
            onClick={logout}
            className="icon-btn"
            title="Log Out"
            style={{ color: '#ef4444' }}
            aria-label="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
