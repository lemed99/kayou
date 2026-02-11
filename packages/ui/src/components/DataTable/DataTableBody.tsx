import { Accessor, For, JSX, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { twMerge } from 'tailwind-merge';

import { DynamicVirtualList } from '../DynamicVirtualList';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';
import { VirtualList } from '../VirtualList';
import { useDataTableInternal } from './DataTableInternalContext';
import { DataTableRow } from './DataTableRow';

/** Border-bottom adds 1px per row; account for it in virtualized height. */
const BORDER_WIDTH = 1;

export function DataTableBody<T extends Record<string, unknown>>(): JSX.Element {
  const ctx = useDataTableInternal<T>();

  const NoItemsComponent = () => (
    <div class="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
      {ctx.labels().noData}
    </div>
  );

  const LoadingMoreSpinner = () => (
    <Show when={ctx.isLoadingMore}>
      <div class="flex items-center justify-center py-3">
        <Spinner color="gray" size="sm" />
      </div>
    </Show>
  );

  const VirtualizedList = () => (
    <Dynamic
      component={ctx.rowHeight ? VirtualList : DynamicVirtualList}
      items={() => ctx.filteredData() as unknown as readonly unknown[]}
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
      rowClass="border-b border-gray-200 last:border-b-0 dark:border-neutral-800"
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
                class={twMerge('grid bg-white dark:bg-neutral-900')}
                style={{
                  'grid-template-columns': ctx.rowGridStyle(),
                }}
              >
                <Show when={ctx.rowSelection}>
                  <div class="flex items-center pl-6">
                    <Skeleton width={16} height={16} />
                  </div>
                </Show>
                <For each={ctx.columns()}>
                  {() => (
                    <div class="px-6 py-5">
                      <Skeleton width={100} height={10} />
                    </div>
                  )}
                </For>
              </div>
            </Show>
            <Show when={ctx.error}>
              <div
                role="alert"
                class="whitespace-nowrap px-6 py-4 text-center font-medium text-red-600 dark:text-red-400"
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
          <For each={ctx.filteredData()} fallback={<NoItemsComponent />}>
            {(row, index) => <DataTableRow row={row} index={index} />}
          </For>
        </Show>
      </Show>
    </div>
  );
}
