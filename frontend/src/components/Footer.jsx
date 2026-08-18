import React from 'react';
import { PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenEmergency, onOpenAITriage }) {
  return (
    <footer className="bg-[#2D3A5E] text-white border-t-4 border-[#8FA9FF] pt-12 pb-8 mt-12 w-full">
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
              <div className="border-l-2 border-[#8FA9FF] pl-2">
                <span className="text-xl font-black text-white tracking-tight block leading-none font-sans">
                  MEDIYATRA
                </span>
                <span className="text-[10px] font-bold text-[#8FA9FF] block mt-0.5">
                  Connecting Health, Facilitating Care
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              Global Medical Tourism Concierge connecting international & domestic patients with accredited hospital networks and senior surgeons across India.
            </p>
          </div>

          {/* Column 2: Concierge Portals */}
          <div>
            <h4 className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider mb-3 border-b border-[#8FA9FF]/30 pb-1 font-sans">
              Concierge Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-100">
              <li>
                <button 
                  onClick={() => setActiveTab('hospitals')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Accredited Hospital Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('doctors')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Board-Certified Specialist Registry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('treatments')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Surgical Tariff & Price Comparison
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAITriage} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Clinical Symptom Triage Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: International Patient Desk */}
          <div>
            <h4 className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider mb-3 border-b border-[#8FA9FF]/30 pb-1 font-sans">
              International Services
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-100">
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Medical Visa Recommendation Letters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Certified Language Interpreters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Serviced Accommodations & Suites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tourism')} 
                  className="hover:text-[#8FA9FF] transition text-left"
                >
                  Airport Pickup & Van Transfers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency SOS & Contact */}
          <div>
            <h4 className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider mb-3 border-b border-[#8FA9FF]/30 pb-1 font-sans">
              24/7 International Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-100 font-bold">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#8FA9FF] shrink-0" />
                <span>+91 11 4000 8888</span>
              </p>
              <p className="flex items-center gap-2 break-all">
                <Mail className="w-4 h-4 text-[#8FA9FF] shrink-0" />
                <span>concierge@mediyatra-health.org</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8FA9FF] shrink-0" />
                <span>Press Enclave Marg, Saket, New Delhi</span>
              </p>
            </div>

            <button
              onClick={onOpenEmergency}
              className="mt-4 w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-black rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>EMERGENCY 24/7 ICU SOS</span>
            </button>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 border-t border-[#1A233D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-bold">
          <p>© {new Date().getFullYear()} MEDIYATRA Healthcare Concierge. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Global Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
