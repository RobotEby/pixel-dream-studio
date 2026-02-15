import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Save, FolderOpen, Grid3X3, Upload, Moon, Sun, X } from 'lucide-react';
import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from '@/types/pixel-art';

interface SettingsPanelProps {
  sizeInput: string;
  setSizeInput: (v: string) => void;
  onApplySize: () => void;
  showGrid: boolean;
  onToggleGrid: (v: boolean) => void;
  isDark: boolean;
  onToggleDark: (v: boolean) => void;
  templateImage: string | null;
  onUploadTemplate: () => void;
  onRemoveTemplate: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export function SettingsPanel({
  sizeInput,
  setSizeInput,
  onApplySize,
  showGrid,
  onToggleGrid,
  isDark,
  onToggleDark,
  templateImage,
  onUploadTemplate,
  onRemoveTemplate,
  onSave,
  onLoad,
  onClear,
}: SettingsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs text-muted-foreground whitespace-nowrap">Tam:</Label>
        <Input
          type="number"
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          value={sizeInput}
          onChange={(e) => setSizeInput(e.target.value)}
          className="h-8 w-16 text-xs"
        />
        <Button size="sm" className="h-8 text-xs px-2" onClick={onApplySize}>
          OK
        </Button>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <div className="flex items-center gap-1">
          <Grid3X3 className="h-3.5 w-3.5 text-muted-foreground" />
          <Switch checked={showGrid} onCheckedChange={onToggleGrid} aria-label="Alternar grade" />
        </div>
        <div className="flex items-center gap-1">
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <Switch checked={isDark} onCheckedChange={onToggleDark} aria-label="Modo escuro" />
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onSave}>
          <Save className="h-3 w-3 mr-1" /> Salvar
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onLoad}>
          <FolderOpen className="h-3 w-3 mr-1" /> Carregar
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClear}>
          <Trash2 className="h-3 w-3 mr-1" /> Limpar
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onUploadTemplate}>
          <Upload className="h-3 w-3 mr-1" /> Template
        </Button>
        {templateImage && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onRemoveTemplate}>
            <X className="h-3 w-3 mr-1" /> Remover
          </Button>
        )}
      </div>
    </div>
  );
}
