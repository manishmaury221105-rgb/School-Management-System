// EduSphere 360 - Enterprise School Management System
// Clean Schema & Relational Data Models

export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
};

export const ROLE_PERMISSIONS = {
  ADMIN: {
    title: 'School Administrator',
    badgeColor: '#EF4444',
    bgLight: '#FEF2F2',
    description: 'Full institutional control, faculty onboarding, finances, academics & global governance.',
    allowedTabs: [
      'dashboard',
      'students',
      'parents',
      'teachers',
      'classes',
      'subjects',
      'timetable',
      'attendance',
      'fees',
      'exams',
      'homework',
      'study-material',
      'notices',
      'events',
      'leave',
      'library',
      'transport',
      'reports',
      'settings',
    ],
  },
  TEACHER: {
    title: 'Faculty Member',
    badgeColor: '#3B82F6',
    bgLight: '#EFF6FF',
    description: 'Assigned classrooms, student onboarding & admissions, daily attendance, homework grading & exam marks.',
    allowedTabs: [
      'dashboard',
      'students',
      'parents',
      'attendance',
      'timetable',
      'homework',
      'study-material',
      'gradebook',
      'performance',
      'notices',
      'leave',
      'profile',
    ],
  },
  STUDENT: {
    title: 'Enrolled Student',
    badgeColor: '#10B981',
    bgLight: '#ECFDF5',
    description: 'Digital ID pass, subject-wise attendance, timetable, homework submission, exam marksheet, fees checkout & study notes.',
    allowedTabs: [
      'dashboard',
      'teachers',
      'faculty',
      'profile',
      'attendance',
      'timetable',
      'homework',
      'study-material',
      'exams',
      'fees',
      'notices',
      'events',
      'library',
    ],
  },
  PARENT: {
    title: 'Guardian / Parent',
    badgeColor: '#8B5CF6',
    bgLight: '#F5F3FF',
    description: 'Multi-child monitoring, attendance alerts, homework oversight, report card marks, online fee payment & leave apply.',
    allowedTabs: [
      'dashboard',
      'teachers',
      'faculty',
      'attendance',
      'academics',
      'homework',
      'fees',
      'leave',
      'notices',
      'events',
    ],
  },
};

export const INITIAL_USERS = [
  {
    id: 'user-admin-1',
    role: ROLES.ADMIN,
    name: 'School Administrator',
    email: 'admin@school.com',
    phone: '9876543210',
    dob: '1980-01-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Principal & Managing Director',
    schoolName: 'School Management System',
  },
  {
    id: 'user-teacher-default',
    role: ROLES.TEACHER,
    name: 'Faculty Teacher',
    email: 'teacher@school.com',
    phone: '9876543211',
    dob: '1990-01-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subject: 'General Faculty',
    assignedClasses: ['Class 10-A'],
    classTeacherOf: 'Class 10-A',
    qualification: 'M.Ed / B.Ed',
    roomNo: 'Staff Room 1',
    salary: 50000,
  },
  {
    id: 'user-student-default',
    role: ROLES.STUDENT,
    studentId: 'STU-2026-0001',
    admissionNo: 'ADM-2026-0001',
    name: 'Student User',
    email: 'student@school.com',
    phone: '9876543212',
    dob: '2010-01-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '01',
    gender: 'Male',
    bloodGroup: 'O+',
    parentId: 'parent-1',
    parentName: 'Guardian',
    parentContact: '9876543213',
    emergencyContact: '9876543210',
    address: 'School Residential Campus',
    admissionYear: '2026',
    house: 'Ruby Phoenix',
    status: 'Active',
  },
  {
    id: 'user-parent-default',
    role: ROLES.PARENT,
    name: 'Parent / Guardian',
    email: 'parent@school.com',
    phone: '9876543213',
    dob: '1985-01-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    occupation: 'Parent',
    relationship: 'Guardian',
    childrenIds: ['user-student-default'],
    address: 'School Residential Campus',
  },
];

export const INITIAL_CLASSES = [
  { id: 'c-nursery', name: 'Nursery', grade: 0, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 101', studentCount: 0, maxCapacity: 25 },
  { id: 'c-lkg', name: 'LKG', grade: 0, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 102', studentCount: 0, maxCapacity: 25 },
  { id: 'c-ukg', name: 'UKG', grade: 0, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 103', studentCount: 0, maxCapacity: 25 },
  { id: 'c-1a', name: 'Class 1-A', grade: 1, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 104', studentCount: 0, maxCapacity: 30 },
  { id: 'c-2a', name: 'Class 2-A', grade: 2, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 105', studentCount: 0, maxCapacity: 30 },
  { id: 'c-3a', name: 'Class 3-A', grade: 3, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 106', studentCount: 0, maxCapacity: 30 },
  { id: 'c-4a', name: 'Class 4-A', grade: 4, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 107', studentCount: 0, maxCapacity: 30 },
  { id: 'c-5a', name: 'Class 5-A', grade: 5, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 108', studentCount: 0, maxCapacity: 30 },
  { id: 'c-6a', name: 'Class 6-A', grade: 6, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 201', studentCount: 0, maxCapacity: 35 },
  { id: 'c-7a', name: 'Class 7-A', grade: 7, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 202', studentCount: 0, maxCapacity: 35 },
  { id: 'c-8a', name: 'Class 8-A', grade: 8, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 203', studentCount: 0, maxCapacity: 35 },
  { id: 'c-9a', name: 'Class 9-A', grade: 9, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 301', studentCount: 0, maxCapacity: 35 },
  { id: 'c-10a', name: 'Class 10-A', grade: 10, section: 'A', classTeacher: 'Unassigned', roomNo: 'Room 302', studentCount: 0, maxCapacity: 35 },
  { id: 'c-11s', name: 'Class 11-Science', grade: 11, section: 'Sci', classTeacher: 'Unassigned', roomNo: 'Room 401', studentCount: 0, maxCapacity: 40 },
  { id: 'c-12s', name: 'Class 12-Science', grade: 12, section: 'Sci', classTeacher: 'Unassigned', roomNo: 'Room 402', studentCount: 0, maxCapacity: 40 },
];

export const INITIAL_SUBJECTS = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH-101', class: 'Class 10-A', teacher: 'Unassigned', maxMarks: 100, passingMarks: 35 },
  { id: 'sub-2', name: 'Science', code: 'SCI-102', class: 'Class 10-A', teacher: 'Unassigned', maxMarks: 100, passingMarks: 35 },
  { id: 'sub-3', name: 'English', code: 'ENG-103', class: 'Class 10-A', teacher: 'Unassigned', maxMarks: 100, passingMarks: 35 },
  { id: 'sub-4', name: 'Social Studies', code: 'SST-104', class: 'Class 10-A', teacher: 'Unassigned', maxMarks: 100, passingMarks: 35 },
  { id: 'sub-5', name: 'Computer Science', code: 'CS-105', class: 'Class 10-A', teacher: 'Unassigned', maxMarks: 100, passingMarks: 40 },
];

export const INITIAL_PARENTS_DIRECTORY = [];
export const INITIAL_STUDENTS_DIRECTORY = [];
export const INITIAL_TEACHERS = [];
export const INITIAL_STUDY_MATERIALS = [];
export const INITIAL_LIBRARY_BOOKS = [];
export const INITIAL_LIBRARY_TRANSACTIONS = [];
export const INITIAL_TRANSPORT_ROUTES = [];
export const INITIAL_EVENTS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_ATTENDANCE_RECORDS = {};
export const INITIAL_HOMEWORK = [];
export const INITIAL_TIMETABLE = {};
export const INITIAL_EXAMS_AND_RESULTS = {
  exams: [],
  results: {},
};
export const INITIAL_FEES = [];
export const INITIAL_NOTICES = [];
export const INITIAL_LEAVE_REQUESTS = [];
