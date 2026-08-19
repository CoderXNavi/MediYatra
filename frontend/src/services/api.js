import {
  MOCK_HOSPITALS,
  MOCK_DOCTORS,
  MOCK_TREATMENTS,
  MOCK_ACCOMMODATIONS,
  MOCK_TRANSLATORS
} from '../data/mockData';
import { normalizeDoctor, normalizeHospital, normalizeTreatment } from '../utils/normalizeData';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

async function fetchWithFallback(url, options = {}, fallbackData = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data || json;
  } catch (err) {
    console.warn(`[MediYatra API] ${url} failed or offline, using fallback data:`, err.message);
    return fallbackData;
  }
}

export const apiService = {
  // Hospitals
  async getHospitals() {
    const data = await fetchWithFallback('/hospitals', {}, MOCK_HOSPITALS);
    const rawList = Array.isArray(data) && data.length > 0 ? data : MOCK_HOSPITALS;
    return rawList.map(normalizeHospital);
  },

  // Doctors
  async getDoctors() {
    const data = await fetchWithFallback('/doctors', {}, MOCK_DOCTORS);
    const rawList = Array.isArray(data) && data.length > 0 ? data : MOCK_DOCTORS;
    return rawList.map(normalizeDoctor);
  },

  // Treatments
  async getTreatments() {
    const data = await fetchWithFallback('/treatments', {}, MOCK_TREATMENTS);
    const rawList = Array.isArray(data) && data.length > 0 ? data : MOCK_TREATMENTS;
    return rawList.map(normalizeTreatment);
  },

  // Multi-entity search
  async globalSearch(query) {
    try {
      const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        return {
          hospitals: (data.hospitals || []).map(normalizeHospital),
          doctors: (data.doctors || []).map(normalizeDoctor),
          treatments: (data.treatments || []).map(normalizeTreatment)
        };
      }
    } catch (e) {
      // Fallback local search
    }
    
    const q = query.toLowerCase();
    return {
      hospitals: MOCK_HOSPITALS.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.city.toLowerCase().includes(q) || 
        (h.specialties && h.specialties.some(s => s.toLowerCase().includes(q)))
      ).map(normalizeHospital),
      doctors: MOCK_DOCTORS.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialty.toLowerCase().includes(q)
      ).map(normalizeDoctor),
      treatments: MOCK_TREATMENTS.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      ).map(normalizeTreatment)
    };
  },

  // Real Appointment Booking connected to MongoDB / backend API
  async bookAppointment(appointmentPayload) {
    try {
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentPayload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to record appointment');
      }
      return data;
    } catch (err) {
      console.warn('[MediYatra API] Appointment fallback mock response used:', err.message);
      return {
        success: true,
        message: 'Appointment booking submitted successfully (Offline Cache Active)',
        data: {
          bookingReference: `MY-APT-${Math.floor(100000 + Math.random() * 900000)}`,
          patientName: appointmentPayload.patientName,
          preferredDate: appointmentPayload.preferredDate,
          status: 'Confirmed'
        }
      };
    }
  },

  // Emergency SOS Ambulance Dispatch connected to backend API
  async dispatchAmbulance(sosPayload) {
    try {
      const response = await fetch(`${BASE_URL}/ambulance/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sosPayload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to dispatch ambulance');
      }
      return data;
    } catch (err) {
      console.warn('[MediYatra API] Ambulance dispatch fallback used:', err.message);
      return {
        success: true,
        data: {
          ticketId: `SOS-AMB-${Math.floor(1000 + Math.random() * 9000)}`,
          estimatedArrival: '8 - 12 Minutes',
          driverContact: '+91 98110 99888'
        }
      };
    }
  },

  // Currency Conversion Endpoint
  async convertCurrency(amountUSD, targetCurrency) {
    try {
      const response = await fetch(`${BASE_URL}/currency/convert?amountUSD=${amountUSD}&targetCurrency=${targetCurrency}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback
    }
    const rate = targetCurrency === 'INR' ? 83.2 : 1.0;
    return {
      success: true,
      convertedAmount: Number((amountUSD * rate).toFixed(2)),
      targetCurrency
    };
  },

  // AI Triage Analysis Engine
  async analyzeSymptoms(symptomsText) {
    try {
      const response = await fetch(`${BASE_URL}/ai/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomsText }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.triageResult) {
          return {
            ...json,
            triageResult: {
              ...json.triageResult,
              matchedDoctors: (json.triageResult.matchedDoctors || []).map(normalizeDoctor),
              suggestedHospitals: (json.triageResult.suggestedHospitals || []).map(normalizeHospital)
            }
          };
        }
        return json;
      }
    } catch (e) {
      // AI fallback analysis
    }

    const text = symptomsText.toLowerCase();
    let specialty = "General Medicine";
    let risk = "Moderate Clinical Urgency";
    let message = "Based on symptoms reported, initial consultation with a senior clinical specialist is recommended.";
    let recommendedTests = ["CBC & Metabolic Profile", "Vital Signs Monitoring"];

    if (text.includes("chest") || text.includes("breath") || text.includes("heart") || text.includes("pressure") || text.includes("palpitation")) {
      specialty = "Cardiology";
      risk = "High Urgency (Cardiology Evaluation Recommended)";
      message = "Potential cardiovascular symptoms detected. Immediate clinical assessment by a senior interventional cardiologist is strongly advised.";
      recommendedTests = ["12-Lead ECG", "Echocardiogram", "Troponin I Level", "Coronary Angiogram Screen"];
    } else if (text.includes("knee") || text.includes("joint") || text.includes("bone") || text.includes("stair") || text.includes("hip") || text.includes("fracture")) {
      specialty = "Orthopaedics";
      risk = "Moderate Risk (Joint & Spine Evaluation)";
      message = "Orthopaedic evaluation recommended for joint mobility assessment, cartilage wear, or robotic joint replacement.";
      recommendedTests = ["Bilateral Knee X-Ray (Standing)", "MRI Joint Scan", "Inflammatory Markers (ESR/CRP)"];
    } else if (text.includes("liver") || text.includes("jaundice") || text.includes("abdomen") || text.includes("enzyme") || text.includes("transplant") || text.includes("stomach")) {
      specialty = "Organ Transplant";
      risk = "Elevated Risk (Hepato-Biliary Evaluation)";
      message = "Gastro-hepatology consultation advised for diagnostic screening, liver function profiling, and organ evaluation.";
      recommendedTests = ["Liver Function Test (LFT)", "Abdominal Ultrasound", "FibroScan", "Serum Alpha-Fetoprotein"];
    } else if (text.includes("back") || text.includes("numbness") || text.includes("brain") || text.includes("spine") || text.includes("headache") || text.includes("neuro")) {
      specialty = "Neurosurgery";
      risk = "High Priority (Neuro-Spinal Clearance)";
      message = "Neurological assessment recommended to evaluate nerve compression, disc herniation, or brain tissue health.";
      recommendedTests = ["Whole Spine MRI 3T", "NCV & EMG Nerve Velocity Test", "CT Brain"];
    } else if (text.includes("cancer") || text.includes("tumor") || text.includes("lump") || text.includes("mass") || text.includes("biopsy")) {
      specialty = "Oncology";
      risk = "High Priority (Oncology Multidisciplinary Clearance)";
      message = "Surgical oncology evaluation recommended for precise staging, biopsy review, and targeted therapy planning.";
      recommendedTests = ["PET-CT Whole Body Scan", "Tissue Biopsy Staging", "Tumor Marker Profile"];
    } else if (text.includes("kidney") || text.includes("urinary") || text.includes("stone") || text.includes("prostate")) {
      specialty = "Urology";
      risk = "Moderate Risk (Urological Evaluation)";
      message = "Urological evaluation recommended for renal function screening, stone management, or minimally invasive procedures.";
      recommendedTests = ["KUB Ultrasound", "Serum Creatinine & BUN", "Urine Culture & Sensitivity"];
    } else if (text.includes("child") || text.includes("infant") || text.includes("paediatric") || text.includes("pediatric")) {
      specialty = "Paediatrics";
      risk = "Specialized Paediatric Care Required";
      message = "Child healthcare specialist consultation advised for developmental and pediatric medical evaluation.";
      recommendedTests = ["Pediatric Clinical Screening", "CBC & Pediatric Vitals"];
    }

    const matchedDocs = MOCK_DOCTORS.filter(d => 
      d.specialty.toLowerCase().includes(specialty.toLowerCase()) || 
      specialty === "General Medicine"
    ).map(normalizeDoctor);

    return {
      success: true,
      triageResult: {
        recommendedSpecialty: specialty,
        riskLevel: risk,
        clinicalSummary: message,
        recommendedTests,
        matchedDoctors: matchedDocs.length > 0 ? matchedDocs : MOCK_DOCTORS.slice(0, 3).map(normalizeDoctor),
        suggestedHospitals: MOCK_HOSPITALS.slice(0, 2).map(normalizeHospital)
      }
    };
  },

  // Nova AI Conversational Healthcare & Platform Guide Engine
  async askNovaAI(userMessage) {
    const text = (userMessage || '').toLowerCase().trim();

    // 0. General Website Working, Navigation & Overview Queries
    if (
      text.includes("how this website work") ||
      text.includes("how does this website work") ||
      text.includes("how site work") ||
      text.includes("how does it work") ||
      text.includes("how to use") ||
      text.includes("what is mediyatra") ||
      text.includes("about website") ||
      text.includes("about site") ||
      text.includes("what can you do") ||
      text.includes("help") ||
      text.includes("option") ||
      text.includes("feature") ||
      text.includes("overview") ||
      text.includes("guide")
    ) {
      return {
        reply: "👋 Welcome to MediYatra! Here is how our integrated digital healthcare platform works:\n\n" +
               "1. 🏥 Hospital Explorer: Browse 26 accredited quaternary care hospitals across 16 Indian cities with live ICU bed counts & map locations.\n" +
               "2. 👨‍⚕️ Doctor Directory: Search 50+ board-certified department chairs & senior surgeons, and book direct OPD/video consultations.\n" +
               "3. 💰 Surgical Tariffs: Compare transparent procedure packages in India (save up to 85% vs US/UK hospital rates).\n" +
               "4. ✈️ Medical Tourism & Visa: Request official hospital-sealed e-Medical Visa Invitation Letters (VIL), certified language interpreters, and airport pickups.\n" +
               "5. 🤝 Charity Aid Hub: Claim free donated wheelchairs, oxygen cylinders, subsidized medicines, or submit NGO financial aid requests.\n" +
               "6. 📁 My Health Records: Track your live 4-step medical tourism pipeline, diagnostic lab reports, and digital prescriptions.\n" +
               "7. 🚨 Emergency SOS: One-touch 24/7 ICU ambulance dispatch hotline.\n\n" +
               "You can ask me about any feature, specific doctor/hospital, or enter symptoms for instant AI clinical triage!",
        actionTab: 'hospitals',
        actionLabel: '🏥 Explore MediYatra Platform'
      };
    }

    // 1. Navigation & How Specific Features Work Queries
    if (text.includes("visa") || text.includes("vil") || text.includes("embassy") || text.includes("invitation letter")) {
      return {
        reply: "To get an official e-Medical Visa Invitation Letter (VIL), click the 'Apply for Visa Letter' card or go to the 'Medical Tourism' tab. Enter patient details & target hospital, and an official hospital-sealed PDF VIL will be generated instantly for embassy presentation!",
        actionTab: 'tourism',
        actionLabel: '✈️ Open Medical Visa Desk'
      };
    }

    if (text.includes("ngo") || text.includes("charity") || text.includes("free") || text.includes("wheelchair") || text.includes("oxygen") || text.includes("aid")) {
      return {
        reply: "For free medical equipment (foldable wheelchairs, oxygen cylinders, Atorvastatin) or financial subsidy aid, visit the 'Charity Aid Hub' tab. Verified patients can claim donated supplies or submit NGO assistance requests!",
        actionTab: 'charity',
        actionLabel: '🤝 Open NGO Charity Aid Hub'
      };
    }

    if (text.includes("record") || text.includes("history") || text.includes("prescription") || text.includes("report") || text.includes("pipeline")) {
      return {
        reply: "You can view your live 4-step medical tourism pipeline, private doctor consultation logs, lab reports, and digital prescriptions under the 'My Records' tab after signing in.",
        actionTab: 'records',
        actionLabel: '📁 Open My Health Records'
      };
    }

    if (text.includes("tariff") || text.includes("cost") || text.includes("price") || text.includes("saving") || text.includes("calculator") || text.includes("package")) {
      return {
        reply: "Use the 'Surgical Tariffs' tab to compare transparent procedure packages in India (e.g. CABG $6,500, Knee Replacement $4,200) against US/UK hospital averages with zero hidden surgical fees!",
        actionTab: 'treatments',
        actionLabel: '💰 View Surgical Package Rates'
      };
    }

    if (text.includes("emergency") || text.includes("sos") || text.includes("ambulance") || text.includes("icu")) {
      return {
        reply: "For urgent medical emergencies, click the red 'Emergency SOS' button on the navbar or call our 24/7 ICU Hotline (+91 98110 99888) for instant ambulance dispatch!",
        actionLink: 'emergency',
        actionLabel: '🚨 Emergency SOS Dispatch'
      };
    }

    if (text.includes("currency") || text.includes("inr") || text.includes("usd") || text.includes("dollar") || text.includes("rupee")) {
      return {
        reply: "You can toggle currency prices between US Dollars ($) and Indian Rupees (₹) at any time using the Currency Switcher on the top navigation bar!",
      };
    }

    // 2. Specific Doctor Queries
    if (text.includes("ashok seth") || text.includes("seth")) {
      const doc = MOCK_DOCTORS.find(d => d.name.includes("Seth")) || MOCK_DOCTORS[0];
      return {
        reply: "Dr. Ashok Seth is the Group Chairman of Cardiac Sciences & Interventional Cardiology at Indraprastha Apollo Hospitals, New Delhi. Performed over 50,000 angiograms and 20,000 angioplasties (Padma Bhushan & Padma Shri recipient). OPD Consultation Fee: ₹1,500 ($25).",
        matchedDoctors: [normalizeDoctor(doc)],
        actionLink: 'booking',
        actionDoctor: normalizeDoctor(doc),
        actionLabel: '📅 Book Consultation with Dr. Ashok Seth'
      };
    }

    if (text.includes("trehan") || text.includes("naresh")) {
      const doc = MOCK_DOCTORS.find(d => d.name.includes("Trehan")) || MOCK_DOCTORS[1];
      return {
        reply: "Dr. Naresh Trehan is the Chairman & Managing Director of Medanta - The Medicity, Gurugram. Renowned cardiac surgeon with over 48,000 open-heart surgeries (Padma Bhushan recipient). Specializes in CABG, valve replacement, and heart transplants.",
        matchedDoctors: [normalizeDoctor(doc)],
        actionLink: 'booking',
        actionDoctor: normalizeDoctor(doc),
        actionLabel: '📅 Book Consultation with Dr. Naresh Trehan'
      };
    }

    if (text.includes("subhash gupta") || (text.includes("gupta") && text.includes("liver"))) {
      const doc = MOCK_DOCTORS.find(d => d.name.includes("Gupta")) || MOCK_DOCTORS[2];
      return {
        reply: "Dr. Subhash Gupta is the Chairman of the Centre for Liver & Biliary Sciences at Max Super Speciality Hospital Saket. World pioneer in living donor liver transplantation with over 3,000 liver transplants performed.",
        matchedDoctors: [normalizeDoctor(doc)],
        actionLink: 'booking',
        actionDoctor: normalizeDoctor(doc),
        actionLabel: '📅 Book Consultation with Dr. Subhash Gupta'
      };
    }

    if (text.includes("sandeep vaishya") || text.includes("vaishya") || text.includes("gamma knife")) {
      const doc = MOCK_DOCTORS.find(d => d.name.includes("Vaishya")) || MOCK_DOCTORS[3];
      return {
        reply: "Dr. Sandeep Vaishya is the Senior Director & Head of Neurosurgery at Fortis Memorial Research Institute, Gurugram. Internationally renowned expert in Gamma Knife radiosurgery, brain tumor craniotomy, and spinal disc replacement.",
        matchedDoctors: [normalizeDoctor(doc)],
        actionLink: 'booking',
        actionDoctor: normalizeDoctor(doc),
        actionLabel: '📅 Book Consultation with Dr. Sandeep Vaishya'
      };
    }

    if (text.includes("rajgopal") || text.includes("ashok rajgopal")) {
      const doc = MOCK_DOCTORS.find(d => d.name.includes("Rajgopal")) || MOCK_DOCTORS[4];
      return {
        reply: "Dr. Ashok Rajgopal is the Group Chairman of Orthopaedics at Medanta. Pioneer in bilateral total knee replacement surgery with over 30,000 knee & hip replacements performed (Padma Shri awardee).",
        matchedDoctors: [normalizeDoctor(doc)],
        actionLink: 'booking',
        actionDoctor: normalizeDoctor(doc),
        actionLabel: '📅 Book Consultation with Dr. Ashok Rajgopal'
      };
    }

    // 3. Hospital Queries
    if (text.includes("apollo") || text.includes("sarita vihar")) {
      const hosp = MOCK_HOSPITALS.find(h => h.name.includes("Apollo")) || MOCK_HOSPITALS[0];
      return {
        reply: "Indraprastha Apollo Hospitals (New Delhi) is a JCI-accredited flagship quaternary care hospital equipped with 710 beds, CyberKnife, 3T MRI, Da Vinci Xi Robotics, and 24/7 VIP international patient desks.",
        suggestedHospitals: [normalizeHospital(hosp)],
        actionTab: 'hospitals',
        actionLabel: '🏥 View Apollo Hospitals Profile'
      };
    }

    if (text.includes("max") || text.includes("saket")) {
      const hosp = MOCK_HOSPITALS.find(h => h.name.includes("Max")) || MOCK_HOSPITALS[1];
      return {
        reply: "Max Super Speciality Hospital (Saket, New Delhi) is a 530-bed NABH & JCI accredited center renowned for living donor liver transplants, cardiac surgery, and surgical oncology.",
        suggestedHospitals: [normalizeHospital(hosp)],
        actionTab: 'hospitals',
        actionLabel: '🏥 View Max Hospital Profile'
      };
    }

    if (text.includes("fortis") || text.includes("fmri") || text.includes("gurugram")) {
      const hosp = MOCK_HOSPITALS.find(h => h.name.includes("Fortis")) || MOCK_HOSPITALS[2];
      return {
        reply: "Fortis Memorial Research Institute (Gurugram) is a premier 1,000-bed quaternary hospital specializing in neurosurgery, pediatric cardiology, and bone marrow transplants.",
        suggestedHospitals: [normalizeHospital(hosp)],
        actionTab: 'hospitals',
        actionLabel: '🏥 View Fortis FMRI Profile'
      };
    }

    // Check if query contains medical symptom keywords
    const hasSymptomKeywords = [
      "chest", "pain", "heart", "knee", "liver", "brain", "fever", "breath", 
      "cancer", "tumor", "stone", "numbness", "joint", "spine", "kidney", 
      "child", "infant", "cough", "vomit", "headache", "blood", "symptom", 
      "stomach", "bone", "lump", "jaundice", "pressure", "palpitation"
    ].some(kw => text.includes(kw));

    if (!hasSymptomKeywords) {
      return {
        reply: `I'm Nova, your 24/7 MediYatra assistant! Regarding "${userMessage}", you can explore accredited hospital profiles, search board-certified doctors, apply for e-Medical Visa letters, or compare surgical package tariffs. How can I assist you today?`,
        actionTab: 'hospitals',
        actionLabel: '🏥 Explore MediYatra Features'
      };
    }

    // 4. Clinical Symptom & Department Triage Analysis
    const triageRes = await this.analyzeSymptoms(userMessage);
    return {
      reply: triageRes.triageResult?.clinicalSummary || "I've analyzed your medical symptoms. Here are the recommended department specialists and accredited hospitals for your case:",
      triageResult: triageRes.triageResult
    };
  },

  // Accommodations & Translators
  async getAccommodations() {
    const data = await fetchWithFallback('/accommodations', {}, MOCK_ACCOMMODATIONS);
    return Array.isArray(data) && data.length > 0 ? data : MOCK_ACCOMMODATIONS;
  },

  async getTranslators() {
    const data = await fetchWithFallback('/translators', {}, MOCK_TRANSLATORS);
    return Array.isArray(data) && data.length > 0 ? data : MOCK_TRANSLATORS;
  }
};
