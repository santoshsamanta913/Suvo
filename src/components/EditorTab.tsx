import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Undo2, Redo2, SlidersHorizontal, Wand2, Sparkle,
  Crop as CropIcon, Type, Edit3, Download, Columns2 as Compare, RotateCw,
  FlipHorizontal, FlipVertical, Check, X, Plus, Trash2, RefreshCcw
} from 'lucide-react';
import { EditState, ManualAdjustments, TextOverlay, DrawPath } from '../types';

interface EditorTabProps {
  initialImage: string;
  onBack: () => void;
  onOpenAiModal: () => void;
  onOpenExportModal: () => void;
  onSaveToHistory: (state: EditState) => void;
}

export const EditorTab: React.FC<EditorTabProps> = ({
  initialImage,
  onBack,
  onOpenAiModal,
  onOpenExportModal,
  onSaveToHistory,
}) => {
  const [activeTool, setActiveTool] = useState<'adjust' | 'filters' | 'crop' | 'text' | 'draw' | null>('adjust');
  const [adjustCategory, setAdjustCategory] = useState<keyof ManualAdjustments>('brightness');
  const [isComparing, setIsComparing] = useState(false);

  // Edit state
  const [editState, setEditState] = useState<EditState>({
    image: initialImage,
    originalImage: initialImage,
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      warmth: 0,
      sharpness: 0,
      blur: 0,
    },
    filter: 'normal',
    crop: {
      aspect: 'free',
      rotation: 0,
      flipH: false,
      flipV: false,
    },
    texts: [],
    drawings: [],
  });

  // History stack for Undo/Redo
  const [historyStack, setHistoryStack] = useState<EditState[]>([editState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // New Text input state
  const [newTextContent, setNewTextContent] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pushHistory = (newState: EditState) => {
    const updatedStack = historyStack.slice(0, historyIndex + 1);
    updatedStack.push(newState);
    setHistoryStack(updatedStack);
    setHistoryIndex(updatedStack.length - 1);
    setEditState(newState);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditState(historyStack[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditState(historyStack[newIndex]);
    }
  };

  const updateAdjustment = (key: keyof ManualAdjustments, value: number) => {
    const updated = {
      ...editState,
      adjustments: {
        ...editState.adjustments,
        [key]: value,
      },
    };
    pushHistory(updated);
  };

  const applyFilter = (filterName: string) => {
    const updated = { ...editState, filter: filterName };
    pushHistory(updated);
  };

  const addTextOverlay = () => {
    if (!newTextContent.trim()) return;
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: newTextContent,
      x: 50,
      y: 50,
      fontSize: 24,
      color: textColor,
      bold: true,
      italic: false,
      alignment: 'center',
    };
    const updated = {
      ...editState,
      texts: [...editState.texts, newText],
    };
    pushHistory(updated);
    setNewTextContent('');
  };

  const removeText = (id: string) => {
    const updated = {
      ...editState,
      texts: editState.texts.filter(t => t.id !== id),
    };
    pushHistory(updated);
  };

  // Compute CSS filter string based on adjustments & filter
  const getFilterStyle = () => {
    const { adjustments, filter } = editState;
    const brightnessVal = 100 + adjustments.brightness + (adjustments.exposure * 0.5);
    const contrastVal = 100 + adjustments.contrast;
    const saturateVal = 100 + adjustments.saturation;
    const blurVal = adjustments.blur * 0.1;

    let filterString = `brightness(${brightnessVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%) blur(${blurVal}px)`;

    if (filter === 'vivid') filterString += ' saturate(140%) contrast(110%)';
    if (filter === 'warm') filterString += ' sepia(30%) hue-rotate(-10deg)';
    if (filter === 'cool') filterString += ' hue-rotate(20deg) saturate(110%)';
    if (filter === 'cinematic') filterString += ' contrast(130%) brightness(95%) sepia(20%)';
    if (filter === 'vintage') filterString += ' sepia(60%) contrast(110%) brightness(90%)';
    if (filter === 'bw') filterString += ' grayscale(100%) contrast(120%)';
    if (filter === 'portrait') filterString += ' brightness(105%) contrast(105%) saturate(105%)';
    if (filter === 'drama') filterString += ' contrast(150%) saturate(80%)';
    if (filter === 'soft') filterString += ' brightness(105%) contrast(90%) blur(0.2px)';

    return filterString;
  };

  const getTransformStyle = () => {
    const { rotation, flipH, flipV } = editState.crop;
    return `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;
  };

  const filtersList = [
    { name: 'normal', label: 'Original' },
    { name: 'vivid', label: 'Vivid' },
    { name: 'warm', label: 'Warm' },
    { name: 'cool', label: 'Cool' },
    { name: 'cinematic', label: 'Cinematic' },
    { name: 'vintage', label: 'Vintage' },
    { name: 'bw', label: 'B&W' },
    { name: 'portrait', label: 'Portrait' },
    { name: 'drama', label: 'Drama' },
    { name: 'soft', label: 'Soft' },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-zinc-950 flex flex-col justify-between text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">Editor</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === historyStack.length - 1}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onMouseDown={() => setIsComparing(true)}
            onMouseUp={() => setIsComparing(false)}
            onTouchStart={() => setIsComparing(true)}
            onTouchEnd={() => setIsComparing(false)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              isComparing ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Hold to Compare"
          >
            <Compare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </button>
          <button
            onClick={() => onSaveToHistory(editState)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-violet-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Center Image Preview Workspace */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-zinc-950">
        <div className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src={isComparing ? editState.originalImage : editState.image}
            alt="Workspace Preview"
            style={{
              filter: isComparing ? 'none' : getFilterStyle(),
              transform: getTransformStyle(),
            }}
            className="max-h-[55vh] sm:max-h-[62vh] object-contain transition-all duration-200 select-none"
          />

          {/* Text Overlays Render */}
          {!isComparing && editState.texts.map((t) => (
            <div
              key={t.id}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                color: t.color,
                fontSize: `${t.fontSize}px`,
                fontWeight: t.bold ? 'bold' : 'normal',
                fontStyle: t.italic ? 'italic' : 'normal',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move group bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10"
            >
              <span>{t.text}</span>
              <button
                onClick={() => removeText(t.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Panels */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3">
        {/* Adjust Panel */}
        {activeTool === 'adjust' && (
          <div className="mb-3 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 capitalize">{adjustCategory}</span>
              <span className="text-xs font-mono text-violet-400">{editState.adjustments[adjustCategory]}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={editState.adjustments[adjustCategory]}
              onChange={(e) => updateAdjustment(adjustCategory, parseInt(e.target.value))}
              className="w-full accent-violet-600 bg-zinc-800 h-2 rounded-lg cursor-pointer mb-3"
            />
            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {(['brightness', 'contrast', 'saturation', 'exposure', 'highlights', 'shadows', 'warmth', 'sharpness', 'blur'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAdjustCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize shrink-0 transition ${
                    adjustCategory === cat
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {activeTool === 'filters' && (
          <div className="mb-3 animate-in fade-in overflow-x-auto">
            <div className="flex space-x-3 pb-1 scrollbar-none">
              {filtersList.map((f) => (
                <button
                  key={f.name}
                  onClick={() => applyFilter(f.name)}
                  className={`flex flex-col items-center shrink-0 group`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition ${
                      editState.filter === f.name ? 'border-violet-500 scale-105' : 'border-zinc-800 opacity-80'
                    }`}
                  >
                    <img src={editState.originalImage} alt={f.label} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[11px] mt-1 font-medium ${editState.filter === f.name ? 'text-violet-400 font-bold' : 'text-zinc-400'}`}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Crop & Rotate Panel */}
        {activeTool === 'crop' && (
          <div className="mb-3 animate-in fade-in flex items-center justify-around py-1">
            <button
              onClick={() => {
                const updated = {
                  ...editState,
                  crop: { ...editState.crop, rotation: (editState.crop.rotation + 90) % 360 },
                };
                pushHistory(updated);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
            >
              <RotateCw className="w-5 h-5 mb-1 text-violet-400" />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={() => {
                const updated = {
                  ...editState,
                  crop: { ...editState.crop, flipH: !editState.crop.flipH },
                };
                pushHistory(updated);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
            >
              <FlipHorizontal className="w-5 h-5 mb-1 text-indigo-400" />
              <span>Flip H</span>
            </button>
            <button
              onClick={() => {
                const updated = {
                  ...editState,
                  crop: { ...editState.crop, flipV: !editState.crop.flipV },
                };
                pushHistory(updated);
              }}
              className="flex flex-col items-center p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
            >
              <FlipVertical className="w-5 h-5 mb-1 text-pink-400" />
              <span>Flip V</span>
            </button>
          </div>
        )}

        {/* Text Tool Panel */}
        {activeTool === 'text' && (
          <div className="mb-3 animate-in fade-in flex space-x-2">
            <input
              type="text"
              value={newTextContent}
              onChange={(e) => setNewTextContent(e.target.value)}
              placeholder="Type caption or watermark..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-9 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer p-1"
            />
            <button
              onClick={addTextOverlay}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-semibold shadow transition"
            >
              Add
            </button>
          </div>
        )}

        {/* Bottom Navigation Toolbar */}
        <div className="flex justify-between items-center overflow-x-auto pt-2 border-t border-zinc-800/80 scrollbar-none space-x-4">
          <button
            onClick={onOpenAiModal}
            className="flex flex-col items-center shrink-0 group py-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mb-1 shadow-md group-hover:scale-105 transition">
              <Wand2 className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[11px] font-bold text-violet-400">AI Edit</span>
          </button>

          <button
            onClick={() => setActiveTool('adjust')}
            className={`flex flex-col items-center shrink-0 group py-1 ${activeTool === 'adjust' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition ${activeTool === 'adjust' ? 'bg-violet-600/30 border border-violet-500 text-violet-300' : 'bg-zinc-800 text-zinc-300'}`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-zinc-300">Adjust</span>
          </button>

          <button
            onClick={() => setActiveTool('filters')}
            className={`flex flex-col items-center shrink-0 group py-1 ${activeTool === 'filters' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition ${activeTool === 'filters' ? 'bg-violet-600/30 border border-violet-500 text-violet-300' : 'bg-zinc-800 text-zinc-300'}`}>
              <Sparkle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-zinc-300">Filters</span>
          </button>

          <button
            onClick={() => setActiveTool('crop')}
            className={`flex flex-col items-center shrink-0 group py-1 ${activeTool === 'crop' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition ${activeTool === 'crop' ? 'bg-violet-600/30 border border-violet-500 text-violet-300' : 'bg-zinc-800 text-zinc-300'}`}>
              <CropIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-zinc-300">Crop</span>
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`flex flex-col items-center shrink-0 group py-1 ${activeTool === 'text' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition ${activeTool === 'text' ? 'bg-violet-600/30 border border-violet-500 text-violet-300' : 'bg-zinc-800 text-zinc-300'}`}>
              <Type className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-zinc-300">Text</span>
          </button>
        </div>
      </div>
    </div>
  );
};
