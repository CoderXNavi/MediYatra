import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Download
} from 'lucide-react';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function ConsultationModal({
  isOpen,
  onClose,
  currentUser,
  doctor,
  onConsultationSubmitted
}) {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (doctor && isOpen) {
      setSubject(`Clinical Inquiry for ${doctor.name} (${doctor.specialty})`);
    }
  }, [doctor, isOpen]);

  if (!isOpen || !doctor) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName || !patientEmail || !message || !preferredDate) {
      setErrorMessage('Please fill in all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientEmail: patientEmail.trim().toLowerCase(),
        patientName,
        patientPhone,
        patientCountry: country,
        doctorId: doctor._id || 'doc_1',
        doctorName: doctor.name,
        hospitalId: doctor.hospitalId || 'hosp_1',
        hospitalName: doctor.hospitalName || 'Accredited Partner Hospital',
        subject: subject || `Consultation regarding ${doctor.name}`,
        message,
        preferredDate
      };

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Consultation submission failed');
      }

      setSubmitSuccess(data.data || data);
      if (onConsultationSubmitted) {
        onConsultationSubmitted(data.data || data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while submitting consultation');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitSuccess(null);
    setErrorMessage('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#2D3A5E] text-white px-6 py-4 flex items-center justify-between border-b border-[#1A233D]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-[#8FA9FF] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white font-sans">Consult {doctor.name}</h3>
              <p className="text-xs text-[#8FA9FF] font-black">{doctor.specialty} • {doctor.hospitalName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white">
          {submitSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 font-sans">Consultation Request Dispatched</h4>
              <p className="text-slate-900 text-xs sm:text-sm font-bold max-w-md mx-auto">
                Your medical case has been assigned to <span className="font-black text-[#2D3A5E]">{doctor.name}</span> under your account email <span className="font-black text-[#2D3A5E]">{patientEmail}</span>.
              </p>
              
              <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-300 text-left text-xs space-y-2 max-w-md mx-auto font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-700">Case ID:</span>
                  <span className="font-mono font-black text-[#2D3A5E]">{submitSuccess._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Specialist:</span>
                  <span className="font-extrabold text-slate-900">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Patient Account:</span>
                  <span className="font-extrabold text-[#2D3A5E]">{patientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Status:</span>
                  <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {submitSuccess.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    generateOfficialPDFReceipt({
                      documentType: 'SPECIALIST CONSULTATION REQUEST VOUCHER',
                      referenceNo: submitSuccess._id || 'MY-CON-9921',
                      date: preferredDate || new Date().toLocaleDateString(),
                      patientName,
                      patientEmail,
                      patientPhone,
                      doctorName: doctor.name,
                      doctorSpecialty: doctor.specialty,
                      hospitalName: doctor.hospitalName || 'Accredited Partner Hospital',
                      hospitalCity: 'New Delhi',
                      amountPaid: doctor.consultationFeeUSD ? `$${doctor.consultationFeeUSD} / ₹${doctor.consultationFeeINR}` : 'PENDING EVALUATION',
                      status: 'REGISTERED & DISPATCHED TO DOCTOR',
                      details: [
                        { label: `Specialist Department: ${doctor.specialty}`, value: 'ASSIGNED' },
                        { label: 'Consultation Subject', value: subject || 'General Inquiry' },
                        { label: 'Patient Country of Residence', value: country },
                        { label: 'Doctor Review Status', value: 'PENDING CLINICAL RESPONSE' }
                      ],
                      notes: `Submitted Clinical Message:\n${message}\n\nThis consultation voucher is tracked live under your MEDIYATRA Patient Portal account.`
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download Consultation PDF Slip</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow"
                >
                  View Case in Patient Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Doctor Summary Banner */}
              <div className="p-3 bg-slate-100 border-2 border-slate-300 text-[#2D3A5E] text-xs rounded-xl space-y-1 font-bold">
                <p className="font-black text-sm text-slate-900">{doctor.name} ({doctor.qualifications})</p>
                <p className="text-xs text-slate-700">{doctor.specialty} • {doctor.hospitalName}</p>
                <p className="text-[11px] text-emerald-800 font-extrabold">OPD Fee: ${doctor.consultationFeeUSD} / ₹{doctor.consultationFeeINR}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-900 block mb-1">Patient Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-900 block mb-1">Account Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-900 block mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-900 block mb-1">Preferred Consultation Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Consultation Subject / Medical Concern *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second opinion on CABG triple vessel disease"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Detailed Medical Symptoms & History *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your current diagnosis, medical history, duration of symptoms, and questions for Dr. "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg p-3 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-black rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Dispatching to Doctor...' : 'Submit Consultation to Doctor'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
