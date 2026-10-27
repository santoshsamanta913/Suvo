import React, { useState } from 'react';
import { Settings, Moon, Sun, Shield, FileText, Info, Sparkles, Check, ChevronRight } from 'lucide-react';
import { AdMobBanner } from './AdMobBanner';

interface SettingsTabProps {
  onOpenPro: () => void;
  isPro: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onOpenPro, isPro }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [exportQuality, setExportQuality] = useState('High');

  return (
    <div className="pb-24 pt-4 px-4 overflow-y-auto max-w-lg mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs text-zinc-400">Manage preferences and account options</p>
      </div>

      <AdMobBanner onUpgradeClick={onOpenPro} isPro={isPro} />

      {/* Monetization card */}
      {!isPro && (
        <div
          onClick={onOpenPro}
          className="bg-gradient-to-r from-violet-900/40 via-indigo-900/40 to-pink-900/40 border border-violet-500/30 rounded-3xl p-5 my-4 cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm group-hover:text-violet-300 transition">Rinu Pro Member</h3>
                <p className="text-xs text-zinc-400">Unlock all AI tools & remove ads</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition" />
          </div>
        </div>
      )}

      {/* Appearance Section */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Appearance</p>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Moon className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium">Dark Theme</span>
            </div>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5 accent-violet-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Preferences</p>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Auto-save Edits</p>
              <p className="text-xs text-zinc-500">Automatically save to history</p>
            </div>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={() => setAutoSave(!autoSave)}
              className="w-5 h-5 accent-violet-600 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Default Export Quality</p>
              <p className="text-xs text-zinc-500">Current: {exportQuality}</p>
            </div>
            <select
              value={exportQuality}
              onChange={(e) => setExportQuality(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-xs rounded-xl px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="Standard">Standard</option>
              <option value="High">High</option>
              <option value="Maximum">Maximum</option>
            </select>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">About & Legal</p>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80 text-sm">
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/40 transition">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/40 transition">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-pink-400" />
              <span>Terms of Service</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Version</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">v2.4.0 (Production)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
