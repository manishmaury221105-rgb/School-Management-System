import React, { useState, useRef } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
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

// High-quality SVG vector template for 1-click sample routine demo
const SAMPLE_ROUTINE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650" style="background:%23f8fafc;font-family:system-ui,sans-serif;">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%234f46e5"/>
      <stop offset="100%" stop-color="%230ea5e9"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1000" height="90" fill="url(%23g1)"/>
  <text x="30" y="42" fill="white" font-size="22" font-weight="bold">ST. XAVIER INTERNATIONAL ACADEMY</text>
  <text x="30" y="70" fill="%23e0e7ff" font-size="14">ACADEMIC SESSION 2026-2027 • OFFICIAL CLASS TIMETABLE ROUTINE</text>
  <rect x="820" y="25" width="150" height="40" rx="8" fill="white" fill-opacity="0.2"/>
  <text x="895" y="50" fill="white" font-size="15" font-weight="bold" text-anchor="middle">CLASS 10-A</text>
  
  <!-- Table Header -->
  <rect x="30" y="115" width="940" height="45" fill="%231e293b" rx="8"/>
  <text x="80" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">DAY / PERIOD</text>
  <text x="210" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P1 (08:30 - 09:15)</text>
  <text x="350" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P2 (09:15 - 10:00)</text>
  <text x="490" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P3 (10:15 - 11:00)</text>
  <text x="630" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P4 (11:00 - 11:45)</text>
  <text x="770" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P5 (12:30 - 01:15)</text>
  <text x="900" y="143" fill="white" font-size="13" font-weight="bold" text-anchor="middle">P6 (01:15 - 02:00)</text>

  <!-- Monday -->
  <rect x="30" y="170" width="940" height="65" fill="white" rx="6" stroke="%23e2e8f0"/>
  <rect x="30" y="170" width="100" height="65" fill="%23e0e7ff" rx="6"/>
  <text x="80" y="208" fill="%233730a3" font-size="13" font-weight="bold" text-anchor="middle">MONDAY</text>
  <text x="210" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Mathematics</text>
  <text x="210" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sarah (R-304)</text>
  <text x="350" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Physics Lab</text>
  <text x="350" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Rajesh (Lab 1)</text>
  <text x="490" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">English Lit</text>
  <text x="490" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Ms. Emily (R-304)</text>
  <text x="630" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Chemistry</text>
  <text x="630" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Dr. Priya (Lab 2)</text>
  <text x="770" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Computer AI</text>
  <text x="770" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Vikram (Lab A)</text>
  <text x="900" y="200" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Physical Ed</text>
  <text x="900" y="218" fill="%2364748b" font-size="11" text-anchor="middle">Coach David (Ground)</text>

  <!-- Tuesday -->
  <rect x="30" y="245" width="940" height="65" fill="white" rx="6" stroke="%23e2e8f0"/>
  <rect x="30" y="245" width="100" height="65" fill="%23dbeafe" rx="6"/>
  <text x="80" y="283" fill="%231e40af" font-size="13" font-weight="bold" text-anchor="middle">TUESDAY</text>
  <text x="210" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Biology Theory</text>
  <text x="210" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Dr. Meera (R-304)</text>
  <text x="350" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Mathematics</text>
  <text x="350" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sarah (R-304)</text>
  <text x="490" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Social Studies</text>
  <text x="490" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Amit (R-304)</text>
  <text x="630" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Hindi / Lang</text>
  <text x="630" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sunita (R-304)</text>
  <text x="770" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Physics</text>
  <text x="770" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Rajesh (R-304)</text>
  <text x="900" y="275" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Library / Self</text>
  <text x="900" y="293" fill="%2364748b" font-size="11" text-anchor="middle">Central Library</text>

  <!-- Wednesday -->
  <rect x="30" y="320" width="940" height="65" fill="white" rx="6" stroke="%23e2e8f0"/>
  <rect x="30" y="320" width="100" height="65" fill="%23e0e7ff" rx="6"/>
  <text x="80" y="358" fill="%233730a3" font-size="13" font-weight="bold" text-anchor="middle">WEDNESDAY</text>
  <text x="210" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Chemistry Lab</text>
  <text x="210" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Dr. Priya (Lab 2)</text>
  <text x="350" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">English Grammar</text>
  <text x="350" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Ms. Emily (R-304)</text>
  <text x="490" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Mathematics</text>
  <text x="490" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sarah (R-304)</text>
  <text x="630" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Computer Coding</text>
  <text x="630" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Vikram (Lab A)</text>
  <text x="770" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Economics</text>
  <text x="770" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Amit (R-304)</text>
  <text x="900" y="350" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Art & Craft</text>
  <text x="900" y="368" fill="%2364748b" font-size="11" text-anchor="middle">Studio Room</text>

  <!-- Thursday -->
  <rect x="30" y="395" width="940" height="65" fill="white" rx="6" stroke="%23e2e8f0"/>
  <rect x="30" y="395" width="100" height="65" fill="%23dbeafe" rx="6"/>
  <text x="80" y="433" fill="%231e40af" font-size="13" font-weight="bold" text-anchor="middle">THURSDAY</text>
  <text x="210" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Mathematics</text>
  <text x="210" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sarah (R-304)</text>
  <text x="350" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Physics Theory</text>
  <text x="350" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Rajesh (R-304)</text>
  <text x="490" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Biology Lab</text>
  <text x="490" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Dr. Meera (Lab 3)</text>
  <text x="630" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">History / Civics</text>
  <text x="630" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Amit (R-304)</text>
  <text x="770" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">English Speech</text>
  <text x="770" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Ms. Emily (R-304)</text>
  <text x="900" y="425" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Sports / Games</text>
  <text x="900" y="443" fill="%2364748b" font-size="11" text-anchor="middle">Playground</text>

  <!-- Friday -->
  <rect x="30" y="470" width="940" height="65" fill="white" rx="6" stroke="%23e2e8f0"/>
  <rect x="30" y="470" width="100" height="65" fill="%23e0e7ff" rx="6"/>
  <text x="80" y="508" fill="%233730a3" font-size="13" font-weight="bold" text-anchor="middle">FRIDAY</text>
  <text x="210" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">AI Project Work</text>
  <text x="210" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Vikram (Lab A)</text>
  <text x="350" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Chemistry</text>
  <text x="350" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Dr. Priya (R-304)</text>
  <text x="490" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Mathematics</text>
  <text x="490" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Mrs. Sarah (R-304)</text>
  <text x="630" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Geography</text>
  <text x="630" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Mr. Amit (R-304)</text>
  <text x="770" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Club Activities</text>
  <text x="770" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Activity Hall</text>
  <text x="900" y="500" fill="%231e293b" font-size="13" font-weight="bold" text-anchor="middle">Weekly Assembly</text>
  <text x="900" y="518" fill="%2364748b" font-size="11" text-anchor="middle">Main Auditorium</text>

  <!-- Footer Notice -->
  <rect x="30" y="555" width="940" height="45" fill="%23f1f5f9" rx="6"/>
  <text x="50" y="583" fill="%23475569" font-size="12" font-weight="600">📌 NOTE: Recess / Lunch Break is scheduled daily between 11:45 AM and 12:30 PM. Lab uniforms mandatory on Practical days.</text>
  <text x="950" y="583" fill="%236366f1" font-size="12" font-weight="bold" text-anchor="end">Signed: Academic Controller</text>
</svg>`;

export const TimetableManager = () => {
  const { timetable, classes, uploadTimetablePhoto, deleteTimetablePhoto } = useSchoolData();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole === ROLES.ADMIN;

  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(false);
  const fileInputRef = useRef(null);

  // Retrieve current active timetable photo for the selected class
  const classTimetableData = timetable?.[selectedClass];
  const activeImage = typeof classTimetableData === 'object' ? classTimetableData.photo : null;
  const activeTitle = (typeof classTimetableData === 'object' && classTimetableData.title) || `${selectedClass} Official Routine`;
  const activeUploadedBy = (typeof classTimetableData === 'object' && classTimetableData.uploadedBy) || 'Class Faculty';
  const activeUploadedDate = (typeof classTimetableData === 'object' && classTimetableData.updatedAt)
    ? new Date(classTimetableData.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently Updated';

  // Handle Photo File Upload
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
    const imageToSave = photoPreview || SAMPLE_ROUTINE_SVG;
    if (!imageToSave) return;

    uploadTimetablePhoto(selectedClass, {
      photo: imageToSave,
      title: titleInput.trim() || `${selectedClass} Weekly Timetable & Routine`,
      notes: notesInput.trim(),
      uploadedBy: currentUser?.name || (isAdmin ? 'School Administrator' : 'Class Teacher'),
    });

    setPhotoPreview(null);
    setTitleInput('');
    setNotesInput('');
    setUploadSuccessMsg(true);
    setTimeout(() => setUploadSuccessMsg(false), 4000);
  };

  const handleLoadSampleRoutine = () => {
    setPhotoPreview(SAMPLE_ROUTINE_SVG);
    setTitleInput(`${selectedClass} Complete Weekly Routine 2026-27`);
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
    link.download = `${selectedClass.replace(/\s+/g, '_')}_Timetable_Routine.png`;
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
        <html>
          <head>
            <title>${selectedClass} Timetable Routine</title>
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
            <span>Class Timetable & Routine</span>
          </h1>
          <p className="page-subtitle">
            Upload class timetable photos/images. Students & parents can view, zoom, and download below.
          </p>
        </div>

        {/* Class Selector Dropdown */}
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
            {classes.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Success Alert */}
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
          <span>Timetable photo for {selectedClass} successfully saved and published below!</span>
        </div>
      )}

      {/* TOP SECTION: Photo Upload Box */}
      <div className="card-elevated" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--primary)" />
              <span>Upload Timetable Photo ({selectedClass})</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload a clear photo or screenshot of the weekly period schedule from camera or gallery.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleRoutine}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Load ready-made sample timetable routine template"
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Load Sample Routine</span>
          </button>
        </div>

        <form onSubmit={handleSavePhoto}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Upload Dropzone / File Picker */}
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

            {/* Title & Notes Inputs */}
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
                  Special Notes / Instructions for Students (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Lab periods require laboratory coats. Recess time is 11:45 AM - 12:30 PM."
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
                  <span>Save & Publish Timetable</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* LOWER SECTION: Display Uploaded Timetable Photo (Jo niche show ho) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileImage size={22} color="var(--primary)" />
              <span>Current Timetable Photo ({selectedClass})</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Active weekly routine visible to all enrolled students and parents of {selectedClass}.
            </p>
          </div>

          {activeImage && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsZoomOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                title="Open Fullscreen Zoom View"
              >
                <Maximize2 size={15} />
                <span>Zoom View</span>
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                title="Download Timetable Image"
              >
                <Download size={15} />
                <span>Download</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                title="Print Timetable"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDeleteCurrentPhoto}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px', color: '#ef4444', borderColor: '#fca5a5' }}
                title="Delete this timetable photo"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Timetable Photo Card */}
        {activeImage ? (
          <div className="card-elevated" style={{ padding: '1.25rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
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
                ● LIVE & ACTIVE
              </div>
            </div>

            {/* Clickable Image Container with Hover Zoom Overlay */}
            <div
              onClick={() => setIsZoomOpen(true)}
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.5rem',
              }}
              title="Click to zoom / view fullscreen"
            >
              <img
                src={activeImage}
                alt={`${selectedClass} Timetable`}
                style={{
                  width: '100%',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>
          </div>
        ) : (
          /* Empty State if no photo uploaded yet */
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
              Upload a routine image or photo using the upload box above so students and faculty can view the weekly schedule.
            </p>
            <button
              onClick={handleLoadSampleRoutine}
              className="btn-primary"
              style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={16} />
              <span>Load Sample Timetable Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen / Zoom View Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={`${selectedClass} - Timetable Photo (High Resolution)`}
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
              <span>Print Routine</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
