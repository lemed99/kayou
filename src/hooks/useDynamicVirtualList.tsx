import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from 'solid-js';

type DynamicVirtualListConfig<T extends readonly unknown[]> = {
  items: Accessor<T>;
  rootHeight: number;
  estimatedRowHeight: number;
  overscanCount: number;
  setScrollPosition?: (scrollTop: number) => void;
  setAverageRowHeight?: (height: number) => void;
};

type DynamicVirtualListResult<T extends readonly unknown[]> = {
  containerHeight: number;
  viewerTop: number;
  visibleItems: T[number][];
  startIndex: number;
  endIndex: number;
  totalItems: number;
};

export function useDynamicVirtualList<T extends readonly unknown[]>({
  items,
  rootHeight,
  estimatedRowHeight,
  overscanCount,
  setScrollPosition,
  setAverageRowHeight,
}: DynamicVirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);
  const [sizeMapVersion, setSizeMapVersion] = createSignal(0);
  const sizeMap = new Map<number, number>();
  const observerMap = new Map<number, { observer: ResizeObserver; index: number }>();
  let previousItemsLength = 0;

  const cleanupObserver = (index: number) => {
    const entry = observerMap.get(index);
    if (entry) {
      entry.observer.disconnect();
      observerMap.delete(index);
    }
  };

  // Clean up stale entries when items are removed
  createEffect(
    on(items, (currentItems) => {
      const currentLength = currentItems.length;

      // If items were removed, clean up stale entries
      if (currentLength < previousItemsLength) {
        for (let i = currentLength; i < previousItemsLength; i++) {
          cleanupObserver(i);
          sizeMap.delete(i);
        }
        setSizeMapVersion((v) => v + 1);
      }

      previousItemsLength = currentLength;
    }),
  );

  const registerSize = (index: Accessor<number>, el: HTMLElement) => {
    if (!el) return;

    const capturedIndex = index();

    // Clean up any existing observer for this index to prevent memory leaks
    cleanupObserver(capturedIndex);

    const observer = new ResizeObserver(() => {
      // Only update if element is still connected to DOM
      if (!el.isConnected) return;

      const currentLength = items().length;
      if (capturedIndex >= currentLength) return;

      const newHeight = el.offsetHeight;
      const currentHeight = sizeMap.get(capturedIndex);

      // Only update if height actually changed to prevent infinite loops
      if (currentHeight !== newHeight) {
        sizeMap.set(capturedIndex, newHeight);
        setSizeMapVersion((v) => v + 1);
      }
    });
    observer.observe(el);
    observerMap.set(capturedIndex, { observer, index: capturedIndex });
  };

  const getAverageRowHeight = createMemo(() => {
    sizeMapVersion(); // called to trigger reactivity

    if (sizeMap.size === 0) return undefined;
    return [...sizeMap.values()].reduce((acc, v) => acc + v, 0) / sizeMap.size;
  });

  // Report average height changes via effect (side effects must not be in memos)
  createEffect(() => {
    const avgHeight = getAverageRowHeight();
    if (avgHeight !== undefined) {
      setAverageRowHeight?.(avgHeight);
    }
  });

  const getPrefixHeights = createMemo(() => {
    sizeMapVersion(); // called to trigger reactivity

    const estimatedHeight = getAverageRowHeight() ?? estimatedRowHeight;
    let total = 0;
    const offsets: number[] = [];

    for (let i = 0; i < items().length; i++) {
      offsets[i] = total;
      total += sizeMap.get(i) ?? estimatedHeight;
    }

    return { offsets, total };
  });

  const virtual = createMemo((): DynamicVirtualListResult<T> => {
    const itemList = items();
    const { offsets, total } = getPrefixHeights();

    // Handle empty array edge case
    if (itemList.length === 0) {
      return {
        containerHeight: 0,
        viewerTop: 0,
        visibleItems: [] as T[number][],
        startIndex: 0,
        endIndex: 0,
        totalItems: 0,
      };
    }

    const st = scrollTop();
    const rh = rootHeight;
    const ov = overscanCount;

    // Binary search to find the first visible item
    let start = 0;
    let end = itemList.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (offsets[mid] < st) start = mid + 1;
      else end = mid;
    }
    const firstIdx = Math.max(0, start - ov);

    let lastIdx = firstIdx;
    while (lastIdx < itemList.length && offsets[lastIdx] < st + rh) {
      lastIdx++;
    }
    lastIdx = Math.min(itemList.length, lastIdx + ov);

    return {
      containerHeight: total,
      viewerTop: offsets[firstIdx] ?? 0,
      visibleItems: itemList.slice(firstIdx, lastIdx) as T[number][],
      startIndex: firstIdx,
      endIndex: lastIdx,
      totalItems: itemList.length,
    };
  });

  // Clean up observers outside visible range (side effect in effect, not memo)
  createEffect(() => {
    const { startIndex, endIndex } = virtual();
    observerMap.forEach((_, index) => {
      if (index < startIndex || index >= endIndex) {
        cleanupObserver(index);
      }
    });
  });

  const handleScroll = (e: Event) => {
    const el = e.target as HTMLElement;
    if (el?.scrollTop !== undefined) {
      setScrollTop(el.scrollTop);
      setScrollPosition?.(el.scrollTop);
    }
  };

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'auto') => {
    const itemList = items();
    if (itemList.length === 0) {
      return { scrollTop: 0, behavior };
    }
    const clampedIndex = Math.max(0, Math.min(index, itemList.length - 1));
    const { offsets } = getPrefixHeights();
    const targetScrollTop = offsets[clampedIndex] ?? 0;
    return { scrollTop: targetScrollTop, behavior };
  };

  onCleanup(() => {
    observerMap.forEach((entry) => entry.observer.disconnect());
    observerMap.clear();
    sizeMap.clear();
  });

  return [virtual, handleScroll, registerSize, scrollToIndex] as const;
}
