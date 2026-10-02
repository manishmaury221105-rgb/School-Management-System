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
} from 'lucide-react';

export const TeacherManagement = () => {
  const { teachers, addTeacher, classes } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    assignedClasses: ['Class 10-A'],
    classTeacherOf: 'Class 10-A',
    phone: '',
    dob: '1988-05-15',
    experience: '5 Years',
  });

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
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

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Subject Specialization *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chemistry & Organic Science"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="faculty@edusphere.edu"
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
    </div>
  );
};
