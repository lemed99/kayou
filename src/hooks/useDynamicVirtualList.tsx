import { Accessor, createMemo, createSignal, onCleanup } from 'solid-js';

type DynamicVirtualListConfig<T extends readonly unknown[]> = {
  items: Accessor<T>;
  rootHeight: Accessor<number>;
  overscanCount?: Accessor<number>;
};

export function useDynamicVirtualList<T extends readonly unknown[]>({
  items,
  rootHeight,
  overscanCount,
}: DynamicVirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);
  const sizeMap = new Map<number, number>();

  const getItems = () => items();
  const getRootHeight = () => rootHeight();
  const getOverscan = () => overscanCount?.() || 2;

  const registerSize = (index: number, el: HTMLElement) => {
    if (!el) return;
    const ro = new ResizeObserver(() => {
      sizeMap.set(index, el.offsetHeight);
    });
    ro.observe(el);
    sizeMap.set(index, el.offsetHeight);
    onCleanup(() => ro.disconnect());
  };

  const prefixHeights = () => {
    const arr = getItems();
    let total = 0;
    const offsets: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      offsets[i] = total;
      total += sizeMap.get(i) ?? 50;
    }
    return { offsets, total };
  };

  const virtual = createMemo(() => {
    const arr = getItems();
    const { offsets, total } = prefixHeights();

    const st = scrollTop();
    const rh = getRootHeight();
    const ov = getOverscan();

    let start = 0;
    let end = arr.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (offsets[mid] < st) start = mid + 1;
      else end = mid;
    }
    const firstIdx = Math.max(0, start - ov);

    let lastIdx = firstIdx;
    while (lastIdx < arr.length && offsets[lastIdx] < st + rh + ov * 50) {
      lastIdx++;
    }

    return {
      containerHeight: total,
      viewerTop: offsets[firstIdx] ?? 0,
      visibleItems: arr.slice(firstIdx, lastIdx),
      startIndex: firstIdx,
    };
  });

  return [
    virtual,
    (e: Event) => {
      const el = e.target as HTMLElement;
      if (el?.scrollTop !== undefined) setScrollTop(el.scrollTop);
    },
    registerSize,
  ] as const;
}
