import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
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
} from 'lucide-react';

export const ReportsCenter = () => {
  const { students, teachers, fees, attendance, examsData, books, transportRoutes, homework } = useSchoolData();
  const [reportType, setReportType] = useState('STUDENT');
  const [searchTerm, setSearchTerm] = useState('');

  const handleExportCSV = (filename, headers, rows) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(',')].concat(rows.map(r => r.join(','))).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          { id: 'STUDENT', label: 'Students Report', icon: Users },
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

      {/* Search Toolbar */}
      <div className="table-container" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="table-search-input" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search filtered records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};
