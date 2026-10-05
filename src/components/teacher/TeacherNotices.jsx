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
  Sparkles,
  Users,
  Radio,
  Tag,
} from 'lucide-react';

export const TeacherNotices = () => {
  const { notices, addNotice, leaveRequests, updateLeaveStatus, teachers } = useSchoolData();
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('notices');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  // Identify teacher assigned classes
  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const teacherClasses = React.useMemo(() => {
    const list = [];
    if (activeTeacher?.classTeacherOf) list.push(activeTeacher.classTeacherOf);
    if (Array.isArray(activeTeacher?.assignedClasses)) {
      activeTeacher.assignedClasses.forEach(c => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list.length > 0 ? list : ['Class 10-A'];
  }, [activeTeacher]);

  const defaultTargetClass = activeTeacher?.classTeacherOf || teacherClasses[0] || 'Class 10-A';

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Academic',
    priority: 'High',
    target: defaultTargetClass,
    content: '',
  });

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    const targetClass = noticeForm.target || defaultTargetClass;
    addNotice({
      ...noticeForm,
      target: targetClass,
      targetClass: targetClass,
      author: `${currentUser?.name || activeTeacher?.name || 'Faculty Member'} (Class Teacher ${targetClass})`,
    });
    setIsNoticeModalOpen(false);
    setNoticeForm({
      title: '',
      category: 'Academic',
      priority: 'High',
      target: defaultTargetClass,
      content: '',
    });
  };

  const handleLeaveAction = (leaveId, newStatus) => {
    const remarks = newStatus === 'Approved' ? 'Approved by Class Teacher.' : 'Kindly discuss with class coordinator.';
    updateLeaveStatus(leaveId, newStatus, remarks);
  };

  // Filter notices for Teacher View
  const filteredNotices = notices.filter((n) => {
    if (!n) return false;
    const tgt = String(n.target || 'ALL').trim().toUpperCase();
    const isTargetRelevant =
      tgt === 'ALL' ||
      tgt === 'EVERYONE' ||
      tgt === 'TEACHER' ||
      tgt === 'FACULTY' ||
      tgt === 'STUDENT' ||
      tgt === 'STUDENTS' ||
      teacherClasses.some(c => c.toUpperCase() === tgt);

    if (!isTargetRelevant) return false;

    if (filterCategory === 'FACULTY') {
      return tgt === 'TEACHER' || tgt === 'FACULTY' || tgt === 'ALL';
    }
    if (filterCategory === 'STUDENTS') {
      return tgt === 'STUDENT' || tgt === 'STUDENTS' || teacherClasses.some(c => c.toUpperCase() === tgt);
    }
    if (filterCategory === 'URGENT') {
      return n.priority === 'Urgent' || n.priority === 'High';
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Class Notices & School Circulars</h1>
          <p className="page-subtitle">
            Broadcast classroom bulletins, review institutional circulars and manage parent leave requests.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('notices')}
            className={activeSubTab === 'notices' ? 'btn-primary' : 'btn-secondary'}
          >
            <BellRing size={16} />
            <span>Notice Board ({notices.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={activeSubTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}
          >
            <FileText size={16} />
            <span>Leave Requests ({leaveRequests.filter(l => l.status === 'Pending').length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'notices' ? (
        /* Notices Board Section */
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterCategory('ALL')}
                className={filterCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                All Circulars ({notices.length})
              </button>
              <button
                onClick={() => setFilterCategory('FACULTY')}
                className={filterCategory === 'FACULTY' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Faculty Circulars
              </button>
              <button
                onClick={() => setFilterCategory('STUDENTS')}
                className={filterCategory === 'STUDENTS' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Class & Student Bulletins
              </button>
              <button
                onClick={() => setFilterCategory('URGENT')}
                className={filterCategory === 'URGENT' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Urgent / High Priority
              </button>
            </div>

            <button onClick={() => setIsNoticeModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span>Broadcast Notice to Class</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {filteredNotices.map((n) => {
              const isUrgent = n.priority === 'Urgent';
              const isHigh = n.priority === 'High';
              return (
                <div
                  key={n.id}
                  className="card-elevated"
                  style={{
                    padding: '1.5rem',
                    border: isUrgent ? '1.5px solid #ef4444' : '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge-status ${isUrgent ? 'badge-urgent' : isHigh ? 'badge-late' : 'badge-active'}`}>
                          {n.priority || 'Normal'}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: 'var(--bg-input)',
                          color: 'var(--text-secondary)'
                        }}>
                          {n.category || 'General'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                    </div>

                    <h3 style={{ fontSize: '1.12rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {n.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {n.content}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.78rem',
                  }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '700' }}>
                      By: {n.author || 'School Administration'}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-input)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      Target: {n.target || 'ALL'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}

      {/* Post Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Broadcast Notice / Circular"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Subject / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics Formula Sheet Revision & Test"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={noticeForm.category}
                onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Academic">Academic</option>
                <option value="Exams">Exams</option>
                <option value="Homework">Homework</option>
                <option value="General">General</option>
                <option value="Holiday">Holiday</option>
              </select>
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
                Target Class (Students Only)
              </label>
              <select
                value={noticeForm.target}
                onChange={(e) => setNoticeForm({ ...noticeForm, target: e.target.value })}
                style={{ width: '100%', fontWeight: '600' }}
              >
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} (Class Students) {cls === activeTeacher?.classTeacherOf ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Content *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write the full announcement message..."
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
              Broadcast Immediately
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
