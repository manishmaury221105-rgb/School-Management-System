import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
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
} from 'lucide-react';

export const TeacherDashboard = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { homework, leaveRequests, attendance, notices } = useSchoolData();

  const assignedClasses = currentUser?.assignedClasses || ['Class 10-A', 'Class 9-B'];
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance['Class 10-A']?.[todayDate] || {};
  const isAttendanceMarkedToday = Object.keys(todayAttendance).length > 0;

  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'Pending').length;

  const teacherCirculars = notices.filter(n => {
    const tgt = (n.target || 'ALL').toUpperCase();
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('students')} className="btn-primary">
            <UserPlus size={16} />
            <span>Add / Enroll Student</span>
          </button>
          <button onClick={() => setActiveTab('notices')} className="btn-secondary">
            <BellRing size={16} />
            <span>Notice Broadcaster</span>
          </button>
          <button onClick={() => setActiveTab('attendance')} className="btn-secondary">
            <UserCheck size={16} />
            <span>Mark Today's Attendance</span>
          </button>
          <button onClick={() => setActiveTab('homework')} className="btn-secondary">
            <BookOpen size={16} />
            <span>Assign Homework</span>
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
          onClick={() => setActiveTab('students')}
        />
      </div>

      {/* Two Column Section: Today's Schedule & Active Broadcast Circulars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Today's Teaching Schedule */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Today's Teaching Schedule</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '700' }}>
              4 Lectures Today
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(14, 165, 233, 0.08))',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                <div style={{ fontSize: '1rem', fontWeight: '800', marginTop: '4px' }}>
                  Period 1: Advanced Mathematics
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Class 10-A • Room 304 • Topic: Quadratic Formulas
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                08:30 - 09:15
              </div>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                  Period 2: Physics Practical Lab
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Class 10-A • Physics Lab • Induction Experiments
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                09:15 - 10:00
              </div>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                  Period 4: Grade 9-B Applied Mathematics
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
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

      {/* Assigned Classes Quick Summary */}
      <div className="card-elevated" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Assigned Class Roster</h3>
          <button
            onClick={() => setActiveTab('gradebook')}
            style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Gradebook <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {assignedClasses.map((clsName, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '800' }}>{clsName}</div>
                <span className="badge-status badge-active">
                  {clsName === 'Class 10-A' ? 'Class Teacher' : 'Subject Faculty'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                32 Students Enrolled • 94.5% Term Attendance • Room 304
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('students')}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', flex: 1, justifyContent: 'center' }}
                >
                  Students
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', flex: 1, justifyContent: 'center' }}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab('homework')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', flex: 1, justifyContent: 'center' }}
                >
                  Assignments
                </button>
                <button
                  onClick={() => setActiveTab('gradebook')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', flex: 1, justifyContent: 'center' }}
                >
                  Marks
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
