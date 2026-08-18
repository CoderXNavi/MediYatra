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
  MessageSquare
} from 'lucide-react';
import { normalizeDoctor } from '../utils/normalizeData';

export default function DoctorDirectory({ doctors = [], currency, onConsultDoctor, onBookDoctor, searchQuery, currentUser }) {
  const [selectedDept, setSelectedDept] = useState('All');

  const isAdmin = currentUser?.role === 'Admin';
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
    const matchesSearch = 
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.hospitalName && doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || doc.specialty.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesDept;
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
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
            const displayFee = currency === 'INR' ? `₹${doc.consultationFeeINR.toLocaleString('en-IN')}` : `$${doc.consultationFeeUSD}`;

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
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                          Verified Faculty
                        </span>
                        <span className="text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                          {doc.rating} ({doc.reviewCount})
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 font-sans leading-snug">
                        {doc.name}
                      </h3>

                      <p className="text-xs font-black text-[#2D3A5E]">
                        {doc.specialty}
                      </p>

                      <p className="text-[11px] text-slate-700 font-extrabold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{doc.hospitalName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900">
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Qualifications</span>
                      <span className="font-extrabold text-slate-900">{doc.qualifications}</span>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Experience</span>
                      <span className="font-extrabold text-slate-900">{doc.experienceYears} Years Clinical</span>
                    </div>
                  </div>

                  {/* Spoken Languages */}
                  <div>
                    <span className="text-[10px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
                      Languages Spoken
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.languagesSpoken?.map((lang, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 bg-slate-100 text-slate-900 text-[11px] font-extrabold rounded border border-slate-300"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-700 font-black uppercase block">OPD Fee</span>
                    <span className="text-base font-black text-slate-900 font-mono">{displayFee}</span>
                  </div>

                  {isAdmin ? (
                    <span className="text-xs font-black text-[#2D3A5E] bg-slate-100 px-3 py-2 rounded border-2 border-slate-300">
                      Managed via Admin Control Panel
                    </span>
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

    </section>
  );
}
