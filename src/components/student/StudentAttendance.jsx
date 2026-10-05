import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertCircle,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentAttendance = () => {
  const { currentUser } = useAuth();
  const { attendance, students } = useSchoolData();

  const studentId = currentUser?.id || 'user-student-default';
  const student = students.find((s) => s.id === studentId) || students[0];
  const studentClass = student?.class || currentUser?.class || 'Class 10-A';

  const [selectedMonth, setSelectedMonth] = useState('ALL'); // 'ALL' or '2026-04' etc.
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchDate, setSearchDate] = useState('');

  const classLogs = attendance[studentClass] || {};
  const allDates = useMemo(() => Object.keys(classLogs).sort().reverse(), [classLogs]);

  // Dynamic statistics calculated across all session records (1 Apr to 31 Mar)
  const sessionStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    const total = allDates.length;

    allDates.forEach((d) => {
      const st = classLogs[d]?.[studentId] || 'Present';
      if (st === 'Present') present++;
      else if (st === 'Late') late++;
      else if (st === 'Absent') absent++;
    });

    const rate = total > 0 ? ((present + late) / total) * 100 : (student?.attendancePercent || 95);
    return {
      totalDays: total,
      presentDays: present,
      lateDays: late,
      absentDays: absent,
      rate: rate.toFixed(1),
      isEligible: rate >= 75,
    };
  }, [allDates, classLogs, studentId, student]);

  // Filtered dates based on month, status and search
  const filteredDates = useMemo(() => {
    return allDates.filter((d) => {
      if (selectedMonth !== 'ALL' && !d.startsWith(selectedMonth)) return false;
      const st = classLogs[d]?.[studentId] || 'Present';
      if (statusFilter !== 'ALL' && st !== statusFilter) return false;
      if (searchDate && !d.includes(searchDate)) return false;
      return true;
    });
  }, [allDates, classLogs, studentId, selectedMonth, statusFilter, searchDate]);

  const exportStudentAttendanceCSV = () => {
    const rows = [
      ['Academic Session', 'Class', 'Student ID', 'Student Name', 'Date', 'Day', 'Status', 'Check-In Time', 'Class Incharge']
    ];
    allDates.forEach((d) => {
      const st = classLogs[d]?.[studentId] || 'Present';
      const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'long' });
      rows.push([
        '2026-2027 (1 Apr – 31 Mar)',
        `"${studentClass}"`,
        student?.studentId || 'STU',
        `"${student?.name || currentUser?.name}"`,
        d,
        dayName,
        st,
        st === 'Present' ? '08:15 AM' : st === 'Late' ? '08:35 AM' : '—',
        'Dr. Alok Verma'
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_attendance_${student?.name?.replace(/\s+/g, '_')}_Session_1Apr_31Mar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Attendance Tracking Hub</h1>
          <p className="page-subtitle">
            Academic Session 2026–2027 (1 April 2026 — 31 March 2027) • Daily presence register & exam eligibility.
          </p>
        </div>
        <button onClick={exportStudentAttendanceCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export Full Session (1 Apr – 31 Mar) CSV</span>
        </button>
      </div>

      <div className="stats-grid-4">
        <StatCard
          label="Overall Session Attendance"
          value={`${sessionStats.rate}%`}
          icon={CalendarCheck}
          trend={`${sessionStats.isEligible ? 'Eligible for Exams' : 'Attendance Warning'}`}
          trendPositive={sessionStats.isEligible}
          accentColor={sessionStats.isEligible ? '#10b981' : '#ef4444'}
          lightBg={sessionStats.isEligible ? '#ecfdf5' : '#fef2f2'}
        />
        <StatCard
          label="Days Present"
          value={`${sessionStats.presentDays} Days`}
          icon={CheckCircle}
          subText={`out of ${sessionStats.totalDays} total session working days`}
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
        />
        <StatCard
          label="Days Absent"
          value={`${sessionStats.absentDays} Days`}
          icon={XCircle}
          trend={sessionStats.lateDays > 0 ? `+ ${sessionStats.lateDays} Late arrivals` : 'No delays'}
          trendPositive={sessionStats.absentDays <= 5}
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
        />
        <StatCard
          label="Exam Eligibility Status"
          value={sessionStats.isEligible ? 'Eligible' : 'At Risk (<75%)'}
          icon={Award}
          trend="Threshold Criteria: >= 75%"
          trendPositive={sessionStats.isEligible}
          accentColor={sessionStats.isEligible ? '#10b981' : '#f59e0b'}
          lightBg={sessionStats.isEligible ? '#ecfdf5' : '#fffbeb'}
        />
      </div>

      {/* Daily Attendance Logs */}
      <div className="table-container">
        <div className="table-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Daily Attendance Activity Log</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {studentClass} Official Register • Academic Session 1 Apr 2026 – 31 Mar 2027
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter by Month */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
            >
              <option value="ALL">All Months (1 Apr – 31 Mar)</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-10">October 2026 (Current)</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-12">December 2026</option>
              <option value="2027-01">January 2027</option>
              <option value="2027-02">February 2027</option>
              <option value="2027-03">March 2027</option>
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Late">Late Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Check-in Time</th>
                <th>Recorded By / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredDates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No attendance logs match your filter.
                  </td>
                </tr>
              ) : (
                filteredDates.map((date) => {
                  const status = classLogs[date]?.[studentId] || 'Present';
                  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                  return (
                    <tr key={date}>
                      <td style={{ fontWeight: '700' }}>{date}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{dayName}</td>
                      <td>
                        <span className={`badge-status ${status === 'Present' ? 'badge-present' : status === 'Late' ? 'badge-late' : 'badge-absent'}`}>
                          {status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {status === 'Present' ? '08:15 AM' : status === 'Late' ? '08:42 AM' : '—'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {status === 'Present' ? 'Present • Regular Session' : status === 'Late' ? 'Late Arrival Marked' : 'Excused / Absent'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
