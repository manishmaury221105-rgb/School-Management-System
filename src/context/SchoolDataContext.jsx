import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS_DIRECTORY,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_HOMEWORK,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS_AND_RESULTS,
  INITIAL_FEES,
  INITIAL_NOTICES,
  INITIAL_LEAVE_REQUESTS,
} from '../data/mockData';

const SchoolDataContext = createContext(null);

export const SchoolDataProvider = ({ children }) => {
  // Load or initialize state from LocalStorage
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('edusphere_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('edusphere_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_DIRECTORY;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('edusphere_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('edusphere_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [homework, setHomework] = useState(() => {
    const saved = localStorage.getItem('edusphere_homework');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('edusphere_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [examsData, setExamsData] = useState(() => {
    const saved = localStorage.getItem('edusphere_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS_AND_RESULTS;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('edusphere_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('edusphere_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('edusphere_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  // Selected child for Parent role view
  const [selectedChildId, setSelectedChildId] = useState('user-student-1');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('edusphere_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('edusphere_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edusphere_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('edusphere_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('edusphere_homework', JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem('edusphere_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('edusphere_exams', JSON.stringify(examsData));
  }, [examsData]);

  useEffect(() => {
    localStorage.setItem('edusphere_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('edusphere_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('edusphere_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // Actions
  const addStudent = (newStudent) => {
    const id = `stu-${Date.now()}`;
    const student = {
      id,
      studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      attendancePercent: 100,
      gpa: 3.8,
      feeStatus: 'Pending',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...newStudent,
    };
    setStudents(prev => [student, ...prev]);
    return student;
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const addTeacher = (newTeacher) => {
    const id = `t-${Date.now()}`;
    const teacher = {
      id,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      ...newTeacher,
    };
    setTeachers(prev => [teacher, ...prev]);
    return teacher;
  };

  const markAttendance = (className, date, studentId, status) => {
    setAttendance(prev => {
      const classData = prev[className] || {};
      const dateData = classData[date] || {};
      return {
        ...prev,
        [className]: {
          ...classData,
          [date]: {
            ...dateData,
            [studentId]: status,
          },
        },
      };
    });
  };

  const markBulkAttendance = (className, date, statusMap) => {
    setAttendance(prev => {
      const classData = prev[className] || {};
      return {
        ...prev,
        [className]: {
          ...classData,
          [date]: {
            ...statusMap,
          },
        },
      };
    });
  };

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
              [studentId]: {
                ...current,
                grade,
                feedback,
              },
            },
          };
        }
        return hw;
      })
    );
  };

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

  const resetAllData = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS_DIRECTORY);
    setTeachers(INITIAL_TEACHERS);
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
        students,
        teachers,
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
        deleteStudent,
        addTeacher,
        markAttendance,
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
