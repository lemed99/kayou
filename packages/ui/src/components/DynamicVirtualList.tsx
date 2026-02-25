import { Accessor, For, JSX, createEffect, createSignal, on, onCleanup } from 'solid-js';

import { useDynamicVirtualList } from '@kayou/hooks';

export type DynamicVirtualListHandle = {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};

export function DynamicVirtualList<
  T extends readonly unknown[],
  U extends JSX.Element,
>(props: {
  items: Accessor<T>;
  rootHeight: number;
  estimatedRowHeight: number;
  overscanCount?: number;
  children: (item: T[number], index: Accessor<number>) => U;
  setContainerRef?: (el: HTMLElement) => void;
  containerWidth?: string | number;
  containerPadding?: number;
  loading?: JSX.Element;
  setScrollPosition?: (scrollTop: number) => void;
  fallback?: JSX.Element;
  rowClass?: string;
  setAverageRowHeight?: (height: number) => void;
  id?: string;
  role?: JSX.HTMLAttributes<HTMLDivElement>['role'];
  /** Role for each row item (e.g., 'option' for listbox, 'row' for grid) */
  rowRole?: JSX.HTMLAttributes<HTMLDivElement>['role'];
  'aria-multiselectable'?: boolean;
  'aria-label'?: string;
  'aria-activedescendant'?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  ref?: (handle: DynamicVirtualListHandle) => void;
}) {
  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>();
  const [contentRef, setContentRef] = createSignal<HTMLElement | undefined>();
  const [contentWidth, setContentWidth] = createSignal(0);
  const [contentHeight, setContentHeight] = createSignal(0);

  const [virtual, onScroll, registerSize, scrollToIndex] = useDynamicVirtualList({
    get items() {
      return props.items;
    },
    rootHeight: () => props.rootHeight,
    get estimatedRowHeight() {
      return props.estimatedRowHeight;
    },
    get overscanCount() {
      return props.overscanCount ?? 2;
    },
    get setScrollPosition() {
      return props.setScrollPosition;
    },
    get setAverageRowHeight() {
      return props.setAverageRowHeight;
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

  // Set up ResizeObserver when contentRef changes
  createEffect(
    on(contentRef, (el) => {
      // Cleanup previous observer
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = undefined;
      }

      if (!el) return;

      // Set initial dimensions immediately (ResizeObserver doesn't fire on initial observe in all browsers)
      setContentWidth(el.clientWidth);
      setContentHeight(el.clientHeight);

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          // Defer to break the synchronous ResizeObserver → layout → ResizeObserver loop.
          // SolidJS signals skip notification if the value hasn't changed.
          requestAnimationFrame(() => {
            setContentWidth(entry.target.clientWidth);
            setContentHeight(entry.target.clientHeight);
          });
        }
      });
      resizeObserver.observe(el);
    }),
  );

  onCleanup(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  const containerPadding = () => props.containerPadding ?? 4;

  // Use the larger of measured content height or calculated virtual height
  // This prevents UI breaks when estimatedRowHeight doesn't match actual row heights
  const effectiveHeight = () => Math.max(contentHeight(), virtual().containerHeight);

  const containerWidth = (): string => {
    if (props.containerWidth !== undefined) {
      if (typeof props.containerWidth === 'number') {
        return `${props.containerWidth}px`;
      }
      if (typeof props.containerWidth === 'string' && props.containerWidth !== '') {
        return props.containerWidth;
      }
    }
    return `${contentWidth() + containerPadding() * 2}px`;
  };

  const handleContainerRef = (el: HTMLElement) => {
    setContainerRef(el);
    props.setContainerRef?.(el);
  };

  // Expose imperative handle
  createEffect(() => {
    const container = containerRef();
    if (props.ref && container) {
      props.ref({
        scrollToIndex: (index: number, scrollBehavior: ScrollBehavior = 'auto') => {
          const result = scrollToIndex(index, scrollBehavior) as {
            scrollTop: number;
            behavior: ScrollBehavior;
          };
          container.scrollTo({ top: result.scrollTop, behavior: result.behavior });
        },
      });
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    props.onKeyDown?.(e);

    // Only handle keyboard navigation if we have a role that expects it
    if (!props.role || e.defaultPrevented) return;

    const container = containerRef();
    if (!container) return;

    const itemCount = props.items().length;
    if (itemCount === 0) return;

    let targetIndex: number | undefined;

    switch (e.key) {
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = itemCount - 1;
        break;
      case 'PageUp': {
        const visibleCount = Math.floor(props.rootHeight / props.estimatedRowHeight);
        const currentIndex = Math.floor(container.scrollTop / props.estimatedRowHeight);
        targetIndex = Math.max(0, currentIndex - visibleCount);
        break;
      }
      case 'PageDown': {
        const visibleCount = Math.floor(props.rootHeight / props.estimatedRowHeight);
        const currentIndex = Math.floor(container.scrollTop / props.estimatedRowHeight);
        targetIndex = Math.min(itemCount - 1, currentIndex + visibleCount);
        break;
      }
    }

    if (targetIndex !== undefined) {
      e.preventDefault();
      const { scrollTop } = scrollToIndex(targetIndex) as { scrollTop: number };
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={(el) => handleContainerRef(el)}
      id={props.id}
      role={props.role}
      aria-multiselectable={props['aria-multiselectable']}
      aria-label={props['aria-label']}
      aria-activedescendant={props['aria-activedescendant']}
      aria-rowcount={props.role ? virtual().totalItems : undefined}
      tabIndex={props.role ? 0 : undefined}
      style={{
        overflow: 'auto',
        height: `${effectiveHeight() + containerPadding() * 2}px`,
        'max-height': `${props.rootHeight}px`,
        padding: `${containerPadding()}px`,
        width: containerWidth(),
        'box-sizing': 'border-box',
        'will-change': 'scroll-position',
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          position: 'relative',
          height: `${effectiveHeight()}px`,
          width: '100%',
        }}
      >
        <div
          ref={setContentRef}
          style={{
            position: 'absolute',
            top: `${virtual().viewerTop}px`,
            width: props.containerWidth ? containerWidth() : 'auto',
            contain: 'content',
          }}
        >
          <For each={virtual().visibleItems} fallback={props.fallback}>
            {(item, i) => {
              const itemIndex = () => virtual().startIndex + i();
              return (
                <div
                  ref={(el) => registerSize(itemIndex, el)}
                  class={props.rowClass}
                  role={props.rowRole}
                  aria-setsize={props.rowRole ? virtual().totalItems : undefined}
                  aria-posinset={props.rowRole ? itemIndex() + 1 : undefined}
                >
                  {props.children(item, itemIndex)}
                </div>
              );
            }}
          </For>
          {props.loading}
        </div>
      </div>
    </div>
  );
}
