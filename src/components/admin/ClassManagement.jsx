import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  School,
  Users,
  DoorOpen,
  UserCheck,
  Plus,
  Eye,
  CreditCard,
  Phone,
  GraduationCap,
} from 'lucide-react';

export const ClassManagement = ({ setActiveTab }) => {
  const { classes, students, teachers } = useSchoolData();
  const [selectedClassRoster, setSelectedClassRoster] = useState(null);

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Classes & Sections</h1>
          <p className="page-subtitle">
            Configure classrooms, live student intake, assign class teachers and designated rooms.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {classes.map((cls) => {
          const classStudents = students.filter(
            s => (s.class || '').trim().toLowerCase() === (cls.name || '').trim().toLowerCase()
          );
          const enrolledCount = classStudents.length;
          const fillRatio = Math.round((enrolledCount / cls.maxCapacity) * 100);

          const assignedTeacher = teachers.find(
            t => t.classTeacherOf === cls.name || (t.assignedClasses && t.assignedClasses.includes(cls.name))
          );
          const teacherName = assignedTeacher ? assignedTeacher.name : cls.classTeacher;

          return (
            <div
              key={cls.id}
              className="card-elevated"
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <School size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{cls.name}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Grade {cls.grade} • Section {cls.section}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)'
                  }}>
                    {cls.roomNo}
                  </span>
                </div>

                <div style={{
                  padding: '0.85rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <UserCheck size={16} color="var(--primary)" />
                    <span>Class Teacher:</span>
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', paddingLeft: '22px' }}>
                    {teacherName}
                  </div>
                </div>

                {/* Live Occupancy Capacity Bar */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Occupancy</span>
                    <span style={{ color: enrolledCount > 0 ? 'var(--primary)' : 'var(--text-primary)', fontWeight: '800' }}>
                      {enrolledCount} / {cls.maxCapacity} Seats ({fillRatio}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(fillRatio, enrolledCount > 0 ? 5 : 0)}%`,
                        height: '100%',
                        background: fillRatio >= 90 ? '#ef4444' : 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                marginTop: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: fillRatio >= 90 ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                  {fillRatio >= 90 ? '● Almost Full' : enrolledCount > 0 ? `● ${enrolledCount} Enrolled` : '● Seats Available'}
                </span>
                <button
                  onClick={() => setSelectedClassRoster(cls)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Manage Roster ({enrolledCount})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Student Roster Modal */}
      {selectedClassRoster && (
        <Modal
          isOpen={!!selectedClassRoster}
          onClose={() => setSelectedClassRoster(null)}
          title={`${selectedClassRoster.name} — Student Roster (${students.filter(s => (s.class || '').trim().toLowerCase() === (selectedClassRoster.name || '').trim().toLowerCase()).length} Students)`}
        >
          {(() => {
            const roster = students.filter(
              s => (s.class || '').trim().toLowerCase() === (selectedClassRoster.name || '').trim().toLowerCase()
            );

            if (roster.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>No Students Enrolled in {selectedClassRoster.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Enroll new students from the Student Management directory.
                  </p>
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {roster.map((stu) => (
                  <div
                    key={stu.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={stu.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={stu.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Roll #{stu.rollNo} • ID: {stu.studentId} • Father: {stu.parentName || 'Guardian'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: stu.feeStatus === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: stu.feeStatus === 'Paid' ? '#059669' : '#dc2626',
                      }}>
                        {stu.feeStatus === 'Paid' ? 'Fee Paid ✓' : 'Fee Due'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
