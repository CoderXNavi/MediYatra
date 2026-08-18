import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Calculator, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCw,
  Clock,
  Plane,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'tourism' | 'hospitals' | 'doctors' | 'treatments'
  
  const [appointments, setAppointments] = useState([]);
  const [tourismOrders, setTourismOrders] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // Form inputs for new item CRUD
  const [newHospitalName, setNewHospitalName] = useState('');
  const [newHospitalCity, setNewHospitalCity] = useState('New Delhi');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('Cardiology');
  const [newDoctorFee, setNewDoctorFee] = useState(60);

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [hosp, doc, treat, apts, tourRes] = await Promise.all([
        apiService.getHospitals(),
        apiService.getDoctors(),
        apiService.getTreatments(),
        fetch('/api/appointments').then(r => r.ok ? r.json() : null),
        fetch('/api/tourism').then(r => r.ok ? r.json() : null)
      ]);
      setHospitals(hosp || []);
      setDoctors(doc || []);
      setTreatments(treat || []);
      if (apts?.data) setAppointments(apts.data);
      if (tourRes?.data) setTourismOrders(tourRes.data);
    } catch (e) {
      console.warn('Failed loading admin dashboard data:', e);
    }
  }

  async function handleUpdateAppointmentStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setStatusMessage(`Appointment #${id} status updated to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateTourismStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/tourism/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setStatusMessage(`Tourism order #${id} status updated to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddHospital(e) {
    e.preventDefault();
    if (!newHospitalName) return;

    try {
      const res = await fetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHospitalName,
          city: newHospitalCity,
          state: 'NCR',
          country: 'India',
          address: 'Press Enclave Marg, Saket',
          accreditation: ['NABH Certified'],
          establishedYear: 2010,
          beds: 450
        })
      });
      if (res.ok) {
        setStatusMessage(`Hospital "${newHospitalName}" created successfully!`);
        setNewHospitalName('');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddDoctor(e) {
    e.preventDefault();
    if (!newDoctorName) return;

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: hospitals[0]?._id || 'hosp_1',
          name: newDoctorName,
          specialty: newDoctorSpecialty,
          qualifications: 'MBBS, MD, FRCS',
          experienceYears: 18,
          consultationFeeUSD: Number(newDoctorFee)
        })
      });
      if (res.ok) {
        setStatusMessage(`Doctor "${newDoctorName}" created successfully!`);
        setNewDoctorName('');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="bg-[#2D3A5E] text-white rounded-xl p-6 border-2 border-[#8FA9FF] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#8FA9FF]" />
            <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
              System Admin Platform Control Panel
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Global Admin Operations Dashboard
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
            Manage network-wide hospitals, doctors, surgical tariffs, patient appointments, and travel concierge orders.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF] text-xs font-black rounded-lg shadow hover:bg-black flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh System Data</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')} className="p-1"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'appointments', label: `Manage Appointments (${appointments.length})`, icon: Calendar },
          { id: 'tourism', label: `Manage Tourism Orders (${tourismOrders.length})`, icon: Plane },
          { id: 'hospitals', label: 'Manage Hospitals (CRUD)', icon: Building2 },
          { id: 'doctors', label: 'Manage Doctors (CRUD)', icon: UserCheck },
          { id: 'treatments', label: 'Manage Surgical Tariffs', icon: Calculator },
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

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Patient Consultation Requests</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-bold">
                <thead className="bg-[#2D3A5E] text-white uppercase text-[10px] font-black tracking-wider border-b border-[#1A233D]">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-600 font-bold">No appointment requests in database.</td>
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
                            onClick={() => handleUpdateAppointmentStatus(apt._id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt._id, 'Completed')}
                            className="px-2.5 py-1 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-[10px] font-black rounded"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt._id, 'Cancelled')}
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

      {/* Tab 2: Tourism & Travel Concierge Orders (NEW) */}
      {activeTab === 'tourism' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Booked Medical Tourism & Concierge Orders</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-bold">
                <thead className="bg-[#2D3A5E] text-white uppercase text-[10px] font-black tracking-wider border-b border-[#1A233D]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Booked Service</th>
                    <th className="p-3">Details / Phone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tourismOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-600 font-bold">No medical tourism orders recorded.</td>
                    </tr>
                  ) : (
                    tourismOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-black text-[#2D3A5E]">{ord._id}</td>
                        <td className="p-3 font-black text-slate-900">{ord.patientName}<br/><span className="text-[10px] text-slate-600 font-normal">{ord.patientEmail}</span></td>
                        <td className="p-3 font-black text-[#2D3A5E]">{ord.serviceType}</td>
                        <td className="p-3 text-slate-700">{ord.serviceDetails || 'Standard Service'}<br/>{ord.contactPhone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                            ord.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                            ord.status === 'Completed' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                            'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {ord.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateTourismStatus(ord._id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateTourismStatus(ord._id, 'Completed')}
                            className="px-2.5 py-1 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-[10px] font-black rounded"
                          >
                            Complete
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

      {/* Tab 3: Hospitals */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          <form onSubmit={handleAddHospital} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-sans">Add New Accredited Hospital (POST /api/hospitals)</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Hospital Name (e.g. Artemis Health Institute)"
                value={newHospitalName}
                onChange={(e) => setNewHospitalName(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
              <select
                value={newHospitalCity}
                onChange={(e) => setNewHospitalCity(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              >
                <option value="New Delhi">New Delhi</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg hover:bg-[#1A233D] flex items-center gap-1">
              <Plus className="w-4 h-4 text-[#8FA9FF]" /> Add Hospital
            </button>
          </form>

          <div className="grid md:grid-cols-2 gap-4">
            {hospitals.map((h) => (
              <div key={h._id} className="p-4 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-black text-slate-900">{h.name}</h5>
                  <p className="text-xs text-slate-700 font-bold">{h.city}, {h.country || 'India'} • {h.beds || 450} Beds</p>
                </div>
                <span className="text-xs font-mono font-black px-2 py-1 bg-slate-100 rounded border">
                  ID: {h._id}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Doctors */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDoctor} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-sans">Add New Board-Certified Specialist (POST /api/doctors)</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Doctor Name (e.g. Dr. Ramesh Kumar)"
                value={newDoctorName}
                onChange={(e) => setNewDoctorName(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Specialty (e.g. Neurosurgery)"
                value={newDoctorSpecialty}
                onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
              <input
                type="number"
                required
                placeholder="OPD Fee USD ($)"
                value={newDoctorFee}
                onChange={(e) => setNewDoctorFee(e.target.value)}
                className="border-2 border-slate-300 rounded-lg p-2 text-xs font-black text-slate-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#2D3A5E] text-white text-xs font-black rounded-lg hover:bg-[#1A233D] flex items-center gap-1">
              <Plus className="w-4 h-4 text-[#8FA9FF]" /> Register Specialist
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

      {/* Tab 5: Treatments */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Active Surgical Tariffs</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {treatments.map((t) => (
              <div key={t._id} className="p-4 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-black text-slate-900">{t.name}</h5>
                  <p className="text-xs text-slate-700 font-bold">{t.category} • India: ${t.estimatedCostUSD} vs US: ${t.usCostUSD}</p>
                </div>
                <span className="text-xs font-black px-2 py-1 bg-emerald-100 text-emerald-950 rounded border border-emerald-300">
                  {t.savingsPercentage}% SAVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
