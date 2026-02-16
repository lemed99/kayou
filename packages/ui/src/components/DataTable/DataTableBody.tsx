import {
  Accessor,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { twMerge } from 'tailwind-merge';

import { DynamicVirtualList } from '../DynamicVirtualList';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';
import { VirtualList } from '../VirtualList';
import { DataTableContextMenu } from './DataTableContextMenu';
import { useDataTableInternal } from './DataTableInternalContext';
import { DataTableRow } from './DataTableRow';

/** Border-bottom adds 1px per row; account for it in virtualized height. */
const BORDER_WIDTH = 1;

/**
 * Renders the locked row pinned to the top or bottom of the virtual scroll
 * container. The overlay lives OUTSIDE the scroll container (as a sibling in
 * the `position: relative` rowgroup), so CSS `top: 0` / `bottom: 0` keeps it
 * glued to the viewport edge without per-frame pixel updates — no jitter.
 */
function LockedRowOverlay<T extends Record<string, unknown>>(): JSX.Element {
  const ctx = useDataTableInternal<T>();
  const [pinPosition, setPinPosition] = createSignal<'top' | 'bottom' | null>(null);

  const lockedRowInfo = createMemo(() => {
    const key = ctx.lockedRowKey();
    if (!key) return null;
    const data = ctx.visibleData();
    for (let i = 0; i < data.length; i++) {
      if (ctx.getRowKey(data[i], i) === key) {
        return { row: data[i], index: i };
      }
    }
    return null;
  });

  // Estimated position — only used when the row is unmounted by the virtualizer
  const getNaturalY = (index: number): number => {
    if (ctx.rowHeight) return index * (ctx.rowHeight + BORDER_WIDTH);
    return index * ((ctx.estimatedRowHeight ?? 56) + BORDER_WIDTH);
  };

  const computePin = () => {
    const container = ctx.virtualContainerRef();
    const info = lockedRowInfo();
    if (!container || !info) {
      setPinPosition(null);
      return;
    }

    // Try to find the natural row in the virtualizer's DOM
    const rowEl = container.querySelector<HTMLElement>(
      `[data-row-index="${info.index}"]`,
    );

    if (rowEl) {
      const cRect = container.getBoundingClientRect();
      const rRect = rowEl.getBoundingClientRect();

      if (rRect.top >= cRect.top && rRect.bottom <= cRect.bottom) {
        setPinPosition(null); // fully visible
      } else if (rRect.top < cRect.top) {
        setPinPosition('top');
      } else {
        setPinPosition('bottom');
      }
    } else {
      // Unmounted — estimate direction
      setPinPosition(getNaturalY(info.index) < container.scrollTop ? 'top' : 'bottom');
    }
  };

  createEffect(() => {
    const container = ctx.virtualContainerRef();
    if (!container || !ctx.rowLocking) return;

    container.addEventListener('scroll', computePin, { passive: true });
    computePin();

    onCleanup(() => container.removeEventListener('scroll', computePin));
  });

  createEffect(() => {
    ctx.lockedRowKey(); // track
    computePin();
  });

  return (
    <Show when={lockedRowInfo() && pinPosition() !== null}>
      <div
        data-locked-overlay
        class="pointer-events-none absolute left-0 z-20 shadow-md"
        style={{
          top: pinPosition() === 'top' ? '0' : undefined,
          bottom: pinPosition() === 'bottom' ? '0' : undefined,
          width: ctx.rowWidth() > 0 ? `${ctx.rowWidth()}px` : undefined,
        }}
        role="presentation"
        aria-hidden="true"
      >
        <DataTableRow row={lockedRowInfo()!.row} index={() => lockedRowInfo()!.index} />
      </div>
    </Show>
  );
}

export function DataTableBody<T extends Record<string, unknown>>(): JSX.Element {
  const ctx = useDataTableInternal<T>();

  const NoItemsComponent = () => (
    <Show
      when={ctx.emptyState}
      fallback={
        <div class="px-6 py-4 text-center font-medium text-neutral-900 dark:text-white">
          {ctx.labels().noData}
        </div>
      }
    >
      {ctx.emptyState}
    </Show>
  );

  const LoadingMoreSpinner = () => (
    <Show when={ctx.isLoadingMore}>
      <div class="flex items-center justify-center py-3">
        <Spinner color="info" size="sm" />
      </div>
    </Show>
  );

  const VirtualizedList = () => (
    <Dynamic
      component={ctx.rowHeight && !ctx.expandRow ? VirtualList : DynamicVirtualList}
      items={() => ctx.visibleData() as unknown as readonly unknown[]}
      rootHeight={ctx.expandedHeight()}
      rowHeight={ctx.rowHeight ? ctx.rowHeight + BORDER_WIDTH : undefined!}
      estimatedRowHeight={
        ctx.estimatedRowHeight ? ctx.estimatedRowHeight + BORDER_WIDTH : undefined!
      }
      containerWidth="100%"
      containerPadding={0}
      fallback={<NoItemsComponent />}
      setContainerRef={ctx.setVirtualContainerRef}
      loading={<LoadingMoreSpinner />}
      rowClass="border-b border-neutral-200 last:border-b-0 dark:border-neutral-800"
    >
      {(item: unknown, index: Accessor<number>) => (
        <DataTableRow row={item as T} index={index} />
      )}
    </Dynamic>
  );

  return (
    <div
      role="rowgroup"
      aria-busy={ctx.loading || ctx.validating}
      class="relative flex flex-col"
      style={{ width: ctx.rowWidth() > 0 ? `${ctx.rowWidth()}px` : undefined }}
    >
      <Show
        when={!ctx.loading && !ctx.error}
        fallback={
          <div>
            <Show when={ctx.loading}>
              <div
                role="status"
                aria-live="polite"
                aria-label={ctx.ariaLabels().loadingData}
              >
                <div
                  role="row"
                  class={twMerge('grid bg-white dark:bg-neutral-900')}
                  style={{
                    'grid-template-columns': ctx.rowGridStyle(),
                  }}
                >
                  <Show when={ctx.rowSelection}>
                    <div role="cell" class="flex items-center pl-6">
                      <Skeleton width={16} height={16} />
                    </div>
                  </Show>
                  <For each={ctx.columns()}>
                    {() => (
                      <div role="cell" class="px-6 py-5">
                        <Skeleton width={100} height={10} />
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
            <Show when={ctx.error}>
              <div
                role="alert"
                class="px-6 py-4 text-center font-medium text-red-600 dark:text-red-400"
              >
                {ctx.labels().error}
              </div>
            </Show>
          </div>
        }
      >
        <Show when={ctx.validating}>
          <div
            role="status"
            aria-live="polite"
            aria-label={ctx.ariaLabels().refreshingData}
            class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/60 dark:bg-neutral-900/60"
          >
            <Spinner />
          </div>
        </Show>
        <Show when={ctx.useVirtualization()}>
          <VirtualizedList />
        </Show>
        <Show when={!ctx.useVirtualization()}>
          <For each={ctx.visibleData()} fallback={<NoItemsComponent />}>
            {(row, index) => <DataTableRow row={row} index={index} />}
          </For>
        </Show>
      </Show>
      <Show when={ctx.rowContextMenu}>
        <DataTableContextMenu />
      </Show>
      <Show when={ctx.rowLocking && ctx.useVirtualization()}>
        <LockedRowOverlay />
      </Show>
    </div>
  );
}
