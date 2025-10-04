import { For, JSX, Show, createEffect, createMemo, createSignal } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import {
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  XMarkIcon,
} from '../icons';
import Button from './Button';
import Checkbox from './Checkbox';
import MultiSelect from './MultiSelect';
import Pagination from './Pagination';
import Select from './Select';
import Spinner from './Spinner';
import Tooltip from './Tooltip';

// Types
interface DataTableProps<T> {
  data: T[];
  loading: boolean;
  defaultColumns: string[];
  columns: DataTableColumnProps<T>[];
  pageTotal?: number;
  rowSelection?: boolean;
  error: unknown;
  onPageChange?: (page: number) => void;
  searchBar?: boolean;
  configureColumns?: boolean;
  expandable?: boolean;
  filters?: JSX.Element;
  itemsTotal?: number;
  perPageControl?: boolean;
}

interface DataTableColumnProps<T> {
  label: string;
  key: string;
  render?: (value?: unknown, record?: T, index?: number) => JSX.Element;
  width: number;
  tooltip?: string;
}

// DataTable Component
export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  const [searchKey, setSearchKey] = createSignal('');
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = createSignal(1);
  const [perPage, setPerPage] = createSignal(10);
  const [columns, setColumns] = createSignal<DataTableColumnProps<T>[]>([]);
  const [searchRef, setSearchRef] = createSignal<HTMLInputElement | undefined>();
  const [sortConfig, setSortConfig] = createSignal<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const allSelected = createMemo(() => {
    if (props.data.length === 0) return false;
    return props.data.every((_, idx) => selectedRows().has(idx));
  });

  createEffect(() => {
    setColumns(props.columns.filter((c) => props.defaultColumns.includes(c.key)));
  });

  const someSelected = createMemo(() => {
    return selectedRows().size > 0 && !allSelected();
  });

  const toggleSelectAll = () => {
    if (allSelected()) {
      setSelectedRows(new Set<number>());
    } else {
      setSelectedRows(new Set(props.data.map((_, idx) => idx)));
    }
  };

  const toggleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows());
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange?.(page);
  };

  const filteredData = createMemo(() => {
    const filtered = [...props.data];

    // if (searchQuery()) {
    //   const query = searchQuery().toLowerCase();
    //   filtered = filtered.filter((item) =>
    //     Object.values(item).some((value) => String(value).toLowerCase().includes(query)),
    //   );
    // }

    return filtered;
  });

  const sharedPurcentage = () => {
    const allColumnsPurcentage = props.columns.reduce((acc, v) => acc + v.width, 0);
    const displayedColumnsPurcentage = columns().reduce((acc, v) => acc + v.width, 0);
    return (allColumnsPurcentage - displayedColumnsPurcentage) / columns().length;
  };

  const rowGridStyle = () => {
    return `${props.rowSelection ? '40px ' : ''}${columns()
      .map((col, i) =>
        i === 0
          ? `calc(${col.width + sharedPurcentage()}% - ${props.rowSelection ? 40 : 0}px)`
          : `${col.width + sharedPurcentage()}%`,
      )
      .join(' ')}`;
  };

  return (
    <div class="w-full rounded-lg border border-gray-200 bg-white">
      {/* Search and Filters Section */}
      <Show when={props.searchBar}>
        <div class="w-full border-b border-gray-200 px-6 dark:border-gray-600">
          <div class="relative flex max-w-md items-center">
            <MagnifyingGlassIcon class="size-5 text-gray-400" />
            <input
              ref={setSearchRef}
              value={searchKey()}
              onInput={(e) => setSearchKey(e.target.value)}
              placeholder="Search"
              onFocus={(e) => e.target.select()}
              class="w-full py-3 pl-2 text-sm outline-none"
            />
            <Show when={searchKey()}>
              <button
                type="button"
                onClick={() => {
                  setSearchKey('');
                  (searchRef() as HTMLElement)?.focus();
                }}
                class="absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                <XMarkIcon class="size-4" />
              </button>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={props.filters}>
        <div
          class={twMerge(
            'flex items-center justify-between border-b border-gray-200 px-6 py-2',
            !props.searchBar ? 'rounded-t-lg' : '',
          )}
        >
          <div class="flex items-center">
            <div class="flex items-center border-r border-gray-200 py-3 pr-6">
              <AdjustmentsHorizontalIcon class="mr-2 size-5" />
              <p>Filtres</p>
              <span class="ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 p-2.5 text-xs font-medium text-white dark:bg-white dark:text-gray-600">
                {2}
              </span>
            </div>
            <div />
          </div>
          <Show when={props.configureColumns || props.expandable}>
            <div class="flex items-center gap-2">
              <Show when={props.configureColumns}>
                <MultiSelect
                  sizing="sm"
                  options={props.columns.map((c) => ({ label: c.label, value: c.key }))}
                  onMultiSelect={(options) => {
                    setColumns(
                      props.columns.filter((c) =>
                        options?.map((o) => o.value).includes(c.key),
                      ),
                    );
                  }}
                  values={columns().map((c) => c.key)}
                  displayValue="Colonnes"
                  icon={MoonIcon}
                  fitContent={true}
                />
              </Show>
              <Show when={props.expandable}>
                <Button size="sm">{'<>'}</Button>
              </Show>
            </div>
          </Show>
        </div>
      </Show>

      {/* Selected Items Section */}
      <Show when={props.rowSelection && selectedRows().size > 0}>
        <div
          class={twMerge(
            'flex items-center border-b border-gray-200 px-6 py-3',
            !props.searchBar && !props.filters ? 'rounded-t-lg' : '',
          )}
        >
          <div class="flex items-center gap-3">
            <Button size="xs" color="light">
              ···
            </Button>
            <span class="text-sm font-medium text-gray-700">
              {selectedRows().size} sélectionné(s) sur {props.data.length}
            </span>
          </div>
        </div>
      </Show>

      {/* Table Container */}
      <div class="overflow-x-auto">
        <div class="min-w-full">
          {/* Table Header */}
          <div
            class={twMerge(
              'grid border-b border-gray-200 bg-gray-100 text-xs font-bold text-gray-700 uppercase dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400',
              !props.searchBar &&
                !props.filters &&
                !(props.rowSelection && selectedRows().size > 0)
                ? 'rounded-t-lg'
                : '',
            )}
            style={{
              'grid-template-columns': rowGridStyle(),
            }}
          >
            <Show when={props.rowSelection}>
              <div class="flex items-center py-3 pl-6">
                <Checkbox checked={allSelected()} onChange={toggleSelectAll} />
              </div>
            </Show>

            <For each={columns()}>
              {(column) => (
                <div
                  class="flex items-center gap-1 px-6 py-3 whitespace-nowrap"
                  title={column.tooltip || column.label}
                >
                  <span>{column.label}</span>
                  <Show when={column.tooltip}>
                    <Tooltip
                      content={column.tooltip}
                      theme="auto"
                      placement="top"
                      class="capitalize"
                    >
                      <InformationCircleIcon />
                    </Tooltip>
                  </Show>
                </div>
              )}
            </For>
          </div>

          {/* Table Body */}
          <Show
            when={!props.loading && !props.error}
            fallback={
              <div class="px-4 py-12 text-center">
                <Show when={props.loading}>
                  <div class="flex items-center justify-center">
                    <Spinner />
                  </div>
                </Show>
                <Show when={props.error}>
                  <div class="text-red-600">
                    Une erreur s'est produite lors du chargement des données
                  </div>
                </Show>
              </div>
            }
          >
            <Show
              when={filteredData().length > 0}
              fallback={
                <div class="px-4 py-12 text-center text-gray-500">
                  Aucune donnée disponible
                </div>
              }
            >
              <For each={filteredData()}>
                {(row, index) => (
                  <div
                    class={twMerge(
                      'grid border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-900',
                      selectedRows().has(index()) ? 'bg-neutral-100' : '',
                    )}
                    style={{
                      'grid-template-columns': rowGridStyle(),
                    }}
                  >
                    <Show when={props.rowSelection}>
                      <div class="flex items-center py-3 pl-6">
                        <Checkbox
                          checked={selectedRows().has(index())}
                          onChange={() => toggleSelectRow(index())}
                        />
                      </div>
                    </Show>

                    <For each={columns()}>
                      {(column) => (
                        <div class="flex max-w-xs items-center truncate px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          <Show
                            when={column.render}
                            fallback={<span>{String(row[column.key])}</span>}
                          >
                            {column.render!(row[column.key], row, index())}
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>

      {/* Table Footer */}
      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row">
        <div class="flex items-center gap-4">
          <Show when={props.perPageControl}>
            <div class="flex items-center gap-2">
              <Select
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                sizing="xs"
                value={String(perPage())}
                onSelect={(option) => setPerPage(Number(option?.value || 10))}
                fitContent={true}
              />
              <span class="text-sm whitespace-nowrap text-gray-700">
                Éléments Par Page
              </span>
            </div>
          </Show>
        </div>

        <Show when={props.pageTotal && props.pageTotal > 1}>
          <Pagination
            total={props.pageTotal!}
            page={currentPage()}
            onChange={handlePageChange}
          />
        </Show>
      </div>
    </div>
  );
}
