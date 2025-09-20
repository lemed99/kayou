import {
  For,
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
} from 'solid-js';

import { autoPlacement, createFloating, offset } from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import { CheckIcon, ChevronDownIcon } from '../icons';
import HelperText from './HelperText';
import TextInput, { TextInputProps } from './TextInput';

interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export interface SelectProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  onSelect: (option?: Option) => void;
  value?: string;
  helperText?: string;
}

export default function Select(props: SelectProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'value',
    'helperText',
  ]);

  const [selectedOption, setSelectedOption] = createSignal<Option | null>(null);
  const [highlightedOption, setHighlightedOption] = createSignal<Option | null>(null);

  const [isOpen, setIsOpen] = createSignal(false);

  createEffect(() => {
    if (local.value) {
      const opt = local.options.find((o) => o.value == local.value);
      if (opt) {
        setSelectedOption(opt);
        setHighlightedOption(opt);
      }
    }
  });

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setHighlightedOption(option);
    local.onSelect(option);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!props.disabled) {
      setIsOpen(true);
    }
  };

  const { refs, placement: finalPlacement } = createFloating({
    isOpen: isOpen,
    middleware: [
      offset(4),
      autoPlacement({
        allowedPlacements: ['top-start', 'bottom-start', 'top-end', 'bottom-end'],
      }),
    ],
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating() &&
        !refs.floating()?.contains(event.target as Node) &&
        refs.reference() &&
        !(refs.reference() as HTMLElement)?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  const handleKeyDown = (
    e: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const { key } = e;

    if (key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (local.options.length === 0) return null;
        if (!prev) return local.options[local.options.length - 1];
        const currentIndex = local.options.findIndex((o) => o.value === prev.value);
        if (currentIndex === 0) {
          return prev;
        }
        if (currentIndex === -1) {
          return local.options[local.options.length - 1];
        }
        return local.options[currentIndex - 1];
      });
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (local.options.length === 0) return null;
        if (!prev) return local.options[0];
        const currentIndex = local.options.findIndex((o) => o.value === prev.value);
        if (currentIndex === local.options.length - 1) {
          return prev;
        }
        if (currentIndex === -1) {
          return local.options[0];
        }
        return local.options[currentIndex + 1];
      });
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      const currentIndex = highlightedOption()
        ? local.options.findIndex((o) => o.value === highlightedOption()?.value)
        : -1;
      if (highlightedOption() && currentIndex !== -1) {
        handleOptionClick(highlightedOption()!);
      } else if (local.options.length === 1) {
        handleOptionClick(local.options[0]);
      }
      return;
    }
  };

  return (
    <div class="w-full">
      <div class="relative w-full">
        <div ref={refs.setReference} onClick={handleInputClick} class="relative w-full">
          <TextInput
            readOnly={true}
            value={selectedOption()?.label || ''}
            placeholder={props.placeholder}
            class="w-full"
            onKeyDown={handleKeyDown}
            style={{
              'padding-right': '36px',
              cursor: props.disabled ? 'not-allowed' : 'pointer',
            }}
            {...otherProps}
          />
          <button
            type="button"
            class="absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronDownIcon class="size-4" />
          </button>
        </div>

        <Show when={isOpen()}>
          <div
            ref={refs.setFloating}
            class={twMerge(
              'scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 absolute z-50 box-border max-h-[240px] w-fit overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow dark:bg-gray-700',
              finalPlacement() === 'top-start' ? 'bottom-full mb-1' : '',
              finalPlacement() === 'bottom-start' ? 'top-full mt-1' : '',
              finalPlacement() === 'top-end' ? 'right-0 bottom-full mb-1' : '',
              finalPlacement() === 'bottom-end' ? 'top-full right-0 mt-1' : '',
            )}
          >
            <For each={local.options}>
              {(option) => (
                <div
                  class={twMerge(
                    'flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm whitespace-nowrap',
                    highlightedOption()?.value == option.value
                      ? 'rounded bg-gray-100'
                      : '',
                  )}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setHighlightedOption(option)}
                >
                  {option.labelWrapper ? option.labelWrapper(option.label) : option.label}
                  <div class="ml-2.5 size-4">
                    <Show when={selectedOption()?.value === option.value}>
                      <CheckIcon class="size-4" />
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
      <Show when={local.helperText}>
        <HelperText content={local.helperText as string} color={otherProps.color} />
      </Show>
    </div>
  );
}
