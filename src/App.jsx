import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GradesPage from './pages/GradesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StaffManagementPage from './pages/StaffManagementPage';
import AcademicSetupPage from './pages/AcademicSetupPage';
import ScheduleBuilderPage from './pages/ScheduleBuilderPage';
import ScheduleViewPage from './pages/ScheduleViewPage';
import ReportsPage from './pages/ReportsPage';
import AttendancePage from './pages/AttendancePage';
import RectorAttendanceReportsPage from './pages/RectorAttendanceReportsPage';
import CourseStudioPage from './pages/CourseStudioPage';
import StudentAssignmentsPage from './pages/StudentAssignmentsPage';
import SchoolCrestPage from './pages/SchoolCrestPage';
import HandbookManagementPage from './pages/HandbookManagementPage';
import HandbookViewPage from './pages/HandbookViewPage';
import HierarchyTreePage from './pages/HierarchyTreePage';
import StudentTaskUploadPage from './pages/StudentTaskUploadPage';
import TeacherTaskMailPage from './pages/TeacherTaskMailPage';
import StudentGradedTasksPage from './pages/StudentGradedTasksPage';
import StudentEvaluationsPage from './pages/StudentEvaluationsPage';
import TeacherEvaluationsPage from './pages/TeacherEvaluationsPage';
import SocialSchoolPage from './pages/SocialSchoolPage';
import SchoolChatPage from './pages/SchoolChatPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightCalendarDrawer from './components/RightCalendarDrawer';
import SubjectDetailModal from './components/SubjectDetailModal';

function MainContent() {
  const { activeTab } = useAuth();

  switch (activeTab) {
    case 'evaluaciones':
      return <StudentEvaluationsPage />;
    case 'teacher-evaluations':
      return <TeacherEvaluationsPage />;
    case 'social-school':
      return <SocialSchoolPage />;
    case 'chat':
      return <SchoolChatPage />;
    case 'teacher-panel':
      return <TeacherDashboard />;
    case 'course-studio':
      return <CourseStudioPage />;
    case 'task-mail':
      return <TeacherTaskMailPage />;
    case 'submit-task':
      return <StudentTaskUploadPage />;
    case 'graded-tasks':
      return <StudentGradedTasksPage />;
    case 'school-crest':
      return <SchoolCrestPage />;
    case 'handbook-management':
      return <HandbookManagementPage />;
    case 'convivencia':
      return <HandbookViewPage />;
    case 'hierarchy':
      return <HierarchyTreePage />;
    case 'assignments':
      return <StudentAssignmentsPage />;
    case 'attendance':
      return <AttendancePage />;
    case 'rector-attendance-reports':
      return <RectorAttendanceReportsPage />;
    case 'staff-management':
      return <StaffManagementPage />;
    case 'academic-setup':
      return <AcademicSetupPage />;
    case 'schedule-builder':
      return <ScheduleBuilderPage />;
    case 'schedule-view':
      return <ScheduleViewPage />;
    case 'reports':
      return <ReportsPage />;
    case 'grades':
      return <GradesPage />;
    case 'settings':
      return <SettingsPage />;
    case 'help':
      return <HelpPage />;
    case 'profile':
      return <ProfilePage />;
    case 'subjects':
    default:
      return <DashboardPage />;
  }
}

function MainApp() {
  const { isAuthenticated, selectedSubject, setSelectedSubject } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background relative flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1 relative w-full">
        <Sidebar />
        <MainContent />
        <RightCalendarDrawer />
      </div>
      <SubjectDetailModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
