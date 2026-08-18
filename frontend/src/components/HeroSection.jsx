import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Calculator, 
  FileText, 
  Stethoscope, 
  PhoneCall, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Bell,
  ArrowRight
} from 'lucide-react';

export default function HeroSection({ 
  searchQuery, 
  setSearchQuery, 
  setActiveTab, 
  onOpenAITriage,
  onOpenBooking,
  onOpenEmergency
}) {
  return (
    <div className="space-y-8 pb-8 pt-2">
      
      {/* 1. Top Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Mission Box */}
          <div className="lg:col-span-3 bg-[#2D3A5E] text-white rounded-xl p-6 shadow-md flex flex-col justify-between border-2 border-[#8FA9FF]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#8FA9FF] pb-2">
                <ShieldCheck className="w-5 h-5 text-[#8FA9FF]" />
                <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
                  MEDI'YATRA HERITAGE
                </span>
              </div>
              
              <h2 className="text-xl font-black text-white leading-snug font-sans">
                Connecting Health, Facilitating Care
              </h2>
              
              <p className="text-white text-xs font-extrabold leading-relaxed">
                Dedicated medical concierge guiding patients to verified tertiary medical care across India.
              </p>
              
              <ul className="text-xs text-white space-y-2 pt-1 font-extrabold">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#8FA9FF] font-black">•</span>
                  <span>Verified hospital partner network across India.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#8FA9FF] font-black">•</span>
                  <span>Full price transparency with zero hidden surgical fees.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('hospitals')}
              className="mt-6 flex items-center justify-between text-xs font-black text-[#8FA9FF] hover:text-white transition"
            >
              <span>Explore Accredited Hospitals »</span>
            </button>
          </div>

          {/* Middle Photo Banner */}
          <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-md relative border-2 border-[#D7C6FF] min-h-[260px] bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200"
              alt="Medical Faculty in Session"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-transparent to-black/40" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="px-2.5 py-0.5 bg-[#8FA9FF] text-[#2D3A5E] text-[10px] font-black rounded uppercase">
                A Heritage of Healing
              </span>
              <h3 className="text-xl font-black text-white leading-snug font-sans drop-shadow-md">
                Accredited Senior Specialists & Tertiary Hospital Centers
              </h3>
              <p className="text-xs text-white font-extrabold drop-shadow">
                Over 4,500 board-certified surgeons and department heads available for direct consultation.
              </p>
            </div>
          </div>

          {/* Right Bulletin Box */}
          <div className="lg:col-span-3 bg-white rounded-xl p-5 border-2 border-[#D7C6FF] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#D7C6FF] pb-2 mb-3">
                <h3 className="text-sm font-black text-[#2D3A5E] flex items-center gap-1.5 font-sans">
                  <Bell className="w-4 h-4 text-red-700" />
                  Patient Bulletins & Alerts
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[10px] text-[#2D3A5E] font-black block">18/08/2026</span>
                  <p className="text-[#2D3A5E] font-black leading-tight hover:text-[#8FA9FF] cursor-pointer">
                    Fast-Track e-Medical Visa Processing Guidelines 2026
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 bg-red-700 text-white text-[9px] font-black rounded">
                    New!
                  </span>
                </div>

                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[10px] text-[#2D3A5E] font-black block">14/08/2026</span>
                  <p className="text-[#2D3A5E] font-black leading-tight hover:text-[#8FA9FF] cursor-pointer">
                    Updated Package Pricing for Cardiac & Robotic Procedures
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 bg-red-700 text-white text-[9px] font-black rounded">
                    New!
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#2D3A5E] font-black block">10/08/2026</span>
                  <p className="text-[#2D3A5E] font-black leading-tight hover:text-[#8FA9FF] cursor-pointer">
                    24/7 ICU Ambulance Response Hotline Active
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('tourism')}
              className="mt-3 text-xs font-black text-[#2D3A5E] hover:underline flex items-center gap-1"
            >
              <span>View All Medical Concierge Notices</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 2. Prominent Search Banner */}
      <section className="bg-[#2D3A5E] text-white py-8 shadow-inner border-y-2 border-[#1A233D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-6 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight font-sans">
                Accelerating Surgical Care & Healthcare Concierge
              </h2>
              <p className="text-white text-xs sm:text-sm font-extrabold">
                Search accredited hospital networks, board-certified surgeons, and surgical tariffs.
              </p>
            </div>

            {/* Search Input */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg p-1.5 shadow-2xl flex items-center border-4 border-[#8FA9FF]">
                <input
                  type="text"
                  placeholder="Search MEDI'YATRA Portal (e.g. Max Hospital, Cardiology, CABG)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[#2D3A5E] font-black placeholder-[#2D3A5E] text-xs sm:text-sm px-3 py-2.5 focus:outline-none"
                />
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded shadow flex items-center justify-center gap-2 shrink-0 transition"
                >
                  <Search className="w-4 h-4 text-[#8FA9FF]" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Portal Grid Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h3 className="text-xl font-black text-[#2D3A5E] uppercase tracking-tight font-sans">
            Official MEDI'YATRA Concierge Services
          </h3>
          <p className="text-xs text-[#2D3A5E] font-black">
            Select a service portal below for immediate assistance, specialist bookings, or surgical tariffs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={() => setActiveTab('doctors')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <UserCheck className="w-7 h-7 text-[#2D3A5E]" />
                </div>
                <span className="px-2.5 py-1 bg-red-700 text-white text-[10px] font-black rounded">
                  New!
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-[#2D3A5E] group-hover:text-[#8FA9FF] transition font-sans">
                  DOCTOR DIRECTORY
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  Search board-certified surgeons, OPD consultation schedules, and video consultation fees.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-[#2D3A5E]">
              <span>Access Doctor Registry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveTab('hospitals')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <Building2 className="w-7 h-7 text-[#2D3A5E]" />
                </div>
                <span className="px-2.5 py-1 bg-[#FBE7F1] text-[#2D3A5E] text-[10px] font-black rounded border border-[#D7C6FF]">
                  Accredited Network
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-[#2D3A5E] group-hover:text-[#8FA9FF] transition font-sans">
                  HOSPITAL PORTAL
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  View accredited tertiary hospitals, ICU bed counts, and VIP patient suites.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-[#2D3A5E]">
              <span>Explore Hospitals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setActiveTab('treatments')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <Calculator className="w-7 h-7 text-[#2D3A5E]" />
                </div>
                <span className="px-2.5 py-1 bg-[#FBE7F1] text-[#2D3A5E] text-[10px] font-black rounded border border-[#D7C6FF]">
                  80% Savings
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-[#2D3A5E] group-hover:text-[#8FA9FF] transition font-sans">
                  PROCEDURE PRICING
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  Compare surgical package tariffs in India against US/UK hospital averages with full transparency.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-[#2D3A5E]">
              <span>View Surgical Tariffs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => setActiveTab('tourism')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <FileText className="w-7 h-7 text-[#2D3A5E]" />
                </div>
                <span className="px-2.5 py-1 bg-[#FBE7F1] text-[#2D3A5E] text-[10px] font-black rounded border border-[#D7C6FF]">
                  24h Visa Desk
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-[#2D3A5E] group-hover:text-[#8FA9FF] transition font-sans">
                  MEDICAL VISA DESK
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  Request official Visa Invitation Letters (VIL) issued by host hospitals for Indian Embassies.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-[#2D3A5E]">
              <span>Apply for Visa Letter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5 */}
          <div 
            onClick={onOpenAITriage}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <Stethoscope className="w-7 h-7 text-[#2D3A5E]" />
                </div>
                <span className="px-2.5 py-1 bg-[#FBE7F1] text-[#2D3A5E] text-[10px] font-black rounded border border-[#D7C6FF]">
                  AI Triage
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-[#2D3A5E] group-hover:text-[#8FA9FF] transition font-sans">
                  CLINICAL TRIAGE
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  Input medical symptoms to receive instant department specialty recommendations and doctor lists.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-[#2D3A5E]">
              <span>Launch Symptom Triage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6 */}
          <div 
            onClick={onOpenEmergency}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group border-red-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full bg-red-100 border-2 border-red-600 flex items-center justify-center">
                  <PhoneCall className="w-7 h-7 text-red-700 animate-pulse" />
                </div>
                <span className="px-2.5 py-1 bg-red-700 text-white text-[10px] font-black rounded">
                  24/7 ICU SOS
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-red-700 group-hover:text-red-900 transition font-sans">
                  EMERGENCY SOS DISPATCH
                </h4>
                <p className="text-xs text-[#2D3A5E] mt-1 font-extrabold leading-relaxed">
                  One-touch ICU ambulance dispatch and direct 24/7 helpline for emergency medical trauma.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D7C6FF] flex items-center justify-between text-xs font-black text-red-700">
              <span>Dispatch ICU Ambulance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
