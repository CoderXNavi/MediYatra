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
  Navigation,
  Compass,
  Filter,
  Lock,
  Stethoscope,
  Search,
  ArrowRight,
  Globe2
} from 'lucide-react';
import { normalizeHospital } from '../utils/normalizeData';
import { fuzzySearchMatch } from '../utils/fuzzySearch';
import HospitalMapModal from './HospitalMapModal';

export default function HospitalExplorer({ hospitals = [], currency, onBookHospital, searchQuery = '', currentUser, onOpenAdminTab, setActiveTab }) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedMapHospital, setSelectedMapHospital] = useState(null);

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  const activeSearch = localSearch || searchQuery || '';

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
    const matchesSearch = fuzzySearchMatch(
      { 
        name: h.name, 
        city: h.city, 
        specialties: h.specialties?.join(' '), 
        address: h.address, 
        description: h.description 
      },
      activeSearch
    );

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
    <section id="hospitals-explorer-section" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FFF6FB]">
      
      {/* Full Image Background Hero Banner with Soft Left Gradient Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#FFD6E8] mb-10 bg-white min-h-[320px] sm:min-h-[380px] flex items-center">
        
        {/* Full Cover Background Image */}
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
          alt="Accredited Hospital Infrastructure"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Smooth Left-to-Right Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent" />

        {/* Hero Content on Left Side */}
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full border border-pink-200">
              JCI & NABH Accredited Infrastructure
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 text-xs font-bold rounded-full">
              26 Premier Centers
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B4A66] leading-tight font-sans">
            Accredited Tertiary Hospitals & Medical Care
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            High-quality medical care including cardiac surgery, organ transplants, robotic joint replacements, and surgical oncology across 16 Indian cities.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('hospital-directory-toolbar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs sm:text-sm rounded-full shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Hospitals Below</span>
              <ArrowRight className="w-4 h-4 text-[#7FD6FF]" />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('doctors')}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-[#2B4A66] border border-[#FFD6E8] font-bold text-xs sm:text-sm rounded-full transition cursor-pointer shadow-xs"
            >
              Doctor Directory ➔
            </button>
          </div>
        </div>

      </div>

      {/* Header & Filter Toolbar */}
      <div id="hospital-directory-toolbar" className="bg-white rounded-2xl p-6 border border-[#FFD6E8] shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2B4A66] uppercase tracking-wider block mb-1">
            Accredited Hospital Directory
          </span>
          <h2 className="text-2xl font-bold text-[#2B4A66] tracking-tight font-sans">
            Accredited Tertiary Medical Centers
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
            Explore verified healthcare centers in India offering international patient suites.
          </p>
        </div>

        {/* Search & Filters & Compare CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Hospital Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search hospital name, city, specialty..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-50 text-[#2B4A66] placeholder-slate-400 font-medium text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-300 focus:bg-white focus:border-[#7FD6FF] focus:outline-none shadow-xs"
            />
            {localSearch && (
              <button 
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                title="Clear hospital search"
              >
                ✕
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 text-[#2B4A66] font-bold text-xs rounded-xl px-3 py-2 border border-slate-300 focus:outline-none focus:border-[#7FD6FF] cursor-pointer"
            >
              {allCities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 text-[#2B4A66] font-bold text-xs rounded-xl px-3 py-2 border border-slate-300 focus:outline-none focus:border-[#7FD6FF] cursor-pointer"
            >
              {allSpecialties.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</option>
              ))}
            </select>
          </div>

          {/* Compare Button */}
          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-[#2B4A66] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 hover:bg-[#1E364B] transition cursor-pointer"
            >
              <span>Compare ({compareList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map(hosp => {
          const isComparing = compareList.some(item => item._id === hosp._id);
          return (
            <div key={hosp._id} className="portal-card overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Hospital Photo */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#2B4A66] text-[10px] font-bold rounded-full shadow-xs">
                      📍 {hosp.city}
                    </span>
                    {hosp.accreditations && (
                      <span className="px-2.5 py-1 bg-[#2B4A66] text-white text-[10px] font-bold rounded-full shadow-xs">
                        {hosp.accreditations[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-[#2B4A66] group-hover:text-blue-700 transition font-sans leading-snug">
                    {hosp.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                    {hosp.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(hosp.specialties || []).slice(0, 3).map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[#2B4A66]" />
                      <span>{hosp.bedCount || 500}+ Beds</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 (120+ reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Toolbar with Location & Official Site buttons preserved! */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {/* Location Map Modal Button */}
                  <button
                    onClick={() => setSelectedMapHospital(hosp)}
                    className="flex-1 px-2.5 py-1.5 bg-white text-[#2B4A66] hover:bg-blue-50 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
                    title="View Google Map Location"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Location</span>
                  </button>

                  {/* Official Website Link Button */}
                  <button
                    onClick={() => window.open(hosp.websiteUrl || 'https://www.apollohospitals.com', '_blank')}
                    className="flex-1 px-2.5 py-1.5 bg-white text-[#2B4A66] hover:bg-blue-50 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
                    title="Visit Official Hospital Website"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-[#2B4A66]" />
                    <span>Official Site</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompare(hosp)}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                      isComparing 
                        ? 'bg-[#FFD6E8] text-[#2B4A66] border-pink-300' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isComparing ? '✓ Comparing' : '+ Compare'}
                  </button>

                  <button
                    onClick={() => onBookHospital(hosp)}
                    className="flex-1 px-3 py-1.5 bg-[#2B4A66] hover:bg-[#1E364B] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-[#7FD6FF]" />
                    <span>Book Consultation</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Hospital Map Modal */}
      {selectedMapHospital && (
        <HospitalMapModal
          hospital={selectedMapHospital}
          onClose={() => setSelectedMapHospital(null)}
        />
      )}

    </section>
  );
}
