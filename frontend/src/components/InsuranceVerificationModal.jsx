import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Download, 
  CreditCard,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { generateOfficialPDFReceipt } from '../utils/pdfGenerator';

export default function InsuranceVerificationModal({ isOpen, onClose, currentUser }) {
  const [patientName, setPatientName] = useState(currentUser?.name || 'Demo Patient');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || 'patient@mediyatra.org');
  const [provider, setProvider] = useState('Cigna Global Healthcare');
  const [policyNumber, setPolicyNumber] = useState('CG-99412-INT');
  const [selectedHospital, setSelectedHospital] = useState('Indraprastha Apollo Hospitals');
  const [selectedProcedure, setSelectedProcedure] = useState('Living Donor Liver Transplant');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  if (!isOpen) return null;

  const INSURANCE_PROVIDERS = [
    'Cigna Global Healthcare',
    'Bupa International Insurance',
    'Allianz Care Worldwide',
    'Aetna International',
    'AXA Global Healthcare',
    'MetLife Worldwide',
    'Star Health & Allied Insurance',
    'HDFC ERGO Health',
    'Care Health Insurance',
    'Niva Bupa Health Insurance',
    'ICICI Lombard General Insurance'
  ];

  const HOSPITALS = [
    'Indraprastha Apollo Hospitals',
    'Medanta - The Medicity',
    'Fortis Memorial Research Institute (FMRI)',
    'Max Super Speciality Hospital, Saket',
    'Sir Ganga Ram Hospital',
    'Manipal Hospital, Old Airport Road',
    'Narayana Institute of Cardiac Sciences',
    'Kokilaben Dhirubhai Ambani Hospital'
  ];

  const PROCEDURES = [
    'Living Donor Liver Transplant',
    'Coronary Artery Bypass Grafting (CABG)',
    'Bilateral Robotic Knee Replacement',
    'TAVI / TAVR Transcatheter Valve',
    'Bone Marrow Transplant',
    'Brain Tumor Resection (Neurosurgery)',
    'Pediatric VSD Heart Surgery'
  ];

  function handleVerifyInsurance(e) {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      // Generate realistic pre-authorization clearance
      const authNumber = 'INS-PREAUTH-' + Math.floor(100000 + Math.random() * 900000);
      setVerificationResult({
        authNumber,
        coveragePercent: 90,
        estimatedApprovedUSD: 24500,
        estimatedApprovedINR: 2033500,
        copayDeductibleUSD: 500,
        status: 'PRE-AUTHORIZED CASHLESS ELIGIBLE',
        hospitalTpaDesk: `${selectedHospital} — International TPA Clearance Counter #3`,
        verifiedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setIsVerifying(false);
    }, 1200);
  }

  function handleDownloadInsuranceVoucher() {
    if (!verificationResult) return;

    generateOfficialPDFReceipt({
      documentType: 'HEALTH INSURANCE PRE-AUTHORIZATION & CASHLESS CLEARANCE',
      referenceNo: verificationResult.authNumber,
      date: verificationResult.verifiedDate,
      patientName: patientName,
      patientEmail: patientEmail,
      patientPhone: '+91 98111 22334',
      doctorName: 'Third-Party Administrator (TPA) Medical Desk',
      doctorSpecialty: 'Health Insurance Claims Clearance',
      hospitalName: selectedHospital,
      hospitalCity: 'New Delhi / Gurugram',
      amountPaid: `PRE-APPROVED (${verificationResult.coveragePercent}% COVERAGE)`,
      status: verificationResult.status,
      details: [
        { label: 'Insurance Provider', value: provider },
        { label: 'Policy / Card ID', value: policyNumber },
        { label: 'Planned Surgical Procedure', value: selectedProcedure },
        { label: 'Network Hospital Clearance', value: 'VERIFIED CASHLESS NETWORK' },
        { label: 'Approved Cashless Limit', value: `$${verificationResult.estimatedApprovedUSD.toLocaleString()} (₹${verificationResult.estimatedApprovedINR.toLocaleString()})` },
        { label: 'Patient Co-Pay Deductible', value: `$${verificationResult.copayDeductibleUSD}` }
      ],
      notes: `OFFICIAL TPA CLEARANCE NOTICE: This pre-authorization slip confirms that ${patientName} holding policy ${policyNumber} under ${provider} is eligible for Cashless Hospitalization at ${selectedHospital} for ${selectedProcedure}.\nPlease present this slip along with your original passport/ID at the hospital TPA desk.`
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-[#FFF6FB] rounded-2xl border-2 border-[#FFD6E8] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#2B4A66] text-white p-4 flex items-center justify-between border-b border-[#1E364B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1E364B] rounded-xl border border-[#7FD6FF]">
              <ShieldCheck className="w-5 h-5 text-[#7FD6FF]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Health Insurance & Cashless Pre-Auth Desk</h3>
              <p className="text-xs text-[#7FD6FF] font-medium">Verify International & Domestic Insurer Coverage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {!verificationResult ? (
            <form onSubmit={handleVerifyInsurance} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-[#2B4A66] mb-1">Patient Full Name</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={e => setPatientName(e.target.value)} 
                  required
                  className="w-full px-3 py-2 bg-white border border-[#FFD6E8] rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#7FD6FF]" 
                  placeholder="e.g. Tariq Al-Mansoor"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B4A66] mb-1">Insurance Company / Provider</label>
                <select 
                  value={provider} 
                  onChange={e => setProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FFD6E8] rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#7FD6FF]"
                >
                  {INSURANCE_PROVIDERS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B4A66] mb-1">Policy / Card Number</label>
                <input 
                  type="text" 
                  value={policyNumber} 
                  onChange={e => setPolicyNumber(e.target.value)} 
                  required
                  className="w-full px-3 py-2 bg-white border border-[#FFD6E8] rounded-xl text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-[#7FD6FF]" 
                  placeholder="e.g. CG-99412-INT"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B4A66] mb-1">Target Hospital Network</label>
                <select 
                  value={selectedHospital} 
                  onChange={e => setSelectedHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FFD6E8] rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#7FD6FF]"
                >
                  {HOSPITALS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B4A66] mb-1">Planned Surgical Procedure</label>
                <select 
                  value={selectedProcedure} 
                  onChange={e => setSelectedProcedure(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#FFD6E8] rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#7FD6FF]"
                >
                  {PROCEDURES.map(pr => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Coverage with TPA Network...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#7FD6FF]" />
                      <span>Check Cashless Pre-Authorization Eligibility</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-4 text-center py-2">
              
              <div className="w-12 h-12 bg-emerald-100 text-[#2B4A66] border border-[#6FE3B4] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-[#6FE3B4] text-[10px] font-bold uppercase rounded-full">
                  {verificationResult.status}
                </span>
                <h4 className="text-lg font-bold text-[#2B4A66] mt-2">{provider} Verified</h4>
                <p className="text-xs text-slate-600 font-medium">Policy ID: <span className="font-mono font-bold text-[#2B4A66]">{policyNumber}</span></p>
              </div>

              {/* Breakdown Card */}
              <div className="bg-white border border-[#FFD6E8] rounded-xl p-3.5 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-pink-100 pb-1.5">
                  <span className="text-slate-600">Pre-Approved Cashless Coverage:</span>
                  <span className="font-bold text-emerald-700">{verificationResult.coveragePercent}% Coverage</span>
                </div>
                <div className="flex justify-between border-b border-pink-100 pb-1.5">
                  <span className="text-slate-600">Estimated Approved Amount:</span>
                  <span className="font-bold text-[#2B4A66] font-mono">${verificationResult.estimatedApprovedUSD.toLocaleString()} (₹{verificationResult.estimatedApprovedINR.toLocaleString()})</span>
                </div>
                <div className="flex justify-between border-b border-pink-100 pb-1.5">
                  <span className="text-slate-600">Estimated Patient Co-Pay:</span>
                  <span className="font-bold text-amber-700 font-mono">${verificationResult.copayDeductibleUSD}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-600">Assigned Hospital TPA Desk:</span>
                  <span className="font-medium text-slate-800 text-[11px]">{selectedHospital}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleDownloadInsuranceVoucher}
                  className="w-full py-2.5 bg-[#2B4A66] hover:bg-[#1E364B] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#7FD6FF]" />
                  <span>Download Pre-Authorization Guarantee Slip (PDF)</span>
                </button>

                <button
                  onClick={() => setVerificationResult(null)}
                  className="w-full py-2 bg-white border border-[#FFD6E8] text-[#2B4A66] font-bold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Verify Another Insurance Policy
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
