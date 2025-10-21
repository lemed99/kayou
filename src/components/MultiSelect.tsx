import { JSX, Show, createSignal, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { ChevronDownButton, ClearContentButton } from '../helpers/selectUtils';
import useSelect from '../hooks/useSelect';
import { SearchRefractionIcon } from '../icons';
import Checkbox from './Checkbox';
import TextInput, { TextInputProps } from './TextInput';

interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}

export interface MultiSelectProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  onMultiSelect: (options?: Option[]) => void;
  clearValues?: boolean;
  values: string[];
  optionRowHeight?: number;
  withSearch?: boolean;
  displayValue?: string;
  noSearchResultPlaceholder?: string;
  searchPlaceholder?: string;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
}

export default function MultiSelect(props: MultiSelectProps) {
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
  } = useSelect(local, 'multiSelect');

  const getDisplayValue = () => {
    if (selectedOptions().length === 0) return '';
    return selectedOptions()
      .reverse()
      .map((o) => o.label)
      .join(' • ');
  };

  return (
    <Layout
      inputComponent={
        <>
          <TextInput
            ref={setInputRef}
            title={getDisplayValue()}
            readOnly={true}
            disabled={props.disabled}
            value={local.displayValue ?? getDisplayValue()}
            placeholder={props.placeholder}
            class="w-full"
            onKeyDown={handleKeyDown}
            style={{
              'padding-right': '36px',
              cursor: props.disabled ? 'not-allowed' : 'pointer',
              ...(typeof local.style === 'object' && local.style !== null
                ? local.style
                : {}),
            }}
            {...otherProps}
          />
          <Show
            when={!local.displayValue && getDisplayValue() && !props.disabled}
            fallback={
              <ChevronDownButton
                onFocus={() => {
                  (inputRef() as HTMLElement)?.focus();
                }}
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
          <div class="relative flex items-center border-b border-gray-200 px-3 dark:border-gray-600">
            <SearchRefractionIcon class="size-4 text-gray-400" />
            <input
              ref={setSearchRef}
              value={searchKey()}
              onInput={handleSearchChange}
              placeholder={local.searchPlaceholder}
              onFocus={(e) => e.target.select()}
              class="w-full max-w-xs py-3 pl-2 text-sm outline-none"
              onKeyDown={handleKeyDown}
            />
            <Show when={searchKey() && !props.disabled}>
              <ClearContentButton
                onClick={() => {
                  setSearchKey('');
                  setFilteredOptions(local.options);
                  setHighlightedOption(null);
                  (searchRef() as HTMLElement)?.focus();
                }}
                class="ml-3 h-full cursor-pointer text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              />
            </Show>
          </div>
        </Show>
      }
      optionsComponent={(option) => (
        <div
          class={twMerge(
            'flex cursor-pointer items-center text-sm whitespace-nowrap',
            highlightedOption()?.value == option.value ? 'rounded bg-blue-50' : '',
          )}
          onMouseEnter={() => setHighlightedOption(option)}
        >
          <Checkbox
            labelClass="px-2 py-1.5 w-full"
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
