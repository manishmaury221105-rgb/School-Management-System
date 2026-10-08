import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, Search, BookOpen, Clock, Check, Printer } from 'lucide-react';
import { downloadStudyMaterialPdf, printStudyMaterialPdf } from '../../utils/pdfStudyMaterialGenerator';

export const StudentStudyMaterial = () => {
  const { studyMaterials } = useSchoolData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const studentClass = currentUser?.class || 'Class 10-A';
  const myMaterials = (studyMaterials || []).filter(m => m && (m.class === studentClass || m.class === 'All Classes'));

  const handleDownloadMaterial = async (mat) => {
    setDownloadingId(mat.id);
    setToastMsg(`Preparing PDF: ${mat.title}...`);
    try {
      const res = await downloadStudyMaterialPdf(mat);
      if (res && res.success) {
        setToastMsg(`✓ Downloaded: ${mat.title}.pdf`);
      } else if (res && res.cancelled) {
        setToastMsg('');
      } else {
        setToastMsg(`✓ File generated: ${mat.title}`);
      }
    } catch (err) {
      console.error('Download error:', err);
      setToastMsg('⚠️ Download failed, please try print option.');
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
        setToastMsg('');
      }, 3500);
    }
  };

  const filtered = myMaterials.filter(m =>
    (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.chapter && m.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Course Study Materials & Notes</h1>
          <p className="page-subtitle">
            Download syllabus guides, formula cheat sheets, video lecture links & lab manuals for {studentClass}.
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div
          className="animate-fade-in"
          style={{
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(16, 185, 129, 0.12))',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search study material by subject, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filtered.length} Resources Available
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
                marginTop: '1rem',
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  By: {mat.uploadedBy}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => printStudyMaterialPdf(mat)}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Print Study Material"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => handleDownloadMaterial(mat)}
                    disabled={downloadingId === mat.id}
                    className="btn-primary"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: downloadingId === mat.id ? '#10b981' : 'var(--primary)',
                    }}
                  >
                    {downloadingId === mat.id ? <Check size={14} /> : <Download size={14} />}
                    <span>{downloadingId === mat.id ? 'Downloading...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

