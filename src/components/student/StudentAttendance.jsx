import React from 'react';
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
} from 'lucide-react';

export const StudentAttendance = () => {
  const { currentUser } = useAuth();
  const { attendance } = useSchoolData();

  const studentId = currentUser?.id || 'user-student-1';
  const studentClass = currentUser?.class || 'Class 10-A';

  const classLogs = attendance[studentClass] || {};
  const dates = Object.keys(classLogs).sort().reverse();

  const subjectsAttendance = [
    { subject: 'Mathematics', attended: 38, total: 40, percent: 95.0, color: '#4f46e5' },
    { subject: 'Physics & Lab', attended: 36, total: 38, percent: 94.7, color: '#0ea5e9' },
    { subject: 'Chemistry', attended: 35, total: 38, percent: 92.1, color: '#10b981' },
    { subject: 'Computer Science', attended: 30, total: 30, percent: 100.0, color: '#8b5cf6' },
    { subject: 'English Literature', attended: 37, total: 40, percent: 92.5, color: '#ec4899' },
    { subject: 'Social Studies', attended: 36, total: 38, percent: 94.7, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Attendance Tracking Hub</h1>
          <p className="page-subtitle">
            Subject-wise attendance meters, daily presence logs and university eligibility criteria.
          </p>
        </div>
      </div>

      <div className="stats-grid-4">
        <StatCard
          label="Overall Semester Attendance"
          value="94.5%"
          icon={CalendarCheck}
          trend="+1.2% above threshold"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
        <StatCard
          label="Days Present"
          value="76 Days"
          icon={CheckCircle}
          subText="out of 80 working days"
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
        />
        <StatCard
          label="Days Absent"
          value="3 Days"
          icon={XCircle}
          trend="Excused Sick Leaves"
          trendPositive={true}
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
        />
        <StatCard
          label="Exam Eligibility Status"
          value="Eligible"
          icon={Award}
          trend="Required: > 75%"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="card-elevated" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem' }}>
          Subject-Wise Attendance Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {subjectsAttendance.map((sub, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{sub.subject}</span>
                <span style={{ fontWeight: '800', color: sub.color, fontSize: '1rem' }}>
                  {sub.percent}%
                </span>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                <div
                  style={{
                    width: `${sub.percent}%`,
                    height: '100%',
                    background: sub.color,
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{sub.attended} Attended</span>
                <span>{sub.total} Total Lectures</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Attendance Logs */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Daily Attendance Activity Log</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class 10-A Official Register</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Check-in Time</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => {
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
                      Mrs. Sarah Jenkins (Class Teacher)
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
