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
  Navigation
} from 'lucide-react';
import { normalizeDoctor } from '../utils/normalizeData';
import { fuzzySearchMatch } from '../utils/fuzzySearch';
import HospitalMapModal from './HospitalMapModal';

export default function DoctorDirectory({ doctors = [], currency, onConsultDoctor, onBookDoctor, searchQuery, currentUser, onOpenAdminTab, setActiveTab }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedMapHospital, setSelectedMapHospital] = useState(null);

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

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
      searchQuery
    );

    const matchesDept = selectedDept === 'All' || doc.specialty.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesDept;
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Visual Hero Banner for Doctor Directory */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#8FA9FF] mb-8 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600"
          alt="Senior Medical Faculty & Surgeons"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-[#2D3A5E]/70 to-transparent" />
        
        <div className="relative p-6 sm:p-8 text-white space-y-2 z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
              Board-Certified Senior Faculty
            </span>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
              50+ Verified Specialists
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight drop-shadow-md">
            Senior Department Chairs & Surgical Faculty
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold drop-shadow max-w-2xl leading-relaxed">
            Direct consultation schedules with Padma Awardees, FRCS/FACC certified cardiac surgeons, hepato-biliary transplant specialists, and robotic neurosurgeons across India.
          </p>
        </div>
      </div>
      
      {/* Header Toolbar */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
            Board-Certified Specialist Registry
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Senior Medical Faculty & Surgeons
          </h2>
          <p className="text-slate-900 text-xs sm:text-sm mt-1 font-bold">
            Consult verified department chairs, senior surgeons, and international clinical specialists.
          </p>
        </div>

        {/* Department Filter Select */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border-2 border-slate-300 text-xs font-black">
          <Filter className="w-4 h-4 text-[#2D3A5E]" />
          <span className="text-slate-900">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer"
          >
            {allDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredDoctors.length === 0 ? (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6">
          <div className="text-center space-y-2">
            <UserCheck className="w-12 h-12 text-[#2D3A5E] mx-auto" />
            <h3 className="text-lg font-black text-slate-900 font-sans">No Doctors Match "{searchQuery || selectedDept}"</h3>
            <p className="text-xs text-slate-800 font-extrabold max-w-md mx-auto">
              Select one of our verified clinical departments below to browse available senior specialists:
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-2">Explore Medical Departments</span>
            <div className="flex flex-wrap gap-2">
              {allDepartments.filter(d => d !== 'All').map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className="px-3.5 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg hover:bg-[#1A233D] transition shadow-xs flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#8FA9FF]" />
                  <span>{dept} Specialists</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => {
            const displayFee = doc.opdFee
              ? `₹${doc.opdFee.toLocaleString('en-IN')}`
              : doc.consultationFeeINR 
                ? `₹${doc.consultationFeeINR.toLocaleString('en-IN')}`
                : doc.consultationFeeUSD
                  ? `$${doc.consultationFeeUSD}`
                  : 'Contact Desk';

            return (
              <div 
                key={doc._id} 
                className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between hover:shadow-lg transition space-y-4"
              >
                <div className="space-y-4">
                  
                  {/* Doctor Top Info Header */}
                  <div className="flex gap-4 items-start">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      onError={handleImageError}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-slate-300 shadow-sm shrink-0 bg-slate-100"
                    />

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                          {doc.designation || 'Verified Faculty'}
                        </span>
                        {doc.rating ? (
                          <span className="text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                            {doc.rating}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="text-lg font-black text-slate-900 font-sans leading-snug">
                        {doc.name}
                      </h3>

                      <p className="text-xs font-black text-[#2D3A5E]">
                        {doc.specialty} {doc.subSpecialty ? `• ${doc.subSpecialty}` : ''}
                      </p>

                      <div className="flex items-center justify-between gap-1 pt-1">
                        <p className="text-[11px] text-slate-700 font-extrabold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{doc.hospitalName}</span>
                        </p>
                        <button
                          onClick={() => setSelectedMapHospital({
                            name: doc.hospitalName,
                            address: doc.hospitalName,
                            city: doc.hospitalCity || 'India',
                            rating: doc.rating
                          })}
                          className="text-[11px] font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                          title="View Hospital Location Map"
                        >
                          <MapPin className="w-3 h-3 text-blue-700" />
                          <span>Map</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900">
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Qualifications</span>
                      <span className="font-extrabold text-slate-900">{doc.qualifications || 'Verified Medical Degree'}</span>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Experience</span>
                      <span className="font-extrabold text-slate-900">
                        {doc.experienceYears ? `${doc.experienceYears}+ Yrs Clinical` : 'Senior Medical Faculty'}
                      </span>
                    </div>
                  </div>

                  {/* Spoken Languages & Source Link */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
                        Languages Spoken
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(doc.languagesSpoken) && doc.languagesSpoken.length > 0 ? (
                          doc.languagesSpoken.map((lang, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 bg-slate-100 text-slate-900 text-[11px] font-extrabold rounded border border-slate-300"
                            >
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-600 font-semibold italic">Languages not specified</span>
                        )}
                      </div>
                    </div>

                    {doc.sourceUrl && (
                      <a
                        href={doc.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                      >
                        Official Profile ↗
                      </a>
                    )}
                  </div>

                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-700 font-black uppercase block">OPD Fee</span>
                    <span className="text-base font-black text-slate-900 font-mono">{displayFee}</span>
                  </div>

                  {isDoctor ? (
                    <button
                      onClick={() => setActiveTab && setActiveTab('doctor-portal')}
                      className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-[#8FA9FF]" />
                      <span>Go to Doctor Portal</span>
                    </button>
                  ) : isHospital ? (
                    <button
                      onClick={() => setActiveTab && setActiveTab('hospital-portal')}
                      className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#8FA9FF]" />
                      <span>Go to Hospital Portal</span>
                    </button>
                  ) : isAdmin ? (
                    <button
                      onClick={() => onOpenAdminTab && onOpenAdminTab('doctors')}
                      className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#8FA9FF]" />
                      <span>Manage via Admin Control Panel</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onConsultDoctor(doc)}
                        className="px-3 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Consult Doctor</span>
                      </button>

                      <button
                        onClick={() => onBookDoctor(doc)}
                        className="px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition shrink-0"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-white" />
                        <span>Book OPD</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Render Hospital Map Modal */}
      {selectedMapHospital && (
        <HospitalMapModal
          hospital={selectedMapHospital}
          onClose={() => setSelectedMapHospital(null)}
          isNonPatient={isNonPatient}
        />
      )}

    </section>
  );
}
