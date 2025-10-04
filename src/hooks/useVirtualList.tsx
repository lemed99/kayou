import { Accessor, createMemo, createSignal } from 'solid-js';

type VirtualListConfig<T extends readonly unknown[]> = {
  items: Accessor<T>;
  rootHeight: number;
  rowHeight: number;
  overscanCount: number;
  setScrollPosition?: (scrollTop: number) => void;
};

export function useVirtualList<T extends readonly unknown[]>({
  items,
  rootHeight,
  rowHeight,
  overscanCount,
  setScrollPosition,
}: VirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);

  const virtual = createMemo(() => {
    const getFirstIdx = () =>
      Math.max(0, Math.floor(scrollTop() / rowHeight) - overscanCount);

    const getLastIdx = () =>
      Math.min(
        items().length,
        Math.floor(scrollTop() / rowHeight) +
          Math.ceil(rootHeight / rowHeight) +
          overscanCount,
      );
    return {
      containerHeight: items().length * rowHeight,
      viewerTop: getFirstIdx() * rowHeight,
      visibleItems: items().slice(getFirstIdx(), getLastIdx()) as unknown as T,
      startIndex: getFirstIdx(),
    };
  });

  const handleScroll = (e: Event) => {
    const el = e.target as HTMLElement;
    if (el?.scrollTop !== undefined) {
      setScrollTop(el.scrollTop);
      setScrollPosition?.(el.scrollTop);
    }
  };

  return [virtual, handleScroll] as const;
}
