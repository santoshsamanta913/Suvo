import React from 'react';
import { Sparkles, Wand2, Image as ImageIcon, Sliders, Eraser, Sparkle, Camera, Settings, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';
import { HistoryItem } from '../types';

interface HomeTabProps {
  onStartEditing: (sampleImage?: string) => void;
  onOpenAiModal: () => void;
  onOpenSettings: () => void;
  onOpenPro: () => void;
  history: HistoryItem[];
  isPro: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onStartEditing,
  onOpenAiModal,
  onOpenSettings,
  onOpenPro,
  history,
  isPro,
}) => {
  const samplePhotos = [
    { name: 'Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Landscape', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80' },
    { name: 'Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { name: 'Product', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  ];

  const quickActions = [
    { title: 'AI Edit', icon: <Wand2 className="w-5 h-5 text-violet-400" />, onClick: onOpenAiModal },
    { title: 'Enhance', icon: <Sparkles className="w-5 h-5 text-amber-400" />, onClick: () => onStartEditing(samplePhotos[0].url) },
    { title: 'Remove BG', icon: <Eraser className="w-5 h-5 text-pink-400" />, onClick: () => onStartEditing(samplePhotos[0].url) },
    { title: 'Filters', icon: <Sparkle className="w-5 h-5 text-indigo-400" />, onClick: () => onStartEditing(samplePhotos[0].url) },
    { title: 'Adjust', icon: <Sliders className="w-5 h-5 text-cyan-400" />, onClick: () => onStartEditing(samplePhotos[0].url) },
  ];

  return (
    <div className="pb-24 pt-4 px-4 overflow-y-auto max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30 text-lg">
            R
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-tight">Rinu</h1>
            <p className="text-[11px] text-zinc-400 font-medium">AI Photo Editor</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isPro && (
            <button
              onClick={onOpenPro}
              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro</span>
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AdMob Banner */}
      <AdMobBanner onUpgradeClick={onOpenPro} isPro={isPro} />

      {/* Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-violet-900/40 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 mb-6 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <span className="inline-block bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
          Powered by Gemini AI
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Create better photos with AI</h2>
        <p className="text-zinc-400 text-xs leading-relaxed mb-5 max-w-xs">
          Edit, enhance, and transform your photos in seconds with intelligent natural language instructions.
        </p>

        <div className="flex space-x-3">
          <label className="flex-1 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 cursor-pointer transition text-sm">
            <ImageIcon className="w-4 h-4" />
            <span>Choose Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      onStartEditing(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          <button
            onClick={() => onStartEditing(samplePhotos[0].url)}
            className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-sm font-semibold text-white transition flex items-center space-x-1"
          >
            <span>Demo</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              onClick={qa.onClick}
              className="flex flex-col items-center justify-center bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 p-3 rounded-2xl transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition shadow-md">
                {qa.icon}
              </div>
              <span className="text-[11px] font-medium text-zinc-300 text-center truncate w-full">
                {qa.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sample Photos for Quick Start */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Try with Sample Photos</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {samplePhotos.map((sp, i) => (
            <div
              key={i}
              onClick={() => onStartEditing(sp.url)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer border border-zinc-800 aspect-[4/3] bg-zinc-900"
            >
              <img
                src={sp.url}
                alt={sp.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-white">{sp.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Edits Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Edits</span>
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-zinc-300">No edits yet</p>
            <p className="text-xs text-zinc-500 mt-1">Choose a photo above to get started.</p>
          </div>
        ) : (
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onStartEditing(item.thumbnail)}
                className="w-28 shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-square w-full bg-zinc-800 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-zinc-200 truncate">{item.title}</p>
                  <p className="text-[9px] text-zinc-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
