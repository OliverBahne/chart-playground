import { useCallback, type RefObject } from 'react'

function getChartSvg(containerEl: HTMLElement): SVGSVGElement | null {
  return containerEl.querySelector('svg.recharts-surface') ?? containerEl.querySelector('svg')
}

/** CSS properties that affect SVG rendering and need to be inlined */
const SVG_STYLE_PROPS = [
  'fill', 'fill-opacity', 'fill-rule',
  'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin',
  'opacity', 'visibility', 'display',
  'font-family', 'font-size', 'font-weight', 'font-style',
  'text-anchor', 'dominant-baseline', 'letter-spacing',
  'clip-path', 'clip-rule', 'cursor',
] as const

function inlineStyles(original: SVGSVGElement, clone: SVGSVGElement) {
  const origEls = original.querySelectorAll('*')
  const cloneEls = clone.querySelectorAll('*')

  origEls.forEach((origEl, i) => {
    const cloneEl = cloneEls[i] as SVGElement | HTMLElement
    if (!cloneEl) return

    const computed = window.getComputedStyle(origEl)
    const inlined: string[] = []
    for (const prop of SVG_STYLE_PROPS) {
      const val = computed.getPropertyValue(prop)
      if (val) inlined.push(`${prop}:${val}`)
    }
    if (inlined.length) {
      cloneEl.setAttribute('style', inlined.join(';'))
    }
  })
}

function serializeSvg(svg: SVGSVGElement, bgColor?: string): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const box = svg.getBoundingClientRect()
  clone.setAttribute('width', String(box.width))
  clone.setAttribute('height', String(box.height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Remove any Recharts class names since they won't resolve outside the DOM
  clone.querySelectorAll('[class]').forEach((el) => {
    el.removeAttribute('class')
  })
  clone.removeAttribute('class')

  // Inline all computed styles
  inlineStyles(svg, clone)

  // Optionally prepend a background rect (for PNG export)
  if (bgColor) {
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bgRect.setAttribute('width', '100%')
    bgRect.setAttribute('height', '100%')
    bgRect.setAttribute('fill', bgColor)
    clone.insertBefore(bgRect, clone.firstChild)
  }

  return new XMLSerializer().serializeToString(clone)
}

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

function getContainerBgColor(el: HTMLElement): string {
  const computed = window.getComputedStyle(el)
  return computed.backgroundColor || '#1e1e1e'
}

export function useChartExport(containerRef: RefObject<HTMLElement | null>) {
  const exportSvg = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const svg = getChartSvg(el)
    if (!svg) return

    const svgString = serializeSvg(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    downloadBlob(blob, 'chart.svg')
  }, [containerRef])

  const exportPng = useCallback((scale = 2) => {
    const el = containerRef.current
    if (!el) return
    const svg = getChartSvg(el)
    if (!svg) return

    const box = svg.getBoundingClientRect()
    const bgColor = getContainerBgColor(el)
    const svgString = serializeSvg(svg, bgColor)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = box.width * scale
      canvas.height = box.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, 'chart.png')
      }, 'image/png')
    }
    img.src = url
  }, [containerRef])

  return { exportSvg, exportPng }
}
