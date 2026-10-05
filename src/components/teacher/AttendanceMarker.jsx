import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
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
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

export const AttendanceMarker = () => {
  const { students, attendance, markBulkAttendance, teachers, classes } = useSchoolData();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole === ROLES.ADMIN;

  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const teacherClasses = React.useMemo(() => {
    if (isAdmin) return classes.map(c => c.name);
    const list = [];
    if (activeTeacher?.classTeacherOf) list.push(activeTeacher.classTeacherOf);
    if (Array.isArray(activeTeacher?.assignedClasses)) {
      activeTeacher.assignedClasses.forEach(c => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list.length > 0 ? list : ['Class 10-A'];
  }, [isAdmin, classes, activeTeacher]);

  const defaultClass = activeTeacher?.classTeacherOf || teacherClasses[0] || 'Class 10-A';
  const [selectedClass, setSelectedClass] = useState(defaultClass);
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

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const newDate = `${y}-${m}-${dayNum}`;
    if (newDate >= '2026-04-01') {
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const newDate = `${y}-${m}-${dayNum}`;
    if (newDate <= '2027-03-31') {
      setSelectedDate(newDate);
    }
  };

  const handleMonthJump = (monthStr) => {
    if (!monthStr) return;
    setSelectedDate(`${monthStr}-01`);
  };

  const exportDailyStudentCSV = () => {
    const rows = [
      ['Class', 'Date', 'Roll No', 'Student ID', 'Student Name', 'Parent Name', 'Parent Contact', 'Status']
    ];
    classStudents.forEach((stu) => {
      rows.push([
        `"${selectedClass}"`,
        selectedDate,
        stu.rollNo,
        stu.studentId,
        `"${stu.name}"`,
        `"${stu.parentName}"`,
        stu.parentContact,
        statusMap[stu.id] || 'Present'
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_attendance_${selectedClass.replace(/\s+/g, '_')}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSessionStudentCSV = () => {
    const rows = [
      ['Date', 'Day', 'Class', 'Roll No', 'Student ID', 'Student Name', 'Status']
    ];
    const classRecords = attendance[selectedClass] || {};
    const dates = Object.keys(classRecords).sort();
    dates.forEach((dStr) => {
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      const dayData = classRecords[dStr] || {};
      classStudents.forEach((stu) => {
        const st = dayData[stu.id] || 'Present';
        rows.push([
          dStr,
          dayName,
          `"${selectedClass}"`,
          stu.rollNo,
          stu.studentId,
          `"${stu.name}"`,
          st
        ]);
      });
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_attendance_Session_1Apr_31Mar_${selectedClass.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={exportDailyStudentCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Export selected date attendance">
            <Download size={15} />
            <span>Export Daily CSV</span>
          </button>
          <button onClick={exportSessionStudentCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: '700' }} title="Export all records from 1 April to 31 March">
            <FileSpreadsheet size={15} />
            <span>Export Full Session (1 Apr – 31 Mar) CSV</span>
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

      {/* Control Bar: Class, Date Navigator, Month Jump & Bulk Actions */}
      <div className="card-elevated" style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Session Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #bfdbfe',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Academic Session 2026–2027 (1 April 2026 — 31 March 2027)
            </span>
            <span className="badge-status badge-present" style={{ fontSize: '0.72rem' }}>
              Full Session Active
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Class: <strong style={{ color: 'var(--primary)' }}>{selectedClass}</strong> • Date: <strong style={{ color: 'var(--primary)' }}>{selectedDate}</strong> ({new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })})
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                SELECT CLASS
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ fontWeight: '700', padding: '6px 12px' }}
              >
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} {!isAdmin && cls === activeTeacher?.classTeacherOf ? '★ (Class Teacher)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                ATTENDANCE DATE (1 APR – 31 MAR)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={handlePrevDay}
                  className="btn-secondary"
                  style={{ padding: '6px 8px' }}
                  title="Previous Working Day"
                >
                  <ChevronLeft size={16} />
                </button>
                <input
                  type="date"
                  min="2026-04-01"
                  max="2027-03-31"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ fontWeight: '700', padding: '6px 12px' }}
                />
                <button
                  onClick={handleNextDay}
                  className="btn-secondary"
                  style={{ padding: '6px 8px' }}
                  title="Next Working Day"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: '700' }}
                >
                  Today
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                JUMP TO MONTH
              </label>
              <select
                value={selectedDate.slice(0, 7)}
                onChange={(e) => handleMonthJump(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                <option value="2026-04">April 2026 (Session Start)</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026 (Current Term)</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-12">December 2026</option>
                <option value="2027-01">January 2027</option>
                <option value="2027-02">February 2027</option>
                <option value="2027-03">March 2027 (Session End)</option>
              </select>
            </div>
          </div>

          {/* Quick Bulk Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Actions:</span>
            <button
              onClick={() => handleMarkAll('Present')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#15803d', fontWeight: '700' }}
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: '700' }}
            >
              Clear / All Absent
            </button>
          </div>
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
