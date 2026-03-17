import { useCallback, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { ChartRenderer } from './chart-renderer'
import { ConfigCodeView } from './config-code-view'
import { useChartExport } from '@/hooks/use-chart-export'
import type { ChartConfig } from '@/types/chart-config'

interface ChartPreviewProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

export function ChartPreview({ config, update }: ChartPreviewProps) {
  const { chartWidth, chartHeight } = config
  const hasFixedWidth = chartWidth > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const { exportSvg, exportPng } = useChartExport(chartRef)
  const [exportOpen, setExportOpen] = useState(false)

  type Edge = 'right' | 'left' | 'bottom' | 'top'

  const startDrag = useCallback(
    (edge: Edge) => (e: React.MouseEvent) => {
      e.preventDefault()
      const el = containerRef.current
      if (!el) return

      const startX = e.clientX
      const startY = e.clientY
      const startW = el.offsetWidth
      const startH = el.offsetHeight

      const resizeH = edge === 'right' || edge === 'left'
      const resizeV = edge === 'bottom' || edge === 'top'
      const invertH = edge === 'left'
      const invertV = edge === 'top'

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        if (resizeH) {
          const newW = Math.max(200, startW + (invertH ? -dx : dx))
          update('chartWidth', Math.round(newW - 48))
        }
        if (resizeV) {
          const newH = Math.max(150, startH + (invertV ? -dy : dy))
          update('chartHeight', Math.round(newH - 48))
        }
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      const cursors: Record<Edge, string> = {
        right: 'ew-resize', left: 'ew-resize',
        bottom: 'ns-resize', top: 'ns-resize',
      }
      document.body.style.cursor = cursors[edge]
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [update],
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative">
        {/* Export button — top-left */}
        <div className="absolute top-4 left-4 z-10">
          <div className="relative">
            <button
              onClick={() => setExportOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Export chart"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
            {exportOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setExportOpen(false)} />
                <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg py-1 min-w-[120px] z-50">
                  <button
                    className="w-full text-left px-3 py-1.5 text-xs text-popover-foreground hover:bg-accent transition-colors"
                    onClick={() => { exportPng(); setExportOpen(false) }}
                  >
                    Export as PNG
                  </button>
                  <button
                    className="w-full text-left px-3 py-1.5 text-xs text-popover-foreground hover:bg-accent transition-colors"
                    onClick={() => { exportSvg(); setExportOpen(false) }}
                  >
                    Export as SVG
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="relative"
          style={{
            width: hasFixedWidth ? chartWidth + 48 : '100%',
            maxWidth: hasFixedWidth ? undefined : '56rem',
          }}
        >
          <div
            ref={(el) => { containerRef.current = el; chartRef.current = el }}
            className="bg-card rounded-lg p-6 border border-border w-full"
            style={{ height: chartHeight + 48 }}
          >
            {config.title.show && (config.title.text || config.title.subtitle) && (
              <div style={{ textAlign: config.title.align, paddingBottom: 8 }}>
                {config.title.text && (
                  <div style={{ fontSize: config.title.fontSize, color: config.title.fontColor, fontWeight: 600, lineHeight: 1.3 }}>
                    {config.title.text}
                  </div>
                )}
                {config.title.subtitle && (
                  <div style={{ fontSize: config.title.subtitleFontSize, color: config.title.subtitleFontColor, lineHeight: 1.3, marginTop: 2 }}>
                    {config.title.subtitle}
                  </div>
                )}
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0, height: '100%' }}>
              <ChartRenderer config={config} />
            </div>
          </div>

          {/* Edge handles */}
          <div className="absolute top-0 -right-1.5 w-3 h-full cursor-ew-resize group flex items-center justify-center" onMouseDown={startDrag('right')}>
            <div className="w-0.5 h-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>
          <div className="absolute top-0 -left-1.5 w-3 h-full cursor-ew-resize group flex items-center justify-center" onMouseDown={startDrag('left')}>
            <div className="w-0.5 h-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>
          <div className="absolute -bottom-1.5 left-0 h-3 w-full cursor-ns-resize group flex items-center justify-center" onMouseDown={startDrag('bottom')}>
            <div className="h-0.5 w-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>
          <div className="absolute -top-1.5 left-0 h-3 w-full cursor-ns-resize group flex items-center justify-center" onMouseDown={startDrag('top')}>
            <div className="h-0.5 w-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>
        </div>
      </div>
      <div className="shrink-0 bg-sidebar-background border-t border-border">
        <ConfigCodeView config={config} />
      </div>
    </div>
  )
}
