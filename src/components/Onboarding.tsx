import React, { useState } from 'react';
import { Sparkles, Wand2, Share2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const screens = [
    {
      title: "Edit Smarter with AI",
      subtitle: "AI-powered photo editing made simple and professional. Transform your images in seconds with Gemini AI.",
      icon: <Sparkles className="w-16 h-16 text-violet-400 animate-pulse" />,
      badge: "Welcome to Rinu"
    },
    {
      title: "Describe Your Edit",
      subtitle: "Simply tell AI what you want to change. Remove backgrounds, enhance lighting, or apply artistic styles with natural language.",
      icon: <Wand2 className="w-16 h-16 text-indigo-400 animate-bounce" />,
      badge: "Natural Language AI"
    },
    {
      title: "Create & Share Anywhere",
      subtitle: "Export high-resolution masterpieces, compare before/after instantly, and share directly to Instagram, WhatsApp, and more.",
      icon: <Share2 className="w-16 h-16 text-pink-400" />,
      badge: "Professional Export"
    }
  ];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('rinu_onboarded', 'true');
      onComplete();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-lg">
            R
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Rinu AI
          </span>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('rinu_onboarded', 'true');
            onComplete();
          }}
          className="text-zinc-400 hover:text-white text-sm font-medium transition"
        >
          Skip
        </button>
      </div>

      {/* Center Content */}
      <div className="my-auto flex flex-col items-center text-center px-4 max-w-sm mx-auto">
        <div className="w-32 h-32 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shadow-2xl mb-8 relative group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-pink-600/25 blur-xl -z-10"></div>
          {screens[step].icon}
        </div>

        <span className="inline-block bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {screens[step].badge}
        </span>

        <h2 className="text-2xl font-bold mb-3 tracking-tight">{screens[step].title}</h2>
        <p className="text-zinc-400 text-sm leading-relaxed">{screens[step].subtitle}</p>
      </div>

      {/* Footer / Pagination & CTA */}
      <div className="pb-8 pt-4">
        <div className="flex justify-center space-x-2 mb-6">
          {screens.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-violet-500' : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition"
        >
          <span>{step === screens.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
