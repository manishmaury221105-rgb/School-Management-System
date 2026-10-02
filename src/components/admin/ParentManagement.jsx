import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

export const ParentManagement = () => {
  const { parents, addParent, deleteParent, students } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '1985-06-15',
    occupation: '',
    relationship: 'Father',
    address: '',
    linkedChildName: 'Rohan Sharma (Class 10-A)',
  });

  const filteredParents = parents.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    addParent({
      ...formData,
      children: [formData.linkedChildName],
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      dob: '1985-06-15',
      occupation: '',
      relationship: 'Father',
      address: '',
      linkedChildName: 'Rohan Sharma (Class 10-A)',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Parent & Guardian Directory</h1>
          <p className="page-subtitle">
            Manage guardian profiles, linked student wards, contact credentials & occupations.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add New Parent</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search parents by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filteredParents.length} Registered Guardians
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          padding: '1.5rem',
          background: 'var(--bg-card)'
        }}>
          {filteredParents.map((parent) => (
            <div
              key={parent.id}
              className="card-elevated"
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={parent.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                      alt={parent.name}
                      style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-purple)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{parent.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: '700' }}>
                        {parent.relationship || 'Guardian'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteParent(parent.id)}
                    style={{ color: '#ef4444', padding: '4px' }}
                    title="Delete Parent"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--text-muted)" />
                    <span>{parent.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--text-muted)" />
                    <span>{parent.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={14} color="var(--text-muted)" />
                    <span>{parent.occupation || 'Professional'}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Linked Children / Wards:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {parent.children?.map((ch, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '2px 8px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Parent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Guardian Profile"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Guardian Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Credentials Notice */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
          }}>
            🔑 <strong>Login Credentials:</strong> Parent Phone Number is User ID & Date of Birth is Password (DDMMYYYY).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Phone Number (Login ID) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543213"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Date of Birth (Login Password) *
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="parent@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Occupation
              </label>
              <input
                type="text"
                placeholder="e.g. Architect"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Occupation
              </label>
              <input
                type="text"
                placeholder="e.g. Architect"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Relationship
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Link Child Ward
            </label>
            <select
              value={formData.linkedChildName}
              onChange={(e) => setFormData({ ...formData, linkedChildName: e.target.value })}
              style={{ width: '100%' }}
            >
              {students.map((s) => (
                <option key={s.id} value={`${s.name} (${s.class})`}>
                  {s.name} ({s.class} • Roll #{s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Parent
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
