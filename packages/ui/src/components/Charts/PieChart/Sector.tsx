import { JSX, createMemo } from 'solid-js';

import { DefaultArcObject, arc } from 'd3-shape';

import type { SectorProps } from '../types';

/**
 * D3's pie layout starts at 12 o'clock (north), but we rotate by 90 degrees
 * (π/2 radians) to start at 3 o'clock (east) for conventional pie chart display.
 */
const ROTATION_OFFSET = Math.PI / 2;

/** Padding angle between segments in radians (donut charts only). */
const SEGMENT_PAD_ANGLE = 0.01;

/**
 * Sector renders a single arc/segment of a pie or donut chart.
 * Used internally by the Pie component.
 *
 * For donut charts (innerRadius > 0), segments are separated via padAngle
 * which creates clean parallel gaps. For full pies (innerRadius === 0),
 * padAngle gaps converge to the center creating visual artifacts, so a
 * white stroke is used instead (same approach as Recharts).
 *
 * @example
 * // Internal usage within Pie:
 * <Sector
 *   innerRadius={60}
 *   outerRadius={120}
 *   startAngle={0}
 *   endAngle={Math.PI / 2}
 *   fill="#8884d8"
 * />
 */
export function Sector(props: SectorProps): JSX.Element {
  const isDonut = () => props.innerRadius > 0;

  const arcGen = createMemo(() => {
    const gen = arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle + ROTATION_OFFSET)
      .endAngle(props.endAngle + ROTATION_OFFSET);

    if (isDonut()) {
      gen.padAngle(SEGMENT_PAD_ANGLE);
    }

    return gen;
  });

  return (
    <path
      d={arcGen()({} as DefaultArcObject)!}
      fill={props.fill}
      stroke={isDonut() ? 'none' : 'white'}
      stroke-width={isDonut() ? 0 : 1}
      stroke-linejoin={isDonut() ? undefined : 'round'}
    />
  );
}
