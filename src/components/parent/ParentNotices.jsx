import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { BellRing, Tag, Calendar, User, Users, Filter } from 'lucide-react';

export const ParentNotices = () => {
  const { notices } = useSchoolData();
  const [filterType, setFilterType] = useState('ALL');

  const parentNotices = notices.filter((n) => {
    if (!n) return false;
    const tgt = String(n.target || 'ALL').trim().toUpperCase();
    const isTarget = (
      tgt === 'ALL' ||
      tgt === 'EVERYONE' ||
      tgt === 'PARENT' ||
      tgt === 'PARENTS' ||
      tgt === 'STUDENT'
    );
    if (!isTarget) return false;

    if (filterType === 'PTM') {
      return (n.category || '').toUpperCase() === 'PTM' || (n.category || '').toUpperCase() === 'EXAMS';
    }
    if (filterType === 'URGENT') {
      return n.priority === 'Urgent' || n.priority === 'High';
    }
    return true;
  });

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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterType('ALL')}
          className={filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          All Circulars ({notices.length})
        </button>
        <button
          onClick={() => setFilterType('PTM')}
          className={filterType === 'PTM' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          PTM & Academic Reports
        </button>
        <button
          onClick={() => setFilterType('URGENT')}
          className={filterType === 'URGENT' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Urgent Alerts
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {parentNotices.map((notice) => {
          const isUrgent = notice.priority === 'Urgent';
          const isHigh = notice.priority === 'High';
          return (
            <div
              key={notice.id}
              className="card-elevated"
              style={{
                padding: '1.5rem',
                border: isUrgent ? '1.5px solid #ef4444' : '1px solid var(--border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge-status ${isUrgent ? 'badge-urgent' : isHigh ? 'badge-late' : 'badge-active'}`}>
                      {notice.priority || 'Normal'}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                      {notice.category || 'General'}
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
                borderTop: '1px solid var(--border)',
                fontSize: '0.78rem',
                color: 'var(--primary)',
                fontWeight: '700',
              }}>
                <span>Issued By: {notice.author || 'Administration'}</span>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-input)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  Target: {notice.target || 'ALL'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
