import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { Book, Plus, Trash2, Search, ArrowRightLeft, Check, CheckCircle2, Clock, Bookmark } from 'lucide-react';

export const LibraryManager = () => {
  const { books, addBook, deleteBook, libraryTransactions, issueBook, returnBook, students } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog' | 'issued'
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Mathematics',
    quantity: 10,
    rackNumber: 'Rack M-01',
  });

  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentId: '',
  });

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) return;
    addBook(bookForm);
    setIsAddBookModalOpen(false);
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      category: 'Mathematics',
      quantity: 10,
      rackNumber: 'Rack M-01',
    });
  };

  const handleIssueBookSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === issueForm.studentId);
    if (!issueForm.bookId || !student) return;
    issueBook(issueForm.bookId, student.id, `${student.name} (${student.class})`);
    setIsIssueModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Library Management System</h1>
          <p className="page-subtitle">
            Book repository inventory, circulation desk, lending records & return tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={activeSubTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}
          >
            <Book size={16} />
            <span>Book Catalog ({books.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('issued')}
            className={activeSubTab === 'issued' ? 'btn-primary' : 'btn-secondary'}
          >
            <ArrowRightLeft size={16} />
            <span>Circulation & Issued ({libraryTransactions.filter(t => t.status === 'ISSUED').length})</span>
          </button>
          <button onClick={() => setIsAddBookModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'catalog' ? (
        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-search-input">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search books by title, author, category, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="btn-secondary"
              style={{ color: 'var(--primary)', fontWeight: '700' }}
            >
              <ArrowRightLeft size={15} />
              <span>Issue Book to Student</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title & ID</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Rack Location</th>
                  <th>Available / Total</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div style={{ fontWeight: '800' }}>{book.title}</div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                        {book.bookId}
                      </span>
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-input)', fontWeight: '600' }}>
                        {book.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {book.isbn || '—'}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {book.rackNumber || 'General'}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: '800',
                        color: book.availableCopies > 0 ? '#15803d' : '#b91c1c',
                      }}>
                        {book.availableCopies} <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>/ {book.quantity} Copies</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="icon-btn"
                        style={{ color: '#ef4444' }}
                        title="Delete Book"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Issued Books Register */
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Active Book Lending Register</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>14-Day Lending Policy</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Issued To Student</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {libraryTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{tx.bookTitle}</div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--primary)' }}>{tx.bookId}</span>
                    </td>
                    <td>{tx.studentName}</td>
                    <td>{tx.issueDate}</td>
                    <td style={{ color: tx.status === 'ISSUED' ? '#b91c1c' : 'var(--text-muted)', fontWeight: '600' }}>
                      {tx.dueDate}
                    </td>
                    <td>{tx.returnDate || '—'}</td>
                    <td>
                      <span className={`badge-status ${tx.status === 'RETURNED' ? 'badge-paid' : 'badge-pending'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {tx.status === 'ISSUED' && (
                        <button
                          onClick={() => returnBook(tx.id)}
                          className="btn-success"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          <Check size={14} />
                          <span>Mark Returned</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        title="Add Book to Library Inventory"
      >
        <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Book Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modern Operating Systems (4th Edition)"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Author *
              </label>
              <input
                type="text"
                required
                placeholder="Andrew S. Tanenbaum"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Literature">Literature</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                ISBN Number
              </label>
              <input
                type="text"
                placeholder="978-0133591620"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Total Copies
              </label>
              <input
                type="number"
                value={bookForm.quantity}
                onChange={(e) => setBookForm({ ...bookForm, quantity: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Rack No.
              </label>
              <input
                type="text"
                value={bookForm.rackNumber}
                onChange={(e) => setBookForm({ ...bookForm, rackNumber: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsAddBookModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add to Catalog
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Student"
      >
        <form onSubmit={handleIssueBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Select Available Book *
            </label>
            <select
              required
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
              style={{ width: '100%', fontWeight: '600' }}
            >
              <option value="">-- Choose Book --</option>
              {books.filter(b => b.availableCopies > 0).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Select Student *
            </label>
            <select
              required
              value={issueForm.studentId}
              onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
              style={{ width: '100%', fontWeight: '600' }}
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class} • Roll #{s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsIssueModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Authorize Lending
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
