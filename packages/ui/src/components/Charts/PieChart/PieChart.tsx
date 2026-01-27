import { JSX, Show, createMemo, createUniqueId } from 'solid-js';

import type { PieChartProps } from '../types';
import { ChartContext } from './ChartContext';

/**
 * PieChart component for rendering pie/donut charts with D3.
 * Supports customizable inner/outer radius and active sector highlighting.
 *
 * @example
 * <PieChart
 *   width={400}
 *   height={400}
 *   ariaLabel="Market share by category"
 *   title="Market Share"
 * >
 *   <Pie
 *     data={data}
 *     dataKey="value"
 *     cx="50%"
 *     cy="50%"
 *     innerRadius={60}
 *     outerRadius={120}
 *     fill="#8884d8"
 *   />
 * </PieChart>
 */
export function PieChart(props: PieChartProps): JSX.Element {
  const width = createMemo(() => props.rwidth ?? props.width);
  const height = createMemo(() => props.rheight ?? props.height);
  const titleId = createUniqueId();
  const descId = createUniqueId();

  return (
    <svg
      width={width()}
      height={height()}
      role="img"
      aria-label={props.ariaLabel ?? 'Pie chart'}
      aria-labelledby={props.title ? titleId : undefined}
      aria-describedby={props.ariaDescribedBy ?? (props.description ? descId : undefined)}
      style={{ overflow: 'hidden', width: '100%', height: '100%' }}
      viewBox={`0 0 ${width()} ${height()}`}
    >
      <Show when={props.title}>
        <title id={titleId}>{props.title}</title>
      </Show>
      <Show when={props.description}>
        <desc id={descId}>{props.description}</desc>
      </Show>
      <ChartContext.Provider
        value={{
          width,
          height,
        }}
      >
        {props.children}
      </ChartContext.Provider>
    </svg>
  );
}
