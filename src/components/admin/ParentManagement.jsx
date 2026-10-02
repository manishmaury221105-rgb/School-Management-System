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
  Camera,
  Upload,
  Pencil,
} from 'lucide-react';

export const ParentManagement = () => {
  const { parents, addParent, updateParent, deleteParent, students } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);

  const DEFAULT_PARENT_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
  const PRESET_PARENT_AVATARS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', // Mother 1
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', // Father 1
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', // Mother 2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', // Father 2
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // Mother 3
  ];

  const [formData, setFormData] = useState({
    name: '',
    avatar: DEFAULT_PARENT_AVATAR,
    email: '',
    phone: '',
    dob: '1985-06-15',
    occupation: '',
    relationship: 'Father',
    address: '',
    linkedChildName: 'Rohan Sharma (Class 10-A)',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    avatar: DEFAULT_PARENT_AVATAR,
    email: '',
    phone: '',
    dob: '1985-06-15',
    occupation: '',
    relationship: 'Father',
    address: '',
    linkedChildName: '',
  });

  const handleEditPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditModal = (parent) => {
    setEditingParentId(parent.id);
    setEditFormData({
      name: parent.name || '',
      avatar: parent.avatar || DEFAULT_PARENT_AVATAR,
      email: parent.email || '',
      phone: parent.phone || '',
      dob: parent.dob || '1985-06-15',
      occupation: parent.occupation || '',
      relationship: parent.relationship || 'Father',
      address: parent.address || '',
      linkedChildName: parent.children && parent.children.length > 0 ? parent.children[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.phone) return;
    updateParent(editingParentId, {
      ...editFormData,
      children: editFormData.linkedChildName ? [editFormData.linkedChildName] : (parents.find(p => p.id === editingParentId)?.children || []),
    });
    setIsEditModalOpen(false);
    setEditingParentId(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditModal(parent)}
                      className="icon-btn"
                      style={{ width: '30px', height: '30px', color: 'var(--primary)' }}
                      title="Edit Guardian Details"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteParent(parent.id)}
                      className="icon-btn"
                      style={{ width: '30px', height: '30px', color: '#ef4444' }}
                      title="Delete Parent"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
          {/* Parent Photo Upload & Preview Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={formData.avatar}
                alt="Parent Preview"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #8b5cf6',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <label
                htmlFor="parent-photo-file"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#8b5cf6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
                title="Upload Photo from Camera / Gallery"
              >
                <Camera size={14} />
              </label>
              <input
                id="parent-photo-file"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Guardian Profile Photo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Take live snapshot or choose avatar:
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_PARENT_AVATARS.map((pAvatar, idx) => (
                  <img
                    key={idx}
                    src={pAvatar}
                    alt={`Avatar ${idx}`}
                    onClick={() => setFormData(prev => ({ ...prev, avatar: pAvatar }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: formData.avatar === pAvatar ? '2px solid #8b5cf6' : '1px solid var(--border)',
                      transform: formData.avatar === pAvatar ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

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

      {/* Edit Parent Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingParentId(null);
        }}
        title="Edit Guardian Account"
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Parent Photo Upload & Preview Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={editFormData.avatar}
                alt="Parent Preview"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-purple)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <label
                htmlFor="edit-parent-photo-file"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
                title="Upload Photo from Camera / Gallery"
              >
                <Camera size={14} />
              </label>
              <input
                id="edit-parent-photo-file"
                type="file"
                accept="image/*"
                onChange={handleEditPhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Guardian Profile Photo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Upload new photo or choose preset avatar:
              </div>

              {/* Sample Preset Avatars */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_PARENT_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setEditFormData(prev => ({ ...prev, avatar: url }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: editFormData.avatar === url ? '2px solid var(--accent-purple)' : '1px solid var(--border)',
                      opacity: editFormData.avatar === url ? 1 : 0.6,
                      transition: 'all 0.15s ease'
                    }}
                    title="Select Avatar"
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Guardian Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Phone Number (Login ID) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543202"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
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
                value={editFormData.dob}
                onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="parent@email.com"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Occupation
              </label>
              <input
                type="text"
                placeholder="e.g. Civil Engineer"
                value={editFormData.occupation}
                onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Relationship
              </label>
              <select
                value={editFormData.relationship}
                onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
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
              value={editFormData.linkedChildName}
              onChange={(e) => setEditFormData({ ...editFormData, linkedChildName: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="">None / Unassigned</option>
              {students.map((s) => (
                <option key={s.id} value={`${s.name} (${s.class})`}>
                  {s.name} ({s.class} • Roll #{s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingParentId(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
