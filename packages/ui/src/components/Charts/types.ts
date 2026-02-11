import { Accessor, JSX, ParentProps, Setter } from 'solid-js';

import type { ScaleBand, ScaleLinear, ScalePoint } from 'd3-scale';
import { DefaultArcObject, PieArcDatum } from 'd3-shape';

export interface ActivePoint {
  item: Record<string, unknown>;
  x: number;
  y: number;
  /** Bar width/height for bar-style positioning */
  barWidth?: number;
  barHeight?: number;
  /** Band x position and step width for bar cursor rectangle */
  bandX?: number;
  bandWidth?: number;
}

export interface BaseChartContextType {
  width: Accessor<number>;
  height: Accessor<number>;
  innerWidth: Accessor<number>;
  innerHeight: Accessor<number>;
  xKey: Accessor<string>;
  setXKey: Setter<string>;
  xScale: Accessor<ScalePoint<string> | ScaleBand<string>>;
  yScale: Accessor<ScaleLinear<number, number>>;
  yAxisBBox: Accessor<DOMRect | null>;
  setYAxisBBox: Setter<DOMRect | null>;
  xAxisBBox: Accessor<DOMRect | null>;
  setXAxisBBox: Setter<DOMRect | null>;
  activePoint: Accessor<ActivePoint | null>;
  setActivePoint: Setter<ActivePoint | null>;
  registeredKeys: Accessor<readonly string[]>;
  customTooltip: Accessor<((data: Record<string, unknown>) => JSX.Element) | undefined>;
  setCustomTooltip: Setter<((data: Record<string, unknown>) => JSX.Element) | undefined>;
  /** How to position the tooltip: 'beside' (line/area) or 'above' (bar). */
  tooltipPosition: 'beside' | 'above';
  /** Whether a ChartTooltip component is mounted. */
  tooltipEnabled: Accessor<boolean>;
  setTooltipEnabled: Setter<boolean>;
  /** CSS class applied to axis elements (XAxis, YAxis). */
  axisClass?: string;
  /** CSS class applied to the CartesianGrid element. */
  gridClass?: string;
}

export interface LineChartContextType {
  width: Accessor<number>;
  height: Accessor<number>;
  innerWidth: Accessor<number>;
  innerHeight: Accessor<number>;
  xKey: Accessor<string>;
  setXKey: Setter<string>;
  xScale: Accessor<ScalePoint<string>>;
  yScale: Accessor<ScaleLinear<number, number>>;
  yAxisBBox: Accessor<DOMRect | null>;
  setYAxisBBox: Setter<DOMRect | null>;
  xAxisBBox: Accessor<DOMRect | null>;
  setXAxisBBox: Setter<DOMRect | null>;
  data: readonly Record<string, unknown>[];
  registeredLines: Accessor<readonly string[]>;
  registerLine: (k: string) => void;
  activeIndex: Accessor<{
    item: Record<string, unknown>;
    x: number;
    y: number;
    cursor: [number, number];
  } | null>;
  setActiveIndex: Setter<{
    item: Record<string, unknown>;
    x: number;
    y: number;
    cursor: [number, number];
  } | null>;
  setCustomTooltip: Setter<((data: Record<string, unknown>) => JSX.Element) | undefined>;
}

export interface XAxisProps {
  dataKey: string;
  tickCount?: number;
  tickFormatter?: (v: string | number) => string;
  stroke?: string;
  /** Angle to rotate tick labels. */
  angle?: number;
}

/**
 * Props for the LineChart component.
 */
export type LineChartProps = ParentProps<{
  /** Base width of the chart in pixels. */
  width: number;
  /** Base height of the chart in pixels. */
  height: number;
  /** Array of data points to plot. */
  data: readonly Record<string, unknown>[];
  /** Responsive width override. */
  rwidth?: number;
  /** Responsive height override. */
  rheight?: number;
  /** Accessible label for the chart (for screen readers). */
  ariaLabel?: string;
  /** ID of element that describes the chart. */
  ariaDescribedBy?: string;
  /** Title displayed in SVG for accessibility. */
  title?: string;
  /** Description displayed in SVG for accessibility. */
  description?: string;
  /** CSS class applied to axis elements (XAxis, YAxis). */
  axisClass?: string;
  /** CSS class applied to the CartesianGrid element. */
  gridClass?: string;
}>;

export interface YAxisProps {
  tickCount?: number;
  tickFormatter?: (v: number) => string;
  stroke?: string;
}

export interface CartesianGridProps {
  stroke?: string;
  strokeDasharray?: string;
  vertical?: boolean;
  horizontal?: boolean;
}

export interface LineProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  dot?: boolean;
}

export interface ChartTooltipProps {
  /** Color of the vertical indicator line. */
  stroke?: string;
  /** Whether to show the vertical indicator line. @default true */
  withLine?: boolean;
  /** Custom tooltip content render function. */
  content?: (data: Record<string, unknown>) => JSX.Element;
}

export interface Size {
  rwidth: number;
  rheight: number;
}

export interface PieChartContextType {
  width: Accessor<number>;
  height: Accessor<number>;
}

/**
 * Props for the PieChart component.
 */
export type PieChartProps = ParentProps<{
  /** Base width of the chart in pixels. */
  width: number;
  /** Base height of the chart in pixels. */
  height: number;
  /** Responsive width override. */
  rwidth?: number;
  /** Responsive height override. */
  rheight?: number;
  /** Accessible label for the chart (for screen readers). */
  ariaLabel?: string;
  /** ID of element that describes the chart. */
  ariaDescribedBy?: string;
  /** Title displayed in SVG for accessibility. */
  title?: string;
  /** Description displayed in SVG for accessibility. */
  description?: string;
}>;

export type ActiveSector = SectorProps &
  PieArcDatum<Record<string, unknown>> & {
    percent: number;
    cx: number;
    cy: number;
  };

export interface PieProps {
  /** Array of data objects to display. */
  data: Record<string, unknown>[];
  /** Key in data objects containing the numeric value. */
  dataKey: keyof Record<string, unknown>;
  /** Key in data objects containing the label/name (for accessibility). */
  labelKey?: string;
  /** X coordinate of the center (number or percentage string like "50%"). */
  cx: number | string;
  /** Y coordinate of the center (number or percentage string like "50%"). */
  cy: number | string;
  /** Inner radius for donut charts (0 for pie). */
  innerRadius: number;
  /** Outer radius of the chart. */
  outerRadius: number;
  /** Fill color for segments. */
  fill: string;
  /** Custom render function for the active/highlighted segment. */
  activeShape?: (props: ActiveSector) => JSX.Element;
  /** Callback when a segment is selected via click or keyboard. */
  onSegmentSelect?: (data: Record<string, unknown>, index: number) => void;
}

export interface SectorProps extends DefaultArcObject {
  fill: string;
}

// BarChart Types

export interface BarChartContextType {
  width: Accessor<number>;
  height: Accessor<number>;
  innerWidth: Accessor<number>;
  innerHeight: Accessor<number>;
  xKey: Accessor<string>;
  setXKey: Setter<string>;
  xScale: Accessor<ScaleBand<string>>;
  yScale: Accessor<ScaleLinear<number, number>>;
  yAxisBBox: Accessor<DOMRect | null>;
  setYAxisBBox: Setter<DOMRect | null>;
  xAxisBBox: Accessor<DOMRect | null>;
  setXAxisBBox: Setter<DOMRect | null>;
  data: readonly Record<string, unknown>[];
  registeredBars: Accessor<readonly string[]>;
  registerBar: (k: string, stackId?: string) => void;
  /** For stacked bars: returns the cumulative y-value below this bar's segment. */
  getStackBase: (dataKey: string, dataIndex: number) => number;
  /** Returns true if the bar is the topmost in its stack group (or not stacked at all). */
  isTopOfStack: (dataKey: string) => boolean;
  activeIndex: Accessor<{
    item: Record<string, unknown>;
    barKey: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>;
  setActiveIndex: Setter<{
    item: Record<string, unknown>;
    barKey: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>;
  setCustomTooltip: Setter<
    ((data: Record<string, unknown>, barKey: string) => JSX.Element) | undefined
  >;
  /** Spacing between grouped bars (0-1, percentage of bandwidth) */
  barGap: Accessor<number>;
  /** Spacing between bar groups (0-1, percentage of step) */
  barCategoryGap: Accessor<number>;
}

/**
 * Props for the BarChart component.
 */
export type BarChartProps = ParentProps<{
  /** Base width of the chart in pixels. */
  width: number;
  /** Base height of the chart in pixels. */
  height: number;
  /** Array of data points to plot. */
  data: readonly Record<string, unknown>[];
  /** Responsive width override. */
  rwidth?: number;
  /** Responsive height override. */
  rheight?: number;
  /** Accessible label for the chart (for screen readers). */
  ariaLabel?: string;
  /** ID of element that describes the chart. */
  ariaDescribedBy?: string;
  /** Title displayed in SVG for accessibility. */
  title?: string;
  /** Description displayed in SVG for accessibility. */
  description?: string;
  /** Spacing between grouped bars (0-1, percentage of bandwidth). @default 0.1 */
  barGap?: number;
  /** Spacing between bar groups (0-1, percentage of step). @default 0.2 */
  barCategoryGap?: number;
  /** CSS class applied to axis elements (XAxis, YAxis). */
  axisClass?: string;
  /** CSS class applied to the CartesianGrid element. */
  gridClass?: string;
}>;

export interface BarProps {
  /** Key in data objects containing the numeric value. */
  dataKey: string;
  /** Fill color for the bars. */
  fill?: string;
  /** Radius for rounded corners. */
  radius?: number | [number, number, number, number];
  /** Whether to stack bars. @default false */
  stackId?: string;
  /** Custom bar shape render function. */
  shape?: (props: BarShapeProps) => JSX.Element;
}

export interface BarShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  radius?: number | [number, number, number, number];
  value: number;
  dataKey: string;
  data: Record<string, unknown>;
}

// AreaChart Types

export interface AreaChartContextType {
  width: Accessor<number>;
  height: Accessor<number>;
  innerWidth: Accessor<number>;
  innerHeight: Accessor<number>;
  xKey: Accessor<string>;
  setXKey: Setter<string>;
  xScale: Accessor<ScalePoint<string>>;
  yScale: Accessor<ScaleLinear<number, number>>;
  yAxisBBox: Accessor<DOMRect | null>;
  setYAxisBBox: Setter<DOMRect | null>;
  xAxisBBox: Accessor<DOMRect | null>;
  setXAxisBBox: Setter<DOMRect | null>;
  data: readonly Record<string, unknown>[];
  registeredAreas: Accessor<readonly string[]>;
  registerArea: (k: string) => void;
  activeIndex: Accessor<{
    item: Record<string, unknown>;
    x: number;
    y: number;
    cursor: [number, number];
  } | null>;
  setActiveIndex: Setter<{
    item: Record<string, unknown>;
    x: number;
    y: number;
    cursor: [number, number];
  } | null>;
  setCustomTooltip: Setter<((data: Record<string, unknown>) => JSX.Element) | undefined>;
}

/**
 * Props for the AreaChart component.
 */
export type AreaChartProps = ParentProps<{
  /** Base width of the chart in pixels. */
  width: number;
  /** Base height of the chart in pixels. */
  height: number;
  /** Array of data points to plot. */
  data: readonly Record<string, unknown>[];
  /** Responsive width override. */
  rwidth?: number;
  /** Responsive height override. */
  rheight?: number;
  /** Accessible label for the chart (for screen readers). */
  ariaLabel?: string;
  /** ID of element that describes the chart. */
  ariaDescribedBy?: string;
  /** Title displayed in SVG for accessibility. */
  title?: string;
  /** Description displayed in SVG for accessibility. */
  description?: string;
  /** CSS class applied to axis elements (XAxis, YAxis). */
  axisClass?: string;
  /** CSS class applied to the CartesianGrid element. */
  gridClass?: string;
}>;

export interface AreaProps {
  /** Key in data objects containing the numeric value. */
  dataKey: string;
  /** Fill color for the area. */
  fill?: string;
  /** Fill opacity for the area (0-1). @default 0.6 */
  fillOpacity?: number;
  /** Stroke color for the area line. */
  stroke?: string;
  /** Stroke width for the area line. */
  strokeWidth?: number;
  /** Whether to show dots at data points. */
  dot?: boolean;
  /** Type of curve interpolation. @default 'monotone' */
  type?: 'monotone' | 'linear' | 'step';
}
