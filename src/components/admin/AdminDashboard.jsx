import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { FeeCollectionModal } from './FeeCollectionModal';
import {
  Users,
  UserCheck,
  CreditCard,
  CalendarCheck,
  PlusCircle,
  BellRing,
  TrendingUp,
  School,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard = ({ setActiveTab }) => {
  const { students, teachers, classes, fees, notices } = useSchoolData();
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  const totalFeesPaid = fees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalFeesPending = fees
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Executive School Dashboard</h1>
          <p className="page-subtitle">
            Institutional overview, live enrollment statistics, financial status & faculty distribution.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('teachers')} className="btn-primary">
            <PlusCircle size={16} />
            <span>Onboard Faculty</span>
          </button>
          <button onClick={() => setIsFeeModalOpen(true)} className="btn-secondary">
            <CreditCard size={16} />
            <span>Fees</span>
          </button>
          <button onClick={() => setActiveTab('notices')} className="btn-secondary">
            <BellRing size={16} />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid-4">
        <StatCard
          label="Total Active Students"
          value={students.length}
          icon={Users}
          trend={students.length === 0 ? "Ready for Enrollment" : `${students.length} Enrolled`}
          trendPositive={students.length > 0}
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
          onClick={() => setActiveTab('students')}
        />
        <StatCard
          label="Faculty & Teachers"
          value={teachers.length}
          icon={UserCheck}
          trend={teachers.length === 0 ? "No Staff Onboarded" : `${teachers.length} Active`}
          trendPositive={teachers.length > 0}
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
          onClick={() => setActiveTab('teachers')}
        />
        <StatCard
          label="Fees Collected"
          value={`₹${totalFeesPaid.toLocaleString()}`}
          icon={CreditCard}
          trend={`₹${totalFeesPending.toLocaleString()} Pending`}
          trendPositive={totalFeesPaid > 0}
          accentColor="#10b981"
          lightBg="#ecfdf5"
          onClick={() => setActiveTab('fees')}
        />
        <StatCard
          label="Campus Classes"
          value={classes.length}
          icon={CalendarCheck}
          trend={`${classes.length} Standard Sections`}
          trendPositive={true}
          accentColor="#8b5cf6"
          lightBg="#f5f3ff"
          onClick={() => setActiveTab('classes')}
        />
      </div>

      {/* Two Column Grid: Classes Overview & Recent Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Classes Enrollment Meter */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Classroom Capacities</h3>
            <button
              onClick={() => setActiveTab('classes')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {classes.slice(0, 6).map((cls) => {
              const enrolledInClass = students.filter(s => s.class === cls.name).length;
              const fillPercent = Math.round((enrolledInClass / cls.maxCapacity) * 100);
              return (
                <div key={cls.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                    <span>{cls.name} ({cls.roomNo})</span>
                    <span style={{ color: fillPercent >= 90 ? '#ef4444' : 'var(--text-secondary)' }}>
                      {enrolledInClass} / {cls.maxCapacity} Students ({fillPercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${fillPercent}%`,
                        height: '100%',
                        background: fillPercent >= 90 ? '#ef4444' : 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Class Teacher: {cls.classTeacher}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Notices & Circulars */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Active Notices & Circulars</h3>
            <button
              onClick={() => setActiveTab('notices')}
              style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Broadcast <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notices.slice(0, 4).map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className={`badge-status ${n.priority === 'Urgent' ? 'badge-urgent' : 'badge-active'}`}>
                    {n.priority}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                  {n.content.substring(0, 90)}...
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600', marginTop: '6px' }}>
                  Audience: {n.target} • Author: {n.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Collection Form Modal */}
      <FeeCollectionModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
      />
    </div>
  );
};
