import { For, JSX, Show, onCleanup } from 'solid-js';

import {
  ChevronDownIcon,
  ChevronSelectorVerticalIcon,
  ChevronUpIcon,
  Lock01Icon,
  LockUnlocked01Icon,
  XIcon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Checkbox from '../Checkbox';
import Select from '../Select';
import Tooltip from '../Tooltip';
import { useDataTableInternal } from './DataTableInternalContext';
import { SortAction } from './types';

export function DataTableHeader(): JSX.Element {
  const ctx = useDataTableInternal();

  const getSortEntry = (key: string) => ctx.sorts().find((s) => s.key === key);

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

  // --- Column locking (sticky via transform) ---
  const isSticky = (key: string) => ctx.stickyColumnKey() === key;

  const stickyStyle = (key: string): JSX.CSSProperties | undefined => {
    if (!isSticky(key)) return undefined;
    return {
      position: 'relative',
      'z-index': 2,
      background: 'inherit',
      transform: 'translateX(var(--dt-sticky-offset, 0px))',
    };
  };

  // --- Column resizing ---

  let cleanupResize: (() => void) | undefined;

  const startResize = (key: string, e: MouseEvent) => {
    // Skip if this is part of a double-click (used for reset)
    if (e.detail >= 2) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const headerCell = (e.target as HTMLElement).closest('[role="columnheader"]');
    const startWidth = (headerCell as HTMLElement)?.offsetWidth ?? 100;

    const onMouseMove = (me: MouseEvent) => {
      const delta = me.clientX - startX;
      const newWidth = Math.max(60, startWidth + delta);
      ctx.onColumnResize(key, newWidth);
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      cleanupResize = undefined;
    };

    const onMouseUp = () => cleanup();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    cleanupResize = cleanup;
  };

  onCleanup(() => cleanupResize?.());

  return (
    <div role="rowgroup">
      <div
        ref={ctx.setHeaderRef}
        role="row"
        class={twMerge(
          'relative grid w-fit border-b border-neutral-200 bg-neutral-100 text-xs font-bold uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400',
          !ctx.searchBar &&
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
              aria-label={ctx.ariaLabels().selectAllRows}
            />
          </div>
        </Show>

        <Show when={ctx.expandRow && ctx.onRowClick}>
          <div role="columnheader" class="py-3">
            <span class="sr-only">{ctx.ariaLabels().expand}</span>
          </div>
        </Show>

        <For each={ctx.columns()}>
          {(column) => {
            const isSortable = () => ctx.sortableColumns().has(column.key);
            const isActiveSort = () => !!getSortEntry(column.key);
            const sortDirection = () => getSortEntry(column.key)?.direction;

            const sortTooltip = () => {
              if (!isActiveSort()) return ctx.labels().sortAscending;
              if (sortDirection() === 'asc') return ctx.labels().sortDescending;
              return ctx.labels().clearSort;
            };

            return (
              <div
                role="columnheader"
                aria-sort={getAriaSortValue(column.key)}
                data-column-key={column.key}
                class={twMerge(
                  'group/header relative flex items-center gap-1 overflow-hidden whitespace-nowrap px-6 py-3',
                  isSticky(column.key) &&
                    'border-x border-dashed border-neutral-200 dark:border-neutral-700',
                )}
                style={stickyStyle(column.key)}
                title={!isSortable() ? column.tooltip || column.label : undefined}
              >
                <Show
                  when={isSortable()}
                  fallback={
                    <Tooltip
                      content={column.tooltip}
                      placement="top"
                      class="capitalize"
                      hidden={!column.tooltip}
                    >
                      <span>{column.label}</span>
                    </Tooltip>
                  }
                >
                  <Tooltip
                    content={column.tooltip}
                    placement="top"
                    class="capitalize"
                    hidden={!column.tooltip}
                  >
                    <Select
                      options={[
                        {
                          value: 'asc',
                          label: ctx.labels().sortAscending,
                          labelWrapper: (label) => (
                            <div class="flex items-center gap-2">
                              <ChevronUpIcon aria-hidden="true" />
                              {label}
                            </div>
                          ),
                        },
                        {
                          value: 'desc',
                          label: ctx.labels().sortDescending,
                          labelWrapper: (label) => (
                            <div class="flex items-center gap-2">
                              <ChevronDownIcon aria-hidden="true" />
                              {label}
                            </div>
                          ),
                        },
                        {
                          value: '',
                          label: ctx.labels().clearSort,
                          labelWrapper: (label) => (
                            <div class="flex items-center gap-2">
                              <XIcon aria-hidden="true" />
                              {label}
                            </div>
                          ),
                        },
                      ]}
                      value={isActiveSort() ? sortDirection() : undefined}
                      onSelect={(opt) => {
                        if (!opt) return;
                        ctx.onSortSelect(column.key, opt.value as SortAction);
                      }}
                      inputComponent={(triggerProps) => (
                        <button
                          type="button"
                          data-sort-button
                          onKeyDown={triggerProps.onKeyDown}
                          role="combobox"
                          aria-expanded={triggerProps.isOpen()}
                          aria-controls={triggerProps.listboxId}
                          aria-activedescendant={triggerProps.highlightedOptionId()}
                          aria-haspopup="listbox"
                          disabled={triggerProps.disabled}
                          class="flex cursor-pointer items-center gap-1 focus:outline-none"
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
                              class="size-3.5 text-neutral-400 dark:text-neutral-500"
                              aria-hidden="true"
                            />
                          </Show>
                        </button>
                      )}
                    />
                  </Tooltip>
                </Show>

                {/* Lock icon — visible on hover or when locked */}
                <Show when={ctx.columnLocking}>
                  <Tooltip
                    content={
                      isSticky(column.key)
                        ? ctx.labels().unlockColumn
                        : ctx.labels().lockColumn
                    }
                    placement="top"
                    showDelay={500}
                  >
                    <button
                      type="button"
                      class={twMerge(
                        'flex shrink-0 items-center justify-center rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                        isSticky(column.key)
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-neutral-400 opacity-0 transition-opacity group-hover/header:opacity-100 focus-visible:opacity-100 dark:text-neutral-500',
                      )}
                      aria-label={
                        isSticky(column.key)
                          ? `${column.label}, ${ctx.labels().unlockColumn}`
                          : `${column.label}, ${ctx.labels().lockColumn}`
                      }
                      aria-pressed={isSticky(column.key)}
                      onClick={() => ctx.toggleStickyColumn(column.key)}
                    >
                      <Show
                        when={isSticky(column.key)}
                        fallback={
                          <LockUnlocked01Icon class="size-3" aria-hidden="true" />
                        }
                      >
                        <Lock01Icon class="size-3" aria-hidden="true" />
                      </Show>
                    </button>
                  </Tooltip>
                </Show>
                <Show when={ctx.columnResizing}>
                  <Tooltip
                    content={
                      ctx.resizedWidths().has(column.key)
                        ? ctx.labels().resetColumnSize
                        : ctx.labels().resizeColumn
                    }
                    placement="top"
                    wrapperClass="absolute right-0 top-0 h-full w-1.5"
                    showDelay={500}
                  >
                    <div
                      class="h-full w-full cursor-col-resize select-none border-x-2 border-neutral-200 opacity-0 transition-opacity duration-300 group-hover/header:opacity-100 focus-visible:opacity-100 dark:border-neutral-700"
                      onMouseDown={(e) => startResize(column.key, e)}
                      onDblClick={() => ctx.resetColumnResize(column.key)}
                      onKeyDown={(e) => {
                        const step = e.shiftKey ? 20 : 5;
                        if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          const headerCell = (e.target as HTMLElement).closest('[role="columnheader"]');
                          const currentWidth = (headerCell as HTMLElement)?.offsetWidth ?? 100;
                          ctx.onColumnResize(column.key, Math.max(60, currentWidth - step));
                        } else if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          const headerCell = (e.target as HTMLElement).closest('[role="columnheader"]');
                          const currentWidth = (headerCell as HTMLElement)?.offsetWidth ?? 100;
                          ctx.onColumnResize(column.key, currentWidth + step);
                        } else if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          ctx.resetColumnResize(column.key);
                        }
                      }}
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={ctx.labels().resizeColumn}
                      tabindex={0}
                      aria-valuenow={ctx.resizedWidths().get(column.key)}
                    />
                  </Tooltip>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
