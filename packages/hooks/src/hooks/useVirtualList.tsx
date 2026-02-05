import { Accessor, createMemo, createSignal, onCleanup } from 'solid-js';

type VirtualListConfig<T extends readonly unknown[]> = {
  items: Accessor<T>;
  rootHeight: Accessor<number> | number;
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

export function useVirtualList<T extends readonly unknown[]>(
  config: VirtualListConfig<T>,
) {
  const [scrollTop, setScrollTop] = createSignal(0);

  const virtual = createMemo((): VirtualListResult<T> => {
    const itemList = config.items();
    const rh = typeof config.rootHeight === 'function' ? config.rootHeight() : config.rootHeight;
    const rowH = config.rowHeight;
    const ov = config.overscanCount;
    const firstIdx = Math.max(0, Math.floor(scrollTop() / rowH) - ov);
    const lastIdx = Math.min(
      itemList.length,
      Math.floor(scrollTop() / rowH) +
        Math.ceil(rh / rowH) +
        ov,
    );

    return {
      containerHeight: itemList.length * rowH,
      viewerTop: firstIdx * rowH,
      visibleItems: itemList.slice(firstIdx, lastIdx) as T[number][],
      startIndex: firstIdx,
      totalItems: itemList.length,
    };
  });

  let scrollRafId: number | undefined;
  const handleScroll = (e: Event) => {
    const el = e.target as HTMLElement;
    if (el?.scrollTop === undefined) return;

    if (scrollRafId) cancelAnimationFrame(scrollRafId);
    scrollRafId = requestAnimationFrame(() => {
      setScrollTop(el.scrollTop);
      config.setScrollPosition?.(el.scrollTop);
    });
  };

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'auto') => {
    const clampedIndex = Math.max(0, Math.min(index, config.items().length - 1));
    const targetScrollTop = clampedIndex * config.rowHeight;
    return { scrollTop: targetScrollTop, behavior };
  };

  onCleanup(() => {
    if (scrollRafId) cancelAnimationFrame(scrollRafId);
  });

  return [virtual, handleScroll, scrollToIndex] as const;
}
