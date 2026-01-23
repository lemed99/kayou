import { JSX, Show, createEffect } from 'solid-js';

import { AreaChartTooltipProps } from '../types';
import { useAreaChart } from './ChartContext';

/**
 * AreaChartTooltip registers a custom tooltip renderer for the AreaChart.
 * Optionally displays a vertical indicator line at the active point.
 *
 * @example
 * <AreaChart data={data} width={400} height={300}>
 *   <AreaXAxis dataKey="month" />
 *   <AreaYAxis />
 *   <Area dataKey="sales" fill="#8884d8" />
 *   <AreaChartTooltip
 *     content={(data) => (
 *       <div class="custom-tooltip">
 *         <strong>{data.month}</strong>
 *         <p>Sales: ${data.sales}</p>
 *       </div>
 *     )}
 *   />
 * </AreaChart>
 */
export function AreaChartTooltip(props: AreaChartTooltipProps): JSX.Element {
  const chart = useAreaChart();

  createEffect(() => {
    const content = props.content;
    if (content) {
      chart.setCustomTooltip(() => content);
    } else {
      chart.setCustomTooltip(undefined);
    }
  });

  const withLine = () => props.withLine !== false;
  const stroke = () => props.stroke ?? '#ccc';

  return (
    <Show when={withLine() && chart.activeIndex()}>
      <line
        x1={chart.activeIndex()!.x}
        x2={chart.activeIndex()!.x}
        y1={0}
        y2={chart.innerHeight()}
        stroke={stroke()}
        stroke-dasharray="4 4"
        aria-hidden="true"
      />
    </Show>
  );
}
