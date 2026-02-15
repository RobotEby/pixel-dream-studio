import { useState, useCallback, useRef } from 'react';
import {
  Tool,
  PaletteName,
  PALETTES,
  DEFAULT_BOARD_SIZE,
  DEFAULT_COLOR,
  MIN_BOARD_SIZE,
  MAX_BOARD_SIZE,
  PixelArtProject,
} from '@/types/pixel-art';

function createEmptyGrid(size: number): string[] {
  return new Array(size * size).fill(DEFAULT_COLOR);
}

export function usePixelArt() {
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [pixels, setPixels] = useState<string[]>(() => createEmptyGrid(DEFAULT_BOARD_SIZE));
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [currentPalette, setCurrentPalette] = useState<PaletteName>('basic');
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('brush');
  const [showGrid, setShowGrid] = useState(true);
  const [isPainting, setIsPainting] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templateImage, setTemplateImage] = useState<string | null>(null);

  const pushHistory = useCallback(
    (newPixels: string[]) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, newPixels];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const updatePixels = useCallback(
    (newPixels: string[]) => {
      setPixels(newPixels);
      pushHistory(newPixels);
    },
    [pushHistory]
  );

  const paintPixel = useCallback(
    (index: number) => {
      if (activeTool === 'eyedropper') {
        setSelectedColor(pixels[index]);
        setActiveTool('brush');
        return;
      }
      if (activeTool === 'bucket') {
        const targetColor = pixels[index];
        if (targetColor === selectedColor) return;
        const newPixels = [...pixels];
        const stack = [index];
        const visited = new Set<number>();
        while (stack.length > 0) {
          const i = stack.pop()!;
          if (visited.has(i) || newPixels[i] !== targetColor) continue;
          visited.add(i);
          newPixels[i] = selectedColor;
          const row = Math.floor(i / boardSize);
          const col = i % boardSize;
          if (col > 0) stack.push(i - 1);
          if (col < boardSize - 1) stack.push(i + 1);
          if (row > 0) stack.push(i - boardSize);
          if (row < boardSize - 1) stack.push(i + boardSize);
        }
        updatePixels(newPixels);
        return;
      }
      const newPixels = [...pixels];
      newPixels[index] = selectedColor;
      setPixels(newPixels);
    },
    [activeTool, pixels, selectedColor, boardSize, updatePixels]
  );

  const commitBrushStroke = useCallback(() => {
    pushHistory(pixels);
  }, [pixels, pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setPixels(history[newIndex]);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setPixels(history[newIndex]);
  }, [history, historyIndex]);

  const clearBoard = useCallback(() => {
    const empty = createEmptyGrid(boardSize);
    updatePixels(empty);
  }, [boardSize, updatePixels]);

  const changeBoardSize = useCallback((newSize: number) => {
    const clamped = Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, newSize));
    setBoardSize(clamped);
    const empty = createEmptyGrid(clamped);
    setPixels(empty);
    setHistory([empty]);
    setHistoryIndex(0);
  }, []);

  const switchPalette = useCallback((name: PaletteName) => {
    setCurrentPalette(name);
    setSelectedColor(PALETTES[name][0]);
  }, []);

  const addCustomColor = useCallback(
    (color: string) => {
      if (!customColors.includes(color)) {
        setCustomColors((prev) => [...prev, color]);
      }
      setSelectedColor(color);
    },
    [customColors]
  );

  const generateRandomPalette = useCallback(() => {
    const colors: string[] = [];
    const baseHue = Math.random() * 360;
    for (let i = 0; i < 8; i++) {
      const hue = (baseHue + i * 45) % 360;
      const sat = 60 + Math.random() * 30;
      const lit = 45 + Math.random() * 25;
      colors.push(`hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`);
    }
    setCustomColors(colors);
    setSelectedColor(colors[0]);
  }, []);

  const saveProject = useCallback(() => {
    const project: PixelArtProject = {
      size: boardSize,
      pixels,
      palette: currentPalette,
    };
    localStorage.setItem('pixelArtProject', JSON.stringify(project));
  }, [boardSize, pixels, currentPalette]);

  const loadProject = useCallback((): boolean => {
    const data = localStorage.getItem('pixelArtProject');
    if (!data) return false;
    const project: PixelArtProject = JSON.parse(data);
    setBoardSize(project.size);
    setPixels(project.pixels);
    setCurrentPalette(project.palette);
    setSelectedColor(PALETTES[project.palette][0]);
    setHistory([project.pixels]);
    setHistoryIndex(0);
    return true;
  }, []);

  return {
    boardSize,
    pixels,
    selectedColor,
    currentPalette,
    customColors,
    activeTool,
    showGrid,
    isPainting,
    templateImage,
    historyIndex,
    history,
    setSelectedColor,
    setActiveTool,
    setShowGrid,
    setIsPainting,
    setTemplateImage,
    paintPixel,
    commitBrushStroke,
    clearBoard,
    changeBoardSize,
    switchPalette,
    addCustomColor,
    generateRandomPalette,
    saveProject,
    loadProject,
    undo,
    redo,
  };
}
