import React, { useState, useRef } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { getSampleTimetablePNG } from '../../utils/sampleTimetableImage';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Download,
  Printer,
  Maximize2,
  CheckCircle,
  Calendar,
  Sparkles,
  RefreshCw,
  Camera,
  FileImage,
} from 'lucide-react';

export const TeacherTimetable = () => {
  const { timetable, classes, uploadTimetablePhoto, deleteTimetablePhoto } = useSchoolData();
  const { currentUser } = useAuth();

  const assignedClass = currentUser?.classTeacherOf || currentUser?.assignedClasses?.[0] || 'Class 10-A';
  const [selectedClass, setSelectedClass] = useState(assignedClass);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(false);
  const fileInputRef = useRef(null);

  // Retrieve current active timetable photo for the selected class
  const classTimetableData = timetable?.[selectedClass];
  let activeImage = typeof classTimetableData === 'object' ? classTimetableData?.photo : null;
  if (!activeImage && selectedClass === 'Class 10-A') {
    activeImage = getSampleTimetablePNG('Class 10-A');
  }

  const activeTitle = (typeof classTimetableData === 'object' && classTimetableData?.title) || `${selectedClass} Official Routine`;
  const activeUploadedBy = (typeof classTimetableData === 'object' && classTimetableData?.uploadedBy) || currentUser?.name || 'Class Teacher';
  const activeUploadedDate = (typeof classTimetableData === 'object' && classTimetableData?.updatedAt)
    ? new Date(classTimetableData.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently Updated';

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    const imageToSave = photoPreview || getSampleTimetablePNG(selectedClass);
    if (!imageToSave) return;

    uploadTimetablePhoto(selectedClass, {
      photo: imageToSave,
      title: titleInput.trim() || `${selectedClass} Weekly Timetable Routine`,
      notes: notesInput.trim(),
      uploadedBy: currentUser?.name || 'Class Teacher',
    });

    setPhotoPreview(null);
    setTitleInput('');
    setNotesInput('');
    setUploadSuccessMsg(true);
    setTimeout(() => setUploadSuccessMsg(false), 4000);
  };

  const handleLoadSampleRoutine = () => {
    const sample = getSampleTimetablePNG(selectedClass);
    setPhotoPreview(sample);
    setTitleInput(`${selectedClass} Complete Weekly Routine`);
  };

  const handleDeleteCurrentPhoto = () => {
    if (window.confirm(`Are you sure you want to remove the timetable photo for ${selectedClass}?`)) {
      deleteTimetablePhoto(selectedClass);
    }
  };

  const handleDownload = () => {
    const src = activeImage || photoPreview;
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `${selectedClass.replace(/\s+/g, '_')}_Timetable.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const src = activeImage || photoPreview;
    if (!src) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${selectedClass} Timetable</title>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${src}" onload="window.print(); window.close();" />
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
            <span>Class Timetable Photo Upload</span>
          </h1>
          <p className="page-subtitle">
            Upload timetable photo for your class. Enrolled students will immediately see this photo in their portal.
          </p>
        </div>

        {/* Class Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
            Select Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPhotoPreview(null);
            }}
            style={{ fontWeight: '700', padding: '9px 16px', borderRadius: 'var(--radius-md)', minWidth: '160px' }}
          >
            {classes?.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name} {c.name === assignedClass ? '★ (My Class)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.85rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#059669',
          fontWeight: '700',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
        }}>
          <CheckCircle size={18} />
          <span>Timetable photo for {selectedClass} successfully published for all students!</span>
        </div>
      )}

      {/* Upload Form Card */}
      <div className="card-elevated" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--primary)" />
              <span>Upload Timetable Photo ({selectedClass})</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload a clear photo or screenshot of the weekly period routine.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleRoutine}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Load sample routine"
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Load Sample Photo</span>
          </button>
        </div>

        <form onSubmit={handleSavePhoto}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* File Picker Box */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: photoPreview ? '2px solid var(--primary)' : '2px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem 1rem',
                  textAlign: 'center',
                  background: photoPreview ? 'rgba(79, 70, 229, 0.04)' : 'var(--bg-input)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {photoPreview ? (
                  <div>
                    <img
                      src={photoPreview}
                      alt="Selected Preview"
                      style={{
                        maxHeight: '130px',
                        maxWidth: '100%',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'contain',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <RefreshCw size={13} />
                      <span>Click to change photo</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto'
                    }}>
                      <Camera size={26} />
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      Click to choose Timetable Photo
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Supports PNG, JPG, JPEG, WEBP or Camera capture
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Routine Title / Caption
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${selectedClass} Weekly Class Routine - 2026`}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Special Notice for Students (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Science lab coats mandatory on practical days."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setTitleInput(''); }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!photoPreview}
                  className="btn-primary"
                  style={{
                    opacity: photoPreview ? 1 : 0.6,
                    cursor: photoPreview ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UploadCloud size={16} />
                  <span>Upload & Publish Photo</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Display Current Photo */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileImage size={22} color="var(--primary)" />
              <span>Current Timetable Photo ({selectedClass})</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              This exact photo is visible to all students of {selectedClass}.
            </p>
          </div>

          {activeImage && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsZoomOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <Maximize2 size={15} />
                <span>Zoom View</span>
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <Download size={15} />
                <span>Download</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDeleteCurrentPhoto}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px', color: '#ef4444', borderColor: '#fca5a5' }}
              >
                <Trash2 size={15} />
                <span>Delete Photo</span>
              </button>
            </div>
          )}
        </div>

        {activeImage ? (
          <div className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {activeTitle}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Uploaded by <strong>{activeUploadedBy}</strong> • Updated on {activeUploadedDate}
                </div>
              </div>

              <div style={{
                fontSize: '0.78rem',
                fontWeight: '800',
                background: 'rgba(79, 70, 229, 0.1)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
              }}>
                ● LIVE FOR STUDENTS
              </div>
            </div>

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
              title="Click to zoom"
            >
              <img
                src={activeImage}
                alt={`${selectedClass} Timetable`}
                style={{
                  width: '100%',
                  maxHeight: '550px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="card-elevated" style={{
            padding: '3rem 1.5rem',
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
              <ImageIcon size={32} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              No Timetable Photo Uploaded for {selectedClass}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.25rem auto' }}>
              Upload a routine image using the box above so students of {selectedClass} can see their weekly routine.
            </p>
            <button
              onClick={handleLoadSampleRoutine}
              className="btn-primary"
              style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={16} />
              <span>Load Sample Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={`${selectedClass} - Timetable Photo`}
      >
        <div style={{ textAlign: 'center', maxHeight: '75vh', overflowY: 'auto' }}>
          <img
            src={activeImage || photoPreview}
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
