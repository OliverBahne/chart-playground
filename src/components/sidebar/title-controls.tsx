import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaSelect } from '@/components/shared/figma-select'
import { FigmaColor } from '@/components/shared/figma-color'
import { FigmaNumberInput } from '@/components/shared/figma-input'
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
      <div className="figma-row">
        <label className="figma-label shrink-0">Title</label>
        <input
          className="figma-input flex-1"
          value={t.text}
          onChange={(e) => update('title.text', e.target.value)}
          placeholder="Chart title"
        />
      </div>
      <FigmaNumberInput label="Size" tooltip={TIPS['Font Size']} value={t.fontSize} onChange={(v) => update('title.fontSize', v)} min={10} max={36} />
      <FigmaColor label="Color" tooltip={TIPS['Font Color']} color={t.fontColor} onChange={(v) => update('title.fontColor', v)} />
      <FigmaSelect label="Align" tooltip={TIPS['Align']} value={t.align} options={alignOptions} onChange={(v) => update('title.align', v)} />
      <div className="figma-row">
        <label className="figma-label shrink-0">Subtitle</label>
        <input
          className="figma-input flex-1"
          value={t.subtitle}
          onChange={(e) => update('title.subtitle', e.target.value)}
          placeholder="Subtitle"
        />
      </div>
      <FigmaNumberInput label="Sub Size" tooltip={TIPS['Font Size']} value={t.subtitleFontSize} onChange={(v) => update('title.subtitleFontSize', v)} min={8} max={24} />
      <FigmaColor label="Sub Color" tooltip={TIPS['Font Color']} color={t.subtitleFontColor} onChange={(v) => update('title.subtitleFontColor', v)} />
    </FigmaSection>
  )
}
