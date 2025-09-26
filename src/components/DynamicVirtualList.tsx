import { For, JSX } from 'solid-js';

import { useDynamicVirtualList } from '../hooks/useDynamicVirtualList';

export function DynamicVirtualList<
  T extends readonly unknown[],
  U extends JSX.Element,
>(props: {
  each: T;
  rootHeight: number;
  overscanCount?: number;
  children: (item: T[number], index: number) => U;
}) {
  const [virtual, onScroll, registerSize] = useDynamicVirtualList({
    items: () => props.each,
    rootHeight: () => props.rootHeight,
    overscanCount: () => props.overscanCount || 2,
  });

  return (
    <div
      style={{ overflow: 'auto', height: `${props.rootHeight}px` }}
      onScroll={onScroll}
    >
      <div
        style={{
          position: 'relative',
          height: `${virtual().containerHeight}px`,
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: `${virtual().viewerTop}px`,
            width: '100%',
          }}
        >
          <For each={virtual().visibleItems}>
            {(item, i) => (
              <div ref={(el) => registerSize(virtual().startIndex + i(), el)}>
                {props.children(item, virtual().startIndex + i())}
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
