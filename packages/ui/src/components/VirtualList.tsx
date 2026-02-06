import {
  Accessor,
  For,
  JSX,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import { useVirtualList } from '@kayou/hooks';

export type VirtualListHandle = {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};

export function VirtualList<T extends readonly unknown[], U extends JSX.Element>(props: {
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
}) {
  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>();
  const [contentRef, setContentRef] = createSignal<HTMLElement | undefined>();
  const [contentWidth, setContentWidth] = createSignal(0);

  // Expose handle to parent via ref prop
  createEffect(() => {
    if (props.ref) {
      props.ref({
        scrollToIndex: (index: number, behavior: ScrollBehavior = 'auto') => {
          const container = containerRef();
          if (container) {
            const scrollTop = index * props.rowHeight;
            container.scrollTo({ top: scrollTop, behavior });
          }
        },
      });
    }
  });

  const [virtual, onScroll] = useVirtualList({
    get items() {
      return props.items;
    },
    rootHeight: () => props.rootHeight,
    get rowHeight() {
      return props.rowHeight;
    },
    get overscanCount() {
      return props.overscanCount || 2;
    },
    get setScrollPosition() {
      return props.setScrollPosition;
    },
  });

  // Passive scroll listener
  createEffect(() => {
    const el = containerRef();
    if (!el) return;

    el.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => el.removeEventListener('scroll', onScroll));
  });

  let resizeObserver: ResizeObserver | undefined;

  onMount(() => {
    const el = contentRef();
    if (!el) return;

    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const newWidth = entry.target.scrollWidth;
        if (newWidth !== contentWidth()) {
          setContentWidth(newWidth);
        }
      }
    });
    resizeObserver.observe(el);
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
  });

  const containerPadding = () => props.containerPadding ?? 4;
  const containerWidth = () => {
    if (props.containerWidth) {
      if (typeof props.containerWidth === 'number') return `${props.containerWidth}px`;
      if (typeof props.containerWidth === 'string') return props.containerWidth;
    }
    return `${contentWidth() + containerPadding() * 2}px`;
  };

  return (
    <div
      ref={(el) => {
        setContainerRef(el);
        props.setContainerRef?.(el);
      }}
      id={props.id}
      role={props.role}
      aria-multiselectable={props['aria-multiselectable']}
      aria-label={props['aria-label']}
      style={{
        overflow: 'auto',
        height: `${virtual().containerHeight + containerPadding() * 2}px`,
        'max-height': `${props.rootHeight}px`,
        padding: `${containerPadding()}px`,
        width: containerWidth(),
        'box-sizing': 'border-box',
        'min-width': props.minWidth ? `${props.minWidth}px` : undefined,
        'will-change': 'scroll-position',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: `${virtual().containerHeight}px`,
          width: '100%',
        }}
      >
        <div
          ref={setContentRef}
          style={{
            position: 'absolute',
            top: `${virtual().viewerTop}px`,
            width: props.containerWidth ? containerWidth() : 'auto',
            'min-width': props.minWidth
              ? `${props.minWidth - containerPadding() * 2}px`
              : undefined,
            contain: 'content',
          }}
        >
          <For each={virtual().visibleItems} fallback={props.fallback}>
            {(item, i) => (
              <div
                class={props.rowClass}
                style={{
                  height: `${props.rowHeight}px`,
                  overflow: 'hidden',
                }}
              >
                {props.children(item, () => virtual().startIndex + i())}
              </div>
            )}
          </For>
          {props.loading}
        </div>
      </div>
    </div>
  );
}
