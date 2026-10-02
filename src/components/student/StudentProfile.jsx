import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  QrCode,
  Download,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  User,
  Calendar,
} from 'lucide-react';

export const StudentProfile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Digital Student Identity</h1>
          <p className="page-subtitle">
            Official institutional credential with barcode verification & emergency profile.
          </p>
        </div>
        <button onClick={() => window.print()} className="btn-primary">
          <Download size={16} />
          <span>Print / Save ID Card</span>
        </button>
      </div>

      {/* Holographic Digital School ID Card */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="student-id-card">
          <div className="id-card-hologram" />

          {/* School Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
                  ST. XAVIER ACADEMY
                </div>
                <div style={{ fontSize: '0.65rem', color: '#c7d2fe', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Student Identity Pass • 2026-27
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.25)',
              border: '1px solid #10b981',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.68rem',
              fontWeight: '800',
              color: '#34d399'
            }}>
              ACTIVE
            </div>
          </div>

          {/* Photo & Main Details */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {currentUser?.name || 'Rohan Sharma'}
              </h2>
              <div style={{ color: '#93c5fd', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace', marginTop: '4px' }}>
                ID: {currentUser?.studentId || 'STU-2026-1018'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#e0e7ff', marginTop: '2px' }}>
                {currentUser?.class || 'Class 10-A'} • Roll #{currentUser?.rollNo || '18'}
              </div>
            </div>
          </div>

          {/* Key Attributes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.25)',
            padding: '0.75rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '1rem',
            fontSize: '0.75rem'
          }}>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: '700' }}>BLOOD GP</span>
              <strong style={{ color: '#f87171' }}>{currentUser?.bloodGroup || 'O+'}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: '700' }}>HOUSE</span>
              <strong style={{ color: '#34d399' }}>{currentUser?.house || 'Emerald'}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: '700' }}>DOB</span>
              <strong style={{ color: '#fcd34d' }}>{currentUser?.dob || '2010-04-14'}</strong>
            </div>
          </div>

          {/* Footer Bar with QR Simulation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
              <div>Emergency: {currentUser?.emergencyContact || '+1 (555) 901-2345'}</div>
              <div>Parent: {currentUser?.parentName || 'Anita Sharma'}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QrCode size={36} color="#0f172a" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Profile Info Table */}
      <div className="card-elevated" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem' }}>
          Personal & Guardian Particulars
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>REGISTERED EMAIL</span>
            <div style={{ fontWeight: '700', marginTop: '2px' }}>{currentUser?.email || 'student.rohan@edusphere.edu'}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>GUARDIAN NAME</span>
            <div style={{ fontWeight: '700', marginTop: '2px' }}>{currentUser?.parentName || 'Anita Sharma'}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>GUARDIAN CONTACT</span>
            <div style={{ fontWeight: '700', marginTop: '2px' }}>{currentUser?.parentContact || '+1 (555) 890-4321'}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>RESIDENTIAL ADDRESS</span>
            <div style={{ fontWeight: '700', marginTop: '2px' }}>{currentUser?.address || '742 Evergreen Terrace, Springfield'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
