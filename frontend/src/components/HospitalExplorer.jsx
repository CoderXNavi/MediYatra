import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Award, 
  Bed, 
  CalendarCheck, 
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Filter,
  Lock,
  Stethoscope
} from 'lucide-react';
import { normalizeHospital } from '../utils/normalizeData';

export default function HospitalExplorer({ hospitals = [], currency, onBookHospital, searchQuery, currentUser, onOpenAdminTab, setActiveTab }) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  const normalizedHospitals = (Array.isArray(hospitals) ? hospitals : []).map(normalizeHospital).filter(Boolean);

  const allCities = ['All', 'New Delhi', 'Gurugram', 'Chennai', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata'];
  const allSpecialties = [
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

  const filteredHospitals = normalizedHospitals.filter(h => {
    const matchesSearch = 
      !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.specialties && h.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'All' || (h.specialties && h.specialties.includes(selectedSpecialty));

    return matchesSearch && matchesCity && matchesSpecialty;
  });

  function toggleCompare(hosp) {
    if (compareList.some(item => item._id === hosp._id)) {
      setCompareList(compareList.filter(item => item._id !== hosp._id));
    } else {
      if (compareList.length >= 3) return;
      setCompareList([...compareList, hosp]);
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200';
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Filter Toolbar */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
            Accredited Hospital Directory
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Accredited Tertiary Medical Centers
          </h2>
          <p className="text-slate-900 text-xs sm:text-sm mt-1 font-bold">
            Explore verified tertiary healthcare centers in India offering international patient suites.
          </p>
        </div>

        {/* Filters & Compare CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded border-2 border-slate-300 text-xs font-extrabold">
            <span className="text-slate-900 font-black">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer"
            >
              {allCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded border-2 border-slate-300 text-xs font-extrabold">
            <span className="text-slate-900 font-black">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer"
            >
              {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow hover:bg-[#1A233D]"
            >
              Compare ({compareList.length}/3)
            </button>
          )}
        </div>
      </div>

      {/* Hospital Grid */}
      {filteredHospitals.length === 0 ? (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6">
          <div className="text-center space-y-2">
            <Building2 className="w-12 h-12 text-[#2D3A5E] mx-auto" />
            <h3 className="text-lg font-black text-slate-900 font-sans">No Exact Matches for "{searchQuery || selectedSpecialty}"</h3>
            <p className="text-xs text-slate-800 font-extrabold max-w-md mx-auto">
              Select one of our all available accredited departments or cities below to view verified medical centers:
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div>
              <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-2">Browse All Hospital Specialties</span>
              <div className="flex flex-wrap gap-2">
                {allSpecialties.filter(s => s !== 'All').map(spec => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecialty(spec);
                      setSelectedCity('All');
                    }}
                    className="px-3 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded-lg hover:bg-[#1A233D] transition shadow-xs"
                  >
                    + {spec} Hospitals
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-2">Browse All Hospital Cities</span>
              <div className="flex flex-wrap gap-2">
                {allCities.filter(c => c !== 'All').map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setSelectedSpecialty('All');
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-[#2D3A5E] text-xs font-black rounded-lg border-2 border-slate-300 hover:bg-slate-200 transition"
                  >
                    📍 Hospitals in {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredHospitals.map((hosp) => {
            const isCompared = compareList.some(item => item._id === hosp._id);

            return (
              <div 
                key={hosp._id} 
                className="portal-card overflow-hidden flex flex-col justify-between bg-white border-2 border-slate-300 rounded-xl hover:shadow-lg transition relative"
              >
                {/* Hospital Image Banner */}
                <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Compare Selection Checkbox */}
                  <button
                    onClick={() => toggleCompare(hosp)}
                    className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-black rounded shadow transition border ${
                      isCompared ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/90 text-slate-900 border-slate-300 hover:bg-white'
                    }`}
                  >
                    {isCompared ? '✓ Selected for Compare' : '+ Compare'}
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <span className="text-xs font-black flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8FA9FF]" />
                      {hosp.city}, {hosp.country}
                    </span>
                    <span className="text-xs font-black bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                      {hosp.rating} ({hosp.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-sans leading-tight">
                        {hosp.name}
                      </h3>
                      <p className="text-xs text-slate-700 font-extrabold mt-1">
                        {hosp.address}
                      </p>
                    </div>

                    <p className="text-xs text-slate-900 font-semibold leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                      {hosp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900">
                      <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-700 font-black uppercase block">Capacity</span>
                        <span className="font-extrabold flex items-center gap-1 text-slate-900">
                          <Bed className="w-4 h-4 text-[#2D3A5E]" /> {hosp.beds} Inpatient Beds
                        </span>
                      </div>
                      <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-700 font-black uppercase block">Established</span>
                        <span className="font-extrabold text-slate-900">{hosp.establishedYear} ({new Date().getFullYear() - hosp.establishedYear} Yrs Care)</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
                        Key Centers of Excellence
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {hosp.specialties?.map((spec, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 bg-slate-100 text-slate-900 text-[11px] font-extrabold rounded border border-slate-300"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-900 font-bold">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Concierge Support</span>
                      <span className="text-emerald-800 font-black flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> 24/7 International Desk
                      </span>
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
                        onClick={() => onOpenAdminTab && onOpenAdminTab('hospitals')}
                        className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Manage via Admin Control Panel</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onBookHospital(hosp)}
                        className="px-4 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded shadow flex items-center gap-1.5 transition shrink-0"
                      >
                        <CalendarCheck className="w-4 h-4 text-[#8FA9FF]" />
                        <span>Book Hospital OPD</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Hospital Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-black text-slate-900 font-sans">Side-by-Side Hospital Comparison</h3>
              <button onClick={() => setShowCompareModal(false)}><X className="w-6 h-6 text-slate-500" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareList.map((h) => (
                <div key={h._id} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-300 space-y-3">
                  <h4 className="text-base font-black text-slate-900 font-sans">{h.name}</h4>
                  <p className="text-xs text-slate-700 font-extrabold">{h.city}, {h.country}</p>
                  
                  <div className="text-xs space-y-1 font-bold">
                    <p><span className="text-slate-500">Rating:</span> ⭐ {h.rating}</p>
                    <p><span className="text-slate-500">Beds:</span> {h.beds} Beds</p>
                    <p><span className="text-slate-500">Established:</span> {h.establishedYear}</p>
                  </div>

                  {!isNonPatient && (
                    <button
                      onClick={() => {
                        setShowCompareModal(false);
                        onBookHospital(h);
                      }}
                      className="w-full py-2 bg-[#2D3A5E] text-white text-xs font-black rounded shadow"
                    >
                      Book OPD
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
