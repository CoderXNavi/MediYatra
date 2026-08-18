import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HospitalExplorer from './components/HospitalExplorer';
import DoctorDirectory from './components/DoctorDirectory';
import TreatmentCostCalculator from './components/TreatmentCostCalculator';
import MedicalTourismHub from './components/MedicalTourismHub';
import PatientRecordsPortal from './components/PatientRecordsPortal';
import DoctorPortal from './components/DoctorPortal';
import HospitalPortal from './components/HospitalPortal';
import AdminDashboard from './components/AdminDashboard';
import CharityAidHub from './components/CharityAidHub';
import AccessDenied from './components/AccessDenied';
import AITriageWidget from './components/AITriageWidget';
import AppointmentModal from './components/AppointmentModal';
import ConsultationModal from './components/ConsultationModal';
import TourismBookingModal from './components/TourismBookingModal';
import EmergencySOSModal from './components/EmergencySOSModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import { apiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'hospitals' | 'doctors' | 'treatments' | 'tourism' | 'charity' | 'records' | 'doctor-portal' | 'hospital-portal' | 'admin'
  const [currency, setCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // Auth User Single Source of Truth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediyatra_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Protected Action Intent Return Flow state
  const [pendingAction, setPendingAction] = useState(null);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isTourismModalOpen, setIsTourismModalOpen] = useState(false);
  const [tourismModalService, setTourismModalService] = useState('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAITriageOpen, setIsAITriageOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Context Selection for Doctor Consultation & Appointment
  const [consultationDoctor, setConsultationDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const isNonPatientRole = currentUser?.role === 'Doctor' || currentUser?.role === 'Hospital' || currentUser?.role === 'Admin';

  // Scroll to Top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Initial Data Fetching
  useEffect(() => {
    async function loadData() {
      try {
        const [hospList, docList, treatList] = await Promise.all([
          apiService.getHospitals(),
          apiService.getDoctors(),
          apiService.getTreatments()
        ]);
        setHospitals(hospList || []);
        setDoctors(docList || []);
        setTreatments(treatList || []);
      } catch (err) {
        console.error('Error loading MediYatra initial data:', err);
      }
    }
    loadData();
  }, []);

  function handleConsultDoctor(doctor) {
    if (isNonPatientRole) return;

    if (!currentUser) {
      setPendingAction({ type: 'CONSULT_DOCTOR', doctor });
      setIsAuthOpen(true);
      return;
    }

    setConsultationDoctor(doctor);
    setIsConsultationOpen(true);
  }

  function handleBookDoctor(doctor) {
    if (isNonPatientRole) return;

    if (!currentUser) {
      setPendingAction({ type: 'BOOK_DOCTOR', doctor });
      setIsAuthOpen(true);
      return;
    }

    setSelectedDoctor(doctor);
    setSelectedHospital(null);
    setSelectedTreatment(null);
    setSelectedService(null);
    setIsBookingOpen(true);
  }

  function handleBookHospital(hospital) {
    if (isNonPatientRole) return;

    if (!currentUser) {
      setPendingAction({ type: 'BOOK_HOSPITAL', hospital });
      setIsAuthOpen(true);
      return;
    }

    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    setSelectedTreatment(null);
    setSelectedService(null);
    setIsBookingOpen(true);
  }

  function handleBookTreatment(treatment) {
    if (isNonPatientRole) return;

    if (!currentUser) {
      setPendingAction({ type: 'BOOK_TREATMENT', treatment });
      setIsAuthOpen(true);
      return;
    }

    setSelectedTreatment(treatment);
    setSelectedDoctor(null);
    setSelectedHospital(null);
    setSelectedService(null);
    setIsBookingOpen(true);
  }

  function handleOpenTourismModal(serviceTitle) {
    if (isNonPatientRole) return;

    setTourismModalService(serviceTitle || 'Fast-Track e-Medical Visa Invitation Letter');
    setIsTourismModalOpen(true);
  }

  function handleOpenAdminTab(targetTab) {
    setActiveTab('admin');
  }

  // Auth Success Return Flow Handler
  function handleLoginSuccess(user) {
    setCurrentUser(user);

    if (pendingAction) {
      if (pendingAction.type === 'CONSULT_DOCTOR' && pendingAction.doctor) {
        setConsultationDoctor(pendingAction.doctor);
        setIsConsultationOpen(true);
      } else if (pendingAction.type === 'BOOK_DOCTOR' && pendingAction.doctor) {
        setSelectedDoctor(pendingAction.doctor);
        setIsBookingOpen(true);
      } else if (pendingAction.type === 'BOOK_HOSPITAL' && pendingAction.hospital) {
        setSelectedHospital(pendingAction.hospital);
        setIsBookingOpen(true);
      } else if (pendingAction.type === 'BOOK_TREATMENT' && pendingAction.treatment) {
        setSelectedTreatment(pendingAction.treatment);
        setIsBookingOpen(true);
      }
      setPendingAction(null);
    } else {
      if (user.role === 'Doctor') {
        setActiveTab('doctor-portal');
      } else if (user.role === 'Hospital') {
        setActiveTab('hospital-portal');
      } else if (user.role === 'Admin') {
        setActiveTab('admin');
      }
    }
  }

  // Session Isolation & Complete Logout Purge
  function handleLogout() {
    localStorage.removeItem('mediyatra_user');
    setCurrentUser(null);
    setPendingAction(null);
    setConsultationDoctor(null);
    setSelectedDoctor(null);
    setSelectedHospital(null);
    setSelectedTreatment(null);
    setSelectedService(null);
    setSearchQuery('');
    setActiveTab('home');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-[#2D3A5E] font-sans antialiased overflow-x-hidden w-full">
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenBooking={() => !isNonPatientRole && setIsBookingOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAITriage={() => setIsAITriageOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full">

        {/* Home Landing View */}
        {activeTab === 'home' && (
          <>
            <HeroSection 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setActiveTab={setActiveTab}
              onOpenAITriage={() => setIsAITriageOpen(true)}
              onOpenBooking={() => !isNonPatientRole && setIsBookingOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            {/* Featured Real Hospitals Section on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-2.5 py-0.5 bg-[#8FA9FF] text-[#2D3A5E] text-[10px] font-black rounded uppercase">
                    Accredited Network
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2D3A5E] tracking-tight font-sans mt-1">
                    Featured Hospitals & Medical Centers
                  </h2>
                  <p className="text-xs text-slate-600 font-bold">
                    Top JCI and NABH accredited hospitals in India available for international patient care.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  <span>View All 26 Hospitals ➔</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hospitals.slice(0, 3).map((hosp) => (
                  <div 
                    key={hosp._id || hosp.name}
                    className="bg-white rounded-xl border-2 border-slate-200 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-900">
                        <img 
                          src={hosp.image} 
                          alt={hosp.name} 
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded shadow">
                            ★ {hosp.rating || 4.8}
                          </span>
                          <span className="px-2 py-0.5 bg-[#2D3A5E] text-white text-[10px] font-black rounded shadow">
                            {hosp.city}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-black text-base text-[#2D3A5E] line-clamp-1">
                          {hosp.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 font-bold">
                          {hosp.description || `${hosp.hospitalType || 'Multi-Specialty Hospital'} located in ${hosp.city}, ${hosp.state}.`}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(hosp.specialties || []).slice(0, 3).map((spec) => (
                            <span key={spec} className="px-2 py-0.5 bg-slate-100 text-[#2D3A5E] text-[10px] font-bold rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-500">
                        {hosp.beds ? `${hosp.beds} Beds` : 'NABH Accredited'}
                      </span>
                      <button
                        onClick={() => handleBookHospital(hosp)}
                        className="px-3 py-1.5 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] text-xs font-black rounded transition"
                      >
                        Book OPD ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Senior Doctors Section on Home */}
            <section className="bg-slate-50 border-t border-slate-200 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-[#2D3A5E] text-[10px] font-black rounded uppercase border border-indigo-200">
                      Senior Medical Faculty
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2D3A5E] tracking-tight font-sans mt-1">
                      Renowned Specialist Doctors
                    </h2>
                    <p className="text-xs text-slate-600 font-bold">
                      Board-certified department heads and senior surgeons available for OPD and online video consultation.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="px-4 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                  >
                    <span>Explore All 50 Doctors ➔</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {doctors.slice(0, 3).map((doc) => (
                    <div 
                      key={doc._id || doc.name}
                      className="bg-white rounded-xl border-2 border-slate-200 shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition"
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'} 
                          alt={doc.name} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-[#8FA9FF]"
                        />
                        <div className="space-y-1">
                          <h3 className="font-black text-sm text-[#2D3A5E] line-clamp-1">
                            {doc.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded inline-block">
                            {doc.specialty}
                          </span>
                          <p className="text-[11px] text-slate-600 font-bold line-clamp-1">
                            {doc.hospitalName}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-black">
                          {doc.experienceYears ? `${doc.experienceYears}+ Yrs Exp` : 'Senior Faculty'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConsultDoctor(doc)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#2D3A5E] text-xs font-black rounded transition"
                          >
                            Video Consult
                          </button>
                          <button
                            onClick={() => handleBookDoctor(doc)}
                            className="px-2.5 py-1.5 bg-[#8FA9FF] hover:bg-blue-400 text-[#2D3A5E] text-xs font-black rounded transition"
                          >
                            Book OPD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Tab Views */}
        {activeTab === 'hospitals' && (
          <div>
            {/* Dedicated Hospital Page Header */}
            <div className="bg-[#2D3A5E] text-white py-8 px-4 sm:px-8 mb-4 shadow-md border-b-4 border-[#8FA9FF]">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-[#8FA9FF] text-[#2D3A5E] text-xs font-black rounded-full uppercase tracking-wider">
                    Official Hospital Explorer
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black font-sans leading-tight">
                    Accredited Hospitals & Medical Centers in India
                  </h1>
                  <p className="text-slate-200 text-xs sm:text-sm font-bold max-w-2xl">
                    Browse JCI and NABH accredited quaternary care hospitals across 16 Indian cities. View exact locations on Google Maps, bed counts, centers of excellence, and book direct consultations.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="px-4 py-2 bg-[#1A233D] hover:bg-black text-[#8FA9FF] border border-[#8FA9FF] rounded-lg text-xs font-black transition cursor-pointer"
                  >
                    View Doctor Directory ➔
                  </button>
                </div>
              </div>
            </div>

            <HospitalExplorer 
              hospitals={hospitals} 
              currency={currency} 
              onBookHospital={handleBookHospital}
              searchQuery={searchQuery}
              currentUser={currentUser}
              onOpenAdminTab={handleOpenAdminTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory 
            doctors={doctors} 
            currency={currency}
            onConsultDoctor={handleConsultDoctor}
            onBookDoctor={handleBookDoctor}
            searchQuery={searchQuery}
            currentUser={currentUser}
            onOpenAdminTab={handleOpenAdminTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'treatments' && (
          <TreatmentCostCalculator 
            treatments={treatments} 
            currency={currency}
            onBookTreatment={handleBookTreatment}
            searchQuery={searchQuery}
            currentUser={currentUser}
            onOpenAdminTab={handleOpenAdminTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tourism' && (
          <MedicalTourismHub 
            currency={currency}
            onSelectService={handleOpenTourismModal}
            currentUser={currentUser}
            onOpenAdminTab={handleOpenAdminTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'charity' && (
          <CharityAidHub 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'records' && (
          <PatientRecordsPortal 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onBookNewAppointment={() => setIsBookingOpen(true)}
          />
        )}

        {activeTab === 'doctor-portal' && (
          <DoctorPortal 
            currentUser={currentUser}
          />
        )}

        {activeTab === 'hospital-portal' && (
          <HospitalPortal 
            currentUser={currentUser}
          />
        )}

        {/* Admin Dashboard Protected View */}
        {activeTab === 'admin' && (
          currentUser?.role === 'Admin' ? (
            <AdminDashboard currentUser={currentUser} />
          ) : (
            <AccessDenied 
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onGoHome={() => setActiveTab('hospitals')}
            />
          )
        )}

      </main>

      {/* Footer Component */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAITriage={() => setIsAITriageOpen(true)}
      />

      {/* Modals */}
      {!isNonPatientRole && (
        <>
          <ConsultationModal 
            isOpen={isConsultationOpen}
            onClose={() => {
              setIsConsultationOpen(false);
              setConsultationDoctor(null);
            }}
            currentUser={currentUser}
            doctor={consultationDoctor}
            onConsultationSubmitted={() => {
              setActiveTab('records');
            }}
          />

          <TourismBookingModal
            isOpen={isTourismModalOpen}
            onClose={() => setIsTourismModalOpen(false)}
            currentUser={currentUser}
            initialService={tourismModalService}
            hospitals={hospitals}
            doctors={doctors}
            onSuccess={() => {
              setActiveTab('records');
            }}
          />

          <AppointmentModal 
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedDoctor(null);
              setSelectedHospital(null);
              setSelectedTreatment(null);
              setSelectedService(null);
            }}
            currentUser={currentUser}
            preselectedDoctor={selectedDoctor}
            preselectedHospital={selectedHospital}
            preselectedTreatment={selectedTreatment}
            preselectedService={selectedService}
          />
        </>
      )}

      <EmergencySOSModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <AITriageWidget 
        isOpen={isAITriageOpen}
        onClose={() => setIsAITriageOpen(false)}
        onBookDoctor={handleBookDoctor}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
