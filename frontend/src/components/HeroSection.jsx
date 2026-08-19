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
  ArrowRight,
  HeartHandshake,
  CalendarCheck,
  Sparkles,
  MapPin
} from 'lucide-react';

import { getTranslation } from '../utils/translations';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  setActiveTab,
  displayLang = 'EN',
  onOpenAITriage,
  onOpenBooking,
  onOpenEmergency
}) {
  const handleExecuteSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      setActiveTab('hospitals');
    }
  };

  return (
    <div className="space-y-10 pb-12 pt-2 font-sans bg-[#FFF6FB]">

      {/* 1. Full Image Background Hero Section with Soft Left Gradient Overlay */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#FFD6E8] bg-white min-h-[360px] sm:min-h-[420px] flex items-center">

          {/* Full Width Background Image */}
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600"
            alt="Healthcare Done Your Way"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />

          {/* Smooth Left-to-Right Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent" />

          {/* Left Side Hero Content */}
          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-5">

            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full border border-pink-200">
              <ShieldCheck className="w-4 h-4 text-[#2B4A66]" />
              <span>JCI & NABH Accredited Healthcare</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2B4A66] leading-tight font-sans">
              {getTranslation(displayLang, 'heroTitle')}
            </h1>

            <p className="text-xs sm:text-base text-slate-700 font-bold leading-relaxed">
              {getTranslation(displayLang, 'heroSubtitle')}
            </p>

            {/* Embedded Search Box */}
            <form onSubmit={handleExecuteSearch} className="pt-1">
              <div className="bg-white rounded-2xl p-1.5 shadow-md flex items-center gap-2 border-2 border-[#7FD6FF]">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    placeholder={getTranslation(displayLang, 'searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExecuteSearch(e);
                    }}
                    className="w-full text-[#2B4A66] placeholder-slate-400 font-bold text-xs sm:text-sm pl-10 pr-6 py-2.5 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  {getTranslation(displayLang, 'searchBtn')}
                </button>
              </div>
            </form>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs sm:text-sm rounded-full shadow transition flex items-center gap-2 cursor-pointer"
              >
                <span>{getTranslation(displayLang, 'startVisit')}</span>
                <ArrowRight className="w-4 h-4 text-[#7FD6FF]" />
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-[#2B4A66] border border-[#FFD6E8] font-bold text-xs sm:text-sm rounded-full transition cursor-pointer shadow-xs"
              >
                Explore Hospitals ➔
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 2. "We can help you with" Photo Feature Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B4A66] font-sans">
            We can help you with
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Item 1: Hospital Centers */}
          <div
            onClick={() => setActiveTab('hospitals')}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FFD6E8] shadow-xs hover:shadow-md transition"
          >
            <div className="h-36 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                alt="Accredited Hospitals"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 text-center">
              <h3 className="text-sm font-bold text-[#2B4A66] font-sans group-hover:text-blue-700">
                Accredited Hospitals
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">26 Quaternary Care Centers</p>
            </div>
          </div>

          {/* Item 2: Doctor Directory (Senior Surgeons) */}
          <div
            onClick={() => setActiveTab('doctors')}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FFD6E8] shadow-xs hover:shadow-md transition"
          >
            <div className="h-36 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Senior Surgeons"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 text-center">
              <h3 className="text-sm font-bold text-[#2B4A66] font-sans group-hover:text-blue-700">
                Senior Surgeons
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">50+ Board Certified Chairs</p>
            </div>
          </div>

          {/* Item 3: Medical Visa */}
          <div
            onClick={() => setActiveTab('tourism')}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FFD6E8] shadow-xs hover:shadow-md transition"
          >
            <div className="h-36 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                alt="Medical Tourism Visa"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 text-center">
              <h3 className="text-sm font-bold text-[#2B4A66] font-sans group-hover:text-blue-700">
                Medical Visa (VIL)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Fast-Track Embassy Letters</p>
            </div>
          </div>

          {/* Item 4: NGO Aid */}
          <div
            onClick={() => setActiveTab('charity')}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#FFD6E8] shadow-xs hover:shadow-md transition"
          >
            <div className="h-36 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800"
                alt="Free Medical Aid"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 text-center">
              <h3 className="text-sm font-bold text-[#2B4A66] font-sans group-hover:text-blue-700">
                Free NGO Aid
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Donated Wheelchairs & Aid</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Official Healthcare Concierge Portals (6-Card Clean Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2B4A66] tracking-tight font-sans">
            Official Healthcare Concierge Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Select a service desk below for immediate medical assistance, visa letters, or surgical tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* Card 1: Doctor Directory */}
          <div
            onClick={() => setActiveTab('doctors')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <UserCheck className="w-6 h-6 text-[#2B4A66]" />
                </div>
                <span className="px-2.5 py-1 bg-[#FFD6E8] text-[#2B4A66] text-xs font-bold rounded-full border border-pink-200">
                  50+ Verified Faculty
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B4A66] group-hover:text-[#7FD6FF] transition font-sans">
                  Doctor Directory
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Consult verified department chairs, Padma Awardees, and senior surgical faculty.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B4A66] group-hover:text-blue-600">
              <span>View Doctors Registry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Hospital Explorer */}
          <div
            onClick={() => setActiveTab('hospitals')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle bg-blue-50 border-[#7FD6FF]">
                  <Building2 className="w-6 h-6 text-[#2B4A66]" />
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-[#2B4A66] text-xs font-bold rounded-full border border-[#7FD6FF]">
                  26 Tertiary Centers
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B4A66] group-hover:text-[#7FD6FF] transition font-sans">
                  Hospital Explorer
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Browse JCI/NABH accredited hospitals across 16 Indian cities with ICU bed counts and maps.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B4A66] group-hover:text-blue-600">
              <span>Explore Hospitals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Procedure Tariffs */}
          <div
            onClick={() => setActiveTab('treatments')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle bg-emerald-50 border-[#6FE3B4]">
                  <Calculator className="w-6 h-6 text-[#2B4A66]" />
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-950 text-xs font-bold rounded-full border border-[#6FE3B4]">
                  Save Up To 85%
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B4A66] group-hover:text-[#7FD6FF] transition font-sans">
                  Surgical Tariffs
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Compare all-inclusive surgical package rates in India against US/UK hospital tariffs with zero hidden fees.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B4A66] group-hover:text-blue-600">
              <span>Compare Procedure Rates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Medical Visa Desk */}
          <div
            onClick={() => setActiveTab('tourism')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle">
                  <FileText className="w-6 h-6 text-[#2B4A66]" />
                </div>
                <span className="px-2.5 py-1 bg-sky-50 text-sky-950 text-xs font-bold rounded-full border border-sky-300">
                  Fast-Track VIL Desk
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B4A66] group-hover:text-[#7FD6FF] transition font-sans">
                  Medical Visa & Tourism
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Request official e-Medical Visa Invitation Letters (VIL), certified language interpreters, and airport pickups.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B4A66] group-hover:text-blue-600">
              <span>Apply for Visa Letter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5: NGO Charity Aid */}
          <div
            onClick={() => setActiveTab('charity')}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="icon-circle bg-amber-50 border-amber-300">
                  <HeartHandshake className="w-6 h-6 text-[#2B4A66]" />
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-950 text-xs font-bold rounded-full border border-amber-300">
                  Free Medical Aid
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B4A66] group-hover:text-[#7FD6FF] transition font-sans">
                  NGO Charity Aid Desk
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Request donated wheelchairs, oxygen cylinders, subsidized medicines, and humanitarian financial grants.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B4A66] group-hover:text-blue-600">
              <span>Request Medical Aid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6: Emergency SOS */}
          <div
            onClick={onOpenEmergency}
            className="portal-card p-6 flex flex-col justify-between cursor-pointer group border-2 border-red-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-red-100 border border-red-500 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-red-600 animate-pulse" />
                </div>
                <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  24/7 Hotline
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-700 group-hover:text-red-900 transition font-sans">
                  ICU Ambulance SOS
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Instant one-touch ICU ambulance dispatch and emergency trauma assistance across India.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-red-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Dispatch ICU Ambulance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. Patient Bulletins Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-[#FFD6E8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B4A66] text-[#7FD6FF] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#2B4A66] uppercase tracking-wider block">Official Patient Bulletin</span>
              <h4 className="text-sm font-bold text-slate-900 font-sans">Fast-Track e-Medical Visa Guidelines 2026 Updated</h4>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tourism')}
            className="px-4 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <span>Read Patient Notices</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
