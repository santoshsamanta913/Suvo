import React from 'react';
import { Sparkles } from 'lucide-react';

interface AdMobBannerProps {
  onUpgradeClick?: () => void;
  isPro?: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ onUpgradeClick, isPro }) => {
  if (isPro) return null;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 my-2 flex items-center justify-between text-xs shadow-md">
      <div className="flex items-center space-x-2.5 overflow-hidden">
        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
          Ad
        </span>
        <div className="truncate">
          <p className="text-zinc-200 font-medium truncate">Upgrade to Rinu Pro - Remove Ads & Unlock AI</p>
          <p className="text-zinc-400 text-[10px] truncate">AdMob Test ID: ca-app-pub-3940256099942544/6300978111</p>
        </div>
      </div>
      <button
        onClick={onUpgradeClick}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-3 py-1.5 rounded-md text-[11px] shrink-0 transition shadow flex items-center space-x-1"
      >
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span>Go Pro</span>
      </button>
    </div>
  );
};
