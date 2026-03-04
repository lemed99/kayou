import { JSX, Show } from 'solid-js';

import Pagination from '../Pagination';
import Select from '../Select';
import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableFooter(): JSX.Element {
  const ctx = useDataTableInternal();

  return (
    <Show when={ctx.footer ?? true}>
      <nav aria-label="Table pagination" class="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-neutral-200 px-6 py-5 sm:flex-row dark:border-neutral-800">
        <div class="flex items-center gap-4">
          <Show when={ctx.perPageControl}>
            <div class="flex items-center gap-2">
              <Select
                options={ctx.perPageOptions.map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                sizing="xs"
                value={String(ctx.perPage())}
                onSelect={(option) =>
                  ctx.handlePerPageChange(Number(option?.value || 10))
                }
                fitContent={true}
                aria-label={ctx.labels().elementsPerPage}
              />
              <span class="whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                {ctx.labels().elementsPerPage}
              </span>
            </div>
          </Show>
        </div>

        <Show when={ctx.pageTotal && ctx.pageTotal > 1}>
          <Pagination
            total={ctx.pageTotal!}
            page={ctx.currentPage()}
            onChange={ctx.handlePageChange}
          />
        </Show>
      </nav>
    </Show>
  );
}
