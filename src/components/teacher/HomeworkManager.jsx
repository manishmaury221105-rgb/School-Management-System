import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  FileText,
  User,
} from 'lucide-react';

export const HomeworkManager = () => {
  const { homework, addHomework, gradeHomework, students, teachers } = useSchoolData();
  const { currentUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHwForSubmissions, setSelectedHwForSubmissions] = useState(null);

  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const teacherClasses = React.useMemo(() => {
    const list = [];
    if (activeTeacher?.classTeacherOf) list.push(activeTeacher.classTeacherOf);
    if (Array.isArray(activeTeacher?.assignedClasses)) {
      activeTeacher.assignedClasses.forEach(c => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list.length > 0 ? list : ['Class 10-A'];
  }, [activeTeacher]);

  const defaultClass = activeTeacher?.classTeacherOf || teacherClasses[0] || 'Class 10-A';

  // Grade submission modal state
  const [gradeModalStudent, setGradeModalStudent] = useState(null);
  const [gradeInput, setGradeInput] = useState('A+');
  const [feedbackInput, setFeedbackInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    class: defaultClass,
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    description: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    addHomework({
      ...formData,
      class: formData.class || defaultClass,
      assignedBy: currentUser?.name || activeTeacher?.name || 'Faculty Member',
    });
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      subject: 'Mathematics',
      class: defaultClass,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      description: '',
    });
  };

  const handleOpenGradeModal = (student, hw) => {
    setGradeModalStudent({ student, hw });
    const currentGrade = hw.studentStatus?.[student.id]?.grade || 'A';
    const currentFeedback = hw.studentStatus?.[student.id]?.feedback || 'Good attempt!';
    setGradeInput(currentGrade);
    setFeedbackInput(currentFeedback);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!gradeModalStudent) return;
    gradeHomework(
      gradeModalStudent.hw.id,
      gradeModalStudent.student.id,
      gradeInput,
      feedbackInput
    );
    setGradeModalStudent(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Homework & Assignments</h1>
          <p className="page-subtitle">
            Create learning tasks, set submission deadlines, review student work & provide feedback.
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Homework Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {homework.map((hw) => {
          const submissionPercent = Math.round((hw.totalSubmissions / (hw.totalStudents || 32)) * 100);
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
                    {hw.subject} • {hw.class}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#b91c1c', fontWeight: '700' }}>
                    <Clock size={13} />
                    <span>Due: {hw.dueDate}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {hw.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
                  {hw.description}
                </p>

                {/* Submission Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Student Submissions</span>
                    <span>{hw.totalSubmissions} / {hw.totalStudents || 32} ({submissionPercent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${submissionPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
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
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Assigned: {hw.assignedDate}
                </span>
                <button
                  onClick={() => setSelectedHwForSubmissions(hw)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Review Submissions ({hw.totalSubmissions})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Homework Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Homework Assignment"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 6 - Trigonometry Problem Set"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class / Section
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                style={{ width: '100%' }}
              >
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} {cls === activeTeacher?.classTeacherOf ? '★ (Class Teacher)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Submission Deadline (Due Date) *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Instructions & Questions *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detail the questions, textbook pages, or lab steps..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Assign to Class
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      {selectedHwForSubmissions && (
        <Modal
          isOpen={!!selectedHwForSubmissions}
          onClose={() => setSelectedHwForSubmissions(null)}
          title={`Submissions: ${selectedHwForSubmissions.title}`}
          maxWidth="720px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {selectedHwForSubmissions.subject} • {selectedHwForSubmissions.class} • Due: {selectedHwForSubmissions.dueDate}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                    <th>Grade</th>
                    <th style={{ textAlign: 'right' }}>Grade / Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => s.class === selectedHwForSubmissions.class)
                    .map((stu) => {
                      const submission = selectedHwForSubmissions.studentStatus?.[stu.id];
                      const isSubmitted = !!submission?.submitted;
                      return (
                        <tr key={stu.id}>
                          <td>
                            <div style={{ fontWeight: '700' }}>{stu.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll #{stu.rollNo}</div>
                          </td>
                          <td>
                            <span className={`badge-status ${isSubmitted ? 'badge-present' : 'badge-absent'}`}>
                              {isSubmitted ? 'Submitted' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {submission?.submittedAt || '—'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: '800', color: submission?.grade ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {submission?.grade || 'Not Graded'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => handleOpenGradeModal(stu, selectedHwForSubmissions)}
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Award size={13} />
                              <span>{submission?.grade ? 'Edit Grade' : 'Grade'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setSelectedHwForSubmissions(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Grade Input Modal */}
      {gradeModalStudent && (
        <Modal
          isOpen={!!gradeModalStudent}
          onClose={() => setGradeModalStudent(null)}
          title={`Grade Submission: ${gradeModalStudent.student.name}`}
        >
          <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Award Letter Grade *
              </label>
              <select
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                style={{ width: '100%', fontWeight: '700' }}
              >
                <option value="A+">A+ (Exceptional / 95-100%)</option>
                <option value="A">A (Excellent / 85-94%)</option>
                <option value="B+">B+ (Very Good / 75-84%)</option>
                <option value="B">B (Good / 65-74%)</option>
                <option value="C">C (Satisfactory / 50-64%)</option>
                <option value="F">F (Needs Improvement / &lt;50%)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Teacher Remarks & Constructive Feedback
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Well organized solution, step 4 arithmetic was very clean."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setGradeModalStudent(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Grade & Feedback
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
