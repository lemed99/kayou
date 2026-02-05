import {
  JSX,
  Show,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { ScaleLinear, ScalePoint, scaleLinear, scalePoint } from 'd3-scale';
import { pointer } from 'd3-selection';

import { ActivePoint, LineChartProps } from '../types';
import { BaseChartContext } from '../shared/BaseChartContext';
import { ChartTooltipOverlay } from '../shared/ChartTooltip';
import { ChartContext } from './ChartContext';

/**
 * LineChart component for rendering line charts with D3.
 * Supports multiple data series, tooltips, and interactive hover states.
 *
 * @example
 * <LineChart
 *   data={salesData}
 *   width={600}
 *   height={400}
 *   ariaLabel="Monthly sales data"
 *   title="Sales Chart"
 * >
 *   <XAxis dataKey="month" />
 *   <YAxis />
 *   <CartesianGrid />
 *   <Line dataKey="revenue" stroke="#8884d8" />
 *   <Line dataKey="profit" stroke="#82ca9d" />
 *   <LineChartTooltip />
 * </LineChart>
 */
export function LineChart(allProps: LineChartProps): JSX.Element {
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
  ]);

  const [yAxisBBox, setYAxisBBox] = createSignal<DOMRect | null>(null);
  const [xAxisBBox, setXAxisBBox] = createSignal<DOMRect | null>(null);

  const [customTooltip, setCustomTooltip] = createSignal<
    ((data: Record<string, unknown>) => JSX.Element) | undefined
  >(undefined);
  const [tooltipEnabled, setTooltipEnabled] = createSignal(false);

  const width = createMemo(() => props.rwidth ?? props.width);
  const height = createMemo(() => props.rheight ?? props.height);

  const innerWidth = createMemo(() => width() - (yAxisBBox()?.width ?? 0));
  const innerHeight = createMemo(() => height() - (xAxisBBox()?.height ?? 0));

  const [xKey, setXKey] = createSignal<string>('');
  const [lineKeys, setLineKeys] = createSignal<readonly string[]>([]);
  const registerLine = (k: string) => {
    if (!lineKeys().includes(k)) setLineKeys([...lineKeys(), k]);
  };

  const xScale = createMemo<ScalePoint<string>>(() => {
    const key = xKey();
    const left = yAxisBBox()?.width ?? 0;
    const right = width();

    const values = props.data.map((d) => d[key]) as string[];
    return scalePoint<string>().domain(values).range([left, right]).padding(0.3);
  });

  const yScale = createMemo<ScaleLinear<number, number>>(() => {
    const keys = lineKeys();
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
    x: number;
    y: number;
    cursor: [number, number];
  } | null>(null);

  const [activePoint, setActivePoint] = createSignal<ActivePoint | null>(null);

  function handlePointerMove(e: MouseEvent | TouchEvent) {
    const data = props.data;
    const key = xKey();
    const xScaleVal = xScale();
    const yScaleVal = yScale();
    const lineKeysVal = lineKeys();

    const [x, y] = pointer(e);

    const step = xScaleVal.step();
    if (!step) return;

    const points = xScaleVal.domain().map((d) => xScaleVal(d));
    if (!points.length) return;

    const index = points.findIndex((point, i) => {
      if (i === 0) {
        return x <= point! + step / 2;
      }
      if (i === points.length - 1) {
        return x > point! - step / 2;
      }
      const zoneStart = point! - step / 2;
      const zoneEnd = point! + step / 2;
      return x > zoneStart && x <= zoneEnd;
    });

    if (index === -1) return;

    const d = data[index];
    if (d) {
      let cy = 0;
      if (lineKeysVal.length === 1) {
        cy = yScaleVal(Number(d[lineKeysVal[0]]));
      } else if (lineKeysVal.length > 0) {
        const maxKey = lineKeysVal.reduce((a, b) =>
          Number(d[a]) > Number(d[b]) ? a : b,
        );
        cy = yScaleVal(Number(d[maxKey]));
      }
      const cx = xScaleVal(String(d[key])) as number;
      setActiveIndex({ item: d, x: cx, y: cy, cursor: [x, y] });
      setActivePoint({ item: d, x: cx, y: cy });
    } else {
      setActiveIndex(null);
      setActivePoint(null);
    }
  }

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
          registeredKeys: lineKeys,
          customTooltip,
          setCustomTooltip,
          tooltipPosition: 'beside',
          tooltipEnabled,
          setTooltipEnabled,
        }}
      >
        <svg
          width={width()}
          height={height()}
          role="img"
          aria-label={props.ariaLabel ?? 'Line chart'}
          aria-labelledby={props.title ? titleId : undefined}
          aria-describedby={
            props.ariaDescribedBy ?? (props.description ? descId : undefined)
          }
          style={{
            overflow: 'visible',
            width: props.rwidth === undefined ? `${width()}px` : '100%',
            height: props.rheight === undefined ? `${height()}px` : '100%',
          }}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={() => {
            setActiveIndex(null);
            setActivePoint(null);
          }}
          onTouchEnd={() => {
            setActiveIndex(null);
            setActivePoint(null);
          }}
          viewBox={`0 0 ${width()} ${height()}`}
        >
          <Show when={props.title}>
            <title id={titleId}>{props.title}</title>
          </Show>
          <Show when={props.description}>
            <desc id={descId}>{props.description}</desc>
          </Show>
          <ChartContext.Provider
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
              registeredLines: lineKeys,
              registerLine,
              xScale,
              yScale,
              activeIndex,
              setActiveIndex,
              yAxisBBox,
              setYAxisBBox,
              xAxisBBox,
              setXAxisBBox,
              setCustomTooltip,
            }}
          >
            {props.children}
          </ChartContext.Provider>
        </svg>
        <ChartTooltipOverlay />
      </BaseChartContext.Provider>
    </div>
  );
}
