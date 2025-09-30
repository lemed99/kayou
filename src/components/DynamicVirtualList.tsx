import { Accessor, For, JSX } from 'solid-js';

import { useDynamicVirtualList } from '../hooks/useDynamicVirtualList';

export function DynamicVirtualList<
  T extends readonly unknown[],
  U extends JSX.Element,
>(props: {
  each: T;
  rootHeight: number;
  estimatedRowHeight: number;
  overscanCount?: number;
  children: (item: T[number], index: Accessor<number>) => U;
}) {
  const [virtual, onScroll, registerSize] = useDynamicVirtualList({
    get items() {
      return props.each;
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
            {(item, i) => {
              const newIndex = () => virtual().startIndex + i();
              return (
                <div ref={(el) => registerSize(newIndex, el)}>
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
