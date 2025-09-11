import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { ScaleLinear, ScalePoint, scaleLinear, scalePoint } from 'd3-scale';
import { pointer } from 'd3-selection';

import { LineChartProps } from '../types';
import { ChartContext } from './ChartContext';

export function LineChart(allProps: LineChartProps) {
  const [props] = splitProps(allProps, [
    'width',
    'height',
    'data',
    'children',
    'rwidth',
    'rheight',
  ]);

  const [yAxisBBox, setYAxisBBox] = createSignal<DOMRect | null>(null);
  const [xAxisBBox, setXAxisBBox] = createSignal<DOMRect | null>(null);

  const [customTooltip, setCustomTooltip] = createSignal<
    ((data: Record<string, unknown>) => JSX.Element) | undefined
  >(undefined);

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

  function onMouseMove(e: MouseEvent) {
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
    } else {
      setActiveIndex(null);
    }
  }

  const tooltipId = createUniqueId();
  const [boxDimensions, setBoxDimensions] = createSignal<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  createEffect(() => {
    if (activeIndex()) {
      const box = document.getElementById(tooltipId);
      if (box) {
        const { width, height } = box.getBoundingClientRect();
        setBoxDimensions({ width, height });
      }
    }
  });

  const boxPos = createMemo<{ x: number; y: number }>(() => {
    if (activeIndex() === null) return { x: 0, y: 0 };

    const { width: boxWidth, height: boxHeight } = boxDimensions();
    const point = activeIndex()!;

    let y = point.y - boxHeight / 2;
    if (y < 0) {
      y = 0;
    }
    if (y + boxHeight > height()) {
      y = height() - boxHeight;
    }

    let x = point.x;
    if (x + boxWidth > width()) {
      x = point.x - boxWidth;
    }

    return { x, y };
  });

  return (
    <div class="relative h-full w-full">
      <svg
        width={width()}
        height={height()}
        style={{ overflow: 'visible', width: '100%', height: '100%' }}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setActiveIndex(null)}
        viewBox={`0 0 ${width()} ${height()}`}
      >
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
      <Show when={activeIndex() !== null}>
        <div
          id={tooltipId}
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
              <div class="border border-gray-200 bg-white px-2 py-1.5 text-xs shadow">
                <div class="whitespace-nowrap">
                  <b>{String(activeIndex()!.item[xKey()])}</b>
                </div>
                <For each={lineKeys()}>
                  {(k) => (
                    <div class="whitespace-nowrap">
                      {String(k)}: {String(activeIndex()!.item[k] as number)}
                    </div>
                  )}
                </For>
              </div>
            }
          >
            {customTooltip()?.(activeIndex()!.item)}
          </Show>
        </div>
      </Show>
    </div>
  );
}
