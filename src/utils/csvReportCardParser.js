// EduSphere 360 - Excel/CSV Report Card Parser & Template Generator
import * as XLSX from 'xlsx';

export const SAMPLE_REPORT_ROWS = [
  { RollNo: 1, StudentName: 'Aarav Sharma', Class: 'Class 10-A', Mathematics: 96, Physics: 92, Chemistry: 89, English: 93, ComputerScience: 98, Remarks: 'Outstanding academic consistency and coding logic' },
  { RollNo: 2, StudentName: 'Diya Patel', Class: 'Class 10-A', Mathematics: 88, Physics: 85, Chemistry: 91, English: 94, ComputerScience: 90, Remarks: 'Excellent creative writing and science performance' },
  { RollNo: 3, StudentName: 'Kabir Verma', Class: 'Class 10-A', Mathematics: 94, Physics: 89, Chemistry: 92, English: 86, ComputerScience: 95, Remarks: 'Great problem solving and active participation' },
  { RollNo: 4, StudentName: 'Ananya Gupta', Class: 'Class 10-A', Mathematics: 78, Physics: 82, Chemistry: 80, English: 90, ComputerScience: 88, Remarks: 'Good conceptual understanding; keep practicing math' },
  { RollNo: 5, StudentName: 'Rohan Mehta', Class: 'Class 10-A', Mathematics: 90, Physics: 94, Chemistry: 93, English: 88, ComputerScience: 96, Remarks: 'Exceptional lab skills and analytical thinking' },
  { RollNo: 6, StudentName: 'Sneha Joshi', Class: 'Class 10-A', Mathematics: 85, Physics: 88, Chemistry: 86, English: 92, ComputerScience: 89, Remarks: 'Very good progress in all subjects' },
  { RollNo: 7, StudentName: 'Vihaan Reddy', Class: 'Class 10-A', Mathematics: 92, Physics: 90, Chemistry: 91, English: 85, ComputerScience: 94, Remarks: 'Strong grasp of mathematics and physics' },
  { RollNo: 8, StudentName: 'Ishaan Nair', Class: 'Class 10-A', Mathematics: 82, Physics: 79, Chemistry: 84, English: 88, ComputerScience: 85, Remarks: 'Consistent effort; good improvement in practicals' },
  { RollNo: 9, StudentName: 'Tanvi Deshmukh', Class: 'Class 10-A', Mathematics: 95, Physics: 91, Chemistry: 94, English: 96, ComputerScience: 97, Remarks: 'Brilliant all-round academic performance' },
  { RollNo: 10, StudentName: 'Aditya Roy', Class: 'Class 10-A', Mathematics: 89, Physics: 86, Chemistry: 88, English: 91, ComputerScience: 92, Remarks: 'Commendable performance in technical subjects' },
];

export const SAMPLE_REPORT_CSV_CONTENT = `RollNo,StudentName,Class,Mathematics,Physics,Chemistry,English,ComputerScience,Remarks
1,Aarav Sharma,Class 10-A,96,92,89,93,98,Outstanding academic consistency and coding logic
2,Diya Patel,Class 10-A,88,85,91,94,90,Excellent creative writing and science performance
3,Kabir Verma,Class 10-A,94,89,92,86,95,Great problem solving and active participation
4,Ananya Gupta,Class 10-A,78,82,80,90,88,Good conceptual understanding; keep practicing math
5,Rohan Mehta,Class 10-A,90,94,93,88,96,Exceptional lab skills and analytical thinking
6,Sneha Joshi,Class 10-A,85,88,86,92,89,Very good progress in all subjects
7,Vihaan Reddy,Class 10-A,92,90,91,85,94,Strong grasp of mathematics and physics
8,Ishaan Nair,Class 10-A,82,79,84,88,85,Consistent effort; good improvement in practicals
9,Tanvi Deshmukh,Class 10-A,95,91,94,96,97,Brilliant all-round academic performance
10,Aditya Roy,Class 10-A,89,86,88,91,92,Commendable performance in technical subjects`;

/**
 * Downloads sample template as a genuine Microsoft Excel (.xlsx) file
 */
export const downloadSampleReportCardExcel = (className = 'Class 10-A') => {
  const data = SAMPLE_REPORT_ROWS.map(r => ({
    ...r,
    Class: className,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 8 },  // RollNo
    { wch: 18 }, // StudentName
    { wch: 12 }, // Class
    { wch: 14 }, // Mathematics
    { wch: 10 }, // Physics
    { wch: 12 }, // Chemistry
    { wch: 10 }, // English
    { wch: 18 }, // ComputerScience
    { wch: 45 }, // Remarks
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${className.replace(/\s+/g, '_')}_Marks`);

  const fileName = `${className.replace(/\s+/g, '_')}_Report_Card_Template.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Downloads sample template as a CSV file
 */
export const downloadSampleReportCardCSV = (className = 'Class 10-A') => {
  const content = SAMPLE_REPORT_CSV_CONTENT.replace(/Class 10-A/g, className);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${className.replace(/\s+/g, '_')}_Report_Card_Template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Converts raw JSON rows (from CSV or Excel) into structured student report card objects
 */
export const processRawRowsToReportCards = (rawRows, existingStudents = [], defaultExamTitle = 'Term 1 Report Card 2026') => {
  if (!rawRows || rawRows.length === 0) return [];

  const firstRow = rawRows[0];
  const keys = Object.keys(firstRow);

  const rollKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '').includes('roll'));
  const nameKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '').includes('name') || k.toLowerCase().includes('student'));
  const classKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '').includes('class') || k.toLowerCase().includes('grade'));
  const remarksKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '').includes('remark') || k.toLowerCase().includes('comment'));

  const standardFieldKeys = [rollKey, nameKey, classKey, remarksKey, 'total', 'percentage', 'gpa', 'grade'].filter(Boolean);
  const subjectKeys = keys.filter(k => !standardFieldKeys.includes(k) && !['total', 'percentage', 'gpa', 'grade'].includes(k.toLowerCase()));

  const parsedResults = [];

  rawRows.forEach((row, i) => {
    const rollNo = rollKey && row[rollKey] !== undefined ? String(row[rollKey]) : String(i + 1);
    const studentName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : `Student ${i + 1}`;
    const studentClass = classKey && row[classKey] ? String(row[classKey]).trim() : 'Class 10-A';
    const remarks = remarksKey && row[remarksKey] ? String(row[remarksKey]).trim() : 'Good academic performance in this session.';

    const subjects = [];
    let totalMarks = 0;
    let maxTotal = 0;

    subjectKeys.forEach(sKey => {
      const val = Number(row[sKey]) || 0;
      const maxMarks = 100;
      totalMarks += val;
      maxTotal += maxMarks;

      let grade = 'C';
      if (val >= 90) grade = 'A+';
      else if (val >= 80) grade = 'A';
      else if (val >= 70) grade = 'B+';
      else if (val >= 60) grade = 'B';
      else if (val >= 50) grade = 'C';
      else grade = 'F';

      subjects.push({
        name: sKey.trim(),
        marks: val,
        maxMarks,
        highestMarks: val + 2 > 100 ? 100 : val + 2,
        grade,
        remarks: val >= 90 ? 'Outstanding' : val >= 80 ? 'Very Good' : 'Satisfactory',
      });
    });

    const percentage = maxTotal > 0 ? Number(((totalMarks / maxTotal) * 100).toFixed(1)) : 0;
    const gpa = Number(((percentage / 100) * 4.0).toFixed(2));
    let overallGrade = 'C';
    if (percentage >= 90) overallGrade = 'A+';
    else if (percentage >= 80) overallGrade = 'A';
    else if (percentage >= 70) overallGrade = 'B+';
    else if (percentage >= 60) overallGrade = 'B';
    else overallGrade = 'C';

    const matchedStudent = existingStudents.find(s =>
      (s.rollNo && String(s.rollNo) === String(rollNo) && (!s.class || s.class === studentClass)) ||
      (s.name && s.name.trim().toLowerCase() === studentName.trim().toLowerCase())
    );

    const studentId = matchedStudent ? matchedStudent.id : `student-roll-${rollNo}`;

    parsedResults.push({
      studentId,
      studentName,
      class: studentClass,
      rollNo,
      examTitle: defaultExamTitle,
      totalMarks,
      maxTotal,
      percentage,
      gpa,
      grade: overallGrade,
      remarks,
      subjects,
      publishedAt: new Date().toISOString(),
    });
  });

  return parsedResults;
};

/**
 * Parses CSV text string
 */
export const parseReportCardsCSV = (csvText, existingStudents = [], defaultExamTitle = 'Term 1 Report Card 2026') => {
  try {
    const wb = XLSX.read(csvText, { type: 'string' });
    const sheetName = wb.SheetNames[0];
    const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
    return processRawRowsToReportCards(rawRows, existingStudents, defaultExamTitle);
  } catch (err) {
    console.error('CSV parse error, falling back:', err);
    return [];
  }
};

/**
 * Parses any uploaded File object (.xlsx, .xls, or .csv)
 */
export const parseReportCardsFile = async (file, existingStudents = [], defaultExamTitle = 'Term 1 Report Card 2026') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const wb = XLSX.read(buffer, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
        const results = processRawRowsToReportCards(rawRows, existingStudents, defaultExamTitle);
        resolve(results);
      } catch (err) {
        console.error('Failed to parse Excel/CSV file:', err);
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
