import React, { useState } from 'react';
import { Sparkles, Wand2, X, Loader2, Play } from 'lucide-react';

interface AiEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAi: (instruction: string) => Promise<void>;
  isPro: boolean;
  onOpenPro: () => void;
}

export const AiEditModal: React.FC<AiEditModalProps> = ({
  isOpen,
  onClose,
  onApplyAi,
  isPro,
  onOpenPro,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analyzing image...');

  if (!isOpen) return null;

  const presets = [
    { title: "Enhance Photo", desc: "Auto-fix lighting, clarity, and color vibrance" },
    { title: "Remove Background", desc: "Isolate subject and clean background" },
    { title: "Portrait Glow", desc: "Brighten face and soften skin tones naturally" },
    { title: "Cinematic Drama", desc: "Deep rich contrast with cinematic warmth" },
    { title: "Professional Studio", desc: "Crisp, professional product & portrait look" },
    { title: "Fix Blur & Sharpen", desc: "Restore clarity and crisp edge definition" },
  ];

  const handleGenerate = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setLoadingStep('Analyzing image with Gemini AI...');
    try {
      setTimeout(() => setLoadingStep('Applying AI adjustments...'), 1000);
      setTimeout(() => setLoadingStep('Finishing touches...'), 2000);
      await onApplyAi(text);
      setLoading(false);
      setPrompt('');
      onClose();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 text-white relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Photo Assistant</h2>
              <p className="text-xs text-zinc-400">Describe what you want to change</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-200">{loadingStep}</p>
            <p className="text-xs text-zinc-500">Powered by Google Gemini AI</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Brighten the face, make the sky more dramatic, or make it look like a professional studio photo..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none"
              />
            </div>

            <button
              onClick={() => handleGenerate(prompt || "Enhance this photo professionally")}
              disabled={!prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition mb-5"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Generate AI Edit</span>
            </button>

            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
                Popular AI Presets
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(p.title + ": " + p.desc)}
                    className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 p-3 rounded-xl text-left transition group"
                  >
                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-violet-400 flex items-center justify-between">
                      <span>{p.title}</span>
                      <Play className="w-3 h-3 text-zinc-500 group-hover:text-violet-400" />
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
