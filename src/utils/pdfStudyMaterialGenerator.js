import { jsPDF } from 'jspdf';
import { triggerPdfDownload, triggerPdfPrint } from './pdfDownloadHelper';

/**
 * Returns curriculum rich content based on subject and topic
 */
function getSubjectStudyContent(subject, chapter, topic) {
  const s = (subject || '').toLowerCase();

  if (s.includes('math')) {
    return {
      overview: 'Comprehensive mathematical formulas, theorems, step-by-step proofs, and solved exemplar problems for high academic scoring.',
      keyConcepts: [
        { heading: '1. Standard Formulas & Identities', text: '• Arithmetic Progression (AP): an = a + (n - 1)d, Sn = n/2 [2a + (n - 1)d]\n• Quadratic Equation: x = (-b ± √(b² - 4ac)) / (2a); Discriminant D = b² - 4ac\n• Trigonometric Identities: sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ\n• Coordinate Geometry: Distance d = √((x₂ - x₁)² + (y₂ - y₁)²); Section formula: ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))' },
        { heading: '2. Theorem Summary & Proof Highlights', text: '• Basic Proportionality Theorem (Thales): Line parallel to one side of triangle divides other two sides in equal ratio.\n• Tangent Theorem: Tangent to circle is perpendicular to the radius at point of contact.\n• Circles: Lengths of tangents drawn from an external point to a circle are equal.' },
        { heading: '3. Solved Exemplar Questions', text: 'Q1: Find the 20th term of AP 3, 8, 13, 18...\nAns: a = 3, d = 5 => a₂₀ = 3 + (19 × 5) = 3 + 95 = 98.\n\nQ2: Find roots of 2x² - 7x + 3 = 0.\nAns: (2x - 1)(x - 3) = 0 => x = 1/2 or x = 3.' },
        { heading: '4. Critical Board Exam Tips', text: '• Always draw neat geometric figures with labelled vertices.\n• State the formula before substituting numerical values to secure step-marking.\n• Double check calculation signs (+ / -) in discriminant and trigonometry.' }
      ]
    };
  }

  if (s.includes('physic') || s.includes('science')) {
    return {
      overview: 'Fundamental physics laws, ray diagrams, derivation steps, unit conversions, and conceptual numerical problem solving.',
      keyConcepts: [
        { heading: '1. Core Laws & Governing Equations', text: '• Snell\'s Law of Refraction: n₁ sin(i) = n₂ sin(r); Refractive Index n = c / v\n• Mirror Formula: 1/f = 1/v + 1/u; Magnification m = -v/u = h\'/h\n• Lens Formula: 1/f = 1/v - 1/u; Power of Lens P = 1/f (in meters, unit: Dioptre D)\n• Ohm\'s Law: V = IR; Joule\'s Heating: H = I²Rt; Electrical Power: P = VI = I²R = V²/R' },
        { heading: '2. Sign Convention & Ray Diagrams', text: '• Distances measured in direction of incident light are positive (+), opposite are negative (-).\n• Focal length of concave mirror/lens is negative (-); convex mirror/lens is positive (+).\n• Real & inverted images formed when rays actually intersect.' },
        { heading: '3. Solved Conceptual Problem', text: 'Q: An object 4 cm tall is placed 25 cm in front of a concave mirror of focal length 15 cm. Find image distance and nature.\nAns: u = -25 cm, f = -15 cm => 1/v = 1/f - 1/u = -1/15 + 1/25 = -2/75 => v = -37.5 cm (Real, inverted & enlarged).' },
        { heading: '4. Laboratory & Exam Safety Guidelines', text: '• Check zero error in vernier callipers and ammeter/voltmeter dials.\n• Ensure ray diagrams have directional arrows indicating light propagation.\n• Express all final answers with correct SI units (Watts, Joules, Amperes, Volts).' }
      ]
    };
  }

  if (s.includes('chem')) {
    return {
      overview: 'Periodic trends, balanced chemical equations, stoichiometry, reaction mechanisms, and qualitative analysis tests.',
      keyConcepts: [
        { heading: '1. Important Chemical Reactions & Types', text: '• Combination Reaction: CaO + H₂O → Ca(OH)₂ (Slaked lime) + Heat\n• Decomposition: 2FeSO₄(s) --Heat--> Fe₂O₃(s) + SO₂(g) + SO₃(g)\n• Displacement: Fe + CuSO₄(aq) → FeSO₄(aq) + Cu(s)\n• Neutralization: Acid + Base → Salt + Water (e.g. HCl + NaOH → NaCl + H₂O)' },
        { heading: '2. Periodic Table Trends', text: '• Atomic Radius: Increases down a group, decreases across a period.\n• Electronegativity: Decreases down a group, increases across a period (Fluorine is highest).\n• Ionization Energy: Increases across a period, decreases down a group.' },
        { heading: '3. Key Laboratory Tests & Colors', text: '• Carbon Dioxide Test: Turns lime water milky due to CaCO₃ precipitate.\n• Hydrogen Gas: Burns with a characteristic pop sound.\n• Litmus Paper: Blue turns red in acid (pH < 7), Red turns blue in base (pH > 7).' },
        { heading: '4. Memory Mnemonics & Exam Notes', text: '• Reactivity Series: "Please Stop Calling Me A Careless Zebra Instead Try Learning How Copper Saves Gold" (K, Na, Ca, Mg, Al, C, Zn, Fe, Sn, Pb, H, Cu, Ag, Au).' }
      ]
    };
  }

  if (s.includes('computer') || s.includes('code') || s.includes('ai')) {
    return {
      overview: 'Data structures, algorithm complexity, object-oriented principles, SQL database queries, and clean programming paradigms.',
      keyConcepts: [
        { heading: '1. Python Syntax & Data Types', text: '• Lists (mutable): my_list = [1, 2, 3]; Tuples (immutable): my_tuple = (1, 2, 3)\n• Dictionaries: my_dict = {"key": "value"}; Sets: my_set = {1, 2, 3}\n• List Comprehensions: [x**2 for x in range(10) if x % 2 == 0]\n• Lambda Functions: square = lambda x: x * x' },
        { heading: '2. Standard SQL Queries & Schema', text: '• SELECT * FROM Students WHERE marks >= 90 ORDER BY roll_no ASC;\n• INSERT INTO Attendance (student_id, date, status) VALUES (\'STU-1\', \'2026-10-07\', \'Present\');\n• UPDATE Fees SET status = \'Paid\' WHERE receipt_no = \'REC-1001\';\n• JOIN: SELECT s.name, g.grade FROM Students s INNER JOIN Grades g ON s.id = g.student_id;' },
        { heading: '3. Algorithm Complexity & Best Practices', text: '• Binary Search: O(log n) time complexity on sorted arrays.\n• Sorting: Merge Sort O(n log n), Quick Sort average O(n log n).\n• Clean Code: Use meaningful variable names, docstrings, and modular functions.' },
        { heading: '4. Practical Exam Checklist', text: '• Check syntax indentation in Python blocks.\n• Validate data types and handle edge cases (empty lists, division by zero, null inputs).\n• Comment your code clearly for internal assessment marks.' }
      ]
    };
  }

  return {
    overview: 'Core syllabus notes, analytical summaries, critical terminology, and key practice points designed for comprehensive exam preparation.',
    keyConcepts: [
      { heading: '1. Chapter Foundations & Core Themes', text: `• Detailed analysis and comprehensive breakdown of ${chapter || 'curriculum unit'}.\n• Main concepts, definitions, and institutional standards applicable for the 2026-2027 academic session.\n• Primary terminology and foundational principles for high academic retention.` },
      { heading: '2. Key Summary Points & Terminology', text: '• Point 1: Deep conceptual understanding helps in tackling application-based questions.\n• Point 2: Regular revision and solving exemplar sets boosts subject confidence.\n• Point 3: Structured answers with bullet points improve score clarity.' },
      { heading: '3. Solved Practice Questions', text: 'Q1: Explain the fundamental importance of this unit in the semester curriculum.\nAns: This unit forms the prerequisite conceptual baseline for advanced assessments and board examinations.\n\nQ2: What are the primary evaluation criteria for this topic?\nAns: Conceptual clarity, accurate step-by-step presentation, and structured conclusion.' },
      { heading: '4. Study Strategy & Faculty Recommendation', text: '• Allocate 30 minutes daily for structured problem practice.\n• Review highlighted notes 48 hours prior to term tests.\n• Consult your subject faculty during tutorial hours for doubt clearance.' }
    ]
  };
}

/**
 * Creates an official PDF document for a Study Material / Notes
 */
export function createStudyMaterialPdfDoc(material) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const title = material.title || 'Course Study Material & Revision Notes';
  const subject = material.subject || 'General Studies';
  const className = material.class || 'Class 10-A';
  const chapter = material.chapter || 'Unit 1';
  const topic = material.topic || 'Core Curriculum Concepts';
  const uploadedBy = material.uploadedBy || 'Academic Faculty';
  const uploadedDate = material.uploadedDate || new Date().toISOString().split('T')[0];
  const fileType = material.fileType || 'PDF';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4);

  // Inner Border Accent
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, 3, 3);

  // Top Header Banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, margin, contentWidth, 25, 4, 4, 'F');
  doc.rect(margin, margin + 17, contentWidth, 8, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('EDUSPHERE INTERNATIONAL ACADEMY', pageWidth / 2, margin + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('CBSE Affiliated Senior Secondary School • Digital Knowledge Repository', pageWidth / 2, margin + 13, { align: 'center' });
  doc.setFontSize(7);
  doc.text('Knowledge Park III, Institutional Area • Student Learning Portal • Session 2026-2027', pageWidth / 2, margin + 18, { align: 'center' });

  // Document Title Banner
  let y = margin + 30;
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 10, 2, 2, 'FD');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('OFFICIAL CURRICULUM STUDY GUIDE & REVISION NOTES', pageWidth / 2, y + 6.5, { align: 'center' });

  // Metadata Box
  y += 14;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 28, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DOCUMENT SPECIFICATIONS & COURSE DETAILS', margin + 8, y + 5.5);

  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 8, y + 7.5, pageWidth - margin - 8, y + 7.5);

  const col1 = margin + 8;
  const col2 = pageWidth / 2 + 4;
  let infoY = y + 13.5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Material Title:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(title.length > 38 ? title.substring(0, 36) + '...' : title, col1 + 24, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Target Class:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(className, col2 + 22, infoY);

  infoY += 6;
  doc.setTextColor(107, 114, 128);
  doc.text('Subject & Unit:', col1, infoY);
  doc.setTextColor(79, 70, 229);
  doc.text(`${subject} • ${chapter}`, col1 + 24, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Published By:', col2, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(uploadedBy, col2 + 22, infoY);

  infoY += 6;
  doc.setTextColor(107, 114, 128);
  doc.text('Topic Focus:', col1, infoY);
  doc.setTextColor(17, 24, 39);
  doc.text(topic.length > 40 ? topic.substring(0, 38) + '...' : topic, col1 + 24, infoY);

  doc.setTextColor(107, 114, 128);
  doc.text('Release Date:', col2, infoY);
  doc.setTextColor(16, 185, 129);
  doc.text(`${uploadedDate} (Verified)`, col2 + 22, infoY);

  // Content Sections
  y += 32;
  const data = getSubjectStudyContent(subject, chapter, topic);

  // Overview Bar
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 12, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('EXECUTIVE SYLLABUS OVERVIEW:', margin + 7, y + 4.5);

  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(data.overview, margin + 7, y + 9);

  y += 16;

  // Key Sections Boxes
  data.keyConcepts.forEach((section) => {
    if (y > pageHeight - margin - 35) {
      doc.addPage();
      y = margin + 10;
    }

    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    
    // Split text into lines
    const lines = doc.splitTextToSize(section.text, contentWidth - 16);
    const boxHeight = 10 + (lines.length * 4.2);

    doc.roundedRect(margin + 4, y, contentWidth - 8, boxHeight, 2, 2, 'FD');

    doc.setTextColor(79, 70, 229);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(section.heading, margin + 8, y + 5.5);

    doc.setDrawColor(229, 231, 235);
    doc.line(margin + 8, y + 7, pageWidth - margin - 8, y + 7);

    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(lines, margin + 8, y + 12);

    y += boxHeight + 4;
  });

  // Footer & Institutional Seal (on last page)
  const footerY = pageHeight - margin - 6;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 4, footerY - 2, pageWidth - margin - 4, footerY - 2);

  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('EduSphere 360™ Academic Information & Resource System • CBSE Curriculum Compliant', margin + 6, footerY + 2);
  doc.text(`Official Course Document • Downloaded on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - margin - 6, footerY + 2, { align: 'right' });

  return doc;
}

/**
 * Triggers PDF download for a study material item
 */
export async function downloadStudyMaterialPdf(material) {
  try {
    const doc = createStudyMaterialPdfDoc(material);
    const cleanTitle = (material.title || 'Study_Material').replace(/[^a-zA-Z0-9]/g, '_');
    const cleanSubject = (material.subject || 'Subject').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${cleanSubject}_${cleanTitle}.pdf`;
    return await triggerPdfDownload(doc, fileName, `${material.subject} - ${material.title}`);
  } catch (err) {
    console.error('Failed to download study material PDF:', err);
    return { success: false, error: err };
  }
}

/**
 * Prints study material PDF
 */
export function printStudyMaterialPdf(material) {
  try {
    const doc = createStudyMaterialPdfDoc(material);
    return triggerPdfPrint(doc);
  } catch (err) {
    console.error('Failed to print study material PDF:', err);
    window.print();
    return false;
  }
}
