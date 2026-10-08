import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Award, Download, TrendingUp, BookOpen, Star, CheckCircle, Printer, Check } from 'lucide-react';
import { downloadReportCardPdf, printReportCardPdf } from '../../utils/pdfReportCardGenerator';

export const ParentAcademics = () => {
  const { students, examsData, selectedChildId } = useSchoolData();
  const [downloading, setDownloading] = useState(false);

  const child = students.find(s => s.id === selectedChildId) || students[0];
  
  const defaultReport = {
    studentName: child?.name || 'Aarav Sharma',
    class: child?.class || 'Class 10-A',
    rollNo: child?.rollNo || '01',
    examTitle: 'Term 1 Assessment Report Card',
    rank: 1,
    totalStudentsInClass: 32,
    attendance: `${child?.attendancePercent || 96}%`,
    totalMarks: 468,
    maxTotal: 500,
    percentage: 93.6,
    gpa: child?.gpa || 3.9,
    remarks: 'Consistent academic dedication, excellent subject clarity, and positive classroom participation.',
    subjects: [
      { name: 'Mathematics', marks: 96, maxMarks: 100, highestMarks: 98, grade: 'A+', remarks: 'Outstanding analytical skills' },
      { name: 'Physics', marks: 92, maxMarks: 100, highestMarks: 95, grade: 'A+', remarks: 'Strong laboratory precision' },
      { name: 'Chemistry', marks: 89, maxMarks: 100, highestMarks: 94, grade: 'A', remarks: 'Good grasp of equations' },
      { name: 'English Literature', marks: 93, maxMarks: 100, highestMarks: 97, grade: 'A+', remarks: 'Excellent essay composition' },
      { name: 'Computer Science', marks: 98, maxMarks: 100, highestMarks: 99, grade: 'A+', remarks: 'Superb programming fundamentals' },
    ],
  };

  const rawReport = examsData?.results?.[child?.id] || examsData?.results?.['user-student-default'] || defaultReport;
  const report = {
    ...rawReport,
    studentName: rawReport.studentName || child?.name,
    class: rawReport.class || child?.class,
    rollNo: rawReport.rollNo || child?.rollNo,
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReportCardPdf(report);
    } catch (err) {
      console.error('Report Card PDF error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 2500);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">{child?.name}'s Academic Progress</h1>
          <p className="page-subtitle">
            {child?.class} • Roll #{child?.rollNo} • Term 1 Assessment Report Card & Teacher Evaluation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => printReportCardPdf(report)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: downloading ? '#10b981' : 'var(--primary)' }}
          >
            {downloading ? <Check size={16} /> : <Download size={16} />}
            <span>{downloading ? 'Downloaded!' : 'Download Report Card (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Report Summary Card */}
      <div className="card-elevated" style={{
        padding: '1.75rem',
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(79, 70, 229, 0.08))',
        border: '1.5px solid var(--border)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-purple)', letterSpacing: '0.05em' }}>
              OFFICIAL EVALUATION • {report?.examTitle}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>
              {child?.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Class Rank: <strong>#{report?.rank}</strong> of {report?.totalStudentsInClass} Students • Attendance: {report?.attendance}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL SCORE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {report?.totalMarks} / {report?.maxTotal}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>PERCENTAGE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                {report?.percentage}%
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>CUMULATIVE GPA</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                {report?.gpa} / 4.0
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Teacher Remarks & Evaluation: </strong>
          "{report?.remarks}"
        </div>
      </div>

      {/* Marks Table */}
      <div className="table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Scored</th>
                <th>Max Marks</th>
                <th>Grade</th>
                <th>Class High</th>
                <th>Remarks</th>
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
  );
};
