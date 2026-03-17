import { useCallback, type RefObject } from 'react'
import { toPng } from 'html-to-image'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * SVG export: extract the native Recharts <svg>, inline all computed styles,
 * and add a background rect. This produces a clean, editable vector SVG.
 */
const SVG_STYLE_PROPS = [
  'fill', 'fill-opacity', 'fill-rule',
  'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-linecap', 'stroke-linejoin',
  'opacity', 'visibility', 'display',
  'font-family', 'font-size', 'font-weight', 'font-style',
  'text-anchor', 'dominant-baseline', 'letter-spacing',
  'color',
] as const

function buildSvgExport(containerEl: HTMLElement): string | null {
  const svg = containerEl.querySelector('svg.recharts-surface') ?? containerEl.querySelector('svg')
  if (!svg) return null

  const clone = svg.cloneNode(true) as SVGSVGElement
  const box = svg.getBoundingClientRect()

  clone.setAttribute('width', String(box.width))
  clone.setAttribute('height', String(box.height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Inline computed styles from the live DOM into the clone
  const origEls = svg.querySelectorAll('*')
  const cloneEls = clone.querySelectorAll('*')

  origEls.forEach((origEl, i) => {
    const cloneEl = cloneEls[i]
    if (!cloneEl) return

    const computed = window.getComputedStyle(origEl)
    const styles: string[] = []
    for (const prop of SVG_STYLE_PROPS) {
      const val = computed.getPropertyValue(prop)
      if (val && val !== 'none' && val !== 'normal' && val !== 'visible') {
        styles.push(`${prop}:${val}`)
      }
    }
    // Always preserve fill and stroke even when 'none' — they're meaningful in SVG
    const fill = computed.getPropertyValue('fill')
    const stroke = computed.getPropertyValue('stroke')
    if (fill === 'none' && !styles.some(s => s.startsWith('fill:'))) styles.push('fill:none')
    if (stroke === 'none' && !styles.some(s => s.startsWith('stroke:'))) styles.push('stroke:none')

    if (styles.length) {
      cloneEl.setAttribute('style', styles.join(';'))
    }
    // Remove class attrs since they won't resolve in standalone SVG
    cloneEl.removeAttribute('class')
  })

  clone.removeAttribute('class')

  // Add background
  const bgColor = window.getComputedStyle(containerEl).backgroundColor || '#1e1e1e'
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bgRect.setAttribute('width', String(box.width))
  bgRect.setAttribute('height', String(box.height))
  bgRect.setAttribute('fill', bgColor)
  clone.insertBefore(bgRect, clone.firstChild)

  // Remove cursor styles (not useful in exported SVG)
  clone.querySelectorAll('[style*="cursor"]').forEach(el => {
    const style = el.getAttribute('style') || ''
    el.setAttribute('style', style.replace(/cursor:[^;]+;?/g, ''))
  })

  return new XMLSerializer().serializeToString(clone)
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

  const exportSvg = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const svgString = buildSvgExport(el)
    if (!svgString) return
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    downloadBlob(blob, 'chart.svg')
  }, [containerRef])

  return { exportSvg, exportPng }
}
