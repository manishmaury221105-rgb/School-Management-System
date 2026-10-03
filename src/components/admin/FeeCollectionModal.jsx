import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import {
  CreditCard,
  IndianRupee,
  Receipt,
  CheckCircle2,
  Printer,
  Download,
  User,
  Hash,
  School,
  Calendar,
  Phone,
  Share2,
  FileText,
  Check,
} from 'lucide-react';
import {
  downloadReceiptPdf,
  printReceiptPdf,
  shareReceiptPdf,
  sharePdfToWhatsApp,
  shareDirectToWhatsApp,
} from '../../utils/pdfReceiptGenerator';

const WhatsAppIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"/>
  </svg>
);

const ACADEMIC_MONTHS = [
  { label: 'Apr', name: 'April', full: 'April 2026' },
  { label: 'May', name: 'May', full: 'May 2026' },
  { label: 'Jun', name: 'June', full: 'June 2026' },
  { label: 'Jul', name: 'July', full: 'July 2026' },
  { label: 'Aug', name: 'August', full: 'August 2026' },
  { label: 'Sep', name: 'September', full: 'September 2026' },
  { label: 'Oct', name: 'October', full: 'October 2026' },
  { label: 'Nov', name: 'November', full: 'November 2026' },
  { label: 'Dec', name: 'December', full: 'December 2026' },
  { label: 'Jan', name: 'January', full: 'January 2027' },
  { label: 'Feb', name: 'February', full: 'February 2027' },
  { label: 'Mar', name: 'March', full: 'March 2027' },
];

function formatMonthsSummary(monthsList) {
  if (!monthsList || monthsList.length === 0) return 'October 2026';
  if (monthsList.length === 1) return monthsList[0];
  if (monthsList.length === 12) return 'Full Academic Year (All 12 Months)';
  
  // Extract month short names (e.g. Apr, May, Jun 2026)
  const names = monthsList.map(m => m.split(' ')[0]);
  return `${names.join(', ')} (${monthsList.length} Months)`;
}

export const FeeCollectionModal = ({ isOpen, onClose, initialStudent = null, onSuccess }) => {
  const { students, classes, collectFee } = useSchoolData();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(['October 2026']);
  const [monthlyRate, setMonthlyRate] = useState(2500);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    fatherName: '',
    class: 'Class 10-A',
    studentId: '',
    phone: '',
    feeMonth: 'October 2026',
    amount: '2500',
    feeType: 'Tuition Fee',
    paymentMethod: 'Cash Counter',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: 'Fee payment collected in full',
  });

  const [generatedReceipt, setGeneratedReceipt] = useState(null);
  const [matchedStudentInfo, setMatchedStudentInfo] = useState(null);

  const performStudentLookup = (roll, cls) => {
    if (!roll || !String(roll).trim()) {
      setMatchedStudentInfo(null);
      return null;
    }
    const cleanRoll = String(roll).trim().toLowerCase();
    
    // 1. Try finding in the specified class first
    let match = students.find(s => {
      const sClass = (s.class || '').trim().toLowerCase();
      const tClass = (cls || '').trim().toLowerCase();
      if (tClass && sClass !== tClass) return false;
      
      const sRoll = String(s.rollNo || '').trim().toLowerCase();
      return (
        sRoll === cleanRoll ||
        sRoll.padStart(2, '0') === cleanRoll.padStart(2, '0') ||
        (parseInt(sRoll, 10) === parseInt(cleanRoll, 10) && !isNaN(parseInt(cleanRoll, 10)))
      );
    });

    // 2. If not found in selected class, search across all classes
    if (!match) {
      match = students.find(s => {
        const sRoll = String(s.rollNo || '').trim().toLowerCase();
        return (
          sRoll === cleanRoll ||
          sRoll.padStart(2, '0') === cleanRoll.padStart(2, '0') ||
          (parseInt(sRoll, 10) === parseInt(cleanRoll, 10) && !isNaN(parseInt(cleanRoll, 10)))
        );
      });
    }

    setMatchedStudentInfo(match || null);
    return match;
  };

  useEffect(() => {
    const baseRate = 2500;
    setMonthlyRate(baseRate);
    if (initialStudent) {
      setSelectedStudentId(initialStudent.id || '');
      const initialMonths = ['October 2026'];
      setSelectedMonths(initialMonths);
      setMatchedStudentInfo(initialStudent);
      setFormData({
        studentName: initialStudent.name || '',
        rollNo: initialStudent.rollNo || '',
        fatherName: initialStudent.parentName || initialStudent.fatherName || '',
        class: initialStudent.class || 'Class 10-A',
        studentId: initialStudent.studentId || '',
        phone: initialStudent.phone || initialStudent.parentContact || '',
        feeMonth: 'October 2026',
        amount: String(baseRate * initialMonths.length),
        feeType: 'Tuition Fee',
        paymentMethod: 'Cash Counter',
        paymentDate: new Date().toISOString().split('T')[0],
        remarks: 'Fee payment',
      });
    } else {
      setSelectedStudentId('');
      const initialMonths = ['October 2026'];
      setSelectedMonths(initialMonths);
      setMatchedStudentInfo(null);
      setFormData({
        studentName: '',
        rollNo: '',
        fatherName: '',
        class: classes[0]?.name || 'Class 10-A',
        studentId: '',
        phone: '',
        feeMonth: 'October 2026',
        amount: String(baseRate * initialMonths.length),
        feeType: 'Tuition Fee',
        paymentMethod: 'Cash Counter',
        paymentDate: new Date().toISOString().split('T')[0],
        remarks: 'Fee payment',
      });
    }
  }, [isOpen, initialStudent, students, classes]);

  const handleRollChange = (val) => {
    setFormData(prev => {
      const updated = { ...prev, rollNo: val };
      const matched = performStudentLookup(val, updated.class);
      if (matched) {
        return {
          ...updated,
          studentName: matched.name || prev.studentName,
          fatherName: matched.parentName || matched.fatherName || prev.fatherName,
          phone: matched.phone || matched.parentContact || prev.phone,
          studentId: matched.studentId || matched.id || prev.studentId,
          class: matched.class || updated.class,
        };
      }
      return updated;
    });
  };

  const handleClassChange = (val) => {
    setFormData(prev => {
      const updated = { ...prev, class: val };
      if (updated.rollNo) {
        const matched = performStudentLookup(updated.rollNo, val);
        if (matched) {
          return {
            ...updated,
            studentName: matched.name || prev.studentName,
            fatherName: matched.parentName || matched.fatherName || prev.fatherName,
            phone: matched.phone || matched.parentContact || prev.phone,
            studentId: matched.studentId || matched.id || prev.studentId,
          };
        }
      }
      return updated;
    });
  };

  const handleNameChange = (val) => {
    setFormData(prev => {
      const updated = { ...prev, studentName: val };
      const cleanName = val.trim().toLowerCase();
      if (cleanName.length >= 2) {
        const matched = students.find(s => (s.name || '').trim().toLowerCase() === cleanName);
        if (matched) {
          setMatchedStudentInfo(matched);
          return {
            ...updated,
            rollNo: matched.rollNo || prev.rollNo,
            class: matched.class || prev.class,
            fatherName: matched.parentName || matched.fatherName || prev.fatherName,
            phone: matched.phone || matched.parentContact || prev.phone,
            studentId: matched.studentId || matched.id || prev.studentId,
          };
        }
      }
      return updated;
    });
  };

  // Change monthly rate & recalculate total
  const handleMonthlyRateChange = (newRate) => {
    const rateNum = Math.max(0, Number(newRate) || 0);
    setMonthlyRate(rateNum);
    setFormData(f => ({
      ...f,
      amount: String(rateNum * selectedMonths.length),
    }));
  };

  // Multi-Month Selection Toggle with Automatic Multiplication
  const toggleMonth = (monthFull) => {
    setSelectedMonths(prev => {
      let next;
      if (prev.includes(monthFull)) {
        if (prev.length === 1) return prev; // keep at least 1 month
        next = prev.filter(m => m !== monthFull);
      } else {
        next = [...prev, monthFull];
      }
      // Keep sorted by academic order
      const sorted = ACADEMIC_MONTHS.filter(m => next.includes(m.full)).map(m => m.full);
      const summary = formatMonthsSummary(sorted);
      setFormData(f => ({
        ...f,
        feeMonth: summary,
        amount: String(monthlyRate * sorted.length),
      }));
      return sorted;
    });
  };

  // Quick Preset Selection (Multiplies automatically by month count)
  const applyMonthPreset = (monthsArray) => {
    const sorted = ACADEMIC_MONTHS.filter(m => monthsArray.includes(m.full)).map(m => m.full);
    setSelectedMonths(sorted);
    const summary = formatMonthsSummary(sorted);
    setFormData(f => ({
      ...f,
      feeMonth: summary,
      amount: String(monthlyRate * sorted.length),
    }));
  };

  const handlePrintPdf = () => {
    if (!generatedReceipt) return;
    printReceiptPdf({ ...generatedReceipt, phone: generatedReceipt.phone || formData.phone });
  };

  const handleDownloadPdf = () => {
    if (!generatedReceipt) return;
    downloadReceiptPdf({ ...generatedReceipt, phone: generatedReceipt.phone || formData.phone });
  };

  const handleSharePdfFile = () => {
    if (!generatedReceipt) return;
    shareReceiptPdf({ ...generatedReceipt, phone: generatedReceipt.phone || formData.phone });
  };

  const handleWhatsAppShare = async () => {
    if (!generatedReceipt) return;
    await sharePdfToWhatsApp({
      ...generatedReceipt,
      phone: generatedReceipt.phone || formData.phone,
      feeMonth: generatedReceipt.feeMonth || formData.feeMonth,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.amount) return;

    const totalCalculated = Number(formData.amount) || (monthlyRate * selectedMonths.length);

    const record = collectFee({
      studentName: formData.studentName,
      rollNo: formData.rollNo,
      fatherName: formData.fatherName,
      class: formData.class,
      studentId: formData.studentId,
      phone: formData.phone,
      feeMonth: formData.feeMonth,
      monthlyRate: Number(monthlyRate) || 2500,
      monthsCount: selectedMonths.length,
      selectedMonthsList: selectedMonths,
      amount: totalCalculated,
      feeType: formData.feeType,
      paymentMethod: formData.paymentMethod,
      dueDate: formData.paymentDate,
    });

    setGeneratedReceipt(record);
    if (onSuccess) onSuccess(record);
  };

  const handleClose = () => {
    setGeneratedReceipt(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={generatedReceipt ? "Official Fee Receipt (PDF Ready)" : "Collect Student Fee"}
    >
      {generatedReceipt ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Success Banner */}
          <div style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Fee Collected Successfully!
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Official PDF receipt generated for <strong>{generatedReceipt.feeMonth || 'Selected Months'}</strong> & student marked as <strong>Paid</strong>.
              </p>
            </div>
          </div>

          {/* Receipt Printable Card */}
          <div style={{
            padding: '1.25rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>RECEIPT NUMBER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)' }}>
                  {generatedReceipt.receiptNo}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>DATE</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{generatedReceipt.paidDate}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>STUDENT NAME</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>{generatedReceipt.studentName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ROLL NO & CLASS</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>Roll #{generatedReceipt.rollNo} • {generatedReceipt.class}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>FATHER / GUARDIAN</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>{generatedReceipt.fatherName || 'Guardian'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>FEE MONTHS (PERIOD)</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {generatedReceipt.feeMonth || 'October 2026'}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--border)',
              marginTop: '0.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORY & MODE</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{generatedReceipt.feeType} ({generatedReceipt.paymentMethod})</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>AMOUNT PAID</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#10b981' }}>
                  ₹{generatedReceipt.amount?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Download PDF, Share PDF, WhatsApp, and Print PDF */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.7rem 0.85rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
              }}
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSharePdfFile}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.7rem 0.85rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              }}
            >
              <Share2 size={16} />
              <span>Share PDF</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.7rem 0.85rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              <WhatsAppIcon size={16} />
              <span>WhatsApp (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.7rem 0.85rem',
                fontWeight: '700',
              }}
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              style={{ padding: '0.6rem 1.5rem', fontWeight: '700' }}
            >
              Done / Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Roll No. & Class */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1, 2, 24"
                value={formData.rollNo}
                onChange={(e) => handleRollChange(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class & Section *
              </label>
              <select
                value={formData.class}
                onChange={(e) => handleClassChange(e.target.value)}
                style={{ width: '100%' }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Matched Indicator */}
          {matchedStudentInfo && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#065f46',
              fontWeight: '600'
            }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span>Student Auto-Found: <strong>{matchedStudentInfo.name}</strong> ({matchedStudentInfo.class} • Roll #{matchedStudentInfo.rollNo})</span>
            </div>
          )}

          {/* Student Name */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Name of Student *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Liam Johnson"
              value={formData.studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Father Name & WhatsApp Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Father / Guardian Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Michael Johnson"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <WhatsAppIcon size={14} />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Multi-Select Fee Month / Period */}
          <div style={{
            padding: '0.9rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                <span>Select Fee Months (Multi-Select):</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: 'white',
                  background: 'var(--primary)',
                  padding: '2px 9px',
                  borderRadius: '12px'
                }}>
                  {selectedMonths.length} {selectedMonths.length === 1 ? 'Month' : 'Months'} Selected (×{selectedMonths.length})
                </span>
              </div>
            </div>

            {/* Quick Month Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <button
                type="button"
                onClick={() => applyMonthPreset(['October 2026'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: selectedMonths.length === 1 ? 'var(--primary-light)' : 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: selectedMonths.length === 1 ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(['April 2026', 'May 2026', 'June 2026'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Q1 (Apr-Jun)
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(['July 2026', 'August 2026', 'September 2026'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Q2 (Jul-Sep)
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(['October 2026', 'November 2026', 'December 2026'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Q3 (Oct-Dec)
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(['January 2027', 'February 2027', 'March 2027'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Q4 (Jan-Mar)
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'])}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                6 Mos (Half-Year)
              </button>
              <button
                type="button"
                onClick={() => applyMonthPreset(ACADEMIC_MONTHS.map(m => m.full))}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: selectedMonths.length === 12 ? 'var(--primary)' : 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: selectedMonths.length === 12 ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                All 12 Months (Full Year)
              </button>
            </div>

            {/* 12-Month Multi-Select Interactive Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '5px',
            }}>
              {ACADEMIC_MONTHS.map((m) => {
                const isSelected = selectedMonths.includes(m.full);
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => toggleMonth(m.full)}
                    style={{
                      padding: '6px 2px',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? '800' : '600',
                      borderRadius: '6px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      boxShadow: isSelected ? '0 2px 6px rgba(79, 70, 229, 0.35)' : 'none',
                    }}
                  >
                    {isSelected && <Check size={11} style={{ strokeWidth: 3 }} />}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Real-Time Multiplier Breakdown Pill */}
            <div style={{
              padding: '0.55rem 0.75rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4px',
              fontSize: '0.78rem',
            }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                🧮 <strong>Auto-Multiply Calculation:</strong> ₹{monthlyRate.toLocaleString('en-IN')} / mo × <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{selectedMonths.length} Month{selectedMonths.length > 1 ? 's' : ''}</span>
              </div>
              <div style={{ fontWeight: '800', color: '#10b981', fontSize: '0.92rem' }}>
                = ₹{(monthlyRate * selectedMonths.length).toLocaleString('en-IN')}.00
              </div>
            </div>

            {/* Selected Months Summary Text */}
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Period: <strong style={{ color: 'var(--primary)' }}>{formData.feeMonth}</strong>
            </div>
          </div>

          {/* Fee Category, Monthly Rate & Total Amount */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1.1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Fee Category
              </label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Annual Composite Fee">Annual Composite Fee</option>
                <option value="Admission & Registration">Admission & Registration</option>
                <option value="Transport & Bus Fee">Transport & Bus Fee</option>
                <option value="Lab & Activity Fee">Lab & Activity Fee</option>
                <option value="Examination Fee">Examination Fee</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Rate (₹/Month)
              </label>
              <input
                type="number"
                min="0"
                placeholder="2500"
                value={monthlyRate}
                onChange={(e) => handleMonthlyRateChange(e.target.value)}
                style={{ width: '100%', fontWeight: '700' }}
                title="Base monthly tuition fee"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Total Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="2500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ width: '100%', fontWeight: '800', color: '#10b981', fontSize: '1rem' }}
                title="Total payable (Monthly Rate × Selected Months)"
              />
            </div>
          </div>

          {/* Payment Method & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Cash Counter">Cash Counter</option>
                <option value="UPI / QR Payment">UPI / QR Payment</option>
                <option value="Online NetBanking">Online NetBanking</option>
                <option value="Debit / Credit Card">Debit / Credit Card</option>
                <option value="Bank Cheque / DD">Bank Cheque / DD</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Collection Date
              </label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: '#10b981', borderColor: '#10b981', color: 'white' }}>
              <CheckCircle2 size={16} />
              <span>Collect Fee (₹{Number(formData.amount || 0).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
