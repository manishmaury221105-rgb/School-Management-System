import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Eye,
  Filter,
  Download,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle,
  Camera,
  Upload,
} from 'lucide-react';

export const StudentManagement = () => {
  const { students, addStudent, deleteStudent, clearAllStudents, classes } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);

  // New Student Form State with Photo
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', // Boy 1
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', // Girl 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', // Boy 2
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', // Girl 2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', // Boy 3
  ];

  const [formData, setFormData] = useState({
    name: '',
    avatar: DEFAULT_AVATAR,
    class: 'Class 10-A',
    rollNo: '',
    phone: '',
    dob: '2010-05-15',
    email: '',
    parentName: '',
    parentContact: '',
    bloodGroup: 'O+',
    house: 'Emerald Dragons',
  });

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

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all students from the directory?')) {
      clearAllStudents();
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.phone) return;
    addStudent(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      avatar: DEFAULT_AVATAR,
      class: 'Class 10-A',
      rollNo: '',
      phone: '',
      dob: '2010-05-15',
      email: '',
      parentName: '',
      parentContact: '',
      bloodGroup: 'O+',
      house: 'Emerald Dragons',
    });
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Class,Roll,Email,Parent,Contact,Attendance']
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.studentId},"${s.name}","${s.class}",${s.rollNo},${s.email},"${s.parentName}","${s.parentContact}",${s.attendancePercent}%`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edusphere_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">
            Manage student enrollments, academic records, profiles and parental contacts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {students.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="btn-secondary"
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
              title="Delete all enrolled students"
            >
              <Trash2 size={16} />
              <span>Delete All Students</span>
            </button>
          )}
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
            <div className="table-search-input">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by student name, ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
              >
                <option value="ALL">All Classes & Sections</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing {filteredStudents.length} Students
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class & Roll</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Fee Status</th>
                <th>Guardian Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto',
                      color: 'var(--primary)'
                    }}>
                      <Users size={32} />
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      No Students Enrolled
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                      The student directory is empty. Faculty members can enroll students with interactive photo upload, Phone ID, and Date of Birth password.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ margin: '0 auto' }}>
                      <Plus size={16} />
                      <span>Enroll First Student</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={stu.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={stu.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{stu.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>
                        {stu.studentId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{stu.class}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll #{stu.rollNo}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '40px',
                          height: '6px',
                          background: 'var(--bg-input)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${stu.attendancePercent}%`,
                            height: '100%',
                            background: stu.attendancePercent >= 90 ? '#10b981' : '#f59e0b'
                          }} />
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{stu.attendancePercent}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {stu.gpa ? `${stu.gpa} / 4.0` : '3.8 / 4.0'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${stu.feeStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                        {stu.feeStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{stu.parentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.parentContact}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedStudentForView(stu)}
                          className="icon-btn"
                          style={{ width: '32px', height: '32px' }}
                          title="View Profile Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => deleteStudent(stu.id)}
                          className="icon-btn"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll New Student"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Student Photo Upload & Preview Section */}
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
                alt="Student Preview"
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
                htmlFor="student-photo-file"
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
                id="student-photo-file"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Student Photo (Identity Card)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Upload from Camera / Gallery or choose a sample avatar below:
              </div>

              {/* Sample Preset Avatars for 1-Click Pick */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
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
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Liam Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class & Section *
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                style={{ width: '100%' }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 24"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Credentials Notice */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-primary)',
          }}>
            🔑 <strong>Login Credentials:</strong> Student Phone Number is User ID & Date of Birth is Password (DDMMYYYY).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Phone Number (Login ID) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543299"
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
              Student Email
            </label>
            <input
              type="email"
              placeholder="e.g. liam.j@edusphere.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Parent / Guardian Name
              </label>
              <input
                type="text"
                placeholder="e.g. Michael Johnson"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Parent Contact Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.parentContact}
                onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                House Assignment
              </label>
              <select
                value={formData.house}
                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Emerald Dragons">Emerald Dragons</option>
                <option value="Ruby Phoenix">Ruby Phoenix</option>
                <option value="Sapphire Titans">Sapphire Titans</option>
                <option value="Golden Gryphons">Golden Gryphons</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Student View Modal */}
      {selectedStudentForView && (
        <Modal
          isOpen={!!selectedStudentForView}
          onClose={() => setSelectedStudentForView(null)}
          title="Student Profile Overview"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={selectedStudentForView.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={selectedStudentForView.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedStudentForView.name}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace' }}>
                  {selectedStudentForView.studentId}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedStudentForView.class} • Roll #{selectedStudentForView.rollNo} • House: {selectedStudentForView.house || 'Emerald Dragons'}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'var(--bg-input)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>GUARDIAN</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudentForView.parentName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>CONTACT</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudentForView.parentContact}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>BLOOD GROUP</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedStudentForView.bloodGroup || 'O+'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ATTENDANCE RATE</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#10b981' }}>{selectedStudentForView.attendancePercent}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedStudentForView(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
