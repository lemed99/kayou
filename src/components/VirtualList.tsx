import { Accessor, For, JSX, createEffect, createSignal, onCleanup } from 'solid-js';

import { useVirtualList } from '../hooks/useVirtualList';

export function VirtualList<T extends readonly unknown[], U extends JSX.Element>(props: {
  items: Accessor<T>;
  rootHeight: number;
  rowHeight: number;
  overscanCount?: number;
  children: (item: T[number], index: Accessor<number>) => U;
  setContainerRef?: (el: HTMLElement) => void;
  containerWidth?: string | number;
  containerPadding?: number;
  loading?: JSX.Element;
  fallback?: JSX.Element;
}) {
  const [ref, setRef] = createSignal<HTMLElement | undefined>();
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [virtual, onScroll] = useVirtualList({
    get items() {
      return props.items;
    },
    get rootHeight() {
      return props.rootHeight;
    },
    get rowHeight() {
      return props.rowHeight;
    },
    get overscanCount() {
      return props.overscanCount || 2;
    },
  });

  let observer: ResizeObserver;

  createEffect(() => {
    if (!ref()) return;
    observer = new ResizeObserver(() => {
      setWidth(ref()!.offsetWidth);
      setHeight(ref()!.offsetHeight);
    });
    observer.observe(ref()!);
  });

  onCleanup(() => {
    if (observer) observer.disconnect();
  });

  const containerPadding = () => props.containerPadding ?? 4;
  const containerWidth = () => {
    if (props.containerWidth) {
      if (typeof props.containerWidth === 'number') return `${props.containerWidth}px`;
      if (typeof props.containerWidth === 'string') return props.containerWidth;
    } else {
      return `${width() + containerPadding() * 2}px`;
    }
  };

  return (
    <div
      ref={props.setContainerRef}
      style={{
        overflow: 'auto',
        height: `${Math.max(height(), virtual().containerHeight) + containerPadding() * 2}px`,
        'max-height': `${props.rootHeight}px`,
        padding: `${containerPadding()}px`,
        width: containerWidth(),
        'box-sizing': 'border-box',
      }}
      onScroll={onScroll}
    >
      <div
        style={{
          position: 'relative',
          height: `${Math.max(height(), virtual().containerHeight)}px`,
          width: '100%',
        }}
      >
        <div
          ref={setRef}
          style={{
            position: 'absolute',
            top: `${virtual().viewerTop}px`,
            width: props.containerWidth ? containerWidth() : 'auto',
          }}
        >
          <For each={virtual().visibleItems} fallback={props.fallback}>
            {(item, i) => (
              <div>{props.children(item, () => virtual().startIndex + i())}</div>
            )}
          </For>
          {props.loading}
        </div>
      </div>
    </div>
  );
}
