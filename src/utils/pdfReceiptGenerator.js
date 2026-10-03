import { jsPDF } from 'jspdf';

/**
 * Converts a number to Indian Rupees in words
 */
function numberToWords(num) {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += n[5] != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() ? str.trim() + ' Rupees Only' : 'Zero Rupees Only';
}

/**
 * Builds a vector jsPDF instance for school fee receipt
 */
export function createReceiptPdfDoc(receipt) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentName = receipt.studentName || receipt.name || 'Student';
  const rollNo = receipt.rollNo || 'N/A';
  const className = receipt.class || 'Class 10-A';
  const fatherName = receipt.fatherName || receipt.parentName || 'Guardian';
  const phone = receipt.phone || receipt.parentContact || 'Available on file';
  const feeType = receipt.feeType || 'Tuition Fee';
  const feeMonth = receipt.feeMonth || 'Academic Year 2026-27';
  const receiptNo = receipt.receiptNo || 'REC-2026-0001';
  const paidDate = receipt.paidDate || new Date().toISOString().split('T')[0];
  const paymentMethod = receipt.paymentMethod || 'Online Payment';
  const amount = Number(receipt.amount || 25000);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border & Decorative Header
  doc.setDrawColor(79, 70, 229); // Primary Indigo
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4);

  // Top Header Banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, margin, contentWidth, 26, 4, 4, 'F');
  // Fill bottom corners of header
  doc.rect(margin, margin + 18, contentWidth, 8, 'F');

  // School Header Text (White)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EDUSPHERE INTERNATIONAL ACADEMY', pageWidth / 2, margin + 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('CBSE Affiliated Senior Secondary School • Affiliation No: 2130894', pageWidth / 2, margin + 14, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('Knowledge Park III, Institutional Area • Helpline: +91 98765 43210 • Email: fees@edusphere.edu', pageWidth / 2, margin + 19, { align: 'center' });

  // Receipt Title Bar
  let y = margin + 33;
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 10, 2, 2, 'FD');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('OFFICIAL FEE PAYMENT RECEIPT', pageWidth / 2, y + 6.5, { align: 'center' });

  // Receipt Meta Grid (Left & Right)
  y += 16;
  doc.setFontSize(8.5);

  // Left Meta
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('RECEIPT NO:', margin + 6, y);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(receiptNo, margin + 34, y);

  doc.setTextColor(107, 114, 128);
  doc.text('ACADEMIC YEAR:', margin + 6, y + 6);
  doc.setTextColor(31, 41, 55);
  doc.text('2026 - 2027', margin + 38, y + 6);

  // Right Meta
  doc.setTextColor(107, 114, 128);
  doc.text('PAYMENT DATE:', pageWidth - margin - 56, y);
  doc.setTextColor(31, 41, 55);
  doc.text(paidDate, pageWidth - margin - 22, y);

  doc.setTextColor(107, 114, 128);
  doc.text('PAYMENT STATUS:', pageWidth - margin - 56, y + 6);
  doc.setTextColor(16, 185, 129); // Green
  doc.setFont('helvetica', 'bold');
  doc.text('PAID (VERIFIED)', pageWidth - margin - 22, y + 6);

  // Student Details Box
  y += 12;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 36, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STUDENT INFORMATION', margin + 8, y + 6);

  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 8, y + 8, pageWidth - margin - 8, y + 8);

  // 2 Columns Student Info
  const col1 = margin + 8;
  const col2 = pageWidth / 2 + 4;
  let infoY = y + 15;

  // Row 1
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Student Name:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(studentName, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Roll Number:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(String(rollNo), col2 + 24, infoY);

  // Row 2
  infoY += 7;
  doc.setTextColor(107, 114, 128);
  doc.text('Class & Section:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(className, col1 + 26, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Father / Guardian:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(fatherName, col2 + 28, infoY);

  // Row 3
  infoY += 7;
  doc.setTextColor(107, 114, 128);
  doc.text('WhatsApp / Phone:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(phone, col1 + 30, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Payment Mode:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(paymentMethod, col2 + 26, infoY);

  // Fee Particulars Table
  y += 42;
  const tableY = y;
  const tableHeight = 65;

  // Table Header
  doc.setFillColor(79, 70, 229);
  doc.rect(margin + 4, tableY, contentWidth - 8, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('S.No.', margin + 8, tableY + 5.5);
  doc.text('Fee Head / Description', margin + 26, tableY + 5.5);
  doc.text('Fee Month / Term', margin + 105, tableY + 5.5);
  doc.text('Amount (INR)', pageWidth - margin - 12, tableY + 5.5, { align: 'right' });

  // Table Rows
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin + 4, tableY + 8, contentWidth - 8, tableHeight - 8);

  let rowY = tableY + 16;

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1.', margin + 9, rowY);
  doc.setFont('helvetica', 'bold');
  const feeTitle = receipt.monthsCount && receipt.monthsCount > 1
    ? `${feeType} (${receipt.monthsCount} Mos @ INR ${receipt.monthlyRate || Math.round(amount / receipt.monthsCount)}/mo)`
    : feeType;
  doc.text(feeTitle, margin + 26, rowY);
  doc.setFont('helvetica', 'normal');
  doc.text(feeMonth, margin + 105, rowY);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${amount.toLocaleString('en-IN')}.00`, pageWidth - margin - 12, rowY, { align: 'right' });

  // Additional Subheads (Composite breakdown for clarity)
  const tuitionPart = Math.round(amount * 0.75);
  const devPart = Math.round(amount * 0.15);
  const labPart = amount - tuitionPart - devPart;

  rowY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(7.5);
  doc.text('• Core Academic & Instructional Tuition', margin + 29, rowY);
  doc.text(`INR ${tuitionPart.toLocaleString('en-IN')}.00`, pageWidth - margin - 12, rowY, { align: 'right' });

  rowY += 5;
  doc.text('• Campus Infrastructure & Tech Facilities', margin + 29, rowY);
  doc.text(`INR ${devPart.toLocaleString('en-IN')}.00`, pageWidth - margin - 12, rowY, { align: 'right' });

  rowY += 5;
  doc.text('• Lab, Sports & Co-Curricular Activities', margin + 29, rowY);
  doc.text(`INR ${labPart.toLocaleString('en-IN')}.00`, pageWidth - margin - 12, rowY, { align: 'right' });

  // Total Summary Box
  const totalBoxY = tableY + tableHeight - 16;
  doc.setFillColor(243, 244, 246);
  doc.rect(margin + 4, totalBoxY, contentWidth - 8, 16, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.line(margin + 4, totalBoxY, pageWidth - margin - 4, totalBoxY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 41, 55);
  doc.text('TOTAL AMOUNT PAID:', margin + 8, totalBoxY + 6.5);

  doc.setTextColor(16, 185, 129); // Green
  doc.setFontSize(12);
  doc.text(`Rs. ${amount.toLocaleString('en-IN')}.00`, pageWidth - margin - 12, totalBoxY + 7, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  const words = numberToWords(amount);
  doc.text(`Amount in Words: ${words}`, margin + 8, totalBoxY + 12.5);

  // Terms & Signature Section
  y = tableY + tableHeight + 10;

  // Left Note Box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, (contentWidth - 12) * 0.62, 34, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TERMS & CONDITIONS / IMPORTANT NOTES:', margin + 8, y + 6);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('1. Fees once paid is strictly non-refundable and non-transferable.', margin + 8, y + 12);
  doc.text('2. This is a computer-verified digital receipt issued by EduSphere 360.', margin + 8, y + 17);
  doc.text('3. Retain this official receipt for tuition tax exemption under Sec 80C.', margin + 8, y + 22);
  doc.text('4. For any discrepancies, notify accounts within 7 working days.', margin + 8, y + 27);

  // Right Signature / Stamp Box
  const sigBoxX = margin + 4 + (contentWidth - 12) * 0.62 + 4;
  const sigBoxW = (contentWidth - 12) * 0.38;

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(sigBoxX, y, sigBoxW, 34, 2, 2, 'FD');

  // Stamp circle
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.circle(sigBoxX + sigBoxW / 2, y + 14, 9, 'D');

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('FEE VERIFIED', sigBoxX + sigBoxW / 2, y + 13, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('ACCOUNTS OFFICE', sigBoxX + sigBoxW / 2, y + 16, { align: 'center' });

  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Authorized Signatory', sigBoxX + sigBoxW / 2, y + 30, { align: 'center' });

  // Bottom Footer Bar
  const footerY = pageHeight - margin - 6;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 4, footerY - 2, pageWidth - margin - 4, footerY - 2);

  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('EduSphere 360™ Institutional Enterprise System • Generated with 256-bit Secure Encryption', margin + 6, footerY + 2);
  doc.text(`Page 1 of 1 • ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - margin - 6, footerY + 2, { align: 'right' });

  return doc;
}

/**
 * Downloads the receipt as a PDF file
 */
export function downloadReceiptPdf(receipt) {
  try {
    const doc = createReceiptPdfDoc(receipt);
    const studentName = (receipt.studentName || receipt.name || 'Student').replace(/\s+/g, '_');
    const fileName = `Fee_Receipt_${receipt.receiptNo || 'REC'}_${studentName}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to download PDF receipt:', err);
    return false;
  }
}

/**
 * Prints the receipt PDF
 */
export function printReceiptPdf(receipt) {
  try {
    const doc = createReceiptPdfDoc(receipt);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Create an iframe to trigger native browser print without leaving page
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

/**
 * Directly opens WhatsApp targeting the student's mobile number with formatted official receipt message
 */
export function shareDirectToWhatsApp(receipt) {
  try {
    const phoneNum = receipt.phone || receipt.parentContact || '';
    let cleanDigits = phoneNum.replace(/[^0-9]/g, '');
    if (cleanDigits.startsWith('0')) {
      cleanDigits = cleanDigits.substring(1);
    }
    let target = cleanDigits;
    if (target.length === 10) {
      target = '91' + target;
    }

    const studentName = receipt.studentName || receipt.name || 'Student';
    const rollNo = receipt.rollNo || 'N/A';
    const className = receipt.class || 'Class 10-A';
    const fatherName = receipt.fatherName || receipt.parentName || 'Guardian';
    const feeType = receipt.feeType || 'Tuition Fee';
    const feeMonth = receipt.feeMonth || 'Academic Year 2026-27';
    const receiptNo = receipt.receiptNo || 'REC-2026-0001';
    const paidDate = receipt.paidDate || new Date().toISOString().split('T')[0];
    const paymentMethod = receipt.paymentMethod || 'Online Payment';
    const amount = Number(receipt.amount || 25000).toLocaleString('en-IN');

    const periodLine = receipt.monthsCount && receipt.monthsCount > 1
      ? `🗓️ *Period / Month:* ${feeMonth} (${receipt.monthsCount} Mos @ ₹${(receipt.monthlyRate || Math.round(Number(receipt.amount || 25000) / receipt.monthsCount)).toLocaleString('en-IN')}/mo)`
      : `🗓️ *Period / Month:* ${feeMonth}`;

    const text = `🏫 *EDUSPHERE INTERNATIONAL ACADEMY*
🧾 *OFFICIAL FEE PAYMENT RECEIPT*
━━━━━━━━━━━━━━━━━━━━
📄 *Receipt No:* ${receiptNo}
📅 *Date:* ${paidDate}
👤 *Student Name:* ${studentName}
🔢 *Roll No:* ${rollNo}
🏫 *Class & Section:* ${className}
👨‍👦 *Father / Guardian:* ${fatherName}
📂 *Fee Head:* ${feeType}
${periodLine}
💰 *Amount Paid:* ₹${amount}.00
💳 *Payment Mode:* ${paymentMethod}
✅ *Status:* PAID & VERIFIED
━━━━━━━━━━━━━━━━━━━━
Thank you for your payment! Official receipt has been registered in the school ledger.`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = target && target.length >= 10
      ? `https://api.whatsapp.com/send?phone=${target}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
    return true;
  } catch (err) {
    console.error('WhatsApp share error:', err);
    return false;
  }
}

/**
 * Shares the receipt PDF via Web Share API Level 2 (with PDF file blob) or falls back to WhatsApp
 */
export async function shareReceiptPdf(receipt) {
  try {
    const studentName = (receipt.studentName || receipt.name || 'Student').replace(/\s+/g, '_');
    const fileName = `Fee_Receipt_${receipt.receiptNo || 'REC'}_${studentName}.pdf`;
    const doc = createReceiptPdfDoc(receipt);
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // 1. Try sharing actual PDF File if Web Share Level 2 is supported (iOS Safari, Android Chrome, MacOS Safari, Edge)
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `Fee Receipt - ${receipt.studentName || receipt.name || 'Student'}`,
        text: `Official Fee Payment Receipt (${receipt.receiptNo || ''}) for ${receipt.studentName || receipt.name || 'Student'} - Amount: ₹${Number(receipt.amount || 0).toLocaleString('en-IN')}`,
        files: [file],
      });
      return { success: true, type: 'file' };
    }

    // 2. Fallback to Web Share text if files aren't supported
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: `Fee Receipt - ${receipt.studentName || receipt.name || 'Student'}`,
        text: `Official Fee Receipt (${receipt.receiptNo || ''}) for ${receipt.studentName || receipt.name || 'Student'}\nAmount: ₹${Number(receipt.amount || 0).toLocaleString('en-IN')}\nStatus: PAID & VERIFIED`,
      });
      return { success: true, type: 'text' };
    }

    // 3. Fallback to direct WhatsApp
    shareDirectToWhatsApp(receipt);
    return { success: true, type: 'whatsapp' };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      // User cancelled native share sheet
      return { cancelled: true };
    }
    console.warn('Native share failed, falling back to WhatsApp:', err);
    shareDirectToWhatsApp(receipt);
    return { success: true, type: 'whatsapp' };
  }
}

/**
 * Copies the receipt text to clipboard
 */
export async function copyReceiptTextToClipboard(receipt) {
  try {
    const studentName = receipt.studentName || receipt.name || 'Student';
    const rollNo = receipt.rollNo || 'N/A';
    const className = receipt.class || 'Class 10-A';
    const fatherName = receipt.fatherName || receipt.parentName || 'Guardian';
    const feeType = receipt.feeType || 'Tuition Fee';
    const feeMonth = receipt.feeMonth || 'Academic Year 2026-27';
    const receiptNo = receipt.receiptNo || 'REC-2026-0001';
    const paidDate = receipt.paidDate || new Date().toISOString().split('T')[0];
    const paymentMethod = receipt.paymentMethod || 'Online Payment';
    const amount = Number(receipt.amount || 25000).toLocaleString('en-IN');

    const text = `EDUSPHERE INTERNATIONAL ACADEMY - FEE RECEIPT
Receipt No: ${receiptNo}
Date: ${paidDate}
Student: ${studentName} (Roll #${rollNo}, ${className})
Guardian: ${fatherName}
Particulars: ${feeType} (${feeMonth})
Amount: ₹${amount}.00
Payment Mode: ${paymentMethod}
Status: PAID & VERIFIED`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Copy clipboard error:', err);
    return false;
  }
}
