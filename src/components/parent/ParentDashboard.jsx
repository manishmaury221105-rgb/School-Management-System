import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  CalendarCheck,
  BookOpen,
  Award,
  Wallet,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export const ParentDashboard = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const {
    students,
    homework,
    fees,
    notices,
    leaveRequests,
    examsData,
    selectedChildId,
    setSelectedChildId,
  } = useSchoolData();

  // Dynamically match logged-in parent's wards
  const children = React.useMemo(() => {
    if (!currentUser) return [students[0]];
    const myChildren = students.filter(s =>
      s.parentId === currentUser.id ||
      (currentUser.childrenIds && currentUser.childrenIds.includes(s.id)) ||
      (currentUser.phone && s.parentContact && s.parentContact.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) ||
      (currentUser.name && s.parentName && s.parentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
    );
    return myChildren.length > 0 ? myChildren : [students[0]];
  }, [currentUser, students]);

  const activeChild = students.find(s => s.id === selectedChildId) || children[0] || students[0];

  const childHomework = homework.filter(h => h.class === activeChild?.class);
  const pendingHw = childHomework.filter(h => !h.studentStatus?.[activeChild?.id]?.submitted);

  const childFees = fees.filter(f => f.studentId === activeChild?.id);
  const pendingFee = childFees
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const childResult = examsData.results[activeChild?.id];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header-wrap">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
            <Sparkles size={16} />
            <span>Welcome, {currentUser?.name || 'Anita Sharma'}</span>
          </div>
          <h1 className="page-title">Parent 360° Portal</h1>
          <p className="page-subtitle">
            Holistic parental oversight, multi-child monitor, attendance alerts, academics & fee gateway.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('leave')} className="btn-primary">
            <PlusCircle size={16} />
            <span>Apply for Leave</span>
          </button>
          <button onClick={() => setActiveTab('fees')} className="btn-secondary">
            <Wallet size={16} />
            <span>Pay School Fees</span>
          </button>
        </div>
      </div>

      {/* Multi-Child Selector Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          SELECT WARD / CHILD MONITOR:
        </div>
        <div className="child-switcher-bar">
          {children.map((child) => {
            const isSelected = child.id === activeChild?.id;
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`child-tab-card ${isSelected ? 'active' : ''}`}
              >
                <img
                  src={child.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={child.name}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isSelected ? '2px solid var(--primary)' : '2px solid transparent'
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {child.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {child.class} • Roll #{child.rollNo}
                  </div>
                </div>
                {isSelected && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    ACTIVE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Child 360 Stats Grid */}
      <div className="stats-grid-4">
        <StatCard
          label={`${activeChild?.name}'s Attendance`}
          value={`${activeChild?.attendancePercent}%`}
          icon={CalendarCheck}
          trend="Present in Class Today"
          trendPositive={true}
          accentColor="#10b981"
          lightBg="#ecfdf5"
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          label="Pending Homework"
          value={pendingHw.length}
          icon={BookOpen}
          trend={pendingHw.length > 0 ? `${pendingHw.length} assignments due` : 'All tasks completed!'}
          trendPositive={pendingHw.length === 0}
          accentColor="#f59e0b"
          lightBg="#fef3c7"
          onClick={() => setActiveTab('homework')}
        />
        <StatCard
          label="Academic Performance"
          value={childResult?.gpa ? `${childResult.gpa} GPA` : '3.88'}
          icon={Award}
          trend={`Rank #${childResult?.rank || 2} in Class`}
          trendPositive={true}
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
          onClick={() => setActiveTab('academics')}
        />
        <StatCard
          label="Fee Dues"
          value={`₹${pendingFee}`}
          icon={Wallet}
          trend={pendingFee > 0 ? 'Due by Oct 15' : 'Settled'}
          trendPositive={pendingFee === 0}
          accentColor={pendingFee > 0 ? '#ef4444' : '#10b981'}
          lightBg={pendingFee > 0 ? '#fef2f2' : '#ecfdf5'}
          onClick={() => setActiveTab('fees')}
        />
      </div>

      {/* Two Column Section: Academic Insight & Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Child Academic Summary Card */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Academic Report & Remarks</h3>
            <button
              onClick={() => setActiveTab('academics')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Report <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{childResult?.examTitle}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981' }}>{childResult?.percentage}%</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "{childResult?.remarks}"
            </div>
          </div>

          {/* Subject Scores Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {childResult?.subjects?.slice(0, 3).map((sub, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>{sub.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{sub.marks}/100</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: sub.grade === 'A+' ? '#dcfce7' : '#e0f2fe',
                    color: sub.grade === 'A+' ? '#15803d' : '#0369a1'
                  }}>
                    {sub.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Homework & Leave Overview */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Homework & Attendance Status</h3>
            <button
              onClick={() => setActiveTab('homework')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View Tasks <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {childHomework.map((hw) => {
              const isDone = hw.studentStatus?.[activeChild?.id]?.submitted;
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
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {hw.subject} • Due: {hw.dueDate}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '2px' }}>
                      {hw.title}
                    </div>
                  </div>
                  <span className={`badge-status ${isDone ? 'badge-present' : 'badge-absent'}`}>
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
