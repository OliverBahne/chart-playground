import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush,
  ReferenceLine, ReferenceArea,
} from 'recharts'
import type { ChartConfig, AxisConfig, TooltipConfig, LegendConfig, GridConfig, BrushConfig } from '@/types/chart-config'
import { getSampleData } from '@/data/sample-data'

interface ChartRendererProps {
  config: ChartConfig
}

function buildAxisProps(axis: AxisConfig, isX: boolean) {
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
          height: axis.size,
          padding: { left: axis.paddingStart, right: axis.paddingEnd },
        }
      : {
          width: axis.size,
          padding: { top: axis.paddingStart, bottom: axis.paddingEnd },
        }
    ),
    label: axis.label
      ? {
          value: axis.label,
          position: axis.labelPosition || (isX ? 'insideBottom' : 'insideLeft'),
          fontSize: axis.labelFontSize,
          angle: isX ? 0 : -90,
          offset: isX ? -5 : 10,
        }
      : undefined,
  }
}

function buildTooltipProps(t: TooltipConfig) {
  if (!t.show) return null
  return {
    trigger: t.trigger,
    shared: t.shared,
    separator: t.separator,
    offset: t.offset,
    filterNull: t.filterNull,
    cursor: t.cursor ? { stroke: t.cursorStroke, strokeDasharray: t.cursorStrokeDasharray } : false,
    useTranslate3d: t.useTranslate3d,
    allowEscapeViewBox: { x: t.allowEscapeViewBoxX, y: t.allowEscapeViewBoxY },
    isAnimationActive: true,
    animationDuration: t.animationDuration,
    animationEasing: t.animationEasing,
    contentStyle: {
      backgroundColor: t.backgroundColor,
      borderColor: t.borderColor,
      borderRadius: t.borderRadius,
      fontSize: t.fontSize,
      color: t.fontColor,
    },
    labelStyle: {
      fontSize: t.labelFontSize,
      color: t.labelColor,
    },
    itemStyle: {
      fontSize: t.fontSize,
      color: t.fontColor,
    },
  }
}

function buildLegendProps(l: LegendConfig) {
  if (!l.show) return null
  return {
    layout: l.layout,
    align: l.align,
    verticalAlign: l.verticalAlign,
    iconSize: l.iconSize,
    iconType: l.iconType === 'none' ? undefined : l.iconType,
    wrapperStyle: {
      fontSize: l.fontSize,
      color: l.fontColor,
    },
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
    default: return []
  }
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const data = getSampleData(config.chartType, getSeriesKeys(config))
  const { margin, xAxis, yAxis, tooltip, legend, grid, brush, referenceLines, referenceAreas } = config
  const anim = config.animationEnabled

  const xAxisProps = buildAxisProps(xAxis, true)
  const yAxisProps = buildAxisProps(yAxis, false)
  const tooltipEl = tooltip.show ? <Tooltip {...buildTooltipProps(tooltip)!} /> : null
  const legendEl = legend.show ? <Legend {...buildLegendProps(legend)!} /> : null
  const gridEl = buildGridElement(grid)
  const brushEl = buildBrushElement(brush)

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

  // ── PIE ──
  if (config.chartType === 'pie') {
    const p = config.pie
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={margin}>
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
          {legendEl}
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // ── SCATTER ──
  if (config.chartType === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={margin}>
          {gridEl}
          {xAxisProps && <XAxis {...xAxisProps} dataKey="x" type="number" />}
          {yAxisProps && <YAxis {...yAxisProps} dataKey="y" type="number" />}
          {tooltipEl}
          {legendEl}
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
              hide={s.hide}
              legendType={s.legendType === 'none' ? undefined : s.legendType}
              isAnimationActive={anim}
              animationBegin={s.animationBegin}
              animationDuration={s.animationDuration}
              animationEasing={s.animationEasing}
              label={s.showLabel ? { position: s.labelPosition, fontSize: s.labelFontSize } : false}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    )
  }

  // ── BAR ──
  if (config.chartType === 'bar') {
    const cl = config.chartLayout
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={margin}
          layout={cl.layout}
          barGap={cl.barGap}
          barCategoryGap={cl.barCategoryGap}
          barSize={cl.barSize}
          maxBarSize={cl.maxBarSize}
          stackOffset={cl.stackOffset}
          reverseStackOrder={cl.reverseStackOrder}
        >
          {gridEl}
          {xAxisProps && <XAxis {...xAxisProps} />}
          {yAxisProps && <YAxis {...yAxisProps} />}
          {tooltipEl}
          {legendEl}
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
              hide={s.hide}
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
      </ResponsiveContainer>
    )
  }

  // ── AREA ──
  if (config.chartType === 'area') {
    const cl = config.chartLayout
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={margin}
          layout={cl.layout}
          stackOffset={cl.stackOffset}
        >
          {gridEl}
          {xAxisProps && <XAxis {...xAxisProps} />}
          {yAxisProps && <YAxis {...yAxisProps} />}
          {tooltipEl}
          {legendEl}
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
              hide={s.hide}
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
      </ResponsiveContainer>
    )
  }

  // ── LINE (default) ──
  const cl = config.chartLayout
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={margin}
        layout={cl.layout}
      >
        {gridEl}
        {xAxisProps && <XAxis {...xAxisProps} />}
        {yAxisProps && <YAxis {...yAxisProps} />}
        {tooltipEl}
        {legendEl}
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
            hide={s.hide}
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
    </ResponsiveContainer>
  )
}
