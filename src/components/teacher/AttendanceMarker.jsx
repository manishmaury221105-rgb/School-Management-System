import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  UserCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Save,
  Check,
  Users,
} from 'lucide-react';

export const AttendanceMarker = () => {
  const { students, attendance, markBulkAttendance } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students for selected class
  const classStudents = students.filter((s) => s.class === selectedClass);

  // Load existing attendance for date or set default
  useEffect(() => {
    const existing = attendance[selectedClass]?.[selectedDate] || {};
    const initial = {};
    classStudents.forEach((s) => {
      initial[s.id] = existing[s.id] || 'Present';
    });
    setStatusMap(initial);
  }, [selectedClass, selectedDate, students]);

  const handleToggleStatus = (studentId, status) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setStatusMap(updated);
  };

  const handleSave = () => {
    markBulkAttendance(selectedClass, selectedDate, statusMap);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Stats calculation
  const totalStudents = classStudents.length;
  const presentCount = Object.values(statusMap).filter((s) => s === 'Present').length;
  const absentCount = Object.values(statusMap).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(statusMap).filter((s) => s === 'Late').length;
  const presentRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Daily Attendance Register</h1>
          <p className="page-subtitle">
            Record student roll call, track tardiness, excused absences and real-time attendance ratios.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleSave} className="btn-primary">
            <Save size={16} />
            <span>Save Attendance Register</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '700',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <Check size={18} />
          <span>Attendance records for {selectedClass} on {selectedDate} saved successfully!</span>
        </div>
      )}

      {/* Control Bar: Class, Date & Bulk Actions */}
      <div className="card-elevated" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
              SELECT CLASS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ fontWeight: '700' }}
            >
              <option value="Class 10-A">Class 10-A (Mathematics)</option>
              <option value="Class 9-B">Class 9-B (Physics)</option>
              <option value="Class 6-B">Class 6-B</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
              ATTENDANCE DATE
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ fontWeight: '600' }}
            />
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Actions:</span>
          <button
            onClick={() => handleMarkAll('Present')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#15803d' }}
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('Absent')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#b91c1c' }}
          >
            Clear / All Absent
          </button>
        </div>
      </div>

      {/* Attendance Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card-elevated" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>PRESENT TODAY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#15803d' }}>
            {presentCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ {totalStudents}</span>
          </div>
        </div>

        <div className="card-elevated" style={{ padding: '1rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>ABSENT</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b91c1c' }}>{absentCount}</div>
        </div>

        <div className="card-elevated" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>LATE / TARDY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b45309' }}>{lateCount}</div>
        </div>

        <div className="card-elevated" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>ATTENDANCE RATE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{presentRate}%</div>
        </div>
      </div>

      {/* Student Roster Register */}
      <div className="table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Term Rate</th>
                <th style={{ textAlign: 'center' }}>Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((stu) => {
                const currentStatus = statusMap[stu.id] || 'Present';
                return (
                  <tr key={stu.id}>
                    <td>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        #{stu.rollNo}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={stu.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={stu.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700' }}>{stu.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.parentName} ({stu.parentContact})</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        {stu.studentId}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: stu.attendancePercent >= 90 ? '#10b981' : '#f59e0b' }}>
                        {stu.attendancePercent}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(stu.id, 'Present')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: currentStatus === 'Present' ? '#10b981' : 'transparent',
                            borderColor: currentStatus === 'Present' ? '#10b981' : 'var(--border)',
                            color: currentStatus === 'Present' ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(stu.id, 'Absent')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: currentStatus === 'Absent' ? '#ef4444' : 'transparent',
                            borderColor: currentStatus === 'Absent' ? '#ef4444' : 'var(--border)',
                            color: currentStatus === 'Absent' ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(stu.id, 'Late')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: currentStatus === 'Late' ? '#f59e0b' : 'transparent',
                            borderColor: currentStatus === 'Late' ? '#f59e0b' : 'var(--border)',
                            color: currentStatus === 'Late' ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          Late
                        </button>
                      </div>
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
