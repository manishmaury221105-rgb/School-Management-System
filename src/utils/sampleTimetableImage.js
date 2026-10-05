// Generates a clean, crisp sample timetable image as a PNG data URL using Canvas
export const getSampleTimetablePNG = (className = 'Class 10-A') => {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 750);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 100);
    grad.addColorStop(0, '#312e81');
    grad.addColorStop(0.6, '#4338ca');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 100);

    // Title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText('EDUSPHERE 360 - ACADEMIC SESSION 2026-2027', 40, 44);

    ctx.fillStyle = '#e0e7ff';
    ctx.font = '600 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('OFFICIAL CLASS TIMETABLE & WEEKLY SUBJECT ROUTINE', 40, 74);

    // Class Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.roundRect(980, 25, 180, 50, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(className.toUpperCase(), 1070, 57);
    ctx.textAlign = 'left';

    // Table Column Headers
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(40, 125, 1120, 50, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DAY', 100, 155);
    ctx.fillText('P1 (08:30 - 09:15)', 230, 155);
    ctx.fillText('P2 (09:15 - 10:00)', 390, 155);
    ctx.fillText('P3 (10:15 - 11:00)', 550, 155);
    ctx.fillText('P4 (11:00 - 11:45)', 710, 155);
    ctx.fillText('P5 (12:30 - 01:15)', 870, 155);
    ctx.fillText('P6 (01:15 - 02:00)', 1030, 155);

    // Days & Rows
    const days = [
      { name: 'MONDAY', bg: '#e0e7ff', color: '#3730a3', periods: ['Mathematics', 'Physics Lab', 'English Lit', 'Chemistry', 'Computer AI', 'Sports / PE'] },
      { name: 'TUESDAY', bg: '#dbeafe', color: '#1e40af', periods: ['Biology Theory', 'Mathematics', 'Social Studies', 'Hindi / Lang', 'Physics', 'Library'] },
      { name: 'WEDNESDAY', bg: '#d1fae5', color: '#065f46', periods: ['Chemistry Lab', 'English Grammar', 'Mathematics', 'Computer AI', 'Economics', 'Art & Craft'] },
      { name: 'THURSDAY', bg: '#fef3c7', color: '#92400e', periods: ['Mathematics', 'Physics Theory', 'Biology Lab', 'History / Civics', 'English Lit', 'Playground'] },
      { name: 'FRIDAY', bg: '#f3e8ff', color: '#6b21a8', periods: ['AI Project', 'Chemistry', 'Mathematics', 'Geography', 'Club Activity', 'Assembly'] },
      { name: 'SATURDAY', bg: '#ffe4e6', color: '#9f1239', periods: ['Maths Revision', 'Science Seminar', 'Speech / Debate', 'Social Studies', 'Sports & Yoga', 'Clubs'] },
    ];

    let y = 188;
    days.forEach((day) => {
      // Row box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(40, y, 1120, 68, 8);
      ctx.fill();
      ctx.stroke();

      // Day badge
      ctx.fillStyle = day.bg;
      ctx.beginPath();
      ctx.roundRect(40, y, 120, 68, [8, 0, 0, 8]);
      ctx.fill();

      ctx.fillStyle = day.color;
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day.name, 100, y + 40);

      // Period text
      const xPositions = [230, 390, 550, 710, 870, 1030];
      day.periods.forEach((subject, idx) => {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(subject, xPositions[idx], y + 32);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px system-ui, sans-serif';
        ctx.fillText('Room 304', xPositions[idx], y + 50);
      });

      y += 76;
    });

    // Footer notice
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(40, y + 8, 1120, 48, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📌 NOTE: Daily Recess / Lunch Break: 11:45 AM - 12:30 PM. Lab uniforms mandatory on Practical days.', 55, y + 38);

    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Academic Director Signed ✍️', 1130, y + 38);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Canvas error:', err);
    return '';
  }
};
