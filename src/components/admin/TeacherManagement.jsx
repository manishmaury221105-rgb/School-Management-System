import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import { TeacherProfile } from '../teacher/TeacherProfile';
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
  CalendarCheck,
  Calendar,
  Clock,
  Check,
  Save,
  Download,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

export const TeacherManagement = () => {
  const { currentUser } = useAuth();
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    classes,
    staffAttendance,
    markBulkStaffAttendance,
  } = useSchoolData();

  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory' | 'attendance'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Strict Privacy Guard: If a logged-in teacher somehow renders this component, immediately route to their personal isolated profile
  if (currentUser?.role === ROLES.TEACHER) {
    return <TeacherProfile />;
  }

  // Initialize and synchronize staff attendance map
  useEffect(() => {
    const existing = staffAttendance?.[selectedDate] || {};
    const initial = {};
    teachers.forEach((t) => {
      initial[t.id] = {
        status: existing[t.id]?.status || 'Present',
        checkIn: existing[t.id]?.checkIn || '08:15 AM',
        checkOut: existing[t.id]?.checkOut || '03:45 PM',
        remarks: existing[t.id]?.remarks || '',
      };
    });
    setAttendanceMap(initial);
  }, [selectedDate, teachers, staffAttendance]);

  const handleStatusChange = (teacherId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        status,
        checkIn: status === 'Absent' || status === 'On Leave' ? '—' : (prev[teacherId]?.checkIn === '—' ? '08:15 AM' : (prev[teacherId]?.checkIn || '08:15 AM')),
        checkOut: status === 'Absent' || status === 'On Leave' ? '—' : (prev[teacherId]?.checkOut === '—' ? '03:45 PM' : (prev[teacherId]?.checkOut || '03:45 PM')),
      },
    }));
  };

  const handleTimeChange = (teacherId, field, value) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        [field]: value,
      },
    }));
  };

  const handleRemarksChange = (teacherId, remarks) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        remarks,
      },
    }));
  };

  const handleMarkAllStaff = (status) => {
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      teachers.forEach((t) => {
        updated[t.id] = {
          ...(updated[t.id] || {}),
          status,
          checkIn: status === 'Absent' || status === 'On Leave' ? '—' : '08:15 AM',
          checkOut: status === 'Absent' || status === 'On Leave' ? '—' : '03:45 PM',
        };
      });
      return updated;
    });
  };

  const handleSaveStaffAttendance = () => {
    markBulkStaffAttendance(selectedDate, attendanceMap);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const exportStaffAttendanceCSV = () => {
    const rows = [
      ['Date', 'Staff ID', 'Staff Name', 'Subject', 'Status', 'Check-In', 'Check-Out', 'Remarks'],
    ];
    teachers.forEach((t) => {
      const rec = attendanceMap[t.id] || {};
      rows.push([
        selectedDate,
        t.id,
        `"${t.name}"`,
        `"${t.subject}"`,
        rec.status || 'Present',
        rec.checkIn || '08:15 AM',
        rec.checkOut || '03:45 PM',
        `"${rec.remarks || ''}"`,
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `faculty_staff_attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportFullSessionStaffCSV = () => {
    const rows = [
      ['Date', 'Day', 'Staff ID', 'Staff Name', 'Subject', 'Status', 'Check-In', 'Check-Out', 'Duty Remarks']
    ];
    const dates = Object.keys(staffAttendance || {}).sort();
    dates.forEach((dStr) => {
      const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
      const dayRec = staffAttendance[dStr] || {};
      teachers.forEach((t) => {
        const rec = dayRec[t.id] || { status: 'Present', checkIn: '08:15 AM', checkOut: '03:45 PM', remarks: 'On Duty' };
        rows.push([
          dStr,
          dayName,
          t.id,
          `"${t.name}"`,
          `"${t.subject}"`,
          rec.status || 'Present',
          rec.checkIn || '08:15 AM',
          rec.checkOut || '03:45 PM',
          `"${rec.remarks || ''}"`
        ]);
      });
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `faculty_staff_attendance_FullSession_1Apr_31Mar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const newDate = `${y}-${m}-${dayNum}`;
    if (newDate >= '2026-04-01') {
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const newDate = `${y}-${m}-${dayNum}`;
    if (newDate <= '2027-03-31') {
      setSelectedDate(newDate);
    }
  };

  const handleMonthJump = (monthStr) => {
    if (!monthStr) return;
    setSelectedDate(`${monthStr}-01`);
  };

  // Staff Attendance Metrics
  const totalStaffCount = teachers.length;
  const presentStaffCount = Object.values(attendanceMap).filter((r) => r.status === 'Present').length;
  const lateStaffCount = Object.values(attendanceMap).filter((r) => r.status === 'Late').length;
  const leaveStaffCount = Object.values(attendanceMap).filter((r) => r.status === 'On Leave').length;
  const absentStaffCount = Object.values(attendanceMap).filter((r) => r.status === 'Absent').length;
  const attendanceRate = totalStaffCount > 0 ? Math.round(((presentStaffCount + lateStaffCount) / totalStaffCount) * 100) : 100;

  const filteredAttendanceTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      (t.phone && t.phone.includes(attendanceSearch))
  );

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
      {/* Page Header with Sub-tabs */}
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Faculty & Staff Management</h1>
          <p className="page-subtitle">
            Manage teacher profiles, subject specializations, classroom allocations, and record daily staff biometric attendance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            background: 'var(--bg-card)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <button
              onClick={() => setActiveSubTab('directory')}
              className={activeSubTab === 'directory' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={15} />
              <span>Faculty Directory ({teachers.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('attendance')}
              className={activeSubTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CalendarCheck size={15} />
              <span>Staff Attendance Register</span>
            </button>
          </div>

          {activeSubTab === 'directory' && (
            <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>Add Faculty Member</span>
            </button>
          )}

          {activeSubTab === 'attendance' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={exportStaffAttendanceCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Export selected date attendance">
                <Download size={15} />
                <span>Export Daily CSV</span>
              </button>
              <button onClick={exportFullSessionStaffCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: '700' }} title="Download all records from 1 April to 31 March">
                <FileSpreadsheet size={15} />
                <span>Export Full Session (1 Apr – 31 Mar) CSV</span>
              </button>
              <button onClick={handleSaveStaffAttendance} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={15} />
                <span>Save Staff Attendance</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View 1: Faculty Directory */}
      {activeSubTab === 'directory' && (
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
      )}

      {/* View 2: Faculty & Staff Attendance Register */}
      {activeSubTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {saveSuccess && (
            <div style={{
              padding: '0.85rem 1.25rem',
              background: '#dcfce7',
              color: '#15803d',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              animation: 'fadeIn 0.2s ease-out',
            }}>
              <Check size={18} />
              <span>Staff attendance records for {selectedDate} saved successfully!</span>
            </div>
          )}

          {/* KPI Statistics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div className="card-elevated" style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL FACULTY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalStaffCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                Active Roster Members
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid #10b98133' }}>
              <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '700' }}>PRESENT TODAY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                {presentStaffCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({attendanceRate}%)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700', marginTop: '2px' }}>
                On-Duty / Classrooms
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid #f59e0b33' }}>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '700' }}>LATE ARRIVALS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>
                {lateStaffCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: '700', marginTop: '2px' }}>
                Arrived after 08:30 AM
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid #3b82f633' }}>
              <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: '700' }}>ON LEAVE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1d4ed8', marginTop: '4px' }}>
                {leaveStaffCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '700', marginTop: '2px' }}>
                Approved Medical / Casual
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid #ef444433' }}>
              <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '700' }}>UNEXCUSED ABSENT</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
                {absentStaffCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '700', marginTop: '2px' }}>
                Action Required
              </div>
            </div>
          </div>

          {/* Control Bar: Date Selector, Month Jump & Quick Bulk Actions */}
          <div className="card-elevated" style={{
            padding: '1.25rem',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {/* Session Indicator Badge Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #bfdbfe',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Official Academic Session: 1 April 2026 — 31 March 2027
                </span>
                <span className="badge-status badge-present" style={{ fontSize: '0.72rem' }}>
                  Full Year Register Active
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Selected Date: <strong style={{ color: 'var(--primary)' }}>{selectedDate}</strong> ({new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })})
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Date Input with Prev / Next */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    ATTENDANCE DATE (1 APR – 31 MAR)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={handlePrevDay}
                      className="btn-secondary"
                      style={{ padding: '6px 8px' }}
                      title="Previous Working Day"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <input
                      type="date"
                      min="2026-04-01"
                      max="2027-03-31"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ fontWeight: '700', padding: '6px 12px' }}
                    />
                    <button
                      onClick={handleNextDay}
                      className="btn-secondary"
                      style={{ padding: '6px 8px' }}
                      title="Next Working Day"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: '700' }}
                    >
                      Today
                    </button>
                  </div>
                </div>

                {/* Jump to Month */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    JUMP TO MONTH
                  </label>
                  <select
                    value={selectedDate.slice(0, 7)}
                    onChange={(e) => handleMonthJump(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    <option value="2026-04">April 2026 (Session Start)</option>
                    <option value="2026-05">May 2026</option>
                    <option value="2026-06">June 2026</option>
                    <option value="2026-07">July 2026</option>
                    <option value="2026-08">August 2026</option>
                    <option value="2026-09">September 2026</option>
                    <option value="2026-10">October 2026 (Current Term)</option>
                    <option value="2026-11">November 2026</option>
                    <option value="2026-12">December 2026</option>
                    <option value="2027-01">January 2027</option>
                    <option value="2027-02">February 2027</option>
                    <option value="2027-03">March 2027 (Session End)</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    SEARCH STAFF
                  </label>
                  <input
                    type="text"
                    placeholder="Filter faculty name / subject..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '0.85rem', width: '220px' }}
                  />
                </div>
              </div>

              {/* Quick Bulk Marking Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Actions:</span>
                <button
                  onClick={() => handleMarkAllStaff('Present')}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#15803d', fontWeight: '700' }}
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAllStaff('On Leave')}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}
                >
                  Mark All On Leave
                </button>
                <button
                  onClick={() => handleMarkAllStaff('Absent')}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Attendance Table */}
          <div className="table-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Faculty / Staff Member</th>
                    <th>Department & Role</th>
                    <th>Assigned Classes</th>
                    <th style={{ minWidth: '300px' }}>Attendance Status</th>
                    <th style={{ minWidth: '120px' }}>Check-In</th>
                    <th style={{ minWidth: '120px' }}>Check-Out</th>
                    <th style={{ minWidth: '220px' }}>Remarks / Duty Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendanceTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No faculty members match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendanceTeachers.map((teacher) => {
                      const rec = attendanceMap[teacher.id] || {
                        status: 'Present',
                        checkIn: '08:15 AM',
                        checkOut: '03:45 PM',
                        remarks: '',
                      };
                      return (
                        <tr key={teacher.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                                alt={teacher.name}
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                  {teacher.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ID: {teacher.id} • {teacher.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              {teacher.subject}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {teacher.roomNo || 'Staff Room 1'} • Exp: {teacher.experience || '5 Yrs'}
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {teacher.assignedClasses?.map((cls, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: cls === teacher.classTeacherOf ? 'var(--primary-light)' : 'var(--bg-input)',
                                    color: cls === teacher.classTeacherOf ? 'var(--primary)' : 'var(--text-secondary)',
                                  }}
                                >
                                  {cls}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(teacher.id, 'Present')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: rec.status === 'Present' ? '1.5px solid #16a34a' : '1px solid var(--border)',
                                  background: rec.status === 'Present' ? '#dcfce7' : 'var(--bg-input)',
                                  color: rec.status === 'Present' ? '#15803d' : 'var(--text-secondary)',
                                }}
                              >
                                ✓ Present
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(teacher.id, 'Late')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: rec.status === 'Late' ? '1.5px solid #d97706' : '1px solid var(--border)',
                                  background: rec.status === 'Late' ? '#fef3c7' : 'var(--bg-input)',
                                  color: rec.status === 'Late' ? '#b45309' : 'var(--text-secondary)',
                                }}
                              >
                                ⏱ Late
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(teacher.id, 'On Leave')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: rec.status === 'On Leave' ? '1.5px solid #2563eb' : '1px solid var(--border)',
                                  background: rec.status === 'On Leave' ? '#dbeafe' : 'var(--bg-input)',
                                  color: rec.status === 'On Leave' ? '#1d4ed8' : 'var(--text-secondary)',
                                }}
                              >
                                🏖 On Leave
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(teacher.id, 'Absent')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: rec.status === 'Absent' ? '1.5px solid #dc2626' : '1px solid var(--border)',
                                  background: rec.status === 'Absent' ? '#fee2e2' : 'var(--bg-input)',
                                  color: rec.status === 'Absent' ? '#b91c1c' : 'var(--text-secondary)',
                                }}
                              >
                                ✕ Absent
                              </button>
                            </div>
                          </td>

                          <td>
                            <input
                              type="text"
                              value={rec.checkIn || ''}
                              placeholder="08:15 AM"
                              onChange={(e) => handleTimeChange(teacher.id, 'checkIn', e.target.value)}
                              disabled={rec.status === 'Absent' || rec.status === 'On Leave'}
                              style={{ width: '100px', fontSize: '0.82rem', padding: '4px 8px', fontWeight: '600' }}
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              value={rec.checkOut || ''}
                              placeholder="03:45 PM"
                              onChange={(e) => handleTimeChange(teacher.id, 'checkOut', e.target.value)}
                              disabled={rec.status === 'Absent' || rec.status === 'On Leave'}
                              style={{ width: '100px', fontSize: '0.82rem', padding: '4px 8px', fontWeight: '600' }}
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              value={rec.remarks || ''}
                              placeholder="e.g. Morning Assembly Incharge"
                              onChange={(e) => handleRemarksChange(teacher.id, e.target.value)}
                              style={{ width: '100%', fontSize: '0.82rem', padding: '4px 8px' }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
