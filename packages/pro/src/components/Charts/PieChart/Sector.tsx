import { JSX, createMemo } from 'solid-js';

import { DefaultArcObject, arc } from 'd3-shape';

import type { SectorProps } from '../types';

/**
 * D3's pie layout starts at 12 o'clock (north), but we rotate by 90 degrees
 * (π/2 radians) to start at 3 o'clock (east) for conventional pie chart display.
 */
const ROTATION_OFFSET = Math.PI / 2;

/** Padding angle between segments in radians. */
const SEGMENT_PAD_ANGLE = 0.01;

/**
 * Sector renders a single arc/segment of a pie or donut chart.
 * Used internally by the Pie component.
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
  const arcGen = createMemo(() =>
    arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle + ROTATION_OFFSET)
      .endAngle(props.endAngle + ROTATION_OFFSET)
      .padAngle(SEGMENT_PAD_ANGLE),
  );

  return <path d={arcGen()({} as DefaultArcObject)!} fill={props.fill} />;
}
