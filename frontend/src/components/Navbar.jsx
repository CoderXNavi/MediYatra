import React, { useState } from 'react';
import {
  Home,
  Building2,
  UserCheck,
  Calculator,
  Globe2,
  Stethoscope,
  PhoneCall,
  Menu,
  X,
  ShieldCheck,
  Search,
  CalendarCheck,
  FileText,
  Lock,
  User,
  LogOut,
  HeartHandshake,
  Languages,
  CreditCard
} from 'lucide-react';

import { getTranslation } from '../utils/translations';

export default function Navbar({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  displayLang = 'EN',
  setDisplayLang = () => { },
  onOpenBooking,
  onOpenEmergency,
  onOpenAITriage,
  onOpenInsurance = () => { },
  onOpenAuth,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNavClick(tabId) {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleExecuteSearch() {
    if (activeTab !== 'hospitals' && activeTab !== 'doctors') {
      setActiveTab('hospitals');
    }
  }

  const baseNavLinks = [
    { id: 'home', label: getTranslation(displayLang, 'home'), icon: Home },
    { id: 'hospitals', label: getTranslation(displayLang, 'hospitals'), icon: Building2 },
    { id: 'doctors', label: getTranslation(displayLang, 'doctors'), icon: UserCheck },
    { id: 'treatments', label: getTranslation(displayLang, 'surgicalPricing'), icon: Calculator },
    { id: 'tourism', label: getTranslation(displayLang, 'tourismConcierge'), icon: Globe2 },
    { id: 'charity', label: getTranslation(displayLang, 'charityAid'), icon: HeartHandshake },
  ];

  // Role-specific navigation portals
  if (currentUser?.role === 'Doctor') {
    baseNavLinks.push({ id: 'doctor-portal', label: 'Doctor Desk', icon: Stethoscope });
  } else if (currentUser?.role === 'Hospital') {
    baseNavLinks.push({ id: 'hospital-portal', label: 'Hospital Desk', icon: Building2 });
  } else if (currentUser?.role === 'Admin') {
    baseNavLinks.push({ id: 'admin', label: 'Admin Control Panel', icon: Lock });
  } else {
    baseNavLinks.push({ id: 'records', label: 'My Health Portal', icon: FileText });
  }

  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isAdmin = currentUser?.role === 'Admin';
  const isNonPatient = isDoctor || isHospital || isAdmin;

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm w-full border-b border-slate-200">

      {/* 1. Top Utility Bar (#2B4A66 Deep Slate Navy) */}
      <div className="bg-[#2B4A66] text-white px-3 sm:px-4 py-2 text-xs font-bold border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 text-[#7FD6FF] font-extrabold text-[11px] sm:text-xs">
              <ShieldCheck className="w-4 h-4 text-[#7FD6FF] shrink-0" />
              <span className="truncate">MediYatra Healthcare Concierge</span>
            </span>
            <span className="hidden md:inline text-slate-300 font-bold">|</span>
            <span className="hidden md:inline text-white font-extrabold text-xs">
              International Desk: +91 11 4000 8888
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            {/* Cashless Insurance Button */}
            <button
              onClick={onOpenInsurance}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#7FD6FF] hover:text-white font-extrabold cursor-pointer border border-[#7FD6FF] px-2 py-0.5 rounded bg-[#1E364B] transition"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#7FD6FF] shrink-0" />
              <span>Cashless Insurance</span>
            </button>

            {/* Display Language Dropdown */}
            <div className="flex items-center bg-[#1E364B] rounded px-2 py-0.5 border border-[#7FD6FF]">
              <Languages className="w-3.5 h-3.5 text-[#7FD6FF] mr-1 shrink-0" />
              <select
                value={displayLang}
                onChange={(e) => setDisplayLang(e.target.value)}
                aria-label="Display Language"
                className="bg-transparent text-white text-[10px] sm:text-[11px] font-black focus:outline-none cursor-pointer border-none py-0.5 pr-1"
              >
                <option value="EN" className="bg-[#1E364B] text-white font-bold">English (EN)</option>
                <option value="HI" className="bg-[#1E364B] text-white font-bold">Hindi (हिन्दी)</option>
                <option value="ES" className="bg-[#1E364B] text-white font-bold">Spanish (Español)</option>
                <option value="FR" className="bg-[#1E364B] text-white font-bold">French (Français)</option>
                <option value="AR" className="bg-[#1E364B] text-white font-bold">Arabic (العربية)</option>
                <option value="RU" className="bg-[#1E364B] text-white font-bold">Russian (Русский)</option>
              </select>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center bg-[#1E364B] rounded px-2 py-0.5 border border-[#7FD6FF]">
              <span className="text-[10px] sm:text-[11px] text-[#7FD6FF] mr-1 font-black">Currency:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black rounded transition ${currency === 'USD'
                    ? 'bg-[#7FD6FF] text-[#2B4A66] shadow'
                    : 'text-white hover:text-[#7FD6FF]'
                  }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black rounded ml-1 transition ${currency === 'INR'
                    ? 'bg-[#7FD6FF] text-[#2B4A66] shadow'
                    : 'text-white hover:text-[#7FD6FF]'
                  }`}
              >
                INR
              </button>
            </div>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-[#1E364B] px-2 py-0.5 rounded border border-[#7FD6FF]">
                <User className="w-3 h-3 text-[#7FD6FF] shrink-0" />
                <span className="text-white text-[10px] sm:text-[11px] font-black truncate max-w-[120px] sm:max-w-[180px]">
                  {currentUser.name} ({currentUser.role})
                </span>
                <button onClick={onLogout} title="Log Out" className="text-slate-300 hover:text-red-400 ml-1 font-black text-[10px]">
                  <LogOut className="w-3 h-3 inline" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1E364B] hover:bg-[#152737] text-[#7FD6FF] text-[10px] sm:text-[11px] font-black rounded border border-[#7FD6FF] transition"
              >
                <User className="w-3 h-3" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-[11px] font-black rounded shadow transition"
            >
              <PhoneCall className="w-3 h-3 animate-pulse text-white shrink-0" />
              <span className="text-white font-black">SOS</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Header Logo & Search Area */}
      <div className="bg-[#FFF6FB] py-3 px-3 sm:px-4 border-b border-pink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo Emblem & Brand Title */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
            onClick={() => handleNavClick(isAdmin ? 'admin' : isDoctor ? 'doctor-portal' : isHospital ? 'hospital-portal' : 'home')}
          >
            <img
              src="/logo_clean.png"
              alt="MEDIYATRA Logo"
              className="h-8 sm:h-10 w-auto object-contain shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            <div className="border-l-2 border-slate-300 pl-2 sm:pl-3">
              <span className="text-lg sm:text-2xl font-black text-[#2B4A66] tracking-tight block leading-none font-sans">
                MEDIYATRA
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold text-[#2B4A66] tracking-tight block mt-0.5 hidden xs:block">
                Connecting Health, Facilitating Care
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search hospital, doctor, or surgical procedure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleExecuteSearch(); }}
                className="w-full bg-white text-[#2B4A66] placeholder-slate-400 text-xs font-bold rounded-xl pl-9 pr-24 py-2.5 border border-[#FFD6E8] focus:border-[#7FD6FF] focus:outline-none shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />

              <button
                type="button"
                onClick={handleExecuteSearch}
                className="absolute right-1.5 px-3.5 py-1.5 bg-[#2B4A66] hover:bg-[#1E364B] text-white text-xs font-black rounded-lg shadow-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Header Action CTA Button */}
          <div className="flex items-center gap-2 shrink-0">
            {isDoctor ? (
              <button
                onClick={() => handleNavClick('doctor-portal')}
                className="px-3 sm:px-4 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#7FD6FF] shrink-0" />
                <span className="text-white font-bold whitespace-nowrap">Doctor Desk</span>
              </button>
            ) : isHospital ? (
              <button
                onClick={() => handleNavClick('hospital-portal')}
                className="px-3 sm:px-4 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-[#7FD6FF] shrink-0" />
                <span className="text-white font-bold whitespace-nowrap">Hospital Desk</span>
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3 sm:px-4 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5 text-[#7FD6FF] shrink-0" />
                <span className="text-white font-bold whitespace-nowrap">Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenBooking()}
                className="px-3 sm:px-4 py-2 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#7FD6FF] shrink-0" />
                <span className="text-white font-bold whitespace-nowrap hidden sm:inline">Book Appointment</span>
                <span className="text-white font-bold whitespace-nowrap sm:hidden">Book OPD</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2B4A66] hover:bg-white rounded-lg md:hidden border border-slate-300 shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#2B4A66]" /> : <Menu className="w-5 h-5 text-[#2B4A66]" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search hospital, doctor, or procedure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleExecuteSearch(); }}
              className="w-full bg-white text-[#2B4A66] placeholder-slate-400 text-xs font-bold rounded-lg pl-9 pr-20 py-2 border border-[#FFD6E8] focus:border-[#7FD6FF] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <button
              type="button"
              onClick={handleExecuteSearch}
              className="absolute right-1 px-2.5 py-1 bg-[#2B4A66] text-white text-[11px] font-black rounded"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Ribbon (Desktop #2B4A66) */}
      <div className="bg-[#2B4A66] text-white hidden md:block border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-11 overflow-x-auto no-scrollbar">

            <nav className="flex items-center gap-1 h-full shrink-0">
              {baseNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-bold transition border-b-4 bg-transparent shadow-none shrink-0 ${isActive
                        ? 'text-[#7FD6FF] border-[#7FD6FF]'
                        : 'text-white hover:text-[#7FD6FF] border-transparent'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#7FD6FF]' : 'text-white'}`} />
                    <span className={`whitespace-nowrap font-bold text-xs ${isActive ? 'text-[#7FD6FF]' : 'text-white'}`}>
                      {link.label}
                    </span>
                  </button>
                );
              })}

              {!isNonPatient && (
                <button
                  onClick={onOpenAITriage}
                  className="flex items-center gap-1.5 px-3.5 h-full text-xs font-bold text-white hover:text-[#7FD6FF] border-b-4 border-transparent bg-transparent shadow-none shrink-0 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#6FE3B4] shrink-0" />
                  <span className="text-white hover:text-[#7FD6FF] font-bold text-xs whitespace-nowrap">
                    Nova AI Desk
                  </span>
                </button>
              )}
            </nav>

            <div className="text-[11px] text-[#7FD6FF] font-bold hidden xl:block whitespace-nowrap pl-4 shrink-0">
              {isDoctor ? 'Doctor Operations Active' : isHospital ? 'Hospital Desk Active' : isAdmin ? 'Admin Operations Active' : '24/7 Concierge Hotline Active'}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2B4A66] text-white px-4 pt-3 pb-4 space-y-2 border-t-2 border-[#7FD6FF] shadow-2xl">
          {baseNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  handleNavClick(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${isActive ? 'bg-[#1E364B] text-[#7FD6FF] border border-[#7FD6FF]' : 'text-white hover:bg-[#1E364B]/50'
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#7FD6FF]" />
                <span className={isActive ? 'text-[#7FD6FF]' : 'text-white'}>
                  {link.label}
                </span>
              </button>
            );
          })}

          {!isNonPatient && (
            <button
              onClick={() => {
                onOpenAITriage();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-white hover:bg-[#1E364B]/50 border border-slate-600 mt-2"
            >
              <Stethoscope className="w-4 h-4 text-[#6FE3B4]" />
              <span>Nova AI Desk</span>
            </button>
          )}
        </div>
      )}

    </header>
  );
}
