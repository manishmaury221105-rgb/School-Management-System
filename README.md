# EduSphere 360 - Enterprise School Management System (SMS)

EduSphere 360 is a modern, commercial-grade, multi-tenant capable, and fully responsive **School Management System (SMS)** built for **Web, iOS (Native Capacitor / iPadOS / PWA)**, and **Android**.

Designed to empower school administrations, faculty, students, and parents with seamless digital workflows, real-time analytics, and strict **Role-Based Access Control (RBAC)**.

---

## 📑 Table of Contents
1. [🌟 Architecture & Core Roles](#-architecture--core-roles)
2. [🔑 Demo Login Credentials](#-demo-login-credentials)
3. [⚙️ System Requirements & Tech Stack](#️-system-requirements--tech-stack)
4. [🚀 Local Setup & Installation](#-local-setup--installation)
5. [🗄️ Database Schema & Prisma Migration](#️-database-schema--prisma-migration)
6. [🔐 Environment Variables (.env)](#-environment-variables-env)
7. [📱 Mobile Native App Setup (iOS & Android)](#-mobile-native-app-setup-ios--android)
8. [🚢 Production Deployment Guide](#-production-deployment-guide)
9. [📖 Role-by-Role User Guides](#-role-by-role-user-guides)
   - [🏛️ Admin Usage Guide](#-admin-usage-guide)
   - [👩‍🏫 Teacher Usage Guide](#-teacher-usage-guide)
   - [🎒 Student Usage Guide](#-student-usage-guide)
   - [👨‍👩‍👧 Parent Usage Guide](#-parent-usage-guide)
10. [🛡️ Security & RBAC Enforcement](#️-security--rbac-enforcement)

---

## 🌟 Architecture & Core Roles

EduSphere 360 enforces four distinct user personas with strict server-side and client-side access control:

| Role | Target Persona | Key Responsibilities & Features |
| :--- | :--- | :--- |
| 🏛️ **ADMIN** | Institutional Leadership, Registrar, Finance Head | Full governance over students, teachers, parents, classes, subjects, fee structure & collection, timetables, examination schedules, library catalog, transport fleets, notices, events, leaves, and institutional audit reports. |
| 👩‍🏫 **TEACHER** | Faculty & Class In-charges | Class roster management, daily interactive attendance register, digital homework assignment & grading, exam marks entry with automatic letter grade / GPA calculation, student performance analytics, and study material uploads. |
| 🎒 **STUDENT** | Enrolled Students (K-12) | Holographic digital ID card with verifiable QR code, daily & subject-wise attendance analytics, weekly timetable with ongoing class tracker, homework submissions with attachments, exam schedule & printable marksheets, online fee payment with receipt generator. |
| 👨‍👩‍👧 **PARENT** | Guardians / Parents | Multi-child 1-click switcher (e.g., Rohan in 10-A, Maya in 6-B), real-time attendance monitor, homework tracker, academic report cards, online fee payment, leave applications with teacher approval tracking, and circular bulletins. |

---

## 🔑 Demo Login Credentials

All demo accounts come pre-configured with realistic mock data, academic records, and fee structures.

| Role | Email Address | Password | Quick Switch Available |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@edusphere.edu` | `Admin@123` | ✅ Yes (Topbar Role Switcher) |
| **Teacher** | `teacher.sarah@edusphere.edu` | `Teacher@123` | ✅ Yes (Topbar Role Switcher) |
| **Student** | `student.rohan@edusphere.edu` | `Student@123` | ✅ Yes (Topbar Role Switcher) |
| **Parent** | `parent.anita@edusphere.edu` | `Parent@123` | ✅ Yes (Topbar Role Switcher) |

> 💡 **Quick Switch Tip**: You can also use the **Role Switcher Dropdown** in the top navigation bar to seamlessly test any role without re-logging in.

---

## ⚙️ System Requirements & Tech Stack

### Frontend & Mobile
- **Core**: React 19, Vite, TypeScript/JavaScript
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations, Dark/Light Themes
- **Icons**: Lucide React
- **Mobile Engine**: Capacitor 7 (Native iOS & Android compilation), Progressive Web App (PWA) with WebAPK manifests
- **Charts & Data Viz**: Responsive Canvas / SVG Charts & Gauges

### Backend & Database
- **Database**: PostgreSQL 14+
- **ORM**: Prisma ORM with comprehensive relational schema
- **Security**: Strict RBAC, Input Sanitization, Parametric Queries, Cryptographic Password Hashing (bcrypt)
- **Document Generation**: Dynamic HTML5-to-PDF / Printable Receipts & Result Marksheets

---

## 🚀 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/manishmaury221105-rgb/School-Management-System.git
cd School-Management-System
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

### 4. Launch Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🗄️ Database Schema & Prisma Migration

The project includes an enterprise-grade relational database schema in [`prisma/schema.prisma`](file:///Users/dinanathmaurya/Documents/GitHub/Portfolio/Portfolio/School-Management-System/prisma/schema.prisma) supporting over 20 relational models:

```mermaid
erDiagram
    USER ||--o| STUDENT : profile
    USER ||--o| TEACHER : profile
    USER ||--o| PARENT : profile
    CLASS ||--|{ SECTION : contains
    CLASS ||--|{ SUBJECT : teaches
    STUDENT }|--|| CLASS : enrolled_in
    STUDENT }|--|| PARENT : guardian
    TEACHER ||--o{ CLASS : class_teacher
    STUDENT ||--o{ ATTENDANCE : logs
    STUDENT ||--o{ FEE_INVOICE : billed
    FEE_INVOICE ||--o{ PAYMENT : settles
    EXAM ||--|{ EXAM_MARK : evaluates
    STUDENT ||--o{ EXAM_MARK : receives
    TEACHER ||--o{ HOMEWORK : assigns
    STUDENT ||--o{ HOMEWORK_SUBMISSION : submits
```

### Running Migrations with PostgreSQL
1. Ensure your PostgreSQL server is running and `DATABASE_URL` in `.env` is set.
2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Explore and manage database records visually:
   ```bash
   npx prisma studio
   ```

---

## 🔐 Environment Variables (.env)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://postgres:password@localhost:5432/edusphere_db?schema=public` |
| `JWT_SECRET` | Secret for token signing | `edusphere_super_secure_jwt_token_2026_xyz` |
| `PORT` | API Server Port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary storage bucket | `edusphere-media` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `secret_abcdef123456` |
| `RAZORPAY_KEY_ID` | Razorpay payment key | `rzp_test_1234567890` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `rzp_secret_abcdef` |
| `STRIPE_SECRET_KEY` | Stripe gateway secret | `sk_test_51Mz...` |

---

## 📱 Mobile Native App Setup (iOS & Android)

EduSphere 360 is cross-platform and includes native Capacitor shells.

### iOS (Xcode & Simulator)
1. Build web assets and sync to iOS:
   ```bash
   npm run build
   npx cap sync ios
   ```
2. Open in Xcode:
   ```bash
   npx cap open ios
   ```
3. Run on Simulator or connected iPhone directly from Xcode.

### Android (Android Studio)
1. Add Android platform (if not already added):
   ```bash
   npx cap add android
   npm run build
   npx cap sync android
   ```
2. Open in Android Studio:
   ```bash
   npx cap open android
   ```

---

## 🚢 Production Deployment Guide

### Option 1: Vercel / Netlify (Web Deployment)
1. Connect your GitHub repository to Vercel/Netlify.
2. Set Framework Preset to **Vite**.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add all environment variables from `.env.example` in the dashboard.
5. Deploy!

### Option 2: Docker Containerization
Build and run the production container:
```bash
docker build -t edusphere360:latest .
docker run -p 80:80 -d edusphere360:latest
```

---

## 📖 Role-by-Role User Guides

### 🏛️ Admin Usage Guide
1. **Student Directory**: Click **Students** in the sidebar to enroll new students, edit personal/guardian details, filter by class/status, and export CSV lists.
2. **Faculty Management**: Go to **Teachers** to register staff, assign subject specializations, and designate Class Teachers.
3. **Academic Setup**: Manage **Classes & Sections** and allocate **Subjects** with maximum/passing mark benchmarks.
4. **Fees & Billing**: Access **Fee Management** to create fee structures, view pending/overdue accounts, and log manual payments.
5. **Notice Broadcast**: Publish institutional circulars with target audience selection (All, Teachers, Students, Parents).
6. **Reports Center**: Export and print student registers, financial audits, attendance summaries, and academic result logs.

### 👩‍🏫 Teacher Usage Guide
1. **Daily Attendance**: Open **Attendance** to select your class and section. Use the bulk **"Mark All Present"** button or toggle individual students (Present, Absent, Late, Leave). Click **Save Attendance Register** to persist records.
2. **Homework Hub**: Navigate to **Homework** to assign new tasks, set submission deadlines, and review student attachments. Mark submissions as *Checked* with customized feedback.
3. **Gradebook & Marksheets**: In **Marks / Results**, select the Examination (e.g. Midterm 2026), enter student marks, and the system will automatically compute percentages, letter grades (A+, A, B, etc.), and Pass/Fail statuses.
4. **Study Material**: Upload lecture notes, syllabus guides, and reference documents categorized by class and subject.
5. **Leave Requests**: Review and approve or reject leave applications submitted by parents and students.

### 🎒 Student Usage Guide
1. **Digital Student ID**: View and scan your holographic Digital Student ID with QR code verification on the **My Profile** tab.
2. **Live Attendance**: Monitor subject-wise attendance percentages and receive automatic warnings if attendance drops below 75%.
3. **Weekly Timetable**: Check your daily lecture timetable with a live badge highlighting the ongoing period and room number.
4. **Homework Submissions**: View assigned homework, upload completed work, and receive real-time celebration feedback on submission.
5. **Report Cards**: View published exam results and print or download official grade sheets.
6. **Online Fee Payment**: Settle pending tuition fees via the secure checkout dialog (UPI/Card) and immediately generate printable fee receipts.

### 👨‍👩‍👧 Parent Usage Guide
1. **Child Switcher**: Use the **Switch Child** buttons at the top of the Parent Dashboard to toggle between multiple enrolled children (e.g. *Rohan Sharma* and *Maya Sharma*).
2. **Attendance Tracking**: View your child's daily presence logs and monthly percentages.
3. **Academic Oversight**: Keep track of pending homework deadlines, teacher remarks, and published exam scores.
4. **Fee Settlement**: Pay outstanding school fees online with one click and download official tax/fee receipts.
5. **Apply for Leave**: Submit formal leave requests specifying the date range and reason, and track teacher approval status in real time.

---

## 🛡️ Security & RBAC Enforcement

1. **RoleGuard Component**: Protects sensitive views and intercepts unauthorized route accesses.
2. **Zero Plaintext Secrets**: Passwords in database models are salted and hashed using standard bcrypt algorithms.
3. **Isolated Student/Parent Scope**: Parents can only access records belonging to their linked children.
4. **Teacher Boundary**: Teachers can only edit marks, attendance, and assignments for classes assigned to them.
5. **Full Auditability**: Every payment transaction, attendance log, and leave submission is timestamped with user metadata.

---

© 2026 EduSphere 360 Systems. All Rights Reserved.
