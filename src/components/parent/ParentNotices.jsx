import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { BellRing, Tag, Calendar, User, Users } from 'lucide-react';

export const ParentNotices = () => {
  const { notices } = useSchoolData();

  const parentNotices = notices.filter(
    (n) => n.target === 'ALL' || n.target === 'PARENT'
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Parent Bulletins & PTM Circulars</h1>
          <p className="page-subtitle">
            School board announcements, parent-teacher conference schedules and institutional updates.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {parentNotices.map((notice) => (
          <div
            key={notice.id}
            className="card-elevated"
            style={{
              padding: '1.5rem',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge-status ${notice.priority === 'Urgent' ? 'badge-urgent' : notice.priority === 'High' ? 'badge-late' : 'badge-active'}`}>
                    {notice.priority}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                    {notice.category}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{notice.date}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {notice.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {notice.content}
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.78rem',
              color: 'var(--primary)',
              fontWeight: '600',
            }}>
              <span>Issued By: {notice.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
