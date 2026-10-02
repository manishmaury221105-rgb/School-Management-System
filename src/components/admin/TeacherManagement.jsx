import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  Camera,
  Upload,
  Pencil,
  Trash2,
} from 'lucide-react';

export const TeacherManagement = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, classes } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const DEFAULT_TEACHER_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
  const PRESET_TEACHER_AVATARS = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', // Female Faculty 1
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', // Male Faculty 1
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', // Female Faculty 2
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // Female Faculty 3
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', // Male Faculty 2
  ];

  const [formData, setFormData] = useState({
    name: '',
    avatar: DEFAULT_TEACHER_AVATAR,
    email: '',
    subject: '',
    assignedClasses: ['Class 10-A'],
    classTeacherOf: 'Class 10-A',
    phone: '',
    dob: '1988-05-15',
    experience: '5 Years',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    avatar: DEFAULT_TEACHER_AVATAR,
    email: '',
    subject: '',
    assignedClasses: ['Class 10-A'],
    classTeacherOf: 'Class 10-A',
    phone: '',
    dob: '1988-05-15',
    experience: '5 Years',
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

  const handleOpenEditModal = (teacher) => {
    setEditingTeacherId(teacher.id);
    setEditFormData({
      name: teacher.name || '',
      avatar: teacher.avatar || DEFAULT_TEACHER_AVATAR,
      email: teacher.email || '',
      subject: teacher.subject || '',
      assignedClasses: teacher.assignedClasses || ['Class 10-A'],
      classTeacherOf: teacher.classTeacherOf || 'None',
      phone: teacher.phone || '',
      dob: teacher.dob || '1988-05-15',
      experience: teacher.experience || '5 Years',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.subject || !editFormData.phone) return;
    updateTeacher(editingTeacherId, editFormData);
    setIsEditModalOpen(false);
    setEditingTeacherId(null);
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

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.phone && t.phone.includes(searchTerm)) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.phone) return;
    addTeacher(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      avatar: DEFAULT_TEACHER_AVATAR,
      email: '',
      subject: '',
      assignedClasses: ['Class 10-A'],
      classTeacherOf: 'Class 10-A',
      phone: '',
      dob: '1988-05-15',
      experience: '5 Years',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Faculty & Staff Directory</h1>
          <p className="page-subtitle">
            Manage teachers, subject specializations, classroom allocations and contact credentials.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search faculty by name, subject, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filteredTeachers.length} Active Faculty Members
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          padding: '1.5rem',
          background: 'var(--bg-card)'
        }}>
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="card-elevated"
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                      alt={teacher.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{teacher.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '700' }}>
                        {teacher.subject}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditModal(teacher)}
                      className="icon-btn"
                      style={{ width: '30px', height: '30px', color: 'var(--primary)' }}
                      title="Edit Faculty Details"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteTeacher(teacher.id)}
                      className="icon-btn"
                      style={{ width: '30px', height: '30px', color: '#ef4444' }}
                      title="Delete Faculty"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--text-muted)" />
                    <span>{teacher.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--text-muted)" />
                    <span>{teacher.phone || '+1 (555) 234-8901'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="var(--text-muted)" />
                    <span>Exp: {teacher.experience || '8 Years'}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Assigned Classes:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {teacher.assignedClasses?.map((cls, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '2px 8px',
                        background: cls === teacher.classTeacherOf ? 'var(--primary-light)' : 'var(--bg-input)',
                        color: cls === teacher.classTeacherOf ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {cls} {cls === teacher.classTeacherOf && '⭐ (Class Teacher)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Faculty Member"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Faculty Photo Upload & Preview Section */}
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
                alt="Faculty Preview"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <label
                htmlFor="teacher-photo-file"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
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
                id="teacher-photo-file"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Faculty Profile Photo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Upload from Camera / Gallery or choose a faculty avatar below:
              </div>

              {/* Sample Preset Avatars for 1-Click Pick */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_TEACHER_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Faculty Avatar ${idx}`}
                    onClick={() => setFormData(prev => ({ ...prev, avatar: url }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: formData.avatar === url ? '2px solid var(--primary)' : '1px solid var(--border)',
                      opacity: formData.avatar === url ? 1 : 0.6,
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
              Full Name & Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jonathan Taylor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Credentials Notice */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
          }}>
            🔑 <strong>Faculty Login Credentials:</strong> Phone Number is User ID & Date of Birth is Password (DDMMYYYY).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Phone Number (Login ID) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543211"
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
                Class Teacher of (In-Charge) *
              </label>
              <select
                value={formData.classTeacherOf}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    classTeacherOf: val,
                    assignedClasses: val !== 'None' && !prev.assignedClasses.includes(val)
                      ? [...prev.assignedClasses, val]
                      : prev.assignedClasses
                  }));
                }}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                <option value="None">None (Subject Teacher Only)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>⭐ {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject Specialization *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Science"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Assigned Teaching Classes Chips */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              Assigned Teaching Classes (Tap to toggle)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {classes.map((c) => {
                const isSelected = (formData.assignedClasses || []).includes(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => {
                        const current = prev.assignedClasses || [];
                        if (isSelected) {
                          return { ...prev, assignedClasses: current.filter(item => item !== c.name) };
                        } else {
                          return { ...prev, assignedClasses: [...current, c.name] };
                        }
                      });
                    }}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="faculty@school.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Teacher
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTeacherId(null);
        }}
        title="Edit Faculty Member"
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Faculty Photo Upload & Preview Section */}
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
                alt="Faculty Preview"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <label
                htmlFor="edit-teacher-photo-file"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
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
                id="edit-teacher-photo-file"
                type="file"
                accept="image/*"
                onChange={handleEditPhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Faculty Profile Photo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Upload new photo or choose preset avatar:
              </div>

              {/* Sample Preset Avatars */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_TEACHER_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Faculty ${idx}`}
                    onClick={() => setEditFormData(prev => ({ ...prev, avatar: url }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: editFormData.avatar === url ? '2px solid var(--primary)' : '1px solid var(--border)',
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
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Robert Langdon"
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
                placeholder="e.g. 9876543201"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class Teacher of (In-Charge)
              </label>
              <select
                value={editFormData.classTeacherOf || 'None'}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditFormData(prev => {
                    const newAssigned = val !== 'None' && !prev.assignedClasses.includes(val)
                      ? [...prev.assignedClasses, val]
                      : prev.assignedClasses;
                    return { ...prev, classTeacherOf: val, assignedClasses: newAssigned };
                  });
                }}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                <option value="None">None (Subject Teacher Only)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>⭐ {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject Specialization *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Science"
                value={editFormData.subject}
                onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Assigned Teaching Classes Chips */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              Assigned Teaching Classes (Tap to toggle)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {classes.map((c) => {
                const isSelected = (editFormData.assignedClasses || []).includes(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setEditFormData(prev => {
                        const current = prev.assignedClasses || [];
                        if (isSelected) {
                          return { ...prev, assignedClasses: current.filter(item => item !== c.name) };
                        } else {
                          return { ...prev, assignedClasses: [...current, c.name] };
                        }
                      });
                    }}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="faculty@school.com"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingTeacherId(null);
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
