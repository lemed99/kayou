import {
  Accessor,
  ErrorBoundary,
  For,
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';

import { ChevronRightIcon, Lock01Icon, LockUnlocked01Icon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';
import { useDataTableInternal } from './DataTableInternalContext';

interface DataTableRowProps<T> {
  row: T;
  index: Accessor<number>;
}

export function DataTableRow<T extends Record<string, unknown>>(
  props: DataTableRowProps<T>,
): JSX.Element {
  const ctx = useDataTableInternal<T>();
  const rowKey = () => ctx.getRowKey(props.row, props.index());

  const isSelected = () => ctx.selectedRows().has(rowKey());
  const isExpanded = () => ctx.expandedRows().has(rowKey());
  const isLocked = () => ctx.lockedRowKey() === rowKey();

  const userRowClass = () => {
    const rc = ctx.rowClass;
    if (!rc) return '';
    if (typeof rc === 'function') return rc(props.row, props.index());
    return rc;
  };

  const rowClasses = () => {
    let cls = 'grid w-fit';
    cls += isSelected()
      ? ' bg-neutral-100 dark:bg-neutral-800'
      : ' bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800/50';
    if (ctx.onRowClick || ctx.expandRow) cls += ' cursor-pointer';
    if (isLocked())
      cls += ' border-y border-dashed border-gray-200 dark:border-neutral-700';
    if (ctx.rowLocking) cls += ' relative';
    const uc = userRowClass();
    if (uc) cls += ` ${uc}`;
    return cls;
  };

  // Sticky cell styles — uses CSS custom property `--dt-scroll-left` set by
  // the scroll container in DataTable.tsx. Transform-based approach works inside
  // VirtualList/DynamicVirtualList (which break CSS `position: sticky`).
  const isSticky = (key: string) => ctx.stickyColumnKey() === key;

  const stickyStyle = (key: string): JSX.CSSProperties | undefined => {
    if (!isSticky(key)) return undefined;
    return {
      position: 'relative',
      'z-index': 1,
      background: 'inherit',
      transform: 'translateX(var(--dt-sticky-offset, 0px))',
    };
  };

  const handleClick = (e: MouseEvent) => {
    // Don't fire for interactive elements inside cells (checkboxes, buttons, selects, links)
    if (
      (e.target as HTMLElement).closest(
        'input, button, a, select, textarea, [role="combobox"], [role="listbox"]',
      )
    )
      return;
    if (ctx.onRowClick) {
      ctx.onRowClick(props.row, props.index());
    } else if (ctx.expandRow) {
      ctx.toggleRowExpansion(rowKey());
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle row-level keys when the row itself has focus
    if (e.target !== e.currentTarget) return;

    const total = ctx.filteredData().length;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = Math.min(props.index() + 1, total - 1);
        ctx.setFocusedRowIndex(next);
        const container = (e.currentTarget as HTMLElement).closest('[role="rowgroup"]');
        const nextRow = container?.querySelector<HTMLElement>(
          `[data-row-index="${next}"]`,
        );
        nextRow?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = Math.max(props.index() - 1, 0);
        ctx.setFocusedRowIndex(prev);
        const container = (e.currentTarget as HTMLElement).closest('[role="rowgroup"]');
        const prevRow = container?.querySelector<HTMLElement>(
          `[data-row-index="${prev}"]`,
        );
        prevRow?.focus();
        break;
      }
      case 'Enter':
        if (ctx.expandRow) {
          e.preventDefault();
          ctx.toggleRowExpansion(rowKey());
        }
        break;
      case ' ':
        if (ctx.rowSelection) {
          e.preventDefault();
          ctx.toggleSelectRow(rowKey());
        }
        break;
      case 'Escape':
        if (isExpanded()) {
          e.preventDefault();
          ctx.toggleRowExpansion(rowKey());
        } else if (ctx.contextMenuState()) {
          e.preventDefault();
          ctx.closeContextMenu();
        }
        break;
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    if (ctx.rowContextMenu) {
      ctx.openContextMenu(e, props.row, props.index());
    }
  };

  // --- Detail panel animation (skip when expandRow is not configured) ---
  const detailPresence = ctx.expandRow
    ? createPresence(isExpanded, { transitionDuration: 200 })
    : null;
  const detailVisible = () => detailPresence?.isVisible() ?? false;
  const detailMounted = () => detailPresence?.isMounted() ?? false;
  const [detailHeight, setDetailHeight] = createSignal(0);
  let detailContentRef: HTMLDivElement | undefined;

  if (ctx.expandRow) {
    createEffect(() => {
      if (detailMounted() && detailContentRef) {
        setDetailHeight(detailContentRef.offsetHeight);
        const observer = new ResizeObserver((entries) => {
          setDetailHeight(entries[0].target.scrollHeight);
        });
        observer.observe(detailContentRef);
        onCleanup(() => observer.disconnect());
      }
    });
  }

  return (
    <div
      class="group/row"
      classList={{
        'box border-b border-gray-200 last:border-b-0 dark:border-neutral-800':
          !(ctx.rowHeight || ctx.estimatedRowHeight),
      }}
    >
      {/* Data row */}
      <div
        role="row"
        class={rowClasses()}
        style={{ 'grid-template-columns': ctx.rowGridStyle() }}
        tabindex={0}
        data-row-index={props.index()}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => ctx.setFocusedRowIndex(props.index())}
        onContextMenu={handleContextMenu}
      >
        {/* Row lock icon */}
        <Show when={ctx.rowLocking}>
          <div class="absolute left-1 top-1/2 z-10 -translate-y-1/2">
            <Tooltip
              content={isLocked() ? ctx.labels().unlockRow : ctx.labels().lockRow}
              placement="right"
              showDelay={500}
            >
              <button
                type="button"
                class="flex items-center justify-center rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                classList={{
                  'text-blue-600 dark:text-blue-400': isLocked(),
                  'text-gray-400 opacity-0 transition-opacity group-hover/row:opacity-100 dark:text-neutral-500':
                    !isLocked(),
                }}
                aria-label={isLocked() ? ctx.labels().unlockRow : ctx.labels().lockRow}
                aria-pressed={isLocked()}
                onClick={(e) => {
                  e.stopPropagation();
                  ctx.toggleLockedRow(rowKey());
                }}
              >
                <Show
                  when={isLocked()}
                  fallback={<LockUnlocked01Icon class="size-3" aria-hidden="true" />}
                >
                  <Lock01Icon class="size-3" aria-hidden="true" />
                </Show>
              </button>
            </Tooltip>
          </div>
        </Show>
        {/* Selection checkbox */}
        <Show when={ctx.rowSelection}>
          <div role="cell" class="flex items-center py-3 pl-6">
            <Checkbox
              checked={isSelected()}
              onChange={() => ctx.toggleSelectRow(rowKey())}
              aria-label={`Select row ${props.index() + 1}`}
            />
          </div>
        </Show>

        {/* Expand/collapse button — only when onRowClick is set (otherwise row click toggles) */}
        <Show when={ctx.expandRow && ctx.onRowClick}>
          <div role="cell" class="flex items-center justify-center">
            <button
              type="button"
              aria-expanded={isExpanded()}
              aria-label={
                isExpanded() ? ctx.labels().collapseRow : ctx.labels().expandRow
              }
              onClick={() => ctx.toggleRowExpansion(rowKey())}
              class="cursor-pointer rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ChevronRightIcon
                class={`size-3.5 transition-transform duration-200${isExpanded() ? ' rotate-90' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </Show>

        {/* Data cells */}
        <For each={ctx.columns()}>
          {(column) => (
            <div
              role="cell"
              class="flex shrink-0 items-center px-6 py-4 text-gray-900 dark:text-white"
              classList={{
                'relative border-x border-dashed border-gray-200 dark:border-neutral-700':
                  isSticky(column.key),
              }}
              style={stickyStyle(column.key)}
            >
              <Show
                when={column.render}
                fallback={
                  <span data-column={column.key}>{String(props.row[column.key])}</span>
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

      {/* Detail panel */}
      <Show when={ctx.expandRow && detailMounted()}>
        <div
          class="overflow-hidden border-t border-gray-200 transition-[height] duration-200 ease-out dark:border-neutral-800"
          style={{
            height: detailVisible() ? `${detailHeight()}px` : '0px',
          }}
        >
          <div ref={detailContentRef}>{ctx.expandRow!(props.row)}</div>
        </div>
      </Show>
    </div>
  );
}
