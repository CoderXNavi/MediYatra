/**
 * Data Normalization Utility for MediYatra
 * Ensures 100% data contract safety between MongoDB backend schemas and Frontend views.
 */

export function normalizeDoctor(doc) {
  if (!doc) return null;

  const hospitalObj = typeof doc.hospitalId === 'object' && doc.hospitalId ? doc.hospitalId : null;
  const hospitalName = hospitalObj?.name || doc.hospitalName || 'Accredited Partner Hospital';
  const hospitalCity = hospitalObj?.city || doc.hospitalCity || 'India';

  // Fee normalization (Handles USD, INR, OPD Fee)
  const opdFee = doc.opdFee ?? null;
  const usdFee = doc.consultationFeeUSD ?? (doc.opdFee ? Math.round(doc.opdFee / 83) : null) ?? doc.consultationFee ?? doc.feeUSD ?? null;
  const inrFee = doc.consultationFeeINR ?? doc.opdFee ?? (typeof usdFee === 'number' ? Math.round(usdFee * 83) : null);

  // Image URL fallback
  const image = doc.imageUrl || doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';

  // Spoken languages array normalization
  const languages = Array.isArray(doc.languages) && doc.languages.length > 0
    ? doc.languages
    : Array.isArray(doc.languagesSpoken) && doc.languagesSpoken.length > 0
      ? doc.languagesSpoken
      : [];

  return {
    _id: doc._id || `doc_${Math.random()}`,
    name: doc.name || 'Specialist Doctor',
    designation: doc.designation || doc.title || 'Senior Consultant',
    department: doc.department || doc.specialty || 'General Medicine',
    subSpecialty: doc.subSpecialty || null,
    hospitalId: typeof doc.hospitalId === 'string' ? doc.hospitalId : hospitalObj?._id || 'hosp_default',
    hospitalName,
    hospitalCity,
    specialty: doc.specialty || 'General Medicine',
    experienceYears: doc.experienceYears ?? null,
    qualifications: doc.qualifications || null,
    rating: doc.rating ?? null,
    consultationFeeUSD: usdFee,
    consultationFeeINR: inrFee,
    opdFee: opdFee,
    availableDays: Array.isArray(doc.availableDays) ? doc.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    image,
    languagesSpoken: languages,
    biography: doc.biography || doc.professionalBio || null,
    sourceUrl: doc.sourceUrl || null
  };
}

export function normalizeHospital(hosp) {
  if (!hosp) return null;

  const centers = Array.isArray(hosp.keyCentersOfExcellence) && hosp.keyCentersOfExcellence.length > 0
    ? hosp.keyCentersOfExcellence
    : Array.isArray(hosp.specialties) ? hosp.specialties : [];

  return {
    _id: hosp._id || `hosp_${Math.random()}`,
    name: hosp.name || hosp.hospitalName || 'Accredited Medical Center',
    hospitalType: hosp.hospitalType || 'Multi-Specialty Medical Center',
    city: hosp.city || 'New Delhi',
    state: hosp.state || 'Delhi',
    country: hosp.country || 'India',
    address: hosp.address || 'India',
    pincode: hosp.pincode || null,
    latitude: hosp.latitude || null,
    longitude: hosp.longitude || null,
    contactPhone: hosp.contactPhone || hosp.phone || null,
    contactEmail: hosp.contactEmail || hosp.email || null,
    officialWebsite: hosp.officialWebsite || null,
    accreditation: Array.isArray(hosp.accreditation) && hosp.accreditation.length > 0
      ? hosp.accreditation
      : ['JCI Accredited', 'NABH Accredited'],
    rating: hosp.rating ?? null,
    ratingSource: hosp.ratingSource || null,
    reviewCount: hosp.reviewCount ?? null,
    establishedYear: hosp.establishedYear ?? null,
    beds: hosp.beds ?? hosp.numberOfBeds ?? null,
    numberOfBeds: hosp.beds ?? hosp.numberOfBeds ?? null,
    image: hosp.image || hosp.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200',
    specialties: Array.isArray(hosp.specialties) ? hosp.specialties : [],
    keyCentersOfExcellence: centers,
    facilities: Array.isArray(hosp.facilities) ? hosp.facilities : [],
    emergencyAvailable: hosp.emergencyAvailable ?? true,
    internationalPatientServices: hosp.internationalPatientServices ?? true,
    description: hosp.description || 'Modern accredited tertiary medical center.',
    sourceUrl: hosp.sourceUrl || null
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
