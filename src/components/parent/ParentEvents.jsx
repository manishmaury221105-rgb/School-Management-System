import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const ParentEvents = () => {
  const { events } = useSchoolData();

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">School Calendar & PTM Schedules</h1>
          <p className="page-subtitle">
            Keep track of Parent-Teacher conferences, annual ceremonies, sports meets & school holidays.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {events.map((ev) => (
          <div
            key={ev.id}
            className="card-elevated"
            style={{
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={ev.image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80'}
                alt={ev.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '3px 9px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: '800',
                backdropFilter: 'blur(4px)',
              }}>
                {ev.category}
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
                <Calendar size={14} />
                <span>{ev.startDate} {ev.endDate && ev.endDate !== ev.startDate && `to ${ev.endDate}`}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {ev.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                {ev.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} />
                  <span>{ev.time || 'All Day Event'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} />
                  <span>{ev.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
