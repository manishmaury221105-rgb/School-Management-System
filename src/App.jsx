import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ROLES } from './data/mockData';
import { LoginView } from './components/auth/LoginView';
import { RoleGuard } from './components/auth/RoleGuard';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { DeviceFrame } from './components/common/DeviceFrame';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { FeeManagement } from './components/admin/FeeManagement';
import { NoticeBroadcast } from './components/admin/NoticeBroadcast';
import { TimetableManager } from './components/admin/TimetableManager';
import { SchoolSettings } from './components/admin/SchoolSettings';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AttendanceMarker } from './components/teacher/AttendanceMarker';
import { HomeworkManager } from './components/teacher/HomeworkManager';
import { GradebookManager } from './components/teacher/GradebookManager';
import { StudentPerformance } from './components/teacher/StudentPerformance';
import { TeacherNotices } from './components/teacher/TeacherNotices';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentHomework } from './components/student/StudentHomework';
import { StudentExams } from './components/student/StudentExams';
import { StudentFees } from './components/student/StudentFees';
import { StudentNotices } from './components/student/StudentNotices';

// Parent Components
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentAttendance } from './components/parent/ParentAttendance';
import { ParentAcademics } from './components/parent/ParentAcademics';
import { ParentHomework } from './components/parent/ParentHomework';
import { ParentFees } from './components/parent/ParentFees';
import { ParentLeaveApply } from './components/parent/ParentLeaveApply';
import { ParentNotices } from './components/parent/ParentNotices';

export const App = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'iphone' | 'android' | 'tablet'

  // Reset tab to dashboard when role changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentRole]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Render role-specific views with strict RBAC protection
  const renderRoleContent = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        switch (activeTab) {
          case 'dashboard':
            return <AdminDashboard setActiveTab={setActiveTab} />;
          case 'students':
            return <StudentManagement />;
          case 'teachers':
            return <TeacherManagement />;
          case 'classes':
            return <ClassManagement />;
          case 'fees':
            return <FeeManagement />;
          case 'notices':
            return <NoticeBroadcast />;
          case 'timetable':
            return <TimetableManager />;
          case 'settings':
            return <SchoolSettings />;
          default:
            return <AdminDashboard setActiveTab={setActiveTab} />;
        }

      case ROLES.TEACHER:
        switch (activeTab) {
          case 'dashboard':
            return <TeacherDashboard setActiveTab={setActiveTab} />;
          case 'attendance':
            return <AttendanceMarker />;
          case 'homework':
            return <HomeworkManager />;
          case 'gradebook':
            return <GradebookManager />;
          case 'performance':
            return <StudentPerformance />;
          case 'notices':
            return <TeacherNotices />;
          default:
            return <TeacherDashboard setActiveTab={setActiveTab} />;
        }

      case ROLES.STUDENT:
        switch (activeTab) {
          case 'dashboard':
            return <StudentDashboard setActiveTab={setActiveTab} />;
          case 'profile':
            return <StudentProfile />;
          case 'attendance':
            return <StudentAttendance />;
          case 'timetable':
            return <StudentTimetable />;
          case 'homework':
            return <StudentHomework />;
          case 'exams':
            return <StudentExams />;
          case 'fees':
            return <StudentFees />;
          case 'notices':
            return <StudentNotices />;
          default:
            return <StudentDashboard setActiveTab={setActiveTab} />;
        }

      case ROLES.PARENT:
        switch (activeTab) {
          case 'dashboard':
            return <ParentDashboard setActiveTab={setActiveTab} />;
          case 'attendance':
            return <ParentAttendance />;
          case 'academics':
            return <ParentAcademics />;
          case 'homework':
            return <ParentHomework />;
          case 'fees':
            return <ParentFees />;
          case 'leave':
            return <ParentLeaveApply />;
          case 'notices':
            return <ParentNotices />;
          default:
            return <ParentDashboard setActiveTab={setActiveTab} />;
        }

      default:
        return <LoginView />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <Navbar deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

      {/* Device Simulator Frame Wrap (iOS / Android / iPad / Desktop) */}
      <DeviceFrame deviceMode={deviceMode}>
        <div className="app-container">
          {/* Desktop & Tablet Sidebar */}
          {deviceMode === 'desktop' && (
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {/* Main Content Workspace */}
          <main className="main-content-area">
            <RoleGuard tabId={activeTab} onGoHome={() => setActiveTab('dashboard')}>
              {renderRoleContent()}
            </RoleGuard>
          </main>

          {/* Mobile Bottom Navigation (for mobile screens and phone preview frames) */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </DeviceFrame>
    </div>
  );
};

export default App;
