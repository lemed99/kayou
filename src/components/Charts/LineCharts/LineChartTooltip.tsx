import { Show, onMount } from 'solid-js';

import { TooltipProps } from '../types';
import { useChart } from './ChartContext';

export function LineChartTooltip(props: TooltipProps) {
  const chart = useChart();

  onMount(() => {
    const tooltipContent = () => props.content;
    chart.setCustomTooltip(tooltipContent);
  });

  return (
    <Show when={chart.activeIndex() !== null && props.withLine !== false}>
      <g>
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
