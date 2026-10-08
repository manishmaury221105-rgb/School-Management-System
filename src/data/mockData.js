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
      'attendance',
      'fees',
      'exams',
      'homework',
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
      'gradebook',
      'notices',
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
      'exams',
      'fees',
      'notices',
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

export const INITIAL_PARENTS_DIRECTORY = [
  {
    id: 'parent-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '9876543213',
    childrenIds: ['user-student-default'],
    address: 'B-14, Shanti Nagar, New Delhi',
  },
  {
    id: 'parent-2',
    name: 'Sanjay Patel',
    email: 'sanjay.p@gmail.com',
    phone: '9876543221',
    childrenIds: ['stu-2'],
    address: '42 Lotus Colony, Green Park',
  },
  {
    id: 'parent-3',
    name: 'Sunil Gupta',
    email: 'sunil.gupta@yahoo.com',
    phone: '9876543222',
    childrenIds: ['stu-3'],
    address: 'Block C-9, Vasant Kunj',
  },
];

export const INITIAL_STUDENTS_DIRECTORY = [
  {
    id: 'user-student-default',
    studentId: 'STU-2026-0001',
    admissionNo: 'ADM-2026-0001',
    name: 'Aarav Sharma',
    email: 'aarav.s@edusphere.edu',
    phone: '9876543212',
    dob: '2010-05-15',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '01',
    gender: 'Male',
    bloodGroup: 'O+',
    parentId: 'parent-1',
    parentName: 'Rajesh Sharma',
    parentContact: '9876543213',
    emergencyContact: '9876543210',
    address: 'B-14, Shanti Nagar, New Delhi',
    admissionYear: '2026',
    house: 'Emerald Dragons',
    status: 'Active',
    attendancePercent: 96,
    gpa: 3.9,
    feeStatus: 'Paid',
  },
  {
    id: 'stu-2',
    studentId: 'STU-2026-0002',
    admissionNo: 'ADM-2026-0002',
    name: 'Priya Patel',
    email: 'priya.p@edusphere.edu',
    phone: '9876543214',
    dob: '2010-08-22',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '02',
    gender: 'Female',
    bloodGroup: 'A+',
    parentId: 'parent-2',
    parentName: 'Sanjay Patel',
    parentContact: '9876543221',
    emergencyContact: '9876543220',
    address: '42 Lotus Colony, Green Park',
    admissionYear: '2026',
    house: 'Ruby Phoenix',
    status: 'Active',
    attendancePercent: 94,
    gpa: 4.0,
    feeStatus: 'Paid',
  },
  {
    id: 'stu-3',
    studentId: 'STU-2026-0003',
    admissionNo: 'ADM-2026-0003',
    name: 'Rohan Gupta',
    email: 'rohan.g@edusphere.edu',
    phone: '9876543215',
    dob: '2010-03-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '03',
    gender: 'Male',
    bloodGroup: 'B+',
    parentId: 'parent-3',
    parentName: 'Sunil Gupta',
    parentContact: '9876543222',
    emergencyContact: '9876543220',
    address: 'Block C-9, Vasant Kunj',
    admissionYear: '2026',
    house: 'Sapphire Titans',
    status: 'Active',
    attendancePercent: 88,
    gpa: 3.75,
    feeStatus: 'Pending',
  },
  {
    id: 'stu-4',
    studentId: 'STU-2026-0004',
    admissionNo: 'ADM-2026-0004',
    name: 'Ananya Singh',
    email: 'ananya.s@edusphere.edu',
    phone: '9876543216',
    dob: '2010-11-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '04',
    gender: 'Female',
    bloodGroup: 'O+',
    parentId: 'parent-4',
    parentName: 'Vikram Singh',
    parentContact: '9876543223',
    emergencyContact: '9876543220',
    address: 'House 55, Mayur Vihar',
    admissionYear: '2026',
    house: 'Golden Gryphons',
    status: 'Active',
    attendancePercent: 92,
    gpa: 3.85,
    feeStatus: 'Paid',
  },
  {
    id: 'stu-5',
    studentId: 'STU-2026-0005',
    admissionNo: 'ADM-2026-0005',
    name: 'Aditya Verma',
    email: 'aditya.v@edusphere.edu',
    phone: '9876543217',
    dob: '2010-01-18',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    class: 'Class 10-A',
    rollNo: '05',
    gender: 'Male',
    bloodGroup: 'AB+',
    parentId: 'parent-5',
    parentName: 'Ramesh Verma',
    parentContact: '9876543224',
    emergencyContact: '9876543220',
    address: 'Pocket 2, Dwarka Sector 6',
    admissionYear: '2026',
    house: 'Emerald Dragons',
    status: 'Active',
    attendancePercent: 78,
    gpa: 2.9,
    feeStatus: 'Overdue',
  },
  {
    id: 'stu-6',
    studentId: 'STU-2026-0006',
    admissionNo: 'ADM-2026-0006',
    name: 'Kavya Nair',
    email: 'kavya.n@edusphere.edu',
    phone: '9876543225',
    dob: '2011-04-14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    class: 'Class 9-B',
    rollNo: '01',
    gender: 'Female',
    bloodGroup: 'A+',
    parentId: 'parent-6',
    parentName: 'Madhav Nair',
    parentContact: '9876543226',
    emergencyContact: '9876543220',
    address: 'Saket, New Delhi',
    admissionYear: '2026',
    house: 'Ruby Phoenix',
    status: 'Active',
    attendancePercent: 95,
    gpa: 3.95,
    feeStatus: 'Paid',
  },
  {
    id: 'stu-7',
    studentId: 'STU-2026-0007',
    admissionNo: 'ADM-2026-0007',
    name: 'Kabir Das',
    email: 'kabir.d@edusphere.edu',
    phone: '9876543227',
    dob: '2011-09-09',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    class: 'Class 9-B',
    rollNo: '02',
    gender: 'Male',
    bloodGroup: 'B+',
    parentId: 'parent-7',
    parentName: 'Amit Das',
    parentContact: '9876543228',
    emergencyContact: '9876543220',
    address: 'Janakpuri, New Delhi',
    admissionYear: '2026',
    house: 'Sapphire Titans',
    status: 'Active',
    attendancePercent: 91,
    gpa: 3.6,
    feeStatus: 'Pending',
  },
  {
    id: 'stu-8',
    studentId: 'STU-2026-0008',
    admissionNo: 'ADM-2026-0008',
    name: 'Ishita Roy',
    email: 'ishita.r@edusphere.edu',
    phone: '9876543229',
    dob: '2011-12-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    class: 'Class 9-A',
    rollNo: '01',
    gender: 'Female',
    bloodGroup: 'O-',
    parentId: 'parent-8',
    parentName: 'Debabrata Roy',
    parentContact: '9876543230',
    emergencyContact: '9876543220',
    address: 'Greater Kailash 1',
    admissionYear: '2026',
    house: 'Golden Gryphons',
    status: 'Active',
    attendancePercent: 97,
    gpa: 3.9,
    feeStatus: 'Paid',
  },
];

export const INITIAL_TEACHERS = [
  {
    id: 'user-teacher-default',
    name: 'Dr. Alok Verma',
    email: 'teacher@school.com',
    phone: '9876543211',
    dob: '1990-01-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subject: 'Mathematics & Physics',
    assignedClasses: ['Class 10-A', 'Class 9-B'],
    classTeacherOf: 'Class 10-A',
    qualification: 'M.Sc., B.Ed, Ph.D in Physics',
    roomNo: 'Room 304',
    salary: 55000,
    experience: '8 Years',
    status: 'Active',
  },
  {
    id: 'teacher-2',
    name: 'Mrs. Sunita Sharma',
    email: 'sunita.s@edusphere.edu',
    phone: '9876543218',
    dob: '1988-06-12',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    subject: 'English Literature',
    assignedClasses: ['Class 10-A', 'Class 8-A'],
    classTeacherOf: 'Class 8-A',
    qualification: 'M.A. English, B.Ed',
    roomNo: 'Room 203',
    salary: 50000,
    experience: '6 Years',
    status: 'Active',
  },
  {
    id: 'teacher-3',
    name: 'Mr. Rajesh Sen',
    email: 'rajesh.sen@edusphere.edu',
    phone: '9876543219',
    dob: '1985-09-20',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    subject: 'Computer Science & AI',
    assignedClasses: ['Class 10-A', 'Class 11-Science'],
    classTeacherOf: 'Class 11-Science',
    qualification: 'M.Tech Computer Science',
    roomNo: 'Computer Lab 1',
    salary: 60000,
    experience: '10 Years',
    status: 'Active',
  },
];
export const INITIAL_STUDY_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Mathematics Quick Formula Cheat Sheet & AP Notes',
    subject: 'Mathematics',
    class: 'Class 10-A',
    chapter: 'Chapter 5 - Arithmetic Progressions',
    topic: 'Sum of N terms & Real-world Word Problems',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadedBy: 'Mrs. Sarah Jenkins',
    uploadedDate: '2026-10-02',
  },
  {
    id: 'mat-2',
    title: 'Physics Ray Optics & Refraction Lab Manual',
    subject: 'Physics',
    class: 'Class 10-A',
    chapter: 'Chapter 10 - Light: Reflection & Refraction',
    topic: 'Snell\'s Law, Lens Formula & Ray Diagrams',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    uploadedBy: 'Dr. Alok Verma',
    uploadedDate: '2026-10-03',
  },
  {
    id: 'mat-3',
    title: 'Chemistry Chemical Reactions & Equations Guide',
    subject: 'Chemistry',
    class: 'Class 10-A',
    chapter: 'Chapter 1 - Chemical Reactions',
    topic: 'Balancing Equations, Redox Reactions & Catalysts',
    fileType: 'PDF',
    fileSize: '2.2 MB',
    uploadedBy: 'Mrs. Sarah Jenkins',
    uploadedDate: '2026-10-04',
  },
  {
    id: 'mat-4',
    title: 'Computer Science Python Algorithms & SQL Notes',
    subject: 'Computer Science',
    class: 'Class 10-A',
    chapter: 'Unit 3 - Data Structures & Queries',
    topic: 'List Comprehensions, Dictionaries & SQL Joins',
    fileType: 'PDF',
    fileSize: '4.1 MB',
    uploadedBy: 'Mr. Rajesh Sen',
    uploadedDate: '2026-10-05',
  },
  {
    id: 'mat-5',
    title: 'English Literature Poetry & Prose Question Bank',
    subject: 'English',
    class: 'Class 10-A',
    chapter: 'First Flight - Prose Section',
    topic: 'A Letter to God & Nelson Mandela Summary',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    uploadedBy: 'Mrs. Sarah Jenkins',
    uploadedDate: '2026-10-06',
  },
];
export const INITIAL_LIBRARY_BOOKS = [];
export const INITIAL_LIBRARY_TRANSACTIONS = [];
export const INITIAL_TRANSPORT_ROUTES = [];
export const INITIAL_EVENTS = [];
export const INITIAL_NOTIFICATIONS = [];
export const ACADEMIC_SESSION = {
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  label: 'Academic Session 2026–2027 (1 Apr – 31 Mar)',
  totalWorkingDays: 313,
};

// Deterministic fast string hash for realistic stable attendance simulation
const pseudoHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Generate Full Year Student Attendance (1 April 2026 to 31 March 2027)
export const generateSessionAttendanceRecords = () => {
  const records = {};
  const studentRateMap = {
    'user-student-default': 96,
    'stu-2': 94,
    'stu-3': 88,
    'stu-4': 92,
    'stu-5': 78,
    'stu-6': 95,
    'stu-7': 91,
    'stu-8': 97,
  };

  const studentClassMap = {
    'user-student-default': 'Class 10-A',
    'stu-2': 'Class 10-A',
    'stu-3': 'Class 10-A',
    'stu-4': 'Class 10-A',
    'stu-5': 'Class 10-A',
    'stu-6': 'Class 9-B',
    'stu-7': 'Class 9-B',
    'stu-8': 'Class 9-A',
  };

  for (let d = new Date(2026, 3, 1); d <= new Date(2027, 2, 31, 23, 59, 59); d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day === 0) continue; // Sunday holiday
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;

    Object.entries(studentClassMap).forEach(([stuId, className]) => {
      if (!records[className]) records[className] = {};
      if (!records[className][dateStr]) records[className][dateStr] = {};

      const targetRate = studentRateMap[stuId] || 90;
      const h = pseudoHash(dateStr + stuId) % 100;
      let status = 'Present';
      if (h >= targetRate) {
        status = (h % 2 === 0) ? 'Absent' : 'Late';
      }
      records[className][dateStr][stuId] = status;
    });
  }

  return records;
};

// Generate Full Year Staff Attendance (1 April 2026 to 31 March 2027)
export const generateSessionStaffAttendanceRecords = () => {
  const records = {};
  const staffConfigs = [
    {
      id: 'user-teacher-default',
      name: 'Dr. Alok Verma',
      presentDuty: 'On Duty • Period 1-4 & Class Incharge',
      lateDuty: 'Traffic Delay • Morning Lab Setup',
      leaveDuty: 'Approved Academic & Casual Leave',
    },
    {
      id: 'teacher-2',
      name: 'Mrs. Sunita Sharma',
      presentDuty: 'Morning Assembly & English Department',
      lateDuty: 'Late Entry • Class Supervision',
      leaveDuty: 'Approved Medical / Exam Duty',
    },
    {
      id: 'teacher-3',
      name: 'Mr. Rajesh Sen',
      presentDuty: 'Computer Lab Practical Sessions & AI Club',
      lateDuty: 'Hardware Maintenance & Late Sign-In',
      leaveDuty: 'Hackathon & Workshop Duty',
    },
  ];

  for (let d = new Date(2026, 3, 1); d <= new Date(2027, 2, 31, 23, 59, 59); d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day === 0) continue; // Sunday weekly off
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;

    records[dateStr] = {};
    staffConfigs.forEach((staff) => {
      const h = pseudoHash(dateStr + staff.id) % 100;
      let status = 'Present';
      let checkIn = '08:15 AM';
      let checkOut = '03:45 PM';
      let remarks = staff.presentDuty;

      if (h >= 96) {
        status = 'On Leave';
        checkIn = '—';
        checkOut = '—';
        remarks = staff.leaveDuty;
      } else if (h >= 92) {
        status = 'Late';
        checkIn = '08:35 AM';
        checkOut = '03:45 PM';
        remarks = staff.lateDuty;
      }

      records[dateStr][staff.id] = { status, checkIn, checkOut, remarks };
    });
  }

  return records;
};

export const INITIAL_ATTENDANCE_RECORDS = generateSessionAttendanceRecords();
export const INITIAL_STAFF_ATTENDANCE = generateSessionStaffAttendanceRecords();
export const INITIAL_HOMEWORK = [];
export const INITIAL_TIMETABLE = {};
export const INITIAL_EXAMS_AND_RESULTS = {
  exams: [],
  results: {},
};
export const INITIAL_FEES = [];
export const INITIAL_NOTICES = [
  {
    id: 'not-101',
    title: 'Half-Yearly Examination Schedule & Admit Card Distribution',
    category: 'Exams',
    priority: 'Urgent',
    target: 'ALL',
    date: '2026-10-02',
    author: 'Principal Office',
    content: 'The Term 1 Half-Yearly examinations commence from October 20, 2026. Digital admit cards and subject-wise syllabus guidelines are now accessible in the student portal.',
  },
  {
    id: 'not-102',
    title: 'Mandatory Faculty Academic & Curriculum Review Meeting',
    category: 'Academic',
    priority: 'High',
    target: 'TEACHER',
    date: '2026-10-01',
    author: 'Dr. Alok Verma (Academic Director)',
    content: 'All faculty members are requested to attend the quarterly syllabus review and modern AI evaluation session this Friday at 03:30 PM in Conference Hall A.',
  },
  {
    id: 'not-103',
    title: 'Inter-School Science, Robotics & AI Innovators Expo 2026',
    category: 'General',
    priority: 'Normal',
    target: 'STUDENT',
    date: '2026-09-28',
    author: 'Science Department (Mr. Rajesh Sen)',
    content: 'Students from Classes 8 through 12 are invited to register working science models, IoT devices, and robotics projects. Submit project synopsis by October 10.',
  },
  {
    id: 'not-104',
    title: 'Parent-Teacher Conference (PTM) & Gradebook Consultation',
    category: 'PTM',
    priority: 'High',
    target: 'ALL',
    date: '2026-09-25',
    author: 'Dean of Student Affairs',
    content: 'The mid-term Parent-Teacher Consultation will be conducted on Saturday, October 18, 2026, from 09:00 AM to 01:30 PM. One-on-one progress discussions will be held.',
  },
  {
    id: 'not-105',
    title: 'Annual Sports Day Track & Field Trials',
    category: 'Sports',
    priority: 'Normal',
    target: 'STUDENT',
    date: '2026-09-22',
    author: 'Physical Education Dept',
    content: 'House-wise selections for 100m, 400m relay, high jump and football tournament will take place on the school sports arena every afternoon from 04:00 PM.',
  },
];
export const INITIAL_LEAVE_REQUESTS = [];
