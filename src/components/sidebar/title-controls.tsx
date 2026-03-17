import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaColor } from '@/components/shared/figma-color'
import { FigmaTextInput, FigmaNumberInput } from '@/components/shared/figma-input'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig } from '@/types/chart-config'

interface TitleControlsProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

export function TitleControls({ config, update }: TitleControlsProps) {
  const t = config.title

  return (
    <FigmaSection
      title="Title"
      visible={t.show}
      onVisibleChange={(v) => update('title.show', v)}
    >
      <FigmaTextInput label="Title" value={t.text} onChange={(v) => update('title.text', v)} placeholder="Chart title" />
      <FigmaNumberInput label="Size" tooltip={TIPS['Font Size']} value={t.fontSize} onChange={(v) => update('title.fontSize', v)} min={10} max={36} />
      <FigmaColor label="Color" tooltip={TIPS['Font Color']} color={t.fontColor} onChange={(v) => update('title.fontColor', v)} />
      <FigmaSelect label="Align" tooltip={TIPS['Align']} value={t.align} options={alignOptions} onChange={(v) => update('title.align', v)} />
      <FigmaTextInput label="Subtitle" value={t.subtitle} onChange={(v) => update('title.subtitle', v)} placeholder="Subtitle" />
      <FigmaNumberInput label="Sub Size" tooltip={TIPS['Font Size']} value={t.subtitleFontSize} onChange={(v) => update('title.subtitleFontSize', v)} min={8} max={24} />
      <FigmaColor label="Sub Color" tooltip={TIPS['Font Color']} color={t.subtitleFontColor} onChange={(v) => update('title.subtitleFontColor', v)} />
    </FigmaSection>
  )
}
