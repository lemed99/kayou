import { For, JSX, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

export function VirtualGrid<T>(props: {
  data: T[];
  rootHeight: number;
  itemHeight: number;
  overscanRows?: number;
  gap: number;
  class: string;
  children: (item: T, index: number) => JSX.Element;
}) {
  const [scrollTop, setScrollTop] = createSignal(0);
  const [columns, setColumns] = createSignal(1);
  const [gridEl, setGridEl] = createSignal<HTMLElement | null>(null);

  const updateColumns = (grid: HTMLElement) => {
    const style = window.getComputedStyle(grid);
    const cols = style
      .getPropertyValue('grid-template-columns')
      .split(' ')
      .filter(Boolean).length;
    setColumns(Math.max(cols, 1));
  };

  let resizeObserver: ResizeObserver | undefined;

  onMount(() => {
    if (gridEl) {
      requestAnimationFrame(() => {
        updateColumns(gridEl()!);
      });

      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => updateColumns(gridEl()!));
      });
      resizeObserver.observe(gridEl()!);
    }
  });

  onCleanup(() => resizeObserver?.disconnect());

  const rowHeight = createMemo(() => props.itemHeight + props.gap);
  const rowCount = createMemo(() => Math.ceil(props.data.length / columns()));

  const visibleRange = createMemo(() => {
    const overscan = props.overscanRows ?? 2;
    const startRow = Math.floor(scrollTop() / rowHeight());
    const visibleRows = Math.ceil(props.rootHeight / rowHeight()) + 1;
    const endRow = Math.min(rowCount(), startRow + visibleRows + overscan);

    return {
      start: Math.max(0, startRow - overscan),
      end: endRow,
    };
  });

  const visibleItems = createMemo(() => {
    const start = visibleRange().start * columns();
    const end = Math.min(props.data.length, visibleRange().end * columns());
    return props.data.slice(start, end);
  });

  const totalHeight = createMemo(
    () => rowCount() * props.itemHeight + (rowCount() - 1) * props.gap,
  );
  const offsetTop = createMemo(
    () => visibleRange().start * props.itemHeight + visibleRange().start * props.gap,
  );

  return (
    <div
      style={{
        height: `${props.rootHeight}px`,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={(e) => setScrollTop((e.target as HTMLElement).scrollTop)}
    >
      <div style={{ height: `${totalHeight()}px`, position: 'relative' }}>
        <div
          ref={setGridEl}
          class={props.class}
          style={{
            gap: `${props.gap}px`,
            position: 'absolute',
            top: `${offsetTop()}px`,
            left: 0,
            right: 0,
            width: '100%',
          }}
        >
          <For each={visibleItems()}>
            {(item, i) => {
              return (
                <div style={{ height: `${props.itemHeight}px` }}>
                  {props.children(item, visibleRange().start * columns() + i())}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
