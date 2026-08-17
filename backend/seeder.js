const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Treatment = require('./models/Treatment');

const sampleHospitals = [
  {
    name: 'Apollo Hospitals',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    address: 'Sarita Vihar, Mathura Road, New Delhi, Delhi 110076',
    specialties: ['Cardiology', 'Orthopedics', 'Oncology', 'Organ Transplant', 'Neurology'],
    facilities: ['VIP International Patient Suites', 'Dedicated Language Translators', 'Airport Pickup & Drop', 'Visa Assistance Desk'],
    rating: 4.9,
    contactEmail: 'international@apollohospitals.com',
    contactPhone: '+91-11-26925858',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    description: 'Apollo Hospitals New Delhi is a JCI-accredited flagship hospital offering world-class tertiary care with state-of-the-art robotic surgery and organ transplant facilities.'
  },
  {
    name: 'Fortis Memorial Research Institute',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    address: 'Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002',
    specialties: ['Oncology', 'Cardiology', 'Neurosciences', 'Bone Marrow Transplant', 'Robotic Surgery'],
    facilities: ['International Patient Lounge', 'Customized Dietary Menu', 'Currency Exchange', 'Tele-Consultation Pods'],
    rating: 4.8,
    contactEmail: 'fmri.international@fortishealthcare.com',
    contactPhone: '+91-124-4921021',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'Fortis Memorial Research Institute is a multi-super-specialty quaternary care hospital boasting international faculty and top-tier medical infrastructure.'
  },
  {
    name: 'Max Super Speciality Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi, Delhi 110017',
    specialties: ['Cardiac Sciences', 'Orthopedics & Joint Replacement', 'Dental Sciences', 'Fertility & IVF'],
    facilities: ['Dedicated International Desk', 'Interpreter Support', '5-Star Accommodation Partner', 'Post-Op Rehabilitation'],
    rating: 4.7,
    contactEmail: 'intl.service@maxhealthcare.com',
    contactPhone: '+91-11-26515050',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    description: 'Max Super Speciality Hospital Saket is renowned across Asia for high success rates in complex cardiac procedures and joint replacements.'
  },
  {
    name: 'Manipal Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
    specialties: ['Cosmetic Surgery', 'Dental Surgery', 'Hair Transplantation', 'Fertility Care'],
    facilities: ['Private Patient Suites', 'Concierge Service', 'In-house Pharmacy', '24/7 International Helpdesk'],
    rating: 4.8,
    contactEmail: 'info@manipalhospitals.com',
    contactPhone: '+91-80-25024444',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    description: 'Manipal Hospital Bengaluru is a pioneer in wellness and aesthetic medical tourism, attracting international patients from Africa, Europe, and the Middle East.'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediyatra', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('🍃 Database connected for seeding...');

    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Treatment.deleteMany({});

    console.log('🗑️ Existing sample data cleared.');

    // Insert Hospitals
    const insertedHospitals = await Hospital.insertMany(sampleHospitals);
    console.log(`✅ ${insertedHospitals.length} Hospitals seeded.`);

    const apolloId = insertedHospitals[0]._id;
    const fortisId = insertedHospitals[1]._id;
    const maxId = insertedHospitals[2]._id;
    const manipalId = insertedHospitals[3]._id;

    // Sample Doctors
    const sampleDoctors = [
      {
        hospitalId: apolloId,
        name: 'Dr. Ashok Seth',
        specialty: 'Cardiology',
        qualifications: 'MBBS, MD, FRCP, FACC',
        experienceYears: 32,
        languages: ['English', 'Hindi'],
        consultationFeeUSD: 60,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
      },
      {
        hospitalId: apolloId,
        name: 'Dr. IPS Oberoi',
        specialty: 'Orthopedics',
        qualifications: 'MBBS, MS (Orthopedics), M.Ch',
        experienceYears: 28,
        languages: ['English', 'Hindi', 'Arabic'],
        consultationFeeUSD: 50,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
      },
      {
        hospitalId: fortisId,
        name: 'Dr. Vinod Raina',
        specialty: 'Oncology',
        qualifications: 'MBBS, MD, DM (Medical Oncology)',
        experienceYears: 35,
        languages: ['English', 'Hindi'],
        consultationFeeUSD: 70,
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
      },
      {
        hospitalId: maxId,
        name: 'Dr. Anurag Krishna',
        specialty: 'Dental Sciences',
        qualifications: 'BDS, MDS (Prosthodontics)',
        experienceYears: 18,
        languages: ['English', 'Hindi'],
        consultationFeeUSD: 35,
        availableDays: ['Monday', 'Wednesday', 'Saturday'],
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
      },
      {
        hospitalId: manipalId,
        name: 'Dr. Rashmi Sharma',
        specialty: 'Fertility Care',
        qualifications: 'MBBS, DGO, MD (Obs & Gynae)',
        experienceYears: 22,
        languages: ['English', 'Hindi', 'Kannada'],
        consultationFeeUSD: 45,
        availableDays: ['Tuesday', 'Friday'],
        imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78c4a?auto=format&fit=crop&q=80&w=400'
      }
    ];

    const insertedDoctors = await Doctor.insertMany(sampleDoctors);
    console.log(`✅ ${insertedDoctors.length} Doctors seeded.`);

    // Sample Treatments
    const sampleTreatments = [
      {
        hospitalId: apolloId,
        name: 'Coronary Artery Bypass Grafting (CABG)',
        category: 'Cardiology',
        estimatedCostUSD: 5200,
        estimatedCostINR: 430000,
        durationDays: 8,
        description: 'Advanced open-heart bypass procedure using minimally invasive techniques.',
        procedureOverview: 'Includes preoperative assessment, 2 days ICU stay, and post-op rehabilitation.'
      },
      {
        hospitalId: apolloId,
        name: 'Total Knee Replacement Surgery',
        category: 'Orthopedics',
        estimatedCostUSD: 4500,
        estimatedCostINR: 375000,
        durationDays: 6,
        description: 'Implant surgery replacing damaged knee joint cartilage with high-grade metal alloy prosthetic.',
        procedureOverview: 'Includes computer-assisted navigation and 5 days hospital recovery.'
      },
      {
        hospitalId: fortisId,
        name: 'Bone Marrow Transplant (BMT)',
        category: 'Oncology',
        estimatedCostUSD: 18000,
        estimatedCostINR: 1500000,
        durationDays: 21,
        description: 'Autologous or allogeneic stem cell transplant for leukemia and blood disorders.',
        procedureOverview: 'Includes high-efficiency particulate air (HEPA) filtered isolation room.'
      },
      {
        hospitalId: maxId,
        name: 'Full Mouth Dental Implants',
        category: 'Dental Care',
        estimatedCostUSD: 2800,
        estimatedCostINR: 230000,
        durationDays: 4,
        description: 'Titanium root replacement for missing teeth with custom porcelain crowns.',
        procedureOverview: '3D imaging guided placement with immediate loading options.'
      },
      {
        hospitalId: manipalId,
        name: 'In-Vitro Fertilization (IVF) Package',
        category: 'Fertility Care',
        estimatedCostUSD: 3200,
        estimatedCostINR: 265000,
        durationDays: 14,
        description: 'Complete assisted reproduction cycle including hormone stimulation and ICSI.',
        procedureOverview: 'Embryo monitoring in cleanroom laboratory conditions.'
      }
    ];

    const insertedTreatments = await Treatment.insertMany(sampleTreatments);
    console.log(`✅ ${insertedTreatments.length} Treatments seeded.`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
