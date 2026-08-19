import React from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  CalendarCheck,
  TrendingDown,
  Lock,
  Stethoscope,
  Building2,
  ArrowRight
} from 'lucide-react';
import { normalizeTreatment } from '../utils/normalizeData';
import { fuzzySearchMatch } from '../utils/fuzzySearch';

export default function TreatmentCostCalculator({ treatments = [], currency, onBookTreatment, searchQuery, currentUser, onOpenAdminTab, setActiveTab }) {
  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  const normalizedTreatments = (Array.isArray(treatments) ? treatments : []).map(normalizeTreatment).filter(Boolean);

  const filteredTreatments = normalizedTreatments.filter(t => {
    return fuzzySearchMatch(
      { 
        name: t.name, 
        category: t.category, 
        description: t.description 
      },
      searchQuery
    );
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FFF6FB]">
      
      {/* Full Image Background Hero Banner with Soft Left Gradient Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#FFD6E8] mb-10 bg-white min-h-[320px] sm:min-h-[380px] flex items-center">
        
        {/* Full Cover Background Image */}
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1600"
          alt="Robotic Surgery Suite & Modern Operating Room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Smooth Left-to-Right Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent" />

        {/* Hero Content on Left Side */}
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full border border-pink-200">
              Full Price Transparency
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 text-xs font-bold rounded-full">
              Save Up To 85% Vs. US/UK Rates
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B4A66] leading-tight font-sans">
            Surgical Package Tariffs & Treatment Cost Estimator
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            Compare verified all-inclusive surgical procedure packages in India against US/UK hospital averages with zero hidden surgical fees.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('treatment-registry-header');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs sm:text-sm rounded-full shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span>View Surgical Package Rates</span>
              <ArrowRight className="w-4 h-4 text-[#7FD6FF]" />
            </button>
          </div>
        </div>

      </div>

      {/* Header */}
      <div id="treatment-registry-header" className="bg-white rounded-2xl p-6 border border-[#FFD6E8] shadow-xs mb-8">
        <span className="text-xs font-bold text-[#2B4A66] uppercase tracking-wider block mb-1">
          Surgical Tariff Registry
        </span>
        <h2 className="text-2xl font-bold text-[#2B4A66] tracking-tight font-sans">
          Transparent Surgical Package Tariffs & International Savings
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
          Compare verified surgical package rates in India against US/UK hospital tariffs with full transparency.
        </p>
      </div>

      {/* Grid */}
      {filteredTreatments.length === 0 ? (
        <div className="portal-card p-8 bg-white border border-[#FFD6E8] rounded-2xl text-center space-y-3">
          <Calculator className="w-12 h-12 text-[#2B4A66] mx-auto" />
          <h3 className="text-lg font-bold text-[#2B4A66] font-sans">No Procedures Match "{searchQuery}"</h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            Try searching for Cardiology, Orthopaedics, Joint Replacement, Organ Transplant, or Dental Sciences.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredTreatments.map((treatment) => {
            const isUSD = currency === 'USD';
            
            const indiaPrice = isUSD 
              ? `$${treatment.estimatedCostUSD.toLocaleString()}`
              : `₹${treatment.estimatedCostINR.toLocaleString('en-IN')}`;

            const usPrice = isUSD
              ? `$${treatment.usCostUSD.toLocaleString()}`
              : `₹${(treatment.usCostUSD * 83).toLocaleString('en-IN')}`;

            return (
              <div 
                key={treatment._id} 
                className="portal-card p-6 flex flex-col justify-between space-y-4 bg-white border border-[#FFD6E8] rounded-2xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full">
                      {treatment.category}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-950 text-xs font-bold rounded-full flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Save ~{treatment.savingsPercentage}%
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#2B4A66] font-sans">{treatment.name}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{treatment.description}</p>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-center">
                    <div className="border-r border-slate-200 pr-2">
                      <span className="text-[11px] font-bold text-slate-500 block uppercase">India All-Inclusive Rate</span>
                      <span className="text-lg font-extrabold text-emerald-700">{indiaPrice}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block uppercase">US/UK Hospital Average</span>
                      <span className="text-lg font-bold text-slate-500 line-through">{usPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onBookTreatment(treatment)}
                    className="w-full py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#7FD6FF]" />
                    <span>Inquire About Package Tariff</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
