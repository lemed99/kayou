import { Accessor, ErrorBoundary, For, JSX, Show } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import Checkbox from '../Checkbox';
import { useDataTableInternal } from './DataTableInternalContext';

const baseRowClass = twMerge(
  'grid w-fit bg-white hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/50',
  'border-b border-gray-200 last:border-b-0 dark:border-neutral-800',
);

interface DataTableRowProps<T> {
  row: T;
  index: Accessor<number>;
}

export function DataTableRow<T extends Record<string, unknown>>(
  props: DataTableRowProps<T>,
): JSX.Element {
  const ctx = useDataTableInternal<T>();
  const rowKey = () => ctx.getRowKey(props.row, props.index());

  return (
    <div
      role="row"
      class={
        ctx.selectedRows().has(rowKey())
          ? `${baseRowClass} bg-neutral-100 dark:bg-neutral-800`
          : baseRowClass
      }
      style={{
        'grid-template-columns': ctx.rowGridStyle(),
      }}
    >
      <Show when={ctx.rowSelection}>
        <div role="cell" class="flex items-center py-3 pl-6">
          <Checkbox
            checked={ctx.selectedRows().has(rowKey())}
            onChange={() => ctx.toggleSelectRow(rowKey())}
            aria-label={`Select row ${props.index() + 1}`}
          />
        </div>
      </Show>

      <For each={ctx.columns()}>
        {(column) => (
          <div
            role="cell"
            class="flex shrink-0 items-center px-6 py-4 text-gray-900 dark:text-white"
          >
            <Show
              when={column.render}
              fallback={
                <span data-column={column.key}>
                  {String(props.row[column.key])}
                </span>
              }
            >
              <ErrorBoundary
                fallback={(err) => (
                  <span
                    data-column={column.key}
                    title={String(err)}
                    class="text-red-500"
                  >
                    {String(props.row[column.key])}
                  </span>
                )}
              >
                <span data-column={column.key}>
                  {column.render!(props.row[column.key], props.row, props.index())}
                </span>
              </ErrorBoundary>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
