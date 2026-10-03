import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_PERMISSIONS } from '../../data/mockData';
import {
  LayoutDashboard,
  UserCheck,
  School,
  BookOpen,
  CreditCard,
  BellRing,
  Calendar,
  Settings,
  Award,
  TrendingUp,
  Clock,
  CalendarCheck,
  Wallet,
  FileText,
  ShieldCheck,
  LogOut,
  Book,
  Bus,
  FileSpreadsheet,
  UploadCloud,
  Layers,
  Users,
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const roleConfig = currentRole ? ROLE_PERMISSIONS[currentRole] : null;

  const getMenuItems = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        return [
          { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Directory', icon: Users },
          { id: 'teachers', label: 'Faculty & Staff (Onboarding)', icon: UserCheck },
          { id: 'classes', label: 'Classes & Sections', icon: School },
          { id: 'subjects', label: 'Subjects Master', icon: Layers },
          { id: 'timetable', label: 'Master Timetable', icon: Calendar },
          { id: 'fees', label: 'Fees & Invoicing', icon: CreditCard },
          { id: 'library', label: 'Library Catalog', icon: Book },
          { id: 'transport', label: 'Transport Logistics', icon: Bus },
          { id: 'events', label: 'School Events', icon: Calendar },
          { id: 'notices', label: 'Notice Circulars', icon: BellRing },
          { id: 'leave', label: 'Leave Approvals', icon: FileText },
          { id: 'reports', label: 'Audit & Reports', icon: FileSpreadsheet },
          { id: 'settings', label: 'School Settings', icon: Settings },
        ];
      case ROLES.TEACHER:
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students / Add Student', icon: Users },
          { id: 'attendance', label: 'Mark Attendance', icon: UserCheck },
          { id: 'timetable', label: 'My Timetable', icon: Clock },
          { id: 'homework', label: 'Homework & Tasks', icon: BookOpen },
          { id: 'study-material', label: 'Study Materials', icon: UploadCloud },
          { id: 'gradebook', label: 'Exam & Gradebook', icon: Award },
          { id: 'performance', label: 'Student Analytics', icon: TrendingUp },
          { id: 'notices', label: 'Class Notices', icon: BellRing },
          { id: 'leave', label: 'Leave Approvals', icon: FileText },
        ];
      case ROLES.STUDENT:
        return [
          { id: 'dashboard', label: 'Student Portal', icon: LayoutDashboard },
          { id: 'profile', label: 'Digital ID Card', icon: CreditCard },
          { id: 'teachers', label: 'Faculty & Teachers', icon: UserCheck },
          { id: 'attendance', label: 'Live Attendance', icon: CalendarCheck },
          { id: 'timetable', label: 'Class Timetable', icon: Clock },
          { id: 'homework', label: 'Homework & Tasks', icon: BookOpen },
          { id: 'study-material', label: 'Study Notes & PDF', icon: UploadCloud },
          { id: 'exams', label: 'Exams & Results', icon: Award },
          { id: 'fees', label: 'Fee Invoices & Pay', icon: Wallet },
          { id: 'events', label: 'School Events', icon: Calendar },
          { id: 'notices', label: 'Notice Board', icon: BellRing },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="desktop-sidebar">
      <div style={{ padding: '0 0.5rem 1rem 0.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.6rem 0.75rem',
          background: roleConfig?.bgLight || 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${roleConfig?.badgeColor || 'var(--border)'}33`
        }}>
          <ShieldCheck size={20} color={roleConfig?.badgeColor} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: roleConfig?.badgeColor }}>
              {currentRole} WORKSPACE
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Strict RBAC Enforced
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-section-title">Navigation Menu</div>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="sidebar-user-box">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
          alt={currentUser?.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {roleConfig?.title}
          </div>
        </div>
        <button
          onClick={logout}
          style={{ color: '#ef4444', padding: '4px' }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
