import { For, Show, createMemo, createSignal, onMount } from 'solid-js';

import { pie } from 'd3-shape';

import type { ActiveSector, PieProps } from '../types';
import { useChartContext } from './ChartContext';
import { Sector } from './Sector';

export function Pie(props: PieProps) {
  const { width, height } = useChartContext();

  const [activeSector, setActiveSector] = createSignal<ActiveSector | null>(null);

  const arcs = createMemo(() => {
    const dataKey = props.dataKey;
    return pie<Record<string, unknown>>().value((d) => Number(d[dataKey]))(props.data);
  });

  const cx = createMemo(() => {
    if (typeof props.cx === 'number') return props.cx;
    if (typeof props.cx === 'string') {
      if (props.cx.endsWith('%')) {
        const percent = Number(props.cx.slice(0, -1));
        return (percent / 100) * width();
      }
      return parseInt(props.cx);
    }
    return 0;
  });

  const cy = createMemo(() => {
    if (typeof props.cy === 'number') return props.cy;
    if (typeof props.cy === 'string') {
      if (props.cy.endsWith('%')) {
        const percent = Number(props.cy.slice(0, -1));
        return (percent / 100) * height();
      }
      return parseInt(props.cy);
    }
    return 0;
  });

  const total = createMemo(() => {
    const dataKey = props.dataKey;
    return props.data.reduce((s, d) => s + Number(d[dataKey]), 0);
  });

  onMount(() => {
    setActiveSector({
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      fill: props.fill,
      ...arcs()[0],
      percent: arcs()[0].value / total(),
      cx: cx(),
      cy: cy(),
    });
  });

  return (
    <g>
      <For each={arcs()}>
        {(d) => {
          const percent = d.value / total();
          const sectorProps = {
            innerRadius: props.innerRadius,
            outerRadius: props.outerRadius,
            startAngle: d.startAngle,
            endAngle: d.endAngle,
            fill: props.fill,
          };

          return (
            <g
              transform={`translate(${cx()},${cy()})`}
              onMouseEnter={() => {
                setActiveSector({
                  ...sectorProps,
                  ...d,
                  percent,
                  cx: cx(),
                  cy: cy(),
                });
              }}
              style={{ cursor: 'pointer' }}
            >
              <Sector {...sectorProps} />
            </g>
          );
        }}
      </For>
      <Show when={activeSector() && props.activeShape}>
        {props.activeShape?.(activeSector()!)}
      </Show>
    </g>
  );
}
