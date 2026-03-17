import { useCallback, type RefObject } from 'react'

function getChartSvg(containerEl: HTMLElement): SVGSVGElement | null {
  return containerEl.querySelector('svg.recharts-surface') ?? containerEl.querySelector('svg')
}

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  // Ensure width/height attributes are set for standalone SVG
  const box = svg.getBoundingClientRect()
  clone.setAttribute('width', String(box.width))
  clone.setAttribute('height', String(box.height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Inline computed styles for text elements so they render correctly outside the DOM
  const originalTexts = svg.querySelectorAll('text, tspan')
  const clonedTexts = clone.querySelectorAll('text, tspan')
  originalTexts.forEach((orig, i) => {
    const computed = window.getComputedStyle(orig)
    const el = clonedTexts[i] as SVGElement
    if (el) {
      el.style.fontFamily = computed.fontFamily
      el.style.fontSize = computed.fontSize
      el.style.fontWeight = computed.fontWeight
      el.style.fill = computed.fill
    }
  })

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
    const svgString = serializeSvg(svg)
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
