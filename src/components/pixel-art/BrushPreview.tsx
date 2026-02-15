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
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <div className="h-6 w-6 rounded border border-border" style={{ backgroundColor: color }} />
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{toolLabels[tool]}</span>
    </div>
  );
}
