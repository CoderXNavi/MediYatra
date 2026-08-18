import React, { useState, useEffect } from 'react';
import { 
  X, 
  CalendarCheck, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Download 
} from 'lucide-react';
import { apiService } from '../services/api';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  currentUser,
  preselectedDoctor, 
  preselectedHospital, 
  preselectedTreatment,
  preselectedService 
}) {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [preferredDate, setPreferredDate] = useState('');
  const [medicalReason, setMedicalReason] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user data if signed in
  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setMedicalReason(
        preselectedTreatment ? `Inquiry regarding procedure: ${preselectedTreatment.name}` :
        preselectedService ? `Requesting service: ${preselectedService}` : ''
      );
    }
  }, [isOpen, preselectedTreatment, preselectedService]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName || !patientEmail || !patientPhone || !preferredDate) {
      setErrorMessage('Please fill in all required fields (*)');
      return;
    }

    // Future date validation
    const chosen = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen < today) {
      setErrorMessage('Preferred consultation date must be in the future.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        hospitalId: preselectedHospital?._id || preselectedDoctor?.hospitalId || 'hosp_1',
        doctorId: preselectedDoctor?._id || null,
        treatmentId: preselectedTreatment?._id || null,
        patientName,
        patientEmail: patientEmail.trim().toLowerCase(),
        patientPhone,
        patientCountry: country,
        preferredDate,
        medicalNotes: medicalReason || 'General Consultation & Treatment Plan'
      };

      const result = await apiService.bookAppointment(payload);
      if (result.success || result.data) {
        setSubmitSuccess(result.data || result);
      } else {
        throw new Error(result.error || result.message || 'Booking failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while booking');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#2D3A5E] text-white px-6 py-4 flex items-center justify-between border-b border-[#1A233D]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-[#8FA9FF] flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white font-sans">Book Medical Consultation</h3>
              <p className="text-xs text-[#D7C6FF] font-bold">MediYatra International Patient Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body / Success Screen */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white">
          {submitSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 font-sans">Consultation Request Confirmed</h4>
              <p className="text-slate-900 text-xs sm:text-sm font-bold max-w-md mx-auto">
                Your consultation booking has been recorded and associated with email <span className="font-black text-[#2D3A5E]">{patientEmail}</span>.
              </p>
              
              <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-300 text-left text-xs space-y-2 max-w-md mx-auto font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-700">Booking Reference:</span>
                  <span className="font-mono font-black text-[#2D3A5E]">{submitSuccess.bookingReference || 'MY-APT-88421'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Patient:</span>
                  <span className="font-extrabold text-slate-900">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Account Email:</span>
                  <span className="font-extrabold text-[#2D3A5E]">{patientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Preferred Date:</span>
                  <span className="font-extrabold text-slate-900">{preferredDate}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    generateOfficialPDFReceipt({
                      documentType: 'OPD APPOINTMENT CONFIRMATION VOUCHER',
                      referenceNo: submitSuccess.bookingReference || 'MY-APT-88421',
                      date: preferredDate || new Date().toLocaleDateString(),
                      patientName,
                      patientEmail,
                      patientPhone,
                      doctorName: preselectedDoctor?.name || 'Senior Specialist',
                      doctorSpecialty: preselectedDoctor?.specialty || 'General Medicine',
                      hospitalName: preselectedHospital?.name || preselectedDoctor?.hospitalName || 'Indraprastha Apollo Hospitals',
                      hospitalCity: preselectedHospital?.city || preselectedDoctor?.hospitalCity || 'New Delhi',
                      amountPaid: 'CONFIRMED & REGISTERED',
                      status: 'VERIFIED & APPOINTMENT SCHEDULED',
                      details: [
                        { label: 'Consultation Type: Specialist Hospital OPD', value: 'CONFIRMED' },
                        { label: 'Preferred Appointment Date', value: preferredDate },
                        { label: 'Patient Country of Residence', value: country },
                        { label: 'Medical Concierge Desk Registration', value: 'ACTIVE' }
                      ],
                      notes: `Medical Reason: ${medicalReason || 'General Consultation'}\n\nPlease present this official PDF voucher at the hospital international reception desk along with your identity proof/passport.`
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download PDF Voucher</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow"
                >
                  Close & View in Patient Portal
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

              {/* Preselected Summary Notice */}
              {(preselectedDoctor || preselectedHospital || preselectedTreatment) && (
                <div className="p-3 bg-slate-100 border-2 border-slate-300 text-[#2D3A5E] text-xs rounded-lg space-y-1 font-bold">
                  {preselectedDoctor && <p className="font-black">Consulting: {preselectedDoctor.name} ({preselectedDoctor.specialty})</p>}
                  {preselectedHospital && <p className="font-extrabold">Hospital: {preselectedHospital.name}</p>}
                  {preselectedTreatment && <p className="font-extrabold">Procedure Inquiry: {preselectedTreatment.name}</p>}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-900 block mb-1">Full Name *</label>
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
                  <label className="text-xs font-black text-slate-900 block mb-1">Account / Patient Email *</label>
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
                  <label className="text-xs font-black text-slate-900 block mb-1">Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
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
                <label className="text-xs font-black text-slate-900 block mb-1">Country of Residence</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Oman">Oman</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="India">India</option>
                  <option value="Other">Other International Country</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Medical Reason & Symptoms Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe your diagnosis, current symptoms, or desired surgical procedure..."
                  value={medicalReason}
                  onChange={(e) => setMedicalReason(e.target.value)}
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
                  {isSubmitting ? 'Submitting Request...' : 'Confirm Appointment Request'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
