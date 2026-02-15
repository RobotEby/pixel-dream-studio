import { PALETTES, PaletteName } from '@/types/pixel-art';
import { Button } from '@/components/ui/button';
import { Shuffle, Plus } from 'lucide-react';
import { useState } from 'react';

interface ColorPaletteProps {
  currentPalette: PaletteName;
  selectedColor: string;
  customColors: string[];
  onSwitchPalette: (name: PaletteName) => void;
  onSelectColor: (color: string) => void;
  onAddCustomColor: (color: string) => void;
  onGenerateRandom: () => void;
}

const paletteNames: { key: PaletteName; label: string }[] = [
  { key: 'basic', label: 'Básica' },
  { key: 'pastel', label: 'Pastel' },
  { key: 'neon', label: 'Neon' },
];

function ColorSwatch({
  color,
  selected,
  onSelect,
}: {
  color: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-label={`Cor ${color}`}
      className="shrink-0 rounded-md border-2 transition-transform active:scale-95"
      style={{
        width: 36,
        height: 36,
        minWidth: 36,
        backgroundColor: color,
        borderColor: selected ? 'hsl(var(--primary))' : 'transparent',
        boxShadow: selected ? '0 0 0 2px hsl(var(--primary))' : 'none',
      }}
      onClick={onSelect}
    />
  );
}

export function ColorPalette({
  currentPalette,
  selectedColor,
  customColors,
  onSwitchPalette,
  onSelectColor,
  onAddCustomColor,
  onGenerateRandom,
}: ColorPaletteProps) {
  const [pickerColor, setPickerColor] = useState('#000000');

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {paletteNames.map(({ key, label }) => (
          <Button
            key={key}
            variant={currentPalette === key ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs shrink-0"
            onClick={() => onSwitchPalette(key)}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs shrink-0"
          onClick={onGenerateRandom}
        >
          <Shuffle className="h-3 w-3 mr-1" /> Aleatória
        </Button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PALETTES[currentPalette].map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            selected={selectedColor === color}
            onSelect={() => onSelectColor(color)}
          />
        ))}
      </div>

      {customColors.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {customColors.map((color, i) => (
            <ColorSwatch
              key={i}
              color={color}
              selected={selectedColor === color}
              onSelect={() => onSelectColor(color)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerColor}
          onChange={(e) => setPickerColor(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border-none bg-transparent p-0 shrink-0"
          aria-label="Escolher cor personalizada"
        />
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => onAddCustomColor(pickerColor)}
        >
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>
    </div>
  );
}
