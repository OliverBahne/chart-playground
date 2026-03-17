import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, ScaleType } from '@/types/chart-config'

interface AxisControlsProps {
  axisKey: 'xAxis' | 'yAxis'
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const axisTypeOptions = [
  { value: 'category', label: 'Category' },
  { value: 'number', label: 'Number' },
]

const xOrientationOptions = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

const yOrientationOptions = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const labelPositionOptions = [
  { value: 'insideLeft', label: 'Inside Left' },
  { value: 'insideRight', label: 'Inside Right' },
  { value: 'insideTop', label: 'Inside Top' },
  { value: 'insideBottom', label: 'Inside Bottom' },
  { value: 'center', label: 'Center' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

const intervalOptions = [
  { value: 'preserveStart', label: 'Preserve Start' },
  { value: 'preserveEnd', label: 'Preserve End' },
  { value: 'preserveStartEnd', label: 'Preserve Both' },
  { value: '0', label: '0 (all ticks)' },
]

const scaleOptions: { value: ScaleType; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'linear', label: 'Linear' },
  { value: 'pow', label: 'Pow' },
  { value: 'sqrt', label: 'Sqrt' },
  { value: 'log', label: 'Log' },
  { value: 'identity', label: 'Identity' },
  { value: 'time', label: 'Time' },
  { value: 'band', label: 'Band' },
  { value: 'point', label: 'Point' },
  { value: 'ordinal', label: 'Ordinal' },
]

export function AxisControls({ axisKey, config, update }: AxisControlsProps) {
  const axis = config[axisKey]
  const p = (field: string) => `${axisKey}.${field}`
  const title = axisKey === 'xAxis' ? 'X Axis' : 'Y Axis'
  const orientOptions = axisKey === 'xAxis' ? xOrientationOptions : yOrientationOptions

  return (
    <FigmaSection
      title={title}
      defaultOpen={false}
      visible={axis.show}
      onVisibleChange={(v) => update(p('show'), v)}
    >
      <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={axis.dataKey} onChange={(v) => update(p('dataKey'), v)} />
      <FigmaSelect label="Type" tooltip={TIPS['Type']} value={axis.type} options={axisTypeOptions} onChange={(v) => update(p('type'), v)} />
      <FigmaSelect label="Orient" tooltip={TIPS['Orient']} value={axis.orientation} options={orientOptions} onChange={(v) => update(p('orientation'), v)} />
      <FigmaTextInput label="Label" tooltip={TIPS['Label']} value={axis.label} onChange={(v) => update(p('label'), v)} />
      <FigmaNumberInput label="Label Size" tooltip={TIPS['Label Size']} value={axis.labelFontSize} min={8} max={24} onChange={(v) => update(p('labelFontSize'), v)} />
      <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={axis.labelPosition} options={labelPositionOptions} onChange={(v) => update(p('labelPosition'), v)} />

      <FigmaSection title="Ticks" defaultOpen={false}>
        <FigmaNumberInput label="Tick Count" tooltip={TIPS['Tick Count']} value={axis.tickCount} min={0} max={20} onChange={(v) => update(p('tickCount'), v)} />
        <FigmaNumberInput label="Tick Size" tooltip={TIPS['Tick Size']} value={axis.tickSize} min={0} max={12} onChange={(v) => update(p('tickSize'), v)} />
        <LabeledSwitch label="Tick Line" tooltip={TIPS['Tick Line']} checked={axis.tickLine} onCheckedChange={(v) => update(p('tickLine'), v)} />
        <FigmaNumberInput label="Tick Margin" tooltip={TIPS['Tick Margin']} value={axis.tickMargin} min={0} max={20} onChange={(v) => update(p('tickMargin'), v)} />
        <FigmaNumberInput label="Rotation" tooltip={TIPS['Rotation']} value={axis.tickRotation} min={-90} max={90} step={5} onChange={(v) => update(p('tickRotation'), v)} />
        <FigmaNumberInput label="Font Size" tooltip={TIPS['Font Size']} value={axis.tickFontSize} min={8} max={20} onChange={(v) => update(p('tickFontSize'), v)} />
        <FigmaColor label="Fill" tooltip={TIPS['Fill']} color={axis.tickFill} onChange={(v) => update(p('tickFill'), v)} />
        <FigmaNumberInput label="Min Gap" tooltip={TIPS['Min Gap']} value={axis.minTickGap} min={0} max={50} onChange={(v) => update(p('minTickGap'), v)} />
        <FigmaSelect
          label="Interval"
          tooltip={TIPS['Interval']}
          value={typeof axis.interval === 'number' ? String(axis.interval) : axis.interval}
          options={intervalOptions}
          onChange={(v) => {
            const num = parseInt(v)
            update(p('interval'), isNaN(num) ? v : num)
          }}
        />
      </FigmaSection>

      <FigmaSection title="Axis Line" defaultOpen={false}>
        <LabeledSwitch label="Show Line" tooltip={TIPS['Show Line']} checked={axis.axisLine} onCheckedChange={(v) => update(p('axisLine'), v)} />
        <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={axis.axisLineStroke} onChange={(v) => update(p('axisLineStroke'), v)} disabled={!axis.axisLine} disabledReason='Enable "Show Line" first' />
      </FigmaSection>

      <FigmaSection title="Advanced" defaultOpen={false}>
        <FigmaNumberInput label="Pad Start" tooltip={TIPS['Pad Start']} value={axis.paddingStart} onChange={(v) => update(p('paddingStart'), v)} min={0} />
        <FigmaNumberInput label="Pad End" tooltip={TIPS['Pad End']} value={axis.paddingEnd} onChange={(v) => update(p('paddingEnd'), v)} min={0} />
        <LabeledSwitch label="Mirror" tooltip={TIPS['Mirror']} checked={axis.mirror} onCheckedChange={(v) => update(p('mirror'), v)} />
        <LabeledSwitch label="Reversed" tooltip={TIPS['Reversed']} checked={axis.reversed} onCheckedChange={(v) => update(p('reversed'), v)} />
        <LabeledSwitch label="Decimals" tooltip={TIPS['Decimals']} checked={axis.allowDecimals} onCheckedChange={(v) => update(p('allowDecimals'), v)} />
        <LabeledSwitch label="Data Overflow" tooltip={TIPS['Data Overflow']} checked={axis.allowDataOverflow} onCheckedChange={(v) => update(p('allowDataOverflow'), v)} />
        <FigmaSelect label="Scale" tooltip={TIPS['Scale']} value={axis.scale} options={scaleOptions} onChange={(v) => update(p('scale'), v)} />
        <FigmaTextInput label="Size" tooltip={TIPS['Size']} value={String(axis.size)} onChange={(v) => {
          const lower = v.trim().toLowerCase()
          if (lower === 'auto') { update(p('size'), 'auto'); return }
          const n = parseFloat(v)
          if (!isNaN(n) && n >= 0) update(p('size'), n)
        }} />
      </FigmaSection>
    </FigmaSection>
  )
}
