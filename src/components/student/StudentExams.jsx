import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  Award,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const StudentExams = () => {
  const { currentUser } = useAuth();
  const { examsData } = useSchoolData();
  const [activeTab, setActiveTab] = useState('report');
  const [showHallTicket, setShowHallTicket] = useState(false);

  const studentId = currentUser?.id || 'user-student-default';
  
  const defaultReport = {
    examTitle: 'Term 1 Half-Yearly Examinations 2026',
    studentName: currentUser?.name || 'Aarav Sharma',
    class: currentUser?.class || 'Class 10-A',
    rollNo: currentUser?.rollNo || '01',
    attendance: '96.5%',
    totalMarks: 468,
    maxTotal: 500,
    percentage: 93.6,
    gpa: 3.9,
    rank: 1,
    teacherRemarks: 'Exceptional academic consistency and active participation in science & math seminars.',
    subjects: [
      { name: 'Mathematics', marks: 96, maxMarks: 100, highestMarks: 98, grade: 'A+', remarks: 'Outstanding problem solving' },
      { name: 'Physics', marks: 92, maxMarks: 100, highestMarks: 95, grade: 'A+', remarks: 'Excellent lab performance' },
      { name: 'Chemistry', marks: 89, maxMarks: 100, highestMarks: 94, grade: 'A', remarks: 'Good conceptual clarity' },
      { name: 'English Literature', marks: 93, maxMarks: 100, highestMarks: 97, grade: 'A+', remarks: 'Commendable creative writing' },
      { name: 'Computer Science & AI', marks: 98, maxMarks: 100, highestMarks: 99, grade: 'A+', remarks: 'Exceptional coding logic' },
    ],
  };

  const defaultExamSchedule = {
    id: 'exam-mid-2026',
    title: 'Term 1 Half-Yearly Examinations 2026',
    startDate: 'October 20, 2026',
    endDate: 'October 28, 2026',
    schedule: [
      { date: '20 Oct 2026', subject: 'Advanced Mathematics', time: '09:00 AM - 12:00 PM', room: 'Hall A' },
      { date: '22 Oct 2026', subject: 'Physics & Lab Theory', time: '09:00 AM - 12:00 PM', room: 'Hall A' },
      { date: '24 Oct 2026', subject: 'Chemistry & Practical', time: '09:00 AM - 12:00 PM', room: 'Hall A' },
      { date: '26 Oct 2026', subject: 'English Literature & Grammar', time: '09:00 AM - 12:00 PM', room: 'Hall B' },
      { date: '28 Oct 2026', subject: 'Computer Science & AI Logic', time: '09:00 AM - 12:00 PM', room: 'Computer Lab 1' },
    ]
  };

  const report = examsData?.results?.[studentId] || examsData?.results?.['user-student-default'] || defaultReport;
  const midTermExam = examsData?.exams?.find(e => e.id === 'exam-mid-2026') || examsData?.exams?.[0] || defaultExamSchedule;

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Exams, Schedules & Report Card</h1>
          <p className="page-subtitle">
            Examination date sheets, digital hall ticket pass and term-wise academic performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('report')}
            className={activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}
          >
            <Award size={16} />
            <span>Academic Report Card</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={activeTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}
          >
            <Calendar size={16} />
            <span>Mid-Term Schedule</span>
          </button>
          <button
            onClick={() => setShowHallTicket(true)}
            className="btn-secondary"
            style={{ color: 'var(--primary)', fontWeight: '700' }}
          >
            <QrCode size={16} />
            <span>Hall Ticket</span>
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        /* Comprehensive Academic Report Card */
        <div>
          {/* Report Card Header Overview */}
          <div className="card-elevated" style={{
            padding: '1.75rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.08))',
            border: '1.5px solid var(--border)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  OFFICIAL TRANSCRIPT • {report?.examTitle}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>
                  {currentUser?.name || report?.studentName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Class: {currentUser?.class || report?.class} • Roll #{currentUser?.rollNo || report?.rollNo} • Attendance: {report?.attendance}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL MARKS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {report?.totalMarks} / {report?.maxTotal}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>PERCENTAGE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                    {report?.percentage}%
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>SEMESTER GPA</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {report?.gpa} / 4.0
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Remarks Box */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Class Teacher Remarks: </strong>
              "{report?.remarks}"
            </div>
          </div>

          {/* Subject-Wise Marks Table */}
          <div className="table-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks Scored</th>
                    <th>Max Marks</th>
                    <th>Letter Grade</th>
                    <th>Highest in Class</th>
                    <th>Subject Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.subjects?.map((sub, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '800' }}>{sub.name}</td>
                      <td>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
                          {sub.marks}
                        </span>
                      </td>
                      <td>{sub.maxMarks}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          background: sub.grade === 'A+' ? '#dcfce7' : '#e0f2fe',
                          color: sub.grade === 'A+' ? '#15803d' : '#0369a1',
                        }}>
                          {sub.grade}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{sub.highestMarks} / 100</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Upcoming Exam Date Sheet */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
                {midTermExam?.title}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Commencing from {midTermExam?.startDate} to {midTermExam?.endDate}
              </div>
            </div>
            <button onClick={() => setShowHallTicket(true)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              <Download size={15} />
              <span>Download Hall Ticket</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {midTermExam?.schedule?.map((item, idx) => (
              <div
                key={idx}
                className="card-elevated"
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {item.date}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-input)' }}>
                    {item.room}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>
                  {item.subject}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Hall Ticket Modal */}
      {showHallTicket && (
        <Modal
          isOpen={showHallTicket}
          onClose={() => setShowHallTicket(false)}
          title="Digital Examination Hall Ticket"
        >
          <div className="receipt-sheet">
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>ST. XAVIER ACADEMY</h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>OFFICIAL ADMIT CARD • MID-TERM EXAMS 2026</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4f46e5', marginTop: '6px' }}>
                CANDIDATE ROLL NO: #{currentUser?.rollNo || '18'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                alt="Student"
                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #000' }}
              />
              <div style={{ fontSize: '0.85rem' }}>
                <div><strong>Candidate:</strong> {currentUser?.name || 'Rohan Sharma'}</div>
                <div><strong>Class:</strong> {currentUser?.class || 'Class 10-A'}</div>
                <div><strong>Student ID:</strong> {currentUser?.studentId || 'STU-2026-1018'}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>EXAMINATION SUBJECTS:</div>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Oct 15: Mathematics (09:00 AM - Hall A)</li>
                <li>Oct 17: Physics (09:00 AM - Hall A)</li>
                <li>Oct 19: Chemistry (09:00 AM - Hall A)</li>
                <li>Oct 21: English Literature (09:00 AM - Hall B)</li>
                <li>Oct 24: Computer Science (09:00 AM - Computer Lab 1)</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Verified by Examination Controller<br />
                Security Barcode Encrypted
              </div>
              <QrCode size={40} color="#0f172a" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className="btn-primary">
                <Download size={15} />
                <span>Print Official Admit Card</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
