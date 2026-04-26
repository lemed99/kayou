import { JSX, Show } from 'solid-js';

import { ChevronLeftIcon, ChevronRightIcon } from '@kayou/icons';

import Button from '../Button';
import Pagination from '../Pagination';
import Select from '../Select';
import Tooltip from '../Tooltip';
import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableFooter(): JSX.Element {
  const ctx = useDataTableInternal();

  return (
    <Show when={ctx.footer ?? true}>
      <nav
        aria-label="Table pagination"
        class="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-neutral-200 px-6 py-5 sm:flex-row dark:border-neutral-800"
      >
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

        <Show
          when={ctx.paginationType() === 'page'}
          fallback={
            <Show when={ctx.prevCursor() !== null || ctx.nextCursor() !== null}>
              <div class="flex items-center gap-2">
                <Tooltip
                  hidden={ctx.prevCursor() === null}
                  content={ctx.labels().previousPage}
                >
                  <Button
                    color="theme"
                    onClick={() => ctx.handleCursorChange(ctx.prevCursor())}
                    disabled={ctx.prevCursor() === null}
                    class="size-8"
                    aria-label={ctx.ariaLabels().goToPreviousPage}
                  >
                    <ChevronLeftIcon class="size-2.5" strokeWidth={2} />
                  </Button>
                </Tooltip>
                <Tooltip
                  hidden={ctx.nextCursor() === null}
                  content={ctx.labels().nextPage}
                >
                  <Button
                    color="theme"
                    onClick={() => ctx.handleCursorChange(ctx.nextCursor())}
                    disabled={ctx.nextCursor() === null}
                    class="size-8"
                    aria-label={ctx.ariaLabels().goToNextPage}
                  >
                    <ChevronRightIcon class="size-2.5" strokeWidth={2} />
                  </Button>
                </Tooltip>
              </div>
            </Show>
          }
        >
          <Show when={ctx.pageTotal && ctx.pageTotal > 1}>
            <Pagination
              total={ctx.pageTotal!}
              page={ctx.currentPage()}
              onChange={ctx.handlePageChange}
            />
          </Show>
        </Show>
      </nav>
    </Show>
  );
}
