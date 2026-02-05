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
    highlightedOption?.value == option.value
      ? 'rounded bg-blue-50 dark:bg-neutral-800'
      : '',
  );
};

export const InfiniteScrollLoader = (props: { isLoadingMore?: boolean }) => (
  <Show when={props.isLoadingMore}>
    <div class="p-1 text-center">
      <Spinner color="gray" size="xs" />
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

export function getScrollProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const scrollable = scrollHeight - clientHeight;

  if (scrollable <= 0) return 100;

  const percent = (scrollTop / scrollable) * 100;
  return Math.min(100, Math.max(0, percent));
}
