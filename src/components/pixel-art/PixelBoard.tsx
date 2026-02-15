import { useCallback, useRef } from 'react';

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
  const pixelSize = Math.max(12, Math.min(32, Math.floor(500 / boardSize)));

  const handleMouseDown = useCallback(
    (index: number) => {
      onPaintStart();
      onPaintPixel(index);
    },
    [onPaintStart, onPaintPixel]
  );

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (isPainting) onPaintPixel(index);
    },
    [isPainting, onPaintPixel]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
      if (el?.dataset?.index) {
        onPaintPixel(Number(el.dataset.index));
      }
    },
    [onPaintPixel]
  );

  return (
    <div className="relative inline-block rounded-lg bg-card p-2 shadow-sm border border-border">
      {templateImage && (
        <img
          src={templateImage}
          alt="Template"
          className="absolute inset-2 opacity-20 pointer-events-none object-cover rounded"
          style={{ width: `${pixelSize * boardSize}px`, height: `${pixelSize * boardSize}px` }}
        />
      )}
      <div
        ref={boardRef}
        id="pixel-board"
        className="grid relative z-10"
        style={{ gridTemplateColumns: `repeat(${boardSize}, ${pixelSize}px)` }}
        onMouseUp={onPaintEnd}
        onMouseLeave={onPaintEnd}
        onTouchEnd={onPaintEnd}
        onTouchMove={handleTouchMove}
      >
        {pixels.map((color, i) => (
          <div
            key={i}
            data-index={i}
            className="transition-colors duration-75"
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: color,
              border: showGrid ? '1px solid hsl(var(--border))' : 'none',
            }}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onTouchStart={() => handleMouseDown(i)}
          />
        ))}
      </div>
    </div>
  );
}
