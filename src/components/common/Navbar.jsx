import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ROLES, ROLE_PERMISSIONS } from '../../data/mockData';
import { NotificationDrawer } from './NotificationDrawer';
import { Modal } from './Modal';
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Bell,
  Key,
  Save,
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, currentRole, toggleTheme, theme, logout, changePassword, updateProfile } = useAuth();
  const { notifications } = useSchoolData();

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const roleConfig = currentRole ? ROLE_PERMISSIONS[currentRole] : null;

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPwd) return;
    const res = changePassword(currentPwd, newPwd);
    setProfileMsg(res.message);
    setTimeout(() => setProfileMsg(''), 3000);
    setCurrentPwd('');
    setNewPwd('');
  };

  return (
    <>
      <header className="top-navbar">
        {/* Brand & Logo */}
        <div className="brand-logo-wrap">
          <img
            src="/edusphere-icon.png"
            alt="EduSphere Logo"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              objectFit: 'contain',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          />
          <div>
            <div style={{ lineHeight: 1.1, fontWeight: '800' }}>EduSphere <span style={{ color: 'var(--primary)', fontSize: '0.85em' }}>360</span></div>
            <div style={{ fontSize: '0.68rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              Enterprise SIS Platform
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions-wrap">
          {/* In-App Notifications Button with Unread Badge */}
          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="icon-btn"
            title="Open Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                }}
              />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User Profile Avatar & Settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="avatar-img"
              onClick={() => setIsProfileModalOpen(true)}
              style={{ cursor: 'pointer' }}
              title="Click to manage account settings"
            />
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

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      {/* Profile & Security Modal */}
      {isProfileModalOpen && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Account Profile & Security Settings"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{currentUser?.name}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '700' }}>
                  {currentUser?.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Role: {currentRole} • Status: Active
                </div>
              </div>
            </div>

            {profileMsg && (
              <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: '700' }}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="var(--primary)" />
                <span>Change Password</span>
              </h4>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="btn-secondary">
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={15} />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};
