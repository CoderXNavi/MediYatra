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
  Edit3
} from 'lucide-react';

export default function DoctorPortal({ currentUser }) {
  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'profile'
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    loadDoctorConsultations();
  }, [currentUser]);

  async function loadDoctorConsultations() {
    setIsLoading(true);
    try {
      const docName = currentUser?.name || '';
      const docId = currentUser?.doctorId || currentUser?._id;
      
      const params = new URLSearchParams();
      if (docName) params.append('doctorName', docName);
      if (docId) params.append('doctorId', docId);

      const response = await fetch(`/api/consultations?${params.toString()}`);
      if (response.ok) {
        const json = await response.json();
        const list = json.data || [];
        if (list.length > 0) {
          setConsultations(list);
          return;
        }
      }

      // Fallback query all consultations if initial query returned empty
      const resAll = await fetch('/api/consultations');
      if (resAll.ok) {
        const jsonAll = await resAll.json();
        setConsultations(jsonAll.data || []);
      }
    } catch (err) {
      console.warn('Error loading doctor consultations:', err);
    } finally {
      setIsLoading(false);
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
        loadDoctorConsultations();
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
        setActiveTab('cases');
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
              Senior Specialist Clinical Portal • {currentUser?.name || 'Dr. Naresh Trehan'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Doctor Clinical Desk & Profile Manager
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
            Manage incoming patient consultation cases and update your specialist profile on the main website directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 text-xs font-black rounded-lg border-2 transition ${
              activeTab === 'cases'
                ? 'bg-[#8FA9FF] text-[#2D3A5E] border-[#8FA9FF]'
                : 'bg-[#1A233D] text-white border-slate-600 hover:border-[#8FA9FF]'
            }`}
          >
            Consultation Queue ({consultations.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-black rounded-lg border-2 transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#8FA9FF] text-[#2D3A5E] border-[#8FA9FF]'
                : 'bg-[#1A233D] text-white border-slate-600 hover:border-[#8FA9FF]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Complete My Directory Profile</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="p-1 font-mono">X</button>
        </div>
      )}

      {/* View 1: Consultation Queue */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-sans">Incoming Patient Consultations</h3>
            <button
              onClick={loadDoctorConsultations}
              className="px-3.5 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8FA9FF]" />
              <span>Refresh Queue</span>
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-bold">Loading incoming consultation requests...</div>
          ) : consultations.length === 0 ? (
            <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No Consultations in Queue</h4>
              <p className="text-xs text-slate-700 font-bold">New consultation requests submitted by patients will appear here in real-time.</p>
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
                          Case ID: {con._id}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded border ${
                          isResponded ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          {con.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-slate-900">
                        <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-[#2D3A5E]" />
                          <span>Patient: {con.patientName}</span>
                        </p>
                        <p className="text-slate-700 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#2D3A5E]" />
                          <span>Email: {con.patientEmail} • Country: {con.patientCountry}</span>
                        </p>
                        <p className="text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2D3A5E]" />
                          <span>Preferred Date: {new Date(con.preferredDate).toLocaleDateString()}</span>
                        </p>
                        {con.doctorName && (
                          <p className="text-[#2D3A5E] font-black text-xs">
                            Doctor: {con.doctorName}
                          </p>
                        )}
                      </div>

                      <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900">
                        <span className="text-[10px] font-black uppercase text-[#2D3A5E] block mb-1">Subject / Symptoms:</span>
                        <p className="font-black text-slate-900 mb-1">{con.subject}</p>
                        <p className="text-slate-800 leading-relaxed">{con.message}</p>
                      </div>

                      {con.doctorResponse && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-300 text-xs font-semibold text-emerald-950">
                          <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">Your Doctor Response:</span>
                          <p>{con.doctorResponse}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setSelectedConsultation(con);
                          setResponseText(con.doctorResponse || '');
                        }}
                        className="w-full py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        <span>{isResponded ? 'Update Clinical Response' : 'Respond to Patient'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 2: Profile Form */}
      {activeTab === 'profile' && (
        <div className="portal-card p-8 bg-white border-2 border-slate-300 rounded-xl space-y-6 max-w-3xl mx-auto shadow-md">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#2D3A5E]" />
              <h3 className="text-xl font-black text-slate-900 font-sans">
                Complete & Customize Directory Profile
              </h3>
            </div>
            <p className="text-xs text-slate-700 font-bold">
              Update your department specialty, medical degrees, OPD fees, and profile photo so patients can view your profile on the main page directory.
            </p>
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
                  <option value="Organ Transplant">Organ Transplant</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Dental Sciences">Dental Sciences</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Urology">Urology</option>
                  <option value="Paediatrics">Paediatrics</option>
                  <option value="General Medicine & Senior Specialist">General Medicine & Senior Specialist</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Medical Qualifications & Degrees *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MD, DM (Cardiology), FACC"
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
                  min={1}
                  max={60}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">OPD Consultation Fee (USD $) *</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={1000}
                  value={consultationFeeUSD}
                  onChange={(e) => setConsultationFeeUSD(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Languages Spoken (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="English, Hindi, Punjabi, Arabic"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">Profile Photo Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg px-3 py-2.5 focus:border-[#8FA9FF] focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('cases')}
                className="px-4 py-2.5 bg-slate-200 text-slate-900 text-xs font-black rounded-lg"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow disabled:opacity-50 transition"
              >
                {isSavingProfile ? 'Saving & Publishing...' : 'Publish Profile to Directory'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Response Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 font-sans">Respond to {selectedConsultation.patientName}</h3>
              <button onClick={() => setSelectedConsultation(null)} className="p-1 font-mono">X</button>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-1 font-bold">
              <p><span className="text-slate-600">Patient:</span> {selectedConsultation.patientName} ({selectedConsultation.patientEmail})</p>
              <p><span className="text-slate-600">Subject:</span> {selectedConsultation.subject}</p>
              <p className="text-slate-800 font-semibold">{selectedConsultation.message}</p>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1">Doctor Clinical Response & Treatment Advice *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter medical evaluation, recommended diagnostic tests, or preliminary treatment plan..."
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
                  {isSubmitting ? 'Sending Response...' : 'Submit Doctor Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
