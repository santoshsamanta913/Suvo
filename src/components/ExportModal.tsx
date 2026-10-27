import React, { useState } from 'react';
import { Download, Share2, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSaveHistory: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onSaveHistory,
}) => {
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [quality, setQuality] = useState<'standard' | 'high' | 'maximum'>('high');
  const [saved, setSaved] = useState(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState(true);

  if (!isOpen) return null;

  const handleDownload = () => {
    onSaveHistory();
    setSaved(true);

    // Create download link
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `rinu-edited-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        const file = new File([blob], `rinu-edit.${format}`, { type: blob.type });
        await navigator.share({
          title: 'Edited with Rinu AI Photo Editor',
          files: [file],
        });
      } catch (e) {
        console.log('Share fallback');
      }
    } else {
      alert('Link copied to clipboard for sharing!');
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Simulated AdMob Interstitial on export first open */}
      {showInterstitialAd && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full relative">
            <span className="absolute top-3 left-3 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              AdMob Interstitial Ad
            </span>
            <button
              onClick={() => setShowInterstitialAd(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-pink-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl my-6">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Discover Rinu Pro</h3>
            <p className="text-xs text-zinc-400 mb-6">Remove all ads, unlock pro filters & maximum export quality.</p>
            <button
              onClick={() => setShowInterstitialAd(false)}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition"
            >
              Continue to Export (5s)
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 text-white relative shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Export & Save</h2>
              <p className="text-xs text-zinc-400">Save to your device or share instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Photo saved successfully!</h3>
            <p className="text-xs text-zinc-400">Saved to device gallery & recent history.</p>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-sm font-semibold flex items-center justify-center space-x-2 transition"
              >
                <Share2 className="w-4 h-4 text-violet-400" />
                <span>Share</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-2xl text-sm font-semibold shadow-lg shadow-violet-600/30 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat('jpg')}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                      format === 'jpg'
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    JPG (Smaller size)
                  </button>
                  <button
                    onClick={() => setFormat('png')}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                      format === 'png'
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    PNG (Lossless quality)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Export Quality
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'high', 'maximum'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2.5 rounded-xl text-xs font-semibold capitalize border transition ${
                        quality === q
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition mb-2"
            >
              <Download className="w-4 h-4" />
              <span>Save to Device</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
