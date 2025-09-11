import { For, createEffect, createMemo, createSignal, onMount } from 'solid-js';

import { YAxisProps } from '../types';
import { useChart } from './ChartContext';

export function YAxis(props: YAxisProps) {
  const chart = useChart();
  const ticks = createMemo<number[]>(() => {
    let t = chart.yScale().ticks();
    t = t.filter((v, i) => i % 2 === 0);
    return t;
  });
  const [axisBBox, setAxisBBox] = createSignal<DOMRect | null>(null);

  onMount(() => {
    const g: SVGGElement | null = document.querySelector('.y-axis');
    if (g) {
      const bbox = g.getBBox();
      setAxisBBox(bbox);
      chart.setYAxisBBox(bbox);
    }
  });

  createEffect(() => {
    chart.setYAxisBBox(axisBBox());
  });

  return (
    <g class="y-axis">
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
                dy={i() === ticks().length - 1 ? 8 : i() === 0 ? 0 : 4}
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
