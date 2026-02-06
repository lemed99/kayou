import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
} from 'solid-js';

import { ChartTooltipProps } from '../types';
import { useBaseChart } from './BaseChartContext';

export function ChartTooltip(props: ChartTooltipProps): JSX.Element {
  const chart = useBaseChart();

  chart.setTooltipEnabled(true);

  createEffect(() => {
    const content = props.content;
    if (content) {
      chart.setCustomTooltip(() => content);
    } else {
      chart.setCustomTooltip(undefined);
    }
  });

  onCleanup(() => {
    chart.setTooltipEnabled(false);
    chart.setCustomTooltip(undefined);
  });

  const withLine = () => props.withLine !== false;

  // SVG indicator: rectangle cursor for bar charts, vertical line for line/area
  return (
    <Show when={withLine() && chart.activePoint()}>
      <Show
        when={chart.tooltipPosition === 'above' && chart.activePoint()!.bandWidth}
        fallback={
          <line
            x1={chart.activePoint()!.x}
            x2={chart.activePoint()!.x}
            y1={0}
            y2={chart.innerHeight()}
            stroke={props.stroke ?? '#ccc'}
            stroke-dasharray="4 4"
            aria-hidden="true"
          />
        }
      >
        <rect
          x={chart.activePoint()!.bandX}
          y={0}
          width={chart.activePoint()!.bandWidth}
          height={chart.innerHeight()}
          fill={props.stroke ?? '#d1d5db'}
          fill-opacity={0.3}
          aria-hidden="true"
        />
      </Show>
    </Show>
  );
}

/**
 * HTML tooltip overlay rendered outside the SVG.
 * Used internally by chart components.
 */
export function ChartTooltipOverlay(): JSX.Element {
  const chart = useBaseChart();
  const tooltipId = createUniqueId();
  let tooltipRef: HTMLDivElement | undefined;
  const [boxDimensions, setBoxDimensions] = createSignal<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  // Only re-measure when the active item changes (not on every pointer move)
  const activeItem = createMemo(() => chart.activePoint()?.item ?? null);
  let measureRafId: number | undefined;

  createEffect(
    on(activeItem, (item) => {
      if (measureRafId !== undefined) cancelAnimationFrame(measureRafId);
      if (!item) return;
      measureRafId = requestAnimationFrame(() => {
        measureRafId = undefined;
        if (tooltipRef) {
          const { width, height } = tooltipRef.getBoundingClientRect();
          setBoxDimensions({ width, height });
        }
      });
    }),
  );

  onCleanup(() => {
    if (measureRafId !== undefined) cancelAnimationFrame(measureRafId);
  });

  const boxPos = createMemo<{ x: number; y: number }>(() => {
    const point = chart.activePoint();
    if (!point) return { x: 0, y: 0 };

    const { width: boxWidth, height: boxHeight } = boxDimensions();

    if (chart.tooltipPosition === 'above') {
      // Bar chart style: above the bar, centered
      let y = point.y - boxHeight - 8;
      if (y < 0) {
        y = point.y + (point.barHeight ?? 0) + 8;
      }

      let x = point.x + (point.barWidth ?? 0) / 2 - boxWidth / 2;
      if (x < 0) x = 0;
      if (x + boxWidth > chart.width()) x = chart.width() - boxWidth;

      return { x, y };
    }

    // Line/Area style: beside the point
    let y = point.y - boxHeight / 2;
    if (y < 0) y = 0;
    if (y + boxHeight > chart.height()) y = chart.height() - boxHeight;

    let x = point.x;
    if (x + boxWidth > chart.width()) x = point.x - boxWidth;

    return { x, y };
  });

  return (
    <Show when={chart.tooltipEnabled() && chart.activePoint() !== null}>
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
          when={chart.customTooltip()}
          fallback={
            <div class="border border-gray-200 bg-white px-2 py-1.5 text-xs shadow dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
              <div class="whitespace-nowrap">
                <b>{String(chart.activePoint()!.item[chart.xKey()])}</b>
              </div>
              <For each={chart.registeredKeys()}>
                {(k) => (
                  <div class="whitespace-nowrap">
                    {String(k)}: {String(chart.activePoint()!.item[k] as number)}
                  </div>
                )}
              </For>
            </div>
          }
        >
          {chart.customTooltip()?.(chart.activePoint()!.item)}
        </Show>
      </div>
    </Show>
  );
}
