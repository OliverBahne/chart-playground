import { LineChart, BarChart3, AreaChart, PieChart, ScatterChart } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { ChartType } from '@/types/chart-config'

const chartTypes: { value: ChartType; icon: React.ElementType; label: string }[] = [
  { value: 'line', icon: LineChart, label: 'Line' },
  { value: 'bar', icon: BarChart3, label: 'Bar' },
  { value: 'area', icon: AreaChart, label: 'Area' },
  { value: 'pie', icon: PieChart, label: 'Pie' },
  { value: 'scatter', icon: ScatterChart, label: 'Scatter' },
]

interface ChartTypeSelectorProps {
  value: ChartType
  onChange: (type: ChartType) => void
}

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="border-b border-border px-3 py-2">
      <span className="figma-label block mb-1.5">Chart Type</span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => { if (v) onChange(v as ChartType) }}
        className="w-full"
      >
        {chartTypes.map(({ value: v, icon: Icon, label }) => (
          <ToggleGroupItem
            key={v}
            value={v}
            className="flex-1 h-7 px-1.5 text-[11px] gap-1 bg-secondary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
