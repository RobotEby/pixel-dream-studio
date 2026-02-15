import { Button } from '@/components/ui/button';
import { Tool } from '@/types/pixel-art';
import { Paintbrush, Pipette, PaintBucket, Undo2, Redo2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolBarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools: { tool: Tool; icon: typeof Paintbrush; label: string }[] = [
  { tool: 'brush', icon: Paintbrush, label: 'Pincel' },
  { tool: 'eyedropper', icon: Pipette, label: 'Conta-gotas' },
  { tool: 'bucket', icon: PaintBucket, label: 'Balde de Tinta' },
];

export function ToolBar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolBarProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {tools.map(({ tool, icon: Icon, label }) => (
        <Tooltip key={tool}>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === tool ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onToolChange(tool)}
              className="h-9 w-9"
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
      <div className="mx-1 h-6 w-px bg-border" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-9 w-9"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Desfazer</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-9 w-9"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refazer</TooltipContent>
      </Tooltip>
    </div>
  );
}
