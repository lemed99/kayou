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

import { getScrollProgress } from '../helpers';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '../icons';
import Checkbox from './Checkbox';
import HelperText from './HelperText';
import Spinner from './Spinner';
import TextInput, { TextInputProps } from './TextInput';

interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export interface MultiSelectProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  onSelect: (options?: Option[]) => void;
  clearValues?: boolean;
  values: string[];
  withSearch?: boolean;
  noSearchResultPlaceholder: string;
  searchPlaceholder: string;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
  helperText?: string;
}

export default function MultiSelect(props: MultiSelectProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'clearValues',
    'values',
    'withSearch',
    'noSearchResultPlaceholder',
    'searchPlaceholder',
    'cta',
    'isLazyLoading',
    'onLazyLoad',
    'helperText',
  ]);

  const [searchKey, setSearchKey] = createSignal('');
  const [selectedOptions, setSelectedOptions] = createSignal<Option[]>([]);
  const [highlightedOption, setHighlightedOption] = createSignal<Option | null>(null);

  const [filteredOptions, setFilteredOptions] = createSignal<Option[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);
  const [optionsContainerRef, setOptionsContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();

  let searchRef: HTMLInputElement | undefined;

  createEffect(() => {
    setFilteredOptions(local.options);
  });

  createEffect(() => {
    if (local.values && local.values.length > 0) {
      const selected = local.options.filter((o) => local.values.includes(o.value));
      setSelectedOptions(selected);
    }
  });

  createEffect(() => {
    if (local.clearValues) {
      setSelectedOptions([]);
      local.onSelect([]);
    }
  });

  const handleSearchChange = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const value = e.target.value;
    setSearchKey(value);
    if (!value) {
      setFilteredOptions(local.options);
    } else {
      setFilteredOptions(
        local.options.filter((opt) =>
          opt.label.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setHighlightedOption(filteredOptions()[0]);
    }
    if (!isOpen()) setIsOpen(true);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOptions((prev) => {
      if (prev.some((o) => o.value === option.value)) {
        return prev.filter((o) => o.value !== option.value);
      }
      return [...prev, option];
    });
    setHighlightedOption(option);
    local.onSelect(selectedOptions());
    if (local.withSearch === true) {
      (searchRef as HTMLElement)?.focus();
    }
  };

  const handleInputClick = () => {
    if (!props.disabled) {
      setIsOpen(true);
      if (local.withSearch === true) {
        (searchRef as HTMLElement)?.focus();
        if (!searchKey()) setFilteredOptions(props.options);
      }
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

  createEffect(() => {
    const el = optionsContainerRef();
    if (!el) return;

    let lastScrollTop = el.scrollTop;
    let dir: 'up' | 'down' | 'none' = 'none';

    const handleLazyLoading = () => {
      const current = el.scrollTop;
      dir = current > lastScrollTop ? 'down' : current < lastScrollTop ? 'up' : 'none';
      lastScrollTop = current <= 0 ? 0 : current;
      const progress = getScrollProgress(el);
      if (local.isLazyLoading) return;
      if (dir !== 'down') return;
      local.onLazyLoad?.(progress);
    };

    el.addEventListener('scroll', handleLazyLoading);

    onCleanup(() => el.removeEventListener('scroll', handleLazyLoading));
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
        if (filteredOptions().length === 0) return null;
        if (!prev) return filteredOptions()[filteredOptions().length - 1];
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === 0) {
          return prev;
        }
        if (currentIndex === -1) {
          return filteredOptions()[filteredOptions().length - 1];
        }
        return filteredOptions()[currentIndex - 1];
      });
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption((prev) => {
        if (filteredOptions().length === 0) return null;
        if (!prev) return filteredOptions()[0];
        const currentIndex = filteredOptions().findIndex((o) => o.value === prev.value);
        if (currentIndex === filteredOptions().length - 1) {
          return prev;
        }
        if (currentIndex === -1) {
          return filteredOptions()[0];
        }
        return filteredOptions()[currentIndex + 1];
      });
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      const currentIndex = highlightedOption()
        ? filteredOptions().findIndex((o) => o.value === highlightedOption()?.value)
        : -1;
      if (highlightedOption() && currentIndex !== -1) {
        handleOptionClick(highlightedOption()!);
      } else if (filteredOptions().length === 1) {
        handleOptionClick(filteredOptions()[0]);
      }
      return;
    }
  };

  const getDisplayValue = () => {
    if (selectedOptions().length === 0) return '';
    return selectedOptions()
      .map((o) => o.label)
      .join(' • ');
  };

  return (
    <div class="w-full">
      <div class="relative w-full">
        <div ref={refs.setReference} onClick={handleInputClick} class="relative w-full">
          <TextInput
            title={getDisplayValue()}
            readOnly={true}
            disabled={props.disabled}
            value={getDisplayValue()}
            placeholder={props.placeholder}
            class="w-full"
            onKeyDown={handleKeyDown}
            style={{
              'padding-right': '36px',
              cursor: props.disabled ? 'not-allowed' : 'pointer',
            }}
            {...otherProps}
          />
          <Show
            when={getDisplayValue() && !props.disabled}
            fallback={
              <button
                type="button"
                onClick={() => {
                  if (local.withSearch === true) (searchRef as HTMLElement)?.focus();
                }}
                class="absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronDownIcon class="size-4" />
              </button>
            }
          >
            <button
              type="button"
              onClick={(e: Event) => {
                setSelectedOptions([]);
                local.onSelect([]);
                if (local.withSearch === true) (searchRef as HTMLElement)?.focus();
                e.stopPropagation();
              }}
              class="absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              <XMarkIcon class="size-4" />
            </button>
          </Show>
        </div>

        <Show when={isOpen()}>
          <div
            ref={refs.setFloating}
            class={twMerge(
              'absolute z-50 w-fit min-w-3xs rounded-lg border border-gray-200 bg-white shadow dark:bg-gray-700',
              finalPlacement() === 'top-start' ? 'bottom-full mb-1' : '',
              finalPlacement() === 'bottom-start' ? 'top-full mt-1' : '',
              finalPlacement() === 'top-end' ? 'right-0 bottom-full mb-1' : '',
              finalPlacement() === 'bottom-end' ? 'top-full right-0 mt-1' : '',
            )}
          >
            <Show when={local.withSearch === true}>
              <div class="flex items-center border-b border-gray-200 px-3 dark:border-gray-600">
                <MagnifyingGlassIcon class="size-4 text-gray-400" />
                <input
                  ref={searchRef}
                  value={searchKey()}
                  onInput={handleSearchChange}
                  placeholder={local.searchPlaceholder}
                  onFocus={(e) => e.target.select()}
                  class="w-full max-w-xs px-2 py-3 text-sm outline-none"
                  onKeyDown={handleKeyDown}
                />
                <Show when={searchKey() && !props.disabled}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKey('');
                      setFilteredOptions(local.options);
                      setHighlightedOption(null);
                      (searchRef as HTMLElement)?.focus();
                    }}
                    class="ml-3 h-full cursor-pointer text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <XMarkIcon class="size-4" />
                  </button>
                </Show>
              </div>
            </Show>
            <div
              ref={setOptionsContainerRef}
              class="scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 box-border max-h-[200px] overflow-y-auto p-1"
            >
              <For
                each={filteredOptions()}
                fallback={
                  <div class="px-2 py-1.5 text-sm">{local.noSearchResultPlaceholder}</div>
                }
              >
                {(option) => (
                  <div
                    class={twMerge(
                      'flex cursor-pointer items-center text-sm whitespace-nowrap',
                      highlightedOption()?.value == option.value
                        ? 'rounded bg-gray-100'
                        : '',
                    )}
                    onMouseEnter={() => setHighlightedOption(option)}
                  >
                    <Checkbox
                      labelClass="px-2 py-1.5 w-full"
                      class="flex items-center"
                      onChange={() => handleOptionClick(option)}
                      checked={selectedOptions().some((o) => o.value === option.value)}
                      label={
                        option.labelWrapper
                          ? option.labelWrapper(option.label)
                          : option.label
                      }
                    />
                  </div>
                )}
              </For>
              <Show when={local.isLazyLoading}>
                <div class="p-1 text-center">
                  <Spinner color="gray" size="xs" />
                </div>
              </Show>
              <Show when={local.cta}>{local.cta}</Show>
            </div>
          </div>
        </Show>
      </div>
      <Show when={local.helperText}>
        <HelperText content={local.helperText as string} color={otherProps.color} />
      </Show>
    </div>
  );
}
