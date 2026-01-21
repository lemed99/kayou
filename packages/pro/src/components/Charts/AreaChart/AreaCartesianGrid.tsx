import { For, JSX, createMemo } from 'solid-js';

import { CartesianGridProps } from '../types';
import { useAreaChart } from './ChartContext';

/**
 * AreaCartesianGrid renders background grid lines for an AreaChart.
 * Helps readers align data points with axis values.
 *
 * @example
 * <AreaChart data={data} width={400} height={300}>
 *   <AreaCartesianGrid stroke="#eee" strokeDasharray="5 5" />
 *   <AreaXAxis dataKey="month" />
 *   <AreaYAxis />
 *   <Area dataKey="sales" />
 * </AreaChart>
 */
export function AreaCartesianGrid(props: CartesianGridProps): JSX.Element {
  const chart = useAreaChart();
  const showVertical = () => props.vertical !== false;
  const showHorizontal = () => props.horizontal !== false;
  const stroke = () => props.stroke ?? '#ccc';
  const strokeDasharray = () => props.strokeDasharray;

  const horizontalLines = createMemo(() => {
    const ticks = chart.yScale().ticks();
    return ticks.map((t) => chart.yScale()(t));
  });

  const verticalLines = createMemo(() => {
    return chart.xScale().domain().map((d) => chart.xScale()(d) ?? 0);
  });

  return (
    <g aria-hidden="true">
      {/* Horizontal grid lines */}
      <For each={showHorizontal() ? horizontalLines() : []}>
        {(y) => (
          <line
            x1={chart.yAxisBBox()?.width ?? 0}
            x2={chart.width()}
            y1={y}
            y2={y}
            stroke={stroke()}
            stroke-dasharray={strokeDasharray()}
          />
        )}
      </For>
      {/* Vertical grid lines */}
      <For each={showVertical() ? verticalLines() : []}>
        {(x) => (
          <line
            x1={x}
            x2={x}
            y1={0}
            y2={chart.innerHeight()}
            stroke={stroke()}
            stroke-dasharray={strokeDasharray()}
          />
        )}
      </For>
    </g>
  );
}
