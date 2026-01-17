import { For, JSX, Show, createMemo, createSignal, onMount } from 'solid-js';

import { pie } from 'd3-shape';

import type { ActiveSector, PieProps } from '../types';
import { useChartContext } from './ChartContext';
import { Sector } from './Sector';

/**
 * Pie renders the pie/donut segments inside a PieChart.
 * Supports keyboard navigation, hover states, and custom active shapes.
 *
 * @example
 * <PieChart width={400} height={400}>
 *   <Pie
 *     data={[{ name: 'A', value: 400 }, { name: 'B', value: 300 }]}
 *     dataKey="value"
 *     labelKey="name"
 *     cx="50%"
 *     cy="50%"
 *     innerRadius={60}
 *     outerRadius={120}
 *     fill="#8884d8"
 *     onSegmentSelect={(data) => console.log('Selected:', data)}
 *   />
 * </PieChart>
 */
export function Pie(props: PieProps): JSX.Element {
  const { width, height } = useChartContext();

  const [activeSector, setActiveSector] = createSignal<ActiveSector | null>(null);
  const [focusedIndex, setFocusedIndex] = createSignal<number | null>(null);

  const arcs = createMemo(() => {
    const dataKey = props.dataKey;
    return pie<Record<string, unknown>>().value((d) => Number(d[dataKey]))(props.data);
  });

  const cx = createMemo(() => {
    if (typeof props.cx === 'number') return props.cx;
    if (typeof props.cx === 'string') {
      if (props.cx.endsWith('%')) {
        const percent = Number(props.cx.slice(0, -1));
        return (percent / 100) * width();
      }
      return parseInt(props.cx);
    }
    return 0;
  });

  const cy = createMemo(() => {
    if (typeof props.cy === 'number') return props.cy;
    if (typeof props.cy === 'string') {
      if (props.cy.endsWith('%')) {
        const percent = Number(props.cy.slice(0, -1));
        return (percent / 100) * height();
      }
      return parseInt(props.cy);
    }
    return 0;
  });

  const total = createMemo(() => {
    const dataKey = props.dataKey;
    return props.data.reduce((s, d) => s + Number(d[dataKey]), 0);
  });

  const getSegmentLabel = (d: Record<string, unknown>, percent: number): string => {
    const labelKey = props.labelKey;
    const rawLabel = labelKey ? d[labelKey] : undefined;
    let label = 'Segment';
    if (typeof rawLabel === 'string' || typeof rawLabel === 'number') {
      label = String(rawLabel);
    }
    const value = Number(d[props.dataKey]);
    return `${label}: ${value} (${(percent * 100).toFixed(1)}%)`;
  };

  const updateActiveSector = (index: number) => {
    const d = arcs()[index];
    if (!d) return;
    const percent = d.value / total();
    const sectorProps = {
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      startAngle: d.startAngle,
      endAngle: d.endAngle,
      fill: props.fill,
    };
    setActiveSector({
      ...sectorProps,
      ...d,
      percent,
      cx: cx(),
      cy: cy(),
    });
  };

  const handleKeyDown = (
    e: KeyboardEvent,
    index: number,
    data: Record<string, unknown>,
  ) => {
    const arcsLength = arcs().length;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        props.onSegmentSelect?.(data, index);
        break;
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = (index + 1) % arcsLength;
        setFocusedIndex(nextIndex);
        updateActiveSector(nextIndex);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = (index - 1 + arcsLength) % arcsLength;
        setFocusedIndex(prevIndex);
        updateActiveSector(prevIndex);
        break;
      }
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        updateActiveSector(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(arcsLength - 1);
        updateActiveSector(arcsLength - 1);
        break;
    }
  };

  onMount(() => {
    if (arcs().length > 0) {
      updateActiveSector(0);
    }
  });

  return (
    <g role="list" aria-label="Pie chart segments">
      <For each={arcs()}>
        {(d, i) => {
          const percent = d.value / total();
          const sectorProps = {
            innerRadius: props.innerRadius,
            outerRadius: props.outerRadius,
            startAngle: d.startAngle,
            endAngle: d.endAngle,
            fill: props.fill,
          };

          return (
            <g
              role="listitem"
              tabindex={0}
              aria-label={getSegmentLabel(d.data, percent)}
              transform={`translate(${cx()},${cy()})`}
              onMouseEnter={() => {
                updateActiveSector(i());
              }}
              onFocus={() => {
                setFocusedIndex(i());
                updateActiveSector(i());
              }}
              onBlur={() => setFocusedIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, i(), d.data)}
              onClick={() => props.onSegmentSelect?.(d.data, i())}
              style={{ cursor: 'pointer', outline: 'none' }}
              class={
                focusedIndex() === i()
                  ? 'focus-visible:ring-2 focus-visible:ring-blue-500'
                  : ''
              }
            >
              <Sector {...sectorProps} />
            </g>
          );
        }}
      </For>
      <Show when={activeSector() && props.activeShape}>
        {props.activeShape?.(activeSector()!)}
      </Show>
    </g>
  );
}
