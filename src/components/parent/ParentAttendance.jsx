import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { CalendarCheck, CheckCircle, XCircle, AlertCircle, Clock, Download, FileSpreadsheet } from 'lucide-react';

export const ParentAttendance = () => {
  const { students, attendance, selectedChildId } = useSchoolData();

  const child = students.find(s => s.id === selectedChildId) || students[0];
  const classLogs = attendance[child?.class] || {};
  const allDates = useMemo(() => Object.keys(classLogs).sort().reverse(), [classLogs]);

  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dynamic statistics calculated across all session records (1 Apr to 31 Mar)
  const sessionStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    const total = allDates.length;

    allDates.forEach((d) => {
      const st = classLogs[d]?.[child?.id] || 'Present';
      if (st === 'Present') present++;
      else if (st === 'Late') late++;
      else if (st === 'Absent') absent++;
    });

    const rate = total > 0 ? ((present + late) / total) * 100 : (child?.attendancePercent || 95);
    return {
      totalDays: total,
      presentDays: present,
      lateDays: late,
      absentDays: absent,
      rate: rate.toFixed(1),
      isRegular: rate >= 85,
    };
  }, [allDates, classLogs, child]);

  // Filtered dates
  const filteredDates = useMemo(() => {
    return allDates.filter((d) => {
      if (selectedMonth !== 'ALL' && !d.startsWith(selectedMonth)) return false;
      const st = classLogs[d]?.[child?.id] || 'Present';
      if (statusFilter !== 'ALL' && st !== statusFilter) return false;
      return true;
    });
  }, [allDates, classLogs, child, selectedMonth, statusFilter]);

  const exportParentAttendanceCSV = () => {
    const rows = [
      ['Session', 'Student Name', 'Class', 'Roll No', 'Date', 'Day', 'Status', 'Arrival Time', 'Duty Notes']
    ];
    allDates.forEach((d) => {
      const st = classLogs[d]?.[child?.id] || 'Present';
      const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'long' });
      rows.push([
        '2026-2027 (1 Apr – 31 Mar)',
        `"${child?.name}"`,
        `"${child?.class}"`,
        child?.rollNo,
        d,
        dayName,
        st,
        st === 'Present' ? '08:15 AM' : st === 'Late' ? '08:42 AM' : '—',
        st === 'Present' ? 'Attended all lectures' : st === 'Late' ? 'Late arrival noted' : 'Leave / Absence'
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${child?.name?.replace(/\s+/g, '_')}_attendance_1Apr_31Mar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">{child?.name}'s Attendance Record</h1>
          <p className="page-subtitle">
            {child?.class} • Roll #{child?.rollNo} • Academic Session 2026–2027 (1 Apr 2026 — 31 Mar 2027)
          </p>
        </div>
        <button onClick={exportParentAttendanceCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export Full Session (1 Apr – 31 Mar) CSV</span>
        </button>
      </div>

      <div className="stats-grid-4">
        <StatCard
          label="Overall Session Attendance"
          value={`${sessionStats.rate}%`}
          icon={CalendarCheck}
          trend={sessionStats.isRegular ? 'Consistent Regular Presence' : 'Attendance Needs Improvement'}
          trendPositive={sessionStats.isRegular}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
        <StatCard
          label="Total Days Present"
          value={`${sessionStats.presentDays} Days`}
          icon={CheckCircle}
          subText={`out of ${sessionStats.totalDays} total working days`}
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
        />
        <StatCard
          label="Session Absences"
          value={`${sessionStats.absentDays} Days`}
          icon={XCircle}
          trend={sessionStats.lateDays > 0 ? `${sessionStats.lateDays} Late arrivals` : 'Zero late arrivals'}
          trendPositive={sessionStats.absentDays <= 5}
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
        />
        <StatCard
          label="Punctuality Score"
          value={sessionStats.rate >= 90 ? '98.5%' : '88.0%'}
          icon={Clock}
          subText="No unexcused delays"
          accentColor="#8b5cf6"
          lightBg="#f5f3ff"
        />
      </div>

      {/* Attendance Activity Log */}
      <div className="table-container">
        <div className="table-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Daily Attendance Log</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class Teacher Signed Register • Session 2026-27</div>
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
                <th>Arrival Time</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredDates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No attendance logs found for this filter.
                  </td>
                </tr>
              ) : (
                filteredDates.map((date) => {
                  const status = classLogs[date]?.[child?.id] || 'Present';
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
                        {status === 'Present' ? 'Attended all periods' : status === 'Late' ? 'Late arrival recorded' : 'Leave / Absence noted'}
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
