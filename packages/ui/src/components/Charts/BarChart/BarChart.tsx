import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { ScaleBand, ScaleLinear, scaleBand, scaleLinear } from 'd3-scale';
import { pointer } from 'd3-selection';

import { ActivePoint, BarChartProps } from '../types';
import { BaseChartContext } from '../shared/BaseChartContext';
import { ChartTooltipOverlay } from '../shared/ChartTooltip';
import { BarChartContext } from './ChartContext';

/**
 * BarChart component for rendering bar charts with D3.
 * Supports multiple data series, tooltips, and interactive hover states.
 *
 * @example
 * <BarChart
 *   data={salesData}
 *   width={600}
 *   height={400}
 *   ariaLabel="Monthly sales data"
 *   title="Sales Chart"
 * >
 *   <BarXAxis dataKey="month" />
 *   <BarYAxis />
 *   <CartesianGrid />
 *   <Bar dataKey="revenue" fill="#8884d8" />
 *   <Bar dataKey="profit" fill="#82ca9d" />
 *   <BarChartTooltip />
 * </BarChart>
 */
export function BarChart(allProps: BarChartProps): JSX.Element {
  const [props] = splitProps(allProps, [
    'width',
    'height',
    'data',
    'children',
    'rwidth',
    'rheight',
    'ariaLabel',
    'ariaDescribedBy',
    'title',
    'description',
    'barGap',
    'barCategoryGap',
  ]);

  const [yAxisBBox, setYAxisBBox] = createSignal<DOMRect | null>(null);
  const [xAxisBBox, setXAxisBBox] = createSignal<DOMRect | null>(null);

  const [customTooltip, setCustomTooltip] = createSignal<
    ((data: Record<string, unknown>, barKey: string) => JSX.Element) | undefined
  >(undefined);

  // Base context tooltip (single-arg signature)
  const [baseCustomTooltip, setBaseCustomTooltip] = createSignal<
    ((data: Record<string, unknown>) => JSX.Element) | undefined
  >(undefined);
  const [tooltipEnabled, setTooltipEnabled] = createSignal(false);

  const width = createMemo(() => props.rwidth ?? props.width);
  const height = createMemo(() => props.rheight ?? props.height);

  const innerWidth = createMemo(() => width() - (yAxisBBox()?.width ?? 0));
  const innerHeight = createMemo(() => height() - (xAxisBBox()?.height ?? 0));

  const [xKey, setXKey] = createSignal<string>('');
  const [barKeys, setBarKeys] = createSignal<readonly string[]>([]);
  const registerBar = (k: string) => {
    if (!barKeys().includes(k)) setBarKeys([...barKeys(), k]);
  };

  const barGap = createMemo(() => props.barGap ?? 0.1);
  const barCategoryGap = createMemo(() => props.barCategoryGap ?? 0.2);

  const xScale = createMemo<ScaleBand<string>>(() => {
    const key = xKey();
    const left = yAxisBBox()?.width ?? 0;
    const right = width();

    const values = props.data.map((d) => String(d[key]));
    return scaleBand<string>()
      .domain(values)
      .range([left, right])
      .padding(barCategoryGap());
  });

  const yScale = createMemo<ScaleLinear<number, number>>(() => {
    const keys = barKeys();
    const numericKeys = keys.length
      ? [...keys]
      : Object.keys(props.data[0] ?? {}).filter(
          (k) => typeof props.data[0][k] === 'number',
        );
    const maxVal = Math.max(
      1,
      ...props.data.map((d) => Math.max(...numericKeys.map((k) => Number(d[k] ?? 0)))),
    );
    const scale = scaleLinear<number, number>()
      .domain([0, maxVal])
      .nice()
      .range([innerHeight(), 0]);
    const ticks = scale.ticks();
    if (ticks.length % 2 === 0) {
      scale.domain([0, ticks[ticks.length - 1] + (ticks[1] - ticks[0])]);
    }
    return scale;
  });

  const [activeIndex, setActiveIndex] = createSignal<{
    item: Record<string, unknown>;
    barKey: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [activePoint, setActivePoint] = createSignal<ActivePoint | null>(null);

  function onMouseMove(e: MouseEvent) {
    const data = props.data;
    const s = xScale();
    const ys = yScale();
    const keys = barKeys();
    const [mx] = pointer(e);

    const domain = s.domain();
    if (!domain.length) return;

    // Find nearest band center (no dead zones, like line/area charts)
    const centers = domain.map((d) => (s(d) ?? 0) + s.bandwidth() / 2);
    let idx = 0;
    let minDist = Math.abs(mx - centers[0]);
    for (let i = 1; i < centers.length; i++) {
      const dist = Math.abs(mx - centers[i]);
      if (dist < minDist) { minDist = dist; idx = i; }
    }

    const d = data[idx];
    if (!d) { setActivePoint(null); return; }

    const bandX = s(domain[idx])!;
    // Find the tallest bar's y for tooltip positioning
    const maxVal = keys.length
      ? Math.max(...keys.map((k) => Number(d[k] ?? 0)))
      : 0;

    setActivePoint({
      item: d,
      x: bandX + s.bandwidth() / 2,
      y: ys(maxVal),
      bandX,
      bandWidth: s.bandwidth(),
    });
  }

  // Wrap bar-specific custom tooltip (2-arg) into base (1-arg) for the overlay
  createEffect(() => {
    const barTooltip = customTooltip();
    if (barTooltip) {
      // eslint-disable-next-line solid/reactivity -- activeIndex is read lazily at render time
      setBaseCustomTooltip(() => (data: Record<string, unknown>) => {
        const ai = activeIndex();
        return barTooltip(data, ai?.barKey ?? '');
      });
    } else {
      setBaseCustomTooltip(undefined);
    }
  });

  const titleId = createUniqueId();
  const descId = createUniqueId();

  return (
    <div class="relative h-full w-full">
      <BaseChartContext.Provider
        value={{
          innerWidth,
          innerHeight,
          width,
          height,
          xKey,
          setXKey,
          xScale,
          yScale,
          yAxisBBox,
          setYAxisBBox,
          xAxisBBox,
          setXAxisBBox,
          activePoint,
          setActivePoint,
          registeredKeys: barKeys,
          customTooltip: baseCustomTooltip,
          setCustomTooltip: setBaseCustomTooltip,
          tooltipPosition: 'above',
          tooltipEnabled,
          setTooltipEnabled,
        }}
      >
        <svg
          width={width()}
          height={height()}
          role="img"
          aria-label={props.ariaLabel ?? 'Bar chart'}
          aria-labelledby={props.title ? titleId : undefined}
          aria-describedby={
            props.ariaDescribedBy ?? (props.description ? descId : undefined)
          }
          style={{
            overflow: 'visible',
            width: props.rwidth === undefined ? `${width()}px` : '100%',
            height: props.rheight === undefined ? `${height()}px` : '100%',
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => { setActiveIndex(null); setActivePoint(null); }}
          viewBox={`0 0 ${width()} ${height()}`}
        >
          <Show when={props.title}>
            <title id={titleId}>{props.title}</title>
          </Show>
          <Show when={props.description}>
            <desc id={descId}>{props.description}</desc>
          </Show>
          <BarChartContext.Provider
            value={{
              get data() {
                return props.data;
              },
              innerWidth,
              innerHeight,
              width,
              height,
              xKey,
              setXKey,
              registeredBars: barKeys,
              registerBar,
              xScale,
              yScale,
              activeIndex,
              setActiveIndex,
              yAxisBBox,
              setYAxisBBox,
              xAxisBBox,
              setXAxisBBox,
              setCustomTooltip,
              barGap,
              barCategoryGap,
            }}
          >
            {props.children}
          </BarChartContext.Provider>
        </svg>
        <ChartTooltipOverlay />
      </BaseChartContext.Provider>
    </div>
  );
}
