import { For, JSX, createEffect, createMemo, createSignal, onMount } from 'solid-js';

import { XAxisProps } from '../types';
import { useChart } from './ChartContext';

/**
 * XAxis renders the horizontal axis for a LineChart.
 * Automatically registers the data key and calculates tick positions.
 *
 * @example
 * <LineChart data={data} width={400} height={300}>
 *   <XAxis dataKey="month" tickFormatter={(v) => v.slice(0, 3)} />
 *   <YAxis />
 *   <Line dataKey="sales" />
 * </LineChart>
 */
export function XAxis(props: XAxisProps): JSX.Element {
  let axisRef: SVGGElement | undefined;
  const [axisBBox, setAxisBBox] = createSignal<DOMRect | null>(null);
  const chart = useChart();

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
            const sx = chart.xScale()(t as string);
            const px = sx ?? 0;
            return (
              <g transform={`translate(${px},${chart.innerHeight()})`}>
                <line y2={6} stroke={props.stroke ?? '#666'} />
                <text dy={16} text-anchor="middle" font-size="10" fill="#666">
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
