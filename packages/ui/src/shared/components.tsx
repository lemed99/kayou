import { ChevronDownIcon, XCloseIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

export const ClearContentButton = (props: {
  onClick: (e: Event) => void;
  class?: string;
  disabled?: boolean;
}) => {
  const defaultClass =
    'absolute top-0 right-0 h-full cursor-pointer px-3 text-neutral-400 dark:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
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
    tabIndex={-1}
    aria-hidden="true"
    disabled={props.disabled}
    onFocus={() => props.onFocus?.()}
    class="absolute right-0 top-0 h-full cursor-pointer px-3 text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500"
  >
    <ChevronDownIcon class="size-4" aria-hidden="true" />
  </button>
);
