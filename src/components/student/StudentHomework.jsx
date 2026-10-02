import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Award,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const StudentHomework = () => {
  const { currentUser } = useAuth();
  const { homework, submitHomework } = useSchoolData();
  const [filter, setFilter] = useState('ALL');
  const [selectedHwForSubmit, setSelectedHwForSubmit] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const studentId = currentUser?.id || 'user-student-1';
  const studentClass = currentUser?.class || 'Class 10-A';

  const myHomeworkList = homework.filter(h => h.class === studentClass);

  const filteredList = myHomeworkList.filter((hw) => {
    const isSubmitted = !!hw.studentStatus?.[studentId]?.submitted;
    if (filter === 'PENDING') return !isSubmitted;
    if (filter === 'SUBMITTED') return isSubmitted;
    return true;
  });

  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!selectedHwForSubmit) return;

    submitHomework(selectedHwForSubmit.id, studentId, submissionNotes || 'Completed and uploaded.');
    setSelectedHwForSubmit(null);
    setSubmissionNotes('');
    setFileUploaded(false);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Homework & Assignments</h1>
          <p className="page-subtitle">
            Track daily academic tasks, upload problem set submissions & view faculty feedback.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          gap: '2px'
        }}>
          <button
            onClick={() => setFilter('ALL')}
            className={`role-switch-btn ${filter === 'ALL' ? 'active' : ''}`}
          >
            All Tasks ({myHomeworkList.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`role-switch-btn ${filter === 'PENDING' ? 'active' : ''}`}
          >
            Pending ({myHomeworkList.filter(h => !h.studentStatus?.[studentId]?.submitted).length})
          </button>
          <button
            onClick={() => setFilter('SUBMITTED')}
            className={`role-switch-btn ${filter === 'SUBMITTED' ? 'active' : ''}`}
          >
            Completed ({myHomeworkList.filter(h => h.studentStatus?.[studentId]?.submitted).length})
          </button>
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredList.map((hw) => {
          const submission = hw.studentStatus?.[studentId];
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

                {/* Teacher Feedback if graded */}
                {submission?.grade && (
                  <div style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#065f46' }}>TEACHER GRADE:</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#047857' }}>{submission.grade}</span>
                    </div>
                    {submission.feedback && (
                      <div style={{ fontSize: '0.8rem', color: '#065f46', fontStyle: 'italic' }}>
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
                  By: {hw.assignedBy}
                </span>

                {isSubmitted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: '700', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Submitted</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedHwForSubmit(hw)}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    <UploadCloud size={15} />
                    <span>Submit Solution</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Homework Submission Modal */}
      {selectedHwForSubmit && (
        <Modal
          isOpen={!!selectedHwForSubmit}
          onClose={() => setSelectedHwForSubmit(null)}
          title={`Submit Assignment: ${selectedHwForSubmit.title}`}
        >
          <form onSubmit={handleSubmitHomework} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <strong>Subject:</strong> {selectedHwForSubmit.subject} • <strong>Due:</strong> {selectedHwForSubmit.dueDate}
            </div>

            {/* File Upload Simulator Box */}
            <div
              onClick={() => setFileUploaded(true)}
              style={{
                border: fileUploaded ? '2px solid #10b981' : '2px dashed var(--border)',
                background: fileUploaded ? '#ecfdf5' : 'var(--bg-input)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <UploadCloud size={36} color={fileUploaded ? '#10b981' : 'var(--primary)'} style={{ margin: '0 auto 8px auto' }} />
              {fileUploaded ? (
                <div>
                  <div style={{ fontWeight: '800', color: '#047857' }}>
                    ✓ math_solutions_rohan_sharma.pdf Attached!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '2px' }}>
                    2.4 MB • Ready for submission
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    Click to browse files (PDF, DOCX, Images)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Max upload size: 25 MB
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Student Submission Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add comments or query for Mrs. Sarah Jenkins..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setSelectedHwForSubmit(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Turn In Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
