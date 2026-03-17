export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'combo'

export type CurveType =
  | 'basis' | 'basisClosed' | 'basisOpen'
  | 'bumpX' | 'bumpY' | 'bump'
  | 'linear' | 'linearClosed'
  | 'natural'
  | 'monotoneX' | 'monotoneY' | 'monotone'
  | 'step' | 'stepBefore' | 'stepAfter'

export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

export type LegendLayout = 'horizontal' | 'vertical'
export type LegendAlign = 'left' | 'center' | 'right'
export type LegendVerticalAlign = 'top' | 'middle' | 'bottom'
export type LegendIconType = 'circle' | 'cross' | 'diamond' | 'line' | 'plainline' | 'rect' | 'square' | 'star' | 'triangle' | 'wye' | 'none'

export type AxisType = 'category' | 'number'
export type XAxisOrientation = 'top' | 'bottom'
export type YAxisOrientation = 'left' | 'right'
export type AxisInterval = 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | number
export type ScaleType = 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal'

export type StackOffsetType = 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette' | 'positive'
export type ScatterSymbol = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye'
export type TooltipTrigger = 'hover' | 'click'
export type IfOverflow = 'discard' | 'hidden' | 'visible' | 'extendDomain'
export type LabelPosition = 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'center'

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

// ─── Axis ───
export interface AxisConfig {
  show: boolean
  dataKey: string
  type: AxisType
  orientation: string // 'top'|'bottom' for X, 'left'|'right' for Y
  label: string
  labelFontSize: number
  labelPosition: string
  // Ticks
  tickCount: number
  tickSize: number
  tickLine: boolean
  tickMargin: number
  tickRotation: number
  tickFontSize: number
  tickFill: string
  minTickGap: number
  interval: AxisInterval
  // Axis line
  axisLine: boolean
  axisLineStroke: string
  // Layout
  paddingStart: number
  paddingEnd: number
  mirror: boolean
  reversed: boolean
  // Numeric
  allowDecimals: boolean
  allowDataOverflow: boolean
  scale: ScaleType
  // Dimensions
  size: number // width for Y, height for X
}

// ─── Grid ───
export interface GridConfig {
  show: boolean
  horizontal: boolean
  vertical: boolean
  stroke: string
  strokeDasharray: string
  fill: string
  fillOpacity: number
  syncWithTicks: boolean
}

// ─── Tooltip ───
export interface TooltipConfig {
  show: boolean
  trigger: TooltipTrigger
  shared: boolean
  separator: string
  offset: number
  filterNull: boolean
  cursor: boolean
  cursorStroke: string
  cursorStrokeDasharray: string
  useTranslate3d: boolean
  // Content style
  backgroundColor: string
  borderColor: string
  borderRadius: number
  fontSize: number
  fontColor: string
  // Label style
  labelFontSize: number
  labelColor: string
  // Animation
  animationDuration: number
  animationEasing: AnimationEasing
  // Escape
  allowEscapeViewBoxX: boolean
  allowEscapeViewBoxY: boolean
}

// ─── Legend ───
export interface LegendConfig {
  show: boolean
  layout: LegendLayout
  align: LegendAlign
  verticalAlign: LegendVerticalAlign
  iconSize: number
  iconType: LegendIconType
  fontSize: number
  fontColor: string
  inactiveColor: string
}

// ─── Line Series ───
export interface LineSeriesConfig {
  dataKey: string
  name: string
  color: string
  type: CurveType
  strokeWidth: number
  strokeDasharray: string
  // Dots
  showDots: boolean
  dotSize: number
  dotFill: string
  dotStroke: string
  dotStrokeWidth: number
  // Active dot
  showActiveDot: boolean
  activeDotSize: number
  // Behavior
  connectNulls: boolean
  hide: boolean
  // Labels
  showLabel: boolean
  labelPosition: LabelPosition
  labelFontSize: number
  // Legend
  legendType: LegendIconType
  unit: string
  // Animation
  animationBegin: number
  animationDuration: number
  animationEasing: AnimationEasing
}

// ─── Area Series ───
export interface AreaSeriesConfig extends LineSeriesConfig {
  fillColor: string
  fillOpacity: number
  stackId: string
}

// ─── Bar Series ───
export interface BarSeriesConfig {
  dataKey: string
  name: string
  color: string
  strokeColor: string
  strokeWidth: number
  // Shape
  barSize: number | undefined
  maxBarSize: number
  minPointSize: number
  radius: [number, number, number, number]
  // Stacking
  stackId: string
  // Background
  showBackground: boolean
  backgroundFill: string
  backgroundRadius: number
  // Labels
  showLabel: boolean
  labelPosition: LabelPosition
  labelFontSize: number
  labelColor: string
  // Behavior
  hide: boolean
  legendType: LegendIconType
  unit: string
  // Animation
  animationBegin: number
  animationDuration: number
  animationEasing: AnimationEasing
}

// ─── Pie ───
export interface PieSliceConfig {
  name: string
  color: string
}

export interface PieConfig {
  dataKey: string
  nameKey: string
  cx: string
  cy: string
  innerRadius: number
  outerRadius: number
  cornerRadius: number
  startAngle: number
  endAngle: number
  paddingAngle: number
  minAngle: number
  // Stroke
  stroke: string
  strokeWidth: number
  // Labels
  showLabels: boolean
  labelFontSize: number
  showLabelLine: boolean
  // Slices
  slices: PieSliceConfig[]
  // Animation
  animationBegin: number
  animationDuration: number
  animationEasing: AnimationEasing
}

// ─── Scatter Series ───
export interface ScatterSeriesConfig {
  name: string
  color: string
  shape: ScatterSymbol
  showLine: boolean
  lineType: 'fitting' | 'joint'
  lineJointType: CurveType
  // Labels
  showLabel: boolean
  labelPosition: LabelPosition
  labelFontSize: number
  // Behavior
  hide: boolean
  legendType: LegendIconType
  // Animation
  animationBegin: number
  animationDuration: number
  animationEasing: AnimationEasing
}

// ─── Brush ───
export interface BrushConfig {
  show: boolean
  height: number
  stroke: string
  fill: string
  travellerWidth: number
  gap: number
  dataKey: string
}

// ─── Reference Lines ───
export interface ReferenceLineConfig {
  id: string
  axis: 'x' | 'y'
  value: string | number
  stroke: string
  strokeWidth: number
  strokeDasharray: string
  label: string
  labelPosition: LabelPosition
  ifOverflow: IfOverflow
}

// ─── Reference Areas ───
export interface ReferenceAreaConfig {
  id: string
  x1: string | number
  x2: string | number
  y1: string | number
  y2: string | number
  fill: string
  fillOpacity: number
  stroke: string
  strokeWidth: number
  label: string
  ifOverflow: IfOverflow
}

// ─── Chart Layout ───
export interface ChartLayoutConfig {
  layout: 'horizontal' | 'vertical'
  stackOffset: StackOffsetType
  reverseStackOrder: boolean
  barCategoryGap: number
  barGap: number
  barSize: number | undefined
  maxBarSize: number
}

// ─── Title ───
export interface TitleConfig {
  show: boolean
  text: string
  fontSize: number
  fontColor: string
  align: 'left' | 'center' | 'right'
  subtitle: string
  subtitleFontSize: number
  subtitleFontColor: string
}

// ─── Main Config ───
export interface ChartConfig {
  chartType: ChartType
  chartWidth: number   // 0 = 100% responsive
  chartHeight: number
  margin: Margin
  animationEnabled: boolean
  title: TitleConfig

  // Chart layout
  chartLayout: ChartLayoutConfig

  // Per-type series
  lineSeries: LineSeriesConfig[]
  areaSeries: AreaSeriesConfig[]
  barSeries: BarSeriesConfig[]
  pie: PieConfig
  scatterSeries: ScatterSeriesConfig[]

  // Axes
  xAxis: AxisConfig
  yAxis: AxisConfig

  // Decorations
  legend: LegendConfig
  grid: GridConfig
  tooltip: TooltipConfig

  // Extras
  brush: BrushConfig
  referenceLines: ReferenceLineConfig[]
  referenceAreas: ReferenceAreaConfig[]
}
