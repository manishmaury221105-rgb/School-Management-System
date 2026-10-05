// EduSphere 360 - Timetable Data & Vector SVG Routine Generator
// Generates structured schedules and high-resolution SVG timetable graphics for all classes

export const PERIOD_SLOTS = [
  { id: 'P1', name: 'Period 1', time: '08:30 - 09:15', startMin: 510, endMin: 555 },
  { id: 'P2', name: 'Period 2', time: '09:15 - 10:00', startMin: 555, endMin: 600 },
  { id: 'P3', name: 'Period 3', time: '10:15 - 11:00', startMin: 615, endMin: 660 },
  { id: 'P4', name: 'Period 4', time: '11:00 - 11:45', startMin: 660, endMin: 705 },
  { id: 'BREAK', name: 'Lunch Break', time: '11:45 - 12:30', isBreak: true, startMin: 705, endMin: 750 },
  { id: 'P5', name: 'Period 5', time: '12:30 - 01:15', startMin: 750, endMin: 795 },
  { id: 'P6', name: 'Period 6', time: '01:15 - 02:00', startMin: 795, endMin: 840 },
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SUBJECT_THEMES = {
  Mathematics: { color: '#4f46e5', bgLight: '#eef2ff', border: '#c7d2fe' },
  Physics: { color: '#0284c7', bgLight: '#f0f9ff', border: '#bae6fd' },
  'Physics Lab': { color: '#0284c7', bgLight: '#f0f9ff', border: '#bae6fd' },
  Chemistry: { color: '#059669', bgLight: '#ecfdf5', border: '#a7f3d0' },
  'Chemistry Lab': { color: '#059669', bgLight: '#ecfdf5', border: '#a7f3d0' },
  Biology: { color: '#16a34a', bgLight: '#f0fdf4', border: '#bbf7d0' },
  'Biology Lab': { color: '#16a34a', bgLight: '#f0fdf4', border: '#bbf7d0' },
  'English Lit': { color: '#d97706', bgLight: '#fffbeb', border: '#fde68a' },
  'English Grammar': { color: '#d97706', bgLight: '#fffbeb', border: '#fde68a' },
  English: { color: '#d97706', bgLight: '#fffbeb', border: '#fde68a' },
  'Hindi / Lang': { color: '#ea580c', bgLight: '#fff7ed', border: '#fed7aa' },
  'Social Studies': { color: '#e11d48', bgLight: '#fff1f2', border: '#fecdd3' },
  'History / Civics': { color: '#e11d48', bgLight: '#fff1f2', border: '#fecdd3' },
  'Geography / Econ': { color: '#0d9488', bgLight: '#f0fdfa', border: '#99f6e4' },
  'Computer & AI': { color: '#7c3aed', bgLight: '#f5f3ff', border: '#ddd6fe' },
  'AI Project': { color: '#7c3aed', bgLight: '#f5f3ff', border: '#ddd6fe' },
  'Physical Ed / Sports': { color: '#10b981', bgLight: '#ecfdf5', border: '#a7f3d0' },
  'Library & Reading': { color: '#6366f1', bgLight: '#eef2ff', border: '#c7d2fe' },
  'Art & Craft': { color: '#ec4899', bgLight: '#fdf2f8', border: '#fbcfe8' },
  'Music & Drama': { color: '#f43f5e', bgLight: '#fff1f2', border: '#fecdd3' },
  'General Science': { color: '#0891b2', bgLight: '#ecfeff', border: '#a5f3fc' },
  'EVS & Nature': { color: '#15803d', bgLight: '#f0fdf4', border: '#bbf7d0' },
  'Storytelling / Rhymes': { color: '#f59e0b', bgLight: '#fffbeb', border: '#fde68a' },
  'Club Activities': { color: '#8b5cf6', bgLight: '#f5f3ff', border: '#ddd6fe' },
  Assembly: { color: '#334155', bgLight: '#f8fafc', border: '#e2e8f0' },
};

export const getSubjectTheme = (subjectName) => {
  if (!subjectName) return { color: '#4f46e5', bgLight: '#eef2ff', border: '#c7d2fe' };
  for (const [key, theme] of Object.entries(SUBJECT_THEMES)) {
    if (subjectName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(subjectName.toLowerCase())) {
      return theme;
    }
  }
  return { color: '#4f46e5', bgLight: '#eef2ff', border: '#c7d2fe' };
};

// Generates weekly schedule timetable matrices for any given class
export const getClassSchedule = (className = 'Class 10-A') => {
  const isPrimary = className.includes('Nursery') || className.includes('LKG') || className.includes('UKG') || /Class [1-5]-/.test(className);
  const isSenior = className.includes('11') || className.includes('12');

  const defaultFaculty = {
    math: 'Dr. Alok Verma',
    physics: 'Mr. Rajesh Sen',
    chem: 'Dr. Priya Mehta',
    bio: 'Dr. Meera Iyer',
    eng: 'Mrs. Sunita Sharma',
    sst: 'Mr. Amit Tiwari',
    cs: 'Mr. Vikram Sen',
    pe: 'Coach David',
    art: 'Ms. Emily Blunt',
    hindi: 'Mrs. Kavita Joshi',
    room: className.includes('10') ? 'Room 304' : className.includes('9') ? 'Room 301' : className.includes('11') ? 'Room 401' : 'Room 202',
  };

  const scheduleConfig = {
    Monday: [
      { p: 'P1', s: isPrimary ? 'English Phonics' : isSenior ? 'Advanced Physics' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P2', s: isPrimary ? 'Number Magic' : isSenior ? 'Physics Lab' : 'Physics Lab', t: defaultFaculty.physics, r: 'Physics Lab 1' },
      { p: 'P3', s: isPrimary ? 'Storytelling & Rhymes' : isSenior ? 'English Core' : 'English Lit', t: defaultFaculty.eng, r: defaultFaculty.room },
      { p: 'P4', s: isPrimary ? 'Drawing & Art' : isSenior ? 'Chemistry' : 'Chemistry', t: defaultFaculty.chem, r: defaultFaculty.room },
      { p: 'P5', s: isPrimary ? 'EVS & Nature' : isSenior ? 'Calculus & Higher Math' : 'Computer & AI', t: defaultFaculty.cs, r: 'AI Lab A' },
      { p: 'P6', s: isPrimary ? 'Indoor Play' : isSenior ? 'Physical Ed / Sports' : 'Physical Ed / Sports', t: defaultFaculty.pe, r: 'Sports Ground' },
    ],
    Tuesday: [
      { p: 'P1', s: isPrimary ? 'English Reading' : isSenior ? 'Chemistry Theory' : 'Biology', t: defaultFaculty.bio, r: defaultFaculty.room },
      { p: 'P2', s: isPrimary ? 'Maths Basics' : isSenior ? 'Chemistry Practical' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P3', s: isPrimary ? 'EVS & Animals' : isSenior ? 'Biology / CS' : 'Social Studies', t: defaultFaculty.sst, r: defaultFaculty.room },
      { p: 'P4', s: isPrimary ? 'Music & Dance' : isSenior ? 'Physics' : 'Hindi / Lang', t: defaultFaculty.hindi, r: defaultFaculty.room },
      { p: 'P5', s: isPrimary ? 'Clay Modeling' : isSenior ? 'English' : 'Physics', t: defaultFaculty.physics, r: defaultFaculty.room },
      { p: 'P6', s: isPrimary ? 'Outdoor Activity' : isSenior ? 'Library / Research' : 'Library & Reading', t: defaultFaculty.eng, r: 'Central Library' },
    ],
    Wednesday: [
      { p: 'P1', s: isPrimary ? 'Language Fun' : isSenior ? 'Chemistry Lab' : 'Chemistry Lab', t: defaultFaculty.chem, r: 'Chemistry Lab 2' },
      { p: 'P2', s: isPrimary ? 'Maths Quiz' : isSenior ? 'Mathematics' : 'English Grammar', t: defaultFaculty.eng, r: defaultFaculty.room },
      { p: 'P3', s: isPrimary ? 'Nature Walk' : isSenior ? 'Physics' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P4', s: isPrimary ? 'Creative Art' : isSenior ? 'Computer Coding' : 'Computer & AI', t: defaultFaculty.cs, r: 'AI Lab A' },
      { p: 'P5', s: isPrimary ? 'Rhymes & Fun' : isSenior ? 'Economics / Bio' : 'Geography / Econ', t: defaultFaculty.sst, r: defaultFaculty.room },
      { p: 'P6', s: isPrimary ? 'Free Play' : isSenior ? 'Art & Design' : 'Art & Craft', t: defaultFaculty.art, r: 'Studio Room' },
    ],
    Thursday: [
      { p: 'P1', s: isPrimary ? 'English Writing' : isSenior ? 'Mathematics' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P2', s: isPrimary ? 'Mental Maths' : isSenior ? 'Physics Theory' : 'Physics', t: defaultFaculty.physics, r: defaultFaculty.room },
      { p: 'P3', s: isPrimary ? 'Science Activity' : isSenior ? 'Biology Lab' : 'Biology Lab', t: defaultFaculty.bio, r: 'Bio Lab 3' },
      { p: 'P4', s: isPrimary ? 'Story Theatre' : isSenior ? 'English Core' : 'History / Civics', t: defaultFaculty.sst, r: defaultFaculty.room },
      { p: 'P5', s: isPrimary ? 'Paper Craft' : isSenior ? 'Chemistry' : 'English Lit', t: defaultFaculty.eng, r: defaultFaculty.room },
      { p: 'P6', s: isPrimary ? 'Physical Exercise' : isSenior ? 'Sports Training' : 'Physical Ed / Sports', t: defaultFaculty.pe, r: 'Main Playground' },
    ],
    Friday: [
      { p: 'P1', s: isPrimary ? 'Picture Reading' : isSenior ? 'AI Project' : 'AI Project', t: defaultFaculty.cs, r: 'AI Lab A' },
      { p: 'P2', s: isPrimary ? 'Maths Games' : isSenior ? 'Chemistry' : 'Chemistry', t: defaultFaculty.chem, r: defaultFaculty.room },
      { p: 'P3', s: isPrimary ? 'General Knowledge' : isSenior ? 'Mathematics' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P4', s: isPrimary ? 'Hindi Rhymes' : isSenior ? 'Physics Lab' : 'Geography / Econ', t: defaultFaculty.sst, r: defaultFaculty.room },
      { p: 'P5', s: isPrimary ? 'Art & Color' : isSenior ? 'Club Activities' : 'Club Activities', t: defaultFaculty.art, r: 'Activity Hall' },
      { p: 'P6', s: isPrimary ? 'Weekly Assembly' : isSenior ? 'Assembly & Quiz' : 'Assembly', t: 'Principal Office', r: 'Main Auditorium' },
    ],
    Saturday: [
      { p: 'P1', s: isPrimary ? 'Weekend Review' : isSenior ? 'Maths Problem Solving' : 'Mathematics', t: defaultFaculty.math, r: defaultFaculty.room },
      { p: 'P2', s: isPrimary ? 'Story Session' : isSenior ? 'Science Seminar' : 'Science Quiz', t: defaultFaculty.physics, r: defaultFaculty.room },
      { p: 'P3', s: isPrimary ? 'Art Gallery' : isSenior ? 'English Debate' : 'English Speech', t: defaultFaculty.eng, r: defaultFaculty.room },
      { p: 'P4', s: isPrimary ? 'Social Values' : isSenior ? 'Computer Coding' : 'Social Studies', t: defaultFaculty.sst, r: defaultFaculty.room },
      { p: 'P5', s: isPrimary ? 'Sports & Yoga' : isSenior ? 'House Matches' : 'Sports & Yoga', t: defaultFaculty.pe, r: 'Playground' },
      { p: 'P6', s: isPrimary ? 'Music & Fun' : isSenior ? 'Co-Curricular Clubs' : 'Club Activities', t: defaultFaculty.art, r: 'Activity Hall' },
    ],
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()];

  return DAYS_OF_WEEK.map((day) => {
    const rawPeriods = scheduleConfig[day] || scheduleConfig.Monday;
    const isToday = day === todayDayName;

    const periods = rawPeriods.map((slot) => {
      const slotDef = PERIOD_SLOTS.find((p) => p.id === slot.p) || { time: '08:30 - 09:15' };
      const theme = getSubjectTheme(slot.s);
      return {
        periodId: slot.p,
        time: slotDef.time,
        subject: slot.s,
        teacher: slot.t,
        room: slot.r,
        theme,
      };
    });

    return {
      day,
      isToday,
      periods,
    };
  });
};

// Generates ultra-crisp, high resolution SVG vector routine photo data URL for any class
export const generateClassTimetableSVG = (className = 'Class 10-A', options = {}) => {
  const schedule = getClassSchedule(className);
  const cleanClassName = className.toUpperCase();
  const schoolName = options.schoolName || 'EDUSPHERE 360 ACADEMY';
  const session = options.session || 'ACADEMIC SESSION 2026-2027';

  const dayColors = {
    Monday: { headerBg: '%233730a3', badgeBg: '%23e0e7ff', text: '%233730a3' },
    Tuesday: { headerBg: '%231e40af', badgeBg: '%23dbeafe', text: '%231e40af' },
    Wednesday: { headerBg: '%23065f46', badgeBg: '%23d1fae5', text: '%23065f46' },
    Thursday: { headerBg: '%2392400e', badgeBg: '%23fef3c7', text: '%2392400e' },
    Friday: { headerBg: '%236b21a8', badgeBg: '%23f3e8ff', text: '%236b21a8' },
    Saturday: { headerBg: '%239f1239', badgeBg: '%23ffe4e6', text: '%239f1239' },
  };

  let rowsSvg = '';
  let yPos = 170;

  schedule.forEach((daySchedule) => {
    const { day, periods } = daySchedule;
    const colors = dayColors[day] || dayColors.Monday;

    // Day label container
    rowsSvg += `
    <rect x="30" y="${yPos}" width="940" height="66" fill="white" rx="6" stroke="%23e2e8f0"/>
    <rect x="30" y="${yPos}" width="100" height="66" fill="${colors.badgeBg}" rx="6"/>
    <text x="80" y="${yPos + 38}" fill="${colors.text}" font-size="12" font-weight="bold" text-anchor="middle">${day.toUpperCase()}</text>
    `;

    // 6 Period columns
    const colX = [210, 350, 490, 630, 770, 900];
    periods.forEach((p, idx) => {
      const cx = colX[idx] || (210 + idx * 140);
      const safeSubject = encodeURIComponent(p.subject);
      const safeTeacher = encodeURIComponent(p.teacher.split(' ')[0] + ' (' + p.room + ')');

      rowsSvg += `
      <text x="${cx}" y="${yPos + 28}" fill="%230f172a" font-size="12" font-weight="bold" text-anchor="middle">${safeSubject}</text>
      <text x="${cx}" y="${yPos + 48}" fill="%2364748b" font-size="10" text-anchor="middle">${safeTeacher}</text>
      `;
    });

    yPos += 72;
  });

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${yPos + 80}" viewBox="0 0 1000 ${yPos + 80}" style="background:%23f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="hdrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%234338ca"/>
      <stop offset="50%" stop-color="%233b82f6"/>
      <stop offset="100%" stop-color="%230ea5e9"/>
    </linearGradient>
  </defs>
  
  <!-- Header Banner -->
  <rect x="0" y="0" width="1000" height="95" fill="url(%23hdrGrad)"/>
  <text x="30" y="44" fill="white" font-size="22" font-weight="800" letter-spacing="0.5">${encodeURIComponent(schoolName)}</text>
  <text x="30" y="72" fill="%23e0e7ff" font-size="13" font-weight="600">${encodeURIComponent(session)} • OFFICIAL TIMETABLE ROUTINE</text>
  
  <rect x="800" y="24" width="170" height="46" rx="8" fill="white" fill-opacity="0.22"/>
  <text x="885" y="52" fill="white" font-size="15" font-weight="800" text-anchor="middle">${encodeURIComponent(cleanClassName)}</text>

  <!-- Table Column Headers -->
  <rect x="30" y="115" width="940" height="46" fill="%231e293b" rx="8"/>
  <text x="80" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">DAY / PERIOD</text>
  <text x="210" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P1 (08:30-09:15)</text>
  <text x="350" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P2 (09:15-10:00)</text>
  <text x="490" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P3 (10:15-11:00)</text>
  <text x="630" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P4 (11:00-11:45)</text>
  <text x="770" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P5 (12:30-01:15)</text>
  <text x="900" y="143" fill="white" font-size="12" font-weight="bold" text-anchor="middle">P6 (01:15-02:00)</text>

  <!-- Dynamic Days Rows -->
  ${rowsSvg}

  <!-- Footer Notice -->
  <rect x="30" y="${yPos}" width="940" height="50" fill="%23f1f5f9" rx="8" stroke="%23cbd5e1"/>
  <text x="50" y="${yPos + 30}" fill="%23475569" font-size="11" font-weight="600">📌 NOTE: Recess / Lunch Break is scheduled daily between 11:45 AM and 12:30 PM. Punctuality is mandatory.</text>
  <text x="950" y="${yPos + 30}" fill="%234f46e5" font-size="12" font-weight="bold" text-anchor="end">Academic Controller Signature ✍️</text>
</svg>`;

  return `data:image/svg+xml;utf8,${svgContent}`;
};

// Generates complete initial dictionary for all registered classes
export const generateInitialTimetableData = (classList = []) => {
  const defaultClasses = [
    'Nursery', 'LKG', 'UKG',
    'Class 1-A', 'Class 2-A', 'Class 3-A', 'Class 4-A', 'Class 5-A',
    'Class 6-A', 'Class 7-A', 'Class 8-A', 'Class 9-A', 'Class 10-A',
    'Class 11-Science', 'Class 12-Science'
  ];

  const targetClasses = classList.length > 0
    ? classList.map(c => typeof c === 'string' ? c : c.name)
    : defaultClasses;

  const timetableMap = {};

  targetClasses.forEach((clsName) => {
    timetableMap[clsName] = {
      photo: generateClassTimetableSVG(clsName),
      title: `${clsName} Weekly Timetable & Academic Routine`,
      uploadedBy: 'Dr. Alok Verma (Academic Director)',
      updatedAt: '2026-10-01T09:00:00.000Z',
      notes: 'Lab coats mandatory for Physics/Chemistry practicals. Saturday 5th & 6th periods are dedicated to Co-Curricular & Club Activities.',
      schedule: getClassSchedule(clsName),
    };
  });

  return timetableMap;
};
