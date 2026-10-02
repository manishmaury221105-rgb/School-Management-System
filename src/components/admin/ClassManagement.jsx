import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { School, Users, DoorOpen, UserCheck, Plus } from 'lucide-react';

export const ClassManagement = () => {
  const { classes } = useSchoolData();

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Classes & Sections</h1>
          <p className="page-subtitle">
            Configure classrooms, maximum student intake, assign class teachers and designated rooms.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {classes.map((cls) => {
          const fillRatio = Math.round((cls.studentCount / cls.maxCapacity) * 100);
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
                    {cls.classTeacher}
                  </div>
                </div>

                {/* Capacity Bar */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Occupancy</span>
                    <span>{cls.studentCount} / {cls.maxCapacity} Seats ({fillRatio}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${fillRatio}%`,
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
                  {fillRatio >= 90 ? '● Almost Full' : '● Seats Available'}
                </span>
                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  Manage Roster
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
