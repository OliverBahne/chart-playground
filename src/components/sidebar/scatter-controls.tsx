import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, ScatterSymbol, CurveType, LabelPosition, LegendIconType, AnimationEasing } from '@/types/chart-config'
import type { ConfigAction } from '@/hooks/use-chart-config'
import { Trash2 } from 'lucide-react'

interface ScatterControlsProps {
  config: ChartConfig
  updateSeries: (seriesType: string, index: number, path: string, value: unknown) => void
  dispatch: React.Dispatch<ConfigAction>
}

const shapeOptions: { value: ScatterSymbol; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'cross', label: 'Cross' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'square', label: 'Square' },
  { value: 'star', label: 'Star' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'wye', label: 'Wye' },
]

const lineTypeOptions = [
  { value: 'fitting', label: 'Fitting' },
  { value: 'joint', label: 'Joint' },
]

const curveOptions: { value: CurveType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'monotoneX', label: 'Monotone X' },
  { value: 'natural', label: 'Natural' },
  { value: 'basis', label: 'Basis' },
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
  { value: 'center', label: 'Center' },
]

const legendTypeOptions: { value: LegendIconType; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'cross', label: 'Cross' },
  { value: 'diamond', label: 'Diamond' },
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

export function ScatterControls({ config, updateSeries, dispatch }: ScatterControlsProps) {
  const seriesType = 'scatterSeries'
  return (
    <FigmaSection title="Scatter" defaultOpen={false} onAdd={() => dispatch({ type: 'ADD_SERIES', seriesType })}>
      {config.scatterSeries.map((s, i) => (
        <FigmaSection key={i} title={s.name || `Scatter ${i + 1}`} defaultOpen={i === 0}>
          <FigmaColor label="Color" tooltip={TIPS['Color']} color={s.color} onChange={(v) => updateSeries(seriesType, i, 'color', v)} />
          <FigmaSelect label="Shape" tooltip={TIPS['Shape']} value={s.shape} options={shapeOptions} onChange={(v) => updateSeries(seriesType, i, 'shape', v)} />
          <LabeledSwitch label="Show Line" tooltip={TIPS['Show Line']} checked={s.showLine} onCheckedChange={(v) => updateSeries(seriesType, i, 'showLine', v)} />
          <FigmaSelect label="Line Type" tooltip={TIPS['Line Type']} value={s.lineType} options={lineTypeOptions} onChange={(v) => updateSeries(seriesType, i, 'lineType', v)} disabled={!s.showLine} disabledReason='Enable "Show Line" first' />
          <FigmaSelect label="Joint Type" tooltip={TIPS['Joint Type']} value={s.lineJointType} options={curveOptions} onChange={(v) => updateSeries(seriesType, i, 'lineJointType', v)} disabled={!s.showLine} disabledReason='Enable "Show Line" first' />
          <LabeledSwitch label="Show Label" tooltip={TIPS['Show Label']} checked={s.showLabel} onCheckedChange={(v) => updateSeries(seriesType, i, 'showLabel', v)} />
          <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={s.labelPosition} options={labelPositionOptions} onChange={(v) => updateSeries(seriesType, i, 'labelPosition', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
          <FigmaNumberInput label="Label Size" tooltip={TIPS['Label Size']} value={s.labelFontSize} min={8} max={20} onChange={(v) => updateSeries(seriesType, i, 'labelFontSize', v)} disabled={!s.showLabel} disabledReason='Enable "Show Label" first' />
          <LabeledSwitch label="Hide" tooltip={TIPS['Hide']} checked={s.hide} onCheckedChange={(v) => updateSeries(seriesType, i, 'hide', v)} />
          <FigmaSelect label="Legend Icon" tooltip={TIPS['Legend Icon']} value={s.legendType} options={legendTypeOptions} onChange={(v) => updateSeries(seriesType, i, 'legendType', v)} />
          <FigmaNumberInput label="Anim Begin" tooltip={TIPS['Anim Begin']} value={s.animationBegin} onChange={(v) => updateSeries(seriesType, i, 'animationBegin', v)} min={0} />
          <FigmaNumberInput label="Anim Duration" tooltip={TIPS['Anim Duration']} value={s.animationDuration} onChange={(v) => updateSeries(seriesType, i, 'animationDuration', v)} min={0} />
          <FigmaSelect label="Anim Easing" tooltip={TIPS['Anim Easing']} value={s.animationEasing} options={easingOptions} onChange={(v) => updateSeries(seriesType, i, 'animationEasing', v)} />
          <button
            onClick={() => dispatch({ type: 'REMOVE_SERIES', seriesType, index: i })}
            disabled={config.scatterSeries.length <= 1}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed mt-1"
          >
            <Trash2 className="h-3 w-3" />
            Remove series
          </button>
        </FigmaSection>
      ))}
    </FigmaSection>
  )
}
