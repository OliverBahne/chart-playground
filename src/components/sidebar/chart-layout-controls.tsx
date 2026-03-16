import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaNumberInput } from '@/components/shared/figma-input'
import { LabeledSlider } from '@/components/shared/labeled-slider'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, StackOffsetType } from '@/types/chart-config'

interface ChartLayoutControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const layoutOptions = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
]

const stackOffsetOptions: { value: StackOffsetType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sign', label: 'Sign' },
  { value: 'expand', label: 'Expand' },
  { value: 'wiggle', label: 'Wiggle' },
  { value: 'silhouette', label: 'Silhouette' },
  { value: 'positive', label: 'Positive' },
]

export function ChartLayoutControls({ config, update }: ChartLayoutControlsProps) {
  const cl = config.chartLayout

  return (
    <FigmaSection title="Chart Layout">
      <FigmaSelect label="Layout" tooltip={TIPS['Layout']} value={cl.layout} options={layoutOptions} onChange={(v) => update('chartLayout.layout', v)} />
      <FigmaSelect label="Stack Offset" tooltip={TIPS['Stack Offset']} value={cl.stackOffset} options={stackOffsetOptions} onChange={(v) => update('chartLayout.stackOffset', v)} />
      <LabeledSwitch label="Reverse Stack" tooltip={TIPS['Reverse Stack']} checked={cl.reverseStackOrder} onCheckedChange={(v) => update('chartLayout.reverseStackOrder', v)} />
      <LabeledSlider label="Cat Gap" tooltip={TIPS['Category Gap']} value={cl.barCategoryGap} min={0} max={60} onValueChange={(v) => update('chartLayout.barCategoryGap', v)} />
      <LabeledSlider label="Bar Gap" tooltip={TIPS['Bar Gap']} value={cl.barGap} min={0} max={40} onValueChange={(v) => update('chartLayout.barGap', v)} />
      <FigmaNumberInput label="Bar Size" tooltip={TIPS['Bar Size']} value={cl.barSize ?? 0} onChange={(v) => update('chartLayout.barSize', v === 0 ? undefined : v)} min={0} />
      <FigmaNumberInput label="Max Bar Size" tooltip={TIPS['Max Bar Size']} value={cl.maxBarSize} onChange={(v) => update('chartLayout.maxBarSize', v)} min={0} />
    </FigmaSection>
  )
}
