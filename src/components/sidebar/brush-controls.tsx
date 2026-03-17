import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig } from '@/types/chart-config'

interface BrushControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

export function BrushControls({ config, update }: BrushControlsProps) {
  const brush = config.brush

  return (
    <FigmaSection
      title="Brush"
      defaultOpen={false}
      visible={brush.show}
      onVisibleChange={(v) => update('brush.show', v)}
    >
      <FigmaNumberInput label="Height" tooltip={TIPS['Brush Height']} value={brush.height} min={20} max={100} onChange={(v) => update('brush.height', v)} />
      <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={brush.stroke} onChange={(v) => update('brush.stroke', v)} />
      <FigmaColor label="Fill" tooltip={TIPS['Fill']} color={brush.fill} onChange={(v) => update('brush.fill', v)} />
      <FigmaNumberInput label="Traveller W" tooltip={TIPS['Traveller W']} value={brush.travellerWidth} min={1} max={20} onChange={(v) => update('brush.travellerWidth', v)} />
      <FigmaNumberInput label="Gap" tooltip={TIPS['Gap']} value={brush.gap} min={0} max={10} onChange={(v) => update('brush.gap', v)} />
      <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={brush.dataKey} onChange={(v) => update('brush.dataKey', v)} />
    </FigmaSection>
  )
}
