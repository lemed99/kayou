import { Accessor } from 'solid-js';
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
export declare function useVirtualList<T extends readonly unknown[]>({ items, rootHeight, rowHeight, overscanCount, setScrollPosition, }: VirtualListConfig<T>): readonly [Accessor<VirtualListResult<T>>, (e: Event) => void, (index: number, behavior?: ScrollBehavior) => {
    scrollTop: number;
    behavior: ScrollBehavior;
}];
export {};
