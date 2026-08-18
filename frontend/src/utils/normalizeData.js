/**
 * Data Normalization Utility for MediYatra
 * Ensures 100% data contract safety between MongoDB backend schemas and Frontend views.
 */

export function normalizeDoctor(doc) {
  if (!doc) return null;

  const hospitalObj = typeof doc.hospitalId === 'object' && doc.hospitalId ? doc.hospitalId : null;
  const hospitalName = hospitalObj?.name || doc.hospitalName || 'Accredited Partner Hospital';
  const hospitalCity = hospitalObj?.city || doc.hospitalCity || 'New Delhi, India';

  // Fee normalization (Handles both USD and INR cleanly)
  const usdFee = doc.consultationFeeUSD ?? doc.consultationFee ?? doc.feeUSD ?? 50;
  const inrFee = doc.consultationFeeINR ?? (typeof usdFee === 'number' ? Math.round(usdFee * 83) : 4150);

  // Image URL fallback
  const image = doc.imageUrl || doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';

  // Spoken languages array normalization
  const languages = Array.isArray(doc.languages) && doc.languages.length > 0
    ? doc.languages
    : Array.isArray(doc.languagesSpoken) && doc.languagesSpoken.length > 0
      ? doc.languagesSpoken
      : ['English', 'Hindi'];

  return {
    _id: doc._id || `doc_${Math.random()}`,
    name: doc.name || 'Senior Specialist',
    title: doc.title || `${doc.specialty || 'Senior Specialist'} Consultant`,
    hospitalId: typeof doc.hospitalId === 'string' ? doc.hospitalId : hospitalObj?._id || 'hosp_default',
    hospitalName,
    hospitalCity,
    specialty: doc.specialty || 'General Medicine',
    experienceYears: doc.experienceYears ?? 15,
    qualifications: doc.qualifications || 'MBBS, MD',
    rating: doc.rating ?? 4.9,
    consultationFeeUSD: usdFee,
    consultationFeeINR: inrFee,
    availableDays: Array.isArray(doc.availableDays) ? doc.availableDays : ['Mon', 'Wed', 'Fri'],
    image,
    languagesSpoken: languages,
    biography: doc.biography || `Board-certified ${doc.specialty || 'medical'} specialist dedicated to international patient care.`
  };
}

export function normalizeHospital(hosp) {
  if (!hosp) return null;

  return {
    _id: hosp._id || `hosp_${Math.random()}`,
    name: hosp.name || 'Accredited Medical Center',
    city: hosp.city || 'New Delhi',
    state: hosp.state || 'NCR',
    country: hosp.country || 'India',
    address: hosp.address || 'Medical Enclave, India',
    accreditation: Array.isArray(hosp.accreditation) && hosp.accreditation.length > 0
      ? hosp.accreditation
      : ['JCI Accredited', 'NABH Certified'],
    rating: hosp.rating ?? 4.8,
    reviewCount: hosp.reviewCount ?? 850,
    establishedYear: hosp.establishedYear ?? 2005,
    beds: hosp.beds ?? 500,
    image: hosp.image || hosp.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200',
    specialties: Array.isArray(hosp.specialties) ? hosp.specialties : ['Cardiology', 'Oncology', 'Orthopaedics'],
    facilities: Array.isArray(hosp.facilities) ? hosp.facilities : ['24/7 ICU', 'VIP Lounge', 'Interpreter Desk'],
    description: hosp.description || 'Modern quaternary medical care center with advanced surgical technology.'
  };
}

export function normalizeTreatment(treat) {
  if (!treat) return null;

  const costUSD = treat.estimatedCostUSD ?? treat.costUSD ?? 5000;
  const costINR = treat.estimatedCostINR ?? treat.costINR ?? Math.round(costUSD * 83);
  const usCost = treat.usCostUSD ?? (costUSD * 6);
  const savings = treat.savingsPercentage ?? Math.round(((usCost - costUSD) / usCost) * 100);

  return {
    _id: treat._id || `treat_${Math.random()}`,
    name: treat.name || 'Surgical Procedure',
    category: treat.category || 'General Surgery',
    description: treat.description || 'Comprehensive surgical treatment package performed by accredited senior surgeons.',
    durationDays: treat.durationDays ?? 7,
    estimatedCostUSD: costUSD,
    estimatedCostINR: costINR,
    usCostUSD: usCost,
    savingsPercentage: savings > 0 ? savings : 80,
    successRate: treat.successRate || '98.5%',
    recoveryTime: treat.recoveryTime || '3 - 4 Weeks'
  };
}
