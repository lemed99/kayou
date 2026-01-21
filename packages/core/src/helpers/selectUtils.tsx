import { JSX, Show } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import Spinner from '../components/Spinner';
import { CheckIcon, ChevronDownIcon, XCloseIcon } from '../icons';

export interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export const optionsContainerClass =
  'scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 box-border max-h-[200px] h-full overflow-y-auto p-1';

export const optionClass = (option: Option, highlightedOption: Option | null) => {
  return twMerge(
    'flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm whitespace-nowrap',
    highlightedOption?.value == option.value ? 'rounded bg-blue-50 dark:bg-gray-700' : '',
  );
};

export const LazyLoading = (props: { isLazyLoading?: boolean }) => (
  <Show when={props.isLazyLoading}>
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

export const ClearContentButton = (props: {
  onClick: (e: Event) => void;
  class?: string;
  disabled?: boolean;
}) => {
  const defaultClass =
    'absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
  return (
    <button
      type="button"
      aria-label="Clear selection"
      disabled={props.disabled}
      onClick={(e: Event) => props.onClick(e)}
      class={twMerge(defaultClass, props.class)}
    >
      <XCloseIcon class="size-4" aria-hidden="true" />
    </button>
  );
};

export const ChevronDownButton = (props: {
  onFocus?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    aria-label="Open dropdown"
    disabled={props.disabled}
    onFocus={() => props.onFocus?.()}
    class="absolute right-0 top-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
  >
    <ChevronDownIcon class="size-4" aria-hidden="true" />
  </button>
);
