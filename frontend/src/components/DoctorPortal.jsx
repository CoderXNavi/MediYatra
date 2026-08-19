import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Stethoscope,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Send,
  Building2,
  Globe,
  Edit3,
  Plane,
  Award,
  FileText,
  Languages,
  Hotel,
  ShieldCheck,
  Eye,
  BookOpen,
  MapPin,
  TrendingDown,
  Info,
  Check,
  X,
  User,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { MOCK_TOURISM_PIPELINE, MOCK_PATIENT_CONSULTATIONS } from '../data/mockData';

export default function DoctorPortal({ currentUser }) {
  // Tabs: 'pipeline-cases' | 'consultations' | 'network' | 'surgical-tariffs' | 'travel-support' | 'profile'
  const [activeTab, setActiveTab] = useState('pipeline-cases');
  const [travelSubTab, setTravelSubTab] = useState('visa'); // 'visa' | 'interpreters' | 'accommodations'

  // Data states
  const [tourismPipelineCases, setTourismPipelineCases] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);
  const [accommodationsList, setAccommodationsList] = useState([]);
  const [translatorsList, setTranslatorsList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Item Modals
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [selectedPackageModal, setSelectedPackageModal] = useState(null);
  const [selectedInterpreterModal, setSelectedInterpreterModal] = useState(null);
  const [selectedAccommodationModal, setSelectedAccommodationModal] = useState(null);

  // Action Forms State
  const [responseText, setResponseText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Doctor Availability & Schedule Management State
  const [doctorStatus, setDoctorStatus] = useState('Available'); // 'Available' | 'In Surgery' | 'On Leave'
  const [availabilitySchedule, setAvailabilitySchedule] = useState('Mon, Wed, Fri (09:00 AM - 04:00 PM)');

  // Profile Edit Form State
  const [specialty, setSpecialty] = useState('Cardiology');
  const [qualifications, setQualifications] = useState('MBBS, MD, DM (Cardiology), FRCP');
  const [experienceYears, setExperienceYears] = useState(18);
  const [consultationFeeUSD, setConsultationFeeUSD] = useState(60);
  const [languages, setLanguages] = useState('English, Hindi, Arabic');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('Apollo Hospitals, New Delhi');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    loadDoctorPortalData();
  }, [currentUser]);

  async function loadDoctorPortalData() {
    setIsLoading(true);
    try {
      const docName = currentUser?.name || '';

      const [conRes, tourRes, docs, treats, accs, trans, hosps] = await Promise.all([
        fetch(`/api/consultations?doctorName=${encodeURIComponent(docName)}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/tourism?doctorName=${encodeURIComponent(docName)}`).then(r => r.ok ? r.json() : null),
        apiService.getDoctors(),
        apiService.getTreatments(),
        apiService.getAccommodations(),
        apiService.getTranslators(),
        apiService.getHospitals()
      ]);

      setConsultations((conRes?.data && conRes.data.length > 0) ? conRes.data : MOCK_PATIENT_CONSULTATIONS);
      setTourismPipelineCases((tourRes?.data && tourRes.data.length > 0) ? tourRes.data : MOCK_TOURISM_PIPELINE);
      setDoctorsList(docs || []);
      setTreatmentsList(treats || []);
      setAccommodationsList(accs || []);
      setTranslatorsList(trans || []);
      setHospitalsList(hosps || []);
    } catch (err) {
      console.warn('Error loading doctor portal data:', err);
      setConsultations(MOCK_PATIENT_CONSULTATIONS);
      setTourismPipelineCases(MOCK_TOURISM_PIPELINE);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDoctorCompletePipeline(e) {
    e.preventDefault();
    if (!selectedCase || !responseText) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tourism/${selectedCase._id}/doctor-complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorNotes: responseText })
      });

      if (res.ok) {
        setStatusMsg(`✅ Step 4 Complete: Clinical treatment advice issued for Patient ${selectedCase.patientName}!`);
        setSelectedCase(null);
        setResponseText('');
        loadDoctorPortalData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendResponse(e) {
    e.preventDefault();
    if (!selectedConsultation || !responseText) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/consultations/${selectedConsultation._id}/response`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorResponse: responseText,
          status: 'Responded'
        })
      });

      if (response.ok) {
        setStatusMsg(`✅ Clinical response dispatched for consultation #${selectedConsultation._id}`);
        setSelectedConsultation(null);
        setResponseText('');
        loadDoctorPortalData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setIsSavingProfile(true);
    setStatusMsg('');

    try {
      const response = await fetch('/api/doctors/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser?.name || 'Dr. Naresh Trehan',
          specialty,
          qualifications,
          experienceYears,
          consultationFeeUSD,
          languages,
          imageUrl,
          hospitalAffiliation
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMsg(`✅ Professional Profile for ${currentUser?.name || 'Doctor'} updated successfully across the platform directory!`);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setStatusMsg(`❌ Error updating profile: ${err.message}`);
    } finally {
      setIsSavingProfile(false);
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FFF6FB]">

      {/* Doctor Portal Header Banner */}
      <div className="bg-[#2B4A66] text-white rounded-2xl p-6 border border-[#7FD6FF] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-5 h-5 text-[#7FD6FF]" />
            <span className="text-xs font-bold text-[#7FD6FF] uppercase tracking-wider block">
              MediYatra Physician & Provider Operations Portal • {currentUser?.name || 'Dr. Ashok Seth'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
            Clinical Desk & Provider Operations
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-0.5 font-medium">
            Evaluate dispatched international clinical cases, manage consultation schedules, inspect surgical package tariffs, and access professional travel & language networks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#1E364B] px-3 py-1.5 rounded-xl border border-[#7FD6FF] text-right">
            <span className="text-[10px] font-bold text-slate-300 block uppercase">Duty Status</span>
            <span className={`text-xs font-bold flex items-center justify-end gap-1 ${doctorStatus === 'Available' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
              <span className={`w-2 h-2 rounded-full ${doctorStatus === 'Available' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`} />
              {doctorStatus}
            </span>
          </div>

          <button
            onClick={loadDoctorPortalData}
            className="px-3.5 py-2.5 bg-[#1E364B] text-[#7FD6FF] border border-[#7FD6FF] text-xs font-bold rounded-xl shadow-xs hover:bg-[#2B4A66] flex items-center gap-1.5 font-sans cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 mb-6 bg-emerald-100 border border-[#6FE3B4] text-emerald-950 text-xs rounded-xl font-bold flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="p-1 font-mono cursor-pointer">X</button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pipeline-cases')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'pipeline-cases' ? 'bg-[#2B4A66] text-white border-[#2B4A66] shadow-xs' : 'bg-white text-slate-700 border-[#FFD6E8] hover:bg-slate-50'
            }`}
        >
          <Plane className="w-4 h-4 text-[#7FD6FF]" />
          <span>Step 4: Dispatched Clinical Cases ({tourismPipelineCases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${activeTab === 'consultations' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
        >
          <MessageSquare className="w-4 h-4 text-[#8FA9FF]" />
          <span>Patient Clinical Inquiries ({consultations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${activeTab === 'network' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
        >
          <UserCheck className="w-4 h-4 text-[#8FA9FF]" />
          <span>Faculty Directory & Peer Network</span>
        </button>

        <button
          onClick={() => setActiveTab('surgical-tariffs')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${activeTab === 'surgical-tariffs' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
        >
          <BookOpen className="w-4 h-4 text-[#8FA9FF]" />
          <span>Surgical Package Tariffs</span>
        </button>

        <button
          onClick={() => setActiveTab('travel-support')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${activeTab === 'travel-support' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
        >
          <Globe className="w-4 h-4 text-[#8FA9FF]" />
          <span>Professional Travel & Language Support</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${activeTab === 'profile' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
        >
          <Edit3 className="w-4 h-4 text-[#8FA9FF]" />
          <span>Manage Profile & Credentials</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: STEP 4 DISPATCHED CLINICAL CASES */}
      {/* ========================================================= */}
      {activeTab === 'pipeline-cases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Step 4: Dispatched International Cases Awaiting Preliminary Clearance</h3>
              <p className="text-xs text-slate-600 font-bold">Review patient medical records, hospital VIL status, and issue preliminary clinical advice.</p>
            </div>
            <span className="text-xs font-black text-[#2D3A5E] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
              Evaluator: {currentUser?.name || 'Dr. Ashok Seth'}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-bold">Loading clinical cases...</div>
          ) : tourismPipelineCases.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <Plane className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Dispatched Cases Pending Clinical Evaluation</h4>
              <p className="text-xs text-slate-700 font-bold max-w-md mx-auto">
                Cases dispatched by Admin Logistics and cleared by hospital desks will automatically appear here for clinical review.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tourismPipelineCases.map((cas) => {
                const isCompleted = cas.status === 'Completed';

                return (
                  <div key={cas._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between space-y-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-mono text-xs font-black text-[#2D3A5E]">Ref ID: {cas._id}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${isCompleted ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-blue-100 text-blue-950 border-blue-300'
                          }`}>
                          {cas.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-900">
                        <p className="text-sm font-black text-slate-900">Patient: {cas.patientName} ({cas.patientCountry})</p>
                        <p className="text-slate-700">Hospital: {cas.hospitalName}</p>
                        <p className="text-slate-700">Medical Reason: {cas.medicalReason}</p>
                      </div>

                      {cas.hospitalNotes && (
                        <div className="bg-purple-50 p-2.5 rounded border border-purple-200 text-[11px] text-purple-950">
                          <span className="font-black block uppercase text-[9px] text-purple-900">Hospital VIL Clearance:</span>
                          <p>{cas.hospitalNotes}</p>
                        </div>
                      )}

                      {cas.adminLogisticsNotes && (
                        <div className="bg-blue-50 p-2.5 rounded border border-blue-200 text-[11px] text-blue-950">
                          <span className="font-black block uppercase text-[9px] text-blue-900">Admin Logistics Clearance:</span>
                          <p>{cas.adminLogisticsNotes}</p>
                        </div>
                      )}

                      {cas.doctorNotes && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-300 text-xs text-emerald-950 font-semibold">
                          <span className="font-black block text-[10px] uppercase text-emerald-900">Your Preliminary Clinical Response:</span>
                          <p>{cas.doctorNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setSelectedCase(cas);
                          setResponseText(cas.doctorNotes || '');
                        }}
                        className="w-full py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center justify-center gap-2 transition"
                      >
                        <Send className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>{isCompleted ? 'Update Clinical Treatment Advice' : 'Issue Preliminary Clinical Clearance'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PATIENT CLINICAL CONSULTATIONS */}
      {/* ========================================================= */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Direct Patient Clinical Inquiries</h3>
              <p className="text-xs text-slate-600 font-bold">Review pre-travel diagnostic questions submitted directly by international patients.</p>
            </div>
          </div>

          {consultations.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Direct Consultation Inquiries Found</h4>
              <p className="text-xs text-slate-700 font-bold">Inquiries routed to your specialty will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {consultations.map((con) => (
                <div key={con._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-mono text-xs font-black text-[#2D3A5E]">Inquiry #{con._id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${con.status === 'Responded' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                        {con.status || 'Pending Review'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">Patient: {con.patientName} ({con.patientEmail})</h4>
                    <p className="text-xs font-black text-[#2D3A5E]">Subject: {con.subject}</p>
                    <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded border border-slate-200 font-semibold">{con.message}</p>

                    {con.doctorResponse && (
                      <div className="bg-emerald-50 p-3 rounded border border-emerald-300 text-xs text-emerald-950 font-semibold">
                        <span className="font-black block text-[10px] uppercase text-emerald-900">Dispatched Response:</span>
                        <p>{con.doctorResponse}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedConsultation(con);
                      setResponseText(con.doctorResponse || '');
                    }}
                    className="w-full py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5 text-[#8FA9FF]" />
                    <span>{con.doctorResponse ? 'Update Response' : 'Dispatch Clinical Advice'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FACULTY DIRECTORY & PROFESSIONAL NETWORK */}
      {/* ========================================================= */}
      {activeTab === 'network' && (
        <div className="space-y-6">

          {/* Duty Status & Availability Control Bar for Logged-in Doctor */}
          <div className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block">My Physician Controls</span>
                <h3 className="text-lg font-black text-slate-900 font-sans">Manage My Availability & OPD Schedule</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">Status:</span>
                <select
                  value={doctorStatus}
                  onChange={(e) => {
                    setDoctorStatus(e.target.value);
                    setStatusMsg(`✅ OPD Duty Status updated to "${e.target.value}"`);
                  }}
                  className="bg-slate-100 border-2 border-slate-300 text-xs font-black text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="Available">Available for Consultations</option>
                  <option value="In Surgery">In Surgery / OT Active</option>
                  <option value="On Leave">On Leave / Travelling</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="text-[10px] font-black text-slate-700 uppercase block mb-1">OPD Consultation Hours</label>
                <input
                  type="text"
                  value={availabilitySchedule}
                  onChange={(e) => setAvailabilitySchedule(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-700 uppercase block mb-1">Affiliated Tertiary Hospital</label>
                <input
                  type="text"
                  value={hospitalAffiliation}
                  onChange={(e) => setHospitalAffiliation(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Directory Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-sans">Senior Medical Faculty & Peer Network Directory</h3>
            <span className="text-xs font-black text-[#2D3A5E]">{doctorsList.length} Board-Certified Specialists</span>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {doctorsList.map((doc) => (
              <div
                key={doc._id}
                className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      onError={handleImageError}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-slate-300 shadow-xs shrink-0 bg-slate-100"
                    />
                    <div className="space-y-1 flex-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300 inline-block">
                        Verified Faculty
                      </span>
                      <h4 className="text-base font-black text-slate-900 font-sans leading-tight">{doc.name}</h4>
                      <p className="text-xs font-black text-[#2D3A5E]">{doc.specialty}</p>
                      <p className="text-[11px] text-slate-700 font-extrabold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{doc.hospitalName || 'Affiliated Medical Center'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Qualifications</span>
                      <span className="font-extrabold text-slate-900">{doc.qualifications}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-black uppercase block">Experience</span>
                      <span className="font-extrabold text-slate-900">{doc.experienceYears} Years Clinical</span>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded border border-slate-200 text-xs font-bold">
                    <span className="text-[10px] text-slate-700 font-black uppercase block">OPD Schedule & Availability</span>
                    <span className="font-extrabold text-[#2D3A5E]">
                      {Array.isArray(doc.availableDays) ? doc.availableDays.join(', ') : 'Mon - Fri (09:00 AM - 04:00 PM)'}
                    </span>
                  </div>
                </div>

                {/* Professional Actions (No Patient Consult/Book buttons) */}
                <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedDoctorModal(doc)}
                    className="px-3.5 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8FA9FF]" />
                    <span>View Profile & Credentials</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SURGICAL PACKAGE TARIFFS & CLINICAL INFORMATION */}
      {/* ========================================================= */}
      {activeTab === 'surgical-tariffs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Surgical Package Information & Provider Tariff Benchmarks</h3>
              <p className="text-xs text-slate-600 font-bold">Informational provider tariff data for clinical planning, hospital stay estimates, and inclusions.</p>
            </div>
            <span className="text-xs font-black text-[#2D3A5E] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
              Provider Reference Data
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {treatmentsList.map((t) => (
              <div
                key={t._id}
                className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                    <div>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-[#2D3A5E] text-[10px] font-black rounded uppercase border border-slate-300">
                        {t.category}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mt-1 font-sans leading-tight">{t.name}</h4>
                    </div>

                    <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 shrink-0">
                      {t.savingsPercentage}% Tariff Benchmark Difference
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {t.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded border border-slate-200 text-center text-xs font-bold">
                    <div>
                      <span className="text-[10px] text-slate-600 font-black uppercase block">Hospital Stay</span>
                      <span className="font-black text-slate-900">{t.durationDays} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 font-black uppercase block">Success Rate</span>
                      <span className="font-black text-emerald-800">{t.successRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 font-black uppercase block">Recovery</span>
                      <span className="font-black text-slate-900">{t.recoveryTime}</span>
                    </div>
                  </div>

                  <div className="bg-[#2D3A5E] text-white p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300">Western Hospital Benchmark:</span>
                      <span className="line-through text-slate-300 font-black">${t.usCostUSD?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-[#1A233D]">
                      <span className="text-[#8FA9FF] font-black">Accredited India Provider Tariff:</span>
                      <span className="text-xl font-black text-white font-mono">${t.estimatedCostUSD?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Informational Action (NO Request Estimate Button) */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Includes surgeon fee, pre-op diagnostics & nursing
                  </span>

                  <button
                    onClick={() => setSelectedPackageModal(t)}
                    className="px-3.5 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition shrink-0"
                  >
                    <Info className="w-3.5 h-3.5 text-[#8FA9FF]" />
                    <span>View Package Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PROFESSIONAL TRAVEL, LANGUAGE & STAY SUPPORT */}
      {/* ========================================================= */}
      {activeTab === 'travel-support' && (
        <div className="space-y-6">

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setTravelSubTab('visa')}
              className={`px-3.5 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${travelSubTab === 'visa' ? 'bg-[#2D3A5E] text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#8FA9FF]" />
              <span>Doctor Travel & Visa Information</span>
            </button>

            <button
              onClick={() => setTravelSubTab('interpreters')}
              className={`px-3.5 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${travelSubTab === 'interpreters' ? 'bg-[#2D3A5E] text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
            >
              <Languages className="w-3.5 h-3.5 text-[#8FA9FF]" />
              <span>Medical Language Support Network</span>
            </button>

            <button
              onClick={() => setTravelSubTab('accommodations')}
              className={`px-3.5 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${travelSubTab === 'accommodations' ? 'bg-[#2D3A5E] text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
            >
              <Hotel className="w-3.5 h-3.5 text-[#8FA9FF]" />
              <span>Doctor Accommodation & Stay Info</span>
            </button>
          </div>

          {/* 5A. Doctor Travel & Visa Information */}
          {travelSubTab === 'visa' && (
            <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider block">Professional Medical Mobility</span>
                <h3 className="text-xl font-black text-slate-900 font-sans">Doctor Conference, Visiting Surgeon & Collaboration Travel Guidelines</h3>
                <p className="text-xs text-slate-700 font-bold">Essential documentation, medical licensing reciprocity, and visa requirements for international faculty visits.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-300 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-[#2D3A5E]" />
                  <h4 className="text-sm font-black text-slate-900">Medical Conference Travel</h4>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed">
                    Documentation checklist for attending international surgical symposiums, keynote presentations, and clinical workshops.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-300 space-y-2">
                  <Award className="w-6 h-6 text-[#2D3A5E]" />
                  <h4 className="text-sm font-black text-slate-900">Visiting Faculty Accreditation</h4>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed">
                    Temporary medical registration requirements with National Medical Commission (NMC) for observer roles & lectures.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-300 space-y-2">
                  <FileText className="w-6 h-6 text-[#2D3A5E]" />
                  <h4 className="text-sm font-black text-slate-900">Professional Travel Checklist</h4>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed">
                    Hospital invitation letter, proof of medical degree validation, malpractice insurance coverage, and business visa format.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5B. Medical Language Support Network */}
          {travelSubTab === 'interpreters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-sans">Clinical Language Support & Interpreter Directory</h3>
                  <p className="text-xs text-slate-600 font-bold">NABL-certified clinical interpreters available to facilitate physician-patient communication.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {translatorsList.map((trans) => (
                  <div key={trans._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4 flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-base font-black text-slate-900 font-sans">{trans.name}</h4>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                          {trans.isCertified ? 'NABL Certified' : 'Verified Clinical'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-900">
                        <p className="text-[#2D3A5E] font-black flex items-center gap-1.5">
                          <Languages className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Languages: {Array.isArray(trans.languagesSpoken) ? trans.languagesSpoken.join(' • ') : 'English, Arabic'}</span>
                        </p>
                        <p className="text-slate-800">Specialization: {trans.specialization || 'Medical & Surgical Terminology'}</p>
                        <p className="text-slate-600 text-[11px]">Locations: {Array.isArray(trans.availableInCities) ? trans.availableInCities.join(', ') : 'All Hubs'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInterpreterModal(trans)}
                        className="px-3.5 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>View Interpreter Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5C. Doctor Accommodation & Professional Stay Info */}
          {travelSubTab === 'accommodations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-sans">Faculty Housing & Professional Stay Options</h3>
                  <p className="text-xs text-slate-600 font-bold">Hospital-adjacent long-stay suites and visiting doctor accommodations.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {accommodationsList.map((acc) => (
                  <div key={acc._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4 flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-sans">{acc.name}</h4>
                        <p className="text-xs text-slate-700 font-bold mt-1">
                          Location: {acc.city} • Near {acc.nearHospital || 'Partner Hospital'} ({acc.distanceKm || 1.2} km)
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-900 font-extrabold">
                        {(acc.amenities || ['Work Desk', 'High-Speed Wi-Fi', '24/7 Concierge']).map((item, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded border border-slate-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAccommodationModal(acc)}
                        className="px-3.5 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>View Accommodation Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: MANAGE PROFESSIONAL PROFILE & CREDENTIALS */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6 max-w-3xl mx-auto shadow-md">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#2D3A5E]" />
              <h3 className="text-xl font-black text-slate-900 font-sans">
                Manage Directory Profile & Credentials
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              Keep your department specialty, medical degrees, consultation schedule, and hospital affiliation up-to-date.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Doctor Name (Registered Account)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.name || 'Dr. Ashok Seth'}
                  className="w-full bg-slate-100 border-2 border-slate-300 text-slate-800 font-extrabold text-xs rounded-lg px-3 py-2.5 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Medical Department / Specialty *</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                  <option value="Organ Transplant">Organ Transplant</option>
                  <option value="Dental Sciences">Dental Sciences</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Medical Qualifications & Degrees *</label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Clinical Experience (Years) *</label>
                <input
                  type="number"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">OPD Consultation Fee USD ($) *</label>
                <input
                  type="number"
                  required
                  value={consultationFeeUSD}
                  onChange={(e) => setConsultationFeeUSD(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Languages Spoken *</label>
                <input
                  type="text"
                  required
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">Affiliated Hospital / Medical Organization</label>
              <input
                type="text"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">Profile Photo URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 bg-[#2D3A5E] text-white font-black text-xs sm:text-sm rounded-lg shadow hover:bg-[#1A233D] transition disabled:opacity-50"
              >
                {isSavingProfile ? 'Saving...' : 'Publish Profile Updates'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Modal 1: Step 4 Case Response */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Step 4 Clinical Clearance for {selectedCase.patientName}</h3>
              <button onClick={() => setSelectedCase(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-1 font-bold">
              <p><span className="text-slate-600">Patient:</span> {selectedCase.patientName} ({selectedCase.patientCountry})</p>
              <p><span className="text-slate-600">Medical Reason:</span> {selectedCase.medicalReason}</p>
            </div>

            <form onSubmit={handleDoctorCompletePipeline} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Doctor Treatment Plan & Pre-Surgical Clearance Notes *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter medical evaluation, pre-op diagnostics, preliminary clinical clearance..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-3 text-xs font-bold text-slate-900 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-900 text-xs font-black rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Issue Preliminary Clinical Clearance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Direct Consultation Response */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Dispatch Clinical Response to {selectedConsultation.patientName}</h3>
              <button onClick={() => setSelectedConsultation(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-1 font-bold">
              <p><span className="text-slate-600">Patient:</span> {selectedConsultation.patientName}</p>
              <p><span className="text-slate-600">Subject:</span> {selectedConsultation.subject}</p>
              <p className="text-slate-800 bg-white p-2 rounded border mt-1">{selectedConsultation.message}</p>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Clinical Response Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter clinical advice, recommended diagnostic tests, or next steps..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-3 text-xs font-bold text-slate-900 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-900 text-xs font-black rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Dispatching...' : 'Dispatch Clinical Advice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View Faculty Member Profile & Credentials */}
      {selectedDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Faculty Credentials Profile</h3>
              <button onClick={() => setSelectedDoctorModal(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="flex items-start gap-4">
              <img
                src={selectedDoctorModal.image}
                alt={selectedDoctorModal.name}
                onError={handleImageError}
                className="w-24 h-24 rounded-xl object-cover border-2 border-slate-300 shrink-0"
              />
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">{selectedDoctorModal.name}</h4>
                <p className="text-xs font-black text-[#2D3A5E]">{selectedDoctorModal.specialty}</p>
                <p className="text-xs text-slate-700 font-bold">{selectedDoctorModal.hospitalName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><span className="text-slate-500">Qualifications:</span> {selectedDoctorModal.qualifications}</p>
              <p><span className="text-slate-500">Clinical Experience:</span> {selectedDoctorModal.experienceYears} Years</p>
              <p><span className="text-slate-500">OPD Consultation Fee:</span> ${selectedDoctorModal.consultationFeeUSD} / ₹{selectedDoctorModal.consultationFeeINR}</p>
              <p><span className="text-slate-500">Languages:</span> {selectedDoctorModal.languagesSpoken?.join(', ')}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: View Surgical Package Details */}
      {selectedPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Surgical Package Specification</h3>
              <button onClick={() => setSelectedPackageModal(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-900">
              <h4 className="text-base font-black text-[#2D3A5E]">{selectedPackageModal.name}</h4>
              <p className="text-slate-800 bg-slate-50 p-3 rounded border">{selectedPackageModal.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <p className="p-2 bg-slate-100 rounded border">Hospital Stay: {selectedPackageModal.durationDays} Days</p>
                <p className="p-2 bg-slate-100 rounded border">Success Rate: {selectedPackageModal.successRate}</p>
              </div>
              <div className="p-3 bg-[#2D3A5E] text-white rounded-xl space-y-1">
                <p className="flex justify-between"><span>India Tariff:</span> <span className="font-mono text-base font-black">${selectedPackageModal.estimatedCostUSD}</span></p>
                <p className="flex justify-between text-slate-300"><span>Western Tariff Benchmark:</span> <span className="line-through font-mono">${selectedPackageModal.usCostUSD}</span></p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPackageModal(null)}
                className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: View Interpreter Details */}
      {selectedInterpreterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Clinical Language Specialist Profile</h3>
              <button onClick={() => setSelectedInterpreterModal(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-900">
              <h4 className="text-base font-black text-[#2D3A5E]">{selectedInterpreterModal.name}</h4>
              <p className="text-slate-700">Certification: {selectedInterpreterModal.isCertified ? 'NABL Certified Clinical Interpreter' : 'Verified Interpreter'}</p>
              <p className="text-slate-700">Specialization: {selectedInterpreterModal.specialization || 'Medical & Surgical Terminology'}</p>
              <p className="text-slate-700">Languages: {Array.isArray(selectedInterpreterModal.languagesSpoken) ? selectedInterpreterModal.languagesSpoken.join(', ') : 'English'}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInterpreterModal(null)}
                className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: View Accommodation Details */}
      {selectedAccommodationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Faculty Stay Details</h3>
              <button onClick={() => setSelectedAccommodationModal(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-900">
              <h4 className="text-base font-black text-[#2D3A5E]">{selectedAccommodationModal.name}</h4>
              <p className="text-slate-700">City: {selectedAccommodationModal.city}</p>
              <p className="text-slate-700">Near Hospital: {selectedAccommodationModal.nearHospital} ({selectedAccommodationModal.distanceKm} km)</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAccommodationModal(null)}
                className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
