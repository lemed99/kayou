import { Accessor, JSX, Show, createMemo } from 'solid-js';

import { Columns03Icon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import { MultiSelect } from '../Select';
import { DataTableConfigs } from './DataTableConfigs';
import { DataTableFilters } from './DataTableFilters';
import { useDataTableInternal } from './DataTableInternalContext';
import { FilterConfig, FilterOperator, FilterState, FilterValue } from './types';

interface DataTableToolbarProps<T> {
  hasFilters: Accessor<boolean>;
  filterConfigs?: FilterConfig<T>[];
  filterHook: {
    activeFilters: Accessor<FilterState>;
    setFilter: (key: string, operator: FilterOperator, value: FilterValue) => void;
    removeFilter: (key: string) => void;
    clearFilters: () => void;
    replaceAllFilters: (filters: FilterState) => void;
    getOperators: (key: string) => FilterOperator[];
  };
}

export function DataTableToolbar<T extends Record<string, unknown>>(
  props: DataTableToolbarProps<T>,
): JSX.Element {
  const ctx = useDataTableInternal<T>();

  const hasToolbar = createMemo(
    () =>
      props.hasFilters() ||
      !!ctx.configureColumns ||
      (ctx.configEnabled && (ctx.hasConfigs() || ctx.isDirty())),
  );

  return (
    <Show when={hasToolbar()}>
      <div
        class={twMerge(
          'flex shrink-0 items-center justify-between gap-2 border-b border-neutral-200 px-6 py-2 dark:border-neutral-800',
          !ctx.searchBar ? 'rounded-t-lg' : '',
        )}
      >
        {/* Left: Filters */}
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <Show when={props.hasFilters()}>
            <DataTableFilters
              filterConfigs={props.filterConfigs!}
              activeFilters={props.filterHook.activeFilters}
              setFilter={props.filterHook.setFilter}
              removeFilter={props.filterHook.removeFilter}
              clearFilters={props.filterHook.clearFilters}
              replaceAllFilters={props.filterHook.replaceAllFilters}
              getOperators={props.filterHook.getOperators}
              filterButtonText={ctx.labels().filter}
              addFilterText={ctx.labels().addFilter}
              resetText={ctx.labels().resetFilter}
              applyText={ctx.labels().applyFilter}
              noFiltersText={ctx.labels().noFilters}
              showChips
            />
          </Show>
        </div>

        {/* Right: Configs + Columns */}
        <div class="flex shrink-0 items-center gap-2">
          <DataTableConfigs />
          <Show when={ctx.configureColumns}>
            <MultiSelect
              sizing="sm"
              options={ctx.allColumns.map((c) => ({
                label: c.label,
                value: c.key,
                disabled: ctx.columns().length === 1 && ctx.columns()[0].key === c.key,
              }))}
              onMultiSelect={(options) => {
                ctx.setColumns(
                  ctx.allColumns.filter((c) =>
                    options?.map((o) => o.value).includes(c.key),
                  ),
                );
              }}
              values={ctx.columns().map((c) => c.key)}
              displayValue={ctx.labels().columns}
              icon={() => <Columns03Icon class="size-5" />}
              fitContent={true}
            />
          </Show>
        </div>
      </div>
    </Show>
  );
}
