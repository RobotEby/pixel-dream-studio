import { useCallback, useEffect } from 'react';
import { usePixelArt } from '@/hooks/usePixelArt';
import { ToolBar } from '@/components/pixel-art/ToolBar';
import { ColorPalette } from '@/components/pixel-art/ColorPalette';
import { BrushPreview } from '@/components/pixel-art/BrushPreview';
import { PixelBoard } from '@/components/pixel-art/PixelBoard';
import { ExportDialog } from '@/components/pixel-art/ExportDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Save, FolderOpen, Grid3X3, Upload, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from '@/types/pixel-art';

export default function Index() {
  const art = usePixelArt();
  const [sizeInput, setSizeInput] = useState(String(art.boardSize));
  const [isDark, setIsDark] = useState(false);

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
    setSizeInput(String(Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, n))));
  }, [sizeInput, art]);

  const handleTemplateUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => art.setTemplateImage(reader.result as string);
      reader.readAsDataURL(file);
    },
    [art]
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="mx-auto max-w-4xl text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          🎨 Pixel Art Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Crie pixel art direto no navegador</p>
      </header>

      <main className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ToolBar
            activeTool={art.activeTool}
            onToolChange={art.setActiveTool}
            onUndo={art.undo}
            onRedo={art.redo}
            canUndo={art.historyIndex > 0}
            canRedo={art.historyIndex < art.history.length - 1}
          />
          <BrushPreview color={art.selectedColor} tool={art.activeTool} />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="h-9 w-9"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <aside className="lg:w-64 space-y-4 shrink-0">
            <ColorPalette
              currentPalette={art.currentPalette}
              selectedColor={art.selectedColor}
              customColors={art.customColors}
              onSwitchPalette={art.switchPalette}
              onSelectColor={art.setSelectedColor}
              onAddCustomColor={art.addCustomColor}
              onGenerateRandom={art.generateRandomPalette}
            />

            <div className="space-y-2 rounded-lg border border-border bg-card p-3">
              <Label className="text-xs text-muted-foreground">Tamanho do quadro</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={MIN_BOARD_SIZE}
                  max={MAX_BOARD_SIZE}
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="h-8"
                />
                <Button size="sm" onClick={handleApplySize}>
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs flex-1">Grade</Label>
              <Switch checked={art.showGrid} onCheckedChange={art.setShowGrid} />
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" /> Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={handleLoad}>
                <FolderOpen className="h-3 w-3 mr-1" /> Carregar
              </Button>
              <Button variant="outline" size="sm" onClick={art.clearBoard}>
                <Trash2 className="h-3 w-3 mr-1" /> Limpar
              </Button>
              <ExportDialog pixels={art.pixels} boardSize={art.boardSize} />
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="w-full pointer-events-none">
                  <Upload className="h-3 w-3 mr-1" /> Template
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTemplateUpload}
                />
              </label>
              {art.templateImage && (
                <Button variant="ghost" size="sm" onClick={() => art.setTemplateImage(null)}>
                  Remover Template
                </Button>
              )}
            </div>
          </aside>

          <div className="flex-1 flex justify-center overflow-auto">
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
          </div>
        </div>
      </main>
    </div>
  );
}
