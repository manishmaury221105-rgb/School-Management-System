import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import {
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Award,
  Wallet,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BellRing,
} from 'lucide-react';

export const StudentDashboard = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { homework, fees, notices, examsData } = useSchoolData();

  const myHomework = homework.filter(h => h.class === (currentUser?.class || 'Class 10-A'));
  const pendingHwCount = myHomework.filter(h => !h.studentStatus?.[currentUser?.id || 'user-student-1']?.submitted).length;

  const myFees = fees.filter(f => {
    if (!currentUser) return false;
    const matchId = f.studentId && (
      f.studentId === currentUser.id ||
      f.studentId === currentUser.studentId ||
      f.id === currentUser.id
    );
    const matchName = f.studentName && currentUser.name && (
      f.studentName.trim().toLowerCase() === currentUser.name.trim().toLowerCase()
    );
    const matchRollAndClass = f.rollNo && f.class && currentUser.rollNo && currentUser.class && (
      String(f.rollNo) === String(currentUser.rollNo) && f.class === currentUser.class
    );
    const matchPhone = f.phone && currentUser.phone && (
      f.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')
    );
    return matchId || matchName || matchRollAndClass || matchPhone;
  });

  const pendingFeeAmount = currentUser?.feeStatus === 'Paid'
    ? 0
    : (myFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0) || (myFees.some(f => f.status === 'Paid') ? 0 : 25000));

  const studentResult = examsData.results[currentUser?.id || 'user-student-1'] || examsData.results['user-student-1'];

  // Match broadcast notices for student
  const myNotices = notices.filter((n) => {
    if (!n) return false;
    const tgt = String(n.target || 'ALL').trim().toUpperCase();
    const userClass = String(currentUser?.class || '').trim().toUpperCase();
    return (
      tgt === 'ALL' ||
      tgt === 'EVERYONE' ||
      tgt === 'STUDENT' ||
      tgt === 'STUDENTS' ||
      tgt === 'STUDENTS & TEACHERS' ||
      (userClass && tgt === userClass)
    );
  });

  return (
    <div className="animate-fade-in">
      {/* Student Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: 'white',
        padding: '1.75rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px', marginBottom: '8px' }}>
              <Sparkles size={14} color="#fde047" />
              <span>Academic Year 2026-2027 • Term 1</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Hello, {currentUser?.name || 'Rohan Sharma'}!
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.92rem', marginTop: '4px' }}>
              {currentUser?.class || 'Class 10-A'} • Roll #{currentUser?.rollNo || '18'} • House: {currentUser?.house || 'Emerald Dragons'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('notices')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <BellRing size={16} />
              <span>Notice Board ({myNotices.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <GraduationCap size={16} />
              <span>Digital ID Card</span>
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              style={{
                background: 'white',
                color: '#312e81',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={16} />
              <span>Today's Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid-4">
        <StatCard
          label="Overall Attendance"
          value="94.5%"
          icon={CalendarCheck}
          trend="Eligible for Honors"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          label="Pending Homework"
          value={pendingHwCount}
          icon={BookOpen}
          trend={pendingHwCount > 0 ? `${pendingHwCount} Due this week` : 'All Completed!'}
          trendPositive={pendingHwCount === 0}
          accentColor="#f59e0b"
          lightBg="#fef3c7"
          onClick={() => setActiveTab('homework')}
        />
        <StatCard
          label="Broadcast Notices"
          value={`${myNotices.length} Alerts`}
          icon={BellRing}
          trend="Exam & School Circulars"
          trendPositive={true}
          accentColor="#8b5cf6"
          lightBg="#f5f3ff"
          onClick={() => setActiveTab('notices')}
        />
        <StatCard
          label="Fee Dues"
          value={`₹${pendingFeeAmount}`}
          icon={Wallet}
          trend={pendingFeeAmount > 0 ? 'Due by Oct 15' : 'All Clear'}
          trendPositive={pendingFeeAmount === 0}
          accentColor={pendingFeeAmount > 0 ? '#ef4444' : '#10b981'}
          lightBg={pendingFeeAmount > 0 ? '#fef2f2' : '#ecfdf5'}
          onClick={() => setActiveTab('fees')}
        />
      </div>

      {/* Two Column Grid: Today's Live Schedule & Pending Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Today's Schedule Card */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Today's Classes</h3>
            <button
              onClick={() => setActiveTab('timetable')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Schedule <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(14, 165, 233, 0.1))',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                  ONGOING
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>
                  Period 1: Mathematics
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Mrs. Sarah Jenkins • Room 304
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)' }}>
                08:30 - 09:15
              </div>
            </div>

            <div style={{
              padding: '0.85rem',
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
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Mrs. Sarah Jenkins • Physics Lab
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                09:15 - 10:00
              </div>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                  Period 3: English Literature
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Mr. David Miller • Room 304
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                10:15 - 11:00
              </div>
            </div>
          </div>
        </div>

        {/* Pending Homework & Upcoming Exams */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Pending Homework</h3>
            <button
              onClick={() => setActiveTab('homework')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Assignments <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myHomework.slice(0, 3).map((hw) => {
              const isDone = hw.studentStatus?.[currentUser?.id || 'user-student-1']?.submitted;
              return (
                <div
                  key={hw.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {hw.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• Due: {hw.dueDate}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '2px' }}>
                      {hw.title}
                    </div>
                  </div>

                  <span className={`badge-status ${isDone ? 'badge-present' : 'badge-absent'}`}>
                    {isDone ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Broadcast Notices Banner on Student Dashboard */}
      <div className="card-elevated" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing size={18} color="var(--primary)" />
            <span>Official School Circulars & Notice Board</span>
          </h3>
          <button
            onClick={() => setActiveTab('notices')}
            style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All ({myNotices.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {myNotices.slice(0, 3).map((notice) => {
            const isUrgent = notice.priority === 'Urgent';
            return (
              <div
                key={notice.id}
                onClick={() => setActiveTab('notices')}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: isUrgent ? '1.5px solid #ef4444' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`badge-status ${isUrgent ? 'badge-urgent' : notice.priority === 'High' ? 'badge-late' : 'badge-active'}`}>
                    {notice.priority || 'Normal'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {notice.title}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {notice.content}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '8px', fontWeight: '700' }}>
                  By: {notice.author}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
