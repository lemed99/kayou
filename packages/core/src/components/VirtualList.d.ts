import { Accessor, JSX } from 'solid-js';
export type VirtualListHandle = {
    scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};
export declare function VirtualList<T extends readonly unknown[], U extends JSX.Element>(props: {
    items: Accessor<T>;
    rootHeight: number;
    rowHeight: number;
    overscanCount?: number;
    children: (item: T[number], index: Accessor<number>) => U;
    setContainerRef?: (el: HTMLElement) => void;
    containerWidth?: string | number;
    /** Minimum width for the container */
    minWidth?: number;
    containerPadding?: number;
    loading?: JSX.Element;
    setScrollPosition?: (scrollTop: number) => void;
    fallback?: JSX.Element;
    rowClass?: string;
    id?: string;
    role?: JSX.HTMLAttributes<HTMLDivElement>['role'];
    'aria-multiselectable'?: boolean;
    'aria-label'?: string;
    ref?: (handle: VirtualListHandle) => void;
}): JSX.Element;
