import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { CalendarCheck, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

export const ParentAttendance = () => {
  const { students, attendance, selectedChildId } = useSchoolData();

  const child = students.find(s => s.id === selectedChildId) || students[0];
  const classLogs = attendance[child?.class] || {};
  const dates = Object.keys(classLogs).sort().reverse();

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">{child?.name}'s Attendance Record</h1>
          <p className="page-subtitle">
            {child?.class} • Roll #{child?.rollNo} • Term Attendance Percentage & Daily Logs.
          </p>
        </div>
      </div>

      <div className="stats-grid-4">
        <StatCard
          label="Overall Presence"
          value={`${child?.attendancePercent}%`}
          icon={CalendarCheck}
          trend="Regular Attendance"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
        <StatCard
          label="Today's Status"
          value="Present"
          icon={CheckCircle}
          subText="Recorded at 08:15 AM"
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
        />
        <StatCard
          label="Absences This Term"
          value="2 Days"
          icon={XCircle}
          trend="Leave applications approved"
          trendPositive={true}
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
        />
        <StatCard
          label="Punctuality Score"
          value="98.5%"
          icon={Clock}
          subText="No unexcused delays"
          accentColor="#8b5cf6"
          lightBg="#f5f3ff"
        />
      </div>

      {/* Attendance Activity Log */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Daily Attendance Log</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class Teacher Signed Register</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
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
              {dates.map((date) => {
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
                      {status === 'Present' ? 'Attended all periods' : 'Medical leave applied'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
