import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { Calendar, Plus, Trash2, MapPin, Clock, Tag } from 'lucide-react';

export const EventManager = () => {
  const { events, addEvent, deleteEvent } = useSchoolData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Sports',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '09:00 AM - 04:00 PM',
    location: 'Main School Auditorium',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addEvent(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Sports',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '09:00 AM - 04:00 PM',
      location: 'Main School Auditorium',
      description: '',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Institutional Event Calendar</h1>
          <p className="page-subtitle">
            Schedule academic conferences, sports tournaments, PTM conventions & cultural galas.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {events.map((ev) => (
          <div
            key={ev.id}
            className="card-elevated"
            style={{
              overflow: 'hidden',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={ev.image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80'}
                  alt={ev.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  backdropFilter: 'blur(4px)',
                }}>
                  {ev.category}
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
                  <Calendar size={14} />
                  <span>{ev.startDate} {ev.endDate && ev.endDate !== ev.startDate && `to ${ev.endDate}`}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {ev.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                  {ev.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} />
                    <span>{ev.time || 'All Day Event'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
            }}>
              <button
                onClick={() => deleteEvent(ev.id)}
                className="icon-btn"
                style={{ color: '#ef4444' }}
                title="Cancel Event"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule School Event"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual STEM & Robotics Expo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
                <option value="PTM">PTM Conference</option>
                <option value="Cultural">Cultural</option>
                <option value="Holiday">School Holiday</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Event Timings
              </label>
              <input
                type="text"
                placeholder="09:00 AM - 03:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Campus Venue / Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Main Auditorium & Quadrangle"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Description & Highlights *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail the agenda, participating grades, and guest timings..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Schedule Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
