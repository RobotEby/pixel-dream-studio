import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download } from 'lucide-react';

interface ExportDialogProps {
  pixels: string[];
  boardSize: number;
}

export function ExportDialog({ pixels, boardSize }: ExportDialogProps) {
  const [scale, setScale] = useState(2);

  const handleExport = useCallback(() => {
    const canvas = document.createElement('canvas');
    const size = boardSize * scale;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    pixels.forEach((color, i) => {
      const x = (i % boardSize) * scale;
      const y = Math.floor(i / boardSize) * scale;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, scale, scale);
    });
    const link = document.createElement('a');
    link.download = `pixel-art-${scale}x.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [pixels, boardSize, scale]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-3 w-3 mr-1" /> Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Exportar PNG</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {[1, 2, 4, 8].map((s) => (
            <Button
              key={s}
              variant={scale === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScale(s)}
            >
              {s}x
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Resolução: {boardSize * scale} × {boardSize * scale}px
        </p>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Baixar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
