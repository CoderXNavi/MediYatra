import React from 'react';
import { ShieldAlert, Lock, UserCheck, ArrowLeft } from 'lucide-react';

export default function AccessDenied({ currentUser, onOpenAuth, onGoHome }) {
  return (
    <section className="py-16 max-w-4xl mx-auto px-4 text-center">
      <div className="portal-card p-10 bg-white border-2 border-red-300 rounded-3xl space-y-6 shadow-xl">
        
        <div className="w-20 h-20 bg-red-100 text-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner border-2 border-red-300">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-black rounded-full uppercase tracking-wider font-mono">
            HTTP 403 Forbidden Access
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-sans">
            Admin Portal Access Denied
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm font-extrabold max-w-lg mx-auto leading-relaxed">
            The MediYatra Platform Management System is strictly restricted to authenticated System Administrator accounts.
          </p>
          {currentUser ? (
            <div className="p-3 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-black rounded-xl max-w-md mx-auto mt-2">
              Current Identity: <span className="text-[#2D3A5E]">{currentUser.name}</span> ({currentUser.email}) • Role: <span className="text-red-700 font-mono">{currentUser.role || 'Patient'}</span>
            </div>
          ) : (
            <p className="text-slate-600 text-xs font-bold">You are currently not signed in.</p>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3 bg-[#2D3A5E] hover:bg-[#1A233D] text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-2 transition"
          >
            <UserCheck className="w-4 h-4 text-[#8FA9FF]" />
            <span>Sign In as Admin</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-300 flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#2D3A5E]" />
            <span>Return to Homepage</span>
          </button>
        </div>

      </div>
    </section>
  );
}
