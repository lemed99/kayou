import { For, JSX, Show, createMemo } from 'solid-js';

import { CartesianGridProps } from '../types';
import { useChart } from './ChartContext';

/**
 * CartesianGrid renders horizontal and/or vertical grid lines for a LineChart.
 * Decorative component that improves readability of data values.
 *
 * @example
 * <LineChart data={data} width={400} height={300}>
 *   <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
 *   <XAxis dataKey="month" />
 *   <YAxis />
 *   <Line dataKey="sales" />
 * </LineChart>
 */
export function CartesianGrid(props: CartesianGridProps): JSX.Element {
  const chart = useChart();

  const xTicks = createMemo<number[]>(() => {
    const s = chart.xScale();
    return s.domain().map((v) => s(v) ?? 0);
  });

  const yTicks = createMemo<number[]>(() => {
    const count = Math.max(2, Math.floor(chart.innerHeight() / 50));
    const y = chart.yScale();
    return y.ticks(count).map((v) => y(v));
  });

  const stroke = createMemo(() => props.stroke ?? '#ccc');
  const strokeDasharray = createMemo(() => props.strokeDasharray ?? '3 3');

  return (
    <g aria-hidden="true">
      <Show when={props.horizontal !== false}>
        <g>
          <For each={yTicks()}>
            {(py) => (
              <line
                x1={chart.yAxisBBox()?.width ?? 0}
                x2={chart.width()}
                y1={py}
                y2={py}
                stroke={stroke()}
                stroke-dasharray={strokeDasharray()}
              />
            )}
          </For>
        </g>
      </Show>
      <Show when={props.vertical !== false}>
        <g>
          <For each={xTicks()}>
            {(px) => (
              <line
                x1={px}
                x2={px}
                y1={0}
                y2={chart.innerHeight()}
                stroke={stroke()}
                stroke-dasharray={strokeDasharray()}
              />
            )}
          </For>
          <line
            x1={chart.width()}
            x2={chart.width()}
            y1={0}
            y2={chart.innerHeight()}
            stroke={stroke()}
            stroke-dasharray={strokeDasharray()}
          />
        </g>
      </Show>
    </g>
  );
}
