import { jsPDF } from 'jspdf';
import { triggerPdfDownload, triggerPdfPrint } from './pdfDownloadHelper';

/**
 * Generates an official Student Attendance Summary & Detailed Record PDF
 */
export function createStudentAttendancePdfDoc(student, classLogs, sessionStats, studentClass = 'Class 10-A') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentName = student?.name || 'Student User';
  const studentId = student?.studentId || student?.id || 'STU-2026-0001';
  const rollNo = student?.rollNo || '01';
  const parentName = student?.parentName || 'Guardian';
  const attendanceRate = sessionStats?.rate || student?.attendancePercent || '95.0';
  const totalDays = sessionStats?.totalDays || 180;
  const presentDays = sessionStats?.presentDays || 171;
  const absentDays = sessionStats?.absentDays || 6;
  const lateDays = sessionStats?.lateDays || 3;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4);

  // Inner Border
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, 3, 3);

  // Top Header Banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, margin, contentWidth, 26, 4, 4, 'F');
  doc.rect(margin, margin + 18, contentWidth, 8, 'F');

  // School Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EDUSPHERE INTERNATIONAL ACADEMY', pageWidth / 2, margin + 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('CBSE Affiliated Senior Secondary School • Affiliation No: 2130894', pageWidth / 2, margin + 14, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('Institutional Area, Sector 62 • Attendance Verification Cell • Academic Session 2026-2027', pageWidth / 2, margin + 19, { align: 'center' });

  // Certificate Title Bar
  let y = margin + 31;
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 9.5, 2, 2, 'FD');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('OFFICIAL ATTENDANCE CERTIFICATE & PERFORMANCE LEDGER', pageWidth / 2, y + 6.2, { align: 'center' });

  // Student Profile Box
  y += 14;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 30, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ENROLLED STUDENT PROFILE', margin + 8, y + 5.5);

  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 8, y + 7.5, pageWidth - margin - 8, y + 7.5);

  const col1 = margin + 8;
  const col2 = pageWidth / 2 + 4;
  let infoY = y + 14;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Student Name:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(studentName, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Student ID / Adm:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(studentId, col2 + 28, infoY);

  infoY += 6.5;
  doc.setTextColor(107, 114, 128);
  doc.text('Class & Section:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(studentClass, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Roll Number:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(`#${rollNo}`, col2 + 28, infoY);

  infoY += 6.5;
  doc.setTextColor(107, 114, 128);
  doc.text('Father / Guardian:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(parentName, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Session Period:', col2, infoY);
  doc.setTextColor(79, 70, 229);
  doc.text('1 Apr 2026 – 31 Mar 2027', col2 + 28, infoY);

  // 4 KPI Summary Cards
  y += 34;
  const cardW = (contentWidth - 8 - 9) / 4;

  // 1. Attendance Rate
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + 4, y, cardW, 18, 2, 2, 'FD');
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('ATTENDANCE RATE', margin + 4 + cardW / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(13);
  doc.text(`${attendanceRate}%`, margin + 4 + cardW / 2, y + 13.5, { align: 'center' });

  // 2. Present Days
  const c2X = margin + 4 + cardW + 3;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(c2X, y, cardW, 18, 2, 2, 'FD');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(6.8);
  doc.text('PRESENT DAYS', c2X + cardW / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(13);
  doc.text(`${presentDays}`, c2X + cardW / 2, y + 13.5, { align: 'center' });

  // 3. Late Days
  const c3X = c2X + cardW + 3;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(c3X, y, cardW, 18, 2, 2, 'FD');
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(6.8);
  doc.text('LATE ARRIVALS', c3X + cardW / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(13);
  doc.text(`${lateDays}`, c3X + cardW / 2, y + 13.5, { align: 'center' });

  // 4. Absent Days
  const c4X = c3X + cardW + 3;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(c4X, y, cardW, 18, 2, 2, 'FD');
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(6.8);
  doc.text('ABSENT DAYS', c4X + cardW / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(13);
  doc.text(`${absentDays}`, c4X + cardW / 2, y + 13.5, { align: 'center' });

  // Recent 20 Attendance Logs Table
  y += 24;
  const tableY = y;
  const tableHeaderH = 7.5;
  const rowHeight = 6.2;
  const dates = Object.keys(classLogs || {}).sort().reverse().slice(0, 18);

  // Table Header
  doc.setFillColor(79, 70, 229);
  doc.rect(margin + 4, tableY, contentWidth - 8, tableHeaderH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Date', margin + 8, tableY + 5);
  doc.text('Day of Week', margin + 38, tableY + 5);
  doc.text('Session Timing', margin + 82, tableY + 5);
  doc.text('Status', margin + 125, tableY + 5);
  doc.text('Verification Note', pageWidth - margin - 8, tableY + 5, { align: 'right' });

  // Table Container
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin + 4, tableY + tableHeaderH, contentWidth - 8, (dates.length * rowHeight));

  let curY = tableY + tableHeaderH;
  dates.forEach((d, idx) => {
    const st = classLogs[d]?.[student?.id] || 'Present';
    const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'long' });

    if (idx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin + 4, curY, contentWidth - 8, rowHeight, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(31, 41, 55);
    doc.text(d, margin + 8, curY + 4.5);

    doc.setTextColor(107, 114, 128);
    doc.text(dayName, margin + 38, curY + 4.5);
    doc.text('08:00 AM – 02:30 PM', margin + 82, curY + 4.5);

    if (st === 'Present') {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ PRESENT', margin + 125, curY + 4.5);
    } else if (st === 'Late') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
      doc.text('⏰ LATE', margin + 125, curY + 4.5);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.setFont('helvetica', 'bold');
      doc.text('✗ ABSENT', margin + 125, curY + 4.5);
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(7);
    doc.text(st === 'Present' ? 'Biometric / Teacher Check-in' : st === 'Late' ? 'Late arrival noted' : 'Leave without application', pageWidth - margin - 8, curY + 4.5, { align: 'right' });

    // Divider line
    doc.setDrawColor(243, 244, 246);
    doc.line(margin + 4, curY + rowHeight, pageWidth - margin - 4, curY + rowHeight);

    curY += rowHeight;
  });

  // Criteria & Seal Box
  y = curY + 8;
  const isEligible = Number(attendanceRate) >= 75;

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, (contentWidth - 12) * 0.6, 26, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('BOARD EXAM ELIGIBILITY DECLARATION (CBSE 75% RULE):', margin + 8, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(55, 65, 81);
  doc.text(`This is to certify that ${studentName} holds an aggregate attendance of ${attendanceRate}%.`, margin + 8, y + 10);
  doc.setTextColor(isEligible ? 16 : 220, isEligible ? 185 : 38, isEligible ? 129 : 38);
  doc.setFont('helvetica', 'bold');
  doc.text(isEligible ? 'STATUS: ELIGIBLE FOR SEMESTER & CBSE BOARD EXAMINATIONS.' : 'STATUS: BELOW MANDATORY THRESHOLD (REQUIRES REGULARIZATION).', margin + 8, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Issued by EduSphere Academic Council under Section 14 of School Education Code.', margin + 8, y + 21);

  // Right Seal Box
  const sealBoxX = margin + 4 + (contentWidth - 12) * 0.6 + 4;
  const sealBoxW = (contentWidth - 12) * 0.4;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(sealBoxX, y, sealBoxW, 26, 2, 2, 'FD');

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.circle(sealBoxX + sealBoxW / 2, y + 10, 6.5, 'D');

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.text('ATTENDANCE VERIFIED', sealBoxX + sealBoxW / 2, y + 9.5, { align: 'center' });
  doc.setFontSize(4.5);
  doc.text('ACADEMIC WING', sealBoxX + sealBoxW / 2, y + 12, { align: 'center' });

  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('Principal / Dean of Academics', sealBoxX + sealBoxW / 2, y + 22, { align: 'center' });

  // Bottom Footer
  const footerY = pageHeight - margin - 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 4, footerY - 2, pageWidth - margin - 4, footerY - 2);

  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('EduSphere 360™ Attendance Information System • Digital Verification Document', margin + 6, footerY + 2);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Page 1 of 1`, pageWidth - margin - 6, footerY + 2, { align: 'right' });

  return doc;
}

/**
 * Downloads student attendance PDF
 */
export async function downloadStudentAttendancePdf(student, classLogs, sessionStats, studentClass) {
  try {
    const doc = createStudentAttendancePdfDoc(student, classLogs, sessionStats, studentClass);
    const cleanName = (student?.name || 'Student').replace(/\s+/g, '_');
    const fileName = `Attendance_Certificate_${cleanName}_Session_2026_27.pdf`;
    return await triggerPdfDownload(doc, fileName, `Attendance Certificate - ${student?.name}`);
  } catch (err) {
    console.error('Failed to download student attendance PDF:', err);
    return { success: false, error: err };
  }
}

/**
 * Generates an official Daily / Monthly Class Attendance Sheet PDF (For Teacher / Admin)
 */
export function createClassAttendancePdfDoc(className, selectedDate, classStudents, statusMap) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, margin, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('EDUSPHERE INTERNATIONAL ACADEMY', pageWidth / 2, margin + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Daily Classroom Attendance Register • ${className} • Date: ${selectedDate}`, pageWidth / 2, margin + 13.5, { align: 'center' });
  doc.setFontSize(7);
  doc.text('Affiliated with CBSE New Delhi • Institutional Management Division', pageWidth / 2, margin + 18, { align: 'center' });

  // Stats Box
  let y = margin + 28;
  const total = classStudents.length;
  let present = 0;
  let late = 0;
  let absent = 0;

  classStudents.forEach(s => {
    const st = statusMap[s.id] || 'Present';
    if (st === 'Present') present++;
    else if (st === 'Late') late++;
    else if (st === 'Absent') absent++;
  });

  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Total Enrolled: ${total}`, margin + 6, y + 7.5);
  doc.setTextColor(16, 185, 129);
  doc.text(`Present: ${present}`, margin + 50, y + 7.5);
  doc.setTextColor(217, 119, 6);
  doc.text(`Late: ${late}`, margin + 95, y + 7.5);
  doc.setTextColor(220, 38, 38);
  doc.text(`Absent: ${absent}`, margin + 135, y + 7.5);

  // Table
  y += 16;
  const tableH = 7.5;
  const rowH = 6.5;

  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y, contentWidth, tableH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Roll', margin + 4, y + 5);
  doc.text('Student Name', margin + 20, y + 5);
  doc.text('Admission #', margin + 70, y + 5);
  doc.text('Parent Contact', margin + 105, y + 5);
  doc.text('Daily Status', pageWidth - margin - 6, y + 5, { align: 'right' });

  let curY = y + tableH;
  classStudents.forEach((stu, idx) => {
    const st = statusMap[stu.id] || 'Present';
    if (idx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, curY, contentWidth, rowH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(31, 41, 55);
    doc.text(`#${stu.rollNo}`, margin + 4, curY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.text(stu.name, margin + 20, curY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(stu.admissionNo || stu.studentId || 'ADM', margin + 70, curY + 4.5);
    doc.text(stu.phone || stu.parentContact || 'On record', margin + 105, curY + 4.5);

    if (st === 'Present') {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('PRESENT', pageWidth - margin - 6, curY + 4.5, { align: 'right' });
    } else if (st === 'Late') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
      doc.text('LATE', pageWidth - margin - 6, curY + 4.5, { align: 'right' });
    } else {
      doc.setTextColor(220, 38, 38);
      doc.setFont('helvetica', 'bold');
      doc.text('ABSENT', pageWidth - margin - 6, curY + 4.5, { align: 'right' });
    }

    doc.setDrawColor(243, 244, 246);
    doc.line(margin, curY + rowH, pageWidth - margin, curY + rowH);
    curY += rowH;
  });

  return doc;
}

/**
 * Downloads Class Attendance Register PDF
 */
export async function downloadClassAttendancePdf(className, selectedDate, classStudents, statusMap) {
  try {
    const doc = createClassAttendancePdfDoc(className, selectedDate, classStudents, statusMap);
    const fileName = `${className.replace(/\s+/g, '_')}_Attendance_${selectedDate}.pdf`;
    return await triggerPdfDownload(doc, fileName, `${className} Attendance Register (${selectedDate})`);
  } catch (err) {
    console.error('Failed to download class attendance PDF:', err);
    return { success: false, error: err };
  }
}
