import React, { useState, useEffect } from 'react';
import { Home, Sliders, Clock, Settings, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { TabType, HistoryItem, EditState } from './types';
import { Onboarding } from './components/Onboarding';
import { HomeTab } from './components/HomeTab';
import { HistoryTab } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import { EditorTab } from './components/EditorTab';
import { AiEditModal } from './components/AiEditModal';
import { ExportModal } from './components/ExportModal';
import { PremiumModal } from './components/PremiumModal';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isPro, setIsPro] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const onboarded = localStorage.getItem('rinu_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }

    const savedHistory = localStorage.getItem('rinu_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const saveHistoryToStorage = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('rinu_history', JSON.stringify(newHistory));
  };

  const handleStartEditing = (imageSrc?: string) => {
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setIsEditing(true);
    }
  };

  const handleApplyAiEdit = async (instruction: string) => {
    try {
      const response = await fetch('/api/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage, instruction }),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      // If AI edit returned a simulated or processed result
      console.log('AI Edit result:', data.result);
      // We can also trigger success message or alert
    } catch (e) {
      console.error('AI Edit request failed:', e);
    }
  };

  const handleSaveEditState = (state: EditState) => {
    setIsExportModalOpen(true);
  };

  const handleConfirmSaveHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      thumbnail: selectedImage,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      title: 'AI Enhanced Photo',
      adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, highlights: 0, shadows: 0, warmth: 0, sharpness: 0, blur: 0 },
      filter: 'vivid',
    };
    const updated = [newItem, ...history];
    saveHistoryToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center font-sans select-none overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Bar helper for desktop preview framing */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-4 py-2 z-20 text-xs text-zinc-400">
        <div className="flex items-center space-x-1.5 font-bold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Rinu AI Photo Editor (Android M3 Experience)</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-300 hover:text-white transition"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isPhoneFrame ? 'Full View' : 'Phone Frame'}</span>
        </button>
      </div>

      {/* Container: Android Device Frame or Full Screen */}
      <div
        className={`relative bg-zinc-950 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
          isPhoneFrame
            ? 'w-full sm:w-[412px] sm:h-[860px] sm:rounded-[48px] sm:border-[8px] sm:border-zinc-800 sm:ring-1 sm:ring-white/10'
            : 'w-full h-screen'
        }`}
      >
        {/* Android status bar mock */}
        <div className="hidden sm:flex justify-between items-center px-6 pt-3 pb-1 text-[11px] font-semibold text-zinc-400 shrink-0 bg-zinc-950 z-30">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
          <div className="flex items-center space-x-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-zinc-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-zinc-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Onboarding Flow */}
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

        {/* Main Workspace Tabs */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {currentTab === 'home' && (
            <HomeTab
              onStartEditing={handleStartEditing}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onOpenSettings={() => setCurrentTab('settings')}
              onOpenPro={() => setIsProModalOpen(true)}
              history={history}
              isPro={isPro}
            />
          )}

          {currentTab === 'history' && (
            <HistoryTab
              history={history}
              onOpenImage={(img) => handleStartEditing(img)}
              onDeleteHistory={(id) => saveHistoryToStorage(history.filter((h) => h.id !== id))}
              onOpenPro={() => setIsProModalOpen(true)}
              isPro={isPro}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              onOpenPro={() => setIsProModalOpen(true)}
              isPro={isPro}
            />
          )}

          {/* Active Editor Workspace */}
          {isEditing && (
            <EditorTab
              initialImage={selectedImage}
              onBack={() => setIsEditing(false)}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onSaveToHistory={handleSaveEditState}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        {!isEditing && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-900/95 border-t border-zinc-800 backdrop-blur-md flex items-center justify-around px-2 z-30 shadow-lg">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                currentTab === 'home' ? 'text-violet-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => handleStartEditing('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')}
              className="flex flex-col items-center justify-center flex-1 py-1 text-zinc-400 hover:text-zinc-200 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 group-hover:scale-105 transition -mt-3">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">Edit</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                currentTab === 'history' ? 'text-violet-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-[10px]">History</span>
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                currentTab === 'settings' ? 'text-violet-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Settings</span>
            </button>
          </div>
        )}

        {/* Android Home indicator bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full pointer-events-none z-40"></div>
      </div>

      {/* Modals */}
      <AiEditModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyAi={handleApplyAiEdit}
        isPro={isPro}
        onOpenPro={() => setIsProModalOpen(true)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        imageSrc={selectedImage}
        onSaveHistory={handleConfirmSaveHistory}
      />

      <PremiumModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgrade={() => {
          setIsPro(true);
          setIsProModalOpen(false);
          alert('Successfully unlocked Rinu Pro!');
        }}
      />
    </div>
  );
}
