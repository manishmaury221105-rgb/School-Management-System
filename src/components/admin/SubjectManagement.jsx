import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { BookOpen, Plus, Trash2, Search, UserCheck, School, Award } from 'lucide-react';

export const SubjectManagement = () => {
  const { subjects, addSubject, deleteSubject, classes, teachers } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    class: 'Class 10-A',
    teacher: 'Mrs. Sarah Jenkins',
    maxMarks: 100,
    passingMarks: 35,
  });

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    addSubject(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      class: 'Class 10-A',
      teacher: 'Mrs. Sarah Jenkins',
      maxMarks: 100,
      passingMarks: 35,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Subject & Curriculum Master</h1>
          <p className="page-subtitle">
            Configure academic courses, subject codes, faculty assignments, maximum marks & passing criteria.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search subjects by name, code, class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {filteredSubjects.length} Active Courses
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Class / Grade</th>
                <th>Assigned Teacher</th>
                <th>Max Marks</th>
                <th>Pass Marks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{sub.name}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)', background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>
                      {sub.code}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{sub.class}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserCheck size={14} color="var(--primary)" />
                      <span>{sub.teacher}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700' }}>{sub.maxMarks}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#15803d' }}>{sub.passingMarks}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="icon-btn"
                      style={{ color: '#ef4444' }}
                      title="Delete Subject"
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

      {/* Add Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Academic Subject"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Subject Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Chemistry & Lab"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Subject Code *
              </label>
              <input
                type="text"
                required
                placeholder="CHEM-103"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Class Allocation
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                style={{ width: '100%' }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Assigned Faculty Member
            </label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              style={{ width: '100%' }}
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Maximum Marks
              </label>
              <input
                type="number"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Passing Marks
              </label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
