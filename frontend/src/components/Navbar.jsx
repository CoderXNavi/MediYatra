import React, { useState } from 'react';
import { 
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
  LogOut
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

  const baseNavLinks = [
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: UserCheck },
    { id: 'treatments', label: 'Surgical Pricing', icon: Calculator },
    { id: 'tourism', label: 'Tourism Concierge', icon: Globe2 },
  ];

  // Role-specific navigation portals
  if (currentUser?.role === 'Doctor') {
    baseNavLinks.push({ id: 'doctor-portal', label: 'Doctor Desk', icon: Stethoscope });
  } else if (currentUser?.role === 'Hospital') {
    baseNavLinks.push({ id: 'hospital-portal', label: 'Hospital Desk', icon: Building2 });
  } else if (currentUser?.role === 'Admin') {
    baseNavLinks.push({ id: 'admin', label: 'Admin Control Panel', icon: Lock });
  } else {
    // Patient or Guest view
    baseNavLinks.push({ id: 'records', label: 'My Health Portal', icon: FileText });
  }

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md w-full border-b border-slate-200">
      
      {/* 1. Top Utility Bar */}
      <div className="bg-[#2D3A5E] text-white px-4 py-2 text-xs font-bold border-b border-[#1A233D]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#8FA9FF] font-black">
              <ShieldCheck className="w-4 h-4 text-[#8FA9FF]" /> Global Healthcare & Medical Tourism Network
            </span>
            <span className="hidden md:inline text-[#D7C6FF] font-bold">|</span>
            <span className="hidden md:inline text-white font-extrabold">
              International Concierge Desk: +91 11 4000 8888
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Switcher */}
            <div className="flex items-center bg-[#1A233D] rounded px-2 py-1 border border-[#8FA9FF]">
              <span className="text-[11px] text-[#D7C6FF] mr-1.5 font-black">Currency:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 text-[11px] font-black rounded transition ${
                  currency === 'USD' 
                    ? 'bg-[#8FA9FF] text-[#2D3A5E] shadow' 
                    : 'text-white hover:text-pal-blush'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 text-[11px] font-black rounded ml-1 transition ${
                  currency === 'INR' 
                    ? 'bg-[#8FA9FF] text-[#2D3A5E] shadow' 
                    : 'text-white hover:text-pal-blush'
                }`}
              >
                INR (₹)
              </button>
            </div>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#1A233D] px-2.5 py-1 rounded border border-[#8FA9FF]">
                <User className="w-3.5 h-3.5 text-[#8FA9FF]" />
                <span className="text-white text-[11px] font-black">{currentUser.name} ({currentUser.role})</span>
                <button onClick={onLogout} title="Log Out" className="text-slate-300 hover:text-red-400 ml-1 font-black">
                  <LogOut className="w-3.5 h-3.5 inline" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A233D] hover:bg-black text-[#8FA9FF] text-[11px] font-black rounded border border-[#8FA9FF] transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-[11px] font-black rounded shadow transition"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-white" />
              <span className="text-white font-black">EMERGENCY SOS</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Header Logo & Search Area */}
      <div className="bg-white py-3 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Emblem & Brand Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'hospitals')}
          >
            <img 
              src="/logo_clean.png" 
              alt="MEDI'YATRA Logo Emblem" 
              className="h-10 sm:h-11 w-auto object-contain shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            <div className="border-l-2 border-slate-300 pl-3">
              <span className="text-xl sm:text-2xl font-black text-[#2D3A5E] tracking-tight block leading-none font-sans">
                MEDI'YATRA
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#2D3A5E] tracking-tight block mt-0.5">
                Connecting Health, Facilitating Care
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hospital, doctor, or surgical procedure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-[#2D3A5E] placeholder-slate-500 text-xs font-bold rounded-md pl-9 pr-4 py-2.5 border-2 border-slate-300 focus:bg-white focus:border-[#8FA9FF] focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Header Action Button - Show 'Admin Panel' for Admin, 'Book Appointment' for Patients */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center gap-2 transition"
              >
                <Lock className="w-4 h-4 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap">Admin Control Panel</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenBooking()}
                className="px-4 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center gap-2 transition"
              >
                <CalendarCheck className="w-4 h-4 text-[#8FA9FF] shrink-0" />
                <span className="text-white font-black whitespace-nowrap">Book Appointment</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. Primary Navigation Ribbon */}
      <div className="bg-[#2D3A5E] text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-12 overflow-x-auto no-scrollbar">
            
            <nav className="flex items-center gap-1 h-full shrink-0">
              {baseNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 h-full text-xs font-black transition border-b-4 bg-transparent shadow-none shrink-0 ${
                      isActive
                        ? 'text-[#8FA9FF] border-[#8FA9FF]'
                        : 'text-white hover:text-[#D7C6FF] border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#8FA9FF]' : 'text-white'}`} />
                    <span className={`whitespace-nowrap font-black text-xs ${isActive ? 'text-[#8FA9FF]' : 'text-white'}`}>
                      {link.label}
                    </span>
                  </button>
                );
              })}

              {!isAdmin && (
                <button
                  onClick={onOpenAITriage}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3.5 h-full text-xs font-black text-[#D7C6FF] hover:text-white border-b-4 border-transparent bg-transparent shadow-none shrink-0 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#D7C6FF] shrink-0" />
                  <span className="text-[#D7C6FF] hover:text-white font-black text-xs whitespace-nowrap">
                    AI Triage Desk
                  </span>
                </button>
              )}
            </nav>

            <div className="text-[11px] text-[#8FA9FF] font-black hidden xl:block whitespace-nowrap pl-4 shrink-0">
              {isAdmin ? 'System Admin Operations Active' : '24/7 International Desk'}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center ml-2 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-[#1A233D] rounded"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2D3A5E] text-white px-4 pt-3 pb-4 space-y-2 border-t-2 border-[#8FA9FF]">
          {baseNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded text-xs font-black transition ${
                activeTab === link.id ? 'bg-[#1A233D] text-[#8FA9FF]' : 'text-white hover:bg-[#1A233D]/50'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className={activeTab === link.id ? 'text-[#8FA9FF]' : 'text-white'}>
                {link.label}
              </span>
            </button>
          ))}
        </div>
      )}

    </header>
  );
}
