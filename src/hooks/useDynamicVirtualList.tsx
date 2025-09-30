import { Accessor, createMemo, createSignal, onCleanup } from 'solid-js';

type DynamicVirtualListConfig<T extends readonly unknown[]> = {
  items: T;
  rootHeight: number;
  estimatedRowHeight: number;
  overscanCount: number;
};

export function useDynamicVirtualList<T extends readonly unknown[]>({
  items,
  rootHeight,
  estimatedRowHeight,
  overscanCount,
}: DynamicVirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);
  const [sizeMapVersion, setSizeMapVersion] = createSignal(0);
  const sizeMap = new Map<number, number>();
  const observerMap = new Map<number, ResizeObserver>();

  const cleanupObserver = (index: number) => {
    const observer = observerMap.get(index);
    if (observer) {
      observer.disconnect();
      observerMap.delete(index);
    }
  };

  const registerSize = (index: Accessor<number>, el: HTMLElement) => {
    if (!el) return;
    const elHeight = sizeMap.get(index());
    if (elHeight) return;
    const observer = new ResizeObserver(() => {
      sizeMap.set(index(), el.offsetHeight);
      setSizeMapVersion((v) => v + 1);
    });
    observer.observe(el);
    observerMap.set(index(), observer);
  };

  const getAverageRowHeight = createMemo(() => {
    sizeMapVersion(); // called to trigger reactivity

    if (sizeMap.size === 0) return undefined;
    return [...sizeMap.values()].reduce((acc, v) => acc + v, 0) / sizeMap.size;
  });

  const getPrefixHeights = createMemo(() => {
    sizeMapVersion();

    const arr = items;
    const estimatedHeight = getAverageRowHeight() ?? estimatedRowHeight;
    let total = 0;
    const offsets: number[] = [];

    for (let i = 0; i < arr.length; i++) {
      offsets[i] = total;
      total += sizeMap.get(i) ?? estimatedHeight;
    }

    return { offsets, total };
  });

  const virtual = createMemo(() => {
    const arr = items;
    const { offsets, total } = getPrefixHeights();

    const st = scrollTop();
    const rh = rootHeight;
    const ov = overscanCount;

    let start = 0;
    let end = arr.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (offsets[mid] < st) start = mid + 1;
      else end = mid;
    }
    const firstIdx = Math.max(0, start - ov);

    let lastIdx = firstIdx;
    while (lastIdx < arr.length && offsets[lastIdx] < st + rh) {
      lastIdx++;
    }
    lastIdx = Math.min(arr.length, lastIdx + ov);

    observerMap.forEach((_, index) => {
      if (index < firstIdx || index >= lastIdx) {
        cleanupObserver(index);
      }
    });

    return {
      containerHeight: total,
      viewerTop: offsets[firstIdx] ?? 0,
      visibleItems: arr.slice(firstIdx, lastIdx) as unknown as T,
      startIndex: firstIdx,
    };
  });

  const handleScroll = (e: Event) => {
    const el = e.target as HTMLElement;
    if (el?.scrollTop !== undefined) setScrollTop(el.scrollTop);
  };

  onCleanup(() => {
    observerMap.forEach((observer) => observer.disconnect());
    observerMap.clear();
    sizeMap.clear();
  });

  return [virtual, handleScroll, registerSize] as const;
}
