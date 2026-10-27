import React from 'react';
import { Sparkles, CheckCircle2, X, ShieldCheck, Zap } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  const benefits = [
    "Unlimited AI Edits & Pro Assistant",
    "Advanced AI tools (Background removal, Object eraser)",
    "Maximum resolution & pristine export quality",
    "Ad-free professional editing experience",
    "Exclusive cinematic & vintage filter packs"
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 text-white relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-violet-600 to-pink-600 mx-auto flex items-center justify-center shadow-lg mb-3">
            <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
          </div>
          <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Rinu Pro
          </span>
          <h2 className="text-2xl font-bold mt-2">Unlock Pro Editing</h2>
          <p className="text-zinc-400 text-sm mt-1">Supercharge your photos with advanced AI capabilities.</p>
        </div>

        <div className="space-y-3 mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-zinc-200">{b}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-violet-300 font-medium">Special Offer</p>
            <p className="text-lg font-bold text-white">$4.99 <span className="text-xs text-zinc-400 font-normal">/ month (Cancel anytime)</span></p>
          </div>
          <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            7-Day Free Trial
          </span>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition mb-3"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Start 7-Day Free Trial</span>
        </button>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-zinc-400 hover:text-white text-xs font-medium transition text-center"
        >
          Continue with Free Version
        </button>

        <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-500 mt-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure Google Play billing integration ready</span>
        </div>
      </div>
    </div>
  );
};
