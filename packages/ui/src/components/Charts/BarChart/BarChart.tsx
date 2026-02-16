import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
} from 'solid-js';

import { ScaleBand, ScaleLinear, scaleBand, scaleLinear } from 'd3-scale';
import { pointer } from 'd3-selection';

import { BaseChartContext } from '../shared/BaseChartContext';
import { ChartTooltipOverlay } from '../shared/ChartTooltip';
import { ActivePoint, BarChartProps } from '../types';
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
    'axisClass',
    'gridClass',
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
  const [barStackIds, setBarStackIds] = createSignal<ReadonlyMap<string, string>>(
    new Map(),
  );
  const registerBar = (k: string, stackId?: string) => {
    if (!barKeys().includes(k)) setBarKeys([...barKeys(), k]);
    if (stackId) {
      setBarStackIds((prev) => {
        const m = new Map(prev);
        m.set(k, stackId);
        return m;
      });
    }
  };

  const barGap = createMemo(() => props.barGap ?? 0.1);
  const barCategoryGap = createMemo(() => props.barCategoryGap ?? 0.2);

  // Stack groups: stackId → ordered list of dataKeys
  const stackGroups = createMemo(() => {
    const map = new Map<string, string[]>();
    const ids = barStackIds();
    for (const key of barKeys()) {
      const sid = ids.get(key);
      if (sid) {
        const group = map.get(sid) ?? [];
        group.push(key);
        map.set(sid, group);
      }
    }
    return map;
  });

  // Stack offsets: for each stacked dataKey, cumulative base per data index
  const stackOffsets = createMemo(() => {
    const offsets = new Map<string, number[]>();
    for (const [, keys] of stackGroups()) {
      let cumulative = props.data.map(() => 0);
      for (const key of keys) {
        offsets.set(key, [...cumulative]);
        cumulative = cumulative.map((c, i) => c + Number(props.data[i]?.[key] ?? 0));
      }
    }
    return offsets;
  });

  const getStackBase = (dataKey: string, dataIndex: number): number => {
    return stackOffsets().get(dataKey)?.[dataIndex] ?? 0;
  };

  const isTopOfStack = (dataKey: string): boolean => {
    const ids = barStackIds();
    const sid = ids.get(dataKey);
    if (!sid) return true;
    const group = stackGroups().get(sid);
    if (!group) return true;
    return group[group.length - 1] === dataKey;
  };

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
    let maxVal = 1;
    const groups = stackGroups();
    const ids = barStackIds();

    if (groups.size > 0) {
      // Stacked: max = max sum of each stack group per data point
      for (const d of props.data) {
        for (const [, stackKeys] of groups) {
          let sum = 0;
          for (const k of stackKeys) sum += Number(d[k] ?? 0);
          if (sum > maxVal) maxVal = sum;
        }
        // Non-stacked bars use individual max
        for (const k of numericKeys) {
          if (!ids.has(k)) {
            const v = Number(d[k] ?? 0);
            if (v > maxVal) maxVal = v;
          }
        }
      }
    } else {
      for (const d of props.data) {
        for (const k of numericKeys) {
          const v = Number(d[k] ?? 0);
          if (v > maxVal) maxVal = v;
        }
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
    barKey: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [activePoint, setActivePoint] = createSignal<ActivePoint | null>(null);
  const [focusedDataIndex, setFocusedDataIndex] = createSignal(-1);

  // Memoize band centers for binary search
  const bandCenters = createMemo(() => {
    const s = xScale();
    return s.domain().map((d) => (s(d) ?? 0) + s.bandwidth() / 2);
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

  function getMaxBarValue(d: Record<string, unknown>, keys: readonly string[]): number {
    let maxVal = 0;
    const groups = stackGroups();
    const ids = barStackIds();
    if (groups.size > 0) {
      for (const [, stackKeys] of groups) {
        let sum = 0;
        for (const k of stackKeys) sum += Number(d[k] ?? 0);
        if (sum > maxVal) maxVal = sum;
      }
      for (const k of keys) {
        if (!ids.has(k)) {
          const v = Number(d[k] ?? 0);
          if (v > maxVal) maxVal = v;
        }
      }
    } else {
      for (const k of keys) {
        const v = Number(d[k] ?? 0);
        if (v > maxVal) maxVal = v;
      }
    }
    return maxVal;
  }

  function processPointer(e: MouseEvent | TouchEvent) {
    setFocusedDataIndex(-1);
    const data = props.data;
    const s = xScale();
    const ys = yScale();
    const keys = barKeys();
    const centers = bandCenters();
    const sourceEvent = 'touches' in e ? e.touches[0] : e;
    if (!sourceEvent) return;
    const [mx] = pointer(sourceEvent, svgRef);

    const domain = s.domain();
    if (!domain.length) return;

    // Binary search for nearest band center
    const idx = findNearestIndex(centers, mx);
    if (idx === -1) return;

    const d = data[idx];
    if (!d) {
      setActivePoint(null);
      return;
    }

    const bandX = s(domain[idx])!;
    // Find the tallest bar's y for tooltip positioning
    const maxVal = getMaxBarValue(d, keys);

    setActivePoint({
      item: d,
      x: bandX + s.bandwidth() / 2,
      y: ys(maxVal),
      bandX,
      bandWidth: s.bandwidth(),
    });
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
    const s = xScale();
    const ys = yScale();
    const keys = barKeys();
    const domain = s.domain();

    if (index < 0 || index >= data.length) return;
    const d = data[index];
    if (!d) return;

    const bandX = s(domain[index])!;
    const maxVal = getMaxBarValue(d, keys);

    setFocusedDataIndex(index);
    setActivePoint({
      item: d,
      x: bandX + s.bandwidth() / 2,
      y: ys(maxVal),
      bandX,
      bandWidth: s.bandwidth(),
    });
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
    const keys = barKeys();
    const values = keys.map((k) => `${k}: ${String(point.item[k])}`).join(', ');
    return `${xValue}, ${values}`;
  });

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
    <div class="relative h-full w-full text-neutral-500 dark:text-neutral-400">
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
          aria-roledescription="bar chart"
          aria-label={props.ariaLabel ?? 'Bar chart'}
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
              getStackBase,
              isTopOfStack,
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
