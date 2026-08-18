# 🏥 MediYatra — Global Healthcare & Medical Tourism Platform

**MediYatra** is an integrated, end-to-end digital health platform designed to connect international patients with accredited hospital networks, senior medical specialists, and medical tourism concierge services across India.

---

## 🌟 Key Features

### 1. 🌐 Public Website (No Login Required)
- **Hospital Explorer**: Browse JCI & NABH accredited hospitals by city, accreditation, and specialties.
- **Find Doctors**: Search board-certified specialists, department heads, OPD consultation fees, and qualifications.
- **Surgical Cost Calculator**: Transparent package pricing comparisons (India vs. US/UK hospital costs with up to 90% savings).
- **Medical Tourism Concierge**: Fast-track e-Medical Visa Invitation Letters, 24/7 certified language interpreters, serviced recovery guest suites, and wheelchair airport transfers.
- **AI Symptom Triage**: Smart clinical questionnaire for preliminary specialty recommendations.
- **Emergency SOS Hotline**: 24/7 ICU Air Ambulance & Ground MedEvac dispatch portal.

### 2. 🔐 Role-Based Access Control (RBAC) & Portals

| ROLE | DEDICATED PORTAL | KEY CAPABILITIES & RESPONSIBILITIES |
| :--- | :--- | :--- |
| **Patient** | `My Health Portal` | Submit consultation inquiries, book OPD appointments, track consultation responses, upload medical records, view lab reports & digital prescriptions. |
| **Doctor** | `Doctor Desk` | Review incoming patient clinical cases, issue treatment advice notes, update case status, issue digital prescriptions, and customize directory profile (fees, degrees, photo). |
| **Hospital** | `Hospital Desk` | Manage hospital doctor roster, oversee inpatient/ICU bed capacity, and confirm patient appointments booked for their hospital branch. |
| **Admin** | `Admin Panel` | Global hospital & doctor CRUD management, surgical package tariffs, system logs, and **Booked Medical Tourism Concierge Orders** management. |

---

## 🔑 Pre-Registered Test Accounts

| ROLE | LOGIN EMAIL (ID) | PASSWORD | ACCESSIBLE PORTAL |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@mediyatra.org` | `password123` | **My Health Portal** |
| **Doctor** | `doctor@mediyatra.org` | `password123` | **Doctor Desk** |
| **Hospital** | `hospital@mediyatra.org` | `password123` | **Hospital Desk** |
| **Admin** | `admin@mediyatra.org` | `password123` | **Admin Panel** |

*Note: You can also register a **brand new account** under any role on the Sign In / Register modal.*

---

## 🚀 Technology Stack

- **Frontend**: React 18, Vite 5, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv
- **Database**: MongoDB (with automated fallback in-memory cache resilience)
- **API Standard**: RESTful JSON API

---

## 📡 Key REST API Endpoints

| METHOD | ENDPOINT | DESCRIPTION |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register new user (Patient, Doctor, Hospital, Admin) |
| `POST` | `/api/users/login` | Authenticate user & return user profile |
| `GET` / `POST` | `/api/hospitals` | Fetch accredited hospital list / Add new hospital |
| `GET` / `POST` | `/api/doctors` | Fetch specialist directory / Add doctor |
| `PATCH` | `/api/doctors/profile` | Update doctor directory profile credentials |
| `GET` / `POST` | `/api/consultations` | Fetch patient-doctor consultations / Submit case |
| `PATCH` | `/api/consultations/:id/response` | Doctor issues clinical response to patient |
| `GET` / `POST` | `/api/appointments` | Fetch appointments / Book OPD appointment |
| `PATCH` | `/api/appointments/:id/status` | Update appointment status (`Confirmed`, `Completed`, `Cancelled`) |
| `GET` / `POST` | `/api/tourism` | Fetch concierge orders / Book visa, interpreter, suite, pickup |
| `PATCH` | `/api/tourism/:id/status` | Admin updates tourism order status |

---

## 💻 Installation & Local Development

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (Optional: app includes built-in fallback resilience cache)

### 2. Backend Setup
```bash
cd backend
npm install
node seeder.js   # Seed default demo accounts & initial data
node server.js   # Running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Running on http://localhost:5173
```

---

## 📂 Project Structure

```text
MediYatra/
├── backend/
│   ├── config/          # Database connection setup
│   ├── controllers/     # Express route logic (User, Consultation, Doctor, Hospital, Tourism, etc.)
│   ├── models/          # Mongoose Schemas (User, Consultation, TourismOrder, Doctor, Hospital, etc.)
│   ├── routes/          # API Route declarations
│   ├── seeder.js        # Seed database script
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Navbar, DoctorPortal, HospitalPortal, AdminDashboard, etc.)
│   │   ├── data/        # Fallback datasets
│   │   ├── services/    # API Service client
│   │   ├── App.jsx      # Main application router & state
│   │   └── main.jsx     # Vite React entry point
│   └── vite.config.js   # Vite configuration with API proxy
└── README.md
```

---

## 📄 License
This project is developed for **MediYatra Medical Tourism Network**. All rights reserved.
