import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  FileText, 
  Languages, 
  Hotel, 
  Plane, 
  HeartHandshake, 
  ShieldCheck,
  Building2,
  CheckCircle2,
  CalendarCheck,
  Check,
  Star,
  Lock,
  Stethoscope
} from 'lucide-react';
import { apiService } from '../services/api';

export default function MedicalTourismHub({ currency, onSelectService, currentUser, onOpenAdminTab, setActiveTab }) {
  const [accommodations, setAccommodations] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [activeTab, setActiveTabLocal] = useState('visa');
  const [bookingNotice, setBookingNotice] = useState('');

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  useEffect(() => {
    async function loadData() {
      try {
        const acc = await apiService.getAccommodations();
        const trans = await apiService.getTranslators();
        setAccommodations(Array.isArray(acc) ? acc : []);
        setTranslators(Array.isArray(trans) ? trans : []);
      } catch (err) {
        console.warn('Error loading tourism data:', err);
      }
    }
    loadData();
  }, []);

  const defaultAccImages = {
    'acc_001': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    'acc_002': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'acc_003': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
  };

  async function handleBookTourismService(serviceTitle) {
    if (isNonPatient) return;

    try {
      const userObj = JSON.parse(localStorage.getItem('mediyatra_user') || '{}');
      const patientEmail = userObj.email || 'guest@mediyatra.org';
      const patientName = userObj.name || 'International Patient';

      const response = await fetch('/api/tourism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail,
          patientName,
          serviceType: serviceTitle,
          serviceDetails: `Booked via Tourism Concierge Hub (${new Date().toLocaleDateString()})`
        })
      });

      if (response.ok) {
        setBookingNotice(`✅ Request for "${serviceTitle}" submitted! Admin operations desk will confirm your order.`);
      }
    } catch (e) {
      console.warn(e);
    }
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Visual Hero Banner for Medical Tourism Concierge */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#8FA9FF] mb-8 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600"
          alt="International Medical Tourism Concierge & Flight Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-[#2D3A5E]/70 to-transparent" />
        
        <div className="relative p-6 sm:p-8 text-white space-y-2 z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
              End-to-End Travel Concierge
            </span>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
              24h Visa Recommendation Letter
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight drop-shadow-md">
            International Medical Tourism & Flight Concierge
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold drop-shadow max-w-2xl leading-relaxed">
            Full concierge support including e-Medical Visa Invitation Letters issued by host hospitals, certified multilingual interpreters, airport wheelchair transfers, and serviced recovery guest suites.
          </p>
        </div>
      </div>
      
      {/* Header Toolbar */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm mb-8">
        <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
          MEDIYATRA International Support Services
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
          e-Medical Visa, Translators & Travel Concierge
        </h2>
        <p className="text-slate-900 text-xs sm:text-sm mt-1 font-bold">
          Hospital visa invitation letters, certified language interpreters, serviced recovery guest houses, and airport transfers.
        </p>
      </div>

      {bookingNotice && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between">
          <span>{bookingNotice}</span>
          <button onClick={() => setBookingNotice('')} className="p-1 font-mono">X</button>
        </div>
      )}

      {/* Primary Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'visa', label: 'Medical Visa Assistance', icon: FileText },
          { id: 'interpreters', label: 'Certified Interpreters', icon: Languages },
          { id: 'accommodations', label: 'Serviced Accommodations', icon: Hotel },
          { id: 'logistics', label: 'Airport & Local Logistics', icon: Plane },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabLocal(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-black transition ${
                isActive
                  ? 'bg-[#2D3A5E] text-white shadow border-2 border-[#2D3A5E]'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-2 border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#8FA9FF]' : 'text-[#2D3A5E]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Medical Visa Assistance */}
      {activeTab === 'visa' && (
        <div className="grid md:grid-cols-2 gap-8 items-center portal-card p-8 bg-white border-2 border-slate-300 rounded-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#2D3A5E] text-xs font-black rounded border border-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#2D3A5E]" /> Official Visa Invitation Letter (VIL)
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 font-sans">
              Fast-Track e-Medical Visa Processing
            </h3>
            
            <p className="text-slate-900 text-xs sm:text-sm leading-relaxed font-bold">
              We coordinate directly with accredited partner hospitals to issue official Visa Invitation Letters required by Indian Embassies and Consulates within 24 hours.
            </p>

            <ul className="space-y-2 text-xs text-slate-900 font-extrabold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 font-black shrink-0" /> Coverage for patient and up to two medical attendants.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 font-black shrink-0" /> Visa extension assistance for extended surgical recovery.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 font-black shrink-0" /> FRRO registration desk support upon landing.
              </li>
            </ul>

            {isDoctor ? (
              <button
                onClick={() => setActiveTab && setActiveTab('doctor-portal')}
                className="mt-2 px-5 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 transition cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-[#8FA9FF]" />
                <span>Go to Doctor Portal</span>
              </button>
            ) : isHospital ? (
              <button
                onClick={() => setActiveTab && setActiveTab('hospital-portal')}
                className="mt-2 px-5 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 transition cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#8FA9FF]" />
                <span>Go to Hospital Portal</span>
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => onOpenAdminTab && onOpenAdminTab('tourism')}
                className="mt-2 px-5 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 transition cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#8FA9FF]" />
                <span>Manage via Admin Desk</span>
              </button>
            ) : (
              <button
                onClick={() => handleBookTourismService('Medical Visa Invitation Letter')}
                className="mt-2 px-5 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4 text-[#8FA9FF]" />
                <span>Request Visa Recommendation Letter</span>
              </button>
            )}
          </div>

          <div className="rounded-xl overflow-hidden border-2 border-slate-300 shadow h-64 sm:h-80 w-full relative bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
              alt="Medical Travel Assistance"
              onError={handleImageError}
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent text-white">
              <span className="text-xs font-black uppercase text-[#8FA9FF] tracking-wider block">Global Travel Concierge</span>
              <p className="text-xs font-bold text-slate-200">Dedicated assistance from departure airport to hospital desk</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Certified Interpreters */}
      {activeTab === 'interpreters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-sans">Certified Medical Interpreters</h3>
            <span className="text-xs font-black text-[#2D3A5E]">Available 24/7 in Hospitals & Clinics</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {translators.map((trans) => {
              const usdFee = trans.ratePerDayUSD || 40;
              const inrFee = Math.round(usdFee * 82);
              const displayFee = currency === 'INR' ? `₹${inrFee.toLocaleString('en-IN')}/day` : `$${usdFee}/day`;
              const langs = trans.languagesSpoken || trans.languages || ['English'];

              return (
                <div key={trans._id} className="portal-card p-6 flex flex-col justify-between space-y-4 bg-white border-2 border-slate-300 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900 font-sans">{trans.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                          {trans.isCertified ? 'NABL Certified' : 'Verified'}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 font-mono">{displayFee}</span>
                    </div>

                    <div className="space-y-1 text-xs font-bold text-slate-900">
                      <p className="text-[#2D3A5E] font-black flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-[#2D3A5E]" />
                        <span>Languages: {Array.isArray(langs) ? langs.join(' • ') : langs}</span>
                      </p>
                      <p className="text-slate-800">
                        Specialization: {trans.specialization || 'Medical & Surgical Terminology'}
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        Cities: {Array.isArray(trans.availableInCities) ? trans.availableInCities.join(', ') : 'All Tertiary Hubs'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-700 font-extrabold">Dedicated Clinical Companion</span>
                    {isDoctor ? (
                      <button
                        onClick={() => setActiveTab && setActiveTab('doctor-portal')}
                        className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                      >
                        <Stethoscope className="w-3 h-3 text-[#8FA9FF]" /> Doctor Portal
                      </button>
                    ) : isHospital ? (
                      <button
                        onClick={() => setActiveTab && setActiveTab('hospital-portal')}
                        className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                      >
                        <Building2 className="w-3 h-3 text-[#8FA9FF]" /> Hospital Portal
                      </button>
                    ) : isAdmin ? (
                      <button
                        onClick={() => onOpenAdminTab && onOpenAdminTab('tourism')}
                        className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3 h-3 text-[#8FA9FF]" /> Admin Desk
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookTourismService(`Medical Interpreter: ${trans.name}`)}
                        className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                      >
                        <Languages className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Book Interpreter</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Serviced Accommodations */}
      {activeTab === 'accommodations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-sans">Patient Recovery Suites & Serviced Apartments</h3>
            <span className="text-xs font-black text-[#2D3A5E]">Near Major Tertiary Hospitals</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {accommodations.map((acc) => {
              const usdPrice = acc.pricePerNightUSD || 35;
              const inrPrice = Math.round(usdPrice * 82);
              const displayPrice = currency === 'INR' ? `₹${inrPrice.toLocaleString('en-IN')}/night` : `$${usdPrice}/night`;
              const photo = acc.image || defaultAccImages[acc._id] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
              const amenityList = acc.amenities || acc.features || ['Wheelchair Accessible', '24/7 Nurse Desk', 'Kitchenette'];

              return (
                <div key={acc._id} className="portal-card overflow-hidden flex flex-col justify-between bg-white border-2 border-slate-300 rounded-xl">
                  <div className="relative h-48 bg-slate-900">
                    <img 
                      src={photo} 
                      alt={acc.name} 
                      onError={handleImageError}
                      className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] shadow">
                      {acc.city || 'Recovery Residency'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-sans">{acc.name}</h4>
                      <p className="text-xs text-slate-800 font-bold flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-[#2D3A5E]" />
                        <span>Near {acc.nearHospital} ({acc.distanceKm} km)</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-900 font-extrabold">
                      {amenityList.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded border border-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 font-mono">{displayPrice}</span>
                      {isDoctor ? (
                        <button
                          onClick={() => setActiveTab && setActiveTab('doctor-portal')}
                          className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                        >
                          <Stethoscope className="w-3 h-3 text-[#8FA9FF]" /> Doctor Portal
                        </button>
                      ) : isHospital ? (
                        <button
                          onClick={() => setActiveTab && setActiveTab('hospital-portal')}
                          className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                        >
                          <Building2 className="w-3 h-3 text-[#8FA9FF]" /> Hospital Portal
                        </button>
                      ) : isAdmin ? (
                        <button
                          onClick={() => onOpenAdminTab && onOpenAdminTab('tourism')}
                          className="px-3 py-1 bg-[#2D3A5E] text-white text-xs font-black rounded border border-[#8FA9FF] flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-[#8FA9FF]" /> Admin Desk
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBookTourismService(`Serviced Suite: ${acc.name}`)}
                          className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                        >
                          <Hotel className="w-3.5 h-3.5 text-[#8FA9FF]" />
                          <span>Reserve Suite</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Airport & Local Logistics */}
      {activeTab === 'logistics' && (
        <div className="portal-card p-8 space-y-6 bg-white border-2 border-slate-300 rounded-xl">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl font-black text-slate-900 font-sans">
              Airport Pickup & Wheelchair Van Transfers
            </h3>
            <p className="text-slate-900 text-xs sm:text-sm leading-relaxed font-bold">
              Upon arrival at international airports, our patient representative greets you at the terminal with private vehicle transfers.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300 space-y-1">
              <Plane className="w-6 h-6 text-[#2D3A5E] mb-1" />
              <h4 className="text-sm font-black text-slate-900">Airport Greeter</h4>
              <p className="text-xs text-slate-800 font-bold">Dedicated officer meets you at international arrivals with welcome name sign.</p>
            </div>
            
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300 space-y-1">
              <Hotel className="w-6 h-6 text-[#2D3A5E] mb-1" />
              <h4 className="text-sm font-black text-slate-900">Hotel & Suite Transfer</h4>
              <p className="text-xs text-slate-800 font-bold">Direct transfer to your reserved guest house or medical recovery suite.</p>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300 space-y-1">
              <HeartHandshake className="w-6 h-6 text-[#2D3A5E] mb-1" />
              <h4 className="text-sm font-black text-slate-900">Hospital Escort Desk</h4>
              <p className="text-xs text-slate-800 font-bold">Personal officer for hospital OPD registration & admission paperwork.</p>
            </div>
          </div>

          {isDoctor ? (
            <button
              onClick={() => setActiveTab && setActiveTab('doctor-portal')}
              className="px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#8FA9FF]" />
              <span>Go to Doctor Portal</span>
            </button>
          ) : isHospital ? (
            <button
              onClick={() => setActiveTab && setActiveTab('hospital-portal')}
              className="px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#8FA9FF]" />
              <span>Go to Hospital Portal</span>
            </button>
          ) : isAdmin ? (
            <button
              onClick={() => onOpenAdminTab && onOpenAdminTab('tourism')}
              className="px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#8FA9FF]" />
              <span>Manage via Admin Concierge Desk</span>
            </button>
          ) : (
            <button
              onClick={() => handleBookTourismService('Airport Pickup & Private Transfer')}
              className="px-6 py-3 bg-[#2D3A5E] text-white text-xs sm:text-sm font-black rounded-lg shadow flex items-center gap-2 hover:bg-[#1A233D] transition"
            >
              <Plane className="w-4 h-4 text-[#8FA9FF]" />
              <span>Schedule Airport Pickup</span>
            </button>
          )}
        </div>
      )}

    </section>
  );
}
