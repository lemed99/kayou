import { For, JSX, createEffect, createMemo, createSignal, onMount } from 'solid-js';

import { BarYAxisProps } from '../types';
import { useBarChart } from './ChartContext';

// Vertical offset for tick labels based on position
const TOP_TICK_OFFSET = 0;
const MIDDLE_TICK_OFFSET = 4;
const BOTTOM_TICK_OFFSET = 8;

/**
 * Returns the vertical offset (dy) for a tick label based on its position.
 * - First tick (top): align bottom of text with line
 * - Last tick (bottom): align top of text with line
 * - Middle ticks: center vertically
 */
const getTickDy = (index: number, total: number): number => {
  if (index === total - 1) return BOTTOM_TICK_OFFSET;
  if (index === 0) return TOP_TICK_OFFSET;
  return MIDDLE_TICK_OFFSET;
};

/**
 * BarYAxis renders the vertical axis for a BarChart.
 * Automatically calculates scale and tick positions based on data.
 *
 * @example
 * <BarChart data={data} width={400} height={300}>
 *   <BarXAxis dataKey="month" />
 *   <BarYAxis tickFormatter={(v) => `$${v}`} />
 *   <Bar dataKey="sales" />
 * </BarChart>
 */
export function BarYAxis(props: BarYAxisProps): JSX.Element {
  let axisRef: SVGGElement | undefined;
  const chart = useBarChart();
  const ticks = createMemo<number[]>(() => {
    let t = chart.yScale().ticks();
    t = t.filter((_, i) => i % 2 === 0);
    return t;
  });
  const [axisBBox, setAxisBBox] = createSignal<DOMRect | null>(null);

  onMount(() => {
    if (axisRef) {
      const bbox = axisRef.getBBox();
      setAxisBBox(bbox);
      chart.setYAxisBBox(bbox);
    }
  });

  createEffect(() => {
    chart.setYAxisBBox(axisBBox());
  });

  return (
    <g ref={axisRef} aria-hidden="true">
      <line
        x1={axisBBox()?.width ?? 0}
        x2={axisBBox()?.width ?? 0}
        y1={0}
        y2={chart.innerHeight()}
        stroke={props.stroke ?? '#666'}
      />
      <g>
        <For each={ticks()}>
          {(t, i) => (
            <g transform={`translate(${0},${chart.yScale()(t)})`}>
              <line
                x1={axisBBox()?.width ?? 0}
                x2={(axisBBox()?.width ?? 0) - 6}
                stroke={props.stroke ?? '#666'}
              />
              <text
                x={(axisBBox()?.width ?? 0) - 9}
                dy={getTickDy(i(), ticks().length)}
                text-anchor="end"
                font-size="10"
                fill="#666"
              >
                {props.tickFormatter ? props.tickFormatter(t) : t}
              </text>
            </g>
          )}
        </For>
      </g>
    </g>
  );
}
