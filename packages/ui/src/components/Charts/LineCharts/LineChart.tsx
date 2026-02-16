import {
  JSX,
  Show,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
} from 'solid-js';

import { ScaleLinear, ScalePoint, scaleLinear, scalePoint } from 'd3-scale';
import { pointer } from 'd3-selection';

import { BaseChartContext } from '../shared/BaseChartContext';
import { ChartTooltipOverlay } from '../shared/ChartTooltip';
import { ActivePoint, LineChartProps } from '../types';
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
    'axisClass',
    'gridClass',
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
    let maxVal = 1;
    for (const d of props.data) {
      for (const k of numericKeys) {
        const v = Number(d[k] ?? 0);
        if (v > maxVal) maxVal = v;
      }
    }
    const scale = scaleLinear<number, number>()
      .domain([0, maxVal])
      .nice()
      .range([innerHeight(), 0]);
    const ticks = scale.ticks();
    if (ticks.length >= 2 && ticks.length % 2 === 0) {
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
  const [focusedDataIndex, setFocusedDataIndex] = createSignal(-1);

  // Memoize x positions for binary search
  const xPositions = createMemo(() => {
    const s = xScale();
    return s.domain().map((d) => s(d) ?? 0);
  });

  let svgRef: SVGSVGElement | undefined;
  let pointerRafId: number | undefined;

  function handlePointerMove(e: MouseEvent | TouchEvent) {
    if (pointerRafId !== undefined) return;
    pointerRafId = requestAnimationFrame(() => {
      pointerRafId = undefined;
      processPointer(e);
    });
  }

  function processPointer(e: MouseEvent | TouchEvent) {
    setFocusedDataIndex(-1);
    const data = props.data;
    const key = xKey();
    const xScaleVal = xScale();
    const yScaleVal = yScale();
    const lineKeysVal = lineKeys();
    const positions = xPositions();

    const sourceEvent = 'touches' in e ? e.touches[0] : e;
    if (!sourceEvent) return;
    const [x, y] = pointer(sourceEvent, svgRef);

    if (!positions.length) return;

    // Binary search for nearest x position
    const index = findNearestIndex(positions, x);
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

  function clearActive() {
    if (pointerRafId !== undefined) {
      cancelAnimationFrame(pointerRafId);
      pointerRafId = undefined;
    }
    setActiveIndex(null);
    setActivePoint(null);
  }

  onCleanup(() => {
    if (pointerRafId !== undefined) cancelAnimationFrame(pointerRafId);
  });

  function activateByIndex(index: number) {
    const data = props.data;
    const key = xKey();
    const xScaleVal = xScale();
    const yScaleVal = yScale();
    const lineKeysVal = lineKeys();

    if (index < 0 || index >= data.length) return;
    const d = data[index];
    if (!d) return;

    let cy = 0;
    if (lineKeysVal.length === 1) {
      cy = yScaleVal(Number(d[lineKeysVal[0]]));
    } else if (lineKeysVal.length > 0) {
      const maxKey = lineKeysVal.reduce((a, b) => (Number(d[a]) > Number(d[b]) ? a : b));
      cy = yScaleVal(Number(d[maxKey]));
    }
    const cx = xScaleVal(String(d[key])) as number;

    setFocusedDataIndex(index);
    setActiveIndex({ item: d, x: cx, y: cy, cursor: [cx, cy] });
    setActivePoint({ item: d, x: cx, y: cy });
  }

  function handleKeyDown(e: KeyboardEvent) {
    const dataLength = props.data.length;
    if (dataLength === 0) return;
    const current = focusedDataIndex();

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const next = current < 0 ? 0 : Math.min(current + 1, dataLength - 1);
        activateByIndex(next);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const prev = current < 0 ? dataLength - 1 : Math.max(current - 1, 0);
        activateByIndex(prev);
        break;
      }
      case 'Home':
        e.preventDefault();
        activateByIndex(0);
        break;
      case 'End':
        e.preventDefault();
        activateByIndex(dataLength - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setFocusedDataIndex(-1);
        clearActive();
        break;
    }
  }

  const announcement = createMemo(() => {
    const point = activePoint();
    if (!point || focusedDataIndex() < 0) return '';
    const xValue = String(point.item[xKey()]);
    const keys = lineKeys();
    const values = keys.map((k) => `${k}: ${String(point.item[k])}`).join(', ');
    return `${xValue}, ${values}`;
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
          registeredKeys: lineKeys,
          customTooltip,
          setCustomTooltip,
          tooltipPosition: 'beside',
          tooltipEnabled,
          setTooltipEnabled,
          get axisClass() {
            return props.axisClass ?? 'text-neutral-500 dark:text-neutral-500';
          },
          get gridClass() {
            return props.gridClass ?? 'text-neutral-300 dark:text-neutral-800';
          },
        }}
      >
        <svg
          ref={svgRef}
          tabindex={0}
          width={width()}
          height={height()}
          role="img"
          aria-roledescription="line chart"
          aria-label={props.ariaLabel ?? 'Line chart'}
          aria-labelledby={props.title ? titleId : undefined}
          aria-describedby={
            props.ariaDescribedBy ?? (props.description ? descId : undefined)
          }
          style={{
            overflow: 'visible',
            width: props.rwidth === undefined ? `${width()}px` : '100%',
            height: props.rheight === undefined ? `${height()}px` : '100%',
            outline: 'none',
          }}
          class="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={clearActive}
          onTouchEnd={clearActive}
          onKeyDown={handleKeyDown}
          onFocusOut={() => {
            setFocusedDataIndex(-1);
            clearActive();
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
        <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
          {announcement()}
        </div>
      </BaseChartContext.Provider>
    </div>
  );
}

function findNearestIndex(sortedPositions: number[], target: number): number {
  const len = sortedPositions.length;
  if (len === 0) return -1;
  if (len === 1) return 0;
  let lo = 0;
  let hi = len - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedPositions[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (
    lo > 0 &&
    Math.abs(sortedPositions[lo - 1] - target) <= Math.abs(sortedPositions[lo] - target)
  ) {
    return lo - 1;
  }
  return lo;
}
