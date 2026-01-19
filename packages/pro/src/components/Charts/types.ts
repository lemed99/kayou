import { Accessor, JSX, ParentProps, Setter } from 'solid-js';

import type { ScaleLinear, ScalePoint } from 'd3-scale';
import { DefaultArcObject, PieArcDatum } from 'd3-shape';

export interface LineChartContextType {
  data: readonly Record<string, unknown>[];
  innerWidth: Accessor<number>;
  innerHeight: Accessor<number>;
  width: Accessor<number>;
  height: Accessor<number>;
  xKey: Accessor<string>;
  setXKey: Setter<string>;
  registeredLines: Accessor<readonly string[]>;
  registerLine: (k: string) => void;
  xScale: Accessor<ScalePoint<string>>;
  yScale: Accessor<ScaleLinear<number, number>>;
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
  yAxisBBox: Accessor<DOMRect | null>;
  setYAxisBBox: Setter<DOMRect | null>;
  xAxisBBox: Accessor<DOMRect | null>;
  setXAxisBBox: Setter<DOMRect | null>;
  setCustomTooltip: Setter<((data: Record<string, unknown>) => JSX.Element) | undefined>;
}

export interface XAxisProps {
  dataKey: string;
  tickCount?: number;
  tickFormatter?: (v: string | number) => string;
  stroke?: string;
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

export interface TooltipProps {
  stroke?: string;
  withLine?: boolean;
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
