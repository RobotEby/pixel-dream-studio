import { PALETTES, PaletteName } from '@/types/pixel-art';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const paletteNames: { key: PaletteName; label: string }[] = [
    { key: 'basic', label: 'Básica' },
    { key: 'pastel', label: 'Pastel' },
    { key: 'neon', label: 'Neon' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {paletteNames.map(({ key, label }) => (
          <Button
            key={key}
            variant={currentPalette === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSwitchPalette(key)}
          >
            {label}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={onGenerateRandom}>
          <Shuffle className="h-3 w-3 mr-1" /> Aleatória
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {PALETTES[currentPalette].map((color) => (
          <button
            key={color}
            className="h-8 w-8 rounded-md border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: selectedColor === color ? 'hsl(var(--primary))' : 'transparent',
              boxShadow: selectedColor === color ? '0 0 0 2px hsl(var(--primary))' : 'none',
            }}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </div>

      {customColors.length > 0 && (
        <div className="grid grid-cols-8 gap-1.5">
          {customColors.map((color, i) => (
            <button
              key={i}
              className="h-8 w-8 rounded-md border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? 'hsl(var(--primary))' : 'transparent',
                boxShadow: selectedColor === color ? '0 0 0 2px hsl(var(--primary))' : 'none',
              }}
              onClick={() => onSelectColor(color)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerColor}
          onChange={(e) => setPickerColor(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border-none bg-transparent p-0"
        />
        <Button variant="outline" size="sm" onClick={() => onAddCustomColor(pickerColor)}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar Cor
        </Button>
      </div>
    </div>
  );
}
