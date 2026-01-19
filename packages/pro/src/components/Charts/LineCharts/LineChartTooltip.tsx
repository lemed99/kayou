import { JSX, Show, onCleanup, onMount } from 'solid-js';

import { TooltipProps } from '../types';
import { useChart } from './ChartContext';

/**
 * LineChartTooltip adds an interactive tooltip and vertical indicator line to a LineChart.
 * The tooltip content can be customized via the `content` prop.
 *
 * @example
 * <LineChart data={data} width={400} height={300}>
 *   <XAxis dataKey="month" />
 *   <YAxis />
 *   <Line dataKey="sales" />
 *   <LineChartTooltip
 *     stroke="#666"
 *     content={(data) => <div>{data.month}: ${data.sales}</div>}
 *   />
 * </LineChart>
 */
export function LineChartTooltip(props: TooltipProps): JSX.Element {
  const chart = useChart();

  onMount(() => {
    const content = props.content;
    chart.setCustomTooltip(() => content);
  });

  onCleanup(() => {
    chart.setCustomTooltip(undefined);
  });

  return (
    <Show when={chart.activeIndex() !== null && props.withLine !== false}>
      <g aria-hidden="true">
        <line
          x1={chart.activeIndex()!.x}
          x2={chart.activeIndex()!.x}
          y1={0}
          y2={chart.innerHeight()}
          stroke={props.stroke ?? '#ccc'}
        />
      </g>
    </Show>
  );
}
