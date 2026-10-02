import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
} from 'lucide-react';

export const ParentLeaveApply = () => {
  const { currentUser } = useAuth();
  const { students, leaveRequests, applyLeave, selectedChildId } = useSchoolData();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const child = students.find(s => s.id === selectedChildId) || students[0];
  const myLeaves = leaveRequests.filter(l => l.studentId === child?.id);

  const [formData, setFormData] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    daysCount: 2,
    reasonCategory: 'Sick Leave / Medical Illness',
    reasonDetails: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reasonDetails) return;

    applyLeave({
      studentId: child?.id,
      studentName: child?.name,
      class: child?.class,
      parentName: currentUser?.name || 'Anita Sharma',
      ...formData,
    });

    setIsApplyModalOpen(false);
    setFormData({
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      daysCount: 2,
      reasonCategory: 'Sick Leave / Medical Illness',
      reasonDetails: '',
    });

    setToastMessage('Leave application submitted to class teacher successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Leave Applications for {child?.name}</h1>
          <p className="page-subtitle">
            Submit formal leave notices to {child?.class} class teacher and track real-time approval status.
          </p>
        </div>
        <button onClick={() => setIsApplyModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Apply for New Leave</span>
        </button>
      </div>

      {toastMessage && (
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
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myLeaves.length === 0 ? (
          <div className="card-elevated" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No leave applications filed for {child?.name}.
          </div>
        ) : (
          myLeaves.map((leave) => (
            <div
              key={leave.id}
              className="card-elevated"
              style={{
                padding: '1.35rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge-status ${leave.status === 'Approved' ? 'badge-present' : leave.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                    {leave.status}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {leave.reasonCategory}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Applied: {leave.appliedAt}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                Leave Duration: {leave.fromDate} to {leave.toDate} ({leave.daysCount} Days)
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                "{leave.reasonDetails}"
              </div>

              <div style={{
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={14} color="var(--primary)" />
                <span>Teacher Note: <strong>{leave.teacherRemarks}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply Leave for ${child?.name}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Reason Category *
            </label>
            <select
              value={formData.reasonCategory}
              onChange={(e) => setFormData({ ...formData, reasonCategory: e.target.value })}
              style={{ width: '100%', fontWeight: '600' }}
            >
              <option value="Sick Leave / Medical Illness">Sick Leave / Medical Illness</option>
              <option value="Family Function / Outstation">Family Function / Outstation</option>
              <option value="Doctor / Dental Appointment">Doctor / Dental Appointment</option>
              <option value="Personal / Other">Personal / Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                From Date *
              </label>
              <input
                type="date"
                required
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                To Date *
              </label>
              <input
                type="date"
                required
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Detailed Reason for Leave *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain the reason for absence to the class teacher..."
              value={formData.reasonDetails}
              onChange={(e) => setFormData({ ...formData, reasonDetails: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
