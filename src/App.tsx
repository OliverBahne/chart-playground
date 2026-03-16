import { AppLayout } from '@/components/layout/app-layout'
import { ConfigSidebar } from '@/components/sidebar/config-sidebar'
import { ChartPreview } from '@/components/preview/chart-preview'
import { useChartConfig } from '@/hooks/use-chart-config'
import { usePresets } from '@/hooks/use-presets'

export default function App() {
  const { config, dispatch, update, updateSeries } = useChartConfig()
  const { presets, save, remove } = usePresets()

  return (
    <AppLayout
      sidebar={
        <ConfigSidebar
          config={config}
          dispatch={dispatch}
          update={update}
          updateSeries={updateSeries}
          presets={presets}
          onSavePreset={save}
          onRemovePreset={remove}
        />
      }
      preview={
        <ChartPreview config={config} update={update} />
      }
    />
  )
}
