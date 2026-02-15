export type Tool = 'brush' | 'eyedropper' | 'bucket';

export type PaletteName = 'basic' | 'pastel' | 'neon';

export interface PixelArtProject {
  size: number;
  pixels: string[];
  palette: PaletteName;
}

export const PALETTES: Record<PaletteName, string[]> = {
  basic: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#FFFF00', '#FFA500', '#800080'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E7CFFF', '#D4A5A5', '#C8E6C9'],
  neon: ['#FF00FF', '#00FFFF', '#FF0099', '#CCFF00', '#FF6600', '#33FF00', '#FF0066', '#00FF66'],
};

export const DEFAULT_BOARD_SIZE = 16;
export const MIN_BOARD_SIZE = 5;
export const MAX_BOARD_SIZE = 50;
export const DEFAULT_COLOR = '#FFFFFF';
