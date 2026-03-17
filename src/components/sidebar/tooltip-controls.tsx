import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { FigmaColor } from '@/components/shared/figma-color'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig, AnimationEasing } from '@/types/chart-config'

interface TooltipControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const triggerOptions = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' },
]

const easingOptions: { value: AnimationEasing; label: string }[] = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
]

export function TooltipControls({ config, update }: TooltipControlsProps) {
  const tt = config.tooltip

  return (
    <FigmaSection
      title="Tooltip"
      defaultOpen={false}
      visible={tt.show}
      onVisibleChange={(v) => update('tooltip.show', v)}
    >
      <FigmaSelect label="Trigger" tooltip={TIPS['Trigger']} value={tt.trigger} options={triggerOptions} onChange={(v) => update('tooltip.trigger', v)} />
      <LabeledSwitch label="Shared" tooltip={TIPS['Shared']} checked={tt.shared} onCheckedChange={(v) => update('tooltip.shared', v)} />
      <FigmaTextInput label="Separator" tooltip={TIPS['Separator']} value={tt.separator} onChange={(v) => update('tooltip.separator', v)} />
      <FigmaNumberInput label="Offset" tooltip={TIPS['Offset']} value={tt.offset} onChange={(v) => update('tooltip.offset', v)} />
      <LabeledSwitch label="Filter Null" tooltip={TIPS['Filter Null']} checked={tt.filterNull} onCheckedChange={(v) => update('tooltip.filterNull', v)} />
      <LabeledSwitch label="Cursor" tooltip={TIPS['Cursor']} checked={tt.cursor} onCheckedChange={(v) => update('tooltip.cursor', v)} />
      <FigmaColor label="Cursor Stroke" tooltip={TIPS['Cursor Stroke']} color={tt.cursorStroke} onChange={(v) => update('tooltip.cursorStroke', v)} disabled={!tt.cursor} disabledReason='Enable "Cursor" first' />
      <FigmaTextInput label="Cursor Dash" tooltip={TIPS['Cursor Dash']} value={tt.cursorStrokeDasharray} onChange={(v) => update('tooltip.cursorStrokeDasharray', v)} disabled={!tt.cursor} disabledReason='Enable "Cursor" first' />
      <LabeledSwitch label="Translate3d" tooltip={TIPS['Translate3d']} checked={tt.useTranslate3d} onCheckedChange={(v) => update('tooltip.useTranslate3d', v)} />

      <FigmaSection title="Content Style" defaultOpen={false}>
        <FigmaColor label="BG Color" tooltip={TIPS['BG Color']} color={tt.backgroundColor} onChange={(v) => update('tooltip.backgroundColor', v)} />
        <FigmaColor label="Border" tooltip={TIPS['Border Color']} color={tt.borderColor} onChange={(v) => update('tooltip.borderColor', v)} />
        <FigmaNumberInput label="Border R" tooltip={TIPS['Border Radius']} value={tt.borderRadius} min={0} max={16} onChange={(v) => update('tooltip.borderRadius', v)} />
        <FigmaNumberInput label="Font Size" tooltip={TIPS['Font Size']} value={tt.fontSize} min={8} max={20} onChange={(v) => update('tooltip.fontSize', v)} />
        <FigmaColor label="Font Color" tooltip={TIPS['Font Color']} color={tt.fontColor} onChange={(v) => update('tooltip.fontColor', v)} />
      </FigmaSection>

      <FigmaSection title="Label Style" defaultOpen={false}>
        <FigmaNumberInput label="Label Size" tooltip={TIPS['Label Size']} value={tt.labelFontSize} min={8} max={20} onChange={(v) => update('tooltip.labelFontSize', v)} />
        <FigmaColor label="Label Color" tooltip={TIPS['Label Color']} color={tt.labelColor} onChange={(v) => update('tooltip.labelColor', v)} />
      </FigmaSection>

      <FigmaSection title="Animation" defaultOpen={false}>
        <FigmaNumberInput label="Duration" tooltip={TIPS['Duration']} value={tt.animationDuration} onChange={(v) => update('tooltip.animationDuration', v)} min={0} />
        <FigmaSelect label="Easing" tooltip={TIPS['Easing']} value={tt.animationEasing} options={easingOptions} onChange={(v) => update('tooltip.animationEasing', v)} />
      </FigmaSection>

      <FigmaSection title="Escape" defaultOpen={false}>
        <LabeledSwitch label="Escape X" tooltip={TIPS['Escape X']} checked={tt.allowEscapeViewBoxX} onCheckedChange={(v) => update('tooltip.allowEscapeViewBoxX', v)} />
        <LabeledSwitch label="Escape Y" tooltip={TIPS['Escape Y']} checked={tt.allowEscapeViewBoxY} onCheckedChange={(v) => update('tooltip.allowEscapeViewBoxY', v)} />
      </FigmaSection>
    </FigmaSection>
  )
}
