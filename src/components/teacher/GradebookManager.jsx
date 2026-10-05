import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  Award,
  Edit,
  Save,
  Check,
  TrendingUp,
  Search,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const GradebookManager = () => {
  const { examsData, updateStudentMarks, students, teachers } = useSchoolData();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole === ROLES.ADMIN;

  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const teacherClasses = useMemo(() => {
    const list = [];
    if (activeTeacher?.classTeacherOf) list.push(activeTeacher.classTeacherOf);
    if (Array.isArray(activeTeacher?.assignedClasses)) {
      activeTeacher.assignedClasses.forEach(c => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list.length > 0 ? list : ['Class 10-A'];
  }, [activeTeacher]);

  const classStudents = useMemo(() => {
    if (isAdmin) return students;
    return students.filter(s => teacherClasses.includes(s.class));
  }, [isAdmin, students, teacherClasses]);

  const [selectedStudentId, setSelectedStudentId] = useState(() => classStudents[0]?.id || 'user-student-default');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [toastSuccess, setToastSuccess] = useState(false);

  const selectedStudent = classStudents.find(s => s.id === selectedStudentId) || classStudents[0];
  const studentResult = examsData.results[selectedStudentId] || examsData.results['user-student-default'] || examsData.results['user-student-1'] || {
    totalMarks: 462,
    maxTotal: 500,
    percentage: 92.4,
    gpa: 3.9,
    subjects: [
      { name: 'Mathematics', marks: 95, maxMarks: 100, grade: 'A+', remarks: 'Outstanding problem solving' },
      { name: 'Physics', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Good conceptual clarity' },
      { name: 'Chemistry', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Excellent lab performance' },
      { name: 'English', marks: 89, maxMarks: 100, grade: 'A', remarks: 'Commendable creative writing' },
      { name: 'Computer Science', marks: 98, maxMarks: 100, grade: 'A+', remarks: 'Exceptional coding logic' },
    ],
  };

  const handleEditSubject = (subj) => {
    setSelectedSubject(subj);
    setMarksInput(subj.marks.toString());
    setRemarksInput(subj.remarks || '');
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    updateStudentMarks(selectedStudentId, selectedSubject.name, marksInput, remarksInput);
    setSelectedSubject(null);
    setToastSuccess(true);
    setTimeout(() => setToastSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Examination & Gradebook Portal</h1>
          <p className="page-subtitle">
            Enter assessment marks, compute percentage, GPA and issue academic report remarks.
          </p>
        </div>
      </div>

      {toastSuccess && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '700',
        }}>
          <Check size={18} />
          <span>Student marks and GPA updated successfully!</span>
        </div>
      )}

      {/* Select Student Selector */}
      <div className="card-elevated" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            SELECT STUDENT ROSTER
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{ fontWeight: '700', minWidth: '240px' }}
          >
            {classStudents.map((stu) => (
              <option key={stu.id} value={stu.id}>
                {stu.name} ({stu.class} • Roll #{stu.rollNo})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL SCORE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {studentResult?.totalMarks} / {studentResult?.maxTotal}
            </div>
          </div>

          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PERCENTAGE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
              {studentResult?.percentage}%
            </div>
          </div>

          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700' }}>CUMULATIVE GPA</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
              {studentResult?.gpa} / 4.0
            </div>
          </div>
        </div>
      </div>

      {/* Subject Marks Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>
            {studentResult?.examTitle} Report Card Marks
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Class Rank: <strong>#{studentResult?.rank}</strong> of {studentResult?.totalStudentsInClass} Students
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Obtained</th>
                <th>Max Marks</th>
                <th>Grade</th>
                <th>Class High</th>
                <th>Teacher Remarks</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentResult?.subjects?.map((sub, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '800' }}>{sub.name}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {sub.marks}
                    </span>
                  </td>
                  <td>{sub.maxMarks}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      background: sub.grade === 'A+' ? '#dcfce7' : sub.grade === 'A' ? '#e0f2fe' : '#fef3c7',
                      color: sub.grade === 'A+' ? '#15803d' : sub.grade === 'A' ? '#0369a1' : '#b45309',
                    }}>
                      {sub.grade}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{sub.highestMarks}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {sub.remarks}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleEditSubject(sub)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      <Edit size={13} />
                      <span>Edit Marks</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Marks Modal */}
      {selectedSubject && (
        <Modal
          isOpen={!!selectedSubject}
          onClose={() => setSelectedSubject(null)}
          title={`Edit Marks: ${selectedSubject.name}`}
        >
          <form onSubmit={handleSaveMarks} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Marks Scored (Out of 100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={marksInput}
                onChange={(e) => setMarksInput(e.target.value)}
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject Performance Remarks
              </label>
              <textarea
                rows={3}
                value={remarksInput}
                onChange={(e) => setRemarksInput(e.target.value)}
                placeholder="e.g. Excellent problem solving skills in final section."
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setSelectedSubject(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update & Recompute GPA
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
