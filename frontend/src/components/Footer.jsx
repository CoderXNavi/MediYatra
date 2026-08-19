import React from 'react';
import { PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenEmergency, onOpenAITriage }) {
  return (
    <footer className="bg-[#2B4A66] text-white border-t-4 border-[#7FD6FF] pt-12 pb-8 mt-12 w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_clean.png" 
                alt="MEDIYATRA Logo" 
                className="h-10 w-auto object-contain shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="border-l-2 border-[#7FD6FF] pl-2">
                <span className="text-xl font-bold text-white tracking-tight block leading-none font-sans">
                  MEDIYATRA
                </span>
                <span className="text-[10px] font-bold text-[#7FD6FF] block mt-0.5">
                  Connecting Health, Facilitating Care
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              Global Medical Tourism Concierge connecting international & domestic patients with accredited hospital networks and senior surgeons across India.
            </p>
          </div>

          {/* Column 2: Concierge Portals */}
          <div>
            <h4 className="text-xs font-bold text-[#7FD6FF] uppercase tracking-wider mb-3 border-b border-[#7FD6FF]/30 pb-1 font-sans">
              Concierge Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-100">
              <li>
                <button 
                  onClick={() => setActiveTab('hospitals')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Accredited Hospital Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('doctors')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Board-Certified Specialist Registry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('treatments')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Surgical Tariff & Price Comparison
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAITriage} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Clinical Symptom Triage Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: International Patient Desk */}
          <div>
            <h4 className="text-xs font-bold text-[#7FD6FF] uppercase tracking-wider mb-3 border-b border-[#7FD6FF]/30 pb-1 font-sans">
              International Services
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-100">
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Medical Visa Recommendation Letters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Certified Language Interpreters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  Airport Transfers & Recovery Suites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('charity')} 
                  className="hover:text-[#7FD6FF] transition text-left cursor-pointer"
                >
                  NGO Medical Aid & Grants
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: 24/7 International Desk & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#7FD6FF] uppercase tracking-wider border-b border-[#7FD6FF]/30 pb-1 font-sans">
              Emergency & Concierge Desk
            </h4>

            <div className="space-y-2 text-xs text-slate-100 font-medium">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Hotline: +91-11-26925858</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7FD6FF] shrink-0" />
                <span>concierge@mediyatra.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFD6E8] shrink-0" />
                <span>Sarita Vihar, Mathura Road, New Delhi 110076</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenEmergency}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span>24/7 ICU Ambulance SOS</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300 font-medium gap-2">
          <p>© 2026 MEDIYATRA International Healthcare Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Concierge</span>
            <span className="hover:text-white cursor-pointer">NABH Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
