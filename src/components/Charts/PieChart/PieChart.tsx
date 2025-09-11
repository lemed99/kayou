import { createMemo } from 'solid-js';

import type { PieChartProps } from '../types';
import { ChartContext } from './ChartContext';

export function PieChart(props: PieChartProps) {
  const width = createMemo(() => props.rwidth ?? props.width);
  const height = createMemo(() => props.rheight ?? props.height);
  return (
    <svg
      width={width()}
      height={height()}
      style={{ overflow: 'hidden', width: '100%', height: '100%' }}
      viewBox={`0 0 ${width()} ${height()}`}
    >
      <ChartContext.Provider
        value={{
          width,
          height,
        }}
      >
        {props.children}
      </ChartContext.Provider>
    </svg>
  );
}
