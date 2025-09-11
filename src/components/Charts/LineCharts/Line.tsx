import { For, Show, createMemo, onMount } from 'solid-js';

import { curveMonotoneX, line } from 'd3-shape';

import { LineProps } from '../types';
import { useChart } from './ChartContext';

export function Line(props: LineProps) {
  const chart = useChart();
  onMount(() => chart.registerLine(props.dataKey));

  const pathD = createMemo(() => {
    const key = chart.xKey();
    if (!key) return '';
    const s = chart.xScale();
    const y = chart.yScale();
    const dataKey = props.dataKey;
    const gen = line<Record<string, unknown>>()
      .x((d) => s(String(d[key])) ?? 0)
      .y((d) => y(Number(d[dataKey])))
      .curve(curveMonotoneX);
    return gen(chart.data) ?? '';
  });

  const points = createMemo(() => {
    const key = chart.xKey();
    if (!key) return [];
    const s = chart.xScale();
    const y = chart.yScale();
    return chart.data.map((d) => ({
      x: s(String(d[key])) ?? 0,
      y: y(Number(d[props.dataKey])),
      item: d,
    }));
  });

  return (
    <g>
      <path
        d={pathD()}
        fill="none"
        stroke={props.stroke ?? 'currentColor'}
        stroke-width={props.strokeWidth ?? 1}
      />
      <Show when={props.dot}>
        <For each={points()}>
          {(p) => (
            <circle cx={p.x} cy={p.y} r={3} fill={props.stroke ?? 'currentColor'} />
          )}
        </For>
      </Show>
      <Show when={chart.activeIndex() !== null}>
        {(() => {
          const activeIndex = chart.activeIndex()!;
          return (
            <For each={points().filter((p) => p.x === activeIndex.x)}>
              {(p) => (
                <circle
                  cx={activeIndex.x}
                  cy={p.y}
                  r={3}
                  fill="white"
                  stroke={props.stroke ?? 'currentColor'}
                  stroke-width={1}
                />
              )}
            </For>
          );
        })()}
      </Show>
    </g>
  );
}
