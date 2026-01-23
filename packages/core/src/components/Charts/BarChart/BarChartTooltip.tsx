import { JSX, createEffect } from 'solid-js';

import { BarChartTooltipProps } from '../types';
import { useBarChart } from './ChartContext';

/**
 * BarChartTooltip registers a custom tooltip renderer for the BarChart.
 * The actual tooltip rendering is handled by the BarChart component.
 *
 * @example
 * <BarChart data={data} width={400} height={300}>
 *   <BarXAxis dataKey="month" />
 *   <BarYAxis />
 *   <Bar dataKey="sales" fill="#8884d8" />
 *   <BarChartTooltip
 *     content={(data, barKey) => (
 *       <div class="custom-tooltip">
 *         <strong>{data.month}</strong>
 *         <p>{barKey}: ${data[barKey]}</p>
 *       </div>
 *     )}
 *   />
 * </BarChart>
 */
export function BarChartTooltip(props: BarChartTooltipProps): JSX.Element {
  const chart = useBarChart();

  createEffect(() => {
    const content = props.content;
    if (content) {
      chart.setCustomTooltip(() => content);
    } else {
      chart.setCustomTooltip(undefined);
    }
  });

  // This component doesn't render anything directly
  // The tooltip is rendered by the BarChart component
  return <></>;
}
