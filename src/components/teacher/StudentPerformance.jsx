import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Users,
  Sparkles,
  Eye,
  UserCheck,
} from 'lucide-react';

export const StudentPerformance = () => {
  const { students, examsData } = useSchoolData();
  const [selectedStudent, setSelectedStudent] = useState(null);

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
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Academic Leaders (Top GPA)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top GPA Achievers across Roster</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topStudents.map((stu, idx) => (
              <div
                key={stu.id}
                onClick={() => setSelectedStudent(stu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: idx === 0 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-input)',
                  border: idx === 0 ? '1px solid #f59e0b44' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
                title="Click to view student profile"
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

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {stu.gpa || '3.9'} GPA
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                      {stu.attendancePercent}% Att.
                    </div>
                  </div>
                  <Eye size={16} color="var(--primary)" />
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance &lt;85% or low score</span>
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
                  onClick={() => setSelectedStudent(stu)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    cursor: 'pointer',
                  }}
                  title="Click to view student profile"
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
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '6px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recommendation: Schedule parent meeting & revision.</span>
                    <Eye size={14} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Profile Modal in Performance Analytics */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Profile Overview"
          maxWidth="600px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={selectedStudent.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{selectedStudent.name}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace' }}>
                  {selectedStudent.studentId}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedStudent.class} • Roll #{selectedStudent.rollNo} • House: {selectedStudent.house || 'Emerald Dragons'}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'var(--bg-input)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>GUARDIAN</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudent.parentName || 'Guardian'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PARENT CONTACT</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudent.parentContact || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PHONE (LOGIN ID)</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudent.phone || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ATTENDANCE RATE</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#10b981' }}>{selectedStudent.attendancePercent}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ACADEMIC GPA</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedStudent.gpa || 3.8} / 4.0</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>BLOOD GROUP</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>{selectedStudent.bloodGroup || 'O+'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
