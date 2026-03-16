import { ScrollArea } from '@/components/ui/scroll-area'
import { LabeledSwitch } from '@/components/shared/labeled-switch'
import { PresetManager } from './preset-manager'
import { ChartTypeSelector } from './chart-type-selector'
import { MarginControl } from './margin-control'
import { ChartLayoutControls } from './chart-layout-controls'
import { SeriesControls } from './series-controls'
import { PieControls } from './pie-controls'
import { ScatterControls } from './scatter-controls'
import { AxisControls } from './axis-controls'
import { GridControls } from './grid-controls'
import { TooltipControls } from './tooltip-controls'
import { LegendControls } from './legend-controls'
import { BrushControls } from './brush-controls'
import { ReferenceControls } from './reference-controls'
import type { ChartConfig } from '@/types/chart-config'
import type { ConfigAction } from '@/hooks/use-chart-config'

interface Preset {
  name: string
  config: ChartConfig
}

interface ConfigSidebarProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
  updateSeries: (seriesType: string, index: number, path: string, value: unknown) => void
  dispatch: React.Dispatch<ConfigAction>
  presets: Preset[]
  onSavePreset: (name: string, config: ChartConfig) => void
  onRemovePreset: (name: string) => void
}

export function ConfigSidebar({
  config,
  update,
  updateSeries,
  dispatch,
  presets,
  onSavePreset,
  onRemovePreset,
}: ConfigSidebarProps) {
  const ct = config.chartType
  const isPie = ct === 'pie'
  const isScatter = ct === 'scatter'
  const showSeries = ct === 'line' || ct === 'bar' || ct === 'area'

  return (
    <ScrollArea className="h-full">
      <div className="py-1">
        <PresetManager
          presets={presets}
          onSave={onSavePreset}
          onRemove={onRemovePreset}
          onLoad={(cfg) => dispatch({ type: 'LOAD_CONFIG', payload: cfg })}
          currentConfig={config}
        />

        <ChartTypeSelector
          value={ct}
          onChange={(type) => dispatch({ type: 'SET_CHART_TYPE', payload: type })}
        />

        <MarginControl config={config} update={update} />

        {ct === 'bar' && (
          <ChartLayoutControls config={config} update={update} />
        )}

        {showSeries && (
          <SeriesControls config={config} update={update} updateSeries={updateSeries} dispatch={dispatch} />
        )}

        {isPie && (
          <PieControls config={config} update={update} />
        )}

        {isScatter && (
          <ScatterControls config={config} updateSeries={updateSeries} dispatch={dispatch} />
        )}

        {!isPie && (
          <>
            <AxisControls axisKey="xAxis" config={config} update={update} />
            <AxisControls axisKey="yAxis" config={config} update={update} />
          </>
        )}

        {!isPie && (
          <GridControls config={config} update={update} />
        )}

        <TooltipControls config={config} update={update} />
        <LegendControls config={config} update={update} />

        {!isPie && !isScatter && (
          <BrushControls config={config} update={update} />
        )}

        {!isPie && (
          <ReferenceControls config={config} update={update} dispatch={dispatch} />
        )}

        <div className="border-b border-border px-3 py-2">
          <LabeledSwitch
            label="Animation"
            checked={config.animationEnabled}
            onCheckedChange={(v) => update('animationEnabled', v)}
          />
        </div>
      </div>
    </ScrollArea>
  )
}
