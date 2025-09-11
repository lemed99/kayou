import { JSX, Show, createSignal, onCleanup, onMount } from 'solid-js';

import { Size } from './types';

export function ResponsiveContainer(props: {
  minHeight?: number;
  children: JSX.Element | ((s: Size) => JSX.Element);
}) {
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
