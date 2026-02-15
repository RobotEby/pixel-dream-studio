import { Tool } from '@/types/pixel-art';
import {
  Paintbrush,
  Pipette,
  PaintBucket,
  Undo2,
  Redo2,
  Palette,
  Settings,
  Download,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MobileToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showPalette: boolean;
  onTogglePalette: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  onExport: () => void;
}

const tools: { tool: Tool; icon: typeof Paintbrush; label: string }[] = [
  { tool: 'brush', icon: Paintbrush, label: 'Pincel' },
  { tool: 'bucket', icon: PaintBucket, label: 'Balde' },
  { tool: 'eyedropper', icon: Pipette, label: 'Conta-gotas' },
];

function ToolBtn({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: typeof Paintbrush;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={`
            flex items-center justify-center rounded-full
            min-w-[44px] min-h-[44px] w-11 h-11
            transition-colors
            ${
              active
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground hover:bg-accent'
            }
            ${disabled ? 'opacity-30 pointer-events-none' : ''}
          `}
        >
          <Icon className="h-5 w-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function MobileToolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showPalette,
  onTogglePalette,
  showSettings,
  onToggleSettings,
  onExport,
}: MobileToolbarProps) {
  return (
    <nav
      className="shrink-0 border-t border-border bg-card/95 backdrop-blur-sm px-2 py-1.5"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      role="toolbar"
      aria-label="Ferramentas de desenho"
    >
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {tools.map(({ tool, icon, label }) => (
          <ToolBtn
            key={tool}
            icon={icon}
            label={label}
            active={activeTool === tool}
            onClick={() => onToolChange(tool)}
          />
        ))}

        <div className="w-px h-6 bg-border" />

        <ToolBtn icon={Undo2} label="Desfazer" disabled={!canUndo} onClick={onUndo} />
        <ToolBtn icon={Redo2} label="Refazer" disabled={!canRedo} onClick={onRedo} />

        <div className="w-px h-6 bg-border" />

        <ToolBtn icon={Palette} label="Paleta" active={showPalette} onClick={onTogglePalette} />
        <ToolBtn icon={Download} label="Exportar" onClick={onExport} />
        <ToolBtn
          icon={Settings}
          label="Configurações"
          active={showSettings}
          onClick={onToggleSettings}
        />
      </div>
    </nav>
  );
}
