import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';

export const StudentPerformance = () => {
  const { students, examsData } = useSchoolData();

  const topStudents = [...students].sort((a, b) => (b.gpa || 0) - (a.gpa || 0)).slice(0, 4);
  const atRiskStudents = students.filter(s => s.attendancePercent < 85 || (s.gpa && s.gpa < 3.2));

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Student Performance Analytics</h1>
          <p className="page-subtitle">
            Holistic academic tracking, top performers list, and early attendance intervention alerts.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Top Performers Card */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Class 10-A Academic Leaders</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top GPA Achievers</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topStudents.map((stu, idx) => (
              <div
                key={stu.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: idx === 0 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-input)',
                  border: idx === 0 ? '1px solid #f59e0b44' : '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#f59e0b' : 'var(--bg-card)',
                    color: idx === 0 ? 'white' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{stu.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll #{stu.rollNo} • {stu.class}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                    {stu.gpa || '3.9'} GPA
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                    {stu.attendancePercent}% Att.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Warning / At Risk Students */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Support & Attention Alerts</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance &lt;80% or low score</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {atRiskStudents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No students currently in warning zone!
              </div>
            ) : (
              atRiskStudents.map((stu) => (
                <div
                  key={stu.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '800', color: '#991b1b', fontSize: '0.92rem' }}>{stu.name}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b91c1c' }}>
                      {stu.attendancePercent}% Attendance
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#7f1d1d' }}>
                    Roll #{stu.rollNo} • Guardian: {stu.parentName} ({stu.parentContact})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '6px', fontWeight: '600' }}>
                    Recommendation: Schedule parent meeting & offer revision clinic.
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
