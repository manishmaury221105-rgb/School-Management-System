import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { FeeReceiptModal } from '../common/FeeReceiptModal';
import {
  downloadReceiptPdf,
  shareReceiptPdf,
  sharePdfToWhatsApp,
} from '../../utils/pdfReceiptGenerator';
import {
  CreditCard,
  Receipt,
  Download,
  Smartphone,
  ShieldCheck,
  Check,
  Share2,
  Calendar,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 15 }) => (
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
  const names = monthsList.map(m => m.split(' ')[0]);
  return `${names.join(', ')} (${monthsList.length} Months)`;
}

export const StudentFees = () => {
  const { currentUser } = useAuth();
  const { fees, payFee } = useSchoolData();
  const [selectedFeeToPay, setSelectedFeeToPay] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isNewPayment, setIsNewPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedMonths, setSelectedMonths] = useState(['October 2026']);
  const BASE_MONTHLY_RATE = 2500;

  // Toggle month selection & multiply
  const toggleMonth = (monthFull) => {
    setSelectedMonths(prev => {
      let next;
      if (prev.includes(monthFull)) {
        if (prev.length === 1) return prev;
        next = prev.filter(m => m !== monthFull);
      } else {
        next = [...prev, monthFull];
      }
      return ACADEMIC_MONTHS.filter(m => next.includes(m.full)).map(m => m.full);
    });
  };

  const applyMonthPreset = (monthsArray) => {
    setSelectedMonths(ACADEMIC_MONTHS.filter(m => monthsArray.includes(m.full)).map(m => m.full));
  };

  // Dynamically match all fees for current student across ID, Name, Roll+Class, or Phone
  const rawMatchedFees = fees.filter(f => {
    if (!currentUser) return false;
    const matchId = f.studentId && (
      f.studentId === currentUser.id ||
      f.studentId === currentUser.studentId ||
      f.id === currentUser.id
    );
    const matchName = f.studentName && currentUser.name && (
      f.studentName.trim().toLowerCase() === currentUser.name.trim().toLowerCase()
    );
    const matchRollAndClass = f.rollNo && f.class && currentUser.rollNo && currentUser.class && (
      String(f.rollNo) === String(currentUser.rollNo) && f.class === currentUser.class
    );
    const matchPhone = f.phone && currentUser.phone && (
      f.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')
    );
    return matchId || matchName || matchRollAndClass || matchPhone;
  });

  // Fallback to active term invoice if no custom fee record created yet
  const myFees = rawMatchedFees.length > 0 ? rawMatchedFees : [
    {
      id: `default-fee-${currentUser?.id || 'std'}`,
      studentId: currentUser?.id || 'user-student-default',
      studentName: currentUser?.name || 'Student User',
      feeType: 'Tuition Fee (Term 1 - Academic Year 2026-27)',
      class: currentUser?.class || 'Class 10-A',
      amount: 25000,
      dueDate: '2026-10-15',
      status: currentUser?.feeStatus === 'Paid' ? 'Paid' : 'Pending',
      paymentMethod: currentUser?.feeStatus === 'Paid' ? 'Cash / Institutional Counter' : '',
      receiptNo: currentUser?.feeStatus === 'Paid' ? 'REC-2026-INST' : '',
      paidDate: currentUser?.feeStatus === 'Paid' ? new Date().toISOString().split('T')[0] : '',
    }
  ];

  const totalPaid = myFees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPending = myFees
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const handleExecutePayment = (e) => {
    e.preventDefault();
    if (!selectedFeeToPay) return;

    const calculatedAmount = BASE_MONTHLY_RATE * selectedMonths.length;
    const monthsSummary = formatMonthsSummary(selectedMonths);

    const feeItem = {
      ...selectedFeeToPay,
      amount: calculatedAmount,
      feeMonth: monthsSummary,
      monthlyRate: BASE_MONTHLY_RATE,
      monthsCount: selectedMonths.length,
      selectedMonthsList: selectedMonths,
    };

    const chosenMethod = paymentMethod === 'UPI' ? 'Instant UPI (rohan@okhdfc)' : 'Credit Card (**** 4242)';
    const res = payFee(selectedFeeToPay.id, chosenMethod, feeItem);
    setSelectedFeeToPay(null);

    // Prepare full receipt object
    const completeReceipt = {
      ...feeItem,
      status: 'Paid',
      receiptNo: res.receiptNo,
      paidDate: res.paidDate,
      paymentMethod: chosenMethod,
      amount: calculatedAmount,
      feeMonth: monthsSummary,
      monthlyRate: BASE_MONTHLY_RATE,
      monthsCount: selectedMonths.length,
      studentName: feeItem.studentName || currentUser?.name,
      rollNo: feeItem.rollNo || currentUser?.rollNo,
      class: feeItem.class || currentUser?.class,
      phone: feeItem.phone || currentUser?.phone,
      fatherName: feeItem.fatherName || currentUser?.fatherName || currentUser?.parentName,
    };

    setIsNewPayment(true);
    setSelectedReceipt(completeReceipt);
  };

  const handleOpenReceipt = (fee) => {
    setIsNewPayment(false);
    setSelectedReceipt({
      ...fee,
      studentName: fee.studentName || currentUser?.name,
      rollNo: fee.rollNo || currentUser?.rollNo,
      class: fee.class || currentUser?.class,
      phone: fee.phone || currentUser?.phone,
      fatherName: fee.fatherName || currentUser?.fatherName || currentUser?.parentName,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Fee Ledger & Online Payments</h1>
          <p className="page-subtitle">
            Quarterly tuition schedules, lab development funds, instant digital checkout, PDF receipt download & share.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL FEES SETTLED</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
            ✓ Verified Institutional Receipts (PDF Ready)
          </div>
        </div>

        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>OUTSTANDING BALANCE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: totalPending > 0 ? '#b91c1c' : '#10b981', fontWeight: '700', marginTop: '4px' }}>
            {totalPending > 0 ? 'Due by October 15, 2026' : 'No Overdue Dues • All Paid'}
          </div>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Fee Schedule & Payment History</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Academic Year 2026-27</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Fee Particulars</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Receipt / Mode</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myFees.map((fee) => {
                const isPaid = fee.status === 'Paid';
                const formattedFee = {
                  ...fee,
                  studentName: fee.studentName || currentUser?.name,
                  rollNo: fee.rollNo || currentUser?.rollNo,
                  class: fee.class || currentUser?.class,
                  phone: fee.phone || currentUser?.phone,
                  fatherName: fee.fatherName || currentUser?.fatherName || currentUser?.parentName,
                };

                return (
                  <tr key={fee.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{fee.feeType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.class}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ₹{Number(fee.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: fee.status === 'Pending' ? '#b91c1c' : 'var(--text-muted)', fontWeight: '600' }}>
                        {fee.dueDate}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${isPaid ? 'badge-paid' : 'badge-pending'}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      {fee.receiptNo ? (
                        <div>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {fee.receiptNo}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fee.paymentMethod}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unpaid</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isPaid ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(fee)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="View Official Receipt"
                          >
                            <Receipt size={14} />
                            <span>Receipt (PDF)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadReceiptPdf(formattedFee)}
                            className="icon-btn"
                            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                            title="Direct Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => sharePdfToWhatsApp(formattedFee)}
                            className="icon-btn"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              color: '#10b981',
                              borderColor: 'rgba(16, 185, 129, 0.3)',
                            }}
                            title="Share PDF on WhatsApp"
                          >
                            <WhatsAppIcon size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => shareReceiptPdf(formattedFee)}
                            className="icon-btn"
                            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                            title="Share PDF Receipt"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedFeeToPay(fee)}
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                        >
                          <CreditCard size={14} />
                          <span>Pay Online</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Payment Gateway Simulation Modal */}
      {selectedFeeToPay && (
        <Modal
          isOpen={!!selectedFeeToPay}
          onClose={() => setSelectedFeeToPay(null)}
          title="Secure Instant Payment Checkout"
        >
          <form onSubmit={handleExecutePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{
              padding: '1.15rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--primary)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>INVOICE ITEM</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedFeeToPay.feeType}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <span style={{ fontWeight: '700' }}>Calculated Payable:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                  ₹{(BASE_MONTHLY_RATE * selectedMonths.length).toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            {/* Interactive Multi-Month Selector with Multiplier */}
            <div style={{
              padding: '0.85rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} style={{ color: 'var(--primary)' }} />
                  <span>Choose Months to Pay:</span>
                </label>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: 'white',
                  background: 'var(--primary)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {selectedMonths.length} {selectedMonths.length === 1 ? 'Month' : 'Months'} Selected (×{selectedMonths.length})
                </span>
              </div>

              {/* Quick Presets */}
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
                  1 Mo (₹{(BASE_MONTHLY_RATE * 1).toLocaleString('en-IN')})
                </button>
                <button
                  type="button"
                  onClick={() => applyMonthPreset(['October 2026', 'November 2026', 'December 2026'])}
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    background: selectedMonths.length === 3 ? 'var(--primary-light)' : 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: selectedMonths.length === 3 ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  3 Mos (₹{(BASE_MONTHLY_RATE * 3).toLocaleString('en-IN')})
                </button>
                <button
                  type="button"
                  onClick={() => applyMonthPreset(['October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027', 'March 2027'])}
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    background: selectedMonths.length === 6 ? 'var(--primary-light)' : 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: selectedMonths.length === 6 ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  6 Mos (₹{(BASE_MONTHLY_RATE * 6).toLocaleString('en-IN')})
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
                  Full Year (₹{(BASE_MONTHLY_RATE * 12).toLocaleString('en-IN')})
                </button>
              </div>

              {/* 12-Month Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '4px',
              }}>
                {ACADEMIC_MONTHS.map((m) => {
                  const isSelected = selectedMonths.includes(m.full);
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => toggleMonth(m.full)}
                      style={{
                        padding: '5px 2px',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? '800' : '600',
                        borderRadius: '5px',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                      }}
                    >
                      {isSelected && <Check size={10} style={{ strokeWidth: 3 }} />}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Math Badge */}
              <div style={{
                padding: '0.45rem 0.65rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  🧮 ₹{BASE_MONTHLY_RATE.toLocaleString('en-IN')} / mo × <strong style={{ color: 'var(--primary)' }}>{selectedMonths.length} Months</strong>
                </span>
                <span style={{ fontWeight: '800', color: '#10b981', fontSize: '0.9rem' }}>
                  = ₹{(BASE_MONTHLY_RATE * selectedMonths.length).toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                Choose Payment Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: paymentMethod === 'UPI' ? 'var(--bg-input)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <Smartphone size={20} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>UPI / Google Pay</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Instant 0% Fee • Instant PDF</div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'CARD' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: paymentMethod === 'CARD' ? 'var(--bg-input)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <CreditCard size={20} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Debit / Credit Card</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Visa, MasterCard</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#15803d' }}>
              <ShieldCheck size={15} />
              <span>256-Bit SSL Encrypted Simulated Bank Gateway • Official Tax Receipt</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button type="button" onClick={() => setSelectedFeeToPay(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '0.65rem 1.25rem' }}>
                <span>Confirm & Pay ₹{(BASE_MONTHLY_RATE * selectedMonths.length).toLocaleString('en-IN')}.00</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Official Reusable PDF Receipt Modal with Download & Share */}
      <FeeReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        isNewPayment={isNewPayment}
      />
    </div>
  );
};
