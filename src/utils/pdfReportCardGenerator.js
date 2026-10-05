import { jsPDF } from 'jspdf';

/**
 * Creates an official, beautifully formatted jsPDF document for Student Academic Report Card
 */
export function createReportCardPdfDoc(report) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentName = report.studentName || report.name || 'Student User';
  const studentClass = report.class || 'Class 10-A';
  const rollNo = report.rollNo || '01';
  const examTitle = (report.examTitle || 'Term 1 Half-Yearly Examinations 2026').toUpperCase();
  const academicYear = '2026 - 2027';
  const totalMarks = report.totalMarks || 0;
  const maxTotal = report.maxTotal || 500;
  const percentage = report.percentage || (maxTotal > 0 ? ((totalMarks / maxTotal) * 100).toFixed(1) : 0);
  const grade = report.grade || 'A+';
  const remarks = report.remarks || 'Outstanding academic consistency and commendable performance.';
  const subjects = report.subjects && report.subjects.length > 0 ? report.subjects : [
    { name: 'Mathematics', marks: 96, maxMarks: 100, grade: 'A+', remarks: 'Outstanding' },
    { name: 'Physics', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Excellent lab skills' },
    { name: 'Chemistry', marks: 89, maxMarks: 100, grade: 'A', remarks: 'Good conceptual clarity' },
    { name: 'English', marks: 93, maxMarks: 100, grade: 'A+', remarks: 'Commendable creative writing' },
    { name: 'Computer Science', marks: 98, maxMarks: 100, grade: 'A+', remarks: 'Exceptional coding logic' },
  ];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border
  doc.setDrawColor(79, 70, 229); // Indigo
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4);

  // Inner subtle accent border
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, 3, 3);

  // Top School Header Banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, margin, contentWidth, 26, 4, 4, 'F');
  doc.rect(margin, margin + 18, contentWidth, 8, 'F'); // square off bottom corners

  // School Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EDUSPHERE INTERNATIONAL ACADEMY', pageWidth / 2, margin + 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('CBSE Affiliated Senior Secondary School • Affiliation No: 2130894', pageWidth / 2, margin + 14, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('Knowledge Park III, Institutional Area • Helpline: +91 98765 43210 • Email: academic@edusphere.edu', pageWidth / 2, margin + 19, { align: 'center' });

  // Marksheet Title Bar
  let y = margin + 31;
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 9.5, 2, 2, 'FD');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(`OFFICIAL ACADEMIC REPORT CARD • ${examTitle}`, pageWidth / 2, y + 6.2, { align: 'center' });

  // Student Profile Information Box
  y += 14;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 30, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('STUDENT PROFILE & ACADEMIC RECORD', margin + 8, y + 5.5);

  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 8, y + 7.5, pageWidth - margin - 8, y + 7.5);

  // 2 Columns Info
  const col1 = margin + 8;
  const col2 = pageWidth / 2 + 4;
  let infoY = y + 14;

  // Row 1
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Student Name:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.text('Roll Number:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(`#${rollNo}`, col2 + 24, infoY);

  // Row 2
  infoY += 6.5;
  doc.setTextColor(107, 114, 128);
  doc.text('Class & Section:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(studentClass, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Academic Session:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(academicYear, col2 + 28, infoY);

  // Row 3
  infoY += 6.5;
  doc.setTextColor(107, 114, 128);
  doc.text('Examination:', col1, infoY);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(report.examTitle || 'Term 1 Half-Yearly Examinations 2026', col1 + 22, infoY);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.text('Result Status:', col2, infoY);
  doc.setTextColor(16, 185, 129); // Green
  doc.setFont('helvetica', 'bold');
  doc.text(Number(percentage) >= 33 ? 'QUALIFIED / PASSED' : 'NEEDS IMPROVEMENT', col2 + 24, infoY);

  // KPI Score Summary Cards (3 Boxes)
  y += 34;
  const kpiBoxWidth = (contentWidth - 8 - 8) / 3;
  
  // Total Score Box
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, kpiBoxWidth, 18, 2, 2, 'FD');
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TOTAL MARKS SCORED', margin + 4 + kpiBoxWidth / 2, y + 5.5, { align: 'center' });
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(12);
  doc.text(`${totalMarks} / ${maxTotal}`, margin + 4 + kpiBoxWidth / 2, y + 13.5, { align: 'center' });

  // Percentage Box
  const kpiBox2X = margin + 4 + kpiBoxWidth + 4;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(kpiBox2X, y, kpiBoxWidth, 18, 2, 2, 'FD');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(7);
  doc.text('AGGREGATE PERCENTAGE', kpiBox2X + kpiBoxWidth / 2, y + 5.5, { align: 'center' });
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(13);
  doc.text(`${percentage}%`, kpiBox2X + kpiBoxWidth / 2, y + 13.5, { align: 'center' });

  // Grade Box
  const kpiBox3X = kpiBox2X + kpiBoxWidth + 4;
  doc.setFillColor(238, 242, 255); // Indigo tint
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(kpiBox3X, y, kpiBoxWidth, 18, 2, 2, 'FD');
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(7);
  doc.text('FINAL LETTER GRADE', kpiBox3X + kpiBoxWidth / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(13);
  doc.text(grade, kpiBox3X + kpiBoxWidth / 2, y + 13.5, { align: 'center' });

  // Subject Performance Breakdown Table
  y += 23;
  const tableY = y;
  const rowHeight = 7.5;
  const tableHeaderH = 7.5;
  const totalTableH = tableHeaderH + (subjects.length * rowHeight) + 8.5;

  // Table Header
  doc.setFillColor(79, 70, 229);
  doc.rect(margin + 4, tableY, contentWidth - 8, tableHeaderH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('S.No.', margin + 8, tableY + 5);
  doc.text('Subject Name', margin + 22, tableY + 5);
  doc.text('Max Marks', margin + 85, tableY + 5);
  doc.text('Marks Scored', margin + 115, tableY + 5);
  doc.text('Grade', margin + 145, tableY + 5);
  doc.text('Performance Feedback', pageWidth - margin - 8, tableY + 5, { align: 'right' });

  // Table Border Container
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin + 4, tableY + tableHeaderH, contentWidth - 8, (subjects.length * rowHeight) + 8.5);

  let currentSubY = tableY + tableHeaderH;

  subjects.forEach((sub, idx) => {
    // Alternating row background
    if (idx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin + 4, currentSubY, contentWidth - 8, rowHeight, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    doc.text(String(idx + 1), margin + 9, currentSubY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(sub.name || `Subject ${idx + 1}`, margin + 22, currentSubY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(String(sub.maxMarks || 100), margin + 92, currentSubY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(String(sub.marks || 0), margin + 122, currentSubY + 5);

    doc.setTextColor(sub.grade === 'A+' || sub.grade === 'A' ? 16 : 217, sub.grade === 'A+' || sub.grade === 'A' ? 185 : 119, sub.grade === 'A+' || sub.grade === 'A' ? 129 : 6);
    doc.text(sub.grade || 'A', margin + 148, currentSubY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7.5);
    doc.text(sub.remarks || 'Satisfactory', pageWidth - margin - 8, currentSubY + 5, { align: 'right' });

    // Row divider line
    doc.setDrawColor(243, 244, 246);
    doc.line(margin + 4, currentSubY + rowHeight, pageWidth - margin - 4, currentSubY + rowHeight);

    currentSubY += rowHeight;
  });

  // Table Grand Total Row
  doc.setFillColor(243, 244, 246);
  doc.rect(margin + 4, currentSubY, contentWidth - 8, 8.5, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.line(margin + 4, currentSubY, pageWidth - margin - 4, currentSubY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(31, 41, 55);
  doc.text('GRAND TOTAL & PERCENTAGE:', margin + 22, currentSubY + 5.5);

  doc.setTextColor(107, 114, 128);
  doc.text(String(maxTotal), margin + 92, currentSubY + 5.5);

  doc.setTextColor(79, 70, 229);
  doc.text(`${totalMarks}`, margin + 122, currentSubY + 5.5);

  doc.setTextColor(16, 185, 129);
  doc.text(`${percentage}% (${grade})`, pageWidth - margin - 8, currentSubY + 5.5, { align: 'right' });

  // Class Faculty Remarks Box
  y = currentSubY + 12;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 16, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CLASS FACULTY REMARKS & EVALUATION NOTE:', margin + 8, y + 5);

  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(`"${remarks}"`, margin + 8, y + 11);

  // Grading Scale Reference & Signatures Area
  y += 20;

  // Left Grading Reference
  const leftRefW = (contentWidth - 12) * 0.55;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, leftRefW, 28, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CBSE / INSTITUTIONAL GRADING SCALE:', margin + 7, y + 5);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('• A+ (90-100%): Outstanding Mastery', margin + 7, y + 10);
  doc.text('• A (80-89%): Excellent Understanding', margin + 7, y + 14);
  doc.text('• B+ (70-79%): Very Good Performance', margin + 7, y + 18);
  doc.text('• B (60-69%): Good / Above Average', margin + 7, y + 22);
  doc.text('• C (50-59%): Satisfactory / Passing', margin + 7, y + 26);

  // Right Signatures & Seal Area
  const sigBoxX = margin + 4 + leftRefW + 4;
  const sigBoxW = (contentWidth - 12) * 0.45;

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(sigBoxX, y, sigBoxW, 28, 2, 2, 'FD');

  // Official Stamp Circle
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.circle(sigBoxX + sigBoxW / 2, y + 11, 7.5, 'D');

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.text('OFFICIALLY VERIFIED', sigBoxX + sigBoxW / 2, y + 10, { align: 'center' });
  doc.setFontSize(4.8);
  doc.text('EXAM CONTROLLER', sigBoxX + sigBoxW / 2, y + 13, { align: 'center' });

  // Signature labels
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('Class Teacher', sigBoxX + 12, y + 25, { align: 'center' });
  doc.text('Principal / Seal', sigBoxX + sigBoxW - 14, y + 25, { align: 'center' });

  // Footer line
  const footerY = pageHeight - margin - 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 4, footerY - 2, pageWidth - margin - 4, footerY - 2);

  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('EduSphere 360™ Academic Information System • Official Digital Marksheet Verification', margin + 6, footerY + 2);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Page 1 of 1`, pageWidth - margin - 6, footerY + 2, { align: 'right' });

  return doc;
}

/**
 * Downloads the Report Card as a PDF document
 */
export function downloadReportCardPdf(report) {
  try {
    const doc = createReportCardPdfDoc(report);
    const cleanStudentName = (report.studentName || report.name || 'Student').replace(/\s+/g, '_');
    const cleanExam = (report.examTitle || 'Report_Card').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${cleanStudentName}_${cleanExam}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to download report card PDF:', err);
    return false;
  }
}

/**
 * Prints the Report Card PDF
 */
export function printReportCardPdf(report) {
  try {
    const doc = createReportCardPdfDoc(report);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch {
          window.open(blobUrl, '_blank');
        }
      }, 300);
    };
    return true;
  } catch (err) {
    console.error('Failed to print PDF:', err);
    window.print();
    return false;
  }
}
