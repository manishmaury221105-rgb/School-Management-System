import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import {
  LayoutDashboard,
  CreditCard,
  BellRing,
  UserCheck,
  BookOpen,
  CalendarCheck,
  Clock,
  Wallet,
  School,
  Users,
  Award,
} from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { currentRole } = useAuth();

  const getNavItems = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'teachers', label: 'Faculty', icon: UserCheck },
          { id: 'classes', label: 'Classes', icon: School },
          { id: 'fees', label: 'Fees', icon: CreditCard },
        ];
      case ROLES.TEACHER:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: UserCheck },
          { id: 'timetable', label: 'Schedule', icon: Clock },
          { id: 'homework', label: 'Homework', icon: BookOpen },
        ];
      case ROLES.STUDENT:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'timetable', label: 'Schedule', icon: Clock },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'fees', label: 'Fees', icon: Wallet },
        ];
      case ROLES.PARENT:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'academics', label: 'Grades', icon: Award },
          { id: 'fees', label: 'Fees', icon: Wallet },
          { id: 'notices', label: 'Notices', icon: BellRing },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeTab === item.id ||
          ((item.id === 'teachers' || item.id === 'faculty') && (activeTab === 'teachers' || activeTab === 'faculty'));
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
