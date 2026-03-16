import { FigmaSection } from '@/components/shared/figma-section'
import { FigmaNumberInput } from '@/components/shared/figma-input'
import { TIPS } from '@/constants/tooltips'
import type { ChartConfig } from '@/types/chart-config'

interface MarginControlProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

export function MarginControl({ config, update }: MarginControlProps) {
  return (
    <FigmaSection title="Layout">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <FigmaNumberInput label="Width" tooltip={TIPS['Width']} value={config.chartWidth} onChange={(v) => update('chartWidth', v)} min={0} max={2000} step={10} />
        <FigmaNumberInput label="Height" tooltip={TIPS['Height']} value={config.chartHeight} onChange={(v) => update('chartHeight', v)} min={100} max={2000} step={10} />
      </div>
      <span className="text-[10px] text-muted-foreground">Width 0 = 100% responsive</span>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
        <FigmaNumberInput label="Top" tooltip={TIPS['Top']} value={config.margin.top} onChange={(v) => update('margin.top', v)} min={0} max={200} />
        <FigmaNumberInput label="Right" tooltip={TIPS['Right']} value={config.margin.right} onChange={(v) => update('margin.right', v)} min={0} max={200} />
        <FigmaNumberInput label="Bottom" tooltip={TIPS['Bottom']} value={config.margin.bottom} onChange={(v) => update('margin.bottom', v)} min={0} max={200} />
        <FigmaNumberInput label="Left" tooltip={TIPS['Left']} value={config.margin.left} onChange={(v) => update('margin.left', v)} min={0} max={200} />
      </div>
    </FigmaSection>
  )
}
