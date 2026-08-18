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
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Activity,
  Send,
  Edit3,
  MessageSquare,
  HeartHandshake,
  Download
} from 'lucide-react';
import { apiService } from '../services/api';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'hospitals' | 'doctors' | 'appointments' | 'consultations' | 'tourism' | 'treatments' | 'charity'
  
  // Real Database Analytics Metrics
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalHospitals: 0,
    totalAppointments: 0,
    totalConsultations: 0,
    pendingRequests: 0
  });

  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [tourismOrders, setTourismOrders] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form inputs for Management CRUD
  const [newHospitalName, setNewHospitalName] = useState('');
  const [newHospitalCity, setNewHospitalCity] = useState('New Delhi');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('Cardiology');
  const [newDoctorFee, setNewDoctorFee] = useState(60);

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setIsLoading(true);
    try {
      const authHeader = {
        headers: {
          'Authorization': `Bearer ${currentUser?.token || ''}`,
          'x-auth-token': currentUser?.token || ''
        }
      };

      const [statsRes, usersRes, hospList, docList, treatList, aptsRes, conRes, tourRes, ngoRes, eqRes] = await Promise.all([
        fetch('/api/admin/stats', authHeader).then(r => r.ok ? r.json() : null),
        fetch('/api/admin/users', authHeader).then(r => r.ok ? r.json() : null),
        apiService.getHospitals(),
        apiService.getDoctors(),
        apiService.getTreatments(),
        fetch('/api/appointments').then(r => r.ok ? r.json() : null),
        fetch('/api/consultations').then(r => r.ok ? r.json() : null),
        fetch('/api/tourism').then(r => r.ok ? r.json() : null),
        fetch('/api/ngo').then(r => r.ok ? r.json() : null),
        fetch('/api/equipment').then(r => r.ok ? r.json() : null)
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
      setHospitals(hospList || []);
      setDoctors(docList || []);
      setTreatments(treatList || []);
      if (aptsRes?.data) setAppointments(aptsRes.data);
      if (conRes?.data) setConsultations(conRes.data);
      if (tourRes?.data) setTourismOrders(tourRes.data);
      if (ngoRes?.data) setNgos(ngoRes.data);
      if (eqRes?.data) setEquipmentList(eqRes.data);
    } catch (e) {
      console.warn('Failed loading admin management data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token || ''}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setStatusMessage(`User account status updated to ${newStatus}`);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleVerifyNGO(ngoId) {
    try {
      const res = await fetch(`/api/ngo/${ngoId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${currentUser?.token || ''}`
        }
      });
      if (res.ok) {
        setStatusMessage(`NGO Foundation verified successfully!`);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
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
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDispatchTourismByAdmin(id) {
    try {
      const res = await fetch(`/api/tourism/${id}/admin-dispatch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminLogisticsNotes: 'Certified Translator assigned, Serviced Suite reserved, Airport Driver scheduled.'
        })
      });
      if (res.ok) {
        setStatusMessage(`Travel logistics dispatched for Order #${id}`);
        loadAdminData();
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
        setStatusMessage(`Hospital "${newHospitalName}" added to system directory!`);
        setNewHospitalName('');
        loadAdminData();
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
        setStatusMessage(`Specialist "${newDoctorName}" added to system directory!`);
        setNewDoctorName('');
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Platform Management Header Banner */}
      <div className="bg-[#2D3A5E] text-white rounded-xl p-6 border-2 border-[#8FA9FF] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#8FA9FF]" />
            <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
              MediYatra Platform Management Suite • {currentUser?.name || 'System Admin'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Admin System Operations & Analytics Dashboard
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
            Real-time MongoDB metrics, user account management, hospital & doctor CRUD controls, and logistics dispatch.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF] text-xs font-black rounded-lg shadow hover:bg-black flex items-center gap-1.5 shrink-0 font-sans"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Real DB Metrics</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')} className="p-1 font-mono">X</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
          { id: 'users', label: `User Management (${users.length})`, icon: Users },
          { id: 'hospitals', label: `Hospitals (${hospitals.length})`, icon: Building2 },
          { id: 'doctors', label: `Doctors (${doctors.length})`, icon: UserCheck },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'consultations', label: `Consultations (${consultations.length})`, icon: MessageSquare },
          { id: 'tourism', label: `Logistics Orders (${tourismOrders.length})`, icon: Plane },
          { id: 'charity', label: `NGO & Charity Aid (${ngos.length})`, icon: HeartHandshake },
          { id: 'treatments', label: 'Surgical Tariffs', icon: Calculator },
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

      {/* Tab 1: Platform Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 font-sans">Real-Time MongoDB Platform Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 font-bold text-xs">
            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 shadow-sm space-y-1">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Total Patients</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalPatients}</span>
            </div>
            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 shadow-sm space-y-1">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Total Doctors</span>
              <span className="text-2xl font-black text-[#2D3A5E] font-mono">{stats.totalDoctors}</span>
            </div>
            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 shadow-sm space-y-1">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Total Hospitals</span>
              <span className="text-2xl font-black text-[#2D3A5E] font-mono">{stats.totalHospitals}</span>
            </div>
            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 shadow-sm space-y-1">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Total Appointments</span>
              <span className="text-2xl font-black text-blue-700 font-mono">{stats.totalAppointments}</span>
            </div>
            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 shadow-sm space-y-1">
              <span className="text-slate-600 block text-[10px] uppercase font-black">Registered NGOs</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">{ngos.length}</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-300 shadow-sm space-y-1">
              <span className="text-amber-900 block text-[10px] uppercase font-black">Donated Aid Items</span>
              <span className="text-2xl font-black text-amber-950 font-mono">{equipmentList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Account Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">User Account Management & Role Status</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-bold">
                <thead className="bg-[#2D3A5E] text-white uppercase text-[10px] font-black tracking-wider border-b border-[#1A233D]">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-black text-[#2D3A5E]">{u._id}</td>
                      <td className="p-3 font-black text-slate-900">{u.name}</td>
                      <td className="p-3 font-mono text-slate-800">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                          u.role === 'Admin' ? 'bg-purple-100 text-purple-950 border-purple-300' :
                          u.role === 'Doctor' ? 'bg-blue-100 text-blue-950 border-blue-300' :
                          u.role === 'Hospital' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                          'bg-slate-100 text-slate-900 border-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                          u.status === 'Deactivated' ? 'bg-red-100 text-red-950 border-red-300' : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status || 'Active')}
                          className={`px-3 py-1 text-[10px] font-black rounded text-white ${
                            u.status === 'Deactivated' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-700 hover:bg-red-800'
                          }`}
                        >
                          {u.status === 'Deactivated' ? 'Activate Account' : 'Deactivate Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: NGO & Charity Aid Management */}
      {activeTab === 'charity' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 font-sans">Verified Health NGO Partners & Donated Aid Approval</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ngos.map((n) => (
              <div key={n._id} className="p-4 bg-white border-2 border-slate-300 rounded-xl space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between border-b pb-2">
                  <h5 className="text-sm font-black text-slate-900">{n.name}</h5>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                    n.isVerifiedByAdmin ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}>
                    {n.isVerifiedByAdmin ? 'Verified NGO' : 'Pending Verification'}
                  </span>
                </div>
                <p>Focus: <span className="text-[#2D3A5E] font-black">{n.focusArea}</span> ({n.city})</p>
                <p className="text-slate-700">{n.description}</p>
                {!n.isVerifiedByAdmin && (
                  <button
                    onClick={() => handleVerifyNGO(n._id)}
                    className="mt-2 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                  >
                    Verify NGO Listing
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Management CRUD */}
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
              <Plus className="w-4 h-4 text-[#8FA9FF]" /> Register Hospital Entry
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

      {/* Tab 4: Doctor Management CRUD */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDoctor} className="portal-card p-5 bg-white border-2 border-slate-300 rounded-xl space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-sans">Add Board-Certified Specialist (POST /api/doctors)</h4>
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
              <Plus className="w-4 h-4 text-[#8FA9FF]" /> Register Specialist Entry
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

      {/* Tab 5: Appointment Management */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">All Patient Consultation Appointments</h3>
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
                    <th className="p-3 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-600 font-bold">No appointment records in database.</td>
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
                        <td className="p-3 text-right space-x-1 flex items-center justify-end">
                          <button
                            onClick={() => {
                              generateOfficialPDFReceipt({
                                documentType: 'ADMIN VERIFIED APPOINTMENT VOUCHER',
                                referenceNo: apt.bookingReference || apt._id,
                                date: new Date(apt.preferredDate).toLocaleDateString(),
                                patientName: apt.patientName,
                                patientEmail: apt.patientEmail,
                                patientPhone: apt.patientPhone,
                                doctorName: apt.doctorId?.name || apt.doctorName || 'Senior Specialist',
                                doctorSpecialty: apt.doctorId?.specialty || 'Department Speciality',
                                hospitalName: apt.hospitalId?.name || apt.hospitalName || 'Accredited Partner Hospital',
                                hospitalCity: 'New Delhi',
                                amountPaid: 'VERIFIED BY ADMIN',
                                status: apt.status || 'Confirmed',
                                details: [
                                  { label: 'Booking Reference ID', value: apt.bookingReference || apt._id },
                                  { label: 'Patient Country of Residence', value: apt.patientCountry || 'International' },
                                  { label: 'Hospital Registration Clearance', value: 'APPROVED BY ADMIN' }
                                ],
                                notes: `Medical Reason: ${apt.medicalNotes || apt.medicalReason || 'General Consultation'}\n\nOfficial PDF Voucher verified by MEDIYATRA Platform Administration Desk.`
                              });
                            }}
                            className="px-2 py-1 bg-[#2D3A5E] text-white text-[10px] font-black rounded hover:bg-[#1A233D] flex items-center gap-1"
                            title="Download PDF Receipt"
                          >
                            <Download className="w-3 h-3 text-[#8FA9FF]" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt._id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt._id, 'Completed')}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-black rounded"
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

      {/* Tab 6: Consultation Management */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">All Patient-Doctor Consultations Workflow Monitor</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {consultations.map((con) => (
              <div key={con._id} className="p-5 bg-white border-2 border-slate-300 rounded-xl space-y-2 font-bold text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono font-black text-[#2D3A5E]">ID: {con._id}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded border">{con.status}</span>
                </div>
                <p>Patient: <span className="text-slate-900 font-black">{con.patientName}</span> ({con.patientEmail})</p>
                <p>Doctor: <span className="text-[#2D3A5E] font-black">{con.doctorName}</span></p>
                <p className="text-slate-700">Subject: {con.subject}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Travel Logistics Orders */}
      {activeTab === 'tourism' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Medical Tourism Logistics & Concierge Dispatch</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-bold">
                <thead className="bg-[#2D3A5E] text-white uppercase text-[10px] font-black tracking-wider border-b border-[#1A233D]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Service Requested</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Step 3 Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tourismOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-black text-[#2D3A5E]">{ord._id}</td>
                      <td className="p-3 font-black text-slate-900">{ord.patientName}<br/><span className="text-[10px] text-slate-600 font-normal">{ord.patientEmail}</span></td>
                      <td className="p-3 font-black text-[#2D3A5E]">{ord.serviceType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${
                          ord.status === 'Dispatched by Admin' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-purple-100 text-purple-950 border-purple-300'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            generateOfficialPDFReceipt({
                              documentType: ord.serviceType.toUpperCase(),
                              referenceNo: ord._id,
                              date: new Date(ord.createdAt || Date.now()).toLocaleDateString(),
                              patientName: ord.patientName,
                              patientEmail: ord.patientEmail,
                              patientPhone: ord.patientPhone,
                              doctorName: ord.doctorName || 'Senior Specialist',
                              doctorSpecialty: 'Medical Tourism Concierge',
                              hospitalName: ord.hospitalName || 'Accredited Partner Hospital',
                              hospitalCity: 'New Delhi',
                              amountPaid: 'DISPATCHED BY ADMIN',
                              status: ord.status,
                              details: [
                                { label: `Logistics Service: ${ord.serviceType}`, value: 'DISPATCHED' },
                                { label: 'Patient Residence Country', value: ord.patientCountry || 'International' },
                                { label: 'Step 3 Admin Logistics Clearance', value: 'APPROVED' }
                              ],
                              notes: `Logistics Notes: ${ord.adminLogisticsNotes || 'Logistics dispatched by Admin'}\n\nOfficial PDF Voucher verified by MEDIYATRA Medical Tourism Desk.`
                            });
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-emerald-200" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => handleDispatchTourismByAdmin(ord._id)}
                          className="px-3.5 py-1.5 bg-[#2D3A5E] text-white text-[10px] font-black rounded-lg shadow"
                        >
                          Dispatch Logistics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Surgical Package Tariffs */}
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
