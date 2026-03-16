import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSlider } from '@/components/shared/labeled-slider'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, LegendLayout, LegendAlign, LegendVerticalAlign, LegendIconType } from '@/types/chart-config'

interface LegendControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const layoutOptions: { value: LegendLayout; label: string }[] = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
]

const alignOptions: { value: LegendAlign; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

const vAlignOptions: { value: LegendVerticalAlign; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'middle', label: 'Middle' },
  { value: 'bottom', label: 'Bottom' },
]

const iconTypeOptions: { value: LegendIconType; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'cross', label: 'Cross' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'line', label: 'Line' },
  { value: 'plainline', label: 'Plain Line' },
  { value: 'rect', label: 'Rect' },
  { value: 'square', label: 'Square' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'wye', label: 'Wye' },
  { value: 'none', label: 'None' },
]

export function LegendControls({ config, update }: LegendControlsProps) {
  const legend = config.legend

  return (
    <FigmaSection
      title="Legend"
      visible={legend.show}
      onVisibleChange={(v) => update('legend.show', v)}
    >
      <FigmaSelect label="Layout" tooltip={TIPS['Layout']} value={legend.layout} options={layoutOptions} onChange={(v) => update('legend.layout', v)} />
      <FigmaSelect label="Align" tooltip={TIPS['Align']} value={legend.align} options={alignOptions} onChange={(v) => update('legend.align', v)} />
      <FigmaSelect label="V Align" tooltip={TIPS['V Align']} value={legend.verticalAlign} options={vAlignOptions} onChange={(v) => update('legend.verticalAlign', v)} />
      <LabeledSlider label="Icon Size" tooltip={TIPS['Icon Size']} value={legend.iconSize} min={8} max={32} onValueChange={(v) => update('legend.iconSize', v)} />
      <FigmaSelect label="Icon Type" tooltip={TIPS['Icon Type']} value={legend.iconType} options={iconTypeOptions} onChange={(v) => update('legend.iconType', v)} />
      <LabeledSlider label="Font Size" tooltip={TIPS['Font Size']} value={legend.fontSize} min={8} max={20} onValueChange={(v) => update('legend.fontSize', v)} />
      <FigmaColor label="Font Color" tooltip={TIPS['Font Color']} color={legend.fontColor} onChange={(v) => update('legend.fontColor', v)} />
      <FigmaColor label="Inactive" tooltip={TIPS['Inactive']} color={legend.inactiveColor} onChange={(v) => update('legend.inactiveColor', v)} />
    </FigmaSection>
  )
}
