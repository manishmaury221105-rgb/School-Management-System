import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { getSampleTimetablePNG } from '../../utils/sampleTimetableImage';
import {
  Calendar,
  Download,
  Printer,
  Maximize2,
  FileImage,
  Sparkles,
} from 'lucide-react';

export const StudentTimetable = () => {
  const { timetable } = useSchoolData();
  const { currentUser } = useAuth();
  const studentClass = currentUser?.class || 'Class 10-A';
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Get active timetable photo uploaded by the teacher for this student's class
  const classTimetableData = timetable?.[studentClass];
  
  let activeImage = null;
  if (typeof classTimetableData === 'object' && classTimetableData?.photo) {
    activeImage = classTimetableData.photo;
  } else if (!timetable || Object.keys(timetable).length === 0 || !classTimetableData) {
    // Generate a clean sample PNG if nothing uploaded yet for Class 10-A
    if (studentClass === 'Class 10-A') {
      activeImage = getSampleTimetablePNG('Class 10-A');
    }
  }

  const activeTitle = (typeof classTimetableData === 'object' && classTimetableData?.title) || `${studentClass} Weekly Timetable`;
  const activeUploadedBy = (typeof classTimetableData === 'object' && classTimetableData?.uploadedBy) || 'Class Teacher';
  const activeNotes = typeof classTimetableData === 'object' ? classTimetableData?.notes : '';
  const activeUploadedDate = (typeof classTimetableData === 'object' && classTimetableData?.updatedAt)
    ? new Date(classTimetableData.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Active Term';

  const handleDownload = () => {
    if (!activeImage) return;
    const link = document.createElement('a');
    link.href = activeImage;
    link.download = `${studentClass.replace(/\s+/g, '_')}_Timetable.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!activeImage) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${studentClass} Timetable</title>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${activeImage}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2.5rem' }}>
      {/* Page Header */}
      <div className="page-header-wrap" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={26} color="var(--primary)" />
            <span>Class Timetable</span>
          </h1>
          <p className="page-subtitle">
            {studentClass} • Official weekly routine uploaded by your class teacher
          </p>
        </div>

        {activeImage && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsZoomOpen(true)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '7px 14px' }}
            >
              <Maximize2 size={15} />
              <span>Zoom View</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '7px 14px' }}
            >
              <Download size={15} />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '7px 14px' }}
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>

      {/* Routine Photo Display */}
      {activeImage ? (
        <div className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
          }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {activeTitle}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Uploaded by <strong>{activeUploadedBy}</strong> • Updated on {activeUploadedDate}
              </div>
            </div>

            <div style={{
              fontSize: '0.78rem',
              fontWeight: '800',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              ● ACTIVE TIMETABLE
            </div>
          </div>

          {activeNotes && (
            <div style={{
              padding: '0.65rem 0.85rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}>
              📌 <strong>Notice from Teacher:</strong> {activeNotes}
            </div>
          )}

          {/* Clickable Image to Zoom */}
          <div
            onClick={() => setIsZoomOpen(true)}
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0.5rem',
            }}
            title="Click to zoom in"
          >
            <img
              src={activeImage}
              alt={`${studentClass} Timetable`}
              style={{
                width: '100%',
                maxHeight: '650px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                display: 'block',
              }}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="card-elevated" style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          border: '2px dashed var(--border)',
          background: 'var(--bg-card)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-input)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}>
            <FileImage size={32} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            No Timetable Photo Uploaded Yet for {studentClass}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
            Your class teacher or school administrator will upload the official weekly period timetable photo soon.
          </p>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={`${studentClass} - Timetable Photo`}
      >
        <div style={{ textAlign: 'center', maxHeight: '75vh', overflowY: 'auto' }}>
          <img
            src={activeImage}
            alt="Fullscreen Timetable"
            style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', display: 'block' }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={handleDownload} className="btn-secondary">
              <Download size={16} />
              <span>Download Image</span>
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={16} />
              <span>Print Timetable</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
