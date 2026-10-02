# EduSphere 360 - Cross-Platform School Management System (Android, iOS & Web)

**EduSphere 360** is a full-featured, modern, high-performance School Management System with strict **Role-Based Access Control (RBAC)** designed for **Android, iOS (Capacitor/PWA)**, and **Web**.

---

## 🌟 4 Core User Roles & Strict RBAC Matrix

| Role | Primary Permissions & Features | Demo Account |
|---|---|---|
| 🏛️ **ADMIN** | **Full Institutional Control**: Student Directory (Enroll/Edit/Export), Faculty Management, Class & Room Allocation, Fee Governance, Global Circular Broadcaster, Master Timetable, System Settings & DB Reset. | `admin@edusphere.edu` |
| 👩‍🏫 **TEACHER** | **Faculty Operations**: Assigned Class Rosters, Interactive Daily Attendance Register with Bulk Toggles & Live %, Homework Creator & Submission Grading, Examination Gradebook with auto GPA/Letter grade computation, Student Analytics & At-Risk Alerts, Parent Leave Approval Hub. | `teacher.sarah@edusphere.edu` |
| 🎒 **STUDENT** | **Student Life & Learning**: Holographic Digital Student ID Card with QR Verification, Live Subject-Wise Attendance Gauges, Real-Time Interactive Weekly Timetable with Ongoing Class Indicator, Homework Submission Hub with Celebration Confetti, Exam Hall Tickets & Report Cards, Instant Simulated Fee Payment Gateway (UPI / Card) with Official Downloadable Receipts. | `student.rohan@edusphere.edu` |
| 👨‍👩‍👧 **PARENT** | **Multi-Child 360° Oversight**: Instant 1-Click Child Switcher (**Rohan Sharma - Grade 10-A** & **Maya Sharma - Grade 6-B**), Live Attendance Status, Daily Homework Oversight, Exam Marks & Teacher Evaluation Remarks, Direct Fee Payment & Receipts, Apply for Student Leave with Teacher Remarks Tracking, PTM Bulletins. | `parent.anita@edusphere.edu` |

---

## 📱 Cross-Platform Architecture (Android, iOS, Web)

- **Native Device Simulator**: Top navigation bar allows switching between **iOS (iPhone 16 Pro Dynamic Island)**, **Android (Samsung Galaxy S24 Ultra Punch Hole)**, **iPadOS Tablet**, and **Full Desktop Web**.
- **Mobile Native Shell**:
  - Touch-friendly bottom navigation bar with active indicators
  - Mobile status bar (Wi-Fi, Battery, Clock) and home indicator
  - PWA WebAPK & iOS Safari "Add to Home Screen" meta tags
  - Built with standard Vite + React, easily wrapped via `@capacitor/core`, `@capacitor/ios`, and `@capacitor/android` for native App Store & Play Store releases.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build Production Bundle
```bash
npm run build
```

---

## 🔐 Strict Role-Based Access Control (RBAC) Architecture

- **`RoleGuard`**: Component-level and route-level protection that validates user role permissions before rendering any module. If an unauthorized attempt is detected, an institutional security warning is displayed with a 1-click safe return button.
- **`AuthContext`**: Manages active user identity, credentials validation, theme preferences, and quick role switching.
- **`SchoolDataContext`**: Reactive state management backed by `localStorage` persistence, allowing live CRUD operations (marking attendance, grading assignments, paying fees, posting notices, enrolling students, submitting leave applications) to persist across browser reloads.

---

## 🎨 Design & Aesthetic Highlights

- **Dark & Light Mode** with automatic contrast adaptation
- **Glassmorphism & Micro-animations** (`backdrop-filter: blur`, subtle glows, cubic-bezier transitions)
- **Holographic Digital Student ID Card** with QR verification code
- **Interactive Fee Payment Checkout** with UPI / Card options and printable official receipt generator
- **Celebration Confetti** on assignment submission and fee settlement
