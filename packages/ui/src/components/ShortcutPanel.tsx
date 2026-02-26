import { For, type JSX, Show, createEffect, createMemo, createSignal, onCleanup, splitProps, useContext } from 'solid-js';
import { twMerge } from 'tailwind-merge';

import {
  ShortcutContext,
  comboFromEvent,
  type RegisteredAction,
} from '@kayou/hooks';

export interface ShortcutPanelLabels {
  search: string;
  resetAll: string;
  resetToDefault: string;
  pressKeyCombination: string;
  noShortcuts: string;
  conflict: string;
  cancel: string;
}

export const DEFAULT_SHORTCUT_PANEL_LABELS: ShortcutPanelLabels = {
  search: 'Search shortcuts...',
  resetAll: 'Reset all',
  resetToDefault: 'Reset',
  pressKeyCombination: 'Press a key combination...',
  noShortcuts: 'No shortcuts registered',
  conflict: 'Conflict',
  cancel: 'Cancel',
};

export interface ShortcutPanelAriaLabels {
  shortcutList: string;
  editShortcut: string;
  searchShortcuts: string;
}

export const DEFAULT_SHORTCUT_PANEL_ARIA_LABELS: ShortcutPanelAriaLabels = {
  shortcutList: 'Keyboard shortcuts',
  editShortcut: 'Edit shortcut',
  searchShortcuts: 'Search shortcuts',
};

export interface ShortcutPanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<ShortcutPanelLabels>;
  ariaLabels?: Partial<ShortcutPanelAriaLabels>;
}

const panelTheme = {
  root: 'w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800',
  header:
    'flex items-center justify-between gap-3 border-b border-neutral-200 p-3 dark:border-neutral-700',
  search:
    'flex-1 rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-500',
  resetAll:
    'shrink-0 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer whitespace-nowrap',
  category:
    'bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400',
  row: {
    base: 'flex items-center justify-between gap-2 px-3 py-2.5 border-b border-neutral-100 last:border-b-0 dark:border-neutral-700/50',
    info: 'flex flex-col gap-0.5 min-w-0',
    label: 'text-sm text-neutral-800 dark:text-neutral-200',
    description: 'text-xs text-neutral-500 dark:text-neutral-400 truncate',
    actions: 'flex items-center gap-2 shrink-0',
    shortcut: 'inline-flex items-center gap-0.5',
    key: 'rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
    edit: 'rounded p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer',
    reset:
      'text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer',
    conflict: 'text-xs text-red-600 dark:text-red-400',
  },
  recording:
    'inline-flex items-center gap-2 rounded border-2 border-dashed border-blue-400 bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300',
  empty: 'px-3 py-8 text-center text-sm text-neutral-400 dark:text-neutral-500',
};

const isMac = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  if ('userAgentData' in navigator && (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData) {
    return (navigator as Navigator & { userAgentData: { platform: string } }).userAgentData.platform === 'macOS';
  }
  return /Mac|iPhone|iPad/.test(navigator.userAgent);
};

function formatKeyForDisplay(part: string): string {
  if (isMac()) {
    if (part === 'Ctrl') return '\u2318';
    if (part === 'Meta') return '\u2318';
    if (part === 'Alt') return '\u2325';
    if (part === 'Shift') return '\u21E7';
  }
  return part;
}

function comboToParts(combo: string): string[] {
  if (!combo) return [];
  return combo.split('+').map(formatKeyForDisplay);
}

const ShortcutPanel = (props: ShortcutPanelProps): JSX.Element => {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('ShortcutPanel must be used within a ShortcutProvider');
  }

  const [local, divProps] = splitProps(props, ['labels', 'ariaLabels', 'class']);

  const labels = createMemo(() => ({ ...DEFAULT_SHORTCUT_PANEL_LABELS, ...local.labels }));
  const ariaLabels = createMemo(() => ({
    ...DEFAULT_SHORTCUT_PANEL_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  const [search, setSearch] = createSignal('');
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const filteredActions = createMemo(() => {
    const query = search().toLowerCase();
    const actions = context.getActions();
    if (!query) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(query) ||
        (a.description?.toLowerCase().includes(query)) ||
        (a.category?.toLowerCase().includes(query)),
    );
  });

  const groupedActions = createMemo(() => {
    const groups = new Map<string, RegisteredAction[]>();
    for (const action of filteredActions()) {
      const category = action.category ?? '';
      const existing = groups.get(category) ?? [];
      existing.push(action);
      groups.set(category, existing);
    }
    return groups;
  });

  const conflicts = () => context.getConflicts();

  const isConflicted = (combo: string): boolean => {
    return conflicts().has(combo);
  };

  const focusEditButton = (actionId: string) => {
    requestAnimationFrame(() => {
      const btn = document.querySelector<HTMLButtonElement>(`[data-shortcut-edit="${actionId}"]`);
      btn?.focus();
    });
  };

  createEffect(() => {
    const id = editingId();
    if (!id) return;
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setEditingId(null);
        focusEditButton(id);
        return;
      }

      const combo = comboFromEvent(e);
      if (!combo) return;

      context.updateBinding(id, combo);
      setEditingId(null);
      focusEditButton(id);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown, true));
  });

  const renderCombo = (combo: string) => {
    const parts = comboToParts(combo);
    return (
      <span class={panelTheme.row.shortcut}>
        <For each={parts}>
          {(part) => <kbd class={panelTheme.row.key}>{part}</kbd>}
        </For>
      </span>
    );
  };

  const renderRow = (action: RegisteredAction) => {
    const isEditing = () => editingId() === action.id;
    const hasConflict = () => isConflicted(action.currentShortcut);
    const isCustom = () => action.currentShortcut !== action.defaultShortcut;

    return (
      <div class={panelTheme.row.base}>
        <div class={panelTheme.row.info}>
          <span class={panelTheme.row.label}>{action.label}</span>
          <Show when={action.description}>
            <span class={panelTheme.row.description}>{action.description}</span>
          </Show>
        </div>
        <div class={panelTheme.row.actions}>
          <Show when={hasConflict()}>
            <span class={panelTheme.row.conflict}>{labels().conflict}</span>
          </Show>
          <Show
            when={!isEditing()}
            fallback={
              <span class={panelTheme.recording}>
                {labels().pressKeyCombination}
                <button
                  type="button"
                  class={panelTheme.row.reset}
                  onClick={() => {
                    setEditingId(null);
                    focusEditButton(action.id);
                  }}
                >
                  {labels().cancel}
                </button>
              </span>
            }
          >
            {renderCombo(action.currentShortcut)}
            <button
              type="button"
              class={panelTheme.row.edit}
              aria-label={`${ariaLabels().editShortcut}: ${action.label}`}
              data-shortcut-edit={action.id}
              onClick={() => setEditingId(action.id)}
            >
              <svg
                class="size-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <Show when={isCustom()}>
              <button
                type="button"
                class={panelTheme.row.reset}
                onClick={() => context.resetBinding(action.id)}
              >
                {labels().resetToDefault}
              </button>
            </Show>
          </Show>
        </div>
      </div>
    );
  };

  return (
    <div
      {...divProps}
      class={twMerge(panelTheme.root, local.class)}
      role="region"
      aria-label={ariaLabels().shortcutList}
    >
      <div class={panelTheme.header}>
        <input
          type="text"
          class={panelTheme.search}
          placeholder={labels().search}
          aria-label={ariaLabels().searchShortcuts}
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <button type="button" class={panelTheme.resetAll} onClick={() => context.resetAll()}>
          {labels().resetAll}
        </button>
      </div>

      <Show
        when={filteredActions().length > 0}
        fallback={<div class={panelTheme.empty}>{labels().noShortcuts}</div>}
      >
        <For each={[...groupedActions().entries()]}>
          {([category, actions]) => (
            <>
              <Show when={category}>
                <div class={panelTheme.category}>{category}</div>
              </Show>
              <For each={actions}>{(action) => renderRow(action)}</For>
            </>
          )}
        </For>
      </Show>
    </div>
  );
};

export default ShortcutPanel;
