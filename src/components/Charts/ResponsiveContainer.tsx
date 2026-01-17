import { JSX, Show, createSignal, onCleanup, onMount } from 'solid-js';

import { Size } from './types';

/**
 * Props for the ResponsiveContainer component.
 */
export interface ResponsiveContainerProps {
  /** Minimum height in pixels. @default 200 */
  minHeight?: number;
  /** Chart component or render function receiving the current size. */
  children: JSX.Element | ((s: Size) => JSX.Element);
}

/**
 * ResponsiveContainer wraps a chart and provides responsive dimensions.
 * Automatically tracks container size changes via ResizeObserver.
 *
 * @example
 * <ResponsiveContainer minHeight={300}>
 *   {(size) => (
 *     <LineChart data={data} width={600} height={400} rwidth={size.rwidth} rheight={size.rheight}>
 *       <XAxis dataKey="month" />
 *       <YAxis />
 *       <Line dataKey="sales" />
 *     </LineChart>
 *   )}
 * </ResponsiveContainer>
 */
export function ResponsiveContainer(props: ResponsiveContainerProps): JSX.Element {
  let ref!: HTMLDivElement;

  const [size, setSize] = createSignal<Size>({
    rwidth: 0,
    get rheight() {
      return props.minHeight ?? 200;
    },
  });

  onMount(() => {
    const obs = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ rwidth: cr.width, rheight: cr.height });
    });
    obs.observe(ref);
    const rect = ref.getBoundingClientRect();
    if (rect.width && rect.height) setSize({ rwidth: rect.width, rheight: rect.height });
    onCleanup(() => obs.disconnect());
  });

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        'min-width': 0,
      }}
    >
      <Show
        when={typeof props.children === 'function'}
        fallback={props.children as JSX.Element}
      >
        {(props.children as (s: Size) => JSX.Element)(size())}
      </Show>
    </div>
  );
}
