import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { BellRing, Tag, Calendar, User, AlertCircle, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const StudentNotices = () => {
  const { notices } = useSchoolData();
  const { currentUser } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Case-insensitive, robust audience matching for current student
  const studentNotices = notices.filter((n) => {
    if (!n) return false;
    const tgt = String(n.target || 'ALL').trim().toUpperCase();
    const userClass = String(currentUser?.class || '').trim().toUpperCase();

    const isMatch = (
      tgt === 'ALL' ||
      tgt === 'EVERYONE' ||
      tgt === 'STUDENT' ||
      tgt === 'STUDENTS' ||
      tgt === 'STUDENTS & TEACHERS' ||
      (userClass && tgt === userClass)
    );

    if (!isMatch) return false;

    if (selectedFilter === 'EXAMS') {
      return (n.category || '').toUpperCase() === 'EXAMS' || (n.category || '').toUpperCase() === 'ACADEMIC';
    }
    if (selectedFilter === 'SPORTS') {
      return (n.category || '').toUpperCase() === 'SPORTS';
    }
    if (selectedFilter === 'URGENT') {
      return n.priority === 'Urgent' || n.priority === 'High';
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Notice Board & Circulars</h1>
          <p className="page-subtitle">
            Official circulars, examination alerts, holiday announcements and extracurricular bulletins.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={selectedFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          All Notices ({notices.length})
        </button>
        <button
          onClick={() => setSelectedFilter('EXAMS')}
          className={selectedFilter === 'EXAMS' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Exams & Academics
        </button>
        <button
          onClick={() => setSelectedFilter('SPORTS')}
          className={selectedFilter === 'SPORTS' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Sports & Competitions
        </button>
        <button
          onClick={() => setSelectedFilter('URGENT')}
          className={selectedFilter === 'URGENT' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Urgent Alerts
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {studentNotices.length > 0 ? (
          studentNotices.map((notice) => {
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
                  boxShadow: isUrgent ? '0 4px 14px rgba(239, 68, 68, 0.15)' : 'var(--shadow-xs)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge-status ${isUrgent ? 'badge-urgent' : isHigh ? 'badge-late' : 'badge-active'}`}>
                        {notice.priority || 'Normal'}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: 'var(--bg-input)',
                        color: 'var(--text-secondary)'
                      }}>
                        {notice.category || 'General'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notice.date}</span>
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
                  <span>Issued By: {notice.author || 'School Administration'}</span>
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
          })
        ) : (
          <div
            className="card-elevated"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              gridColumn: '1 / -1',
              color: 'var(--text-muted)'
            }}
          >
            <BellRing size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No Notices in this Category</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Check "All Notices" to see all current school circulars.</p>
          </div>
        )}
      </div>
    </div>
  );
};
