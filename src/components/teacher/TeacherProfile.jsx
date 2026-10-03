import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Lock,
  Save,
  GraduationCap,
  Sparkles,
  School,
} from 'lucide-react';

export const TeacherProfile = () => {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const { teachers, updateTeacher } = useSchoolData();

  // Find current teacher record in database
  const teacherRecord = teachers?.find(
    (t) =>
      t.id === currentUser?.id ||
      (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase()) ||
      (currentUser?.phone && t.phone === currentUser?.phone)
  ) || {};

  const [formData, setFormData] = useState({
    name: currentUser?.name || teacherRecord.name || 'Mrs. Sarah Jenkins',
    email: currentUser?.email || teacherRecord.email || 'sarah.jenkins@edusphere.edu',
    phone: currentUser?.phone || teacherRecord.phone || '+91 98765 43210',
    subject: currentUser?.subject || teacherRecord.subject || 'Advanced Mathematics & Physics',
    experience: teacherRecord.experience || '8 Years Teaching Experience',
    qualification: teacherRecord.qualification || 'M.Sc. Mathematics, B.Ed.',
    dob: teacherRecord.dob || '1988-06-15',
    classTeacherOf: currentUser?.classTeacherOf || teacherRecord.classTeacherOf || 'Class 10-A',
    assignedClasses: currentUser?.assignedClasses || teacherRecord.assignedClasses || ['Class 10-A', 'Class 9-B'],
    avatar: currentUser?.avatar || teacherRecord.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update both Auth state and SchoolData state for current teacher only
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      avatar: formData.avatar,
    });

    if (teacherRecord.id) {
      updateTeacher(teacherRecord.id, {
        ...teacherRecord,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        experience: formData.experience,
        qualification: formData.qualification,
        dob: formData.dob,
        avatar: formData.avatar,
      });
    }

    setIsEditing(false);
    setSuccessMsg('✓ Your profile details updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPwd) return;
    const res = changePassword(currentPwd, newPwd);
    setPwdMsg(res.message);
    setTimeout(() => setPwdMsg(''), 3500);
    setCurrentPwd('');
    setNewPwd('');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header-wrap">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
            <ShieldCheck size={16} />
            <span>Private Faculty Profile (Restricted Access)</span>
          </div>
          <h1 className="page-title">My Faculty Profile</h1>
          <p className="page-subtitle">
            Manage your personal faculty credentials, contact info, assigned classes and security settings.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'btn-secondary' : 'btn-primary'}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div
          className="animate-fade-in"
          style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-lg)',
            color: '#065f46',
            fontWeight: '700',
            fontSize: '0.9rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Left Column: ID Pass Card */}
        <div className="card-elevated" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <img
                src={formData.avatar}
                alt={formData.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid white',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              />
              {isEditing && (
                <label
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '6px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Upload New Photo"
                >
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: '0 0 4px 0' }}>{formData.name}</h2>
            <div style={{ fontSize: '0.85rem', color: '#c7d2fe', fontWeight: '600' }}>
              {formData.subject}
            </div>
            <div style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '3px 12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '800',
              letterSpacing: '0.04em',
            }}>
              FACULTY ID: {teacherRecord.teacherId || 'TCH-2026-101'}
            </div>
          </div>

          {/* Assigned Classes Quick Badges */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              CLASSROOM ALLOCATION:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {formData.assignedClasses.map((cls, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: cls === formData.classTeacherOf ? 'var(--primary-light)' : 'var(--bg-input)',
                    color: cls === formData.classTeacherOf ? 'var(--primary)' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {cls} {cls === formData.classTeacherOf && '★ Class Teacher'}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Qualifications & Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
              <GraduationCap size={18} color="var(--primary)" />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Qualification:</strong> {formData.qualification}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
              <Award size={18} color="var(--primary)" />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Experience:</strong> {formData.experience}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
              <Clock size={18} color="var(--primary)" />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Teaching Hours:</strong> Full-Time (30 Periods/Week)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Contact & Credentials */}
        <div className="card-elevated" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Personal Credentials & Contact
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject Specialization
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Qualifications
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={15} />
                  <span>Save Profile</span>
                </button>
              </div>
            )}
          </form>

          {/* Security & Password Section */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} color="var(--primary)" />
              <span>Update Account Password</span>
            </h4>

            {pwdMsg && (
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', marginBottom: '0.5rem' }}>
                {pwdMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                style={{ flex: 1, minWidth: '140px' }}
              />
              <input
                type="password"
                placeholder="New Secure Password"
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                style={{ flex: 1, minWidth: '140px' }}
              />
              <button type="submit" className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
