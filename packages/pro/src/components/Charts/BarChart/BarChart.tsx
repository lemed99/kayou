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

import { BarChartProps } from '../types';
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

  const tooltipId = createUniqueId();
  const titleId = createUniqueId();
  const descId = createUniqueId();
  let tooltipRef: HTMLDivElement | undefined;
  const [boxDimensions, setBoxDimensions] = createSignal<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  createEffect(() => {
    if (activeIndex() && tooltipRef) {
      const { width, height } = tooltipRef.getBoundingClientRect();
      setBoxDimensions({ width, height });
    }
  });

  const boxPos = createMemo<{ x: number; y: number }>(() => {
    if (activeIndex() === null) return { x: 0, y: 0 };

    const { width: boxWidth, height: boxHeight } = boxDimensions();
    const point = activeIndex()!;

    // Position tooltip above the bar, centered
    let y = point.y - boxHeight - 8;
    if (y < 0) {
      y = point.y + point.height + 8;
    }

    let x = point.x + point.width / 2 - boxWidth / 2;
    if (x < 0) {
      x = 0;
    }
    if (x + boxWidth > width()) {
      x = width() - boxWidth;
    }

    return { x, y };
  });

  return (
    <div class="relative h-full w-full">
      <svg
        width={width()}
        height={height()}
        role="img"
        aria-label={props.ariaLabel ?? 'Bar chart'}
        aria-labelledby={props.title ? titleId : undefined}
        aria-describedby={
          props.ariaDescribedBy ?? (props.description ? descId : undefined)
        }
        style={{ overflow: 'visible', width: '100%', height: '100%' }}
        onMouseLeave={() => setActiveIndex(null)}
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
      <Show when={activeIndex() !== null}>
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          aria-live="polite"
          class="pointer-events-none absolute w-fit p-1.5 duration-300 ease-out"
          style={{
            left: boxPos().x + 'px',
            top: boxPos().y + 'px',
            transform: 'translateZ(0)',
          }}
        >
          <Show
            when={customTooltip()}
            fallback={
              <div class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <div class="whitespace-nowrap font-medium">
                  {String(activeIndex()!.item[xKey()])}
                </div>
                <div class="mt-1 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {activeIndex()!.barKey}: {String(activeIndex()!.item[activeIndex()!.barKey])}
                </div>
              </div>
            }
          >
            {customTooltip()?.(activeIndex()!.item, activeIndex()!.barKey)}
          </Show>
        </div>
      </Show>
    </div>
  );
}
