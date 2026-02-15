import { useCallback, useRef, useEffect, useState } from 'react';

interface PixelBoardProps {
  pixels: string[];
  boardSize: number;
  showGrid: boolean;
  templateImage: string | null;
  isPainting: boolean;
  onPaintPixel: (index: number) => void;
  onPaintStart: () => void;
  onPaintEnd: () => void;
}

export function PixelBoard({
  pixels,
  boardSize,
  showGrid,
  templateImage,
  isPainting,
  onPaintPixel,
  onPaintStart,
  onPaintEnd,
}: PixelBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef<number>(-1);
  const [pixelSize, setPixelSize] = useState(16);

  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const available = Math.min(rect.width - 16, rect.height - 16);
      const size = Math.floor(available / boardSize);
      setPixelSize(Math.max(4, Math.min(24, size)));
    };
    calculate();
    const observer = new ResizeObserver(calculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [boardSize]);

  const getIndexFromPoint = useCallback(
    (x: number, y: number): number | null => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const col = Math.floor((x - rect.left) / pixelSize);
      const row = Math.floor((y - rect.top) / pixelSize);
      if (col < 0 || col >= boardSize || row < 0 || row >= boardSize) return null;
      return row * boardSize + col;
    },
    [boardSize, pixelSize]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      onPaintStart();
      const index = getIndexFromPoint(e.clientX, e.clientY);
      if (index !== null) {
        lastIndexRef.current = index;
        onPaintPixel(index);
      }
    },
    [onPaintStart, onPaintPixel, getIndexFromPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPainting) return;
      const index = getIndexFromPoint(e.clientX, e.clientY);
      if (index !== null && index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        onPaintPixel(index);
      }
    },
    [isPainting, onPaintPixel, getIndexFromPoint]
  );

  const handlePointerUp = useCallback(() => {
    lastIndexRef.current = -1;
    onPaintEnd();
  }, [onPaintEnd]);

  const totalSize = pixelSize * boardSize;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div className="relative inline-block rounded-lg bg-card shadow-sm border border-border">
        {templateImage && (
          <img
            src={templateImage}
            alt="Template"
            className="absolute inset-0 opacity-20 pointer-events-none object-cover rounded"
            style={{ width: totalSize, height: totalSize }}
          />
        )}
        <div
          ref={boardRef}
          id="pixel-board"
          className="relative z-10 touch-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, ${pixelSize}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${pixelSize}px)`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          {pixels.map((color, i) => (
            <div
              key={i}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color,
                boxSizing: 'border-box',
                border: showGrid ? '0.5px solid hsl(var(--border) / 0.5)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
