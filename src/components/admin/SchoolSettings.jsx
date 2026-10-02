import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Settings, RefreshCw, Shield, School, Save, Check } from 'lucide-react';

export const SchoolSettings = () => {
  const { resetAllData } = useSchoolData();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'St. Xavier International Academy',
    affiliationNo: 'CBSE-9938120',
    academicYear: '2026 - 2027',
    term: 'Term 1 (Mid-Semester)',
    principalName: 'Dr. Arthur Vance',
    contactEmail: 'administration@edusphere.edu',
    contactPhone: '+1 (555) 100-2000',
    address: '450 University Boulevard, Education City, CA 94016',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">Institution & System Settings</h1>
          <p className="page-subtitle">
            Configure school profile, academic calendar term, and administrative controls.
          </p>
        </div>
      </div>

      <div className="card-elevated" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <School size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>School Profile Information</h3>
        </div>

        {savedSuccess && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#dcfce7',
            color: '#15803d',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
          }}>
            <Check size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Institution / School Name
            </label>
            <input
              type="text"
              value={schoolInfo.name}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Academic Session
              </label>
              <input
                type="text"
                value={schoolInfo.academicYear}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, academicYear: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Active Term
              </label>
              <input
                type="text"
                value={schoolInfo.term}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, term: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Principal / Director
              </label>
              <input
                type="text"
                value={schoolInfo.principalName}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, principalName: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                Affiliation Code
              </label>
              <input
                type="text"
                value={schoolInfo.affiliationNo}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, affiliationNo: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Campus Address
            </label>
            <input
              type="text"
              value={schoolInfo.address}
              onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Seed Data Reset Action */}
      <div className="card-elevated" style={{ padding: '1.5rem', border: '1px solid #fee2e2', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <RefreshCw size={20} color="#ef4444" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b91c1c' }}>Reset Demo Database</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
          Restore all seed records (students, faculty, attendance, test scores, homework, and fee invoices) back to their fresh default state.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to default factory state?')) {
              resetAllData();
            }
          }}
          className="btn-secondary"
          style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
        >
          <RefreshCw size={15} />
          <span>Reset All Mock Data</span>
        </button>
      </div>
    </div>
  );
};
