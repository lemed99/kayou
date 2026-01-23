import { For, JSX, Show, createMemo } from 'solid-js';

import { CartesianGridProps } from '../types';
import { useBarChart } from './ChartContext';

/**
 * BarCartesianGrid renders horizontal and/or vertical grid lines for a BarChart.
 *
 * @example
 * <BarChart data={data} width={400} height={300}>
 *   <BarXAxis dataKey="month" />
 *   <BarYAxis />
 *   <BarCartesianGrid strokeDasharray="3 3" />
 *   <Bar dataKey="sales" />
 * </BarChart>
 */
export function BarCartesianGrid(props: CartesianGridProps): JSX.Element {
  const chart = useBarChart();

  const horizontalLines = createMemo(() => {
    if (props.horizontal === false) return [];
    return chart
      .yScale()
      .ticks()
      .filter((_, i) => i % 2 === 0);
  });

  const verticalLines = createMemo(() => {
    if (props.vertical === false) return [];
    const scale = chart.xScale();
    const bandwidth = scale.bandwidth();
    return scale.domain().map((d) => (scale(d) ?? 0) + bandwidth / 2);
  });

  const stroke = () => props.stroke ?? '#e5e7eb';
  const strokeDasharray = () => props.strokeDasharray ?? '3 3';

  return (
    <g aria-hidden="true">
      <Show when={props.horizontal !== false}>
        <For each={horizontalLines()}>
          {(y) => (
            <line
              x1={chart.yAxisBBox()?.width ?? 0}
              x2={chart.width()}
              y1={chart.yScale()(y)}
              y2={chart.yScale()(y)}
              stroke={stroke()}
              stroke-dasharray={strokeDasharray()}
            />
          )}
        </For>
      </Show>
      <Show when={props.vertical === true}>
        <For each={verticalLines()}>
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
      </Show>
    </g>
  );
}
