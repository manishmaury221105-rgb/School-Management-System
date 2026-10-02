import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const TimetableManager = () => {
  const { timetable, classes } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classSchedule = timetable[selectedClass] || timetable['Class 10-A'] || {};
  const currentDaySchedule = classSchedule[selectedDay] || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Master Timetable & Schedule</h1>
          <p className="page-subtitle">
            Weekly subject allocations, faculty period assignments and classroom routing.
          </p>
        </div>
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ fontWeight: '700', padding: '10px 16px' }}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.name}>{c.name} Schedule</option>
            ))}
          </select>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.25rem'
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

      {/* Period Timeline / Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {currentDaySchedule.length === 0 ? (
          <div className="card-elevated" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No scheduled periods for {selectedDay}.
          </div>
        ) : (
          currentDaySchedule.map((slot) => (
            <div
              key={slot.period}
              className="card-elevated"
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: '4px solid var(--primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  color: 'var(--primary)'
                }}>
                  P{slot.period}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {slot.subject}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
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
          ))
        )}
      </div>
    </div>
  );
};
