import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  Navigation, 
  Plane, 
  Train, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Star,
  Compass,
  Building2
} from 'lucide-react';

export default function HospitalMapModal({ hospital, onClose, onBookHospital, isNonPatient }) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' | 'street'

  if (!hospital) return null;

  const fullAddress = `${hospital.address || ''}, ${hospital.city || ''}, ${hospital.state || ''}, ${hospital.country || 'India'}`;
  
  // Clean query for Google Maps embed and directions
  const mapSearchQuery = encodeURIComponent(`${hospital.name}, ${hospital.address || ''}, ${hospital.city || ''}`);
  
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapSearchQuery}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${mapSearchQuery}`;

  function handleCopyAddress() {
    navigator.clipboard.writeText(`${hospital.name}\n${fullAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-4xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#2D3A5E] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#1A233D]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#8FA9FF]/20 rounded-xl border border-[#8FA9FF]/40 text-[#8FA9FF] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#8FA9FF] uppercase tracking-wider block">
                  Interactive Location Map
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-black rounded border border-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-600" />
                  {hospital.rating || 4.8}
                </span>
              </div>
              <h3 className="font-black text-lg sm:text-xl text-white font-sans leading-snug">
                {hospital.name}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Close map"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left Column: Interactive Map Frame */}
          <div className="lg:w-7/12 flex flex-col min-h-[320px] sm:min-h-[400px] bg-slate-100 relative">
            
            {/* Embedded Live Map */}
            <div className="flex-1 relative w-full h-full min-h-[300px]">
              <iframe
                title={`Map of ${hospital.name}`}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                allowFullScreen
                src={googleMapsEmbedUrl}
              ></iframe>
            </div>

            {/* Map Action Quick Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                <Compass className="w-4 h-4 text-[#2D3A5E]" />
                <span>Live Interactive Map</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#8FA9FF]" />
                  <span>Apple Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Transit Details */}
          <div className="lg:w-5/12 p-5 space-y-5 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Address Card */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#2D3A5E] tracking-wider block">
                    Exact Campus Address
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 text-[11px] font-black text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-900 font-extrabold leading-relaxed">
                  {hospital.address}
                </p>
                <p className="text-xs text-slate-700 font-bold">
                  {hospital.city}, {hospital.state}, {hospital.country || 'India'}
                </p>
              </div>

              {/* Transit & Access Times */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-[#2D3A5E] tracking-wider block">
                  Transit & Landmark Distances
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900">
                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 space-y-1">
                    <Plane className="w-4 h-4 text-[#2D3A5E]" />
                    <span className="text-[10px] text-slate-600 font-black uppercase block">Int'l Airport</span>
                    <span className="font-extrabold text-slate-900">~14 km (25 mins)</span>
                  </div>

                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 space-y-1">
                    <Train className="w-4 h-4 text-[#2D3A5E]" />
                    <span className="text-[10px] text-slate-600 font-black uppercase block">Metro Station</span>
                    <span className="font-extrabold text-slate-900">~500 m (Direct)</span>
                  </div>
                </div>
              </div>

              {/* Emergency & Helpline Contact */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Hospital Concierge & Emergency Desk
                </span>

                <div className="space-y-1 text-xs font-bold text-slate-900">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Helpline: <a href={`tel:${hospital.contactPhone}`} className="text-emerald-950 font-black hover:underline">{hospital.contactPhone || '+91-11-26925858'}</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Email: <a href={`mailto:${hospital.contactEmail}`} className="text-emerald-950 font-black hover:underline">{hospital.contactEmail || 'international@mediyatra.org'}</a></span>
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Button */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-2 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving Directions</span>
              </a>

              {!isNonPatient && onBookHospital && (
                <button
                  onClick={() => {
                    onClose();
                    onBookHospital(hospital);
                  }}
                  className="py-3 px-4 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-1.5 transition"
                >
                  <Building2 className="w-4 h-4 text-[#8FA9FF]" />
                  <span>Book OPD</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
