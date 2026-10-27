export type TabType = 'home' | 'edit' | 'history' | 'settings';

export interface ManualAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  warmth: number; // -100 to 100
  sharpness: number; // -100 to 100
  blur: number; // 0 to 100
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  bgColor?: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
}

export interface DrawPath {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  isEraser: boolean;
}

export interface EditState {
  image: string; // base64 or url
  originalImage: string;
  adjustments: ManualAdjustments;
  filter: string;
  crop: {
    aspect: string; // 'free' | '1:1' | '4:5' | '16:9' | '9:16'
    rotation: number; // 0, 90, 180, 270
    flipH: boolean;
    flipV: boolean;
  };
  texts: TextOverlay[];
  drawings: DrawPath[];
}

export interface HistoryItem {
  id: string;
  thumbnail: string;
  date: string;
  title: string;
  adjustments: ManualAdjustments;
  filter: string;
}

export interface AdConfig {
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
}
