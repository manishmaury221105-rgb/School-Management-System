import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_PARENTS_DIRECTORY,
  INITIAL_STUDENTS_DIRECTORY,
  INITIAL_TEACHERS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_LIBRARY_TRANSACTIONS,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_HOMEWORK,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS_AND_RESULTS,
  INITIAL_FEES,
  INITIAL_NOTICES,
  INITIAL_LEAVE_REQUESTS,
} from '../data/mockData';

const DB_VERSION = 'edusphere_v2';

const getSafeStorage = (key, fallback) => {
  try {
    const versionedKey = `${DB_VERSION}_${key}`;
    const saved = localStorage.getItem(versionedKey);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed ?? fallback;
  } catch (err) {
    console.warn(`Failed to parse localStorage key: ${key}`, err);
    return fallback;
  }
};

const SchoolDataContext = createContext(null);

export const SchoolDataProvider = ({ children }) => {
  // State initialization with clean LocalStorage backing
  const [classes, setClasses] = useState(() => getSafeStorage('classes', INITIAL_CLASSES));
  const [subjects, setSubjects] = useState(() => getSafeStorage('subjects', INITIAL_SUBJECTS));
  const [parents, setParents] = useState(() => getSafeStorage('parents', INITIAL_PARENTS_DIRECTORY));
  const [students, setStudents] = useState(() => getSafeStorage('students', INITIAL_STUDENTS_DIRECTORY));
  const [teachers, setTeachers] = useState(() => getSafeStorage('teachers', INITIAL_TEACHERS));
  const [studyMaterials, setStudyMaterials] = useState(() => getSafeStorage('materials', INITIAL_STUDY_MATERIALS));
  const [books, setBooks] = useState(() => getSafeStorage('books', INITIAL_LIBRARY_BOOKS));
  const [libraryTransactions, setLibraryTransactions] = useState(() => getSafeStorage('lib_tx', INITIAL_LIBRARY_TRANSACTIONS));
  const [transportRoutes, setTransportRoutes] = useState(() => getSafeStorage('transport', INITIAL_TRANSPORT_ROUTES));
  const [events, setEvents] = useState(() => getSafeStorage('events', INITIAL_EVENTS));
  const [notifications, setNotifications] = useState(() => getSafeStorage('notifications', INITIAL_NOTIFICATIONS));
  const [attendance, setAttendance] = useState(() => getSafeStorage('attendance', INITIAL_ATTENDANCE_RECORDS));
  const [homework, setHomework] = useState(() => getSafeStorage('homework', INITIAL_HOMEWORK));
  const [timetable, setTimetable] = useState(() => getSafeStorage('timetable', INITIAL_TIMETABLE));
  const [examsData, setExamsData] = useState(() => getSafeStorage('exams', INITIAL_EXAMS_AND_RESULTS));
  const [fees, setFees] = useState(() => getSafeStorage('fees', INITIAL_FEES));
  const [notices, setNotices] = useState(() => getSafeStorage('notices', INITIAL_NOTICES));
  const [leaveRequests, setLeaveRequests] = useState(() => getSafeStorage('leaves', INITIAL_LEAVE_REQUESTS));
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_classes`, JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_subjects`, JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_parents`, JSON.stringify(parents)); }, [parents]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_students`, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_teachers`, JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_materials`, JSON.stringify(studyMaterials)); }, [studyMaterials]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_books`, JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_lib_tx`, JSON.stringify(libraryTransactions)); }, [libraryTransactions]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_transport`, JSON.stringify(transportRoutes)); }, [transportRoutes]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_events`, JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_notifications`, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_attendance`, JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_homework`, JSON.stringify(homework)); }, [homework]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_timetable`, JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_exams`, JSON.stringify(examsData)); }, [examsData]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_fees`, JSON.stringify(fees)); }, [fees]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_notices`, JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem(`${DB_VERSION}_leaves`, JSON.stringify(leaveRequests)); }, [leaveRequests]);

  // ----------------------------------------------------
  // CRUD ACTIONS
  // ----------------------------------------------------

  // Students CRUD
  const addStudent = (newStudent) => {
    const id = `stu-${Date.now()}`;
    const student = {
      id,
      studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      attendancePercent: 100,
      gpa: 3.8,
      feeStatus: 'Pending',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...newStudent,
    };
    setStudents(prev => [student, ...prev]);
    return student;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updatedData } : s)));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const clearAllStudents = () => {
    setStudents([]);
    localStorage.setItem('edusphere_students', JSON.stringify([]));
  };

  // Parents CRUD
  const addParent = (newParent) => {
    const id = `parent-${Date.now()}`;
    const parent = {
      id,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      children: [],
      ...newParent,
    };
    setParents(prev => [parent, ...prev]);
    return parent;
  };

  const deleteParent = (id) => {
    setParents(prev => prev.filter(p => p.id !== id));
  };

  // Teachers CRUD
  const addTeacher = (newTeacher) => {
    const id = `t-${Date.now()}`;
    const teacher = {
      id,
      teacherId: `TCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      salary: 65000,
      ...newTeacher,
    };
    setTeachers(prev => [teacher, ...prev]);
    return teacher;
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Subjects CRUD
  const addSubject = (newSubject) => {
    const id = `sub-${Date.now()}`;
    const subject = {
      id,
      maxMarks: 100,
      passingMarks: 35,
      ...newSubject,
    };
    setSubjects(prev => [subject, ...prev]);
    return subject;
  };

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Study Materials CRUD
  const addStudyMaterial = (newMaterial) => {
    const id = `mat-${Date.now()}`;
    const mat = {
      id,
      uploadedDate: new Date().toISOString().split('T')[0],
      downloadUrl: '#',
      ...newMaterial,
    };
    setStudyMaterials(prev => [mat, ...prev]);
    return mat;
  };

  const deleteStudyMaterial = (id) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Library Books CRUD & Transactions
  const addBook = (newBook) => {
    const id = `lib-${Date.now()}`;
    const book = {
      id,
      bookId: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      availableCopies: newBook.quantity || 1,
      ...newBook,
    };
    setBooks(prev => [book, ...prev]);
    return book;
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const issueBook = (bookId, studentId, studentName) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return false;

    // Decrement available copies
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );

    const txId = `tx-${Date.now()}`;
    const newTx = {
      id: txId,
      bookId: book.bookId,
      bookTitle: book.title,
      studentId,
      studentName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      returnDate: null,
      fineAmount: 0,
      status: 'ISSUED',
    };
    setLibraryTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const returnBook = (txId) => {
    const tx = libraryTransactions.find(t => t.id === txId);
    if (!tx || tx.status === 'RETURNED') return;

    setBooks(prev =>
      prev.map(b => (b.bookId === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );

    setLibraryTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, returnDate: new Date().toISOString().split('T')[0], status: 'RETURNED' }
          : t
      )
    );
  };

  // Events CRUD
  const addEvent = (newEvent) => {
    const id = `ev-${Date.now()}`;
    const ev = {
      id,
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
      ...newEvent,
    };
    setEvents(prev => [ev, ...prev]);
    return ev;
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const addNotification = (notif) => {
    const id = `notif-${Date.now()}`;
    setNotifications(prev => [{ id, time: 'Just now', isRead: false, ...notif }, ...prev]);
  };

  // Attendance
  const markBulkAttendance = (className, date, statusMap) => {
    setAttendance(prev => {
      const classData = prev[className] || {};
      return {
        ...prev,
        [className]: {
          ...classData,
          [date]: { ...statusMap },
        },
      };
    });
  };

  // Homework
  const addHomework = (newHw) => {
    const id = `hw-${Date.now()}`;
    const hw = {
      id,
      assignedDate: new Date().toISOString().split('T')[0],
      totalSubmissions: 0,
      totalStudents: 32,
      status: 'Active',
      studentStatus: {},
      ...newHw,
    };
    setHomework(prev => [hw, ...prev]);
    return hw;
  };

  const submitHomework = (hwId, studentId, submissionNotes = '') => {
    setHomework(prev =>
      prev.map(hw => {
        if (hw.id === hwId) {
          const updatedSubmissions = {
            ...hw.studentStatus,
            [studentId]: {
              submitted: true,
              submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              notes: submissionNotes,
            },
          };
          const count = Object.values(updatedSubmissions).filter(s => s?.submitted).length;
          return {
            ...hw,
            totalSubmissions: count,
            studentStatus: updatedSubmissions,
          };
        }
        return hw;
      })
    );
  };

  const gradeHomework = (hwId, studentId, grade, feedback) => {
    setHomework(prev =>
      prev.map(hw => {
        if (hw.id === hwId) {
          const current = hw.studentStatus[studentId] || { submitted: true };
          return {
            ...hw,
            studentStatus: {
              ...hw.studentStatus,
              [studentId]: { ...current, grade, feedback },
            },
          };
        }
        return hw;
      })
    );
  };

  // Exam Marks
  const updateStudentMarks = (studentId, subjectName, marks, remarks) => {
    setExamsData(prev => {
      const studentResult = prev.results[studentId];
      if (!studentResult) return prev;

      const updatedSubjects = studentResult.subjects.map(sub => {
        if (sub.name === subjectName) {
          const numMarks = Number(marks);
          let grade = 'C';
          if (numMarks >= 90) grade = 'A+';
          else if (numMarks >= 80) grade = 'A';
          else if (numMarks >= 70) grade = 'B+';
          else if (numMarks >= 60) grade = 'B';
          else if (numMarks >= 50) grade = 'C';
          else grade = 'F';

          return { ...sub, marks: numMarks, grade, remarks: remarks || sub.remarks };
        }
        return sub;
      });

      const totalMarks = updatedSubjects.reduce((sum, s) => sum + s.marks, 0);
      const percentage = (totalMarks / (updatedSubjects.length * 100)) * 100;
      const gpa = Number(((percentage / 100) * 4.0).toFixed(2));

      return {
        ...prev,
        results: {
          ...prev.results,
          [studentId]: {
            ...studentResult,
            subjects: updatedSubjects,
            totalMarks,
            percentage: Number(percentage.toFixed(1)),
            gpa,
          },
        },
      };
    });
  };

  // Fees & Receipts
  const payFee = (feeId, paymentMethod = 'Online Payment') => {
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidDate = new Date().toISOString().split('T')[0];

    setFees(prev =>
      prev.map(f => {
        if (f.id === feeId) {
          return {
            ...f,
            status: 'Paid',
            paidDate,
            receiptNo,
            paymentMethod,
          };
        }
        return f;
      })
    );

    return { receiptNo, paidDate };
  };

  // Notices
  const addNotice = (newNotice) => {
    const id = `not-${Date.now()}`;
    const notice = {
      id,
      date: new Date().toISOString().split('T')[0],
      ...newNotice,
    };
    setNotices(prev => [notice, ...prev]);
    return notice;
  };

  const deleteNotice = (noticeId) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  // Leaves
  const applyLeave = (leaveData) => {
    const id = `leave-${Date.now()}`;
    const newLeave = {
      id,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
      teacherRemarks: 'Awaiting review by Class Teacher.',
      ...leaveData,
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, teacherRemarks) => {
    setLeaveRequests(prev =>
      prev.map(l => {
        if (l.id === leaveId) {
          return {
            ...l,
            status,
            teacherRemarks: teacherRemarks || l.teacherRemarks,
          };
        }
        return l;
      })
    );
  };

  // Reset to default seed data
  const resetAllData = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setParents(INITIAL_PARENTS_DIRECTORY);
    setStudents(INITIAL_STUDENTS_DIRECTORY);
    setTeachers(INITIAL_TEACHERS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setBooks(INITIAL_LIBRARY_BOOKS);
    setLibraryTransactions(INITIAL_LIBRARY_TRANSACTIONS);
    setTransportRoutes(INITIAL_TRANSPORT_ROUTES);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAttendance(INITIAL_ATTENDANCE_RECORDS);
    setHomework(INITIAL_HOMEWORK);
    setTimetable(INITIAL_TIMETABLE);
    setExamsData(INITIAL_EXAMS_AND_RESULTS);
    setFees(INITIAL_FEES);
    setNotices(INITIAL_NOTICES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    window.location.reload();
  };

  return (
    <SchoolDataContext.Provider
      value={{
        classes,
        subjects,
        parents,
        students,
        teachers,
        studyMaterials,
        books,
        libraryTransactions,
        transportRoutes,
        events,
        notifications,
        attendance,
        homework,
        timetable,
        examsData,
        fees,
        notices,
        leaveRequests,
        selectedChildId,
        setSelectedChildId,
        addStudent,
        updateStudent,
        deleteStudent,
        clearAllStudents,
        addParent,
        deleteParent,
        addTeacher,
        deleteTeacher,
        addSubject,
        deleteSubject,
        addStudyMaterial,
        deleteStudyMaterial,
        addBook,
        deleteBook,
        issueBook,
        returnBook,
        addEvent,
        deleteEvent,
        markNotificationRead,
        addNotification,
        markBulkAttendance,
        addHomework,
        submitHomework,
        gradeHomework,
        updateStudentMarks,
        payFee,
        addNotice,
        deleteNotice,
        applyLeave,
        updateLeaveStatus,
        resetAllData,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
