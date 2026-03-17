import { Trash2 } from 'lucide-react'
import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, LabelPosition, IfOverflow } from '@/types/chart-config'
import type { ConfigAction } from '@/hooks/use-chart-config'

interface ReferenceControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
  dispatch: React.Dispatch<ConfigAction>
}

const axisOptions = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
]

const labelPositionOptions: { value: LabelPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'insideLeft', label: 'Inside Left' },
  { value: 'insideRight', label: 'Inside Right' },
  { value: 'insideTop', label: 'Inside Top' },
  { value: 'insideBottom', label: 'Inside Bottom' },
  { value: 'center', label: 'Center' },
]

const ifOverflowOptions: { value: IfOverflow; label: string }[] = [
  { value: 'discard', label: 'Discard' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'visible', label: 'Visible' },
  { value: 'extendDomain', label: 'Extend Domain' },
]

export function ReferenceControls({ config, update, dispatch }: ReferenceControlsProps) {
  return (
    <>
      <FigmaSection
        title="Reference Lines"
        defaultOpen={false}
        onAdd={() => dispatch({ type: 'ADD_REFERENCE_LINE' })}
      >
        {config.referenceLines.map((ref, i) => (
          <FigmaSection key={ref.id} title={ref.label || `Line ${i + 1}`} defaultOpen={i === 0}>
            <FigmaSelect label="Axis" tooltip={TIPS['Axis']} value={ref.axis} options={axisOptions} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], axis: v as 'x' | 'y' }
              update('referenceLines', lines)
            }} />
            <FigmaTextInput label="Value" tooltip={TIPS['Value']} value={String(ref.value)} onChange={(v) => {
              const lines = [...config.referenceLines]
              const num = parseFloat(v)
              lines[i] = { ...lines[i], value: isNaN(num) ? v : num }
              update('referenceLines', lines)
            }} />
            <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={ref.stroke} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], stroke: v }
              update('referenceLines', lines)
            }} />
            <FigmaNumberInput label="Stroke W" tooltip={TIPS['Stroke Width']} value={ref.strokeWidth} min={0} max={5} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], strokeWidth: v }
              update('referenceLines', lines)
            }} />
            <FigmaTextInput label="Dash" tooltip={TIPS['Dash']} value={ref.strokeDasharray} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], strokeDasharray: v }
              update('referenceLines', lines)
            }} />
            <FigmaTextInput label="Label" tooltip={TIPS['Label']} value={ref.label} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], label: v }
              update('referenceLines', lines)
            }} />
            <FigmaSelect label="Label Pos" tooltip={TIPS['Label Pos']} value={ref.labelPosition} options={labelPositionOptions} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], labelPosition: v as LabelPosition }
              update('referenceLines', lines)
            }} />
            <FigmaSelect label="Overflow" tooltip={TIPS['Overflow']} value={ref.ifOverflow} options={ifOverflowOptions} onChange={(v) => {
              const lines = [...config.referenceLines]
              lines[i] = { ...lines[i], ifOverflow: v as IfOverflow }
              update('referenceLines', lines)
            }} />
            <button
              className="flex items-center gap-1 text-[11px] text-destructive hover:text-destructive/80 mt-1"
              onClick={() => dispatch({ type: 'REMOVE_REFERENCE_LINE', index: i })}
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </FigmaSection>
        ))}
        {config.referenceLines.length === 0 && (
          <span className="text-[11px] text-muted-foreground">No reference lines</span>
        )}
      </FigmaSection>

      <FigmaSection
        title="Reference Areas"
        defaultOpen={false}
        onAdd={() => dispatch({ type: 'ADD_REFERENCE_AREA' })}
      >
        {config.referenceAreas.map((area, i) => (
          <FigmaSection key={area.id} title={area.label || `Area ${i + 1}`} defaultOpen={i === 0}>
            <FigmaTextInput label="X1" tooltip={TIPS['X1']} value={String(area.x1)} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], x1: v }
              update('referenceAreas', areas)
            }} />
            <FigmaTextInput label="X2" tooltip={TIPS['X2']} value={String(area.x2)} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], x2: v }
              update('referenceAreas', areas)
            }} />
            <FigmaTextInput label="Y1" tooltip={TIPS['Y1']} value={String(area.y1)} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], y1: v }
              update('referenceAreas', areas)
            }} />
            <FigmaTextInput label="Y2" tooltip={TIPS['Y2']} value={String(area.y2)} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], y2: v }
              update('referenceAreas', areas)
            }} />
            <FigmaColor label="Fill" tooltip={TIPS['Fill']} color={area.fill} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], fill: v }
              update('referenceAreas', areas)
            }} />
            <FigmaNumberInput label="Fill Opacity" tooltip={TIPS['Fill Opacity']} value={area.fillOpacity} min={0} max={1} step={0.05} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], fillOpacity: v }
              update('referenceAreas', areas)
            }} />
            <FigmaColor label="Stroke" tooltip={TIPS['Stroke']} color={area.stroke} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], stroke: v }
              update('referenceAreas', areas)
            }} />
            <FigmaNumberInput label="Stroke W" tooltip={TIPS['Stroke Width']} value={area.strokeWidth} min={0} max={5} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], strokeWidth: v }
              update('referenceAreas', areas)
            }} />
            <FigmaTextInput label="Label" tooltip={TIPS['Label']} value={area.label} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], label: v }
              update('referenceAreas', areas)
            }} />
            <FigmaSelect label="Overflow" tooltip={TIPS['Overflow']} value={area.ifOverflow} options={ifOverflowOptions} onChange={(v) => {
              const areas = [...config.referenceAreas]
              areas[i] = { ...areas[i], ifOverflow: v as IfOverflow }
              update('referenceAreas', areas)
            }} />
            <button
              className="flex items-center gap-1 text-[11px] text-destructive hover:text-destructive/80 mt-1"
              onClick={() => dispatch({ type: 'REMOVE_REFERENCE_AREA', index: i })}
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </FigmaSection>
        ))}
        {config.referenceAreas.length === 0 && (
          <span className="text-[11px] text-muted-foreground">No reference areas</span>
        )}
      </FigmaSection>
    </>
  )
}
