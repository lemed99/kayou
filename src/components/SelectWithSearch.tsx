import { For, JSX, Show, createEffect, createSignal, splitProps } from 'solid-js';

import { autoPlacement, createFloating, offset } from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import { getScrollProgress } from '../helpers';
import { CheckIcon } from '../icons';
import Spinner from './Spinner';
import TextInput, { TextInputProps } from './TextInput';

interface Option {
  value: unknown;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export interface SelectWithSearchProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  onSelect: (option: Option) => void;
  onClear?: () => void;
  autoFillSearchKey?: boolean;
  idValue?: string;
  value?: string;
  reset?: boolean;
  setResetInput?: (state: boolean) => void;
  noSearchResultText: string;
  multiple?: boolean;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'onClear',
    'autoFillSearchKey',
    'idValue',
    'value',
    'reset',
    'setResetInput',
    'noSearchResultText',
    'multiple',
    'cta',
    'isLazyLoading',
    'onLazyLoad',
  ]);

  const [searchKey, setSearchKey] = createSignal('');
  const [selectedOption, setSelectedOption] = createSignal<Option | null>(null);
  const [highlightedOption, setHighlightedOption] = createSignal<Option | null>(null);

  const [filteredOptions, setFilteredOptions] = createSignal<Option[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);

  createEffect(() => {
    setFilteredOptions(local.options);
  });

  createEffect(() => {
    if (local.idValue && !local.reset) {
      const opt = local.options.find((o) => o.value == local.idValue);
      if (opt) setSearchKey(opt.label);
    } else if (local.value && !local.reset) {
      setSearchKey(local.value);
    } else if (local.reset) {
      setSearchKey('');
      local.setResetInput?.(false);
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
    }
    setSelectedOption(null);
    if (!isOpen()) setIsOpen(true);
  };

  const handleOptionClick = (option: Option) => {
    if (local.autoFillSearchKey) setSearchKey(option.label);
    setSelectedOption(option);
    setHighlightedOption(option);
    local.onSelect(option);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!props.disabled) {
      setIsOpen(true);
      if (!searchKey()) setFilteredOptions(props.options);
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  createEffect(() => {
    const el = refs.floating();
    if (!el) return;
    let lastScrollTop = el.scrollTop;
    let dir: 'up' | 'down' | 'none' = 'none';

    const handleLazyLoading = () => {
      const current = el.scrollTop;
      dir = current > lastScrollTop ? 'down' : current < lastScrollTop ? 'up' : 'none';
      lastScrollTop = current <= 0 ? 0 : current;
      const percent = getScrollProgress(el);
      if (local.isLazyLoading) return;
      if (dir !== 'down') return;
      local.onLazyLoad?.(percent);
    };

    el.addEventListener('scroll', handleLazyLoading);

    return () => {
      el.removeEventListener('scroll', handleLazyLoading);
    };
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

  return (
    <div class={twMerge('relative max-w-96')}>
      <TextInput
        ref={refs.setReference}
        type="search"
        value={searchKey()}
        onInput={handleSearchChange}
        placeholder={props.placeholder}
        onClick={handleInputClick}
        onBlur={() => {
          if (!searchKey() && props.onClear) props.onClear();
          props.onSelect({ value: '', label: searchKey() });
        }}
        onFocus={(e) => e.target.select()}
        class="w-full"
        onKeyDown={handleKeyDown}
        {...otherProps}
      />

      <Show when={isOpen()}>
        <div
          ref={refs.setFloating}
          class={twMerge(
            'scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 absolute z-50 box-border max-h-[200px] w-fit overflow-y-auto border border-gray-500 bg-gray-50 shadow-xl dark:bg-gray-700',
            finalPlacement() === 'top-start' ? 'bottom-full mb-1' : '',
            finalPlacement() === 'bottom-start' ? 'top-full mt-1' : '',
            finalPlacement() === 'top-end' ? 'right-0 bottom-full mb-1' : '',
            finalPlacement() === 'bottom-end' ? 'top-full right-0 mt-1' : '',
          )}
        >
          <For
            each={filteredOptions()}
            fallback={<div class="px-2.5 text-sm">{local.noSearchResultText}</div>}
          >
            {(option) => (
              <div
                class={twMerge(
                  'flex cursor-default justify-between px-2.5 py-0.5 text-sm whitespace-nowrap hover:bg-blue-500 hover:text-white',
                  highlightedOption()?.value == option.value
                    ? 'bg-blue-500 text-white'
                    : '',
                )}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedOption(option)}
              >
                {option.labelWrapper ? option.labelWrapper(option.label) : option.label}
                <Show when={selectedOption()?.value == option.value}>
                  <CheckIcon class="ml-2.5 h-4 w-4" />
                </Show>
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
      </Show>
    </div>
  );
}
