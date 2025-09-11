import { Accessor, JSX, ParentProps, Setter } from 'solid-js';

import type { ScaleLinear, ScalePoint } from 'd3-scale';
import { DefaultArcObject, PieArcDatum } from 'd3-shape';

export type LineChartContextType = {
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
};

export type XAxisProps = {
  dataKey: string;
  tickCount?: number;
  tickFormatter?: (v: string | number) => string;
  stroke?: string;
};

export type LineChartProps = ParentProps<{
  width: number;
  height: number;
  data: readonly Record<string, unknown>[];
  rwidth?: number;
  rheight?: number;
}>;

export type YAxisProps = {
  tickCount?: number;
  tickFormatter?: (v: number) => string;
  stroke?: string;
};

export type CartesianGridProps = {
  stroke?: string;
  strokeDasharray?: string;
  vertical?: boolean;
  horizontal?: boolean;
};

export type LineProps = {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  dot?: boolean;
};

export type TooltipProps = {
  stroke?: string;
  withLine?: boolean;
  content?: (data: Record<string, unknown>) => JSX.Element;
};

export type Size = {
  rwidth: number;
  rheight: number;
};

export type PieChartContextType = {
  width: Accessor<number>;
  height: Accessor<number>;
};

export type PieChartProps = ParentProps<{
  width: number;
  height: number;
  rwidth?: number;
  rheight?: number;
}>;

export type ActiveSector = SectorProps &
  PieArcDatum<Record<string, unknown>> & { percent: number; cx: number; cy: number };

export type PieProps = {
  data: Record<string, unknown>[];
  dataKey: keyof Record<string, unknown>;
  cx: number | string;
  cy: number | string;
  innerRadius: number;
  outerRadius: number;
  fill: string;
  activeShape?: (props: ActiveSector) => JSX.Element;
};

export type SectorProps = DefaultArcObject & {
  fill: string;
};
