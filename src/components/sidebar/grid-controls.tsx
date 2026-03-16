import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaTextInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSlider } from '@/components/shared/labeled-slider'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig } from '@/types/chart-config'

interface GridControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

export function GridControls({ config, update }: GridControlsProps) {
  const grid = config.grid

  return (
    <FigmaSection
      title="Grid"
      visible={grid.show}
      onVisibleChange={(v) => update('grid.show', v)}
    >
      <LabeledSwitch label="Horizontal" tooltip={TIPS['Horizontal']} checked={grid.horizontal} onCheckedChange={(v) => update('grid.horizontal', v)} />
      <LabeledSwitch label="Vertical" tooltip={TIPS['Vertical']} checked={grid.vertical} onCheckedChange={(v) => update('grid.vertical', v)} />
      <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={grid.stroke} onChange={(v) => update('grid.stroke', v)} />
      <FigmaTextInput label="Dash" tooltip={TIPS['Dash']} value={grid.strokeDasharray} onChange={(v) => update('grid.strokeDasharray', v)} placeholder="3 3" />
      <FigmaColor label="Fill" tooltip={TIPS['Fill']} color={grid.fill} onChange={(v) => update('grid.fill', v)} />
      <LabeledSlider label="Fill Opacity" tooltip={TIPS['Fill Opacity']} value={grid.fillOpacity} min={0} max={1} step={0.05} onValueChange={(v) => update('grid.fillOpacity', v)} />
      <LabeledSwitch label="Sync Ticks" tooltip={TIPS['Sync Ticks']} checked={grid.syncWithTicks} onCheckedChange={(v) => update('grid.syncWithTicks', v)} />
    </FigmaSection>
  )
}
