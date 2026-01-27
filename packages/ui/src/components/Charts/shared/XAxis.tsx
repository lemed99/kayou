import { For, JSX, createEffect, createMemo, createSignal, onMount } from 'solid-js';

import type { ScaleBand } from 'd3-scale';

import { XAxisProps } from '../types';
import { useBaseChart } from './BaseChartContext';

export function XAxis(props: XAxisProps): JSX.Element {
  let axisRef: SVGGElement | undefined;
  const [axisBBox, setAxisBBox] = createSignal<DOMRect | null>(null);
  const chart = useBaseChart();

  onMount(() => {
    chart.setXKey(props.dataKey);
    if (axisRef) {
      const bbox = axisRef.getBBox();
      setAxisBBox(bbox);
      chart.setXAxisBBox(bbox);
    }
  });

  createEffect(() => {
    chart.setXAxisBBox(axisBBox());
  });

  const ticks = createMemo<(string | number)[]>(() => {
    return chart.xScale().domain();
  });

  const format = (v: string | number) =>
    props.tickFormatter ? props.tickFormatter(v) : String(v);

  const angle = () => props.angle ?? 0;

  const isBand = () => 'bandwidth' in chart.xScale();

  return (
    <g ref={axisRef} aria-hidden="true">
      <line
        x1={chart.yAxisBBox()?.width ?? 0}
        x2={chart.width()}
        y1={chart.innerHeight()}
        y2={chart.innerHeight()}
        stroke={props.stroke ?? '#666'}
      />
      <g>
        <For each={ticks()}>
          {(t) => {
            const px = () => {
              const scale = chart.xScale();
              const base = scale(t as string) ?? 0;
              if (isBand()) {
                return base + (scale as ScaleBand<string>).bandwidth() / 2;
              }
              return base;
            };

            return (
              <g transform={`translate(${px()},${chart.innerHeight()})`}>
                <line y2={6} stroke={props.stroke ?? '#666'} />
                <text
                  dy={16}
                  text-anchor={angle() !== 0 ? 'end' : 'middle'}
                  font-size="10"
                  fill="#666"
                  transform={angle() !== 0 ? `rotate(${angle()})` : undefined}
                >
                  {format(t)}
                </text>
              </g>
            );
          }}
        </For>
      </g>
    </g>
  );
}
