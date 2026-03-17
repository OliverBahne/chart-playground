/** Tooltip descriptions for chart settings, keyed by label text. */
export const TIPS: Record<string, string> = {
  // Layout
  Width: 'Chart container width in px. 0 = 100% responsive.',
  Height: 'Chart container height in px.',
  'Container Padding': 'Inner padding of the chart card in px.',
  'Background Color': 'Background color of the chart card.',
  Top: 'Top margin around the chart area.',
  Right: 'Right margin around the chart area.',
  Bottom: 'Bottom margin around the chart area.',
  Left: 'Left margin around the chart area.',

  // Series (shared)
  Color: 'Primary stroke/fill color for this series.',
  Name: 'Display name shown in legend and tooltip.',
  'Data Key': 'Key in the data object this series reads from.',
  Curve: 'Interpolation curve between data points.',
  'Stroke W': 'Width of the line stroke in px.',
  Dash: 'SVG stroke-dasharray pattern, e.g. "5 5".',
  'Show Dots': 'Show a dot marker at each data point.',
  'Dot Size': 'Radius of each data point dot.',
  'Dot Fill': 'Fill color of the data point dots.',
  'Dot Stroke': 'Border color of the data point dots.',
  'Dot Stroke W': 'Border width of the data point dots.',
  'Active Dot': 'Show a highlighted dot on hover.',
  'Active Dot Size': 'Radius of the hover-highlighted dot.',
  'Connect Nulls': 'Draw a line through null/missing data points.',
  Hide: 'Hide this series from the chart.',
  'Show Label': 'Display the data value as a label at each point.',
  'Label Pos': 'Position of the data label relative to the point.',
  'Label Size': 'Font size of the data labels in px.',
  'Label Color': 'Color of the data labels.',
  'Legend Icon': 'Shape of the icon in the legend for this series.',
  Unit: 'Unit suffix appended to tooltip values.',
  'Anim Begin': 'Delay in ms before animation starts.',
  'Anim Duration': 'Duration of the entry animation in ms.',
  'Anim Easing': 'Easing function for the entry animation.',

  // Area-specific
  Fill: 'Fill color of the area below the line.',
  'Fill Opacity': 'Opacity of the area fill (0–1).',
  'Stack ID': 'Group series into a stack by matching IDs.',

  // Bar-specific
  Stroke: 'Border color around each bar.',
  'Bar Size': 'Fixed width of each bar in px. 0 = auto.',
  'Max Bar Size': 'Maximum bar width in px.',
  'Min Point': 'Minimum bar height so small values stay visible.',
  'Radius TL': 'Top-left corner radius of the bar.',
  'Radius TR': 'Top-right corner radius of the bar.',
  Background: 'Show a background shape behind each bar.',
  'BG Fill': 'Fill color of the bar background.',
  'BG Radius': 'Corner radius of the bar background.',

  // Scatter-specific
  Shape: 'Marker shape for scatter points.',
  'Show Line': 'Connect scatter points with a line.',
  'Line Type': 'How the connecting line is computed.',
  'Joint Type': 'Curve interpolation of the connecting line.',

  // Axis
  // (Data Key reused from Series section above)
  Type: 'Axis data type: category (labels) or number (values).',
  Orient: 'Which side of the chart the axis appears on.',
  Label: 'Text label displayed alongside the axis.',
  'Tick Count': 'Suggested number of axis ticks.',
  'Tick Size': 'Length of each tick mark in px.',
  'Tick Line': 'Show tick marks on the axis.',
  'Tick Margin': 'Space between tick mark and tick label in px.',
  'Tick Rotation': 'Rotation angle of tick labels in degrees.',
  'Tick Font': 'Font size of axis tick labels.',
  'Tick Fill': 'Color of the axis tick labels.',
  'Min Gap': 'Minimum gap between tick labels in px.',
  Interval: 'Which ticks to show when they overlap.',
  'Show Axis': 'Show the axis line.',
  'Axis Stroke': 'Color of the axis line.',
  Padding: 'Extra padding at the axis start/end.',
  Mirror: 'Flip axis ticks and labels to the other side.',
  Reversed: 'Reverse the axis direction.',
  Decimals: 'Allow decimal values on the axis.',
  Overflow: 'Allow data points outside the axis range.',
  Scale: 'Scale type for the axis (auto, linear, log, etc.).',
  Size: 'Width (Y axis) or height (X axis) in px.',

  // Grid
  Horizontal: 'Show horizontal grid lines.',
  Vertical: 'Show vertical grid lines.',
  'Sync Ticks': 'Align grid lines with axis ticks.',
  // (Fill Opacity reused from Area section above)

  // Tooltip
  Trigger: 'How the tooltip is activated: hover or click.',
  Shared: 'Show all series in one tooltip vs. one at a time.',
  Separator: 'Text between series name and value in tooltip.',
  Offset: 'Distance from the cursor to the tooltip in px.',
  'Filter Null': 'Hide series with null values from the tooltip.',
  Cursor: 'Show a crosshair line following the cursor.',
  'Cursor Stroke': 'Color of the tooltip cursor line.',
  'Cursor Dash': 'Dash pattern of the tooltip cursor line.',
  Translate3d: 'Use CSS translate3d for smoother tooltip movement.',
  'BG Color': 'Background color of the tooltip.',
  'Border Color': 'Border color of the tooltip.',
  'Border Radius': 'Corner radius of the tooltip.',
  'Font Size': 'Font size of tooltip content.',
  'Font Color': 'Text color of tooltip content.',
  'Label Font': 'Font size of the tooltip header label.',
  // (Label Color reused from Series section above)
  'Escape X': 'Allow tooltip to extend beyond chart on X axis.',
  'Escape Y': 'Allow tooltip to extend beyond chart on Y axis.',

  // Legend
  Layout: 'Arrangement direction: horizontal or vertical.',
  Align: 'Horizontal alignment of the legend.',
  'V Align': 'Vertical alignment of the legend.',
  'Icon Size': 'Size of legend icons in px.',
  'Icon Type': 'Shape of the legend icons.',
  // (Font Color reused from Tooltip section above)
  'Inactive': 'Color of disabled/inactive legend items.',
  'Legend Margin Top': 'Space above the legend in px.',
  'Legend Margin Bottom': 'Space below the legend in px.',

  // Chart Layout
  'Stack Offset': 'How stacked values are computed (none, expand, etc.).',
  'Reverse Stack': 'Reverse the rendering order of stacked series.',
  'Category Gap': 'Gap between bar groups as a percentage.',
  'Bar Gap': 'Gap between bars within a group in px.',

  // Brush
  'Brush Height': 'Height of the brush selector in px.',
  'Traveller W': 'Width of the brush drag handles in px.',
  Gap: 'Index gap between data points in the brush.',

  // Reference
  Axis: 'Which axis this reference line is drawn on.',
  Value: 'Position value on the axis for the reference line.',
  'Stroke Width': 'Thickness of the reference line.',

  // Title
  Title: 'Main heading displayed above the chart.',
  Weight: 'Font weight of the text.',
  'Line Height': 'Vertical spacing between text lines in px.',
  Subtitle: 'Secondary heading displayed below the title.',
  'Sub Weight': 'Font weight of the subtitle.',
  'Sub Line H': 'Line height of the subtitle in px.',

  // Global
  Animation: 'Enable or disable chart entry animations.',

  // Tooltip animation
  Duration: 'Duration of the tooltip animation in ms.',
  Easing: 'Easing function for the tooltip animation.',

  // Axis advanced
  Rotation: 'Rotation angle of tick labels in degrees.',
  'Pad Start': 'Extra padding at the start of the axis.',
  'Pad End': 'Extra padding at the end of the axis.',
  'Data Overflow': 'Allow data points outside the axis domain.',

  // Reference area bounds
  X1: 'Start X value of the reference area.',
  X2: 'End X value of the reference area.',
  Y1: 'Start Y value of the reference area.',
  Y2: 'End Y value of the reference area.',

  // Pie
  'Name Key': 'Data field used for slice names.',
  'Center X': 'Horizontal center of the pie (px or %).',
  'Center Y': 'Vertical center of the pie (px or %).',
  'Inner R': 'Inner radius — set > 0 for a donut chart.',
  'Outer R': 'Outer radius of the pie.',
  'Corner R': 'Corner radius of each pie slice.',
  'Start Angle': 'Starting angle of the first slice in degrees.',
  'End Angle': 'Ending angle of the last slice in degrees.',
  'Pad Angle': 'Gap angle between slices in degrees.',
  'Min Angle': 'Minimum angle for very small slices.',
  'Show Labels': 'Display value labels on pie slices.',
  'Label Line': 'Show connector lines to pie labels.',
}
