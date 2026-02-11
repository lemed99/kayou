import { For, JSX, Show } from 'solid-js';

import {
  ChevronDownIcon,
  ChevronSelectorVerticalIcon,
  ChevronUpIcon,
  InfoCircleIcon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';
import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableHeader(): JSX.Element {
  const ctx = useDataTableInternal();

  const getSortEntry = (key: string) => ctx.sorts().find((s) => s.key === key);

  const getSortIndex = (key: string) => ctx.sorts().findIndex((s) => s.key === key);

  const getAriaSortValue = (
    key: string,
  ): 'ascending' | 'descending' | 'none' | undefined => {
    if (!ctx.sortableColumns().has(key)) return undefined;
    const entry = getSortEntry(key);
    if (entry) {
      return entry.direction === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  };

  return (
    <div role="rowgroup">
      <div
        ref={ctx.setHeaderRef}
        role="row"
        class={twMerge(
          'grid w-fit border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400',
          !ctx.searchBar &&
            !ctx.filters &&
            !ctx.configureColumns &&
            !(ctx.rowSelection && ctx.selectedRows().size > 0)
            ? 'rounded-t-lg'
            : '',
        )}
        style={{
          'grid-template-columns': ctx.rowGridStyle(),
        }}
      >
        <Show when={ctx.rowSelection}>
          <div role="columnheader" class="flex items-center py-3 pl-6">
            <Checkbox
              checked={ctx.allSelected()}
              onChange={ctx.toggleSelectAll}
              aria-label="Select all rows"
            />
          </div>
        </Show>

        <For each={ctx.columns()}>
          {(column) => {
            const isSortable = () => ctx.sortableColumns().has(column.key);
            const isActiveSort = () => !!getSortEntry(column.key);
            const sortDirection = () => getSortEntry(column.key)?.direction;
            const isMultiSort = () => ctx.sorts().length > 1;
            const sortPriority = () => getSortIndex(column.key) + 1;

            const sortTooltip = () => {
              if (!isActiveSort()) return ctx.labels().sortAscending;
              if (sortDirection() === 'asc') return ctx.labels().sortDescending;
              return ctx.labels().clearSort;
            };

            return (
              <div
                role="columnheader"
                aria-sort={getAriaSortValue(column.key)}
                class="flex items-center gap-1 whitespace-nowrap px-6 py-3"
                title={!isSortable() ? column.tooltip || column.label : undefined}
              >
                <Show
                  when={isSortable()}
                  fallback={
                    <>
                      <span>{column.label}</span>
                      <Show when={column.tooltip}>
                        <Tooltip
                          content={column.tooltip}
                          theme="auto"
                          placement="top"
                          class="capitalize"
                        >
                          <InfoCircleIcon aria-hidden="true" />
                        </Tooltip>
                      </Show>
                    </>
                  }
                >
                  <Tooltip content={sortTooltip()} theme="auto" placement="top">
                    <button
                      type="button"
                      class="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      onClick={() => ctx.onSortClick(column.key)}
                      aria-label={`${column.label}, ${sortTooltip()}`}
                    >
                      <span>{column.label}</span>
                      <Show when={isActiveSort() && sortDirection() === 'asc'}>
                        <ChevronUpIcon
                          class="size-3.5 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                      </Show>
                      <Show when={isActiveSort() && sortDirection() === 'desc'}>
                        <ChevronDownIcon
                          class="size-3.5 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                      </Show>
                      <Show when={!isActiveSort()}>
                        <ChevronSelectorVerticalIcon
                          class="size-3.5 text-gray-400 dark:text-neutral-500"
                          aria-hidden="true"
                        />
                      </Show>
                    </button>
                  </Tooltip>
                  <Show when={isActiveSort() && isMultiSort()}>
                    <span
                      class="ml-0.5 flex size-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      aria-label={`${ctx.labels().sortPriority} ${sortPriority()}`}
                      data-sort-priority={sortPriority()}
                    >
                      {sortPriority()}
                    </span>
                  </Show>
                  <Show when={column.tooltip}>
                    <Tooltip
                      content={column.tooltip}
                      theme="auto"
                      placement="top"
                      class="capitalize"
                    >
                      <InfoCircleIcon aria-hidden="true" />
                    </Tooltip>
                  </Show>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
