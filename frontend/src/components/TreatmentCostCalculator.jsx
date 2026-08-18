import React from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  CalendarCheck,
  TrendingDown,
  Lock,
  Stethoscope,
  Building2
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
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Visual Hero Banner for Surgical Tariffs */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#8FA9FF] mb-8 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1600"
          alt="Robotic Surgery Suite & Modern Operating Room"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-[#2D3A5E]/70 to-transparent" />
        
        <div className="relative p-6 sm:p-8 text-white space-y-2 z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
              Full Price Transparency
            </span>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
              Save Up To 85% Vs. US/UK Rates
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight drop-shadow-md">
            Surgical Package Tariffs & Treatment Cost Estimator
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold drop-shadow max-w-2xl leading-relaxed">
            Compare verified all-inclusive surgical procedure packages in India against US/UK hospital averages with zero hidden surgical fees.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm mb-8">
        <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">
          Surgical Tariff Registry
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
          Transparent Surgical Package Tariffs & International Savings
        </h2>
        <p className="text-slate-900 text-xs sm:text-sm mt-1 font-bold">
          Compare verified surgical package rates in India against US/UK hospital tariffs with full transparency.
        </p>
      </div>

      {/* Grid */}
      {filteredTreatments.length === 0 ? (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl text-center space-y-3">
          <Calculator className="w-12 h-12 text-[#2D3A5E] mx-auto" />
          <h3 className="text-lg font-black text-slate-900 font-sans">No Procedures Match "{searchQuery}"</h3>
          <p className="text-xs text-slate-800 font-extrabold max-w-md mx-auto">
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
                className="portal-card p-6 flex flex-col justify-between space-y-4 bg-white border-2 border-slate-300 rounded-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 border-b-2 border-slate-200 pb-3">
                    <div>
                      <span className="px-2.5 py-1 bg-slate-100 text-[#2D3A5E] text-[10px] font-black rounded uppercase border border-slate-300">
                        {treatment.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1.5 font-sans leading-tight">
                        {treatment.name}
                      </h3>
                    </div>

                    <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded text-right shrink-0">
                      <span className="text-[9px] font-black block uppercase text-emerald-900">Cost Savings</span>
                      <span className="text-sm font-black text-emerald-950 flex items-center justify-end gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {treatment.savingsPercentage}% SAVED
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-900 text-xs sm:text-sm font-semibold leading-relaxed">
                    {treatment.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-100 rounded border-2 border-slate-200 text-center text-xs font-bold">
                    <div>
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Hospital Stay</span>
                      <span className="font-extrabold text-slate-900">{treatment.durationDays} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Success Rate</span>
                      <span className="font-extrabold text-emerald-800">{treatment.successRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Recovery</span>
                      <span className="font-extrabold text-slate-900">{treatment.recoveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Price Banner */}
                <div className="pt-3 border-t-2 border-slate-100 space-y-2">
                  <div className="bg-[#2D3A5E] text-white rounded-xl p-4 border-2 border-[#1A233D] shadow">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">US / UK Hospital Tariff:</span>
                      <span className="line-through text-slate-300 font-black">{usPrice}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div>
                        <span className="text-[11px] text-[#8FA9FF] font-black block">Accredited India Tariff:</span>
                        <span className="text-xl sm:text-2xl font-black text-white font-sans">{indiaPrice}</span>
                      </div>

                      {isDoctor ? (
                        <button
                          onClick={() => setActiveTab && setActiveTab('doctor-portal')}
                          className="w-full sm:w-auto px-3.5 py-2 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] font-black text-xs rounded shadow flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                        >
                          <Stethoscope className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Doctor Portal</span>
                        </button>
                      ) : isHospital ? (
                        <button
                          onClick={() => setActiveTab && setActiveTab('hospital-portal')}
                          className="w-full sm:w-auto px-3.5 py-2 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] font-black text-xs rounded shadow flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Hospital Portal</span>
                        </button>
                      ) : isAdmin ? (
                        <button
                          onClick={() => onOpenAdminTab && onOpenAdminTab('treatments')}
                          className="w-full sm:w-auto px-3.5 py-2 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] font-black text-xs rounded shadow flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Admin Panel</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onBookTreatment(treatment)}
                          className="w-full sm:w-auto px-3.5 py-2 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] font-black text-xs rounded shadow flex items-center justify-center gap-1.5 transition shrink-0"
                        >
                          <CalendarCheck className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Get Package Estimate</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-900 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 font-black shrink-0" />
                    Includes surgeon fee, pre-op diagnostics, hospital stay & nursing care.
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
