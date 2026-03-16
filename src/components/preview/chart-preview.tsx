import { useCallback, useRef } from 'react'
import { ChartRenderer } from './chart-renderer'
import { ConfigCodeView } from './config-code-view'
import type { ChartConfig } from '@/types/chart-config'

interface ChartPreviewProps {
  config: ChartConfig
  update: (path: string, value: unknown) => void
}

export function ChartPreview({ config, update }: ChartPreviewProps) {
  const { chartWidth, chartHeight } = config
  const hasFixedWidth = chartWidth > 0
  const containerRef = useRef<HTMLDivElement>(null)

  const startDrag = useCallback(
    (edge: 'right' | 'bottom' | 'corner') => (e: React.MouseEvent) => {
      e.preventDefault()
      const el = containerRef.current
      if (!el) return

      const startX = e.clientX
      const startY = e.clientY
      const startW = el.offsetWidth
      const startH = el.offsetHeight

      const onMove = (ev: MouseEvent) => {
        if (edge === 'right' || edge === 'corner') {
          const newW = Math.max(200, startW + (ev.clientX - startX))
          // Subtract padding (48px = p-6 * 2) to get chart content width
          update('chartWidth', Math.round(newW - 48))
        }
        if (edge === 'bottom' || edge === 'corner') {
          const newH = Math.max(150, startH + (ev.clientY - startY))
          update('chartHeight', Math.round(newH - 48))
        }
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor =
        edge === 'corner' ? 'nwse-resize' : edge === 'right' ? 'ew-resize' : 'ns-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [update],
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="relative"
          style={{
            width: hasFixedWidth ? chartWidth + 48 : '100%',
            maxWidth: hasFixedWidth ? undefined : '56rem',
          }}
        >
          <div
            ref={containerRef}
            className="bg-card rounded-lg p-6 border border-border w-full"
            style={{ height: chartHeight + 48 }}
          >
            <ChartRenderer config={config} />
          </div>

          {/* Right edge handle */}
          <div
            className="absolute top-0 -right-1.5 w-3 h-full cursor-ew-resize group flex items-center justify-center"
            onMouseDown={startDrag('right')}
          >
            <div className="w-0.5 h-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>

          {/* Bottom edge handle */}
          <div
            className="absolute -bottom-1.5 left-0 h-3 w-full cursor-ns-resize group flex items-center justify-center"
            onMouseDown={startDrag('bottom')}
          >
            <div className="h-0.5 w-8 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>

          {/* Corner handle */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 cursor-nwse-resize group flex items-center justify-center"
            onMouseDown={startDrag('corner')}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
          </div>
        </div>
      </div>
      <div className="shrink-0 bg-sidebar-background border-t border-border">
        <ConfigCodeView config={config} />
      </div>
    </div>
  )
}
