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
  Languages
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currency, 
  setCurrency, 
  onOpenBooking, 
  onOpenEmergency,
  onOpenAITriage,
  onOpenAuth,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayLang, setDisplayLang] = useState('EN');

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
    { id: 'home', label: 'Home', icon: Home },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: UserCheck },
    { id: 'treatments', label: 'Surgical Pricing', icon: Calculator },
    { id: 'tourism', label: 'Tourism Concierge', icon: Globe2 },
    { id: 'charity', label: 'Charity & Aid', icon: HeartHandshake },
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
    <header className="bg-white sticky top-0 z-50 shadow-md w-full border-b border-slate-200">
      
      {/* 1. Top Utility Bar */}
      <div className="bg-[#2D3A5E] text-white px-3 sm:px-4 py-2 text-xs font-bold border-b border-[#1A233D]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 text-[#8FA9FF] font-black text-[11px] sm:text-xs">
              <ShieldCheck className="w-4 h-4 text-[#8FA9FF] shrink-0" /> 
              <span className="truncate">MediYatra Global Health Network</span>
            </span>
            <span className="hidden md:inline text-slate-300 font-bold">|</span>
            <span className="hidden md:inline text-white font-extrabold text-xs">
              International Desk: +91 11 4000 8888
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Display Language Dropdown (UI Component) */}
            <div className="flex items-center bg-[#1A233D] rounded px-2 py-0.5 border border-[#8FA9FF]">
              <Languages className="w-3.5 h-3.5 text-[#8FA9FF] mr-1 shrink-0" />
              <select
                value={displayLang}
                onChange={(e) => setDisplayLang(e.target.value)}
                aria-label="Display Language"
                className="bg-transparent text-white text-[10px] sm:text-[11px] font-black focus:outline-none cursor-pointer border-none py-0.5 pr-1"
              >
                <option value="EN" className="bg-[#1A233D] text-white font-bold">English (EN)</option>
                <option value="HI" className="bg-[#1A233D] text-white font-bold">Hindi (हिन्दी)</option>
                <option value="ES" className="bg-[#1A233D] text-white font-bold">Spanish (Español)</option>
                <option value="FR" className="bg-[#1A233D] text-white font-bold">French (Français)</option>
                <option value="AR" className="bg-[#1A233D] text-white font-bold">Arabic (العربية)</option>
                <option value="RU" className="bg-[#1A233D] text-white font-bold">Russian (Русский)</option>
                <option value="ZH" className="bg-[#1A233D] text-white font-bold">Chinese (中文)</option>
                <option value="DE" className="bg-[#1A233D] text-white font-bold">German (Deutsch)</option>
              </select>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center bg-[#1A233D] rounded px-2 py-0.5 border border-[#8FA9FF]">
              <span className="text-[10px] sm:text-[11px] text-[#8FA9FF] mr-1 font-black">Currency:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black rounded transition ${
                  currency === 'USD' 
                    ? 'bg-[#8FA9FF] text-[#2D3A5E] shadow' 
                    : 'text-white hover:text-blue-300'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black rounded ml-1 transition ${
                  currency === 'INR' 
                    ? 'bg-[#8FA9FF] text-[#2D3A5E] shadow' 
                    : 'text-white hover:text-blue-300'
                }`}
              >
                INR
              </button>
            </div>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-[#1A233D] px-2 py-0.5 rounded border border-[#8FA9FF]">
                <User className="w-3 h-3 text-[#8FA9FF] shrink-0" />
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
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A233D] hover:bg-black text-[#8FA9FF] text-[10px] sm:text-[11px] font-black rounded border border-[#8FA9FF] transition"
              >
                <User className="w-3 h-3" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white text-[10px] sm:text-[11px] font-black rounded shadow transition"
            >
              <PhoneCall className="w-3 h-3 animate-pulse text-white shrink-0" />
              <span className="text-white font-black">SOS</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Header Logo & Search Area */}
      <div className="bg-white py-2.5 px-3 sm:px-4 border-b border-slate-100">
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
              <span className="text-lg sm:text-2xl font-black text-[#2D3A5E] tracking-tight block leading-none font-sans">
                MEDIYATRA
              </span>
              <span className="text-[9px] sm:text-[11px] font-extrabold text-[#2D3A5E] tracking-tight block mt-0.5 hidden xs:block">
                Connecting Health, Facilitating Care
              </span>
            </div>
          </div>

          {/* Desktop Search Bar with Explicit Search CTA Button & Enter Key Trigger */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search hospital, doctor, or surgical procedure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleExecuteSearch(); }}
                className="w-full bg-slate-100 text-[#2D3A5E] placeholder-slate-500 text-xs font-bold rounded-xl pl-9 pr-24 py-2.5 border-2 border-slate-300 focus:bg-white focus:border-[#8FA9FF] focus:outline-none shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-3" />

              <button
                type="button"
                onClick={handleExecuteSearch}
                className="absolute right-1.5 px-3.5 py-1.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1 transition cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Header Action CTA Button & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {isDoctor ? (
              <button
                onClick={() => handleNavClick('doctor-portal')}
                className="px-3 sm:px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs rounded-lg shadow flex items-center gap-1.5 transition"
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap">Doctor Desk</span>
              </button>
            ) : isHospital ? (
              <button
                onClick={() => handleNavClick('hospital-portal')}
                className="px-3 sm:px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs rounded-lg shadow flex items-center gap-1.5 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap">Hospital Desk</span>
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3 sm:px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs rounded-lg shadow flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap">Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenBooking()}
                className="px-3 sm:px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs rounded-lg shadow flex items-center gap-1.5 transition"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap hidden sm:inline">Book Appointment</span>
                <span className="text-white font-black whitespace-nowrap sm:hidden">Book OPD</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2D3A5E] hover:bg-slate-100 rounded-lg md:hidden border border-slate-300 shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#2D3A5E]" /> : <Menu className="w-5 h-5 text-[#2D3A5E]" />}
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
              className="w-full bg-slate-100 text-[#2D3A5E] placeholder-slate-500 text-xs font-bold rounded-lg pl-9 pr-20 py-2 border border-slate-300 focus:bg-white focus:border-[#8FA9FF] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            <button
              type="button"
              onClick={handleExecuteSearch}
              className="absolute right-1 px-2.5 py-1 bg-[#2D3A5E] text-white text-[11px] font-black rounded"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Ribbon (Desktop) */}
      <div className="bg-[#2D3A5E] text-white hidden md:block">
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
                    className={`flex items-center gap-1.5 px-3 h-full text-xs font-black transition border-b-4 bg-transparent shadow-none shrink-0 ${
                      isActive
                        ? 'text-[#8FA9FF] border-[#8FA9FF]'
                        : 'text-white hover:text-[#8FA9FF] border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#8FA9FF]' : 'text-white'}`} />
                    <span className={`whitespace-nowrap font-black text-xs ${isActive ? 'text-[#8FA9FF]' : 'text-white'}`}>
                      {link.label}
                    </span>
                  </button>
                );
              })}

              {!isNonPatient && (
                <button
                  onClick={onOpenAITriage}
                  className="flex items-center gap-1.5 px-3 h-full text-xs font-black text-white hover:text-[#8FA9FF] border-b-4 border-transparent bg-transparent shadow-none shrink-0 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#8FA9FF] shrink-0" />
                  <span className="text-white hover:text-[#8FA9FF] font-black text-xs whitespace-nowrap">
                    AI Triage Desk
                  </span>
                </button>
              )}
            </nav>

            <div className="text-[11px] text-[#8FA9FF] font-black hidden xl:block whitespace-nowrap pl-4 shrink-0">
              {isDoctor ? 'Doctor Clinical Operations Active' : isHospital ? 'Hospital Administrative Operations Active' : isAdmin ? 'System Admin Operations Active' : '24/7 International Desk'}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2D3A5E] text-white px-4 pt-3 pb-4 space-y-2 border-t-2 border-[#8FA9FF] shadow-2xl">
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
                className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-black transition ${
                  isActive ? 'bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF]' : 'text-white hover:bg-[#1A233D]/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#8FA9FF]" />
                <span className={isActive ? 'text-[#8FA9FF]' : 'text-white'}>
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
              className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-black text-white hover:bg-[#1A233D]/50 border border-slate-700 mt-2"
            >
              <Stethoscope className="w-4 h-4 text-[#8FA9FF]" />
              <span>AI Symptom Triage Desk</span>
            </button>
          )}
        </div>
      )}

    </header>
  );
}
