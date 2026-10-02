import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const ParentHomework = () => {
  const { students, homework, selectedChildId } = useSchoolData();

  const child = students.find(s => s.id === selectedChildId) || students[0];
  const childHomework = homework.filter(h => h.class === child?.class);

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">{child?.name}'s Homework Tracker</h1>
          <p className="page-subtitle">
            Monitor daily subject assignments, submission deadlines and review teacher grading feedback.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {childHomework.map((hw) => {
          const submission = hw.studentStatus?.[child?.id];
          const isSubmitted = !!submission?.submitted;
          return (
            <div
              key={hw.id}
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
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                  }}>
                    {hw.subject}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: isSubmitted ? '#15803d' : '#b91c1c', fontWeight: '700' }}>
                    <Clock size={13} />
                    <span>Due: {hw.dueDate}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {hw.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {hw.description}
                </p>

                {submission?.grade && (
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#065f46' }}>
                      Teacher Grade: {submission.grade}
                    </div>
                    {submission.feedback && (
                      <div style={{ fontSize: '0.78rem', color: '#065f46', fontStyle: 'italic', marginTop: '2px' }}>
                        "{submission.feedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Assigned by {hw.assignedBy}
                </span>

                <span className={`badge-status ${isSubmitted ? 'badge-present' : 'badge-absent'}`}>
                  {isSubmitted ? '✓ Submitted' : 'Pending Action'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
