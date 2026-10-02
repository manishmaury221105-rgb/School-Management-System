import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FileText, CheckCircle, XCircle, Clock, Filter, User } from 'lucide-react';

export const LeaveManager = () => {
  const { leaveRequests, updateLeaveStatus } = useSchoolData();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredLeaves = leaveRequests.filter((l) =>
    filterStatus === 'ALL' ? true : l.status === filterStatus
  );

  const handleAction = (id, status) => {
    const remark = status === 'Approved' ? 'Approved by Administration.' : 'Declined per attendance guidelines.';
    updateLeaveStatus(id, status, remark);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Leave Approvals & Records</h1>
          <p className="page-subtitle">
            Review and adjudicate absence requests from faculty, students & parent guardians.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontWeight: '700' }}
          >
            <option value="ALL">All Requests ({leaveRequests.length})</option>
            <option value="Pending">Pending Review ({leaveRequests.filter(l => l.status === 'Pending').length})</option>
            <option value="Approved">Approved ({leaveRequests.filter(l => l.status === 'Approved').length})</option>
            <option value="Rejected">Rejected ({leaveRequests.filter(l => l.status === 'Rejected').length})</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredLeaves.map((leave) => (
          <div
            key={leave.id}
            className="card-elevated"
            style={{
              padding: '1.35rem',
              border: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className={`badge-status ${leave.status === 'Approved' ? 'badge-present' : leave.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                  {leave.status}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {leave.reasonCategory}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Applied: {leave.appliedAt}</span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {leave.studentName} ({leave.class})
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Duration: <strong>{leave.fromDate} to {leave.toDate} ({leave.daysCount} Days)</strong> • Guardian: {leave.parentName}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '6px' }}>
                "{leave.reasonDetails}"
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '600' }}>
                Status Note: {leave.teacherRemarks}
              </div>
            </div>

            {leave.status === 'Pending' ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleAction(leave.id, 'Approved')}
                  className="btn-success"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <CheckCircle size={15} />
                  <span>Approve Leave</span>
                </button>
                <button
                  onClick={() => handleAction(leave.id, 'Rejected')}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', color: '#ef4444' }}
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: leave.status === 'Approved' ? '#15803d' : '#b91c1c' }}>
                ✓ Decision Recorded
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
