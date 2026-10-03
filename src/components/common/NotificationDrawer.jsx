import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Bell, BellRing, Check, X, CreditCard, Calendar, Award, BookOpen } from 'lucide-react';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useSchoolData();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'FEE':
        return <CreditCard size={18} color="#ef4444" />;
      case 'EXAM':
        return <Award size={18} color="#4f46e5" />;
      case 'ATTENDANCE':
        return <Calendar size={18} color="#10b981" />;
      case 'NOTICE':
        return <BellRing size={18} color="#8b5cf6" />;
      default:
        return <Bell size={18} color="var(--primary)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 150,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Notifications</h3>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: n.isRead ? 'var(--bg-input)' : 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(14, 165, 233, 0.05))',
                border: n.isRead ? '1px solid var(--border)' : '1px solid var(--primary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  {getIcon(n.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{n.title}</h4>
                    {!n.isRead && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    {n.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
