import {
  Accessor,
  ErrorBoundary,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';

import { ChevronRightIcon, Lock01Icon, LockUnlocked01Icon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';
import { useDataTableInternal } from './DataTableInternalContext';
import { getDataTableColumnAlignmentClasses } from './alignment';

interface DataTableRowProps<T> {
  row: T;
  index: Accessor<number>;
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  )
    return value.toString();
  return String(value as string);
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
    if (ctx.onRowClick || ctx.expandRow) cls += ' cursor-pointer';
    if (isLocked())
      cls += ' border-y border-dashed border-neutral-200 dark:border-neutral-700';
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

    const total = ctx.visibleData().length;
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
        if (ctx.onRowClick) {
          e.preventDefault();
          ctx.onRowClick(props.row, props.index());
        } else if (ctx.expandRow) {
          e.preventDefault();
          ctx.toggleRowExpansion(rowKey());
        }
        break;
      case 'ContextMenu':
      case 'F10':
        if (
          ctx.rowContextMenu &&
          (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey))
        ) {
          e.preventDefault();
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          ctx.openContextMenu(
            {
              preventDefault: () => {},
              clientX: rect.left + 20,
              clientY: rect.top + rect.height / 2,
            } as MouseEvent,
            props.row,
            props.index(),
          );
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

  const rowElementsClassList = createMemo(() => ({
    'bg-neutral-50 dark:bg-neutral-950': isSelected(),
    'bg-white dark:bg-neutral-900': !isSelected(),
    'group-hover/row:bg-neutral-50 dark:group-hover/row:bg-neutral-950': true,
  }));

  return (
    <div class="group/row box border-b border-neutral-200 bg-white last:border-b-0 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Data row */}
      <div
        role="row"
        aria-selected={ctx.rowSelection ? isSelected() : undefined}
        aria-expanded={ctx.expandRow ? isExpanded() : undefined}
        class={rowClasses()}
        style={{ 'grid-template-columns': ctx.rowGridStyle() }}
        tabindex={
          ctx.focusedRowIndex() === props.index() ||
          (ctx.focusedRowIndex() === -1 && props.index() === 0)
            ? 0
            : -1
        }
        data-row-index={props.index()}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => ctx.setFocusedRowIndex(props.index())}
        onContextMenu={handleContextMenu}
      >
        {/* Row lock icon */}
        <Show when={ctx.rowLocking}>
          <div class="absolute top-1/2 left-1 z-10 -translate-y-1/2">
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
                  'text-neutral-400 opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 dark:text-neutral-500':
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
          <div
            role="cell"
            class="flex items-center py-3 pl-6"
            classList={rowElementsClassList()}
          >
            <Checkbox
              checked={isSelected()}
              onChange={() => ctx.toggleSelectRow(rowKey())}
              aria-label={`Select row ${props.index() + 1}`}
            />
          </div>
        </Show>

        {/* Expand/collapse button — only when onRowClick is set (otherwise row click toggles) */}
        <Show when={ctx.expandRow && ctx.onRowClick}>
          <div
            role="cell"
            class="flex items-center justify-center"
            classList={rowElementsClassList()}
          >
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
                class={`size-3.5 transition-transform duration-200 ${isExpanded() ? 'rotate-90' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </Show>

        {/* Data cells */}
        <For each={ctx.columns()}>
          {(column) => {
            const alignment = getDataTableColumnAlignmentClasses(column.align);

            return (
              <div
                role="cell"
                class={twMerge(
                  'flex shrink-0 items-center overflow-hidden px-6 py-4 text-neutral-900 dark:text-white',
                  alignment.justifyClass,
                  alignment.textClass,
                )}
                classList={{
                  'relative border-x border-dashed border-neutral-200 dark:border-neutral-700 bg-inherit':
                    isSticky(column.key),
                  ...rowElementsClassList(),
                }}
                style={stickyStyle(column.key)}
              >
                <Show
                  when={column.render}
                  fallback={
                    <span data-column={column.key} class={alignment.textClass}>
                      {formatCellValue(props.row[column.key])}
                    </span>
                  }
                >
                  <ErrorBoundary
                    fallback={(err) => (
                      <span
                        data-column={column.key}
                        title={String(err)}
                        class={twMerge('text-red-500', alignment.textClass)}
                      >
                        {formatCellValue(props.row[column.key])}
                      </span>
                    )}
                  >
                    <span data-column={column.key} class={alignment.textClass}>
                      {column.render!(props.row[column.key], props.row, props.index())}
                    </span>
                  </ErrorBoundary>
                </Show>
              </div>
            );
          }}
        </For>
      </div>

      {/* Detail panel */}
      <Show when={ctx.expandRow && detailMounted()}>
        <div
          role="region"
          aria-label={`${ctx.labels().expandRow} ${props.index() + 1}`}
          class="overflow-hidden border-t border-neutral-200 transition-[height] duration-200 ease-out dark:border-neutral-800"
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
