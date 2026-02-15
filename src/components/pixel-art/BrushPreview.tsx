import { Tool } from '@/types/pixel-art';
import { Paintbrush, Pipette, PaintBucket } from 'lucide-react';

const toolIcons: Record<Tool, typeof Paintbrush> = {
  brush: Paintbrush,
  eyedropper: Pipette,
  bucket: PaintBucket,
};

const toolLabels: Record<Tool, string> = {
  brush: 'Pincel',
  eyedropper: 'Conta-gotas',
  bucket: 'Balde',
};

interface BrushPreviewProps {
  color: string;
  tool: Tool;
}

export function BrushPreview({ color, tool }: BrushPreviewProps) {
  const Icon = toolIcons[tool];
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
      <div
        className="h-5 w-5 rounded-sm border border-border"
        style={{ backgroundColor: color }}
        aria-label={`Cor ativa: ${color}`}
      />
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground hidden sm:inline">{toolLabels[tool]}</span>
    </div>
  );
}
