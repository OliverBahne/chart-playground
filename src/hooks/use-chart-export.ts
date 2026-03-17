import { useCallback, type RefObject } from 'react'
import { toPng, toSvg } from 'html-to-image'

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function useChartExport(containerRef: RefObject<HTMLElement | null>) {
  const exportPng = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    try {
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: window.getComputedStyle(el).backgroundColor || '#1e1e1e',
      })
      downloadDataUrl(dataUrl, 'chart.png')
    } catch (err) {
      console.error('PNG export failed:', err)
    }
  }, [containerRef])

  const exportSvg = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    try {
      const dataUrl = await toSvg(el, {
        backgroundColor: window.getComputedStyle(el).backgroundColor || '#1e1e1e',
      })
      downloadDataUrl(dataUrl, 'chart.svg')
    } catch (err) {
      console.error('SVG export failed:', err)
    }
  }, [containerRef])

  return { exportSvg, exportPng }
}
