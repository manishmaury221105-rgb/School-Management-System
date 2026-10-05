import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { downloadReportCardPdf, printReportCardPdf } from '../../utils/pdfReportCardGenerator';
import {
  Award,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
  User,
  GraduationCap,
  Check,
} from 'lucide-react';

export const StudentExams = () => {
  const { currentUser } = useAuth();
  const { examsData } = useSchoolData();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const studentName = currentUser?.name || 'Aarav Sharma';
  const studentClass = currentUser?.class || 'Class 10-A';
  const studentRollNo = String(currentUser?.rollNo || '1');
  const studentId = currentUser?.id || 'user-student-default';

  // Find this specific student's report card from examsData
  const myReport = useMemo(() => {
    const results = examsData?.results || {};

    // 1. Direct ID match
    if (results[studentId]) return results[studentId];

    // 2. Class + Roll match
    const classRollKey = `${studentClass}_roll_${studentRollNo}`;
    if (results[classRollKey]) return results[classRollKey];

    // 3. Name key match
    const nameKey = `name_${studentName.trim().toLowerCase()}`;
    if (results[nameKey]) return results[nameKey];

    // 4. Search in all records
    const allRecords = Object.values(results);
    const found = allRecords.find(r => {
      if (!r || typeof r !== 'object') return false;
      const matchRoll = r.rollNo && String(r.rollNo) === String(studentRollNo);
      const matchClass = !r.class || r.class === studentClass;
      const matchName = r.studentName && r.studentName.trim().toLowerCase() === studentName.trim().toLowerCase();
      return (matchRoll && matchClass) || matchName;
    });

    if (found) return found;

    // Default fallback for demo student Aarav Sharma (Roll #1, Class 10-A)
    if (studentRollNo === '1' || studentName.includes('Aarav') || studentId.includes('default')) {
      return {
        studentName: studentName,
        class: studentClass,
        rollNo: studentRollNo,
        examTitle: 'Term 1 Half-Yearly Examinations 2026',
        totalMarks: 468,
        maxTotal: 500,
        percentage: 93.6,
        gpa: 3.9,
        grade: 'A+',
        remarks: 'Outstanding academic consistency and coding logic in term evaluation.',
        subjects: [
          { name: 'Mathematics', marks: 96, maxMarks: 100, grade: 'A+', remarks: 'Outstanding' },
          { name: 'Physics', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Excellent lab skills' },
          { name: 'Chemistry', marks: 89, maxMarks: 100, grade: 'A', remarks: 'Good conceptual clarity' },
          { name: 'English', marks: 93, maxMarks: 100, grade: 'A+', remarks: 'Commendable creative writing' },
          { name: 'Computer Science', marks: 98, maxMarks: 100, grade: 'A+', remarks: 'Exceptional coding logic' },
        ],
      };
    }

    return null;
  }, [examsData, studentId, studentClass, studentRollNo, studentName]);

  const handleDownload = () => {
    if (!myReport) return;
    const ok = downloadReportCardPdf(myReport);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    if (myReport) {
      printReportCardPdf(myReport);
    } else {
      window.print();
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div className="page-header-wrap" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={26} color="var(--primary)" />
            <span>My Academic Report Card</span>
          </h1>
          <p className="page-subtitle">
            {studentName} • {studentClass} • Official Term Marksheet & Performance Record
          </p>
        </div>

        {myReport && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleDownload}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: downloadSuccess ? '#10b981' : 'var(--primary)',
                transition: 'all 0.2s ease',
              }}
            >
              {downloadSuccess ? <Check size={16} /> : <Download size={16} />}
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Report Card (PDF)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>

      {myReport ? (
        <div>
          {/* Main Summary Card */}
          <div
            className="card-elevated"
            style={{
              padding: '1.75rem',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.08))',
              border: '1.5px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  OFFICIAL MARKSHEET • {myReport.examTitle || 'Term 1 Examinations 2026'}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
                  {myReport.studentName || studentName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Class: <strong>{myReport.class || studentClass}</strong> • Roll Number: <strong>#{myReport.rollNo || studentRollNo}</strong>
                </div>
              </div>

              {/* KPI Scores */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL SCORE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {myReport.totalMarks} / {myReport.maxTotal || 500}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>PERCENTAGE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>
                    {myReport.percentage}%
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>OVERALL GRADE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {myReport.grade || 'A+'}
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Box */}
            {myReport.remarks && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Class Faculty Remarks: </strong>
                "{myReport.remarks}"
              </div>
            )}
          </div>

          {/* Subject-Wise Marks Breakdown Table */}
          <div className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Subject-Wise Performance Breakdown
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Marks Scored</th>
                    <th>Maximum Marks</th>
                    <th>Grade</th>
                    <th>Performance Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {myReport.subjects?.map((sub, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {sub.name}
                      </td>
                      <td>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
                          {sub.marks}
                        </span>
                      </td>
                      <td>{sub.maxMarks || 100}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          background: sub.grade === 'A+' ? '#dcfce7' : sub.grade === 'A' ? '#e0f2fe' : '#fef3c7',
                          color: sub.grade === 'A+' ? '#15803d' : sub.grade === 'A' ? '#0369a1' : '#b45309',
                        }}>
                          {sub.grade}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {sub.remarks || 'Satisfactory'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State if Teacher has not uploaded yet */
        <div
          className="card-elevated"
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            border: '2px dashed var(--border)',
            background: 'var(--bg-card)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <FileText size={32} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Report Card Not Yet Published for {studentName} ({studentClass})
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto' }}>
            Your class teacher will upload the examination marksheet file. Once uploaded, your individual report card will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
};
