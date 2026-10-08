import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { triggerCsvDownload } from '../../utils/csvDownloadHelper';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Users,
  CalendarCheck,
  CreditCard,
  Award,
  BookOpen,
  Bus,
  Book,
  UserCheck,
} from 'lucide-react';

export const ReportsCenter = () => {
  const { students, teachers, fees, attendance, staffAttendance, examsData, books, transportRoutes, homework } = useSchoolData();
  const [reportType, setReportType] = useState('STUDENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('ALL');

  const handleExportCSV = async (filename, headers, rows) => {
    const csvContent = [headers.join(',')].concat(rows.map(r => r.join(','))).join('\n');
    await triggerCsvDownload(csvContent, `${filename}_${new Date().toISOString().split('T')[0]}.csv`, `${filename} Report Export`);
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'STUDENT': {
        const filtered = students.filter(s =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.class.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Student Enrollment & Performance Report</h3>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_students_report',
                    ['ID', 'AdmissionNo', 'Name', 'Class', 'Roll', 'Attendance', 'GPA', 'FeeStatus', 'Guardian'],
                    filtered.map(s => [s.studentId, s.admissionNo || 'ADM', `"${s.name}"`, s.class, s.rollNo, `${s.attendancePercent}%`, s.gpa || '3.8', s.feeStatus, `"${s.parentName}"`])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID / Adm #</th>
                  <th>Class</th>
                  <th>Roll</th>
                  <th>Attendance</th>
                  <th>GPA</th>
                  <th>Fee Status</th>
                  <th>Guardian</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td style={{ fontFamily: 'monospace' }}>{s.studentId}</td>
                    <td>{s.class}</td>
                    <td>#{s.rollNo}</td>
                    <td><span style={{ color: '#15803d', fontWeight: '700' }}>{s.attendancePercent}%</span></td>
                    <td><strong>{s.gpa || '3.8'}</strong></td>
                    <td><span className={`badge-status ${s.feeStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>{s.feeStatus}</span></td>
                    <td>{s.parentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'FEES': {
        const filtered = fees.filter(f =>
          f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.feeType.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Institutional Fee Ledger & Invoices</h3>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_fees_report',
                    ['InvoiceID', 'Student', 'Class', 'FeeType', 'Amount', 'DueDate', 'Status', 'ReceiptNo'],
                    filtered.map(f => [f.id, `"${f.studentName}"`, f.class, `"${f.feeType}"`, f.amount, f.dueDate, f.status, f.receiptNo || 'Unpaid'])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Fee Particulars</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Receipt No</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.studentName}</strong></td>
                    <td>{f.class}</td>
                    <td>{f.feeType}</td>
                    <td><strong style={{ fontSize: '1rem' }}>${f.amount}</strong></td>
                    <td>{f.dueDate}</td>
                    <td><span className={`badge-status ${f.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>{f.status}</span></td>
                    <td style={{ fontFamily: 'monospace' }}>{f.receiptNo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'TEACHER': {
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Faculty Staff & Salary Report</h3>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_teachers_report',
                    ['TeacherID', 'Name', 'Subject', 'Experience', 'Qualification', 'Salary', 'Status'],
                    teachers.map(t => [t.teacherId || 'TCH', `"${t.name}"`, `"${t.subject}"`, `"${t.experience}"`, `"${t.qualification || 'M.Sc'}"`, t.salary || '65000', t.status])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Member</th>
                  <th>Subject Focus</th>
                  <th>Assigned Classes</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Annual Remuneration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td><span style={{ color: 'var(--primary)', fontWeight: '700' }}>{t.subject}</span></td>
                    <td>{t.assignedClasses?.join(', ')}</td>
                    <td>{t.qualification || 'M.Sc. B.Ed.'}</td>
                    <td>{t.experience}</td>
                    <td><strong>${t.salary?.toLocaleString() || '65,000'}</strong></td>
                    <td><span className="badge-status badge-present">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'LIBRARY': {
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Library Inventory & Lending Audit</h3>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_library_report',
                    ['BookID', 'Title', 'Author', 'Category', 'TotalCopies', 'AvailableCopies', 'Rack'],
                    books.map(b => [b.bookId, `"${b.title}"`, `"${b.author}"`, b.category, b.quantity, b.availableCopies, b.rackNumber || 'M-01'])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Book ID</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.title}</strong></td>
                    <td style={{ fontFamily: 'monospace' }}>{b.bookId}</td>
                    <td>{b.author}</td>
                    <td>{b.category}</td>
                    <td>{b.rackNumber}</td>
                    <td><strong>{b.availableCopies} / {b.quantity} Available</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'STUDENT_ATTENDANCE': {
        const studentAttendanceRows = [];
        Object.entries(attendance || {}).forEach(([cls, datesMap]) => {
          Object.entries(datesMap || {}).forEach(([dateStr, stuMap]) => {
            if (filterMonth !== 'ALL' && !dateStr.startsWith(filterMonth)) return;
            Object.entries(stuMap || {}).forEach(([stuId, st]) => {
              const stu = students.find((s) => s.id === stuId);
              if (
                !searchTerm ||
                (stu?.name && stu.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                cls.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dateStr.includes(searchTerm)
              ) {
                studentAttendanceRows.push({
                  date: dateStr,
                  class: cls,
                  studentId: stu?.studentId || stuId,
                  studentName: stu?.name || stuId,
                  rollNo: stu?.rollNo || '01',
                  status: st,
                });
              }
            });
          });
        });

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Student Academic Attendance Register (1 Apr 2026 – 31 Mar 2027)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {studentAttendanceRows.length} attendance event logs</p>
              </div>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_students_attendance_session',
                    ['Date', 'Class', 'RollNo', 'StudentID', 'StudentName', 'Status'],
                    studentAttendanceRows.map((r) => [r.date, `"${r.class}"`, r.rollNo, r.studentId, `"${r.studentName}"`, r.status])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export Session CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Roll #</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendanceRows.slice(0, 100).map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.date}</strong></td>
                    <td>{row.class}</td>
                    <td>#{row.rollNo}</td>
                    <td style={{ fontFamily: 'monospace' }}>{row.studentId}</td>
                    <td><strong>{row.studentName}</strong></td>
                    <td>
                      <span className={`badge-status ${row.status === 'Present' ? 'badge-present' : row.status === 'Late' ? 'badge-late' : 'badge-absent'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {studentAttendanceRows.length > 100 && (
              <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing first 100 records of {studentAttendanceRows.length}. Export CSV to download complete dataset.
              </div>
            )}
          </div>
        );
      }

      case 'STAFF_ATTENDANCE': {
        const staffAttendanceRows = [];
        Object.entries(staffAttendance || {}).forEach(([dateStr, staffMap]) => {
          if (filterMonth !== 'ALL' && !dateStr.startsWith(filterMonth)) return;
          Object.entries(staffMap || {}).forEach(([tId, rec]) => {
            const t = teachers.find((tch) => tch.id === tId);
            if (
              !searchTerm ||
              (t?.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (t?.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
              dateStr.includes(searchTerm)
            ) {
              staffAttendanceRows.push({
                date: dateStr,
                teacherId: t?.teacherId || tId,
                name: t?.name || tId,
                subject: t?.subject || 'Faculty',
                status: rec.status || 'Present',
                checkIn: rec.checkIn || '08:15 AM',
                checkOut: rec.checkOut || '03:45 PM',
                remarks: rec.remarks || 'On Duty',
              });
            }
          });
        });

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Faculty & Staff Attendance Register (1 Apr 2026 – 31 Mar 2027)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {staffAttendanceRows.length} staff attendance records</p>
              </div>
              <button
                onClick={() =>
                  handleExportCSV(
                    'edusphere_faculty_attendance_session',
                    ['Date', 'StaffID', 'StaffName', 'Subject', 'Status', 'CheckIn', 'CheckOut', 'Remarks'],
                    staffAttendanceRows.map((r) => [r.date, r.teacherId, `"${r.name}"`, `"${r.subject}"`, r.status, r.checkIn, r.checkOut, `"${r.remarks}"`])
                  )
                }
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export Session CSV</span>
              </button>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Staff ID</th>
                  <th>Faculty Member</th>
                  <th>Department / Subject</th>
                  <th>Status</th>
                  <th>Timings</th>
                  <th>Duty Remarks</th>
                </tr>
              </thead>
              <tbody>
                {staffAttendanceRows.slice(0, 100).map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.date}</strong></td>
                    <td style={{ fontFamily: 'monospace' }}>{row.teacherId}</td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.subject}</td>
                    <td>
                      <span className={`badge-status ${row.status === 'Present' ? 'badge-present' : row.status === 'Late' ? 'badge-late' : row.status === 'On Leave' ? 'badge-paid' : 'badge-absent'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{row.checkIn} — {row.checkOut}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {staffAttendanceRows.length > 100 && (
              <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing first 100 records of {staffAttendanceRows.length}. Export CSV to download complete dataset.
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Institutional Reports & Audit Center</h1>
          <p className="page-subtitle">
            Generate formal CSV exports, audit registers & printable report cards across all school modules.
          </p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary">
          <Printer size={16} />
          <span>Print Current Report</span>
        </button>
      </div>

      {/* Report Categories Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { id: 'STUDENT', label: 'Students Directory', icon: Users },
          { id: 'STUDENT_ATTENDANCE', label: 'Student Attendance (1 Apr – 31 Mar)', icon: CalendarCheck },
          { id: 'STAFF_ATTENDANCE', label: 'Faculty Attendance (1 Apr – 31 Mar)', icon: UserCheck },
          { id: 'FEES', label: 'Fees & Collections', icon: CreditCard },
          { id: 'TEACHER', label: 'Teachers & Payroll', icon: Award },
          { id: 'LIBRARY', label: 'Library Catalog', icon: Book },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: isActive ? '700' : '600',
                background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Month Filter Toolbar */}
      <div className="table-container" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="table-search-input" style={{ flex: 1, minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search filtered records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {(reportType === 'STUDENT_ATTENDANCE' || reportType === 'STAFF_ATTENDANCE') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Month:</span>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                <option value="ALL">All Session (1 Apr – 31 Mar)</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-12">December 2026</option>
                <option value="2027-01">January 2027</option>
                <option value="2027-02">February 2027</option>
                <option value="2027-03">March 2027</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};
