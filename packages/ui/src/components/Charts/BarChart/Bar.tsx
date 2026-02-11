import { For, JSX, createMemo, onMount } from 'solid-js';

import { BarProps, BarShapeProps } from '../types';
import { useBarChart } from './ChartContext';

/**
 * Default bar shape with optional rounded corners.
 */
function DefaultBarShape(props: BarShapeProps): JSX.Element {
  const radius = () => {
    if (props.radius === undefined) return 0;
    if (typeof props.radius === 'number') return props.radius;
    return props.radius;
  };

  const path = createMemo(() => {
    const x = props.x;
    const y = props.y;
    const width = props.width;
    const height = props.height;
    const r = radius();

    if (typeof r === 'number') {
      // Same radius for all corners (top only for bars)
      const topRadius = Math.min(r, width / 2, height);
      return `
        M ${x},${y + height}
        L ${x},${y + topRadius}
        Q ${x},${y} ${x + topRadius},${y}
        L ${x + width - topRadius},${y}
        Q ${x + width},${y} ${x + width},${y + topRadius}
        L ${x + width},${y + height}
        Z
      `;
    }

    // Individual radii: [topLeft, topRight, bottomRight, bottomLeft]
    const [tl, tr, br, bl] = r;
    const topLeft = Math.min(tl, width / 2, height);
    const topRight = Math.min(tr, width / 2, height);
    const bottomRight = Math.min(br, width / 2, height);
    const bottomLeft = Math.min(bl, width / 2, height);

    return `
      M ${x + bottomLeft},${y + height}
      Q ${x},${y + height} ${x},${y + height - bottomLeft}
      L ${x},${y + topLeft}
      Q ${x},${y} ${x + topLeft},${y}
      L ${x + width - topRight},${y}
      Q ${x + width},${y} ${x + width},${y + topRight}
      L ${x + width},${y + height - bottomRight}
      Q ${x + width},${y + height} ${x + width - bottomRight},${y + height}
      Z
    `;
  });

  return <path d={path()} fill={props.fill} />;
}

/**
 * Bar renders individual bars in a BarChart.
 * Automatically registers the data key and calculates bar positions.
 *
 * @example
 * <BarChart data={data} width={400} height={300}>
 *   <BarXAxis dataKey="month" />
 *   <BarYAxis />
 *   <Bar dataKey="sales" fill="#8884d8" />
 *   <Bar dataKey="profit" fill="#82ca9d" />
 * </BarChart>
 */
export function Bar(props: BarProps): JSX.Element {
  const chart = useBarChart();

  onMount(() => {
    chart.registerBar(props.dataKey, props.stackId);
  });

  const barIndex = createMemo(() => {
    return chart.registeredBars().indexOf(props.dataKey);
  });

  const totalBars = createMemo(() => {
    return chart.registeredBars().length || 1;
  });

  const fill = () => props.fill ?? '#8884d8';

  // Only the topmost bar in a stack gets rounded corners
  const effectiveRadius = createMemo(() => {
    if (!props.radius) return undefined;
    if (props.stackId && !chart.isTopOfStack(props.dataKey)) return 0;
    return props.radius;
  });

  const bars = createMemo(() => {
    const data = chart.data;
    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const xKeyVal = chart.xKey();
    const bandwidth = xScale.bandwidth();

    if (props.stackId) {
      // Stacked mode: full bandwidth, offset by cumulative stack base
      return data.map((d, i) => {
        const xVal = String(d[xKeyVal]);
        const yVal = Number(d[props.dataKey] ?? 0);
        const base = chart.getStackBase(props.dataKey, i);
        const x = xScale(xVal) ?? 0;
        const y = yScale(base + yVal);
        const baseY = yScale(base);

        return {
          x,
          y,
          width: bandwidth,
          height: Math.max(0, baseY - y),
          value: yVal,
          data: d,
          xVal,
        };
      });
    }

    // Grouped mode (existing logic)
    const barGap = chart.barGap();
    const totalGapWidth = bandwidth * barGap * (totalBars() - 1);
    const availableWidth = bandwidth - totalGapWidth;
    const barWidth = availableWidth / totalBars();
    const gapWidth = bandwidth * barGap;

    return data.map((d) => {
      const xVal = String(d[xKeyVal]);
      const yVal = Number(d[props.dataKey] ?? 0);
      const baseX = xScale(xVal) ?? 0;
      const x = baseX + barIndex() * (barWidth + gapWidth);
      const y = yScale(yVal);
      const height = chart.innerHeight() - y;

      return {
        x,
        y,
        width: barWidth,
        height: Math.max(0, height),
        value: yVal,
        data: d,
        xVal,
      };
    });
  });

  const handleMouseEnter = (bar: {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    data: Record<string, unknown>;
  }) => {
    chart.setActiveIndex({
      item: bar.data,
      barKey: props.dataKey,
      x: bar.x,
      y: bar.y,
      width: bar.width,
      height: bar.height,
    });
  };

  const handleMouseLeave = () => {
    chart.setActiveIndex(null);
  };

  const ShapeComponent = () => props.shape ?? DefaultBarShape;

  return (
    <g aria-label={`Bar series: ${props.dataKey}`}>
      <For each={bars()}>
        {(bar) => {
          const Shape = ShapeComponent();
          return (
            <g
              onMouseEnter={() => handleMouseEnter(bar)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseEnter(bar)}
              onTouchEnd={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              <Shape
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={fill()}
                radius={effectiveRadius()}
                value={bar.value}
                dataKey={props.dataKey}
                data={bar.data}
              />
              {/* Invisible hit area for better hover detection */}
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill="transparent"
              />
            </g>
          );
        }}
      </For>
    </g>
  );
}
