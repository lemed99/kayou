import { createMemo } from 'solid-js';

import { DefaultArcObject, arc } from 'd3-shape';

import type { SectorProps } from '../types';

export function Sector(props: SectorProps) {
  const arcGen = createMemo(() =>
    arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle + Math.PI / 2)
      .endAngle(props.endAngle + Math.PI / 2)
      .padAngle(0.01),
  );

  return <path d={arcGen()({} as DefaultArcObject)!} fill={props.fill} />;
}
