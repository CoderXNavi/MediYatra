import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Stethoscope,
  AlertTriangle,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  FileText,
  HeartHandshake
} from 'lucide-react';
import { apiService } from '../services/api';
import { normalizeDoctor, normalizeHospital } from '../utils/normalizeData';

export default function AITriageWidget({
  isOpen,
  onOpen,
  onClose,
  onBookDoctor,
  setActiveTab,
  onOpenBooking,
  onOpenEmergency
}) {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeechDismissed, setIsSpeechDismissed] = useState(false);
  const chatEndRef = useRef(null);

  const initialWelcomeMessage = {
    id: 'welcome-1',
    sender: 'nova',
    text: "Hello! I'm Nova, your 24/7 MediYatra Healthcare Assistant & Platform Guide. Ask me anything about doctors, hospitals, surgical package costs, e-Medical Visas, free NGO aid, or your medical symptoms!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([initialWelcomeMessage]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnalyzing, isOpen]);

  async function handleSendMessage(customText) {
    const query = customText || userInput;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setUserInput('');
    setIsAnalyzing(true);

    try {
      const response = await apiService.askNovaAI(query);

      const novaMsg = {
        id: `nova-${Date.now()}`,
        sender: 'nova',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTab: response.actionTab,
        actionLink: response.actionLink,
        actionDoctor: response.actionDoctor,
        actionLabel: response.actionLabel,
        matchedDoctors: response.matchedDoctors || response.triageResult?.matchedDoctors,
        suggestedHospitals: response.suggestedHospitals || response.triageResult?.suggestedHospitals,
        triageResult: response.triageResult
      };

      setMessages(prev => [...prev, novaMsg]);
    } catch (err) {
      console.error('[AITriageWidget] Error processing query:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `nova-err-${Date.now()}`,
          sender: 'nova',
          text: "I'm having a brief connection delay, but I've noted your request. You can also explore accredited hospitals or book a doctor consultation directly using the options below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    handleSendMessage();
  }

  function handleResetChat() {
    setMessages([initialWelcomeMessage]);
    setUserInput('');
  }

  function handleActionClick(msg) {
    if (msg.actionTab && setActiveTab) {
      setActiveTab(msg.actionTab);
      onClose();
    } else if (msg.actionLink === 'booking' && onOpenBooking) {
      if (msg.actionDoctor && onBookDoctor) {
        onBookDoctor(msg.actionDoctor);
      } else {
        onOpenBooking();
      }
      onClose();
    } else if (msg.actionLink === 'emergency' && onOpenEmergency) {
      onOpenEmergency();
      onClose();
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/nova_avatar.png';
  };

  return (
    <>
      {/* Floating Bottom-Right Nova AI Assistant Avatar & Bubble */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group">

          {/* Greeting Speech Bubble */}
          {!isSpeechDismissed && (
            <div
              onClick={onOpen}
              className="relative bg-white rounded-2xl p-3.5 shadow-2xl border-2 border-slate-200 cursor-pointer hover:border-[#8FA9FF] transition-all max-w-[220px] animate-bounce-subtle"
            >
              {/* Collapse/Minimize '-' Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSpeechDismissed(true);
                }}
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center absolute -top-2 -left-2 border border-slate-300 shadow cursor-pointer"
                title="Minimize bubble"
              >
                -
              </button>

              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-1 font-sans">
                  <span>Hi</span>
                  <span className="text-base">🙏</span>
                  <span>I'm Nova</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-bold leading-snug">
                  Ask me about doctors, visa, costs, or symptoms!
                </p>
              </div>

              {/* Speech Bubble Tail */}
              <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-200 rotate-45" />
            </div>
          )}

          {/* Doctor Avatar Circle Icon with Green Online Indicator */}
          <button
            onClick={onOpen}
            className="relative w-16 h-16 rounded-full border-4 border-white shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-blue-50 flex items-center justify-center shrink-0"
            title="Open Nova AI Healthcare Assistant"
          >
            <img
              src="/nova_avatar.png"
              alt="Nova AI Assistant"
              className="w-full h-full object-cover"
            />
            {/* Green Online Status Badge */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </button>

        </div>
      )}

      {/* Main Full Nova AI Assistant Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-[#2D3A5E] text-white p-4 flex items-center justify-between border-b border-[#1A233D] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full border-2 border-[#8FA9FF] overflow-hidden bg-white shrink-0 p-0.5 shadow-md">
                  <img
                    src="/nova_avatar.png"
                    alt="Nova AI"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white font-sans flex items-center gap-1.5">
                    <span>Nova AI</span>
                    <span className="px-2 py-0.5 bg-[#8FA9FF] text-[#2D3A5E] text-[10px] font-black rounded-full uppercase">24/7 Platform Guide</span>
                  </h3>
                  <p className="text-xs text-[#8FA9FF] font-black">Healthcare Assistant & Clinical Triage Expert</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
                  title="Clear Chat History"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Sample Query Prompts Bar */}
            <div className="bg-slate-100 p-2.5 border-b border-slate-200 shrink-0">
              <span className="text-[10px] font-black text-[#2D3A5E] uppercase tracking-wider block mb-1.5 px-1">
                Suggested Prompts (Click to Ask Nova):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  "How does this website work?",
                  "How do I get an e-Medical Visa VIL?",
                  "Tell me about Dr. Ashok Seth",
                  "Free wheelchairs & NGO aid",
                  "Surgical package costs vs US",
                  "Severe chest pressure when walking"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] bg-white hover:bg-blue-50 hover:border-[#8FA9FF] text-slate-800 font-bold px-2.5 py-1 rounded-full border border-slate-300 whitespace-nowrap shrink-0 transition shadow-2xs cursor-pointer"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversational Chat Thread Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Nova Avatar for Bot Messages */}
                  {msg.sender === 'nova' && (
                    <div className="w-8 h-8 rounded-full border border-[#8FA9FF] overflow-hidden bg-blue-50 shrink-0 shadow-xs mt-1">
                      <img src="/nova_avatar.png" alt="Nova" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Message Bubble Box */}
                  <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user'
                      ? 'bg-[#2D3A5E] text-white rounded-2xl rounded-tr-xs p-3.5 shadow'
                      : 'bg-white text-slate-900 rounded-2xl rounded-tl-xs p-4 shadow-sm border-2 border-slate-200'
                    }`}>

                    <p className="text-xs sm:text-sm font-bold leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {/* Action Link Button if provided */}
                    {msg.actionLabel && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleActionClick(msg)}
                          className="px-3.5 py-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer border border-[#8FA9FF]"
                        >
                          <span>{msg.actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8FA9FF]" />
                        </button>
                      </div>
                    )}

                    {/* Triage Assessment Box */}
                    {msg.triageResult && (
                      <div className="pt-2 space-y-2">
                        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-lg flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-black block text-amber-900">Risk Assessment: {msg.triageResult.riskLevel}</span>
                            <span className="font-bold block text-slate-800">{msg.triageResult.clinicalSummary}</span>
                          </div>
                        </div>

                        {msg.triageResult.recommendedTests && msg.triageResult.recommendedTests.length > 0 && (
                          <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300">
                            <span className="text-[10px] font-black text-[#2D3A5E] uppercase block mb-1">
                              Recommended Diagnostic Workup:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {msg.triageResult.recommendedTests.map((test, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white text-slate-900 text-[10px] font-extrabold rounded border border-slate-300">
                                  ✓ {test}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Matched Doctors List */}
                    {msg.matchedDoctors && msg.matchedDoctors.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="text-[10px] font-black text-[#2D3A5E] uppercase block">
                          Matched Senior Specialists:
                        </span>
                        {msg.matchedDoctors.map(normalizeDoctor).filter(Boolean).map((doc) => (
                          <div key={doc._id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-300 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={doc.image}
                                alt={doc.name}
                                onError={handleImageError}
                                className="w-9 h-9 rounded-full object-cover border shrink-0"
                              />
                              <div>
                                <h5 className="text-xs font-black text-slate-900">{doc.name}</h5>
                                <p className="text-[10px] text-[#2D3A5E] font-bold">{doc.specialty} • {doc.hospitalName}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onBookDoctor(doc);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-[#2D3A5E] text-white text-[11px] font-black rounded hover:bg-[#1A233D] shrink-0 cursor-pointer"
                            >
                              Consult
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Hospitals */}
                    {msg.suggestedHospitals && msg.suggestedHospitals.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="text-[10px] font-black text-[#2D3A5E] uppercase block">
                          Recommended Hospital Center:
                        </span>
                        {msg.suggestedHospitals.map(normalizeHospital).filter(Boolean).map((hosp) => (
                          <div key={hosp._id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-300 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#2D3A5E] shrink-0" />
                              <div>
                                <h5 className="text-xs font-black text-slate-900">{hosp.name}</h5>
                                <p className="text-[10px] text-slate-600 font-bold">{hosp.city} • JCI/NABH Accredited</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (setActiveTab) setActiveTab('hospitals');
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-[#2D3A5E] text-white text-[11px] font-black rounded hover:bg-[#1A233D] shrink-0 cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 font-bold block text-right pt-0.5">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* User Icon for User Messages */}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#2D3A5E] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-1 border border-[#8FA9FF]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Analyzing Spinner */}
              {isAnalyzing && (
                <div className="flex gap-3 items-center text-slate-600 text-xs font-bold bg-white p-3 rounded-xl border border-slate-200 w-fit">
                  <img src="/nova_avatar.png" alt="Nova" className="w-6 h-6 rounded-full object-cover border border-[#8FA9FF] animate-pulse" />
                  <span>Nova is thinking & retrieving healthcare insights...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t-2 border-slate-200 space-y-2 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask Nova about doctors, visa, costs, or symptoms..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFormSubmit(e);
                    }
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 placeholder-slate-400 font-bold text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 focus:bg-white focus:border-[#8FA9FF] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !userInput.trim()}
                  className="absolute right-1.5 p-2 bg-[#2D3A5E] hover:bg-[#1A233D] text-white rounded-lg disabled:opacity-50 transition cursor-pointer"
                  title="Send message to Nova"
                >
                  <Send className="w-4 h-4 text-[#8FA9FF]" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
