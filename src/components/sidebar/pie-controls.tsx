import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSlider } from '@/components/shared/labeled-slider'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, AnimationEasing } from '@/types/chart-config'

interface PieControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const easingOptions: { value: AnimationEasing; label: string }[] = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
]

export function PieControls({ config, update }: PieControlsProps) {
  const pie = config.pie

  return (
    <FigmaSection title="Pie">
      <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={pie.dataKey} onChange={(v) => update('pie.dataKey', v)} />
      <FigmaTextInput label="Name Key" tooltip={TIPS['Name Key']} value={pie.nameKey} onChange={(v) => update('pie.nameKey', v)} />
      <FigmaTextInput label="CX" tooltip={TIPS['Center X']} value={pie.cx} onChange={(v) => update('pie.cx', v)} placeholder="50%" />
      <FigmaTextInput label="CY" tooltip={TIPS['Center Y']} value={pie.cy} onChange={(v) => update('pie.cy', v)} placeholder="50%" />
      <LabeledSlider label="Inner R" tooltip={TIPS['Inner R']} value={pie.innerRadius} min={0} max={150} onValueChange={(v) => update('pie.innerRadius', v)} />
      <LabeledSlider label="Outer R" tooltip={TIPS['Outer R']} value={pie.outerRadius} min={20} max={200} onValueChange={(v) => update('pie.outerRadius', v)} />
      <LabeledSlider label="Corner R" tooltip={TIPS['Corner R']} value={pie.cornerRadius} min={0} max={20} onValueChange={(v) => update('pie.cornerRadius', v)} />
      <LabeledSlider label="Start Angle" tooltip={TIPS['Start Angle']} value={pie.startAngle} min={-360} max={360} onValueChange={(v) => update('pie.startAngle', v)} />
      <LabeledSlider label="End Angle" tooltip={TIPS['End Angle']} value={pie.endAngle} min={-360} max={360} onValueChange={(v) => update('pie.endAngle', v)} />
      <LabeledSlider label="Pad Angle" tooltip={TIPS['Pad Angle']} value={pie.paddingAngle} min={0} max={30} onValueChange={(v) => update('pie.paddingAngle', v)} />
      <LabeledSlider label="Min Angle" tooltip={TIPS['Min Angle']} value={pie.minAngle} min={0} max={30} onValueChange={(v) => update('pie.minAngle', v)} />
      <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={pie.stroke} onChange={(v) => update('pie.stroke', v)} />
      <LabeledSlider label="Stroke W" tooltip={TIPS['Stroke W']} value={pie.strokeWidth} min={0} max={5} onValueChange={(v) => update('pie.strokeWidth', v)} />
      <LabeledSwitch label="Show Labels" tooltip={TIPS['Show Labels']} checked={pie.showLabels} onCheckedChange={(v) => update('pie.showLabels', v)} />
      <LabeledSlider label="Label Size" tooltip={TIPS['Label Size']} value={pie.labelFontSize} min={8} max={20} onValueChange={(v) => update('pie.labelFontSize', v)} disabled={!pie.showLabels} disabledReason='Enable "Show Labels" first' />
      <LabeledSwitch label="Label Line" tooltip={TIPS['Label Line']} checked={pie.showLabelLine} onCheckedChange={(v) => update('pie.showLabelLine', v)} disabled={!pie.showLabels} disabledReason='Enable "Show Labels" first' />
      <FigmaNumberInput label="Anim Begin" tooltip={TIPS['Anim Begin']} value={pie.animationBegin} onChange={(v) => update('pie.animationBegin', v)} min={0} />
      <FigmaNumberInput label="Anim Duration" tooltip={TIPS['Anim Duration']} value={pie.animationDuration} onChange={(v) => update('pie.animationDuration', v)} min={0} />
      <FigmaSelect label="Anim Easing" tooltip={TIPS['Anim Easing']} value={pie.animationEasing} options={easingOptions} onChange={(v) => update('pie.animationEasing', v)} />

      {pie.slices.length > 0 && (
        <FigmaSection title="Slice Colors" defaultOpen={false}>
          {pie.slices.map((slice, i) => (
            <FigmaColor
              key={i}
              label={slice.name || `Slice ${i + 1}`}
              color={slice.color}
              onChange={(v) => {
                const slices = [...pie.slices]
                slices[i] = { ...slices[i], color: v }
                update('pie.slices', slices)
              }}
            />
          ))}
        </FigmaSection>
      )}
    </FigmaSection>
  )
}
