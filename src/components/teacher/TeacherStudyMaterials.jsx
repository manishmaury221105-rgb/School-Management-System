import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { FileText, Plus, Trash2, Download, UploadCloud, Search, Printer } from 'lucide-react';
import { downloadStudyMaterialPdf, printStudyMaterialPdf } from '../../utils/pdfStudyMaterialGenerator';

export const TeacherStudyMaterials = () => {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial, classes, subjects, teachers } = useSchoolData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeTeacher = teachers?.find(t =>
    t.id === currentUser?.id ||
    (currentUser?.phone && t.phone === currentUser?.phone) ||
    (currentUser?.email && t.email?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || currentUser;

  const teacherClasses = React.useMemo(() => {
    const list = [];
    if (activeTeacher?.classTeacherOf) list.push(activeTeacher.classTeacherOf);
    if (Array.isArray(activeTeacher?.assignedClasses)) {
      activeTeacher.assignedClasses.forEach(c => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list.length > 0 ? list : ['Class 10-A'];
  }, [activeTeacher]);

  const defaultClass = activeTeacher?.classTeacherOf || teacherClasses[0] || 'Class 10-A';

  const [formData, setFormData] = useState({
    title: '',
    class: defaultClass,
    subject: 'Mathematics',
    chapter: '',
    topic: '',
    fileType: 'PDF',
    fileSize: '3.1 MB',
  });

  const teacherMaterials = studyMaterials.filter(
    (m) => m.uploadedBy === (currentUser?.name || activeTeacher?.name) || teacherClasses.includes(m.class)
  );

  const filtered = teacherMaterials.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addStudyMaterial({
      ...formData,
      class: formData.class || defaultClass,
      uploadedBy: currentUser?.name || activeTeacher?.name || 'Faculty Member',
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      class: defaultClass,
      subject: 'Mathematics',
      chapter: '',
      topic: '',
      fileType: 'PDF',
      fileSize: '3.1 MB',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Faculty Study Materials</h1>
          <p className="page-subtitle">
            Upload chapter notes, syllabus documents & assignments for your assigned classrooms.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <UploadCloud size={16} />
          <span>Upload Study Material</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by title, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          padding: '1.5rem',
          background: 'var(--bg-card)'
        }}>
          {filtered.map((mat) => (
            <div
              key={mat.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    background: mat.fileType === 'PDF' ? '#fee2e2' : '#e0e7ff',
                    color: mat.fileType === 'PDF' ? '#b91c1c' : '#4338ca',
                  }}>
                    {mat.fileType} • {mat.fileSize || '2.4 MB'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mat.uploadedDate}</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px' }}>
                  {mat.title}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '6px' }}>
                  {mat.subject} • {mat.class}
                </div>

                {mat.chapter && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong>Unit:</strong> {mat.chapter}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                marginTop: '1rem',
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  By: {mat.uploadedBy}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => printStudyMaterialPdf(mat)}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Print Document"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => downloadStudyMaterialPdf(mat)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}
                    title="Download Official PDF"
                  >
                    <Download size={13} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => deleteStudyMaterial(mat.id)}
                    className="icon-btn"
                    style={{ width: '30px', height: '30px', color: '#ef4444' }}
                    title="Delete File"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Material Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Course Material"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Material Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Physics Formula CheatSheet - Optics"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class Allocation
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                style={{ width: '100%' }}
              >
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} {cls === activeTeacher?.classTeacherOf ? '★ (Class Teacher)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%' }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Chapter Name
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 4"
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Format
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="PDF">PDF</option>
                <option value="DOC">Word Document</option>
                <option value="VIDEO">Video Link</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Upload Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
