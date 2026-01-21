import { For, JSX, createEffect, createMemo, createSignal, onMount } from 'solid-js';

import { BarXAxisProps } from '../types';
import { useBarChart } from './ChartContext';

/**
 * BarXAxis renders the horizontal axis for a BarChart.
 * Automatically registers the data key and calculates tick positions.
 *
 * @example
 * <BarChart data={data} width={400} height={300}>
 *   <BarXAxis dataKey="month" tickFormatter={(v) => v.slice(0, 3)} />
 *   <BarYAxis />
 *   <Bar dataKey="sales" />
 * </BarChart>
 */
export function BarXAxis(props: BarXAxisProps): JSX.Element {
  let axisRef: SVGGElement | undefined;
  const [axisBBox, setAxisBBox] = createSignal<DOMRect | null>(null);
  const chart = useBarChart();

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

  const ticks = createMemo<string[]>(() => {
    return chart.xScale().domain();
  });

  const format = (v: string | number) =>
    props.tickFormatter ? props.tickFormatter(v) : String(v);

  const angle = () => props.angle ?? 0;

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
            const sx = () => {
              const scale = chart.xScale();
              const bandwidth = scale.bandwidth();
              return (scale(t) ?? 0) + bandwidth / 2;
            };

            return (
              <g transform={`translate(${sx()},${chart.innerHeight()})`}>
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
