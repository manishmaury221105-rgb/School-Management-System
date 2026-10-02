import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  BellRing,
  Plus,
  Trash2,
  Users,
  AlertCircle,
  Tag,
  CheckCircle,
} from 'lucide-react';

export const NoticeBroadcast = () => {
  const { notices, addNotice, deleteNotice } = useSchoolData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Exams',
    priority: 'Normal',
    target: 'ALL',
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    addNotice({
      ...formData,
      author: `${currentUser?.name || 'Admin'} (${currentUser?.role || 'Principal'})`,
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Exams',
      priority: 'Normal',
      target: 'ALL',
      content: '',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Notice & Circular Broadcaster</h1>
          <p className="page-subtitle">
            Publish institutional notifications with targeted audience delivery and priority triggers.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Publish New Notice</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="card-elevated"
            style={{
              padding: '1.5rem',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge-status ${notice.priority === 'Urgent' ? 'badge-urgent' : notice.priority === 'High' ? 'badge-late' : 'badge-active'}`}>
                    {notice.priority}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)'
                  }}>
                    {notice.category}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{notice.date}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {notice.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {notice.content}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.78rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target: </span>
                <strong style={{ color: 'var(--primary)' }}>{notice.target}</strong>
              </div>
              <button
                onClick={() => deleteNotice(notice.id)}
                style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Delete Notice"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast New Notice"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Subject / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Day Rehearsal Schedule"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Exams">Exams</option>
                <option value="Sports">Sports</option>
                <option value="Holiday">Holiday</option>
                <option value="PTM">PTM</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Target Audience
              </label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="ALL">All (Everyone)</option>
                <option value="TEACHER">Teachers Only</option>
                <option value="STUDENT">Students Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Notice Body / Details *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write the full circular announcement..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
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
