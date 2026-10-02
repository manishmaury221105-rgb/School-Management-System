import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock,
  Receipt,
  Download,
  Smartphone,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const StudentFees = () => {
  const { currentUser } = useAuth();
  const { fees, payFee } = useSchoolData();
  const [selectedFeeToPay, setSelectedFeeToPay] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

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

    const feeItem = selectedFeeToPay;
    const res = payFee(selectedFeeToPay.id, paymentMethod === 'UPI' ? 'Instant UPI (rohan@okhdfc)' : 'Credit Card (**** 4242)', selectedFeeToPay);
    setSelectedFeeToPay(null);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti', err);
    }

    // Open receipt modal immediately
    setSelectedReceipt({
      ...feeItem,
      status: 'Paid',
      receiptNo: res.receiptNo,
      paidDate: res.paidDate,
      paymentMethod: paymentMethod === 'UPI' ? 'Instant UPI (rohan@okhdfc)' : 'Credit Card (**** 4242)',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Fee Ledger & Online Payments</h1>
          <p className="page-subtitle">
            Quarterly tuition schedules, lab development funds, instant digital checkout & receipts.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL FEES SETTLED</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
            ₹{totalPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
            ✓ Verified Institutional Receipts
          </div>
        </div>

        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>OUTSTANDING BALANCE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
            ₹{totalPending.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: totalPending > 0 ? '#b91c1c' : '#10b981', fontWeight: '700', marginTop: '4px' }}>
            {totalPending > 0 ? 'Due by October 15, 2026' : 'No Overdue Dues'}
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
              {myFees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{fee.feeType}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.class}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      ₹{fee.amount}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: fee.status === 'Pending' ? '#b91c1c' : 'var(--text-muted)', fontWeight: '600' }}>
                      {fee.dueDate}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${fee.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
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
                    {fee.status === 'Pending' ? (
                      <button
                        onClick={() => setSelectedFeeToPay(fee)}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        <CreditCard size={14} />
                        <span>Pay Online</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceipt(fee)}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        <Receipt size={14} />
                        <span>View Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
          <form onSubmit={handleExecutePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              padding: '1.25rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--primary)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>INVOICE ITEM</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedFeeToPay.feeType}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <span style={{ fontWeight: '700' }}>Payable Amount:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                  ₹{selectedFeeToPay.amount}.00
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
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: paymentMethod === 'UPI' ? 'var(--bg-input)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <Smartphone size={22} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>UPI / Google Pay</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Instant 0% Fee</div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'CARD' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: paymentMethod === 'CARD' ? 'var(--bg-input)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <CreditCard size={22} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Debit / Credit Card</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Visa, MasterCard</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#15803d' }}>
              <ShieldCheck size={16} />
              <span>256-Bit SSL Encrypted Simulated Bank Gateway</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setSelectedFeeToPay(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <span>Confirm & Pay ₹{selectedFeeToPay.amount}.00</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Official Printable Fee Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Digital Fee Payment Receipt"
        >
          <div className="receipt-sheet">
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>ST. XAVIER ACADEMY</h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>450 University Blvd • Tax ID: EX-992019</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#4f46e5', marginTop: '6px' }}>
                RECEIPT NO: {selectedReceipt.receiptNo || 'REC-2026-1180'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div><strong>Student Name:</strong> {selectedReceipt.studentName || currentUser?.name}</div>
              <div><strong>Class:</strong> {selectedReceipt.class || currentUser?.class}</div>
              <div><strong>Settlement Date:</strong> {selectedReceipt.paidDate || '2026-10-02'}</div>
              <div><strong>Payment Mode:</strong> {selectedReceipt.paymentMethod || 'Online'}</div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.75rem 0', margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem' }}>
                <span>{selectedReceipt.feeType}</span>
                <span>₹{selectedReceipt.amount}.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800' }}>
              <span>Total Amount Settled:</span>
              <span style={{ color: '#15803d' }}>₹{selectedReceipt.amount}.00</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#15803d', fontWeight: '700' }}>
              ✓ Status: PAID IN FULL • Computer Generated Official Receipt
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className="btn-primary">
                <Download size={15} />
                <span>Download / Print Receipt</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
