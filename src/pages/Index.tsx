import { useCallback, useEffect, useState } from 'react';
import { usePixelArt } from '@/hooks/usePixelArt';
import { MobileToolbar } from '@/components/pixel-art/MobileToolbar';
import { ColorPalette } from '@/components/pixel-art/ColorPalette';
import { BrushPreview } from '@/components/pixel-art/BrushPreview';
import { PixelBoard } from '@/components/pixel-art/PixelBoard';
import { ExportDialog } from '@/components/pixel-art/ExportDialog';
import { SettingsPanel } from '@/components/pixel-art/SettingsPanel';
import { toast } from 'sonner';

export default function Index() {
  const art = usePixelArt();
  const [sizeInput, setSizeInput] = useState(String(art.boardSize));
  const [isDark, setIsDark] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleSave = useCallback(() => {
    art.saveProject();
    toast.success('Projeto salvo!');
  }, [art]);

  const handleLoad = useCallback(() => {
    if (art.loadProject()) {
      toast.success('Projeto carregado!');
      setSizeInput(String(art.boardSize));
    } else {
      toast.error('Nenhum projeto salvo encontrado.');
    }
  }, [art]);

  const handleApplySize = useCallback(() => {
    const n = parseInt(sizeInput) || art.boardSize;
    art.changeBoardSize(n);
    setSizeInput(String(Math.min(50, Math.max(5, n))));
  }, [sizeInput, art]);

  const handleTemplateUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => art.setTemplateImage(reader.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  }, [art]);

  return (
    <div
      className="fixed inset-0 flex flex-col bg-background overflow-hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <header className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <h1 className="text-base font-bold text-foreground truncate"> Pixel Art Studio</h1>
        <BrushPreview color={art.selectedColor} tool={art.activeTool} />
      </header>

      {showPalette && (
        <div className="border-b border-border bg-card px-3 py-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
          <ColorPalette
            currentPalette={art.currentPalette}
            selectedColor={art.selectedColor}
            customColors={art.customColors}
            onSwitchPalette={art.switchPalette}
            onSelectColor={(c) => {
              art.setSelectedColor(c);
            }}
            onAddCustomColor={art.addCustomColor}
            onGenerateRandom={art.generateRandomPalette}
          />
        </div>
      )}

      {showSettings && (
        <div className="border-b border-border bg-card px-3 py-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
          <SettingsPanel
            sizeInput={sizeInput}
            setSizeInput={setSizeInput}
            onApplySize={handleApplySize}
            showGrid={art.showGrid}
            onToggleGrid={art.setShowGrid}
            isDark={isDark}
            onToggleDark={setIsDark}
            templateImage={art.templateImage}
            onUploadTemplate={handleTemplateUpload}
            onRemoveTemplate={() => art.setTemplateImage(null)}
            onSave={handleSave}
            onLoad={handleLoad}
            onClear={art.clearBoard}
          />
        </div>
      )}

      <main className="flex-1 flex items-center justify-center overflow-hidden p-2 touch-none">
        <PixelBoard
          pixels={art.pixels}
          boardSize={art.boardSize}
          showGrid={art.showGrid}
          templateImage={art.templateImage}
          isPainting={art.isPainting}
          onPaintPixel={art.paintPixel}
          onPaintStart={() => art.setIsPainting(true)}
          onPaintEnd={() => {
            art.setIsPainting(false);
            if (art.activeTool === 'brush') art.commitBrushStroke();
          }}
        />
      </main>

      <MobileToolbar
        activeTool={art.activeTool}
        onToolChange={art.setActiveTool}
        onUndo={art.undo}
        onRedo={art.redo}
        canUndo={art.historyIndex > 0}
        canRedo={art.historyIndex < art.history.length - 1}
        showPalette={showPalette}
        onTogglePalette={() => {
          setShowPalette(!showPalette);
          setShowSettings(false);
        }}
        showSettings={showSettings}
        onToggleSettings={() => {
          setShowSettings(!showSettings);
          setShowPalette(false);
        }}
        onExport={() => setShowExport(true)}
      />

      <ExportDialog
        pixels={art.pixels}
        boardSize={art.boardSize}
        open={showExport}
        onOpenChange={setShowExport}
      />
    </div>
  );
}
