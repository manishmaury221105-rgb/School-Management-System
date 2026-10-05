import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ROLES } from './data/mockData';
import { LoginView } from './components/auth/LoginView';
import { RoleGuard } from './components/auth/RoleGuard';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { ParentManagement } from './components/admin/ParentManagement';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { SubjectManagement } from './components/admin/SubjectManagement';
import { FeeManagement } from './components/admin/FeeManagement';
import { NoticeBroadcast } from './components/admin/NoticeBroadcast';
import { TimetableManager } from './components/admin/TimetableManager';
import { StudyMaterialManager } from './components/admin/StudyMaterialManager';
import { LibraryManager } from './components/admin/LibraryManager';
import { TransportManager } from './components/admin/TransportManager';
import { EventManager } from './components/admin/EventManager';
import { LeaveManager } from './components/admin/LeaveManager';
import { ReportsCenter } from './components/admin/ReportsCenter';
import { SchoolSettings } from './components/admin/SchoolSettings';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherProfile } from './components/teacher/TeacherProfile';
import { AttendanceMarker } from './components/teacher/AttendanceMarker';
import { HomeworkManager } from './components/teacher/HomeworkManager';
import { GradebookManager } from './components/teacher/GradebookManager';
import { StudentPerformance } from './components/teacher/StudentPerformance';
import { TeacherNotices } from './components/teacher/TeacherNotices';
import { TeacherStudyMaterials } from './components/teacher/TeacherStudyMaterials';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentHomework } from './components/student/StudentHomework';
import { StudentExams } from './components/student/StudentExams';
import { StudentFees } from './components/student/StudentFees';
import { StudentNotices } from './components/student/StudentNotices';
import { StudentEvents } from './components/student/StudentEvents';

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

  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentRole]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderRoleContent = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        switch (activeTab) {
          case 'dashboard':
            return <AdminDashboard setActiveTab={setActiveTab} />;
          case 'students':
            return <StudentManagement setActiveTab={setActiveTab} />;
          case 'parents':
            return <ParentManagement />;
          case 'teachers':
          case 'faculty':
            return <TeacherManagement />;
          case 'classes':
            return <ClassManagement />;
          case 'subjects':
            return <SubjectManagement />;
          case 'timetable':
            return <TimetableManager />;
          case 'attendance':
            return <AttendanceMarker />;
          case 'fees':
            return <FeeManagement />;
          case 'study-material':
            return <StudyMaterialManager />;
          case 'library':
            return <LibraryManager />;
          case 'transport':
            return <TransportManager />;
          case 'events':
            return <EventManager />;
          case 'notices':
            return <NoticeBroadcast />;
          case 'leave':
            return <LeaveManager />;
          case 'reports':
            return <ReportsCenter />;
          case 'settings':
            return <SchoolSettings />;
          default:
            return <AdminDashboard setActiveTab={setActiveTab} />;
        }

      case ROLES.TEACHER:
        switch (activeTab) {
          case 'dashboard':
            return <TeacherDashboard setActiveTab={setActiveTab} />;
          case 'profile':
          case 'teachers':
          case 'faculty':
            return <TeacherProfile />;
          case 'students':
            return <StudentManagement setActiveTab={setActiveTab} />;
          case 'parents':
            return <ParentManagement />;
          case 'attendance':
            return <AttendanceMarker />;
          case 'timetable':
            return <TimetableManager />;
          case 'homework':
            return <HomeworkManager />;
          case 'study-material':
            return <TeacherStudyMaterials />;
          case 'gradebook':
            return <GradebookManager />;
          case 'performance':
            return <StudentPerformance />;
          case 'notices':
            return <TeacherNotices />;
          case 'leave':
            return <LeaveManager />;
          default:
            return <TeacherDashboard setActiveTab={setActiveTab} />;
        }

      case ROLES.STUDENT:
        switch (activeTab) {
          case 'dashboard':
            return <StudentDashboard setActiveTab={setActiveTab} />;
          case 'teachers':
          case 'faculty':
            return <TeacherManagement />;
          case 'profile':
            return <StudentProfile />;
          case 'attendance':
            return <StudentAttendance />;
          case 'timetable':
            return <StudentTimetable />;
          case 'homework':
            return <StudentHomework />;
          case 'study-material':
            return <StudentStudyMaterial />;
          case 'exams':
            return <StudentExams />;
          case 'fees':
            return <StudentFees />;
          case 'events':
            return <StudentEvents />;
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
          case 'teachers':
          case 'faculty':
            return <TeacherManagement />;
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
      <Navbar />

      <div className="app-container">
        {/* Desktop & Tablet Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Workspace */}
        <main className="main-content-area">
          <RoleGuard tabId={activeTab} onGoHome={() => setActiveTab('dashboard')}>
            {renderRoleContent()}
          </RoleGuard>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
