import React from 'react';
import { Clock, Share2, Trash2, ImageIcon, Sparkles } from 'lucide-react';
import { HistoryItem } from '../types';
import { AdMobBanner } from './AdMobBanner';

interface HistoryTabProps {
  history: HistoryItem[];
  onOpenImage: (imageSrc: string) => void;
  onDeleteHistory: (id: string) => void;
  onOpenPro: () => void;
  isPro: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  onOpenImage,
  onDeleteHistory,
  onOpenPro,
  isPro,
}) => {
  return (
    <div className="pb-24 pt-4 px-4 overflow-y-auto max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Edit History</h1>
          <p className="text-xs text-zinc-400">Your recently edited photos and projects</p>
        </div>
        <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold px-3 py-1 rounded-full">
          {history.length} Saved
        </span>
      </div>

      <AdMobBanner onUpgradeClick={onOpenPro} isPro={isPro} />

      {history.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No edits yet</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Your edited masterpieces will appear here automatically when you save or export them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-between"
            >
              <div
                onClick={() => onOpenImage(item.thumbnail)}
                className="aspect-square w-full bg-zinc-950 overflow-hidden relative cursor-pointer"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white">
                  {item.filter}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-[100px]">{item.title}</p>
                  <p className="text-[10px] text-zinc-500">{item.date}</p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
