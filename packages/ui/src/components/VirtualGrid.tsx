import {
  For,
  JSX,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';

/**
 * Props for the VirtualGrid component.
 * @template T - The type of items in the data array.
 */
export interface VirtualGridProps<T> {
  /** Array of data items to render in the grid. */
  data: T[];
  /** Height of the scrollable container in pixels. */
  rootHeight: number;
  /** Height of each grid item in pixels. */
  itemHeight: number;
  /** Number of rows to render outside the visible area for smoother scrolling. Defaults to 2. */
  overscanRows?: number;
  /** Gap between grid items in pixels. Defaults to 0. */
  gap?: number;
  /** CSS class for the grid container (should define grid-template-columns). */
  class?: string;
  /** Accessible label describing the grid content. */
  'aria-label'?: string;
  /** ID of an element that labels the grid. */
  'aria-labelledby'?: string;
  /** Render function for each grid item. */
  children: (item: T, index: number) => JSX.Element;
}

/**
 * A virtualized grid component that efficiently renders large datasets.
 * Only renders visible items plus overscan rows for smooth scrolling.
 *
 * @template T - The type of items in the data array.
 * @param props - Component props.
 * @returns A virtualized grid element.
 *
 * @example
 * ```tsx
 * <VirtualGrid
 *   data={items}
 *   rootHeight={400}
 *   itemHeight={60}
 *   gap={16}
 *   class="grid grid-cols-3"
 *   aria-label="Product catalog"
 * >
 *   {(item, index) => <ProductCard product={item} />}
 * </VirtualGrid>
 * ```
 */
export function VirtualGrid<T>(props: VirtualGridProps<T>): JSX.Element {
  const gridId = createUniqueId();
  const [scrollTop, setScrollTop] = createSignal(0);
  const [columns, setColumns] = createSignal(1);
  const [scrollContainerEl, setScrollContainerEl] = createSignal<HTMLDivElement | null>(
    null,
  );
  const [gridEl, setGridEl] = createSignal<HTMLElement | null>(null);
  const [focusedIndex, setFocusedIndex] = createSignal(-1);

  const gap = createMemo(() => props.gap ?? 0);

  const updateColumns = (grid: HTMLElement): void => {
    const style = window.getComputedStyle(grid);
    const cols = style
      .getPropertyValue('grid-template-columns')
      .split(' ')
      .filter(Boolean).length;
    setColumns(Math.max(cols, 1));
  };

  // Column detection via ResizeObserver — no extra RAF, observer fires after layout
  createEffect(() => {
    const el = gridEl();
    if (!el) return;

    updateColumns(el);

    const observer = new ResizeObserver(() => updateColumns(el));
    observer.observe(el);

    onCleanup(() => observer.disconnect());
  });

  // Passive, RAF-throttled scroll listener
  createEffect(() => {
    const el = scrollContainerEl();
    if (!el) return;

    let rafId: number | undefined;
    const handler = () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollTop(el.scrollTop);
        rafId = undefined;
      });
    };

    el.addEventListener('scroll', handler, { passive: true });

    onCleanup(() => {
      el.removeEventListener('scroll', handler);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    });
  });

  const rowHeight = createMemo(() => props.itemHeight + gap());
  const rowCount = createMemo(() => {
    if (props.data.length === 0) return 0;
    return Math.ceil(props.data.length / columns());
  });

  const visibleRange = createMemo(() => {
    if (props.data.length === 0) {
      return { start: 0, end: 0 };
    }

    const overscan = props.overscanRows ?? 2;
    const rh = rowHeight();
    const startRow = Math.floor(scrollTop() / rh);
    const visibleRows = Math.ceil(props.rootHeight / rh) + 1;
    const endRow = Math.min(rowCount(), startRow + visibleRows + overscan);

    return {
      start: Math.max(0, startRow - overscan),
      end: endRow,
    };
  });

  const visibleItems = createMemo(() => {
    if (props.data.length === 0) return [];
    const { start, end } = visibleRange();
    const cols = columns();
    return props.data.slice(start * cols, Math.min(props.data.length, end * cols));
  });

  const totalHeight = createMemo(() => {
    const rows = rowCount();
    if (rows === 0) return 0;
    return rows * props.itemHeight + (rows - 1) * gap();
  });

  const offsetTop = createMemo(() => {
    const start = visibleRange().start;
    return start * props.itemHeight + start * gap();
  });

  /**
   * Get the actual data index from visible item index.
   */
  const getDataIndex = (visibleIndex: number): number => {
    return visibleRange().start * columns() + visibleIndex;
  };

  /**
   * ID of the currently focused cell for aria-activedescendant.
   */
  const focusedCellId = createMemo(() => {
    const idx = focusedIndex();
    return idx >= 0 ? `${gridId}-cell-${idx}` : undefined;
  });

  /**
   * Scroll to ensure a specific data index is visible.
   */
  const scrollToIndex = (index: number): void => {
    const el = scrollContainerEl();
    if (!el || index < 0 || index >= props.data.length) return;

    const row = Math.floor(index / columns());
    const rowTop = row * rowHeight();
    const rowBottom = rowTop + props.itemHeight;

    const viewTop = el.scrollTop;
    const viewBottom = viewTop + props.rootHeight;

    if (rowTop < viewTop) {
      el.scrollTop = rowTop;
    } else if (rowBottom > viewBottom) {
      el.scrollTop = rowBottom - props.rootHeight;
    }
  };

  /**
   * Handle keyboard navigation for grid.
   */
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (props.data.length === 0) return;

    const current = focusedIndex();
    const cols = columns();
    const total = props.data.length;
    let next = current;

    switch (e.key) {
      case 'ArrowRight':
        next = Math.min(total - 1, current + 1);
        break;
      case 'ArrowLeft':
        next = Math.max(0, current - 1);
        break;
      case 'ArrowDown':
        next = Math.min(total - 1, current + cols);
        break;
      case 'ArrowUp':
        next = Math.max(0, current - cols);
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          next = 0;
        } else {
          // Go to start of current row
          next = Math.floor(current / cols) * cols;
        }
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          next = total - 1;
        } else {
          // Go to end of current row
          next = Math.min(total - 1, Math.floor(current / cols) * cols + cols - 1);
        }
        break;
      case 'PageDown': {
        const visibleRows = Math.floor(props.rootHeight / rowHeight());
        next = Math.min(total - 1, current + visibleRows * cols);
        break;
      }
      case 'PageUp': {
        const visibleRows = Math.floor(props.rootHeight / rowHeight());
        next = Math.max(0, current - visibleRows * cols);
        break;
      }
      default:
        return;
    }

    if (next !== current) {
      e.preventDefault();
      setFocusedIndex(next);
      scrollToIndex(next);
    }
  };

  /**
   * Handle focus entering the grid.
   */
  const handleFocus = (): void => {
    if (focusedIndex() === -1 && props.data.length > 0) {
      setFocusedIndex(0);
    }
  };

  return (
    <div
      ref={setScrollContainerEl}
      role="grid"
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      aria-rowcount={rowCount()}
      aria-colcount={columns()}
      aria-activedescendant={focusedCellId()}
      tabindex={0}
      style={{
        height: `${props.rootHeight}px`,
        overflow: 'auto',
        position: 'relative',
        'will-change': 'scroll-position',
      }}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <div style={{ height: `${totalHeight()}px`, position: 'relative' }}>
        <div
          ref={setGridEl}
          class={props.class}
          style={{
            gap: `${gap()}px`,
            position: 'absolute',
            top: `${offsetTop()}px`,
            left: 0,
            right: 0,
            width: '100%',
            contain: 'content',
          }}
        >
          <For each={visibleItems()}>
            {(item, i) => {
              const dataIndex = createMemo(() => getDataIndex(i()));
              const rowIndex = createMemo(() => Math.floor(dataIndex() / columns()) + 1);
              const colIndex = createMemo(() => (dataIndex() % columns()) + 1);

              return (
                <div
                  id={`${gridId}-cell-${dataIndex()}`}
                  role="gridcell"
                  aria-rowindex={rowIndex()}
                  aria-colindex={colIndex()}
                  data-focused={focusedIndex() === dataIndex() ? '' : undefined}
                  style={{ height: `${props.itemHeight}px` }}
                  onClick={() => setFocusedIndex(dataIndex())}
                >
                  {props.children(item, dataIndex())}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
