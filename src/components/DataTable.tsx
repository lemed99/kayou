import {
  For,
  JSX,
  Match,
  ParentComponent,
  Show,
  Switch,
  createMemo,
  createSignal,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { twMerge } from 'tailwind-merge';

import { useIntl } from '../hooks/useIntl';
import Button from './Button';
import Checkbox from './Checkbox';
import Select from './Select';
import Skeleton from './Skeleton';
import Spinner from './Spinner';
import Tooltip from './Tooltip';

interface DataTableProps {
  object: any;
  loading: boolean;
  columns: DataTableColumnProps[];
  pageTotal?: number;
  rowSelection?: boolean;
  error: any;
  onPageChange?: (page: number) => void;
  requestParams?: any;
  setRequestParams?: (params: any) => void;
  filters?: boolean;
  searchBar?: boolean;
  filterComponents?: JSX.Element;
  itemsTotal?: number;
  perPageControl?: boolean;
  updateURL?: (params: any, refresh?: boolean) => void;
}

export interface DataTableColumnProps {
  label: string | JSX.Element;
  key: string;
  render?: (value?: any, record?: any, index?: number) => JSX.Element;
  tooltip?: string;
}

const DataTable: ParentComponent<DataTableProps> = (props) => {
  // Create store for selected rows
  const [selectedRows, setSelectedRows] = createStore<string[]>([]);

  // Create memoized values
  const isAllRowsSelected = createMemo(() => {
    if (!props.object?.length) return false;
    return props.object.every((obj) => selectedRows.includes(obj.id));
  });

  const isAllPagesSelected = createMemo(() => {
    return selectedRows.length === props.itemsTotal;
  });

  const [searchKey, setSearchKey] = createSignal('');
  const [isResourceLoading, setIsResourceLoading] = createSignal(false);
  const [isRowClicked, setIsRowClicked] = createSignal<string | null>(null);

  const intl = useIntl();

  // Memoize filtered object data
  const filteredData = createMemo(() => {
    if (!props.object) return [];
    return props.object;
  });

  const handleCheckboxChange = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows((prev) => prev.filter((row) => row !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSearch: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    const query = searchKey();
    props.setRequestParams?.({
      query,
      page: 1,
      orderBy: '',
      sortBy: '',
    });
    props.updateURL?.({ query, page: 1 });
  };

  const checkAllCheckbox = () => {
    if (!isAllRowsSelected()) {
      const allIds = props.object.map((obj) => obj.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Memoize table header
  const TableHeader = createMemo(() => (
    <thead class="border-b border-gray-200 bg-gray-100 text-xs text-gray-700 uppercase dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <Show when={props.rowSelection && filteredData().length > 0}>
          <th class="w-4 px-6 py-3 pr-0">
            <Checkbox
              checked={isAllRowsSelected()}
              onChange={checkAllCheckbox}
              class="cursor-pointer"
            />
          </th>
        </Show>
        <For each={props.columns}>
          {(column: DataTableColumnProps) => (
            <th class="px-6 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <span class="mr-1">{column.label}</span>
                <Show when={column.tooltip}>
                  <Tooltip
                    content={column.tooltip}
                    style="auto"
                    placement="top"
                    class="capitalize"
                  />
                </Show>
              </div>
            </th>
          )}
        </For>
      </tr>
    </thead>
  ));

  return (
    <div>
      <Show when={props.rowSelection && selectedRows.length > 0}>
        <div class="mb-3 flex w-full items-center justify-between gap-4 overflow-x-auto rounded-lg border bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center gap-2">
            <div class="whitespace-nowrap italic">
              {selectedRows.length}/{props.itemsTotal}{' '}
              {intl.formatMessage({
                defaultMessage: 'élément',
                id: 'gwTfZa',
              })}
              {selectedRows.length > 1 ? 's' : ''}{' '}
              {intl.formatMessage({
                defaultMessage: 'sélectionné',
                id: 'sZgvcT',
              })}
              {selectedRows.length > 1 ? 's' : ''}
            </div>
            <Show when={props.pageTotal > 1}>
              <Button
                onClick={() => setIsAllPagesSelected(true)}
                color="gray"
                size="xs"
                disabled={
                  isAllPagesSelected === null || selectedRows.length == props.itemsTotal
                }
                class="whitespace-nowrap"
              >
                <Show when={isResourceLoading} fallback={'Tout sélectionner'}>
                  <Spinner size="xs" />
                </Show>
              </Button>
            </Show>
          </div>
        </div>
      </Show>

      <div class="rounded-t-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div class="scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-400 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500 relative overflow-x-auto overflow-y-hidden rounded-t-lg">
          <table class="w-full text-left text-sm">
            {TableHeader()}

            <tbody>
              <Switch>
                <Match when={props.loading || !props.object}>
                  <For each={Array(2)}>
                    {() => (
                      <tr class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <For each={props.columns}>
                          {() => (
                            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                              <Skeleton width={100} height={10} />
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </Match>
                <Match when={props.error && !props.loading}>
                  <tr class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td
                      class="px-6 py-4 text-center font-medium whitespace-nowrap text-red-600 dark:text-red-400"
                      colSpan={20}
                    >
                      {props.error?.response?.data?.message ||
                        intl.formatMessage({
                          defaultMessage: 'Une erreur est survenue',
                          id: 'uM26tE',
                        })}
                    </td>
                  </tr>
                </Match>
                <Match when={props.object?.length === 0 && !props.loading}>
                  <tr class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td
                      class="px-6 py-4 text-center font-medium whitespace-nowrap text-gray-900 dark:text-white"
                      colSpan={20}
                    >
                      {intl.formatMessage({
                        defaultMessage: 'Aucune donnée disponible',
                        id: 'ck8mFS',
                      })}
                    </td>
                  </tr>
                </Match>
              </Switch>
              <Show when={!props.loading}>
                <For each={props.object}>
                  {(obj, index) => {
                    const id = obj.id || index();
                    return (
                      <tr
                        class={twMerge(
                          selectedRows.includes(obj.id)
                            ? 'bg-opacity-50 dark:bg-opacity-40 bg-blue-50 dark:bg-gray-700'
                            : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-900',
                          isRowClicked == id ? '!bg-gray-50 dark:!bg-gray-900' : '',
                          'border-b border-gray-200 last:border-b-0 dark:border-gray-700',
                        )}
                        onClick={() => setIsRowClicked(id)}
                      >
                        <Show when={props.rowSelection}>
                          <td class="w-4 px-6 py-4 pr-2 whitespace-nowrap text-gray-900 dark:text-white">
                            <Checkbox
                              checked={selectedRows.includes(obj.id)}
                              onChange={() => handleCheckboxChange(obj.id)}
                              class="cursor-pointer"
                            />
                          </td>
                        </Show>
                        <For each={props.columns}>
                          {(column: DataTableColumnProps) => (
                            <td
                              class={
                                'max-w-xs truncate px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white'
                              }
                            >
                              <Show when={column.render} fallback={obj[column.key]}>
                                {column.render(obj[column.key], obj, index())}
                              </Show>
                            </td>
                          )}
                        </For>
                      </tr>
                    );
                  }}
                </For>
              </Show>
            </tbody>
          </table>
        </div>

        <Show
          when={
            !props.error && props.object?.length > 0 && !props.loading && props.pageTotal
          }
        >
          <div class="flex w-full items-center justify-between border-t px-4 py-6 sm:px-8 dark:border-gray-700">
            <div class="flex items-center justify-center gap-4">
              <Show when={props.itemsTotal}>
                <div class="text-sm whitespace-nowrap italic">
                  {props.itemsTotal}{' '}
                  {intl.formatMessage({
                    defaultMessage: 'éléments',
                    id: 'cBOyDT',
                  })}
                </div>
              </Show>
              <Show when={props.perPageControl} fallback={<div />}>
                <div class="flex items-center">
                  <Select
                    defaultValue={props.requestParams.perPage}
                    onChange={(e) =>
                      props.setRequestParams?.({
                        perPage: parseInt(e.target.value),
                        page: 1,
                      })
                    }
                    sizing="sm"
                  >
                    <For each={[10, 20, 30, 50, 80, 100]}>
                      {(value) => <option value={value}>{value}</option>}
                    </For>
                  </Select>
                  <div class="ml-1.5 text-sm">
                    /{' '}
                    {intl.formatMessage({
                      defaultMessage: 'page',
                      id: 'ovCNnF',
                    })}
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default DataTable;
