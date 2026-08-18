import React, { useState } from 'react';
import { 
  PhoneCall, 
  X, 
  MapPin, 
  CheckCircle2, 
  Ambulance, 
  ShieldAlert,
  Download
} from 'lucide-react';
import { apiService } from '../services/api';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function EmergencySOSModal({ isOpen, onClose }) {
  const [patientLocation, setPatientLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [natureOfEmergency, setNatureOfEmergency] = useState('Severe Chest Pain / Trauma');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  async function handleDispatch(e) {
    e.preventDefault();
    setErrorMessage('');
    setIsDispatching(true);

    try {
      const payload = {
        pickupLocation: patientLocation,
        contactPhone: contactNumber,
        emergencyType: natureOfEmergency
      };

      const result = await apiService.dispatchAmbulance(payload);
      if (result.success || result.data) {
        setDispatchConfirmed(result.data || result);
      } else {
        throw new Error(result.error || result.message || 'Dispatch failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to ambulance dispatch system');
    } finally {
      setIsDispatching(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-4 border-red-700 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Emergency Header */}
        <div className="bg-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-black text-base tracking-tight font-sans">EMERGENCY SOS DISPATCH</h3>
              <p className="text-[11px] text-red-100 font-bold">24/7 ICU Ambulance Response Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-white">
          
          {/* Direct Hotline Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center space-y-1">
            <span className="text-[11px] text-red-700 font-black uppercase tracking-wider block">
              Direct Emergency Hotline
            </span>
            <a 
              href="tel:+911140009999" 
              className="text-xl font-black text-red-700 hover:underline block font-sans"
            >
              +91 11 4000 9999
            </a>
            <p className="text-[10px] text-slate-700 font-bold">Tap to call emergency medical responder directly</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg font-bold">
              {errorMessage}
            </div>
          )}

          {dispatchConfirmed ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-sans">ICU Ambulance Dispatched</h4>
              
              <div className="bg-slate-100 p-3 rounded-lg text-left text-xs space-y-1 border-2 border-slate-200 font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-700">Dispatch ID:</span>
                  <span className="font-mono font-black text-slate-900">{dispatchConfirmed.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Estimated Arrival:</span>
                  <span className="font-extrabold text-emerald-800">{dispatchConfirmed.estimatedArrival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Driver Contact:</span>
                  <span className="font-mono text-slate-900">{dispatchConfirmed.driverContact}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    generateOfficialPDFReceipt({
                      documentType: 'EMERGENCY 24/7 ICU AMBULANCE DISPATCH RECEIPT',
                      referenceNo: dispatchConfirmed.ticketId || 'MY-SOS-911',
                      date: new Date().toLocaleDateString(),
                      patientName: 'Emergency SOS Patient',
                      patientEmail: 'N/A',
                      patientPhone: contactNumber,
                      doctorName: 'On-Call ICU Emergency Physician',
                      doctorSpecialty: 'Emergency Trauma & Resuscitation',
                      hospitalName: 'Indraprastha Apollo Emergency Response Unit',
                      hospitalCity: 'New Delhi',
                      amountPaid: 'EMERGENCY DISPATCH INITIATED',
                      status: 'ICU AMBULANCE DISPATCHED',
                      details: [
                        { label: `Pickup Location: ${patientLocation}`, value: 'EN ROUTE' },
                        { label: 'Emergency Type', value: natureOfEmergency },
                        { label: 'Estimated Unit Arrival Time', value: dispatchConfirmed.estimatedArrival || '8 Mins' },
                        { label: 'Ambulance Driver Contact', value: dispatchConfirmed.driverContact || '+91 98111 22334' }
                      ],
                      notes: `CRITICAL NOTICE: An Advanced Life Support (ALS) ICU Ambulance unit with oxygen and ventilator equipment has been dispatched to ${patientLocation}.\nContact Dispatch Hotline (+91 11 4000 9999) for immediate updates.`
                    });
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download Official PDF SOS Slip</span>
                </button>

                <button
                  onClick={() => {
                    setDispatchConfirmed(null);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs rounded-lg shadow"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDispatch} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Pickup Location / Hotel Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 402, Hyatt Regency Saket, New Delhi"
                    value={patientLocation}
                    onChange={(e) => setPatientLocation(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-extrabold text-slate-900 focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 00000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs font-extrabold text-slate-900 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Nature of Medical Emergency</label>
                <select
                  value={natureOfEmergency}
                  onChange={(e) => setNatureOfEmergency(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs font-extrabold text-slate-900 focus:border-red-600 focus:outline-none"
                >
                  <option value="Severe Chest Pain / Trauma">Severe Chest Pain / Trauma</option>
                  <option value="Acute Respiratory Distress">Acute Respiratory Distress</option>
                  <option value="Stroke / Neurological Collapse">Stroke / Neurological Collapse</option>
                  <option value="Post-Surgical Complication">Post-Surgical Complication</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isDispatching ? 'Contacting Dispatch Controller...' : 'DISPATCH AMBULANCE NOW'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
