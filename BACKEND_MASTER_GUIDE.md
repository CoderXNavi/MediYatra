# 🎓 MediYatra Backend Architecture & Viva Guide
**Comprehensive Master Guide for Hackathon Defense & Code Mastery**

---

## 📘 Table of Contents
1. **The Big Picture: How the Backend Works**
2. **The 3-Layer MVC Pattern (Routes → Controllers → Models)**
3. **Database Models & Schemas Explained Line-by-Line**
4. **Controllers & Business Logic Explained Line-by-Line**
5. **Express Server & Routing Setup (`server.js`)**
6. **The Offline-Resilient Fallback Mechanism**
7. **Top 10 Questions Judges Will Ask & Exact Answers to Give**

---

# 1. The Big Picture: How the Backend Works

Your backend is built using **Node.js** (the runtime), **Express.js** (the web framework), and **MongoDB** (the database) with **Mongoose ODM** (Object Data Modeling).

### What happens when a user clicks a button on the website?
1. **Client (Browser/React):** Sends an HTTP Request (e.g. `GET http://localhost:5000/api/hospitals`).
2. **Server (`server.js`):** Receives the request, passes it through security middleware (`cors` and `express.json()`), and directs it to the right route file (`routes/hospitalRoutes.js`).
3. **Router (`hospitalRoutes.js`):** Reads the URL path (`/`) and calls the corresponding controller function (`getHospitals`).
4. **Controller (`hospitalController.js`):** Runs the business logic. It queries MongoDB using the Mongoose model (`Hospital.find()`) or uses the fallback cache if MongoDB is offline.
5. **Database (MongoDB):** Retrieves the matching hospital records.
6. **Response:** Controller formats the data as JSON (`{ success: true, count: 5, data: [...] }`) and sends it back to the browser.

---

# 2. The 3-Layer MVC Pattern

We organized the backend into 3 distinct folders to keep the code clean and professional:

```text
backend/
├── models/       # Layer 1: Database Blueprints (Schemas defining data shapes)
├── controllers/  # Layer 2: Brains & Business Logic (Fetching, filtering, validation)
└── routes/       # Layer 3: Traffic Controllers (Mapping URLs to controller functions)
```

* **Models:** Define *WHAT* data looks like (e.g., A Doctor has a `name`, `specialty`, and `consultationFeeUSD`).
* **Controllers:** Define *HOW* data is manipulated (e.g., Find doctors with `experienceYears >= 15` and sort by fee).
* **Routes:** Define *WHERE* data can be accessed (e.g., `GET /api/doctors`).

---

# 3. Database Models & Schemas Explained

### A. Hospital Model (`models/Hospital.js`)
* **Purpose:** Stores accredited Indian hospitals, locations, facilities, and ratings.
* **Key Fields:**
  * `name`: Hospital name (e.g., "AIIMS Bathinda").
  * `city`, `state`, `country`, `address`: Geographic location for foreign travelers.
  * `specialties`: Array of strings (e.g., `['Cardiology', 'Orthopaedics']`).
  * `facilities`: Array of strings (e.g., `['VIP Suites', 'Translator Service', '24/7 Emergency']`).
  * `rating`: Number between 1.0 and 5.0.

### B. Doctor Model (`models/Doctor.js`)
* **Purpose:** Stores doctor profiles linked to their host hospital.
* **Key Concept (Mongoose Reference):**
  ```javascript
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital', // Creates a relational link to the Hospital collection!
    required: true
  }
  ```
  *This links every doctor directly to a specific hospital!*

### C. Treatment Model (`models/Treatment.js`)
* **Purpose:** Catalog of medical procedures with dual-currency transparency.
* **Key Fields:**
  * `estimatedCostUSD`: Price in US Dollars (for international patients).
  * `estimatedCostINR`: Price in Indian Rupees.
  * `durationDays`: Expected hospital stay duration for recovery planning.

### D. Appointment Model (`models/Appointment.js`)
* **Purpose:** Stores patient consultation requests.
* **Key Server-Side Validations:**
  * **Email Format Regex:** Ensures valid email syntax (`patientEmail`).
  * **Future Date Validation:** Enforces that `preferredDate` must be strictly in the future (`preferredDate > Date.now()`).
  * **Status Enum:** Restricts request status to strictly 4 values: `['Pending', 'Confirmed', 'Completed', 'Cancelled']`.

---

# 4. Controllers & Business Logic Explained

Every controller function uses `async (req, res, next)`:
* `req` (Request): Contains query parameters (`req.query`), URL params (`req.params`), and body data (`req.body`).
* `res` (Response): Used to send HTTP responses back to the client (`res.status(200).json(...)`).
* `next` (Error Handler): Passes unexpected errors to the global error middleware in `server.js`.

### Key Controllers Highlighted:

1. **`searchController.js` (Multi-Entity Search):**
   * Executes 3 parallel database queries using `Promise.all([Hospital.find(), Doctor.find(), Treatment.find()])`.
   * Returns matching hospitals, doctors, and procedures in one single network request!

2. **`aiController.js` (AI Recommendation Triage Engine):**
   * Takes patient symptoms (e.g. *"knee joint pain"*) and budget ($).
   * Runs text search regex across hospital specialties and descriptions to return tailored healthcare matches with compatibility scores (e.g. `matchScore: "98%"`).

3. **`reportController.js` (PDF Consultation Generator):**
   * Generates official consultation summary documents.
   * `exportReportPDF` formats data into printable HTML/PDF markup so international patients can print official invitation letters for Indian Embassy e-Medical Visa applications!

4. **`prescriptionController.js` (Post-Op Medication Tracker):**
   * Stores structured medication arrays containing `medicineName`, `dosage`, `frequency` (e.g., *"Twice daily after meals"*), and `durationDays`.

---

# 5. Express Server Setup (`server.js`)

`server.js` is the entry point of your application. Here is what each section does:

1. **`express()` Initialization:** Creates the web server instance.
2. **`connectDB()`:** Establishes connection to MongoDB via Mongoose.
3. **Middleware:**
   * `app.use(cors())`: Enables Cross-Origin Resource Sharing so frontend apps running on `localhost:3000` or `localhost:5173` can communicate with port 5000.
   * `app.use(express.json())`: Parses incoming JSON request bodies.
4. **Mounting Routes:** Maps base paths to route handlers:
   ```javascript
   app.use('/api/hospitals', require('./routes/hospitalRoutes'));
   app.use('/api/doctors', require('./routes/doctorRoutes'));
   app.use('/api/appointments', require('./routes/appointmentRoutes'));
   // ... 15 total API modules mounted
   ```
5. **404 Catch-All & Global Error Middleware:** Intercepts invalid URLs and unhandled server errors, returning clean JSON error objects instead of crashing the process!

---

# 6. The Offline-Resilient Fallback Mechanism

### Why is this crucial for your hackathon defense?
In hackathons, Wi-Fi or local database daemons (`mongod`) can freeze unexpectedly. To guarantee **Zero Downtime**, every controller checks the database connection state:

```javascript
if (mongoose.connection.readyState === 1) {
  // Connected to MongoDB -> Query live database!
  const data = await Hospital.find();
  return res.status(200).json({ success: true, data });
}

// Database is offline -> Serve authentic fallback cache instantly!
return res.status(200).json({
  success: true,
  dataSource: 'fallback-cache',
  data: fallbackHospitals
});
```

*Result:* Your presentation will **NEVER crash** or show blank screens during judge evaluation!

---

# 7. Top 10 Questions Judges Will Ask & Exact Answers

### Q1: "Walk me through your backend architecture."
> **Answer:** "Our backend follows a 3-layer MVC architecture built with Node.js, Express.js, and Mongoose ODM. We have separate directories for Models, Controllers, and Routes. `server.js` acts as the entry point, mounting 15 modular REST API endpoints covering healthcare discovery, consultation booking, AI recommendation, medevac transport, and PDF visa report generation."

---

### Q2: "Why did you choose MongoDB over a SQL database like MySQL or PostgreSQL?"
> **Answer:** "Medical tourism data requires high flexibility. Hospitals and doctors have dynamic arrays for specialties, spoken languages, and VIP facilities. Furthermore, treatments feature dual-currency pricing (USD & INR). MongoDB handles JSON arrays and document references natively without rigid schema migrations."

---

### Q3: "How do you validate appointment requests before saving them?"
> **Answer:** "Validation is handled on both model and controller levels. We enforce strict field requirements, validate email format using Regular Expressions, ensure the requested appointment date is in the future (`preferredDate > Date.now()`), and constrain request status using Mongoose String Enums (`Pending`, `Confirmed`, `Completed`, `Cancelled`)."

---

### Q4: "How does your AI Triage Recommendation feature work?"
> **Answer:** "The AI endpoint (`POST /api/ai/recommend`) accepts patient symptoms, budget limits, and city preferences. It executes text pattern matching across hospital descriptions and doctor specialties, returning ranked healthcare provider matches with compatibility scores to guide foreign patients."

---

### Q5: "How are Doctors linked to Hospitals in your database?"
> **Answer:** "We use Mongoose Schema ObjectId References. In `Doctor.js`, the `hospitalId` field references the `Hospital` collection model. This allows us to query doctors by hospital ID using `GET /api/hospitals/:hospitalId/doctors`."

---

### Q6: "How do international patients get e-Medical Visa support?"
> **Answer:** "Our backend includes a Consultation Report module (`/api/reports`). Once an appointment is processed, `GET /api/reports/:id/pdf` generates a printable HTML/PDF document containing official medical diagnosis, hospital approval, and treatment duration required by Indian Embassies for e-Medical Visa issuance."

---

### Q7: "What security and error handling practices have you implemented?"
> **Answer:** "We implemented CORS middleware for cross-origin protection, `express.json()` body size parsing limits, server-side regex input sanitization, a global 404 handler for invalid routes, and a central error-handling middleware that intercepts unhandled exceptions to prevent process crashes."

---

### Q8: "How do foreign patients calculate costs in their local currency?"
> **Answer:** "We built a Currency Conversion module (`GET /api/currency/convert`). It takes a procedure cost in USD or INR and converts it in real-time into the patient’s home currency including UAE Dirhams (AED), Kenyan Shillings (KES), Nigerian Naira (NGN), British Pounds (GBP), Euros (EUR), and Saudi Riyals (SAR)."

---

### Q9: "How do you handle medical emergencies or airport pickups for foreign patients?"
> **Answer:** "We built a dedicated MedEvac & Ambulance API (`GET /api/ambulance`). It lists 24/7 Advanced Life Support (ALS) ambulances, airport medical shuttles, and air ambulance services linked to accredited Indian hospitals."

---

### Q10: "What happens if local MongoDB is offline during evaluation?"
> **Answer:** "We built an connection-aware fallback layer. Every controller inspects `mongoose.connection.readyState`. If MongoDB is connected, it executes live queries; if offline, it seamlessly serves authentic cached data from our seeder without throwing 500 errors."

---

*Keep this guide open during your hackathon prep. You are fully prepared to defend every single line of backend code!*
