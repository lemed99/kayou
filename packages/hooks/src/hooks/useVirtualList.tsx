import { Accessor, createMemo, createSignal } from 'solid-js';

type VirtualListConfig<T extends readonly unknown[]> = {
  items: Accessor<T>;
  rootHeight: number;
  rowHeight: number;
  overscanCount: number;
  setScrollPosition?: (scrollTop: number) => void;
};

type VirtualListResult<T extends readonly unknown[]> = {
  containerHeight: number;
  viewerTop: number;
  visibleItems: T[number][];
  startIndex: number;
  totalItems: number;
};

export function useVirtualList<T extends readonly unknown[]>({
  items,
  rootHeight,
  rowHeight,
  overscanCount,
  setScrollPosition,
}: VirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);

  const virtual = createMemo((): VirtualListResult<T> => {
    const itemList = items();
    const firstIdx = Math.max(0, Math.floor(scrollTop() / rowHeight) - overscanCount);
    const lastIdx = Math.min(
      itemList.length,
      Math.floor(scrollTop() / rowHeight) +
        Math.ceil(rootHeight / rowHeight) +
        overscanCount,
    );

    return {
      containerHeight: itemList.length * rowHeight,
      viewerTop: firstIdx * rowHeight,
      visibleItems: itemList.slice(firstIdx, lastIdx) as T[number][],
      startIndex: firstIdx,
      totalItems: itemList.length,
    };
  });

  const handleScroll = (e: Event) => {
    const el = e.target as HTMLElement;
    if (el?.scrollTop !== undefined) {
      setScrollTop(el.scrollTop);
      setScrollPosition?.(el.scrollTop);
    }
  };

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'auto') => {
    const clampedIndex = Math.max(0, Math.min(index, items().length - 1));
    const targetScrollTop = clampedIndex * rowHeight;
    return { scrollTop: targetScrollTop, behavior };
  };

  return [virtual, handleScroll, scrollToIndex] as const;
}
