import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { getClassSchedule, PERIOD_SLOTS } from '../../utils/timetableData';
import {
  UserCheck,
  BookOpen,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  UserPlus,
  BellRing,
  Plus,
  MapPin,
} from 'lucide-react';

export const TeacherDashboard = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { homework, leaveRequests, attendance, notices } = useSchoolData();

  const assignedClasses = currentUser?.assignedClasses || ['Class 10-A', 'Class 9-B'];
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance?.['Class 10-A']?.[todayDate] || {};
  const isAttendanceMarkedToday = Object.keys(todayAttendance).length > 0;

  const pendingLeavesCount = (leaveRequests || []).filter(l => l.status === 'Pending').length;

  const teacherCirculars = (notices || []).filter(n => {
    const tgt = ((n && n.target) || 'ALL').toUpperCase();
    return tgt === 'TEACHER' || tgt === 'ALL';
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
            <Sparkles size={16} />
            <span>Welcome back, {currentUser?.name}</span>
          </div>
          <h1 className="page-title">Faculty Workspace</h1>
          <p className="page-subtitle">
            Class 10-A Class Teacher • Mathematics & Physics Department • Broadcast Center
          </p>
        </div>
        <div className="teacher-actions-grid">
          <button
            onClick={() => setActiveTab('students')}
            className="btn-primary"
            style={{ padding: '8px 10px', fontSize: '0.82rem', justifyContent: 'center', gap: '6px' }}
          >
            <UserPlus size={15} />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className="btn-secondary"
            style={{ padding: '8px 10px', fontSize: '0.82rem', justifyContent: 'center', gap: '6px' }}
          >
            <BellRing size={15} />
            <span>Notices</span>
          </button>
          <button
            onClick={() => setActiveTab('gradebook')}
            className="btn-secondary"
            style={{ padding: '8px 10px', fontSize: '0.82rem', justifyContent: 'center', gap: '6px' }}
          >
            <Award size={15} />
            <span>Enter Marks</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid-4">
        <StatCard
          label="Today's Attendance Status"
          value={isAttendanceMarkedToday ? 'Marked (94%)' : 'Action Required'}
          icon={UserCheck}
          trend={isAttendanceMarkedToday ? 'Submitted' : 'Pending for Class 10-A'}
          trendPositive={isAttendanceMarkedToday}
          accentColor="#3b82f6"
          lightBg="#eff6ff"
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          label="Active Assigned Homework"
          value={homework.length}
          icon={BookOpen}
          trend="Submissions Tracking"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
          onClick={() => setActiveTab('homework')}
        />
        <StatCard
          label="Broadcast Notices"
          value={`${teacherCirculars.length} Active`}
          icon={BellRing}
          trend="Institutional Circulars"
          trendPositive={true}
          accentColor="#8b5cf6"
          lightBg="#f5f3ff"
          onClick={() => setActiveTab('notices')}
        />
        <StatCard
          label="Assigned Classroom"
          value={currentUser?.classTeacherOf || assignedClasses[0] || 'Class 10-A'}
          icon={Users}
          trend={currentUser?.subject || 'Mathematics & Physics'}
          trendPositive={true}
          accentColor="#f59e0b"
          lightBg="#fef3c7"
          onClick={() => setActiveTab('timetable')}
        />
      </div>


      {/* Two Column Section: Today's Schedule & Active Broadcast Circulars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Today's Teaching Schedule */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Today's Teaching Schedule</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {currentUser?.name || 'Dr. Alok Verma'} • Official Roster
              </p>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Timetable <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(14, 165, 233, 0.08))',
                border: '1.5px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  ● LIVE NOW
                </span>
                <div style={{ fontSize: '0.98rem', fontWeight: '800', marginTop: '4px' }}>
                  Period 1: Advanced Mathematics
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Class 10-A • Room 304 • Topic: Quadratic Formulas
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                08:30 - 09:15
              </div>
            </div>

            <div
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                  Period 2: Physics Practical Lab
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Class 10-A • Physics Lab • Induction Experiments
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                09:15 - 10:00
              </div>
            </div>

            <div
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                  Period 4: Grade 9-B Applied Mathematics
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Class 9-B • Room 202 • Linear Equations
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                11:00 - 11:45
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Broadcast Circulars Widget */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>📢 Broadcast Circulars</h3>
            <button
              onClick={() => setActiveTab('notices')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              All Notices ({notices.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {teacherCirculars.slice(0, 3).map((n) => {
              const isUrgent = n.priority === 'Urgent';
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notices')}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: isUrgent ? '1.5px solid #ef4444' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge-status ${isUrgent ? 'badge-urgent' : n.priority === 'High' ? 'badge-late' : 'badge-active'}`}>
                        {n.priority || 'Normal'}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {n.category || 'Academic'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.date}</span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {n.title}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {n.content}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '6px', fontWeight: '600' }}>
                    By: {n.author}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
