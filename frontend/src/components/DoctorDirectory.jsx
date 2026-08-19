import React, { useState } from 'react';
import { 
  UserCheck, 
  Star, 
  Award, 
  Languages, 
  CalendarCheck, 
  Stethoscope, 
  Building2,
  PhoneCall,
  CheckCircle2,
  Filter,
  MessageSquare,
  Lock,
  ChevronRight,
  MapPin,
  Navigation,
  Search,
  ArrowRight
} from 'lucide-react';
import { normalizeDoctor } from '../utils/normalizeData';
import { fuzzySearchMatch } from '../utils/fuzzySearch';
import HospitalMapModal from './HospitalMapModal';

export default function DoctorDirectory({ doctors = [], currency, onConsultDoctor, onBookDoctor, searchQuery = '', currentUser, onOpenAdminTab, setActiveTab }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedMapHospital, setSelectedMapHospital] = useState(null);

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  const activeSearch = localSearch || searchQuery || '';

  const normalizedDoctors = (Array.isArray(doctors) ? doctors : []).map(normalizeDoctor).filter(Boolean);

  const allDepartments = [
    'All',
    'Cardiology',
    'Oncology',
    'Organ Transplant',
    'Orthopaedics',
    'Neurosurgery',
    'Dental Sciences',
    'Gastroenterology',
    'Urology',
    'Paediatrics'
  ];

  const filteredDoctors = normalizedDoctors.filter(doc => {
    const matchesSearch = fuzzySearchMatch(
      { 
        name: doc.name, 
        specialty: doc.specialty, 
        hospitalName: doc.hospitalName, 
        qualifications: doc.qualifications,
        bio: doc.bio 
      },
      activeSearch
    );

    const matchesDept = selectedDept === 'All' || doc.specialty.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesDept;
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FFF6FB]">
      
      {/* Full Image Background Hero Banner with Soft Left Gradient Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#FFD6E8] mb-10 bg-white min-h-[320px] sm:min-h-[380px] flex items-center">
        
        {/* Full Cover Background Image */}
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600"
          alt="Senior Medical Faculty & Surgeons"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Smooth Left-to-Right Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent" />

        {/* Hero Content on Left Side */}
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full border border-pink-200">
              Board-Certified Senior Faculty
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 text-xs font-bold rounded-full">
              50+ Verified Specialists
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B4A66] leading-tight font-sans">
            Senior Department Chairs & Surgical Faculty
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            Direct consultation schedules with Padma Awardees, FRCS/FACC certified cardiac surgeons, hepato-biliary transplant specialists, and robotic neurosurgeons across India.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('doctor-registry-toolbar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs sm:text-sm rounded-full shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Specialist Registry</span>
              <ArrowRight className="w-4 h-4 text-[#7FD6FF]" />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('hospitals')}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-[#2B4A66] border border-[#FFD6E8] font-bold text-xs sm:text-sm rounded-full transition cursor-pointer shadow-xs"
            >
              Hospital Explorer ➔
            </button>
          </div>
        </div>

      </div>
      
      {/* Header Toolbar */}
      <div id="doctor-registry-toolbar" className="bg-white rounded-2xl p-6 border border-[#FFD6E8] shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2B4A66] uppercase tracking-wider block mb-1">
            Board-Certified Specialist Registry
          </span>
          <h2 className="text-2xl font-bold text-[#2B4A66] tracking-tight font-sans">
            Senior Medical Faculty & Surgeons
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
            Consult verified department chairs, senior surgeons, and international clinical specialists.
          </p>
        </div>

        {/* Doctor Search & Department Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Dedicated Doctor Search Input Option */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctor name, specialty, hospital..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-50 text-[#2B4A66] placeholder-slate-400 font-medium text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-300 focus:bg-white focus:border-[#7FD6FF] focus:outline-none shadow-xs"
            />
            {localSearch && (
              <button 
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                title="Clear doctor search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 text-[#2B4A66] font-bold text-xs rounded-xl px-3 py-2 border border-slate-300 focus:outline-none focus:border-[#7FD6FF] cursor-pointer"
            >
              {allDepartments.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Specialties' : d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => {
          const isUSD = currency === 'USD';
          const feeDisplay = isUSD
            ? `$${doc.consultationFeeUSD}`
            : `₹${(doc.consultationFeeUSD * 83).toLocaleString('en-IN')}`;

          return (
            <div key={doc._id} className="portal-card overflow-hidden flex flex-col justify-between group">
              <div className="p-6 space-y-4">
                
                {/* Doctor Avatar & Quick Badges */}
                <div className="flex items-start gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    onError={handleImageError}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FFD6E8] shadow-xs group-hover:scale-105 transition-transform duration-300 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[#2B4A66] font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verified Faculty</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2B4A66] group-hover:text-blue-700 transition font-sans leading-snug">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-bold">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{doc.experienceYears} Years Clinical Exp.</p>
                  </div>
                </div>

                {/* Hospital Affiliation & Qualifications */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Building2 className="w-4 h-4 text-[#2B4A66] shrink-0" />
                    <span>{doc.hospitalName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    🎓 {doc.qualifications}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                    {doc.bio}
                  </p>
                </div>

                {/* Consultation Fee Badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold">OPD / Video Consultation:</span>
                  <span className="text-sm font-extrabold text-[#2B4A66]">{feeDisplay}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onConsultDoctor(doc)}
                  className="flex-1 px-3 py-2 bg-white hover:bg-slate-100 text-[#2B4A66] text-xs font-bold rounded-lg border border-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ask Doctor</span>
                </button>

                <button
                  onClick={() => onBookDoctor(doc)}
                  className="flex-1 px-3 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#7FD6FF]" />
                  <span>Book OPD</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
