import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  BellRing,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
} from 'lucide-react';

export const TeacherNotices = () => {
  const { notices, addNotice, leaveRequests, updateLeaveStatus } = useSchoolData();
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('leaves');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Academic',
    priority: 'High',
    content: '',
  });

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    addNotice({
      ...noticeForm,
      target: 'STUDENT',
      author: `${currentUser?.name || 'Mrs. Sarah Jenkins'} (Class Teacher 10-A)`,
    });
    setIsNoticeModalOpen(false);
    setNoticeForm({
      title: '',
      category: 'Academic',
      priority: 'High',
      content: '',
    });
  };

  const handleLeaveAction = (leaveId, newStatus) => {
    const remarks = newStatus === 'Approved' ? 'Approved by Class Teacher.' : 'Kindly discuss with class coordinator.';
    updateLeaveStatus(leaveId, newStatus, remarks);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Class Communications & Leave Approvals</h1>
          <p className="page-subtitle">
            Review parent leave applications and broadcast classroom notices.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={activeSubTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}
          >
            <FileText size={16} />
            <span>Leave Requests ({leaveRequests.filter(l => l.status === 'Pending').length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('notices')}
            className={activeSubTab === 'notices' ? 'btn-primary' : 'btn-secondary'}
          >
            <BellRing size={16} />
            <span>Class Notices</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'leaves' ? (
        /* Parent Leave Requests Section */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leaveRequests.map((leave) => (
            <div
              key={leave.id}
              className="card-elevated"
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge-status ${leave.status === 'Approved' ? 'badge-present' : leave.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                    {leave.status}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Applied on: {leave.appliedAt}
                  </span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {leave.studentName} ({leave.class})
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Dates: <strong>{leave.fromDate} to {leave.toDate} ({leave.daysCount} Days)</strong> • Reason: {leave.reasonCategory}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '6px' }}>
                  "{leave.reasonDetails}"
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600', marginTop: '6px' }}>
                  Guardian: {leave.parentName}
                </div>
              </div>

              {leave.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleLeaveAction(leave.id, 'Approved')}
                    className="btn-success"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    <CheckCircle size={15} />
                    <span>Approve Leave</span>
                  </button>
                  <button
                    onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem', color: '#ef4444' }}
                  >
                    <XCircle size={15} />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Status: {leave.teacherRemarks}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Class Notices Section */
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setIsNoticeModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span>Post Notice to Class 10-A</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {notices.map((n) => (
              <div key={n.id} className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className={`badge-status ${n.priority === 'Urgent' ? 'badge-urgent' : 'badge-active'}`}>
                    {n.priority}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginTop: '4px' }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {n.content}
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '8px', fontWeight: '600' }}>
                  By: {n.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Post Notice for Class 10-A"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Subject *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics Formula Sheet Revision"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Priority Level
            </label>
            <select
              value={noticeForm.priority}
              onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Message *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write the announcement for your students..."
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsNoticeModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Post to Students
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
