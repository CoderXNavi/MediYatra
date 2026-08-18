import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserCheck, 
  Calendar, 
  Plus, 
  Check, 
  X, 
  RefreshCw,
  Bed,
  ShieldCheck,
  Award,
  Clock
} from 'lucide-react';
import { apiService } from '../services/api';

export default function HospitalPortal({ currentUser }) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'doctors' | 'facilities'
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  // New Doctor Form State for this Hospital
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiology');
  const [docFeeUSD, setDocFeeUSD] = useState(50);
  const [docExperience, setDocExperience] = useState(15);
  const [docQualifications, setDocQualifications] = useState('MBBS, MD');

  useEffect(() => {
    loadHospitalData();
  }, [currentUser]);

  async function loadHospitalData() {
    setIsLoading(true);
    try {
      const [docList, aptsRes] = await Promise.all([
        apiService.getDoctors(),
        fetch('/api/appointments').then(r => r.ok ? r.json() : null)
      ]);

      setDoctors(docList || []);
      if (aptsRes?.data) setAppointments(aptsRes.data);
    } catch (err) {
      console.warn('Error loading hospital provider data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmAppointment(id, newStatus) {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setStatusMsg(`✅ Hospital appointment #${id} status updated to ${newStatus}`);
        loadHospitalData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddDoctorToHospital(e) {
    e.preventDefault();
    if (!docName) return;

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
          name: docName,
          specialty: docSpecialty,
          qualifications: docQualifications,
          experienceYears: Number(docExperience),
          consultationFeeUSD: Number(docFeeUSD)
        })
      });

      if (res.ok) {
        setStatusMsg(`✅ Specialist "${docName}" added to hospital medical roster!`);
        setDocName('');
        loadHospitalData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hospital Provider Banner */}
      <div className="bg-[#2D3A5E] text-white rounded-xl p-6 border-2 border-[#8FA9FF] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#8FA9FF]" />
            <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
              Partner Hospital Operations Desk • {currentUser?.name || 'Max Healthcare Admin'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Hospital Provider Desk & Medical Roster
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
            Manage hospital medical staff, confirm patient appointment requests, and oversee clinical bed facilities.
          </p>
        </div>

        <button
          onClick={loadHospitalData}
          className="px-4 py-2 bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF] text-xs font-black rounded-lg shadow hover:bg-black flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Desk</span>
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
        {[
          { id: 'appointments', label: `Hospital Appointments (${appointments.length})`, icon: Calendar },
          { id: 'doctors', label: `Hospital Doctor Roster (${doctors.length})`, icon: UserCheck },
          { id: 'facilities', label: 'Hospital Facilities & Bed Management', icon: Bed },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* 1. Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Patient Consultation Requests for Hospital</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-bold">
                <thead className="bg-[#2D3A5E] text-white uppercase text-[10px] font-black tracking-wider border-b border-[#1A233D]">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Preferred Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-600 font-bold">No hospital appointments recorded.</td>
                    </tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-black text-[#2D3A5E]">{apt.bookingReference || apt._id}</td>
                        <td className="p-3 font-black text-slate-900">{apt.patientName}</td>
                        <td className="p-3 text-slate-700">{apt.patientEmail}<br/>{apt.patientPhone}</td>
                        <td className="p-3 font-mono text-slate-900">{new Date(apt.preferredDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                            apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                            apt.status === 'Completed' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                            apt.status === 'Cancelled' ? 'bg-red-100 text-red-950 border-red-300' :
                            'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {apt.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleConfirmAppointment(apt._id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleConfirmAppointment(apt._id, 'Completed')}
                            className="px-2.5 py-1 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-[10px] font-black rounded"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleConfirmAppointment(apt._id, 'Cancelled')}
                            className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white text-[10px] font-black rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Doctor Roster */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDoctorToHospital} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-sans">Add Specialist Doctor to Hospital Roster</h4>
            <div className="grid sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Doctor Name (e.g. Dr. Kavita Sharma)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
              <select
                value={docSpecialty}
                onChange={(e) => setDocSpecialty(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurosurgery">Neurosurgery</option>
                <option value="Orthopaedics">Orthopaedics</option>
                <option value="Paediatrics">Paediatrics</option>
              </select>
              <input
                type="text"
                required
                placeholder="Qualifications (e.g. MBBS, MD, DM)"
                value={docQualifications}
                onChange={(e) => setDocQualifications(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
              <input
                type="number"
                required
                placeholder="OPD Fee USD ($)"
                value={docFeeUSD}
                onChange={(e) => setDocFeeUSD(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg hover:bg-[#1A233D] flex items-center gap-1">
              <Plus className="w-4 h-4 text-[#8FA9FF]" /> Register Specialist to Roster
            </button>
          </form>

          <div className="grid md:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <div key={d._id} className="p-4 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-black text-slate-900">{d.name}</h5>
                  <p className="text-xs text-slate-700 font-bold">{d.specialty} • ${d.consultationFeeUSD} OPD Fee</p>
                </div>
                <span className="text-xs font-mono font-black px-2 py-1 bg-slate-100 rounded border">
                  ID: {d._id}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Facilities */}
      {activeTab === 'facilities' && (
        <div className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Hospital Facilities & Bed Capacity</h3>
          <div className="grid sm:grid-cols-3 gap-4 font-bold text-xs">
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Total Inpatient Beds</span>
              <span className="text-2xl font-black text-slate-900 font-mono">450 Beds</span>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300">
              <span className="text-slate-600 block text-[10px] uppercase font-black">ICU & Critical Care Units</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">85 Units</span>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300">
              <span className="text-slate-600 block text-[10px] uppercase font-black">International Patient Lounges</span>
              <span className="text-2xl font-black text-[#2D3A5E] font-mono">3 VIP Suites</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
