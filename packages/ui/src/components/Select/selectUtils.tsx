import { JSX, Show } from 'solid-js';

import { CheckIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import { type Option } from '../../shared';
import Spinner from '../Spinner';

export const optionsContainerClass =
  'box-border max-h-[200px] h-full overflow-y-auto p-1';

export const optionClass = (option: Option, highlightedOption: Option | null) => {
  return twMerge(
    'flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm whitespace-nowrap',
    option.disabled ? 'cursor-not-allowed opacity-50' : '',
    highlightedOption?.value === option.value && !option.disabled
      ? 'rounded bg-blue-50 dark:bg-neutral-800'
      : '',
  );
};

export const groupedOptionIndent = 'pl-4';

export const InfiniteScrollLoader = (props: { isLoadingMore?: boolean }) => (
  <Show when={props.isLoadingMore}>
    <div class="p-1 text-center">
      <Spinner size="xs" />
    </div>
  </Show>
);

export const CTA = (props: { cta?: JSX.Element }) => (
  <Show when={props.cta}>{props.cta}</Show>
);

export const OptionLabel = (props: { option: Option; selectedOption: Option | null }) => (
  <>
    {props.option.labelWrapper
      ? props.option.labelWrapper(props.option.label)
      : props.option.label}
    <div class="ml-2.5">
      <Show when={props.selectedOption?.value === props.option.value}>
        <CheckIcon class="size-4" aria-hidden="true" />
      </Show>
    </div>
  </>
);

export interface OptionGroupEntry {
  /** Group name, or null for ungrouped options. */
  group: string | null;
  options: Option[];
}

/**
 * Groups options by their `group` field, preserving first-occurrence order.
 * Options without a group go into a null-group entry at their natural position.
 */
export function groupOptions(options: Option[]): OptionGroupEntry[] {
  const entries: OptionGroupEntry[] = [];
  const seen = new Map<string | null, OptionGroupEntry>();

  for (const option of options) {
    const key = option.group ?? null;
    const existing = seen.get(key);
    if (existing) {
      existing.options.push(option);
    } else {
      const entry: OptionGroupEntry = { group: key, options: [option] };
      seen.set(key, entry);
      entries.push(entry);
    }
  }

  return entries;
}

export function hasGroups(options: Option[]): boolean {
  return options.some((o) => o.group != null);
}

export const groupHeaderClass =
  'px-2 pt-1.5 pb-0.5 text-neutral-400 dark:text-neutral-500 select-none';

export const groupSpacerClass = 'h-2';

export type VirtualGroupItem =
  | { _type: 'option'; option: Option; flatIndex: number }
  | { _type: 'header'; group: string; options: Option[]; headerId: string }
  | { _type: 'spacer' };

/**
 * Builds a flat list of virtual items from grouped options, interleaving
 * headers and spacers so DynamicVirtualList can render them at their natural heights.
 */
export function buildVirtualGroupItems(
  options: Option[],
  listboxId: string,
): VirtualGroupItem[] {
  if (!hasGroups(options)) {
    return options.map((o, i) => ({ _type: 'option' as const, option: o, flatIndex: i }));
  }

  const groups = groupOptions(options);
  const items: VirtualGroupItem[] = [];
  let flatIndex = 0;

  for (let g = 0; g < groups.length; g++) {
    const entry = groups[g];
    if (entry.group !== null) {
      if (g > 0) {
        items.push({ _type: 'spacer' });
      }
      items.push({
        _type: 'header',
        group: entry.group,
        options: entry.options,
        headerId: `${listboxId}-group-${g}`,
      });
    }
    for (const opt of entry.options) {
      items.push({ _type: 'option', option: opt, flatIndex });
      flatIndex++;
    }
  }

  return items;
}

export function getScrollProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const scrollable = scrollHeight - clientHeight;

  if (scrollable <= 0) return 100;

  const percent = (scrollTop / scrollable) * 100;
  return Math.min(100, Math.max(0, percent));
}
