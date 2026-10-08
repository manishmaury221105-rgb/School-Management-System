import React, { useState, useRef, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  parseReportCardsFile,
  parseReportCardsCSV,
  SAMPLE_REPORT_CSV_CONTENT,
} from '../../utils/csvReportCardParser';
import { downloadReportCardPdf } from '../../utils/pdfReportCardGenerator';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Sparkles,
  Search,
  Check,
  FileText,
} from 'lucide-react';

export const GradebookManager = () => {
  const { examsData, uploadBulkReportCards, students, teachers, classes } = useSchoolData();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole === ROLES.ADMIN;

  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const defaultClass = activeTeacher?.classTeacherOf || activeTeacher?.assignedClasses?.[0] || 'Class 10-A';
  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const [examTitle, setExamTitle] = useState('Term 1 Half-Yearly Examinations 2026');
  const [parsedReports, setParsedReports] = useState(null);
  const [fileName, setFileName] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // All results currently stored in the system for this class
  const classReports = useMemo(() => {
    if (parsedReports && parsedReports.length > 0) return parsedReports;

    const resultsMap = examsData?.results || {};
    const list = Object.values(resultsMap).filter(r => {
      if (!r || typeof r !== 'object') return false;
      return (r.class && r.class === selectedClass) || (!r.class && selectedClass === 'Class 10-A');
    });

    // If none found in state for Class 10-A, provide parsed default sample
    if (list.length === 0 && selectedClass === 'Class 10-A') {
      return parseReportCardsCSV(SAMPLE_REPORT_CSV_CONTENT, students, examTitle);
    }
    return list;
  }, [parsedReports, examsData, selectedClass, students, examTitle]);

  const filteredReports = classReports.filter(r =>
    (r.studentName && r.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.rollNo && String(r.rollNo).includes(searchTerm))
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
      try {
        const parsed = await parseReportCardsFile(file, students, examTitle);
        if (parsed && parsed.length > 0) {
          setParsedReports(parsed);
        } else {
          alert('Could not parse student records. Please ensure column headers like RollNo, StudentName, and Subject names exist.');
        }
      } catch (err) {
        console.error('File parse error:', err);
        alert('Failed to read file. Please select a valid .xlsx or .csv file.');
      }
    }
  };

  const handleLoadSampleCSV = () => {
    setFileName('sample_class_10a_report_cards.xlsx');
    const parsed = parseReportCardsCSV(SAMPLE_REPORT_CSV_CONTENT, students, examTitle);
    setParsedReports(parsed);
  };

  const handleSaveAndPublish = () => {
    const reportsToSave = parsedReports || classReports;
    if (!reportsToSave || reportsToSave.length === 0) return;

    uploadBulkReportCards(reportsToSave, selectedClass, examTitle);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div className="page-header-wrap" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={26} color="var(--primary)" />
            <span>Excel / CSV Report Card Upload</span>
          </h1>
          <p className="page-subtitle">
            Upload the class report card marks in an Excel (.xlsx) or CSV file. Each student will automatically see only their own report card.
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.85rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#059669',
          fontWeight: '700',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
        }}>
          <CheckCircle2 size={18} />
          <span>Report card marks published! Enrolled students can now view their individual results.</span>
        </div>
      )}

      {/* Upload Box Card */}
      <div className="card-elevated" style={{ padding: '1.5rem', marginBottom: '1.75rem', border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--primary)" />
              <span>Upload Class Report Card File</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Select class, choose your CSV/Excel file, and publish in 1-click.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleCSV}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Load Sample Class 10-A CSV</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Select Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setParsedReports(null);
                setFileName('');
              }}
              style={{ width: '100%', fontWeight: '700' }}
            >
              {classes?.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name} {c.name === defaultClass ? '★ (My Class)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Exam Title / Session:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g. Term 1 Half-Yearly Examinations 2026"
              style={{ width: '100%', fontWeight: '600' }}
            />
          </div>
        </div>

        {/* Drag & Drop / File Picker Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: fileName ? '2px solid var(--primary)' : '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 1rem',
            textAlign: 'center',
            background: fileName ? 'rgba(79, 70, 229, 0.04)' : 'var(--bg-input)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem',
          }}>
            <FileSpreadsheet size={24} />
          </div>

          {fileName ? (
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--primary)' }}>
                ✓ Selected File: {fileName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {parsedReports ? `${parsedReports.length} student report cards parsed successfully` : 'Click to choose another file'}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Click to Choose or Drag & Drop Excel (.xlsx) / CSV File
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports Microsoft Excel (.xlsx, .xls) and .csv files with columns: RollNo, StudentName, Mathematics, Physics, etc.
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={!parsedReports && classReports.length === 0}
            className="btn-primary"
            style={{
              padding: '8px 20px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} />
            <span>Publish & Save Report Cards ({parsedReports ? parsedReports.length : classReports.length} Students)</span>
          </button>
        </div>
      </div>

      {/* Sample Format Preview Card */}
      <div className="card-elevated" style={{ padding: '1.25rem', marginBottom: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.95rem' }}>Sample Excel / CSV Format Structure</strong>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Excel me columns banayein aur "Save As &rarr; CSV" karke yaha upload karein
          </span>
        </div>

        <div style={{ overflowX: 'auto', background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)', color: 'var(--primary)', fontWeight: '800' }}>
                <th style={{ padding: '6px 8px' }}>RollNo</th>
                <th style={{ padding: '6px 8px' }}>StudentName</th>
                <th style={{ padding: '6px 8px' }}>Class</th>
                <th style={{ padding: '6px 8px' }}>Mathematics</th>
                <th style={{ padding: '6px 8px' }}>Physics</th>
                <th style={{ padding: '6px 8px' }}>Chemistry</th>
                <th style={{ padding: '6px 8px' }}>English</th>
                <th style={{ padding: '6px 8px' }}>ComputerScience</th>
                <th style={{ padding: '6px 8px' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '6px 8px', fontWeight: '700' }}>1</td>
                <td style={{ padding: '6px 8px' }}>Aarav Sharma</td>
                <td style={{ padding: '6px 8px' }}>Class 10-A</td>
                <td style={{ padding: '6px 8px' }}>96</td>
                <td style={{ padding: '6px 8px' }}>92</td>
                <td style={{ padding: '6px 8px' }}>89</td>
                <td style={{ padding: '6px 8px' }}>93</td>
                <td style={{ padding: '6px 8px' }}>98</td>
                <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>Outstanding academic consistency</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '6px 8px', fontWeight: '700' }}>2</td>
                <td style={{ padding: '6px 8px' }}>Diya Patel</td>
                <td style={{ padding: '6px 8px' }}>Class 10-A</td>
                <td style={{ padding: '6px 8px' }}>88</td>
                <td style={{ padding: '6px 8px' }}>85</td>
                <td style={{ padding: '6px 8px' }}>91</td>
                <td style={{ padding: '6px 8px' }}>94</td>
                <td style={{ padding: '6px 8px' }}>90</td>
                <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>Excellent creative writing & science</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', fontWeight: '700' }}>3</td>
                <td style={{ padding: '6px 8px' }}>Kabir Verma</td>
                <td style={{ padding: '6px 8px' }}>Class 10-A</td>
                <td style={{ padding: '6px 8px' }}>94</td>
                <td style={{ padding: '6px 8px' }}>89</td>
                <td style={{ padding: '6px 8px' }}>92</td>
                <td style={{ padding: '6px 8px' }}>86</td>
                <td style={{ padding: '6px 8px' }}>95</td>
                <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>Great problem solving skills</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Roster / Student Results Table */}
      <div className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
              Student Report Card Records ({selectedClass})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Each student in this list will automatically see only their own row and marksheet when they log in.
            </p>
          </div>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by name / roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '32px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Subject Breakdown</th>
                <th>Teacher Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '800', color: 'var(--primary)' }}>
                      #{item.rollNo}
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {item.studentName}
                      </div>
                    </td>
                    <td>{item.class || selectedClass}</td>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>
                        {item.totalMarks} / {item.maxTotal || (item.subjects?.length ? item.subjects.length * 100 : 500)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', color: '#10b981' }}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        background: item.grade === 'A+' ? '#dcfce7' : item.grade === 'A' ? '#e0f2fe' : '#fef3c7',
                        color: item.grade === 'A+' ? '#15803d' : item.grade === 'A' ? '#0369a1' : '#b45309',
                      }}>
                        {item.grade}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '280px' }}>
                        {item.subjects?.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              background: 'var(--bg-input)',
                              borderRadius: '4px',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {s.name}: <strong>{s.marks}</strong>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                      {item.remarks}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => downloadReportCardPdf(item)}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Download official PDF report card for this student"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No report card records found for {selectedClass}. Upload an Excel/CSV file above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
