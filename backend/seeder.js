const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Treatment = require('./models/Treatment');

const realHospitals = [
  {
    name: 'All India Institute of Medical Sciences (AIIMS)',
    city: 'Bathinda',
    state: 'Punjab',
    country: 'India',
    address: 'Mandi Dabwali Road, Bathinda, Punjab 151001',
    specialties: ['Cardiology', 'Cardiothoracic & Vascular Surgery', 'Burns & Plastic Surgery', 'Obstetrics & Gynaecology', 'Ophthalmology', 'Orthopaedics', 'Medical Oncology-Haematology', 'Neurosurgery', 'Pediatrics', 'Urology', 'Trauma & Emergency'],
    facilities: ['24/7 Emergency (9877796451)', 'Ayushman Bharat Desk', 'Tele-Consultation Pods', 'Specialist Clinics'],
    rating: 4.9,
    contactEmail: 'opd@aiimsbathinda.edu.in',
    contactPhone: '01642867403',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    description: 'AIIMS Bathinda is a premier national institute providing advanced tertiary healthcare, specialized surgical clinics, and 24-hour trauma & emergency services.'
  },
  {
    name: 'Apollo Hospitals International Ltd.',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    address: 'Plot No. 1A, Bhat GIDC Estate, Gandhinagar - Ahmedabad Off Highway, Ahmedabad, Gujarat 382428',
    specialties: ['Cardiology', 'Nephrology & Transplants', 'Neurosciences', 'General Surgery', 'Orthopaedics', 'Gastroenterology & Hepatology', 'Pediatric Cardiology', 'Reproductive Medicine'],
    facilities: ['JCI Accredited International Desk', 'Multilingual Translators', 'Airport Transfer', 'VIP Recovery Suites'],
    rating: 4.8,
    contactEmail: 'international_ahmedabad@apollohospitals.com',
    contactPhone: '+91-79-66701800',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'Apollo Hospitals Ahmedabad is a premier multi-specialty medical center renowned for organ transplants, cardiac sciences, and neurosurgery.'
  },
  {
    name: 'Apollo Hospitals Mumbai',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    country: 'India',
    address: 'Plot No. 13, Parsik Hill Road, Off Thane - Belapur Rd, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614',
    specialties: ['Oncology', 'Cardiology & Cardiac Sciences', 'Nephrology & Transplants', 'Neurosciences', 'General & Robotic Surgery', 'Orthopaedics', 'Pediatrics', 'Obstetrics & Gynecology'],
    facilities: ['Robotic Surgery Wing', 'International Patient Lounge', 'Dedicated Visa Cell', 'Private Recovery Suites'],
    rating: 4.9,
    contactEmail: 'international_mumbai@apollohospitals.com',
    contactPhone: '+91-22-62806280',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    description: 'Apollo Hospitals Navi Mumbai offers quaternary healthcare with advanced robotic cancer surgeries, bone marrow transplants, and international patient care.'
  },
  {
    name: 'Sterling Hospitals',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    address: 'Race Course Circle (West), Vadodara, Gujarat 390007',
    specialties: ['Pulmonology', 'Emergency Medicine', 'Obstetrics & Gynecology', 'Cardiology', 'Critical Care'],
    facilities: ['24/7 Emergency & ICU', 'International Tele-consultation', 'Physiotherapy & Rehab'],
    rating: 4.7,
    contactEmail: 'info.vadodara@sterlinghospitals.com',
    contactPhone: '+91-265-2311111',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    description: 'Sterling Hospitals Vadodara is a top multi-specialty center providing high-end respiratory care, emergency trauma care, and gynecology.'
  },
  {
    name: 'Sir Thutob Namgyal Memorial Hospital (STNM)',
    city: 'Gangtok',
    state: 'Sikkim',
    country: 'India',
    address: 'NH 31A, Gangtok, Sikkim 737101',
    specialties: ['General Medicine', 'General Surgery', 'Orthopaedics', 'Obstetrics & Gynecology', 'Pediatrics', 'Emergency Care'],
    facilities: ['State Apex Healthcare Center', 'Telemedicine Wing', 'Pharmacy & Diagnostic Lab'],
    rating: 4.6,
    contactEmail: 'stnm.hospital@sikkim.gov.in',
    contactPhone: '+91-3592-202944',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'STNM Hospital Gangtok is the premier apex healthcare institution in Sikkim equipped with modern medical and surgical suites.'
  }
];

const seedRealData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediyatra', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('🍃 Database connected for authentic data seeding...');

    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Treatment.deleteMany({});

    const insertedHospitals = await Hospital.insertMany(realHospitals);
    console.log(`✅ ${insertedHospitals.length} Authentic Hospitals Seeded.`);

    const aiimsId = insertedHospitals[0]._id;
    const apolloAhmId = insertedHospitals[1]._id;
    const apolloMumId = insertedHospitals[2]._id;
    const sterlingId = insertedHospitals[3]._id;
    const stnmId = insertedHospitals[4]._id;

    // Authentic Doctors List from user input
    const realDoctors = [
      // AIIMS Bathinda Doctors
      { hospitalId: aiimsId, name: 'Dr. Bhupinder Singh', specialty: 'Cardiology', qualifications: 'MBBS, MD, DM (Cardiology)', experienceYears: 18, languages: ['English', 'Hindi', 'Punjabi'], consultationFeeUSD: 40, availableDays: ['Monday', 'Thursday', 'Friday'] },
      { hospitalId: aiimsId, name: 'Dr. Suraj Kumar', specialty: 'Cardiology', qualifications: 'MBBS, MD, DM (Cardiology)', experienceYears: 15, languages: ['English', 'Hindi', 'Punjabi'], consultationFeeUSD: 40, availableDays: ['Tuesday', 'Wednesday'] },
      { hospitalId: aiimsId, name: 'Dr. Tejinder Singh Malhi', specialty: 'Cardiology', qualifications: 'MBBS, MD (Preventive Cardiology)', experienceYears: 14, languages: ['English', 'Hindi', 'Punjabi'], consultationFeeUSD: 35, availableDays: ['Friday', 'Saturday'] },
      { hospitalId: aiimsId, name: 'Dr. Rajiv Kumar', specialty: 'Cardiothoracic & Vascular Surgery', qualifications: 'MBBS, MS, M.Ch (CTVS)', experienceYears: 20, languages: ['English', 'Hindi'], consultationFeeUSD: 50, availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      { hospitalId: aiimsId, name: 'Dr. M. Altaf Mir', specialty: 'Burns & Plastic Surgery', qualifications: 'MBBS, MS, M.Ch (Plastic Surgery)', experienceYears: 16, languages: ['English', 'Hindi', 'Kashmiri'], consultationFeeUSD: 45, availableDays: ['Tuesday', 'Thursday', 'Saturday'] },
      { hospitalId: aiimsId, name: 'Dr. Neena Singh', specialty: 'Obstetrics & Gynaecology', qualifications: 'MBBS, MD (Perinatology)', experienceYears: 22, languages: ['English', 'Hindi', 'Punjabi'], consultationFeeUSD: 40, availableDays: ['Tuesday', 'Wednesday', 'Saturday'] },
      { hospitalId: aiimsId, name: 'Dr. Tarun Goyal', specialty: 'Orthopaedics', qualifications: 'MBBS, MS (Orthopaedics), Fellowship Sports Medicine', experienceYears: 19, languages: ['English', 'Hindi', 'Punjabi'], consultationFeeUSD: 45, availableDays: ['Tuesday', 'Thursday'] },

      // Apollo Ahmedabad Doctors
      { hospitalId: apolloAhmId, name: 'Dr. Sameer Dani', specialty: 'Cardiology', qualifications: 'MBBS, MD, DM (Cardiology), FACC', experienceYears: 27, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 65, availableDays: ['Monday', 'Wednesday', 'Friday'] },
      { hospitalId: apolloAhmId, name: 'Dr. Haresh Patel', specialty: 'Nephrology & Transplants', qualifications: 'MBBS, MD, DM (Nephrology)', experienceYears: 16, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 55, availableDays: ['Tuesday', 'Thursday', 'Saturday'] },
      { hospitalId: apolloAhmId, name: 'Dr. Somesh Desai', specialty: 'Neurosciences', qualifications: 'MBBS, MS, M.Ch (Neurosurgery)', experienceYears: 22, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 60, availableDays: ['Monday', 'Thursday'] },
      { hospitalId: apolloAhmId, name: 'Dr. Krunal Soni', specialty: 'Orthopaedics', qualifications: 'MBBS, MS (Orthopaedics)', experienceYears: 14, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 50, availableDays: ['Wednesday', 'Saturday'] },
      { hospitalId: apolloAhmId, name: 'Dr. Shravan Bohra', specialty: 'Gastroenterology & Hepatology', qualifications: 'MBBS, MD, DM (Gastroenterology)', experienceYears: 25, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 60, availableDays: ['Tuesday', 'Friday'] },

      // Apollo Mumbai Doctors
      { hospitalId: apolloMumId, name: "Dr. Anil K. D'Cruz", specialty: 'Oncology', qualifications: 'MBBS, MS, FRCS (Oncology)', experienceYears: 33, languages: ['English', 'Hindi', 'Marathi'], consultationFeeUSD: 85, availableDays: ['Monday', 'Wednesday'] },
      { hospitalId: apolloMumId, name: 'Dr. Sanjeevkumar Kalkekar', specialty: 'Cardiology', qualifications: 'MBBS, MD, DM (Cardiology)', experienceYears: 16, languages: ['English', 'Hindi', 'Marathi'], consultationFeeUSD: 60, availableDays: ['Tuesday', 'Thursday', 'Friday'] },
      { hospitalId: apolloMumId, name: 'Dr. Abhidha Shah', specialty: 'Neurosciences', qualifications: 'MBBS, MS, M.Ch (Neurosurgery)', experienceYears: 20, languages: ['English', 'Hindi', 'Marathi'], consultationFeeUSD: 70, availableDays: ['Monday', 'Friday'] },
      { hospitalId: apolloMumId, name: 'Dr. Shalin Dubey', specialty: 'General & Robotic Surgery', qualifications: 'MBBS, MS, Fellowship Robotic Surgery', experienceYears: 21, languages: ['English', 'Hindi', 'Marathi'], consultationFeeUSD: 65, availableDays: ['Tuesday', 'Saturday'] },

      // Sterling Vadodara Doctors
      { hospitalId: sterlingId, name: 'Dr. Amit Dave', specialty: 'Pulmonology', qualifications: 'MBBS, MD (Pulmonology)', experienceYears: 17, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 45, availableDays: ['Monday', 'Wednesday', 'Friday'] },
      { hospitalId: sterlingId, name: 'Dr. Ankur Masani', specialty: 'Emergency Medicine', qualifications: 'MBBS, MEM (Emergency Medicine)', experienceYears: 12, languages: ['English', 'Gujarati', 'Hindi'], consultationFeeUSD: 40, availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },

      // STNM Sikkim Doctors
      { hospitalId: stnmId, name: 'Dr. Chintamani Sharma', specialty: 'General Surgery', qualifications: 'MBBS, MS (General Surgery)', experienceYears: 26, languages: ['English', 'Nepali', 'Hindi'], consultationFeeUSD: 35, availableDays: ['Monday', 'Wednesday', 'Friday'] }
    ];

    const insertedDoctors = await Doctor.insertMany(realDoctors);
    console.log(`✅ ${insertedDoctors.length} Authentic Doctors Seeded.`);

    // Authentic Treatments
    const realTreatments = [
      { hospitalId: apolloAhmId, name: 'Coronary Angioplasty & Stenting', category: 'Cardiology', estimatedCostUSD: 4800, estimatedCostINR: 395000, durationDays: 3, description: 'Minimally invasive balloon angioplasty with drug-eluting stent placement.' },
      { hospitalId: apolloMumId, name: 'Robotic Head & Neck Tumor Resection', category: 'Oncology', estimatedCostUSD: 9500, estimatedCostINR: 780000, durationDays: 7, description: 'State-of-the-art DaVinci robotic tumor removal with organ preservation.' },
      { hospitalId: aiimsId, name: 'Complex Hand & Brachial Plexus Reconstruction', category: 'Burns & Plastic Surgery', estimatedCostUSD: 3200, estimatedCostINR: 260000, durationDays: 5, description: 'Micro-vascular nerve and tendon repair surgery.' },
      { hospitalId: apolloAhmId, name: 'Living Donor Kidney Transplant', category: 'Nephrology & Transplants', estimatedCostUSD: 14000, estimatedCostINR: 1150000, durationDays: 14, description: 'Complete renal transplantation including donor assessment and post-op immunosuppression.' },
      { hospitalId: sterlingId, name: 'Advanced High-Risk Bronchoscopy & Pulmonology Care', category: 'Pulmonology', estimatedCostUSD: 1800, estimatedCostINR: 145000, durationDays: 2, description: 'Diagnostic endobronchial ultrasound (EBUS) and airway stenting.' }
    ];

    const insertedTreatments = await Treatment.insertMany(realTreatments);
    console.log(`✅ ${insertedTreatments.length} Authentic Treatments Seeded.`);

    console.log('🎉 Real Hospital & Doctor Data Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding real data: ${error.message}`);
    process.exit(1);
  }
};

seedRealData();
