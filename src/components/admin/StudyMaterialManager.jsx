import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { FileText, Plus, Trash2, Download, Search, BookOpen, UploadCloud, Video } from 'lucide-react';

export const StudyMaterialManager = () => {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial, classes, subjects, teachers } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    class: 'Class 10-A',
    subject: 'Mathematics',
    chapter: 'Chapter 5 - Arithmetic Progressions',
    topic: 'Sum of N terms & Real-world Word Problems',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadedBy: 'Mrs. Sarah Jenkins',
  });

  const filteredMaterials = studyMaterials.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.chapter && m.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addStudyMaterial(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      class: 'Class 10-A',
      subject: 'Mathematics',
      chapter: 'Chapter 5 - Arithmetic Progressions',
      topic: 'Sum of N terms & Real-world Word Problems',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      uploadedBy: 'Mrs. Sarah Jenkins',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Digital Study Materials & Notes</h1>
          <p className="page-subtitle">
            Curate and distribute e-books, formula cheat sheets, video lectures & laboratory manuals.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <UploadCloud size={16} />
          <span>Upload New Material</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search study material by topic, subject, class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filteredMaterials.length} Documents Available
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          padding: '1.5rem',
          background: 'var(--bg-card)'
        }}>
          {filteredMaterials.map((mat) => (
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

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)' }}>
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
                {mat.topic && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Topic: {mat.topic}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                marginTop: '1rem'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  By: {mat.uploadedBy}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => alert(`Downloading ${mat.title}...`)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    <Download size={13} />
                    <span>Download</span>
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
        title="Upload Study Material / Document"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Material Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 6 - Ray Optics & Refraction Guide"
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
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
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
                placeholder="e.g. Chapter 6"
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Document Format
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="PDF">PDF Document</option>
                <option value="DOC">Word Document (.docx)</option>
                <option value="VIDEO">Video Lecture Link</option>
                <option value="NOTES">Handwritten Notes</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
