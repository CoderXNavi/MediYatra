import React, { useState, useEffect } from 'react';
import { X, Plane, Building2, UserCheck, ShieldCheck, CheckCircle2, AlertCircle, Globe, Phone, FileText } from 'lucide-react';

export default function TourismBookingModal({ isOpen, onClose, currentUser, initialService, hospitals, doctors, onSuccess }) {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [serviceType, setServiceType] = useState('Fast-Track e-Medical Visa Invitation Letter');
  const [hospitalName, setHospitalName] = useState('Max Super Speciality Hospital Saket');
  const [doctorName, setDoctorName] = useState('Dr. Naresh Trehan');
  const [medicalReason, setMedicalReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      // If logged in user is a Patient, prefill their details
      if (currentUser.role === 'Patient' || !currentUser.role) {
        setPatientName(currentUser.name || '');
        setPatientEmail(currentUser.email || '');
      } else {
        // If logged in as Doctor/Hospital/Admin, leave patient fields blank for input
        setPatientName('');
        setPatientEmail('');
      }
    }
    if (initialService) {
      setServiceType(initialService);
    }
  }, [currentUser, initialService, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName || !patientEmail || !patientPhone || !serviceType || !medicalReason) {
      setErrorMsg('Please fill in all required patient details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tourism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientEmail: patientEmail.trim().toLowerCase(),
          patientPhone,
          patientCountry: country,
          serviceType,
          serviceDetails: `Request for ${serviceType} at ${hospitalName}`,
          hospitalId: 'hosp_1',
          hospitalName,
          doctorId: 'doc_1',
          doctorName,
          medicalReason
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(data.error || 'Failed to submit tourism request');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting tourism request');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#2D3A5E] text-white p-4 flex items-center justify-between border-b border-[#1A233D] shrink-0">
          <div className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-[#8FA9FF]" />
            <div>
              <h3 className="font-black text-base font-sans">Request Medical Tourism & Visa Service</h3>
              <p className="text-[11px] text-[#D7C6FF] font-bold">Step 1: Patient Service Submission</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white font-mono">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {currentUser && currentUser.role && currentUser.role !== 'Patient' && (
            <div className="p-3 bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>You are logged in as {currentUser.role} ({currentUser.name}). Please enter the Patient's details below to initiate Step 1.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border-2 border-red-300 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Service Type */}
            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">Medical Tourism Service Requested *</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
              >
                <option value="Fast-Track e-Medical Visa Invitation Letter">Fast-Track e-Medical Visa Invitation Letter (VIL)</option>
                <option value="Certified Language Interpreter">Certified Language Interpreter (Arabic/Russian/French/Bengali)</option>
                <option value="Serviced Recovery Guest Suite">Serviced Recovery Guest Suite Reservation</option>
                <option value="Airport Pickup & Wheelchair Van Transfer">Airport Pickup & Wheelchair Van Transfer</option>
              </select>
            </div>

            {/* Target Hospital & Doctor Selection */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Target Hospital (Step 2 VIL Approver) *</label>
                <select
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="Max Super Speciality Hospital Saket">Max Super Speciality Hospital Saket</option>
                  <option value="Fortis Escorts Heart Institute">Fortis Escorts Heart Institute</option>
                  <option value="Apollo Hospitals Greams Road">Apollo Hospitals Greams Road</option>
                  <option value="Artemis Health Institute">Artemis Health Institute Gurugram</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Target Doctor (Step 4 Evaluator) *</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="Dr. Naresh Trehan">Dr. Naresh Trehan (Cardiology)</option>
                  <option value="Dr. Ashok Seth">Dr. Ashok Seth (Interventional Cardiology)</option>
                  <option value="Dr. S. K. S. Marya">Dr. S. K. S. Marya (Orthopaedics)</option>
                  <option value="Dr. Sandeep Vaishya">Dr. Sandeep Vaishya (Neurosurgery)</option>
                </select>
              </div>
            </div>

            {/* Patient Name & Email */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Patient Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Country of Residence *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Oman">Oman</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Medical Reason */}
            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">Medical Reason & Symptoms Summary *</label>
              <textarea
                rows={3}
                required
                placeholder="Briefly describe surgical or medical treatment required..."
                value={medicalReason}
                onChange={(e) => setMedicalReason(e.target.value)}
                className="w-full border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg p-2.5 focus:border-[#8FA9FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4 text-[#8FA9FF]" />
              <span>{isSubmitting ? 'Submitting Step 1...' : 'Initiate Step 1 Tourism Request'}</span>
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
