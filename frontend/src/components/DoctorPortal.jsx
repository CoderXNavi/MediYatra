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
  Plane
} from 'lucide-react';

export default function DoctorPortal({ currentUser }) {
  const [activeTab, setActiveTab] = useState('pipeline-cases'); // 'pipeline-cases' | 'consultations' | 'profile'
  const [tourismPipelineCases, setTourismPipelineCases] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Edit Form State
  const [specialty, setSpecialty] = useState('Cardiology');
  const [qualifications, setQualifications] = useState('MBBS, MD, DM (Cardiology)');
  const [experienceYears, setExperienceYears] = useState(15);
  const [consultationFeeUSD, setConsultationFeeUSD] = useState(50);
  const [languages, setLanguages] = useState('English, Hindi');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    loadDoctorData();
  }, [currentUser]);

  async function loadDoctorData() {
    setIsLoading(true);
    try {
      const docName = currentUser?.name || '';
      const docId = currentUser?.doctorId || currentUser?._id;

      const [conRes, tourRes] = await Promise.all([
        fetch(`/api/consultations?doctorName=${encodeURIComponent(docName)}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/tourism?doctorName=${encodeURIComponent(docName)}`).then(r => r.ok ? r.json() : null)
      ]);

      if (conRes?.data) setConsultations(conRes.data);
      if (tourRes?.data) setTourismPipelineCases(tourRes.data);
    } catch (err) {
      console.warn('Error loading doctor data:', err);
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
        setStatusMsg(`✅ Step 4 Complete: Clinical advice issued for Patient ${selectedCase.patientName}!`);
        setSelectedCase(null);
        setResponseText('');
        loadDoctorData();
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
        setStatusMsg(`Clinical response dispatched for consultation #${selectedConsultation._id}`);
        setSelectedConsultation(null);
        setResponseText('');
        loadDoctorData();
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
          imageUrl
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMsg(`✅ Doctor profile for ${currentUser?.name} updated! Your profile is live on the Find Doctors main directory.`);
        setActiveTab('pipeline-cases');
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setStatusMsg(`❌ Error: ${err.message}`);
    } finally {
      setIsSavingProfile(false);
    }
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Doctor Desk Header Banner */}
      <div className="bg-[#2D3A5E] text-white rounded-xl p-6 border-2 border-[#8FA9FF] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-5 h-5 text-[#8FA9FF]" />
            <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
              Step 4 Clinical Desk • {currentUser?.name || 'Dr. Naresh Trehan'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Doctor Desk: Step 4 Clinical Evaluation
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
            Review hospital-approved & admin-dispatched international cases, issue clinical treatment advice, and customize directory profile.
          </p>
        </div>

        <button
          onClick={loadDoctorData}
          className="px-4 py-2 bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF] text-xs font-black rounded-lg shadow hover:bg-black flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="p-1 font-mono">X</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pipeline-cases')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${
            activeTab === 'pipeline-cases' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E]' : 'bg-white text-slate-900 border-slate-300'
          }`}
        >
          <Plane className="w-4 h-4 text-[#8FA9FF]" />
          <span>Step 4: Ready for Treatment Cases ({tourismPipelineCases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${
            activeTab === 'consultations' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E]' : 'bg-white text-slate-900 border-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#8FA9FF]" />
          <span>Direct Patient Consultations ({consultations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'bg-[#2D3A5E] text-white border-[#2D3A5E]' : 'bg-white text-slate-900 border-slate-300'
          }`}
        >
          <Edit3 className="w-4 h-4 text-[#8FA9FF]" />
          <span>Complete My Directory Profile</span>
        </button>
      </div>

      {/* View 1: Step 4 Pipeline Cases */}
      {activeTab === 'pipeline-cases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-sans">Step 4: Dispatched International Cases Awaiting Clinical Advice</h3>
            <span className="text-xs font-black text-[#2D3A5E]">Assigned Doctor: {currentUser?.name || 'Dr. Naresh Trehan'}</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-bold">Loading clinical cases...</div>
          ) : tourismPipelineCases.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <Plane className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Dispatched Cases Pending Clinical Evaluation</h4>
              <p className="text-xs text-slate-700 font-bold">Cases dispatched by Admin Logistics will automatically land here for clinical advice.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tourismPipelineCases.map((cas) => {
                const isCompleted = cas.status === 'Completed';

                return (
                  <div key={cas._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-mono text-xs font-black text-[#2D3A5E]">Pipeline Ref: {cas._id}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${
                          isCompleted ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-blue-100 text-blue-950 border-blue-300'
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
                          <span className="font-black block text-[10px] uppercase text-emerald-900">Your Clinical Response:</span>
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
                        className="w-full py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>{isCompleted ? 'Update Treatment Advice' : 'Issue Clinical Advice & Complete Case'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 2: Direct Consultations */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 font-sans font-bold">Direct Patient Consultations</h3>
          
          {consultations.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Direct Consultation Requests</h4>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {consultations.map((con) => (
                <div key={con._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-3">
                  <h4 className="text-sm font-black text-slate-900">Patient: {con.patientName}</h4>
                  <p className="text-xs font-bold text-slate-700">{con.subject}</p>
                  <p className="text-xs text-slate-800 bg-slate-100 p-2.5 rounded border">{con.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View 3: Profile Form */}
      {activeTab === 'profile' && (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6 max-w-3xl mx-auto shadow-md">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#2D3A5E]" />
              <h3 className="text-xl font-black text-slate-900 font-sans">
                Complete & Customize Directory Profile
              </h3>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Doctor Name (Registered)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.name || 'Dr. Naresh Trehan'}
                  className="w-full bg-slate-100 border-2 border-slate-300 text-slate-800 font-extrabold text-xs rounded-lg px-3 py-2.5 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Clinical Department / Specialty *</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 bg-[#2D3A5E] text-white font-black text-xs sm:text-sm rounded-lg shadow"
              >
                {isSavingProfile ? 'Saving...' : 'Publish Profile to Directory'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctor Case Response Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Step 4 Clinical Response for {selectedCase.patientName}</h3>
              <button onClick={() => setSelectedCase(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-1 font-bold">
              <p><span className="text-slate-600">Patient:</span> {selectedCase.patientName} ({selectedCase.patientCountry})</p>
              <p><span className="text-slate-600">Medical Reason:</span> {selectedCase.medicalReason}</p>
            </div>

            <form onSubmit={handleDoctorCompletePipeline} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Doctor Treatment Plan & Pre-Surgical Advice *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter medical evaluation, pre-op instructions, diagnostic recommendations..."
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
                  {isSubmitting ? 'Sending...' : 'Complete Step 4 Clinical Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
