import { For, JSX, Show, createMemo, onMount } from 'solid-js';

import { area, curveLinear, curveMonotoneX, curveStep, line } from 'd3-shape';

import { AreaProps } from '../types';
import { useAreaChart } from './ChartContext';

/**
 * Area renders a single data series as a filled area in an AreaChart.
 * Multiple Area components can be used to display multiple series.
 *
 * @example
 * <AreaChart data={data} width={400} height={300}>
 *   <AreaXAxis dataKey="month" />
 *   <AreaYAxis />
 *   <Area dataKey="revenue" fill="#8884d8" fillOpacity={0.6} />
 *   <Area dataKey="profit" fill="#82ca9d" fillOpacity={0.6} />
 * </AreaChart>
 */
export function Area(props: AreaProps): JSX.Element {
  const chart = useAreaChart();
  onMount(() => chart.registerArea(props.dataKey));

  const getCurve = () => {
    switch (props.type) {
      case 'linear':
        return curveLinear;
      case 'step':
        return curveStep;
      case 'monotone':
      default:
        return curveMonotoneX;
    }
  };

  const areaPath = createMemo(() => {
    const key = chart.xKey();
    if (!key) return '';
    const s = chart.xScale();
    const y = chart.yScale();
    const dataKey = props.dataKey;
    const baseY = chart.innerHeight();

    const gen = area<Record<string, unknown>>()
      .x((d) => s(String(d[key])) ?? 0)
      .y0(baseY)
      .y1((d) => y(Number(d[dataKey])))
      .curve(getCurve());

    return gen(chart.data as Record<string, unknown>[]) ?? '';
  });

  const linePath = createMemo(() => {
    const key = chart.xKey();
    if (!key) return '';
    const s = chart.xScale();
    const y = chart.yScale();
    const dataKey = props.dataKey;

    const gen = line<Record<string, unknown>>()
      .x((d) => s(String(d[key])) ?? 0)
      .y((d) => y(Number(d[dataKey])))
      .curve(getCurve());

    return gen(chart.data as Record<string, unknown>[]) ?? '';
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

  const activePoints = createMemo(() => {
    const ai = chart.activeIndex();
    if (!ai) return [];
    return points().filter((p) => p.x === ai.x);
  });

  const fill = () => props.fill ?? '#8884d8';
  const fillOpacity = () => props.fillOpacity ?? 0.6;
  const stroke = () => props.stroke ?? props.fill ?? '#8884d8';
  const strokeWidth = () => props.strokeWidth ?? 2;

  return (
    <g aria-label={`Area series: ${props.dataKey}`}>
      {/* Filled area */}
      <path d={areaPath()} fill={fill()} fill-opacity={fillOpacity()} stroke="none" />
      {/* Stroke line on top */}
      <path
        d={areaPath()}
        fill="none"
        stroke={stroke()}
        stroke-width={strokeWidth()}
        style={{ 'clip-path': 'inset(0 0 100% 0)' }}
      />
      {/* Actual top line */}
      <path d={linePath()} fill="none" stroke={stroke()} stroke-width={strokeWidth()} />
      {/* Data point dots */}
      <Show when={props.dot}>
        <For each={points()}>
          {(p) => <circle cx={p.x} cy={p.y} r={3} fill={stroke()} />}
        </For>
      </Show>
      {/* Active point indicator */}
      <Show when={chart.activeIndex()}>
        {(activeIndex) => (
          <For each={activePoints()}>
            {(p) => (
              <circle
                cx={activeIndex().x}
                cy={p.y}
                r={4}
                fill="white"
                stroke={stroke()}
                stroke-width={2}
              />
            )}
          </For>
        )}
      </Show>
    </g>
  );
}
