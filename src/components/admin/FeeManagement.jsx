import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { FeeCollectionModal } from './FeeCollectionModal';
import {
  downloadReceiptPdf,
  printReceiptPdf,
  shareReceiptPdf,
} from '../../utils/pdfReceiptGenerator';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  Filter,
  Receipt,
  Download,
  Printer,
  Check,
  Plus,
} from 'lucide-react';

export const FeeManagement = () => {
  const { fees, payFee } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  const totalCollected = fees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPending = fees
    .filter(f => f.status === 'Pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.receiptNo && f.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleManualMarkPaid = (feeId) => {
    const res = payFee(feeId, 'Admin Manual / Cash Counter');
    const fee = fees.find(f => f.id === feeId);
    if (fee) {
      setSelectedReceipt({
        ...fee,
        status: 'Paid',
        receiptNo: res.receiptNo,
        paidDate: res.paidDate,
        paymentMethod: 'Admin Manual / Cash Counter',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Fee & Revenue Governance</h1>
          <p className="page-subtitle">
            Track tuition fee payments, overdue accounts, issue receipts and reconcile collections.
          </p>
        </div>
        <button onClick={() => setIsCollectModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Collect Fee / New Payment</span>
        </button>
      </div>

      <div className="stats-grid-4">
        <StatCard
          label="Total Collected Revenue"
          value={`₹${totalCollected.toLocaleString()}`}
          icon={CheckCircle2}
          trend={`${fees.filter(f => f.status === 'Paid').length} Paid Invoices`}
          trendPositive={totalCollected > 0}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
        <StatCard
          label="Pending Outstanding Dues"
          value={`₹${totalPending.toLocaleString()}`}
          icon={Clock}
          trend={`${fees.filter(f => f.status === 'Pending').length} Pending Invoices`}
          trendPositive={false}
          accentColor="#ef4444"
          lightBg="#fef2f2"
        />
        <StatCard
          label="On-Time Settlement Rate"
          value="93.4%"
          icon={CreditCard}
          trend="Target > 90%"
          trendPositive={true}
          accentColor="#4f46e5"
          lightBg="#e0e7ff"
        />
        <StatCard
          label="Payment Gateway Uptime"
          value="99.9%"
          icon={IndianRupee}
          subText="UPI, Stripe, NetBanking"
          accentColor="#0ea5e9"
          lightBg="#e0f2fe"
        />
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
            <div className="table-search-input">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by student, invoice or receipt ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="Paid">Settled (Paid)</option>
                <option value="Pending">Unpaid (Pending)</option>
              </select>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filteredFees.length} Invoices Found
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Particulars</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Mode</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{fee.studentName}</div>
                  </td>
                  <td>{fee.class}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{fee.feeType}</div>
                    {fee.receiptNo && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {fee.receiptNo}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', fontSize: '1rem' }}>₹{fee.amount}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: fee.status === 'Pending' ? '#b91c1c' : 'var(--text-muted)' }}>
                      {fee.dueDate}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${fee.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {fee.paymentMethod || '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {fee.status === 'Pending' ? (
                      <button
                        onClick={() => handleManualMarkPaid(fee.id)}
                        className="btn-success"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        <Check size={14} />
                        <span>Mark Paid</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceipt(fee)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
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

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Fee Receipt"
        >
          <div className="receipt-sheet">
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>ST. XAVIER ACADEMY</h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Affiliated to CBSE / State Board • ISO 9001:2015</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '6px' }}>
                RECEIPT NO: {selectedReceipt.receiptNo || 'REC-2026-9901'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div><strong>Student:</strong> {selectedReceipt.studentName}</div>
              <div><strong>Class:</strong> {selectedReceipt.class}</div>
              <div><strong>Payment Date:</strong> {selectedReceipt.paidDate || '2026-10-02'}</div>
              <div><strong>Method:</strong> {selectedReceipt.paymentMethod || 'Online Transfer'}</div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.75rem 0', margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem' }}>
                <span>{selectedReceipt.feeType}</span>
                <span>₹{selectedReceipt.amount}.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.5rem' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#15803d' }}>₹{selectedReceipt.amount}.00</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              ✓ Status: PAID IN FULL • Computer Generated Digital Receipt
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => printReceiptPdf(selectedReceipt)}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.65rem 1rem' }}
              >
                <Printer size={16} />
                <span>Print PDF</span>
              </button>
              <button
                onClick={() => downloadReceiptPdf(selectedReceipt)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.65rem 1rem' }}
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Fee Collection Form Modal */}
      <FeeCollectionModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
      />
    </div>
  );
};
