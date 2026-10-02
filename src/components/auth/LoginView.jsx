import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_PERMISSIONS, INITIAL_USERS } from '../../data/mockData';
import {
  GraduationCap,
  Shield,
  UserCheck,
  User,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const LoginView = () => {
  const { loginWithRole, loginWithCredentials } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleQuickLogin = (role) => {
    loginWithRole(role);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your school email address.');
      return;
    }
    const res = loginWithCredentials(email, password, selectedRole);
    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  const rolesList = [
    {
      role: ROLES.ADMIN,
      title: 'Admin Portal',
      user: INITIAL_USERS.find(u => u.role === ROLES.ADMIN),
      icon: Shield,
      color: '#ef4444',
      bg: '#fef2f2',
      badge: 'Full Governance',
      features: ['Institution Analytics', 'Staff & Student Directory', 'Fee Collection Master', 'Global Circulars']
    },
    {
      role: ROLES.TEACHER,
      title: 'Teacher Hub',
      user: INITIAL_USERS.find(u => u.role === ROLES.TEACHER),
      icon: UserCheck,
      color: '#3b82f6',
      bg: '#eff6ff',
      badge: 'Class 10-A Faculty',
      features: ['Daily Attendance Register', 'Homework & Assignments', 'Exam Marks & Grading', 'Performance Tracker']
    },
    {
      role: ROLES.STUDENT,
      title: 'Student Desk',
      user: INITIAL_USERS.find(u => u.role === ROLES.STUDENT),
      icon: User,
      color: '#10b981',
      bg: '#ecfdf5',
      badge: 'Grade 10-A',
      features: ['Digital School ID Card', 'Subject-wise Attendance', 'Live Timetable', 'Instant Fee Pay Gateway']
    },
    {
      role: ROLES.PARENT,
      title: 'Parent Portal',
      user: INITIAL_USERS.find(u => u.role === ROLES.PARENT),
      icon: Users,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      badge: 'Multi-Child (2)',
      features: ['Child Switcher (Rohan & Maya)', 'Live Attendance Alerts', 'Exam Report Cards', 'Online Fee Payment']
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.15), transparent 70%), var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '650px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1.25rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          marginBottom: '1rem'
        }}>
          <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
            <GraduationCap size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            EduSphere <span style={{ color: 'var(--primary)' }}>360</span>
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            iOS • Android • Web
          </span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Next-Gen School Management Platform
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
          Select any user role below to enter with full Role-Based Access Control (RBAC).
        </p>
      </div>

      {/* Role Cards Grid (1-Click Login) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '2rem'
      }}>
        {rolesList.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.role;
          return (
            <div
              key={item.role}
              className="card-elevated"
              style={{
                padding: '1.5rem',
                border: isSelected ? `2px solid ${item.color}` : '1px solid var(--border)',
                background: isSelected ? 'var(--bg-card)' : 'var(--bg-card-glass)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: item.bg,
                    color: item.color,
                  }}>
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 1rem 0' }}>
                  Demo User: <strong>{item.user?.name}</strong>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Allowed Features:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {item.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <CheckCircle2 size={13} color={item.color} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleRoleQuickLogin(item.role)}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  boxShadow: `0 4px 14px ${item.color}40`,
                }}
              >
                <span>Launch as {item.role}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Direct Credentials Login Accordion / Box */}
      <div
        className="card-elevated"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '1.75rem',
          background: 'var(--bg-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Lock size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Custom Account Login</h4>
        </div>

        {errorMsg && (
          <div style={{
            padding: '0.75rem',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value={ROLES.ADMIN}>Admin (Dr. Arthur Vance)</option>
              <option value={ROLES.TEACHER}>Teacher (Mrs. Sarah Jenkins)</option>
              <option value={ROLES.STUDENT}>Student (Rohan Sharma)</option>
              <option value={ROLES.PARENT}>Parent (Anita Sharma)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="e.g. student.rohan@edusphere.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            Sign In with Credentials
          </button>
        </form>
      </div>
    </div>
  );
};
