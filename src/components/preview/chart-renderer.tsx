import { useState, useCallback, useMemo } from 'react'
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Brush,
  ReferenceLine, ReferenceArea,
} from 'recharts'
import type { ChartConfig, AxisConfig, TooltipConfig, LegendConfig, GridConfig, BrushConfig, LabelPosition, LegendIconType } from '@/types/chart-config'
import { getSampleData } from '@/data/sample-data'

interface ChartRendererProps {
  config: ChartConfig
}

let _measureCanvas: HTMLCanvasElement | null = null
function measureTextWidth(text: string, fontSize: number): number {
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas')
  const ctx = _measureCanvas.getContext('2d')!
  ctx.font = `${fontSize}px sans-serif`
  return ctx.measureText(text).width
}

function niceNum(range: number, round: boolean): number {
  const exp = Math.floor(Math.log10(range))
  const frac = range / Math.pow(10, exp)
  let nice: number
  if (round) {
    nice = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10
  } else {
    nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10
  }
  return nice * Math.pow(10, exp)
}

function computeAutoAxisWidth(data: any[], axis: AxisConfig, dataKeys: string[]): number {
  const fontSize = axis.tickFontSize || 12
  const tickCount = axis.tickCount || 5

  // For category axis, measure the actual category labels
  if (axis.type === 'category' && axis.dataKey) {
    const labels = data.map(row => String(row[axis.dataKey] ?? ''))
    let maxW = 0
    for (const l of labels) {
      const w = measureTextWidth(l, fontSize)
      if (w > maxW) maxW = w
    }
    return Math.ceil(maxW)
  }

  // For number axis, compute the nice domain ticks Recharts would generate
  const nums: number[] = []
  for (const row of data) {
    for (const key of dataKeys) {
      const v = row[key]
      if (typeof v === 'number') nums.push(v)
    }
  }
  if (nums.length === 0) return 60

  let min = Math.min(...nums)
  let max = Math.max(...nums)
  if (min > 0) min = 0

  const range = niceNum(max - min, false)
  const step = niceNum(range / (tickCount - 1), true)
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step

  const ticks: string[] = []
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) {
    ticks.push(String(Math.round(v * 1e10) / 1e10))
  }

  let maxW = 0
  for (const t of ticks) {
    const w = measureTextWidth(t, fontSize)
    if (w > maxW) maxW = w
  }
  return Math.ceil(maxW)
}

function buildAxisProps(axis: AxisConfig, isX: boolean, autoWidth?: number) {
  if (!axis.show) return null
  return {
    dataKey: axis.dataKey || undefined,
    type: axis.type as 'category' | 'number',
    orientation: axis.orientation as never,
    hide: false,
    tickCount: axis.tickCount,
    tickSize: axis.tickSize,
    tickLine: axis.tickLine,
    tickMargin: axis.tickMargin,
    minTickGap: axis.minTickGap,
    interval: axis.interval as never,
    axisLine: axis.axisLine ? { stroke: axis.axisLineStroke } : false,
    tick: {
      fontSize: axis.tickFontSize,
      fill: axis.tickFill,
      angle: axis.tickRotation,
    },
    mirror: axis.mirror,
    reversed: axis.reversed,
    allowDecimals: axis.allowDecimals,
    allowDataOverflow: axis.allowDataOverflow,
    scale: axis.scale === 'auto' ? undefined : axis.scale,
    ...(isX
      ? {
          ...(axis.size !== 'auto' && { height: axis.size }),
          padding: { left: axis.paddingStart, right: axis.paddingEnd },
        }
      : {
          width: axis.size === 'auto'
            ? (autoWidth ?? 60) + (axis.tickLine ? (axis.tickSize || 6) : 0) + (axis.tickMargin ?? 5)
            : axis.size,
          padding: { top: axis.paddingStart, bottom: axis.paddingEnd },
        }
    ),
    label: axis.label
      ? {
          value: axis.label,
          position: (axis.labelPosition || (isX ? 'insideBottom' : 'insideLeft')) as LabelPosition,
          fontSize: axis.labelFontSize,
          angle: isX ? 0 : -90,
          offset: isX ? -5 : 10,
        }
      : undefined,
  }
}

function CustomTooltipContent({ active, payload, label, config }: any) {
  const t: TooltipConfig = config
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: t.backgroundColor,
        border: `1px solid ${t.borderColor}`,
        borderRadius: t.borderRadius,
        padding: '8px 12px',
        fontSize: t.fontSize,
        color: t.fontColor,
      }}
    >
      <div style={{ fontSize: t.labelFontSize, color: t.labelColor, marginBottom: 4 }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span>{entry.name}{t.separator}{entry.value}{entry.unit ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

function buildTooltipProps(t: TooltipConfig) {
  if (!t.show) return null
  return {
    trigger: t.trigger,
    shared: t.shared,
    offset: t.offset,
    filterNull: t.filterNull,
    cursor: t.cursor ? { stroke: t.cursorStroke, strokeDasharray: t.cursorStrokeDasharray } : false,
    useTranslate3d: t.useTranslate3d,
    allowEscapeViewBox: { x: t.allowEscapeViewBoxX, y: t.allowEscapeViewBoxY },
    isAnimationActive: true,
    animationDuration: t.animationDuration,
    animationEasing: t.animationEasing,
    content: <CustomTooltipContent config={t} />,
  }
}

function buildGridElement(g: GridConfig) {
  if (!g.show) return null
  return (
    <CartesianGrid
      horizontal={g.horizontal}
      vertical={g.vertical}
      stroke={g.stroke}
      strokeDasharray={g.strokeDasharray}
      fill={g.fill === 'none' ? undefined : g.fill}
      fillOpacity={g.fillOpacity}
      syncWithTicks={g.syncWithTicks}
    />
  )
}

function buildBrushElement(b: BrushConfig) {
  if (!b.show) return null
  return (
    <Brush
      dataKey={b.dataKey}
      height={b.height}
      stroke={b.stroke}
      fill={b.fill}
      travellerWidth={b.travellerWidth}
      gap={b.gap}
    />
  )
}

function getSeriesKeys(config: ChartConfig): string[] {
  switch (config.chartType) {
    case 'line': return config.lineSeries.map(s => s.dataKey)
    case 'area': return config.areaSeries.map(s => s.dataKey)
    case 'bar': return config.barSeries.map(s => s.dataKey)
    case 'combo': {
      const keys = new Set<string>()
      config.barSeries.forEach(s => keys.add(s.dataKey))
      config.lineSeries.forEach(s => keys.add(s.dataKey))
      return [...keys]
    }
    default: return []
  }
}

// ── Legend items from config ──

interface LegendItem {
  key: string
  name: string
  color: string
  iconType: LegendIconType
}

function getLegendItems(config: ChartConfig): LegendItem[] {
  switch (config.chartType) {
    case 'line':
      return config.lineSeries.map(s => ({ key: s.dataKey, name: s.name, color: s.color, iconType: s.legendType }))
    case 'area':
      return config.areaSeries.map(s => ({ key: s.dataKey, name: s.name, color: s.color, iconType: s.legendType }))
    case 'bar':
      return config.barSeries.map(s => ({ key: s.dataKey, name: s.name, color: s.color, iconType: s.legendType }))
    case 'combo': {
      const items: LegendItem[] = []
      config.barSeries.forEach(s => items.push({ key: s.dataKey, name: s.name, color: s.color, iconType: s.legendType }))
      config.lineSeries.forEach(s => items.push({ key: s.dataKey, name: s.name, color: s.color, iconType: s.legendType }))
      return items
    }
    case 'scatter':
      return config.scatterSeries.map(s => ({ key: s.name, name: s.name, color: s.color, iconType: s.legendType }))
    case 'pie':
      return config.pie.slices.map(s => ({ key: s.name, name: s.name, color: s.color, iconType: 'rect' as LegendIconType }))
    default:
      return []
  }
}

function LegendIcon({ type, color, size }: { type: LegendIconType; color: string; size: number }) {
  if (type === 'line' || type === 'plainline') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={color} strokeWidth={2} />
      </svg>
    )
  }
  if (type === 'circle') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill={color} />
      </svg>
    )
  }
  // Default: rect / square
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: 2,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  )
}

interface CustomLegendProps {
  items: LegendItem[]
  config: LegendConfig
  hiddenSeries: Set<string>
  onToggle: (key: string) => void
}

function CustomLegend({ items, config, hiddenSeries, onToggle }: CustomLegendProps) {
  if (!config.show || items.length === 0) return null

  const isVertical = config.layout === 'vertical'

  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' } as const
  const justifyContent = alignMap[config.align] || 'center'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: isVertical ? 4 : 12,
        justifyContent,
        marginTop: config.marginTop || undefined,
        marginBottom: config.marginBottom || undefined,
        fontSize: config.fontSize,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {items.map((item) => {
        const hidden = hiddenSeries.has(item.key)
        const iconType = item.iconType === 'none' ? 'rect' : item.iconType
        return (
          <div
            key={item.key}
            onClick={() => onToggle(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: hidden ? config.inactiveColor : config.fontColor,
              opacity: hidden ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <LegendIcon
              type={iconType}
              color={hidden ? config.inactiveColor : item.color}
              size={config.iconSize}
            />
            <span>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const data = getSampleData(config.chartType, getSeriesKeys(config)) as any
  const { margin, xAxis, yAxis, tooltip, legend, grid, brush, referenceLines, referenceAreas } = config
  const anim = config.animationEnabled

  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const handleToggle = useCallback((key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const isHidden = (key: string) => hiddenSeries.has(key)

  const yAutoWidth = useMemo(() => {
    if (yAxis.size !== 'auto') return undefined
    const keys = getSeriesKeys(config)
    return computeAutoAxisWidth(data, yAxis, keys)
  }, [yAxis, data, config])

  const effectiveMargin = yAxis.size === 'auto' ? { ...margin, left: 0 } : margin

  const xAxisProps = buildAxisProps(xAxis, true)
  const yAxisProps = buildAxisProps(yAxis, false, yAutoWidth)
  const tooltipEl = tooltip.show ? <Tooltip {...buildTooltipProps(tooltip)!} /> : null
  const gridEl = buildGridElement(grid)
  const brushEl = buildBrushElement(brush)

  const legendItems = useMemo(() => getLegendItems(config), [config])
  const legendAtTop = legend.verticalAlign === 'top' || legend.verticalAlign === 'middle'
  const legendEl = (
    <CustomLegend items={legendItems} config={legend} hiddenSeries={hiddenSeries} onToggle={handleToggle} />
  )

  const refLineEls = referenceLines.map((rl) => (
    <ReferenceLine
      key={rl.id}
      {...(rl.axis === 'x' ? { x: rl.value } : { y: rl.value })}
      stroke={rl.stroke}
      strokeWidth={rl.strokeWidth}
      strokeDasharray={rl.strokeDasharray}
      ifOverflow={rl.ifOverflow}
      label={rl.label ? { value: rl.label, position: rl.labelPosition as never, fontSize: 11 } : undefined}
    />
  ))

  const refAreaEls = referenceAreas.map((ra) => (
    <ReferenceArea
      key={ra.id}
      x1={ra.x1 || undefined}
      x2={ra.x2 || undefined}
      y1={ra.y1 || undefined}
      y2={ra.y2 || undefined}
      fill={ra.fill}
      fillOpacity={ra.fillOpacity}
      stroke={ra.stroke || undefined}
      strokeWidth={ra.strokeWidth}
      ifOverflow={ra.ifOverflow}
      label={ra.label ? { value: ra.label, fontSize: 11 } : undefined}
    />
  ))

  const wrapChart = (chart: React.ReactElement) => (
    <div className="flex flex-col h-full">
      {legendAtTop && legendEl}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
      {!legendAtTop && legendEl}
    </div>
  )

  // ── PIE ──
  if (config.chartType === 'pie') {
    const p = config.pie
    return wrapChart(
      <PieChart margin={effectiveMargin}>
        <Pie
          data={data}
          dataKey={p.dataKey}
          nameKey={p.nameKey}
          cx={p.cx}
          cy={p.cy}
          innerRadius={p.innerRadius}
          outerRadius={p.outerRadius}
          cornerRadius={p.cornerRadius}
          startAngle={p.startAngle}
          endAngle={p.endAngle}
          paddingAngle={p.paddingAngle}
          minAngle={p.minAngle}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          isAnimationActive={anim}
          animationBegin={p.animationBegin}
          animationDuration={p.animationDuration}
          animationEasing={p.animationEasing}
          label={p.showLabels ? { fontSize: p.labelFontSize } : false}
          labelLine={p.showLabelLine}
        >
          {(data as { name: string; value: number }[]).map((_entry, index) => (
            <Cell key={index} fill={p.slices[index % p.slices.length]?.color ?? '#8884d8'} />
          ))}
        </Pie>
        {tooltipEl}
      </PieChart>
    )
  }

  // ── SCATTER ──
  if (config.chartType === 'scatter') {
    return wrapChart(
      <ScatterChart margin={effectiveMargin}>
        {gridEl}
        {xAxisProps && <XAxis {...xAxisProps} dataKey="x" type="number" />}
        {yAxisProps && <YAxis {...yAxisProps} dataKey="y" type="number" />}
        {tooltipEl}
        {refLineEls}
        {refAreaEls}
        {config.scatterSeries.map((s, i) => (
          <Scatter
            key={i}
            name={s.name}
            data={data}
            fill={s.color}
            shape={s.shape}
            line={s.showLine ? { type: s.lineJointType, strokeWidth: 1 } : false}
            hide={s.hide || isHidden(s.name)}
            legendType={s.legendType === 'none' ? undefined : s.legendType}
            isAnimationActive={anim}
            animationBegin={s.animationBegin}
            animationDuration={s.animationDuration}
            animationEasing={s.animationEasing}
            label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize } : false}
          />
        ))}
      </ScatterChart>
    )
  }

  // ── BAR ──
  if (config.chartType === 'bar') {
    const cl = config.chartLayout
    const isVerticalLayout = cl.layout === 'vertical'
    return wrapChart(
      <BarChart
        data={data}
        margin={effectiveMargin}
        layout={cl.layout}
        barGap={cl.barGap}
        barCategoryGap={cl.barCategoryGap}
        barSize={cl.barSize}
        maxBarSize={cl.maxBarSize}
        stackOffset={cl.stackOffset}
        reverseStackOrder={cl.reverseStackOrder}
      >
        {gridEl}
        {xAxisProps && <XAxis {...xAxisProps} {...(isVerticalLayout ? { type: 'number', dataKey: undefined } : {})} />}
        {yAxisProps && <YAxis {...yAxisProps} {...(isVerticalLayout ? { type: 'category', dataKey: xAxis.dataKey || 'name' } : {})} />}
        {tooltipEl}
        {brushEl}
        {refLineEls}
        {refAreaEls}
        {config.barSeries.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            stroke={s.strokeColor !== 'none' ? s.strokeColor : undefined}
            strokeWidth={s.strokeWidth}
            barSize={s.barSize}
            maxBarSize={s.maxBarSize}
            minPointSize={s.minPointSize}
            radius={s.radius}
            stackId={s.stackId || undefined}
            background={s.showBackground ? { fill: s.backgroundFill, radius: s.backgroundRadius } : undefined}
            hide={s.hide || isHidden(s.dataKey)}
            legendType={s.legendType === 'none' ? undefined : s.legendType}
            unit={s.unit || undefined}
            isAnimationActive={anim}
            animationBegin={s.animationBegin}
            animationDuration={s.animationDuration}
            animationEasing={s.animationEasing}
            label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize, fill: s.labelColor } : false}
          />
        ))}
      </BarChart>
    )
  }

  // ── AREA ──
  if (config.chartType === 'area') {
    const cl = config.chartLayout
    return wrapChart(
      <AreaChart
        data={data}
        margin={effectiveMargin}
        layout={cl.layout}
        stackOffset={cl.stackOffset}
      >
        {gridEl}
        {xAxisProps && <XAxis {...xAxisProps} />}
        {yAxisProps && <YAxis {...yAxisProps} />}
        {tooltipEl}
        {brushEl}
        {refLineEls}
        {refAreaEls}
        {config.areaSeries.map((s) => (
          <Area
            key={s.dataKey}
            type={s.type}
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={s.strokeWidth}
            strokeDasharray={s.strokeDasharray || undefined}
            fill={s.fillColor}
            fillOpacity={s.fillOpacity}
            stackId={s.stackId || undefined}
            connectNulls={s.connectNulls}
            hide={s.hide || isHidden(s.dataKey)}
            dot={s.showDots ? { r: s.dotSize, fill: s.dotFill, stroke: s.dotStroke, strokeWidth: s.dotStrokeWidth } : false}
            activeDot={s.showActiveDot ? { r: s.activeDotSize } : false}
            legendType={s.legendType === 'none' ? undefined : s.legendType}
            unit={s.unit || undefined}
            isAnimationActive={anim}
            animationBegin={s.animationBegin}
            animationDuration={s.animationDuration}
            animationEasing={s.animationEasing}
            label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize } : false}
          />
        ))}
      </AreaChart>
    )
  }

  // ── COMBO ──
  if (config.chartType === 'combo') {
    const cl = config.chartLayout
    const isVerticalLayout = cl.layout === 'vertical'
    return wrapChart(
      <ComposedChart
        data={data}
        margin={effectiveMargin}
        layout={cl.layout}
        barGap={cl.barGap}
        barCategoryGap={cl.barCategoryGap}
        barSize={cl.barSize}
        maxBarSize={cl.maxBarSize}
      >
        {gridEl}
        {xAxisProps && <XAxis {...xAxisProps} {...(isVerticalLayout ? { type: 'number', dataKey: undefined } : {})} />}
        {yAxisProps && <YAxis {...yAxisProps} {...(isVerticalLayout ? { type: 'category', dataKey: xAxis.dataKey || 'name' } : {})} />}
        {tooltipEl}
        {brushEl}
        {refLineEls}
        {refAreaEls}
        {config.barSeries.map((s) => (
          <Bar
            key={`bar-${s.dataKey}`}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            stroke={s.strokeColor !== 'none' ? s.strokeColor : undefined}
            strokeWidth={s.strokeWidth}
            barSize={s.barSize}
            maxBarSize={s.maxBarSize}
            minPointSize={s.minPointSize}
            radius={s.radius}
            stackId={s.stackId || undefined}
            background={s.showBackground ? { fill: s.backgroundFill, radius: s.backgroundRadius } : undefined}
            hide={s.hide || isHidden(s.dataKey)}
            legendType={s.legendType === 'none' ? undefined : s.legendType}
            unit={s.unit || undefined}
            isAnimationActive={anim}
            animationBegin={s.animationBegin}
            animationDuration={s.animationDuration}
            animationEasing={s.animationEasing}
            label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize, fill: s.labelColor } : false}
          />
        ))}
        {config.lineSeries.map((s) => (
          <Line
            key={`line-${s.dataKey}`}
            type={s.type}
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={s.strokeWidth}
            strokeDasharray={s.strokeDasharray || undefined}
            connectNulls={s.connectNulls}
            hide={s.hide || isHidden(s.dataKey)}
            dot={s.showDots ? { r: s.dotSize, fill: s.dotFill, stroke: s.dotStroke, strokeWidth: s.dotStrokeWidth } : false}
            activeDot={s.showActiveDot ? { r: s.activeDotSize } : false}
            legendType={s.legendType === 'none' ? undefined : s.legendType}
            unit={s.unit || undefined}
            isAnimationActive={anim}
            animationBegin={s.animationBegin}
            animationDuration={s.animationDuration}
            animationEasing={s.animationEasing}
            label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize } : false}
          />
        ))}
      </ComposedChart>
    )
  }

  // ── LINE (default) ──
  const cl = config.chartLayout
  return wrapChart(
    <LineChart
      data={data}
      margin={effectiveMargin}
      layout={cl.layout}
    >
      {gridEl}
      {xAxisProps && <XAxis {...xAxisProps} />}
      {yAxisProps && <YAxis {...yAxisProps} />}
      {tooltipEl}
      {brushEl}
      {refLineEls}
      {refAreaEls}
      {config.lineSeries.map((s) => (
        <Line
          key={s.dataKey}
          type={s.type}
          dataKey={s.dataKey}
          name={s.name}
          stroke={s.color}
          strokeWidth={s.strokeWidth}
          strokeDasharray={s.strokeDasharray || undefined}
          connectNulls={s.connectNulls}
          hide={s.hide || isHidden(s.dataKey)}
          dot={s.showDots ? { r: s.dotSize, fill: s.dotFill, stroke: s.dotStroke, strokeWidth: s.dotStrokeWidth } : false}
          activeDot={s.showActiveDot ? { r: s.activeDotSize } : false}
          legendType={s.legendType === 'none' ? undefined : s.legendType}
          unit={s.unit || undefined}
          isAnimationActive={anim}
          animationBegin={s.animationBegin}
          animationDuration={s.animationDuration}
          animationEasing={s.animationEasing}
          label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize } : false}
        />
      ))}
    </LineChart>
  )
}
