import { JSX, Show, createMemo, createSignal, splitProps } from 'solid-js';

import { SearchRefractionIcon } from '@exowpee/solidly-icons';
import { twMerge } from 'tailwind-merge';

import { ChevronDownButton, ClearContentButton } from '../helpers';
import { useSelect } from '../hooks';
import Checkbox from './Checkbox';
import TextInput, { type TextInputProps } from './TextInput';

interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export interface MultiSelectProps extends Omit<TextInputProps, 'onSelect'> {
  /** Array of options to display in the dropdown */
  options: Option[];

  /** Callback fired when selection changes */
  onMultiSelect: (options?: Option[]) => void;

  /** When true, clears all selected values */
  clearValues?: boolean;

  /** Array of currently selected option values */
  values?: string[];

  /** Height in pixels for each option row (enables virtualization for large lists) */
  optionRowHeight?: number;

  /** Enable search/filter functionality in dropdown */
  withSearch?: boolean;

  /** Custom display value to show in the input (overrides computed value) */
  displayValue?: string;

  /** Message shown when search yields no results */
  noSearchResultPlaceholder?: string;

  /** Placeholder text for the search input */
  searchPlaceholder?: string;

  /** Custom element to render at the bottom of the dropdown */
  cta?: JSX.Element;

  /** Whether lazy loading is currently in progress */
  isLazyLoading?: boolean;

  /** Callback fired when user scrolls near the bottom of the list */
  onLazyLoad?: (scrollProgress: number) => void;
}

export default function MultiSelect(props: MultiSelectProps): JSX.Element {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onMultiSelect',
    'clearValues',
    'style',
    'values',
    'optionRowHeight',
    'withSearch',
    'displayValue',
    'noSearchResultPlaceholder',
    'searchPlaceholder',
    'cta',
    'isLazyLoading',
    'onLazyLoad',
    'helperText',
    'label',
    'required',
  ]);

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>();

  const {
    Layout,
    highlightedOption,
    handleOptionClick,
    setHighlightedOption,
    selectedOptions,
    handleKeyDown,
    searchRef,
    searchKey,
    handleSearchChange,
    setFilteredOptions,
    setSelectedOptions,
    setSearchKey,
    setSearchRef,
    isOpen,
    listboxId,
    searchInputId,
  } = useSelect(local, 'multiSelect');

  const displayValue = createMemo(() => {
    const selected = selectedOptions();
    if (selected.length === 0) return '';
    return selected
      .map((o) => o.label)
      .reverse()
      .join(' • ');
  });

  return (
    <Layout
      inputComponent={
        <>
          <TextInput
            ref={setInputRef}
            title={displayValue()}
            disabled={props.disabled}
            value={local.displayValue ?? displayValue()}
            placeholder={props.placeholder}
            class="w-full"
            required={local.required}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen()}
            aria-controls={listboxId}
            style={{
              'caret-color': 'transparent',
              'padding-right': '36px',
              cursor: props.disabled || props.isLoading ? 'not-allowed' : 'pointer',
              ...(typeof local.style === 'object' && local.style !== null
                ? local.style
                : {}),
            }}
            {...otherProps}
          />
          <Show
            when={
              !local.displayValue && displayValue() && !props.disabled && !props.isLoading
            }
            fallback={
              <ChevronDownButton
                onFocus={() => {
                  (inputRef() as HTMLElement)?.focus();
                }}
                disabled={props.disabled || props.isLoading}
              />
            }
          >
            <ClearContentButton
              onClick={(e: Event) => {
                setSelectedOptions([]);
                local.onMultiSelect([]);
                if (local.withSearch === true) (searchRef() as HTMLElement)?.focus();
                else (inputRef() as HTMLElement)?.focus();
                e.stopPropagation();
              }}
            />
          </Show>
        </>
      }
      preOptionsComponent={
        <Show when={local.withSearch === true}>
          <div class="relative flex min-w-[210px] items-center border-b border-gray-200 px-3 dark:border-gray-700">
            <SearchRefractionIcon
              class="size-4 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <label for={searchInputId} class="sr-only">
              Search options
            </label>
            <input
              id={searchInputId}
              ref={setSearchRef}
              value={searchKey()}
              onInput={handleSearchChange}
              placeholder={local.searchPlaceholder}
              onFocus={(e) => e.target.select()}
              class="w-full max-w-xs bg-transparent py-3 pl-2 text-sm outline-none dark:text-white"
              onKeyDown={(e) => handleKeyDown(e, true)}
              aria-label="Search options"
              aria-controls={listboxId}
            />
            <Show when={searchKey() && !props.disabled && !props.isLoading}>
              <ClearContentButton
                onClick={() => {
                  setSearchKey('');
                  setFilteredOptions(local.options);
                  setHighlightedOption(null);
                  (searchRef() as HTMLElement)?.focus();
                }}
                class="ml-3 h-full cursor-pointer text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500"
              />
            </Show>
          </div>
        </Show>
      }
      optionsComponent={(option) => (
        <div
          role="option"
          aria-selected={selectedOptions().some((o) => o.value === option.value)}
          class={twMerge(
            'flex cursor-pointer items-center whitespace-nowrap text-sm',
            highlightedOption()?.value == option.value
              ? 'rounded bg-blue-50 dark:bg-gray-600'
              : '',
          )}
          onMouseEnter={() => setHighlightedOption(option)}
        >
          <Checkbox
            labelClass="px-2 py-1.5 w-full font-normal"
            class="flex items-center"
            onChange={() => handleOptionClick(option)}
            checked={selectedOptions().some((o) => o.value === option.value)}
            label={option.labelWrapper ? option.labelWrapper(option.label) : option.label}
          />
        </div>
      )}
    />
  );
}
