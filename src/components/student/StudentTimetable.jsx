import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Clock, MapPin, User, Calendar, BookOpen } from 'lucide-react';

export const StudentTimetable = () => {
  const { timetable } = useSchoolData();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classSchedule = timetable['Class 10-A'] || {};
  const daySchedule = classSchedule[selectedDay] || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Weekly Class Timetable</h1>
          <p className="page-subtitle">
            Class 10-A • 7 Academic Periods Daily • St. Xavier International Academy
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: selectedDay === day ? '700' : '600',
              background: selectedDay === day ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedDay === day ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              boxShadow: selectedDay === day ? '0 4px 12px var(--primary-glow)' : 'var(--shadow-xs)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Periods List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {daySchedule.map((slot, idx) => {
          const isOngoing = selectedDay === 'Monday' && slot.period === 1;
          return (
            <div
              key={slot.period}
              className="card-elevated"
              style={{
                padding: '1.25rem',
                border: isOngoing ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isOngoing ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(14, 165, 233, 0.05))' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: isOngoing ? 'var(--primary)' : 'var(--bg-input)',
                  color: isOngoing ? 'white' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                }}>
                  P{slot.period}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {slot.subject}
                    </div>
                    {isOngoing && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        background: '#10b981',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}>
                        ● CURRENT LECTURE
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <Clock size={13} />
                    <span>{slot.time}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600' }}>
                  <User size={15} color="var(--primary)" />
                  <span>{slot.teacher}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'var(--bg-input)',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: 'var(--text-secondary)'
                }}>
                  <MapPin size={14} />
                  <span>{slot.room}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
