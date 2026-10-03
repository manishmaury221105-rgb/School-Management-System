import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StatCard } from '../common/StatCard';
import { FeeReceiptModal } from '../common/FeeReceiptModal';
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
  Share2,
} from 'lucide-react';

export const FeeManagement = () => {
  const { fees, payFee } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isNewPayment, setIsNewPayment] = useState(false);
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
      const rec = {
        ...fee,
        status: 'Paid',
        receiptNo: res.receiptNo,
        paidDate: res.paidDate,
        paymentMethod: 'Admin Manual / Cash Counter',
      };
      setIsNewPayment(true);
      setSelectedReceipt(rec);
    }
  };

  const handleOpenReceipt = (fee) => {
    setIsNewPayment(false);
    setSelectedReceipt(fee);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Fee & Revenue Governance</h1>
          <p className="page-subtitle">
            Track tuition fee payments, overdue accounts, issue receipts, download PDFs and share with students/parents.
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
          value={`₹${totalCollected.toLocaleString('en-IN')}`}
          icon={CheckCircle2}
          trend={`${fees.filter(f => f.status === 'Paid').length} Paid Invoices`}
          trendPositive={totalCollected > 0}
          accentColor="#10b981"
          lightBg="#ecfdf5"
        />
        <StatCard
          label="Pending Outstanding Dues"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
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
              {filteredFees.map((fee) => {
                const isPaid = fee.status === 'Paid';
                return (
                  <tr key={fee.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{fee.studentName}</div>
                      {fee.rollNo && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Roll #{fee.rollNo}</div>
                      )}
                    </td>
                    <td>{fee.class}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{fee.feeType}</div>
                      {fee.receiptNo ? (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontFamily: 'monospace' }}>
                          {fee.receiptNo}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {fee.feeMonth || 'Term 1'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', fontSize: '1rem' }}>₹{Number(fee.amount || 0).toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: fee.status === 'Pending' ? '#b91c1c' : 'var(--text-muted)' }}>
                        {fee.dueDate}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${isPaid ? 'badge-paid' : 'badge-pending'}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {fee.paymentMethod || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isPaid ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(fee)}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="View Official Receipt"
                          >
                            <Receipt size={14} />
                            <span>Receipt</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadReceiptPdf(fee)}
                            className="icon-btn"
                            style={{ width: '30px', height: '30px', borderRadius: '6px' }}
                            title="Direct Download PDF"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => shareReceiptPdf(fee)}
                            className="icon-btn"
                            style={{ width: '30px', height: '30px', borderRadius: '6px' }}
                            title="Share PDF Receipt"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleManualMarkPaid(fee.id)}
                          className="btn-success"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          <Check size={14} />
                          <span>Mark Paid</span>
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

      {/* Official PDF Receipt Modal */}
      <FeeReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        isNewPayment={isNewPayment}
      />

      {/* Fee Collection Form Modal */}
      <FeeCollectionModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
      />
    </div>
  );
};
