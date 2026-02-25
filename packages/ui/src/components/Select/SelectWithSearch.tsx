import { JSX, Show, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { ClearContentButton, type Option } from '../../shared';
import TextInput, { type TextInputProps } from '../TextInput';
import { OptionLabel, groupedOptionIndent, optionClass } from './selectUtils';
import useSelect, { type SelectAriaLabels, type SelectLabels } from './useSelect';

export interface SelectWithSearchProps extends Omit<TextInputProps, 'onSelect' | 'labels' | 'ariaLabels'> {
  /** Array of options to display in the dropdown. */
  options: Option[];
  /** Callback when an option is selected. */
  onSelect: (option?: Option) => void;
  /** When true, clears the current selection. */
  clearValue?: boolean;
  /** Auto-fill search input with selected option's label. */
  autoFillSearchKey?: boolean;
  /** ID of the option to pre-select by value. */
  idValue?: string;
  /** Initial search text value. */
  value?: string;
  /** Height of each option row for virtualization. */
  optionRowHeight?: number;
  /** Custom call-to-action element at bottom of dropdown. */
  cta?: JSX.Element;
  /** Show loading spinner when loading more items (infinite scroll). */
  isLoadingMore?: boolean;
  /** Callback when user scrolls near bottom of list (infinite scroll). */
  onLoadMore?: (scrollProgress: number) => void;
  /** i18n labels for visible texts */
  labels?: Partial<SelectLabels>;
  /** i18n aria labels for screen-reader-only texts */
  ariaLabels?: Partial<SelectAriaLabels>;
  /** Custom class for the reference (trigger wrapper) element. */
  referenceClass?: string;
  /** Custom class for the floating (dropdown) element. */
  floatingClass?: string;
}

export default function SelectWithSearch(props: SelectWithSearchProps): JSX.Element {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'clearValue',
    'autoFillSearchKey',
    'idValue',
    'value',
    'optionRowHeight',
    'cta',
    'isLoadingMore',
    'onLoadMore',
    'helperText',
    'label',
    'required',
    'disabled',
    'isLoading',
    'placeholder',
    'labels',
    'ariaLabels',
  ]);

  const {
    Layout,
    highlightedOption,
    handleOptionClick,
    setHighlightedOption,
    selectedOption,
    handleKeyDown,
    searchRef,
    searchKey,
    handleSearchChange,
    setFilteredOptions,
    setSelectedOption,
    setSearchKey,
    setSearchRef,
    isOpen,
    listboxId,
  } = useSelect(local, 'selectWithSearch');

  // Generate option ID for aria-activedescendant
  const getOptionId = (option: Option | null) =>
    option ? `${listboxId}-option-${option.value}` : undefined;

  return (
    <Layout
      inputComponent={
        <>
          <TextInput
            {...otherProps}
            ref={setSearchRef}
            value={searchKey()}
            onInput={handleSearchChange}
            placeholder={local.placeholder}
            disabled={local.disabled}
            isLoading={local.isLoading}
            onBlur={() => {
              if (!selectedOption() && searchKey())
                local.onSelect({ value: '', label: searchKey() });
            }}
            onFocus={(e) => e.target.select()}
            class="w-full"
            required={local.required}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen()}
            aria-controls={listboxId}
            aria-activedescendant={getOptionId(highlightedOption())}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            autocomplete="off"
          />

          <Show when={searchKey() && !local.disabled && !local.isLoading}>
            <ClearContentButton
              onClick={() => {
                setSelectedOption(null);
                setSearchKey('');
                setFilteredOptions(local.options);
                setHighlightedOption(null);
                searchRef()?.focus();
                local.onSelect({ value: '', label: '' });
              }}
            />
          </Show>
        </>
      }
      optionsComponent={(option: Option) => (
        <div
          id={getOptionId(option)}
          role="option"
          aria-selected={selectedOption()?.value === option.value}
          aria-disabled={option.disabled || undefined}
          class={twMerge(
            optionClass(option, highlightedOption()),
            option.group != null && groupedOptionIndent,
          )}
          onClick={() => handleOptionClick(option)}
          onMouseEnter={() => !option.disabled && setHighlightedOption(option)}
        >
          <OptionLabel option={option} selectedOption={selectedOption()} />
        </div>
      )}
    />
  );
}
