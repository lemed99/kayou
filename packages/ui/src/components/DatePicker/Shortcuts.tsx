import { For, createMemo, createSignal } from 'solid-js';

import type { DatePickerType } from './DatePicker';
import type { DatePickerShortcut } from './DatePickerContext';

/**
 * Props for the internal Shortcuts component.
 */
export interface ShortcutsProps {
  shortcuts: DatePickerShortcut[];
  onSelect: (value: { date?: string; startDate?: string; endDate?: string }) => void;
  type: () => DatePickerType;
  onEscape?: () => void;
  ariaLabel: string;
}

/**
 * Internal shortcuts panel component for DatePicker.
 * Displays quick selection buttons on the left side of the calendar.
 */
const Shortcuts = (props: ShortcutsProps) => {
  const [focusedIndex, setFocusedIndex] = createSignal(0);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);

  // Filter shortcuts based on selection type
  const filteredShortcuts = createMemo(() => {
    return props.shortcuts.filter((shortcut) => {
      const value = shortcut.getValue();
      const isSingleShortcut = value.date && !value.startDate && !value.endDate;
      const isRangeShortcut = value.startDate && value.endDate;

      // For single/multiple type, show only single-date shortcuts
      if (props.type() === 'single' || props.type() === 'multiple') {
        return isSingleShortcut;
      }
      // For range type, show only range shortcuts
      if (props.type() === 'range') {
        return isRangeShortcut;
      }
      return true;
    });
  });

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const shortcuts = filteredShortcuts();
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          setFocusedIndex(index - 1);
          const container = (e.target as HTMLElement).parentElement;
          container
            ?.querySelector<HTMLButtonElement>(`[data-shortcut="${index - 1}"]`)
            ?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < shortcuts.length - 1) {
          setFocusedIndex(index + 1);
          const container = (e.target as HTMLElement).parentElement;
          container
            ?.querySelector<HTMLButtonElement>(`[data-shortcut="${index + 1}"]`)
            ?.focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        props.onEscape?.();
        break;
    }
  };

  return (
    <div
      class="flex min-w-[120px] flex-col gap-1 border-r border-gray-300 pr-3 dark:border-neutral-800"
      role="listbox"
      aria-label={props.ariaLabel}
    >
      <For each={filteredShortcuts()}>
        {(shortcut, index) => (
          <button
            type="button"
            data-shortcut={index()}
            onClick={() => {
              setSelectedId(shortcut.id);
              props.onSelect(shortcut.getValue());
            }}
            onKeyDown={(e) => handleKeyDown(e, index())}
            role="option"
            aria-selected={selectedId() === shortcut.id}
            tabIndex={focusedIndex() === index() ? 0 : -1}
            class="rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:bg-blue-100/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            {shortcut.label}
          </button>
        )}
      </For>
    </div>
  );
};

export default Shortcuts;
