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

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Attendance Tracking Hub</h1>
          <p className="page-subtitle">
            Daily presence logs, semester summary and examination eligibility criteria.
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
