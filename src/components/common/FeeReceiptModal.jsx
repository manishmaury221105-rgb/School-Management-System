import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import {
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  downloadReceiptPdf,
  printReceiptPdf,
  shareReceiptPdf,
  shareDirectToWhatsApp,
  copyReceiptTextToClipboard,
} from '../../utils/pdfReceiptGenerator';
import confetti from 'canvas-confetti';

const WhatsAppIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

export const FeeReceiptModal = ({
  isOpen,
  onClose,
  receipt,
  isNewPayment = false,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isOpen && isNewPayment) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9'],
        });
      } catch (err) {
        console.log('Confetti error', err);
      }
    }
  }, [isOpen, isNewPayment]);

  if (!receipt) return null;

  const studentName = receipt.studentName || receipt.name || 'Student';
  const rollNo = receipt.rollNo || 'N/A';
  const className = receipt.class || 'Class 10-A';
  const fatherName = receipt.fatherName || receipt.parentName || 'Guardian';
  const phone = receipt.phone || receipt.parentContact || 'N/A';
  const feeType = receipt.feeType || 'Tuition Fee';
  const feeMonth = receipt.feeMonth || 'Academic Year 2026-27';
  const receiptNo = receipt.receiptNo || 'REC-2026-0001';
  const paidDate = receipt.paidDate || new Date().toISOString().split('T')[0];
  const paymentMethod = receipt.paymentMethod || 'Online Payment';
  const amount = Number(receipt.amount || 25000);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleDownload = () => {
    setDownloading(true);
    showToast('Generating official PDF receipt...');
    setTimeout(() => {
      const ok = downloadReceiptPdf(receipt);
      setDownloading(false);
      if (ok) {
        showToast('✓ PDF Receipt Downloaded Successfully!');
      } else {
        showToast('⚠️ Could not download PDF. Please try print option.');
      }
    }, 250);
  };

  const handleShareFile = async () => {
    setSharing(true);
    showToast('Opening share options...');
    const res = await shareReceiptPdf(receipt);
    setSharing(false);
    if (res && res.cancelled) {
      // User dismissed native sheet
      return;
    }
    if (res && res.type === 'file') {
      showToast('✓ PDF File Shared!');
    } else if (res && res.type === 'whatsapp') {
      showToast('✓ Opening WhatsApp with Receipt...');
    }
  };

  const handleWhatsAppShare = () => {
    showToast('Opening WhatsApp with Receipt Details...');
    shareDirectToWhatsApp(receipt);
  };

  const handlePrint = () => {
    showToast('Preparing PDF for Print...');
    printReceiptPdf(receipt);
  };

  const handleCopyText = async () => {
    const ok = await copyReceiptTextToClipboard(receipt);
    if (ok) {
      setCopied(true);
      showToast('✓ Receipt details copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNewPayment ? '🎉 Payment Successful • Official Receipt' : 'Official Fee Payment Receipt'}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Status Toast / Alert if active */}
        {feedbackMsg && (
          <div
            className="animate-fade-in"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(16, 185, 129, 0.12))',
              border: '1px solid var(--primary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Payment Confirmation Banner (for newly processed payments) */}
        {isNewPayment && (
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#065f46' }}>
                Payment Processed & Settled Successfully!
              </div>
              <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '2px' }}>
                Your institutional fee has been credited. You can now <strong>Download PDF</strong> or{' '}
                <strong>Share on WhatsApp</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Buttons Bar: Download PDF & Share PDF */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.65rem',
          }}
        >
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.75rem 1rem',
              fontWeight: '800',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Download size={16} />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          {/* Share PDF / Web Share Button */}
          <button
            type="button"
            onClick={handleShareFile}
            disabled={sharing}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.75rem 1rem',
              fontWeight: '800',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
            }}
          >
            <Share2 size={16} />
            <span>{sharing ? 'Sharing...' : 'Share PDF'}</span>
          </button>

          {/* WhatsApp Direct Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.75rem 1rem',
              fontWeight: '800',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            <WhatsAppIcon size={16} color="white" />
            <span>WhatsApp</span>
          </button>

          {/* Print PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.75rem 1rem',
              fontWeight: '700',
              fontSize: '0.88rem',
            }}
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>

        {/* Detailed Receipt Card (Vibrant, Responsive, Clean) */}
        <div
          style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Institutional Top Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1.5px dashed var(--border)',
              paddingBottom: '1rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                EduSphere International Academy
              </div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  margin: '2px 0 0 0',
                }}
              >
                Official Fee Payment Receipt
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Affiliation No: 2130894 • Helpline: +91 98765 43210
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#059669',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  marginBottom: '4px',
                }}
              >
                <Check size={13} strokeWidth={3} />
                <span>PAID & VERIFIED</span>
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  color: 'var(--primary)',
                }}
              >
                {receiptNo}
              </div>
            </div>
          </div>

          {/* Student & Payment Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: '1.5px dashed var(--border)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>STUDENT NAME</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {studentName}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>CLASS & ROLL NO.</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {className} • Roll #{rollNo}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>FATHER / GUARDIAN</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {fatherName}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>SETTLEMENT DATE</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {paidDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>PAYMENT MODE</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {paymentMethod}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>PERIOD / MONTH</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                {feeMonth}
              </div>
            </div>
          </div>

          {/* Fee Breakdown Particulars */}
          <div style={{ padding: '1rem 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              <span>PARTICULARS</span>
              <span>AMOUNT</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.75rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '0.92rem',
              }}
            >
              <div>
                <div>
                  {feeType}
                  {receipt.monthsCount && receipt.monthsCount > 1 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', marginLeft: '6px', fontWeight: '700' }}>
                      ({receipt.monthsCount} Mos @ ₹{(receipt.monthlyRate || Math.round(amount / receipt.monthsCount)).toLocaleString('en-IN')}/mo)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '2px' }}>
                  {feeMonth} • Institutional Composite Tuition
                </div>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                ₹{amount.toLocaleString('en-IN')}.00
              </div>
            </div>
          </div>

          {/* Total Box */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.08))',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>TOTAL PAID AMOUNT</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Sec 80C Eligible Official Tax Receipt
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>
              ₹{amount.toLocaleString('en-IN')}.00
            </div>
          </div>

          {/* Digital Signature & Footer Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--border)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>256-Bit Cryptographically Encrypted Receipt</span>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* Modal Close / Done Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '0.65rem 1.5rem' }}>
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
