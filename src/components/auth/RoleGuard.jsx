import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const RoleGuard = ({ allowedRoles, tabId, children, onGoHome }) => {
  const { currentRole, hasPermission } = useAuth();

  const isRoleAllowed = allowedRoles ? allowedRoles.includes(currentRole) : true;
  const isTabAllowed = tabId ? hasPermission(tabId) : true;

  if (!isRoleAllowed || !isTabAllowed) {
    return (
      <div style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #fee2e2',
        margin: '2rem auto',
        maxWidth: '550px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b91c1c' }}>
          Access Restricted (RBAC Protection)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
          Your current active role (<strong>{currentRole}</strong>) does not have authorization to view this module.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={onGoHome}
            className="btn-primary"
            style={{ margin: '0 auto' }}
          >
            <ArrowLeft size={16} />
            <span>Return to {currentRole} Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};
