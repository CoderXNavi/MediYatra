import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Pill, 
  CheckCircle2, 
  Building2, 
  Search, 
  PlusCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  UserCheck, 
  X, 
  Lock,
  User,
  Info,
  Check,
  PackageCheck
} from 'lucide-react';
import { fuzzySearchMatch } from '../utils/fuzzySearch';

export default function CharityAidHub({ currentUser, onOpenAuth }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [ngoList, setNgoList] = useState([]);
  const [patientRequests, setPatientRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusNotice, setStatusNotice] = useState('');

  // Modals state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItemForRequest, setSelectedItemForRequest] = useState(null);

  // Form states
  const [donateName, setDonateName] = useState('');
  const [donateCategory, setDonateCategory] = useState('Medicines');
  const [donateQty, setDonateQty] = useState(1);
  const [donateCity, setDonateCity] = useState('New Delhi');
  const [donateDesc, setDonateDesc] = useState('');

  const [reqPatientName, setReqPatientName] = useState(currentUser?.name || '');
  const [reqPatientEmail, setReqPatientEmail] = useState(currentUser?.email || '');
  const [reqPatientPhone, setReqPatientPhone] = useState('');
  const [reqCity, setReqCity] = useState('New Delhi');
  const [reqItemName, setReqItemName] = useState('');
  const [reqCategory, setReqCategory] = useState('Medicines');
  const [reqReason, setReqReason] = useState('');

  const isPatient = !currentUser || currentUser?.role === 'Patient';
  const isDoctor = currentUser?.role === 'Doctor';
  const isHospital = currentUser?.role === 'Hospital';
  const isNGO = currentUser?.role === 'NGO';
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    loadCharityData();
  }, [currentUser]);

  async function loadCharityData() {
    setIsLoading(true);
    try {
      const [eqRes, ngoRes, reqRes] = await Promise.all([
        fetch('/api/equipment').then(r => r.ok ? r.json() : null),
        fetch('/api/ngo').then(r => r.ok ? r.json() : null),
        fetch('/api/ngo/requests').then(r => r.ok ? r.json() : null)
      ]);

      if (eqRes?.data) setEquipmentList(eqRes.data);
      if (ngoRes?.data) setNgoList(ngoRes.data);
      if (reqRes?.data) setPatientRequests(reqRes.data);
    } catch (e) {
      console.warn('Error loading charity hub data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDonateSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: donateName,
          category: donateCategory,
          quantity: Number(donateQty),
          city: donateCity,
          donorName: currentUser.name || 'Healthcare Donor',
          donorEmail: currentUser.email,
          description: donateDesc
        })
      });

      if (res.ok) {
        setStatusNotice(`✅ Thank you! Surplus ${donateCategory} listing submitted successfully.`);
        setShowDonateModal(false);
        setDonateName('');
        setDonateDesc('');
        loadCharityData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAidRequestSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      const res = await fetch('/api/ngo/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: reqPatientName || currentUser.name,
          patientEmail: reqPatientEmail || currentUser.email,
          patientPhone: reqPatientPhone,
          city: reqCity,
          requestedCategory: reqCategory,
          requestedItemName: reqItemName,
          medicalReason: reqReason
        })
      });

      if (res.ok) {
        setStatusNotice(`✅ Aid Request for "${reqItemName}" submitted to NGO Partners desk!`);
        setShowRequestModal(false);
        setSelectedItemForItem(null);
        setReqReason('');
        loadCharityData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateNGOStatus(requestId, newStatus) {
    try {
      const res = await fetch(`/api/ngo/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ngoNotes: `Dispatched by NGO Representative (${new Date().toLocaleDateString()})`
        })
      });

      if (res.ok) {
        setStatusNotice(`✅ Request #${requestId} marked as "${newStatus}"!`);
        loadCharityData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filteredEquipment = equipmentList.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = fuzzySearchMatch(
      { 
        name: item.name, 
        city: item.city, 
        description: item.description, 
        category: item.category, 
        donorName: item.donorName 
      },
      searchQuery
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Visual Hero Banner for Donor & Charity Aid Page */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#8FA9FF] mb-8 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1600"
          alt="Charity Healthcare & Aid Distribution"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A5E] via-[#2D3A5E]/70 to-transparent" />
        
        <div className="relative p-6 sm:p-8 text-white space-y-2 z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
              Humanitarian Healthcare Aid
            </span>
            <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
              Verified NGO Partners
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight drop-shadow-md">
            Surplus Medicine & Medical Equipment Aid Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold drop-shadow max-w-2xl leading-relaxed">
            Connecting donors, verified health foundations, and underprivileged patients with donated wheelchairs, oxygen cylinders, surplus surgical supplies, and philanthropic medical grants.
          </p>
        </div>
      </div>
      
      {/* Header Banner */}
      <div className="bg-[#2D3A5E] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#8FA9FF] shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#8FA9FF]" />
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block">
                MediYatra Charitable Healthcare & Surplus Relief Desk
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              Charity, Medicine & Medical Equipment Aid Hub
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed">
              Connecting donors, verified health NGOs, and patients in need with surplus medicines, wheelchairs, oxygen cylinders, and surgical relief programs.
            </p>
          </div>

          {/* Role-Specific Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isPatient && (
              <>
                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else {
                      setReqItemName('');
                      setShowRequestModal(true);
                    }
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>Request Free Aid</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else setShowDonateModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#8FA9FF] hover:bg-[#7A97F0] text-[#2D3A5E] font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4 text-[#2D3A5E]" />
                  <span>Donate Surplus Aid</span>
                </button>
              </>
            )}

            {isDoctor && (
              <div className="px-4 py-2.5 bg-[#1A233D] text-[#8FA9FF] border border-[#8FA9FF] font-black text-xs rounded-xl flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#8FA9FF]" />
                <span>Physician Guidance Desk Active</span>
              </div>
            )}

            {isHospital && (
              <button
                onClick={() => {
                  if (!currentUser) onOpenAuth();
                  else setShowDonateModal(true);
                }}
                className="px-4 py-2.5 bg-[#8FA9FF] hover:bg-[#7A97F0] text-[#2D3A5E] font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4 text-[#2D3A5E]" />
                <span>List Hospital Surplus Aid</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-4 mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs rounded-xl font-black flex items-center justify-between shadow-xs">
          <span>{statusNotice}</span>
          <button onClick={() => setStatusNotice('')} className="p-1 font-mono">X</button>
        </div>
      )}

      {/* Categories Toolbar & Search */}
      <div className="bg-white rounded-xl p-4 border-2 border-slate-300 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'Medicines', 'Wheelchairs', 'Oxygen Cylinders', 'Medical Equipment', 'Hospital Beds'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition border ${
                  activeCategory === cat
                    ? 'bg-[#2D3A5E] text-white border-[#2D3A5E] shadow'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search items or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-2 border-slate-300 text-slate-900 font-extrabold text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:border-[#8FA9FF] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

        </div>
      </div>

      {/* NGO Request Management Panel (for NGO Users) */}
      {(isNGO || isAdmin) && patientRequests.length > 0 && (
        <div className="mb-10 portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 font-sans">Patient Aid Request Queue (NGO Desk)</h3>
              <p className="text-xs text-slate-600 font-bold">Review incoming patient aid requests and update dispatch status.</p>
            </div>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-950 text-xs font-black rounded border border-purple-300">
              {patientRequests.length} Active Requests
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {patientRequests.map((req) => (
              <div key={req._id} className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl space-y-3 font-bold text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-700">Ref #{req._id}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded border text-[10px] font-black">{req.status}</span>
                </div>
                <p>Patient: <span className="text-slate-900 font-black">{req.patientName}</span> ({req.patientEmail})</p>
                <p>Item Requested: <span className="text-[#2D3A5E] font-black">{req.requestedItemName}</span> ({req.requestedCategory})</p>
                <p className="text-slate-700 font-semibold bg-white p-2.5 rounded border border-slate-200">{req.medicalReason}</p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleUpdateNGOStatus(req._id, 'Approved')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded"
                  >
                    Approve Aid
                  </button>
                  <button
                    onClick={() => handleUpdateNGOStatus(req._id, 'Dispatched')}
                    className="px-3 py-1.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-[10px] font-black rounded"
                  >
                    Dispatch Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Medical Aid Items Grid */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-sans">Available Donated Medicines & Medical Equipment</h3>
          <span className="text-xs font-black text-[#2D3A5E]">{filteredEquipment.length} Available Listings</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-600 font-bold">Loading medical aid directory...</div>
        ) : filteredEquipment.length === 0 ? (
          <div className="portal-card p-12 text-center bg-white border-2 border-slate-300 rounded-xl space-y-3">
            <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-base font-black text-slate-900">No Donated Equipment Found</h4>
            <p className="text-xs text-slate-700 font-bold max-w-md mx-auto">No listings match the selected category or search keyword.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <div 
                key={item._id}
                className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="px-2 py-0.5 bg-slate-100 text-[#2D3A5E] text-[10px] font-black rounded uppercase border border-slate-300">
                        {item.category}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1 font-sans leading-tight">{item.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300 shrink-0">
                      {item.status || 'Available'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-600 font-black uppercase block">Quantity Available</span>
                      <span className="font-extrabold text-slate-900">{item.quantity} Units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 font-black uppercase block">Location</span>
                      <span className="font-extrabold text-[#2D3A5E] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2D3A5E] shrink-0" /> {item.city}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 font-bold border-t border-slate-100 pt-2 space-y-0.5">
                    <p>Donor: <span className="text-slate-900 font-black">{item.donorName}</span></p>
                    <p>Assigned NGO: <span className="text-[#2D3A5E] font-black">{item.ngoPartner}</span></p>
                  </div>
                </div>

                {/* Role-Based Card Action Buttons */}
                <div className="pt-3 border-t-2 border-slate-100">
                  {isPatient ? (
                    <button
                      onClick={() => {
                        if (!currentUser) onOpenAuth();
                        else {
                          setSelectedItemForRequest(item);
                          setReqItemName(item.name);
                          setReqCategory(item.category);
                          setShowRequestModal(true);
                        }
                      }}
                      className="w-full py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5 text-[#8FA9FF]" />
                      <span>Request This Item Free</span>
                    </button>
                  ) : isDoctor ? (
                    <div className="p-2 bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold rounded-lg text-center">
                      <span>🩺 Recommended Aid Option for Underprivileged Patients</span>
                    </div>
                  ) : isHospital ? (
                    <div className="p-2 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg text-center">
                      <span>🏥 Available in Community Surplus Network</span>
                    </div>
                  ) : null}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Health NGO Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-sans">Verified Health NGO Partners & Subsidy Programs</h3>
          <span className="text-xs font-black text-[#2D3A5E]">{ngoList.length} Registered Foundations</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ngoList.map((ngo) => (
            <div key={ngo._id} className="portal-card p-6 bg-white border-2 border-slate-300 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded border border-emerald-300">
                    NABL Verified NGO
                  </span>
                  <span className="text-xs font-mono font-black text-[#2D3A5E]">{ngo.city}</span>
                </div>

                <h4 className="text-base font-black text-slate-900 font-sans">{ngo.name}</h4>
                <p className="text-xs font-black text-[#2D3A5E]">Focus: {ngo.focusArea}</p>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{ngo.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs font-bold text-slate-800 space-y-1">
                <p>Max Subsidy: <span className="font-mono text-emerald-700 font-black">${ngo.maxGrantUSD?.toLocaleString()}</span></p>
                <p>Helpline: <span className="font-extrabold text-slate-900">{ngo.phone}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Donate Surplus Aid Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#1E293B] text-white p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#8FA9FF] shrink-0" />
                <h3 className="font-black text-base text-white tracking-wide">Donate Surplus Medicines or Equipment</h3>
              </div>
              <button onClick={() => setShowDonateModal(false)} className="text-slate-300 hover:text-white font-mono p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDonateSubmit} className="p-6 overflow-y-auto space-y-4 bg-white text-xs font-bold">
              <div>
                <label className="text-slate-900 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foldable Wheelchair / Atorvastatin 20mg"
                  value={donateName}
                  onChange={(e) => setDonateName(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1">Category *</label>
                  <select
                    value={donateCategory}
                    onChange={(e) => setDonateCategory(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                  >
                    <option value="Medicines">Medicines</option>
                    <option value="Wheelchairs">Wheelchairs</option>
                    <option value="Oxygen Cylinders">Oxygen Cylinders</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Hospital Beds">Hospital Beds</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-900 block mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={donateQty}
                    onChange={(e) => setDonateQty(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1">City Location *</label>
                <input
                  type="text"
                  required
                  value={donateCity}
                  onChange={(e) => setDonateCity(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1">Item Description & Condition</label>
                <textarea
                  rows={2}
                  placeholder="Describe condition, expiry date for medicines, etc..."
                  value={donateDesc}
                  onChange={(e) => setDonateDesc(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black rounded-lg shadow transition"
              >
                Submit Donation Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Patient Aid Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#047857] text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-200 shrink-0" />
                <h3 className="font-black text-base text-white tracking-wide">Request Free Medical Aid</h3>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="text-emerald-100 hover:text-white font-mono p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAidRequestSubmit} className="p-6 overflow-y-auto space-y-4 bg-white text-xs font-bold">
              <div>
                <label className="text-slate-900 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={reqPatientName}
                  onChange={(e) => setReqPatientName(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1">Patient Email *</label>
                  <input
                    type="email"
                    required
                    value={reqPatientEmail}
                    onChange={(e) => setReqPatientEmail(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-900 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={reqPatientPhone}
                    onChange={(e) => setReqPatientPhone(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1">Requested Item / Aid Name *</label>
                <input
                  type="text"
                  required
                  value={reqItemName}
                  onChange={(e) => setReqItemName(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1">Medical Reason & Aid Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why you require this medical aid or equipment..."
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 text-slate-900 font-extrabold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg shadow transition"
              >
                Submit Aid Request
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
