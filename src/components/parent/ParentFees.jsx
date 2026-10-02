import React, { useState } from 'react';
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
} from 'lucide-react';

export const ParentFees = () => {
  const { students, fees, payFee, selectedChildId } = useSchoolData();
  const [selectedFeeToPay, setSelectedFeeToPay] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const child = students.find(s => s.id === selectedChildId) || students[0];
  const childFees = fees.filter(f => f.studentId === child?.id);

  const totalPaid = childFees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPending = childFees
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const handlePay = (e) => {
    e.preventDefault();
    if (!selectedFeeToPay) return;

    const res = payFee(selectedFeeToPay.id, paymentMethod === 'UPI' ? 'Parent UPI (anita@upi)' : 'Credit Card (**** 4242)');
    const feeItem = selectedFeeToPay;
    setSelectedFeeToPay(null);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti', err);
    }

    setSelectedReceipt({
      ...feeItem,
      status: 'Paid',
      receiptNo: res.receiptNo,
      paidDate: res.paidDate,
      paymentMethod: paymentMethod === 'UPI' ? 'Parent UPI (anita@upi)' : 'Credit Card (**** 4242)',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Pay Fees for {child?.name}</h1>
          <p className="page-subtitle">
            Direct institutional fee settlement, quarterly invoices & instant downloadable receipts.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>FEES PAID (TERM 1)</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
            ₹{totalPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
            ✓ Verified Official Receipts
          </div>
        </div>

        <div className="card-elevated" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>OUTSTANDING DUES</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
            ₹{totalPending.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: totalPending > 0 ? '#b91c1c' : '#10b981', fontWeight: '700', marginTop: '4px' }}>
            {totalPending > 0 ? 'Due by October 15, 2026' : 'All Clear'}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Fee Schedule for {child?.name}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class: {child?.class}</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Receipt / Mode</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {childFees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{fee.feeType}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>₹{fee.amount}</span>
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
                        <span>Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {selectedFeeToPay && (
        <Modal
          isOpen={!!selectedFeeToPay}
          onClose={() => setSelectedFeeToPay(null)}
          title={`Pay Tuition Fee for ${child?.name}`}
        >
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              padding: '1.25rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--primary)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>STUDENT & ITEM</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '2px' }}>
                {child?.name} ({child?.class}) — {selectedFeeToPay.feeType}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <span style={{ fontWeight: '700' }}>Amount:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                  ₹{selectedFeeToPay.amount}.00
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                Payment Method
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
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>0% Surcharge</div>
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
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Instant Clearance</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setSelectedFeeToPay(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <span>Authorize & Pay ₹{selectedFeeToPay.amount}.00</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Digital Fee Payment Receipt"
        >
          <div className="receipt-sheet">
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>ST. XAVIER ACADEMY</h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>450 University Blvd • School Code: SXA-1029</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#4f46e5', marginTop: '6px' }}>
                RECEIPT NO: {selectedReceipt.receiptNo}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div><strong>Student:</strong> {child?.name}</div>
              <div><strong>Class:</strong> {child?.class}</div>
              <div><strong>Date:</strong> {selectedReceipt.paidDate}</div>
              <div><strong>Mode:</strong> {selectedReceipt.paymentMethod}</div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.75rem 0', margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem' }}>
                <span>{selectedReceipt.feeType}</span>
                <span>₹{selectedReceipt.amount}.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800' }}>
              <span>Total Settled:</span>
              <span style={{ color: '#15803d' }}>₹{selectedReceipt.amount}.00</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#15803d', fontWeight: '700' }}>
              ✓ Status: PAID IN FULL • Computer Generated Digital Receipt
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className="btn-primary">
                <Download size={15} />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
