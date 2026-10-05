import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { FeeCollectionModal } from './FeeCollectionModal';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Eye,
  Filter,
  Download,
  Pencil,
  CreditCard,
  Camera,
} from 'lucide-react';

export const StudentManagement = ({ setActiveTab }) => {
  const { currentRole, currentUser } = useAuth();
  const isAdmin = currentRole === ROLES.ADMIN;
  const { students, addStudent, updateStudent, deleteStudent, clearAllStudents, classes, teachers } = useSchoolData();

  // Identify teacher profile and calculate allowed classrooms
  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const allowedClasses = React.useMemo(() => {
    if (isAdmin) return classes;
    const allowedNames = new Set();
    if (activeTeacher?.classTeacherOf) {
      allowedNames.add(activeTeacher.classTeacherOf);
    }
    if (Array.isArray(activeTeacher?.assignedClasses) && activeTeacher.assignedClasses.length > 0) {
      activeTeacher.assignedClasses.forEach(c => allowedNames.add(c));
    }
    if (allowedNames.size === 0) {
      if (classes.length > 0) allowedNames.add(classes[0].name);
    }
    const filtered = classes.filter(c => allowedNames.has(c.name));
    return filtered.length > 0 ? filtered : (classes.length > 0 ? [classes[0]] : [{ id: 'c1', name: 'Class 10-A' }]);
  }, [isAdmin, classes, activeTeacher]);

  const defaultAssignedClass = activeTeacher?.classTeacherOf || (Array.isArray(activeTeacher?.assignedClasses) && activeTeacher.assignedClasses[0]) || classes[0]?.name || 'Class 10-A';
  const allowedClassNames = React.useMemo(() => new Set(allowedClasses.map(c => c.name)), [allowedClasses]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(() => (isAdmin ? 'ALL' : defaultAssignedClass));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState(null);

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
    class: defaultAssignedClass,
    rollNo: '',
    phone: '',
    dob: '2010-05-15',
    email: '',
    parentName: '',
    parentContact: '',
    bloodGroup: 'O+',
    house: 'Emerald Dragons',
  });

  const [editFormData, setEditFormData] = useState({
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
    feeStatus: 'Pending',
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

  const handleOpenAddModal = () => {
    const initialClass = (selectedClass !== 'ALL' && allowedClasses.some(c => c.name === selectedClass))
      ? selectedClass
      : defaultAssignedClass;

    setFormData({
      name: '',
      avatar: DEFAULT_AVATAR,
      class: initialClass,
      rollNo: '',
      phone: '',
      dob: '2010-05-15',
      email: '',
      parentName: '',
      parentContact: '',
      bloodGroup: 'O+',
      house: 'Emerald Dragons',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudentId(student.id);
    const isClassAllowed = allowedClasses.some(c => c.name === student.class);
    setEditFormData({
      name: student.name || '',
      avatar: student.avatar || DEFAULT_AVATAR,
      class: isClassAllowed ? student.class : defaultAssignedClass,
      rollNo: student.rollNo || '',
      phone: student.phone || '',
      dob: student.dob || '2010-05-15',
      email: student.email || '',
      parentName: student.parentName || '',
      parentContact: student.parentContact || '',
      bloodGroup: student.bloodGroup || 'O+',
      house: student.house || 'Emerald Dragons',
      feeStatus: student.feeStatus || 'Pending',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.rollNo || !editFormData.phone) return;
    const targetClass = (!isAdmin && !allowedClasses.some(c => c.name === editFormData.class))
      ? defaultAssignedClass
      : editFormData.class;
    updateStudent(editingStudentId, { ...editFormData, class: targetClass });
    setIsEditModalOpen(false);
    setEditingStudentId(null);
  };

  const filteredStudents = students.filter((s) => {
    // If not admin, student MUST belong to teacher's assigned classes
    if (!isAdmin && !allowedClassNames.has(s.class)) {
      return false;
    }
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.rollNo && String(s.rollNo).includes(searchTerm)) ||
      (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.phone) return;
    addStudent({ ...formData, class: formData.class || defaultAssignedClass });
    setIsModalOpen(false);
    setFormData({
      name: '',
      avatar: DEFAULT_AVATAR,
      class: defaultAssignedClass,
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
          {isAdmin && (
            <button onClick={() => { setSelectedStudentForFee(null); setIsFeeModalOpen(true); }} className="btn-secondary">
              <CreditCard size={16} />
              <span>Fees</span>
            </button>
          )}
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleOpenAddModal} className="btn-primary">
            <Plus size={16} />
            <span>Add Student</span>
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
                placeholder="Search by student name, roll no, ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.88rem', fontWeight: '600' }}
              >
                {isAdmin ? (
                  <>
                    <option value="ALL">All Classes & Sections ({students.length})</option>
                    {classes.map((c) => {
                      const count = students.filter(s => s.class === c.name).length;
                      return (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name} ({count})
                        </option>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {allowedClasses.length > 1 && (
                      <option value="ALL">
                        All My Assigned Classes ({students.filter(s => allowedClassNames.has(s.class)).length})
                      </option>
                    )}
                    {allowedClasses.map((c) => {
                      const count = students.filter(s => s.class === c.name).length;
                      const isClassTeacher = activeTeacher?.classTeacherOf === c.name;
                      return (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name} ({count} Students) {isClassTeacher ? '★ Class Teacher' : '• Assigned'}
                        </option>
                      );
                    })}
                  </>
                )}
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
                {isAdmin && <th>Fee Status</th>}
                <th>Guardian Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
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
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() => {
                            setSelectedStudentForFee(stu);
                            setIsFeeModalOpen(true);
                          }}
                          className={`badge-status ${stu.feeStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '700',
                          }}
                          title="Click to open fee collection form"
                        >
                          <CreditCard size={12} />
                          <span>{stu.feeStatus || 'Pending'}</span>
                        </button>
                      </td>
                    )}
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{stu.parentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.parentContact}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedStudentForFee(stu);
                              setIsFeeModalOpen(true);
                            }}
                            className="btn-secondary"
                            style={{
                              padding: '4px 9px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              borderRadius: '7px',
                              color: stu.feeStatus === 'Paid' ? '#059669' : '#d97706',
                              borderColor: stu.feeStatus === 'Paid' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                              background: stu.feeStatus === 'Paid' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                            }}
                            title="Collect Fee / Open Fee Form"
                          >
                            <CreditCard size={13} />
                            <span>Fee</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudentForView(stu)}
                          className="icon-btn"
                          style={{ width: '32px', height: '32px' }}
                          title="View Profile Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(stu)}
                          className="icon-btn"
                          style={{ width: '32px', height: '32px', color: 'var(--primary)' }}
                          title="Edit Student Information"
                        >
                          <Pencil size={15} />
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

      {/* Add / Enroll Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Student (Admission)"
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
                disabled={!isAdmin && allowedClasses.length === 1}
              >
                {allowedClasses.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} {!isAdmin && (activeTeacher?.classTeacherOf === c.name ? '(Class Teacher)' : '(Assigned)')}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '3px', fontWeight: '600' }}>
                  🔒 Limited to your assigned classroom
                </div>
              )}
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

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStudentId(null);
        }}
        title="Edit Student Information"
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                src={editFormData.avatar}
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
                htmlFor="edit-student-photo-file"
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
                id="edit-student-photo-file"
                type="file"
                accept="image/*"
                onChange={handleEditPhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Student Photo (Identity Card)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Upload new photo or choose avatar below:
              </div>

              {/* Sample Preset Avatars */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {PRESET_AVATARS.map((url, idx) => (
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
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Liam Johnson"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class & Section *
              </label>
              <select
                value={editFormData.class}
                onChange={(e) => setEditFormData({ ...editFormData, class: e.target.value })}
                style={{ width: '100%' }}
                disabled={!isAdmin && allowedClasses.length === 1}
              >
                {allowedClasses.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} {!isAdmin && (activeTeacher?.classTeacherOf === c.name ? '(Class Teacher)' : '(Assigned)')}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '3px', fontWeight: '600' }}>
                  🔒 Limited to your assigned classroom
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 24"
                value={editFormData.rollNo}
                onChange={(e) => setEditFormData({ ...editFormData, rollNo: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
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
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Date of Birth (Password) *
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
              Student Email
            </label>
            <input
              type="email"
              placeholder="e.g. liam.j@edusphere.edu"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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
                value={editFormData.parentName}
                onChange={(e) => setEditFormData({ ...editFormData, parentName: e.target.value })}
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
                value={editFormData.parentContact}
                onChange={(e) => setEditFormData({ ...editFormData, parentContact: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Blood Group
              </label>
              <select
                value={editFormData.bloodGroup}
                onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
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
                value={editFormData.house}
                onChange={(e) => setEditFormData({ ...editFormData, house: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Emerald Dragons">Emerald Dragons</option>
                <option value="Ruby Phoenix">Ruby Phoenix</option>
                <option value="Sapphire Titans">Sapphire Titans</option>
                <option value="Golden Gryphons">Golden Gryphons</option>
              </select>
            </div>
            {isAdmin && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Fee Status (Admin Only)
                </label>
                <select
                  value={editFormData.feeStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, feeStatus: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingStudentId(null);
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

      {/* Student View Modal */}
      {selectedStudentForView && (
        <Modal
          isOpen={!!selectedStudentForView}
          onClose={() => setSelectedStudentForView(null)}
          title="Official Student Profile & Academic Dossier"
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.06))',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}>
              <img
                src={selectedStudentForView.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={selectedStudentForView.name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>{selectedStudentForView.name}</h3>
                  <span className="badge-status badge-active" style={{ fontSize: '0.72rem' }}>
                    {selectedStudentForView.status || 'Active'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {selectedStudentForView.studentId}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {selectedStudentForView.class} • Roll #{selectedStudentForView.rollNo}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  House: <strong>{selectedStudentForView.house || 'Emerald Dragons'}</strong> • Admission: <strong>{selectedStudentForView.admissionNo || 'ADM-2026'}</strong>
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
              background: 'var(--bg-input)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PHONE (LOGIN USER ID)</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedStudentForView.phone || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>DATE OF BIRTH (PASSWORD)</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedStudentForView.dob || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>GUARDIAN / PARENT</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedStudentForView.parentName || 'Guardian'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PARENT CONTACT</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedStudentForView.parentContact || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>BLOOD GROUP</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--primary)', marginTop: '2px' }}>
                  {selectedStudentForView.bloodGroup || 'O+'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ATTENDANCE RATE</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#10b981', marginTop: '2px' }}>
                  {selectedStudentForView.attendancePercent || 95}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ACADEMIC GPA</div>
                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedStudentForView.gpa || 3.8} / 4.0
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>FEE STATUS</div>
                <div style={{
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  marginTop: '2px',
                  color: selectedStudentForView.feeStatus === 'Paid' ? '#10b981' : '#f59e0b'
                }}>
                  ● {selectedStudentForView.feeStatus || 'Pending'}
                </div>
              </div>
            </div>

            {selectedStudentForView.address && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                📍 <strong>Residential Address:</strong> {selectedStudentForView.address}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  const target = selectedStudentForView;
                  setSelectedStudentForView(null);
                  handleOpenEditModal(target);
                }}
                className="btn-primary"
              >
                <Pencil size={15} />
                <span>Edit Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudentForView(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Fee Collection Form Modal with student details */}
      <FeeCollectionModal
        isOpen={isFeeModalOpen}
        initialStudent={selectedStudentForFee}
        onClose={() => {
          setIsFeeModalOpen(false);
          setSelectedStudentForFee(null);
        }}
      />
    </div>
  );
};
