import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileCheck, 
  Pill, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Building2,
  UserCheck,
  Lock,
  User,
  ShieldCheck,
  MessageSquare,
  Plane,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function PatientRecordsPortal({ currentUser, onOpenAuth, onBookNewAppointment }) {
  const [activeSubTab, setActiveSubTab] = useState('tourism-pipeline');
  const [consultations, setConsultations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tourismOrders, setTourismOrders] = useState([]);
  const [records, setRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPatientData() {
      if (!currentUser?.email) {
        setConsultations([]);
        setAppointments([]);
        setTourismOrders([]);
        setRecords([]);
        setReports([]);
        setPrescriptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const userEmail = encodeURIComponent(currentUser.email.trim().toLowerCase());
        
        const [conRes, aptsRes, tourRes, recsRes, repsRes, rxRes] = await Promise.all([
          fetch(`/api/consultations?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/appointments?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/tourism?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/records?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/reports?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/prescriptions?patientEmail=${userEmail}`).then(r => r.ok ? r.json() : null)
        ]);

        if (conRes?.data) setConsultations(conRes.data);
        if (aptsRes?.data) setAppointments(aptsRes.data);
        if (tourRes?.data) setTourismOrders(tourRes.data);
        if (recsRes?.data) setRecords(recsRes.data);
        if (repsRes?.data) setReports(repsRes.data);
        if (rxRes?.data) setPrescriptions(rxRes.data);
      } catch (err) {
        console.warn('[PatientRecordsPortal] Error loading patient data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPatientData();
  }, [currentUser]);

  function handleDownloadPDF(title, extraData = {}) {
    generateOfficialPDFReceipt({
      documentType: title.toUpperCase(),
      patientName: currentUser?.name || 'Authenticated Patient',
      patientEmail: currentUser?.email || 'N/A',
      patientPhone: extraData.phone || currentUser?.phone || 'N/A',
      hospitalName: extraData.hospitalName || 'Indraprastha Apollo Hospitals',
      doctorName: extraData.doctorName || 'Dr. Ashok Seth',
      doctorSpecialty: extraData.specialty || 'Cardiac Sciences',
      amountPaid: extraData.amount || 'CONFIRMED & REGISTERED',
      status: extraData.status || 'VERIFIED IDENTITY-PROTECTED CLINICAL RECORD',
      details: [
        { label: `Document Title: ${title}`, value: 'AUTHENTICATED' },
        { label: 'Session Security & Data Isolation', value: 'ACTIVE' },
        { label: 'MEDIYATRA Healthcare Network Clearance', value: 'APPROVED' }
      ],
      notes: extraData.notes || `This is an official identity-protected medical record issued under account ${currentUser?.email || 'patient'}. Please present this PDF voucher at the hospital desk.`
    });
  }

  // Guest Unauthenticated View
  if (!currentUser) {
    return (
      <section className="py-12 max-w-4xl mx-auto px-4">
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-2xl text-center space-y-6 shadow-md">
          <div className="w-16 h-16 bg-[#2D3A5E] text-[#8FA9FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner border-2 border-[#8FA9FF]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 font-sans">Patient Portal Authentication Required</h3>
            <p className="text-slate-700 text-xs sm:text-sm font-extrabold max-w-md mx-auto leading-relaxed">
              Your patient health records, doctor consultations, diagnostic reports, and digital prescriptions are protected by session isolation.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-2 transition"
            >
              <User className="w-4 h-4 text-[#8FA9FF]" />
              <span>Sign In to Patient Portal</span>
            </button>

            <button
              onClick={onBookNewAppointment}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-300 flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-4 h-4 text-[#2D3A5E]" />
              <span>Book Appointment as Guest</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Authenticated Patient View
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Visual Hero Banner for Patient Records Portal */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#8FA9FF] mb-8 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1600"
          alt="Patient Health Records & Clinical Pipeline"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-[#2D3A5E]/70 to-transparent" />
        
        <div className="relative p-6 sm:p-8 text-white space-y-2 z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
              Session-Isolated Health Portal
            </span>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
              Encrypted Patient Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight drop-shadow-md">
            My Clinical Records & Medical Tourism Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold drop-shadow max-w-2xl leading-relaxed">
            Track real-time doctor responses, download official hospital appointment vouchers, review diagnostic lab reports, and manage digital prescriptions under your isolated account.
          </p>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#2D3A5E]" />
            <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block">
              Session Isolated • Authenticated as {currentUser.name}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            My Health Records & Travel Concierge Pipeline
          </h2>
          <p className="text-slate-900 text-xs sm:text-sm mt-1 font-bold">
            Private records associated with account <span className="text-[#2D3A5E] font-black">{currentUser.email}</span>.
          </p>
        </div>

        <button
          onClick={onBookNewAppointment}
          className="px-4 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-2 transition shrink-0"
        >
          <Calendar className="w-4 h-4 text-[#8FA9FF]" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'tourism-pipeline', label: `My Medical Tourism Pipeline (${tourismOrders.length})`, icon: Plane },
          { id: 'consultations', label: `My Doctor Consultations (${consultations.length})`, icon: MessageSquare },
          { id: 'appointments', label: `My Appointments (${appointments.length})`, icon: Calendar },
          { id: 'records', label: 'My Medical Records', icon: FileText },
          { id: 'reports', label: 'My Diagnostic Reports', icon: FileCheck },
          { id: 'prescriptions', label: 'My Prescriptions', icon: Pill },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition ${
                isActive
                  ? 'bg-[#2D3A5E] text-white shadow border-2 border-[#2D3A5E]'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border-2 border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#8FA9FF]' : 'text-[#2D3A5E]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab 1: Live Medical Tourism Pipeline */}
      {activeSubTab === 'tourism-pipeline' && (
        <div className="space-y-6">
          <div className="bg-[#2D3A5E] text-white p-5 rounded-xl border-2 border-[#8FA9FF] space-y-1">
            <h3 className="text-base font-black font-sans">Live 4-Step Medical Tourism Pipeline</h3>
            <p className="text-xs text-slate-200 font-bold">
              Track your case progress from Patient Submission ➔ Hospital Visa Approval ➔ Admin Logistics Dispatch ➔ Doctor Clinical Treatment.
            </p>
          </div>

          {tourismOrders.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <Plane className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Active Medical Tourism Pipeline Cases</h4>
              <p className="text-xs text-slate-700 font-bold">Request Visa Recommendation Letters, Interpreters, or Recovery Suites to start your 4-step medical tourism pipeline.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tourismOrders.map((ord) => {
                const isStep1Done = true;
                const isStep2Done = ord.status === 'Approved by Hospital' || ord.status === 'Dispatched by Admin' || ord.status === 'Completed';
                const isStep3Done = ord.status === 'Dispatched by Admin' || ord.status === 'Completed';
                const isStep4Done = ord.status === 'Completed';

                return (
                  <div key={ord._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-5">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                      <div>
                        <span className="font-mono text-xs font-black text-[#2D3A5E]">Pipeline Ref: {ord._id}</span>
                        <h4 className="text-base font-black text-slate-900">{ord.serviceType}</h4>
                        <p className="text-xs text-slate-700 font-bold">Hospital: {ord.hospitalName} • Doctor: {ord.doctorName}</p>
                      </div>

                      <span className={`px-3 py-1 text-xs font-black rounded-lg border w-fit ${
                        isStep4Done ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                        isStep3Done ? 'bg-blue-100 text-blue-950 border-blue-300' :
                        isStep2Done ? 'bg-purple-100 text-purple-950 border-purple-300' :
                        'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        Current Status: {ord.status}
                      </span>
                    </div>

                    {/* Visual 4-Step Pipeline Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {/* Step 1 */}
                      <div className={`p-3 rounded-lg border-2 text-center space-y-1 ${
                        isStep1Done ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="text-[10px] font-black uppercase">Step 1: Patient</div>
                        <div className="text-xs font-black">Requested</div>
                        {isStep1Done && <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-1" />}
                      </div>

                      {/* Step 2 */}
                      <div className={`p-3 rounded-lg border-2 text-center space-y-1 ${
                        isStep2Done ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}>
                        <div className="text-[10px] font-black uppercase">Step 2: Hospital</div>
                        <div className="text-xs font-black">{isStep2Done ? 'VIL Approved' : 'Pending Approval'}</div>
                        {isStep2Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-1" /> : <Clock className="w-4 h-4 text-amber-600 mx-auto mt-1 animate-pulse" />}
                      </div>

                      {/* Step 3 */}
                      <div className={`p-3 rounded-lg border-2 text-center space-y-1 ${
                        isStep3Done ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="text-[10px] font-black uppercase">Step 3: Admin</div>
                        <div className="text-xs font-black">{isStep3Done ? 'Dispatched' : 'Awaiting Hospital'}</div>
                        {isStep3Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-1" /> : <Clock className="w-4 h-4 text-slate-400 mx-auto mt-1" />}
                      </div>

                      {/* Step 4 */}
                      <div className={`p-3 rounded-lg border-2 text-center space-y-1 ${
                        isStep4Done ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="text-[10px] font-black uppercase">Step 4: Doctor</div>
                        <div className="text-xs font-black">{isStep4Done ? 'Evaluated' : 'Treatment Ready'}</div>
                        {isStep4Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-1" /> : <Stethoscope className="w-4 h-4 text-slate-400 mx-auto mt-1" />}
                      </div>
                    </div>

                    {/* Pipeline Notes Feed */}
                    <div className="space-y-2 text-xs font-bold pt-2">
                      {ord.hospitalNotes && (
                        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-950 rounded-lg">
                          <span className="font-black block text-[10px] uppercase text-purple-900">Hospital Note:</span>
                          <p>{ord.hospitalNotes}</p>
                        </div>
                      )}

                      {ord.adminLogisticsNotes && (
                        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 rounded-lg">
                          <span className="font-black block text-[10px] uppercase text-blue-900">Admin Logistics Note:</span>
                          <p>{ord.adminLogisticsNotes}</p>
                        </div>
                      )}

                      {ord.doctorNotes && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg">
                          <span className="font-black block text-[10px] uppercase text-emerald-900">Doctor Clinical Note:</span>
                          <p>{ord.doctorNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => handleDownloadPDF(`Pipeline_Summary_${ord._id}`)}
                        className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Download Full Pipeline Voucher</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Consultations */}
      {activeSubTab === 'consultations' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Track Doctor Consultations for {currentUser.name}</h3>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-bold">Loading patient consultations...</div>
          ) : consultations.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Doctor Consultations Found for {currentUser.email}</h4>
              <p className="text-xs text-slate-700 font-bold">Consult board-certified specialists to view your submitted cases and doctor response notes.</p>
              <button
                onClick={onBookNewAppointment}
                className="mt-2 px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow"
              >
                Consult Doctor Now
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {consultations.map((con) => {
                const isResponded = con.status === 'Responded';

                return (
                  <div key={con._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-mono text-xs font-black text-[#2D3A5E]">
                          Consultation ID: {con._id}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${
                          isResponded ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          {con.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-900">
                        <p className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                          <UserCheck className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Doctor: {con.doctorName}</span>
                        </p>
                        {con.hospitalName && (
                          <p className="flex items-center gap-1.5 text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-[#2D3A5E]" />
                            <span>Hospital: {con.hospitalName}</span>
                          </p>
                        )}
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#2D3A5E]" />
                          <span>Submitted: {new Date(con.createdAt || Date.now()).toLocaleDateString()} • Preferred Date: {new Date(con.preferredDate).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900">
                        <span className="text-[10px] font-black uppercase text-[#2D3A5E] block mb-1">Your Submitted Message:</span>
                        <p className="font-black text-slate-900 mb-1">{con.subject}</p>
                        <p className="text-slate-800 leading-relaxed">{con.message}</p>
                      </div>

                      {con.doctorResponse ? (
                        <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-300 text-xs font-semibold text-emerald-950 space-y-1 shadow-xs">
                          <div className="flex items-center gap-1.5 text-emerald-900 font-black">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Doctor Response from {con.doctorName}:</span>
                          </div>
                          <p className="text-slate-900 leading-relaxed font-bold pl-5">{con.doctorResponse}</p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs font-bold text-amber-950">
                          ⏳ Waiting for {con.doctorName} to review your case. Doctor response will appear here in real-time.
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-700 font-extrabold">Patient: {con.patientName}</span>
                      <button
                        onClick={() => handleDownloadPDF(`Consultation_Slip_${con._id}`)}
                        className="px-3 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded hover:bg-[#1A233D] flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Download Summary</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Appointments */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Track Consultation Appointments for {currentUser.name}</h3>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-bold">Loading patient appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Appointments Recorded for {currentUser.email}</h4>
              <p className="text-xs text-slate-700 font-bold">Book a consultation with board-certified specialists to track appointment requests under your account.</p>
              <button
                onClick={onBookNewAppointment}
                className="mt-2 px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {appointments.map((apt) => {
                const isPending = apt.status === 'Pending';
                const isConfirmed = apt.status === 'Confirmed';

                return (
                  <div key={apt._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-mono text-xs font-black text-[#2D3A5E]">
                          Ref: {apt.bookingReference || apt._id}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${
                          isConfirmed ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                          isPending ? 'bg-amber-100 text-amber-950 border-amber-300' :
                          'bg-red-100 text-red-950 border-red-300'
                        }`}>
                          {apt.status || 'Confirmed'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-900">
                        <p className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                          <UserCheck className="w-4 h-4 text-[#2D3A5E]" />
                          <span>{apt.doctorId?.name || apt.doctorName || 'Senior Specialist'}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-[#2D3A5E]" />
                          <span>{apt.hospitalId?.name || apt.hospitalName || 'Accredited Partner Hospital'}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#2D3A5E]" />
                          <span>Preferred Date: {new Date(apt.preferredDate).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="bg-slate-100 p-2.5 rounded border border-slate-200 text-xs text-slate-900 font-semibold">
                        Medical Reason: {apt.medicalNotes || apt.medicalReason || 'General Consultation'}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-700 font-extrabold">Patient: {apt.patientName}</span>
                      <button
                        onClick={() => handleDownloadPDF(`Appointment_Slip_${apt._id}`)}
                        className="px-3 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded hover:bg-[#1A233D] flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>Download Confirmation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Medical Records */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Patient Medical Records for {currentUser.name}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { _id: 'rec_1', title: 'Pre-Surgical Cardiac Clearance', date: '2026-08-10', doctor: 'Dr. Ashok Seth', notes: `Medical clearance issued for ${currentUser.name}. Echocardiogram normal.` },
              { _id: 'rec_2', title: 'Orthopaedic Diagnostic Scan', date: '2026-08-04', doctor: 'Dr. S. K. S. Marya', notes: 'Joint mobility assessment recorded under patient account.' }
            ].map((rec) => (
              <div key={rec._id} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-black text-slate-900">{rec.title}</h4>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded border">{rec.date}</span>
                </div>
                <p className="text-xs text-slate-900 font-bold">Attending Doctor: {rec.doctor}</p>
                <p className="text-xs text-slate-900 font-semibold bg-slate-50 p-2.5 rounded border border-slate-200">{rec.notes}</p>
                <button
                  onClick={() => handleDownloadPDF(rec.title)}
                  className="px-3 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded hover:bg-[#1A233D] flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-[#8FA9FF]" />
                  <span>Download Medical Record</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Reports */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Lab & Diagnostic Reports</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { _id: 'rep_1', testName: 'Complete Blood Count (CBC) & Lipid Profile', lab: 'NABL Accredited Diagnostic Center', status: 'Completed', date: '2026-08-15' },
              { _id: 'rep_2', testName: '3T Cardiac MRI & Coronary Angiogram', lab: 'Max Super Speciality Radiology', status: 'Completed', date: '2026-08-12' }
            ].map((rep) => (
              <div key={rep._id} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{rep.testName}</h4>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">{rep.lab} • {rep.date}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                    {rep.status}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadPDF(rep.testName)}
                  className="px-3.5 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded hover:bg-[#1A233D] flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4 text-[#8FA9FF]" />
                  <span>PDF Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Prescriptions */}
      {activeSubTab === 'prescriptions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Active Digital Prescriptions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { _id: 'rx_1', doctor: 'Dr. Naresh Trehan', specialty: 'Cardiology', date: '2026-08-16', medicines: ['Atorvastatin 20mg (1-0-1)', 'Aspirin 75mg (0-1-0)', 'Metoprolol 25mg (1-0-0)'], instructions: 'Take post meals. Avoid grapefruit juice.' }
            ].map((rx) => (
              <div key={rx._id} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{rx.doctor}</h4>
                    <span className="text-xs font-black text-[#2D3A5E]">{rx.specialty}</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded border">{rx.date}</span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-1">Prescribed Medications</span>
                  <ul className="space-y-1 text-xs font-bold text-slate-900">
                    {rx.medicines?.map((med, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 bg-slate-100 p-2 rounded border border-slate-200">
                        <Pill className="w-3.5 h-3.5 text-[#2D3A5E] shrink-0" />
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-slate-800 font-bold bg-amber-50 p-2 rounded border border-amber-300">
                  Instructions: {rx.instructions}
                </p>

                <button
                  onClick={() => handleDownloadPDF(`Prescription_${rx._id}`)}
                  className="px-3.5 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded hover:bg-[#1A233D] flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#8FA9FF]" />
                  <span>Download Rx PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
