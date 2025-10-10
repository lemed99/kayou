import { Accessor, For, JSX, createSignal, onCleanup, onMount } from 'solid-js';

import { useDynamicVirtualList } from '../hooks/useDynamicVirtualList';

export function DynamicVirtualList<
  T extends readonly unknown[],
  U extends JSX.Element,
>(props: {
  items: Accessor<T>;
  rootHeight: number;
  estimatedRowHeight: number;
  overscanCount?: number;
  children: (item: T[number], index: Accessor<number>) => U;
  setContainerRef?: (el: HTMLElement) => void;
  containerWidth?: string | number;
  containerPadding?: number;
  loading?: JSX.Element;
  setScrollPosition?: (scrollTop: number) => void;
  fallback?: JSX.Element;
  rowClass?: string;
  setAverageRowHeight?: (height: number) => void;
}) {
  const [ref, setRef] = createSignal<HTMLElement | undefined>();
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [virtual, onScroll, registerSize] = useDynamicVirtualList({
    get items() {
      return props.items;
    },
    get rootHeight() {
      return props.rootHeight;
    },
    get estimatedRowHeight() {
      return props.estimatedRowHeight;
    },
    get overscanCount() {
      return props.overscanCount || 2;
    },
    get setScrollPosition() {
      return props.setScrollPosition;
    },
    get setAverageRowHeight() {
      return props.setAverageRowHeight;
    },
  });

  let observer: ResizeObserver;

  onMount(() => {
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
            {(item, i) => {
              const newIndex = () => virtual().startIndex + i();
              return (
                <div ref={(el) => registerSize(newIndex, el)} class={props.rowClass}>
                  {props.children(item, newIndex)}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
