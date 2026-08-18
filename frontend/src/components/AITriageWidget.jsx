import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Stethoscope, 
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../services/api';
import { normalizeDoctor } from '../utils/normalizeData';

export default function AITriageWidget({ isOpen, onClose, onBookDoctor }) {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageOutput, setTriageOutput] = useState(null);

  if (!isOpen) return null;

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await apiService.analyzeSymptoms(symptomsInput);
      if (res.triageResult) {
        setTriageOutput(res.triageResult);
      }
    } catch (err) {
      console.error('[AITriage] Error analyzing symptoms:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleReset() {
    setTriageOutput(null);
    setSymptomsInput('');
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border-2 border-slate-300 shadow-2xl max-w-lg w-full h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2D3A5E] text-white p-4 flex items-center justify-between border-b border-[#1A233D]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-[#8FA9FF]" />
            </div>
            <div>
              <h3 className="font-black text-base text-white font-sans">AI Symptom Triage Desk</h3>
              <p className="text-xs text-[#8FA9FF] font-black">Department & Specialist Matcher</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
          
          {!triageOutput ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-slate-200 space-y-2 shadow-xs">
                <p className="text-xs text-slate-900 font-extrabold leading-relaxed">
                  Enter your current symptoms, medical history, or surgical concerns below to receive an instant department recommendation and matching specialist list.
                </p>
              </div>

              {/* Sample Prompts */}
              <div>
                <span className="text-[11px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-2">
                  Sample Symptoms Quick-Select
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Severe chest pressure and shortness of breath when walking",
                    "Chronic bilateral knee pain, difficulty climbing stairs",
                    "Elevated liver enzymes, fatigue, abdominal discomfort",
                    "Chronic back pain, numbness radiating down leg"
                  ].map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => setSymptomsInput(sample)}
                      className="text-left text-xs bg-white hover:bg-slate-100 p-2.5 rounded-lg border-2 border-slate-200 text-slate-900 font-bold transition shadow-xs"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border-2 border-slate-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase">Recommended Specialty</span>
                  <span className="px-2.5 py-1 bg-[#2D3A5E] text-[#8FA9FF] text-xs font-black rounded border border-[#8FA9FF]">
                    {triageOutput.recommendedSpecialty}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <span className="font-black block">Assessment: {triageOutput.riskLevel}</span>
                    <span className="font-bold">{triageOutput.clinicalSummary}</span>
                  </div>
                </div>
              </div>

              {/* Doctors Found */}
              <div>
                <h4 className="text-xs font-black text-[#2D3A5E] uppercase tracking-wider mb-2">
                  Matching Department Specialists
                </h4>
                <div className="space-y-3">
                  {(triageOutput.matchedDoctors || []).map(normalizeDoctor).filter(Boolean).map((doc) => (
                    <div key={doc._id} className="bg-white p-3.5 rounded-lg border-2 border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          onError={handleImageError}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shrink-0" 
                        />
                        <div>
                          <h5 className="text-xs font-black text-slate-900">{doc.name}</h5>
                          <p className="text-[11px] text-[#2D3A5E] font-bold">{doc.specialty} • {doc.experienceYears} Yrs Exp</p>
                          <p className="text-[10px] text-slate-700 font-extrabold">{doc.hospitalName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onBookDoctor(doc);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-[#2D3A5E] text-white text-xs font-black rounded shadow hover:bg-[#1A233D] shrink-0"
                      >
                        Consult
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-black rounded transition"
              >
                Analyze Different Symptoms
              </button>
            </div>
          )}

        </div>

        {/* Input Form */}
        {!triageOutput && (
          <form onSubmit={handleAnalyze} className="p-4 bg-white border-t-2 border-slate-200 space-y-3">
            <textarea
              rows={3}
              required
              placeholder="Describe your symptoms or medical concern here..."
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg p-3 focus:border-[#8FA9FF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !symptomsInput.trim()}
              className="w-full py-2.5 bg-[#2D3A5E] hover:bg-[#1A233D] text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              {isAnalyzing ? (
                <span>Analyzing Symptoms...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#8FA9FF]" />
                  <span>Run Symptom Assessment</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
