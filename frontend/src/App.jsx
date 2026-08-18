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
import AITriageWidget from './components/AITriageWidget';
import AppointmentModal from './components/AppointmentModal';
import ConsultationModal from './components/ConsultationModal';
import TourismBookingModal from './components/TourismBookingModal';
import EmergencySOSModal from './components/EmergencySOSModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import { apiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('hospitals'); // 'hospitals' | 'doctors' | 'treatments' | 'tourism' | 'records' | 'doctor-portal' | 'hospital-portal' | 'admin'
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
    if (!currentUser) {
      setPendingAction({ type: 'CONSULT_DOCTOR', doctor });
      setIsAuthOpen(true);
      return;
    }

    setConsultationDoctor(doctor);
    setIsConsultationOpen(true);
  }

  function handleBookDoctor(doctor) {
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
    setTourismModalService(serviceTitle || 'Fast-Track e-Medical Visa Invitation Letter');
    setIsTourismModalOpen(true);
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
    setActiveTab('hospitals');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-[#2D3A5E] font-sans antialiased overflow-x-hidden w-full">
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenBooking={() => setIsBookingOpen(true)}
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

        {/* Home View Hero Section */}
        {activeTab === 'hospitals' && (
          <HeroSection 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setActiveTab={setActiveTab}
            onOpenAITriage={() => setIsAITriageOpen(true)}
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {/* Find Doctors Page Header Banner */}
        {activeTab === 'doctors' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                Board-Certified Specialist Registry
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Find Doctors & Senior Surgeons
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                Browse verified department heads, medical qualifications, OPD fees, and consultation schedules.
              </p>
            </div>
          </div>
        )}

        {/* Procedure Pricing Page Header Banner */}
        {activeTab === 'treatments' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                Transparent Surgical Package Pricing
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Procedure Pricing & Tariff Comparisons
              </h1>
              <p className="text-[#D7C6FF] text-xs sm:text-sm mt-1 font-semibold">
                Compare hospital surgical tariffs in India against US/UK hospital costs with up to 90% savings.
              </p>
            </div>
          </div>
        )}

        {/* Medical Tourism Concierge Header Banner */}
        {activeTab === 'tourism' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                International Patient Support Services
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Medical Tourism Concierge Services
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                e-Medical Visa assistance, certified language interpreters, serviced recovery guest houses, and airport transfers.
              </p>
            </div>
          </div>
        )}

        {/* Patient Health Portal Header Banner */}
        {activeTab === 'records' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                Patient Medical Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Patient Medical History, Consultations & Reports
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                Track doctor consultations, access diagnostic lab reports, and download digital prescriptions.
              </p>
            </div>
          </div>
        )}

        {/* Doctor Portal Header Banner */}
        {activeTab === 'doctor-portal' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                Senior Specialist Consultation Desk
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Doctor Consultation Desk & Case Review
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                Review patient consultation inquiries, evaluate diagnostic histories, and issue clinical responses.
              </p>
            </div>
          </div>
        )}

        {/* Hospital Provider Portal Header Banner */}
        {activeTab === 'hospital-portal' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                Partner Hospital Operations Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Hospital Provider Operations & Roster Control
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                Manage hospital medical roster, confirm patient appointment requests, and oversee bed capacity.
              </p>
            </div>
          </div>
        )}

        {/* Admin Dashboard Header Banner */}
        {activeTab === 'admin' && (
          <div className="bg-[#2D3A5E] text-white py-8 border-b-4 border-[#8FA9FF] mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-black text-[#8FA9FF] uppercase tracking-wider block mb-1">
                System Administration Control Panel
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Admin & Operations Platform Control
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 font-semibold">
                Global hospital/doctor CRUD management, network-wide patient appointment operations, and system sync.
              </p>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'hospitals' && (
          <HospitalExplorer 
            hospitals={hospitals} 
            currency={currency} 
            onBookHospital={handleBookHospital}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory 
            doctors={doctors} 
            currency={currency}
            onConsultDoctor={handleConsultDoctor}
            onBookDoctor={handleBookDoctor}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'treatments' && (
          <TreatmentCostCalculator 
            treatments={treatments} 
            currency={currency}
            onBookTreatment={handleBookTreatment}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'tourism' && (
          <MedicalTourismHub 
            currency={currency}
            onSelectService={handleOpenTourismModal}
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

        {activeTab === 'admin' && (
          <AdminDashboard 
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Footer Component */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAITriage={() => setIsAITriageOpen(true)}
      />

      {/* Modals & Slide-over Drawers */}
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
