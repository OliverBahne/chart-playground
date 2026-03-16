import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSlider } from '@/components/shared/labeled-slider'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, CurveType, LabelPosition, LegendIconType, AnimationEasing } from '@/types/chart-config'
import type { ConfigAction } from '@/hooks/use-chart-config'
import { Trash2 } from 'lucide-react'

interface SeriesControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
  updateSeries: (seriesType: string, index: number, path: string, value: unknown) => void
  dispatch: React.Dispatch<ConfigAction>
}

const curveOptions: { value: CurveType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'monotoneX', label: 'Monotone X' },
  { value: 'monotoneY', label: 'Monotone Y' },
  { value: 'monotone', label: 'Monotone' },
  { value: 'natural', label: 'Natural' },
  { value: 'basis', label: 'Basis' },
  { value: 'basisClosed', label: 'Basis Closed' },
  { value: 'basisOpen', label: 'Basis Open' },
  { value: 'bumpX', label: 'Bump X' },
  { value: 'bumpY', label: 'Bump Y' },
  { value: 'bump', label: 'Bump' },
  { value: 'linearClosed', label: 'Linear Closed' },
  { value: 'step', label: 'Step' },
  { value: 'stepBefore', label: 'Step Before' },
  { value: 'stepAfter', label: 'Step After' },
]

const labelPositionOptions: { value: LabelPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'inside', label: 'Inside' },
  { value: 'outside', label: 'Outside' },
  { value: 'insideLeft', label: 'Inside Left' },
  { value: 'insideRight', label: 'Inside Right' },
  { value: 'insideTop', label: 'Inside Top' },
  { value: 'insideBottom', label: 'Inside Bottom' },
  { value: 'center', label: 'Center' },
]

const legendTypeOptions: { value: LegendIconType; label: string }[] = [
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

const easingOptions: { value: AnimationEasing; label: string }[] = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
]

function AnimationFields({ seriesType, index, series, updateSeries }: {
  seriesType: string; index: number; series: { animationBegin: number; animationDuration: number; animationEasing: AnimationEasing }
  updateSeries: SeriesControlsProps['updateSeries']
}) {
  return (
    <>
      <FigmaNumberInput label="Anim Begin" tooltip={TIPS['Anim Begin']} value={series.animationBegin} onChange={(v) => updateSeries(seriesType, index, 'animationBegin', v)} min={0} />
      <FigmaNumberInput label="Anim Duration" tooltip={TIPS['Anim Duration']} value={series.animationDuration} onChange={(v) => updateSeries(seriesType, index, 'animationDuration', v)} min={0} />
      <FigmaSelect label="Anim Easing" tooltip={TIPS['Anim Easing']} value={series.animationEasing} options={easingOptions} onChange={(v) => updateSeries(seriesType, index, 'animationEasing', v)} />
    </>
  )
}

function DeleteButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed mt-1"
    >
      <Trash2 className="h-3 w-3" />
      Remove series
    </button>
  )
}

export function SeriesControls({ config, updateSeries, dispatch }: SeriesControlsProps) {
  const { chartType } = config

  if (chartType === 'line') {
    const seriesType = 'lineSeries'
    return (
      <FigmaSection title="Line Series" onAdd={() => dispatch({ type: 'ADD_SERIES', seriesType })}>
        {config.lineSeries.map((s, i) => (
          <FigmaSection key={`${s.dataKey}-${i}`} title={s.name || s.dataKey} defaultOpen={i === 0}>
            <FigmaColor label="Color" tooltip={TIPS['Color']} color={s.color} onChange={(v) => updateSeries(seriesType, i, 'color', v)} />
            <FigmaTextInput label="Name" tooltip={TIPS['Name']} value={s.name} onChange={(v) => updateSeries(seriesType, i, 'name', v)} />
            <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={s.dataKey} onChange={(v) => updateSeries(seriesType, i, 'dataKey', v)} />
            <FigmaSelect label="Curve" tooltip={TIPS['Curve']} value={s.type} options={curveOptions} onChange={(v) => updateSeries(seriesType, i, 'type', v)} />
            <LabeledSlider label="Stroke W" tooltip={TIPS['Stroke W']} value={s.strokeWidth} min={0} max={8} onValueChange={(v) => updateSeries(seriesType, i, 'strokeWidth', v)} />
            <FigmaTextInput label="Dash" tooltip={TIPS['Dash']} value={s.strokeDasharray} onChange={(v) => updateSeries(seriesType, i, 'strokeDasharray', v)} placeholder="5 5" />
            <LabeledSwitch label="Show Dots" tooltip={TIPS['Show Dots']} checked={s.showDots} onCheckedChange={(v) => updateSeries(seriesType, i, 'showDots', v)} />
            <LabeledSlider label="Dot Size" tooltip={TIPS['Dot Size']} value={s.dotSize} min={0} max={12} onValueChange={(v) => updateSeries(seriesType, i, 'dotSize', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <FigmaColor label="Dot Fill" tooltip={TIPS['Dot Fill']} color={s.dotFill} onChange={(v) => updateSeries(seriesType, i, 'dotFill', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <FigmaColor label="Dot Stroke" tooltip={TIPS['Dot Stroke']} color={s.dotStroke} onChange={(v) => updateSeries(seriesType, i, 'dotStroke', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <LabeledSlider label="Dot Stroke W" tooltip={TIPS['Dot Stroke W']} value={s.dotStrokeWidth} min={0} max={4} onValueChange={(v) => updateSeries(seriesType, i, 'dotStrokeWidth', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <LabeledSwitch label="Active Dot" tooltip={TIPS['Active Dot']} checked={s.showActiveDot} onCheckedChange={(v) => updateSeries(seriesType, i, 'showActiveDot', v)} />
            <LabeledSlider label="Active Dot Size" tooltip={TIPS['Active Dot Size']} value={s.activeDotSize} min={0} max={12} onValueChange={(v) => updateSeries(seriesType, i, 'activeDotSize', v)} disabled={!s.showActiveDot} disabledReason='Enable "Active Dot" first' />
            <LabeledSwitch label="Connect Nulls" tooltip={TIPS['Connect Nulls']} checked={s.connectNulls} onCheckedChange={(v) => updateSeries(seriesType, i, 'connectNulls', v)} />
            <LabeledSwitch label="Hide" tooltip={TIPS['Hide']} checked={s.hide} onCheckedChange={(v) => updateSeries(seriesType, i, 'hide', v)} />
            <LabeledSwitch label="Show Label" tooltip={TIPS['Show Label']} checked={s.showLabel} onCheckedChange={(v) => updateSeries(seriesType, i, 'showLabel', v)} />
            <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={s.labelPosition} options={labelPositionOptions} onChange={(v) => updateSeries(seriesType, i, 'labelPosition', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <LabeledSlider label="Label Size" tooltip={TIPS['Label Size']} value={s.labelFontSize} min={8} max={20} onValueChange={(v) => updateSeries(seriesType, i, 'labelFontSize', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <FigmaSelect label="Legend Icon" tooltip={TIPS['Legend Icon']} value={s.legendType} options={legendTypeOptions} onChange={(v) => updateSeries(seriesType, i, 'legendType', v)} />
            <FigmaTextInput label="Unit" tooltip={TIPS['Unit']} value={s.unit} onChange={(v) => updateSeries(seriesType, i, 'unit', v)} />
            <AnimationFields seriesType={seriesType} index={i} series={s} updateSeries={updateSeries} />
            <DeleteButton onClick={() => dispatch({ type: 'REMOVE_SERIES', seriesType, index: i })} disabled={config.lineSeries.length <= 1} />
          </FigmaSection>
        ))}
      </FigmaSection>
    )
  }

  if (chartType === 'area') {
    const seriesType = 'areaSeries'
    return (
      <FigmaSection title="Area Series" onAdd={() => dispatch({ type: 'ADD_SERIES', seriesType })}>
        {config.areaSeries.map((s, i) => (
          <FigmaSection key={`${s.dataKey}-${i}`} title={s.name || s.dataKey} defaultOpen={i === 0}>
            <FigmaColor label="Color" tooltip={TIPS['Color']} color={s.color} onChange={(v) => updateSeries(seriesType, i, 'color', v)} />
            <FigmaColor label="Fill" tooltip={TIPS['Fill']} color={s.fillColor} onChange={(v) => updateSeries(seriesType, i, 'fillColor', v)} />
            <LabeledSlider label="Fill Opacity" tooltip={TIPS['Fill Opacity']} value={s.fillOpacity} min={0} max={1} step={0.05} onValueChange={(v) => updateSeries(seriesType, i, 'fillOpacity', v)} />
            <FigmaTextInput label="Name" tooltip={TIPS['Name']} value={s.name} onChange={(v) => updateSeries(seriesType, i, 'name', v)} />
            <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={s.dataKey} onChange={(v) => updateSeries(seriesType, i, 'dataKey', v)} />
            <FigmaSelect label="Curve" tooltip={TIPS['Curve']} value={s.type} options={curveOptions} onChange={(v) => updateSeries(seriesType, i, 'type', v)} />
            <LabeledSlider label="Stroke W" tooltip={TIPS['Stroke W']} value={s.strokeWidth} min={0} max={8} onValueChange={(v) => updateSeries(seriesType, i, 'strokeWidth', v)} />
            <FigmaTextInput label="Dash" tooltip={TIPS['Dash']} value={s.strokeDasharray} onChange={(v) => updateSeries(seriesType, i, 'strokeDasharray', v)} placeholder="5 5" />
            <FigmaTextInput label="Stack ID" tooltip={TIPS['Stack ID']} value={s.stackId} onChange={(v) => updateSeries(seriesType, i, 'stackId', v)} />
            <LabeledSwitch label="Show Dots" tooltip={TIPS['Show Dots']} checked={s.showDots} onCheckedChange={(v) => updateSeries(seriesType, i, 'showDots', v)} />
            <LabeledSlider label="Dot Size" tooltip={TIPS['Dot Size']} value={s.dotSize} min={0} max={12} onValueChange={(v) => updateSeries(seriesType, i, 'dotSize', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <FigmaColor label="Dot Fill" tooltip={TIPS['Dot Fill']} color={s.dotFill} onChange={(v) => updateSeries(seriesType, i, 'dotFill', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <FigmaColor label="Dot Stroke" tooltip={TIPS['Dot Stroke']} color={s.dotStroke} onChange={(v) => updateSeries(seriesType, i, 'dotStroke', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <LabeledSlider label="Dot Stroke W" tooltip={TIPS['Dot Stroke W']} value={s.dotStrokeWidth} min={0} max={4} onValueChange={(v) => updateSeries(seriesType, i, 'dotStrokeWidth', v)} disabled={!s.showDots} disabledReason='Enable "Show Dots" first' />
            <LabeledSwitch label="Active Dot" tooltip={TIPS['Active Dot']} checked={s.showActiveDot} onCheckedChange={(v) => updateSeries(seriesType, i, 'showActiveDot', v)} />
            <LabeledSlider label="Active Dot Size" tooltip={TIPS['Active Dot Size']} value={s.activeDotSize} min={0} max={12} onValueChange={(v) => updateSeries(seriesType, i, 'activeDotSize', v)} disabled={!s.showActiveDot} disabledReason='Enable "Active Dot" first' />
            <LabeledSwitch label="Connect Nulls" tooltip={TIPS['Connect Nulls']} checked={s.connectNulls} onCheckedChange={(v) => updateSeries(seriesType, i, 'connectNulls', v)} />
            <LabeledSwitch label="Hide" tooltip={TIPS['Hide']} checked={s.hide} onCheckedChange={(v) => updateSeries(seriesType, i, 'hide', v)} />
            <LabeledSwitch label="Show Label" tooltip={TIPS['Show Label']} checked={s.showLabel} onCheckedChange={(v) => updateSeries(seriesType, i, 'showLabel', v)} />
            <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={s.labelPosition} options={labelPositionOptions} onChange={(v) => updateSeries(seriesType, i, 'labelPosition', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <LabeledSlider label="Label Size" tooltip={TIPS['Label Size']} value={s.labelFontSize} min={8} max={20} onValueChange={(v) => updateSeries(seriesType, i, 'labelFontSize', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <FigmaSelect label="Legend Icon" tooltip={TIPS['Legend Icon']} value={s.legendType} options={legendTypeOptions} onChange={(v) => updateSeries(seriesType, i, 'legendType', v)} />
            <FigmaTextInput label="Unit" tooltip={TIPS['Unit']} value={s.unit} onChange={(v) => updateSeries(seriesType, i, 'unit', v)} />
            <AnimationFields seriesType={seriesType} index={i} series={s} updateSeries={updateSeries} />
            <DeleteButton onClick={() => dispatch({ type: 'REMOVE_SERIES', seriesType, index: i })} disabled={config.areaSeries.length <= 1} />
          </FigmaSection>
        ))}
      </FigmaSection>
    )
  }

  if (chartType === 'bar') {
    const seriesType = 'barSeries'
    return (
      <FigmaSection title="Bar Series" onAdd={() => dispatch({ type: 'ADD_SERIES', seriesType })}>
        {config.barSeries.map((s, i) => (
          <FigmaSection key={`${s.dataKey}-${i}`} title={s.name || s.dataKey} defaultOpen={i === 0}>
            <FigmaColor label="Color" tooltip={TIPS['Color']} color={s.color} onChange={(v) => updateSeries(seriesType, i, 'color', v)} />
            <FigmaTextInput label="Name" tooltip={TIPS['Name']} value={s.name} onChange={(v) => updateSeries(seriesType, i, 'name', v)} />
            <FigmaTextInput label="Data Key" tooltip={TIPS['Data Key']} value={s.dataKey} onChange={(v) => updateSeries(seriesType, i, 'dataKey', v)} />
            <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={s.strokeColor} onChange={(v) => updateSeries(seriesType, i, 'strokeColor', v)} />
            <LabeledSlider label="Stroke W" tooltip={TIPS['Stroke W']} value={s.strokeWidth} min={0} max={8} onValueChange={(v) => updateSeries(seriesType, i, 'strokeWidth', v)} />
            <FigmaNumberInput label="Bar Size" tooltip={TIPS['Bar Size']} value={s.barSize ?? 0} onChange={(v) => updateSeries(seriesType, i, 'barSize', v === 0 ? undefined : v)} min={0} />
            <FigmaNumberInput label="Max Bar Size" tooltip={TIPS['Max Bar Size']} value={s.maxBarSize} onChange={(v) => updateSeries(seriesType, i, 'maxBarSize', v)} min={0} />
            <FigmaNumberInput label="Min Point" tooltip={TIPS['Min Point']} value={s.minPointSize} onChange={(v) => updateSeries(seriesType, i, 'minPointSize', v)} min={0} />
            <LabeledSlider label="Radius TL" tooltip={TIPS['Radius TL']} value={s.radius[0]} min={0} max={20} onValueChange={(v) => { const r = [...s.radius] as [number, number, number, number]; r[0] = v; updateSeries(seriesType, i, 'radius', r) }} />
            <LabeledSlider label="Radius TR" tooltip={TIPS['Radius TR']} value={s.radius[1]} min={0} max={20} onValueChange={(v) => { const r = [...s.radius] as [number, number, number, number]; r[1] = v; updateSeries(seriesType, i, 'radius', r) }} />
            <FigmaTextInput label="Stack ID" tooltip={TIPS['Stack ID']} value={s.stackId} onChange={(v) => updateSeries(seriesType, i, 'stackId', v)} />
            <LabeledSwitch label="Background" tooltip={TIPS['Background']} checked={s.showBackground} onCheckedChange={(v) => updateSeries(seriesType, i, 'showBackground', v)} />
            <FigmaColor label="BG Fill" tooltip={TIPS['BG Fill']} color={s.backgroundFill} onChange={(v) => updateSeries(seriesType, i, 'backgroundFill', v)} disabled={!s.showBackground} disabledReason='Enable "Background" first' />
            <LabeledSlider label="BG Radius" tooltip={TIPS['BG Radius']} value={s.backgroundRadius} min={0} max={20} onValueChange={(v) => updateSeries(seriesType, i, 'backgroundRadius', v)} disabled={!s.showBackground} disabledReason='Enable "Background" first' />
            <LabeledSwitch label="Show Label" tooltip={TIPS['Show Label']} checked={s.showLabel} onCheckedChange={(v) => updateSeries(seriesType, i, 'showLabel', v)} />
            <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={s.labelPosition} options={labelPositionOptions} onChange={(v) => updateSeries(seriesType, i, 'labelPosition', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <LabeledSlider label="Label Size" tooltip={TIPS['Label Size']} value={s.labelFontSize} min={8} max={20} onValueChange={(v) => updateSeries(seriesType, i, 'labelFontSize', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <FigmaColor label="Label Color" tooltip={TIPS['Label Color']} color={s.labelColor} onChange={(v) => updateSeries(seriesType, i, 'labelColor', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
            <LabeledSwitch label="Hide" tooltip={TIPS['Hide']} checked={s.hide} onCheckedChange={(v) => updateSeries(seriesType, i, 'hide', v)} />
            <FigmaSelect label="Legend Icon" tooltip={TIPS['Legend Icon']} value={s.legendType} options={legendTypeOptions} onChange={(v) => updateSeries(seriesType, i, 'legendType', v)} />
            <FigmaTextInput label="Unit" tooltip={TIPS['Unit']} value={s.unit} onChange={(v) => updateSeries(seriesType, i, 'unit', v)} />
            <AnimationFields seriesType={seriesType} index={i} series={s} updateSeries={updateSeries} />
            <DeleteButton onClick={() => dispatch({ type: 'REMOVE_SERIES', seriesType, index: i })} disabled={config.barSeries.length <= 1} />
          </FigmaSection>
        ))}
      </FigmaSection>
    )
  }

  return null
}
