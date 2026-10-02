import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BellRing,
  UserCheck,
  BookOpen,
  Award,
  CalendarCheck,
  Clock,
  Wallet,
  FileText,
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
          { id: 'fees', label: 'Fees', icon: CreditCard },
          { id: 'notices', label: 'Notices', icon: BellRing },
        ];
      case ROLES.TEACHER:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: UserCheck },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'gradebook', label: 'Grades', icon: Award },
          { id: 'notices', label: 'Notices', icon: BellRing },
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
          { id: 'dashboard', label: 'Child 360', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'academics', label: 'Report Card', icon: Award },
          { id: 'fees', label: 'Pay Fees', icon: CreditCard },
          { id: 'leave', label: 'Leave', icon: FileText },
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
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
