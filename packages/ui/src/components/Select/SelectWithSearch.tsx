import { JSX, Show, splitProps } from 'solid-js';

import { ClearContentButton, type Option } from '../../shared';
import TextInput, { type TextInputProps } from '../TextInput';
import { OptionLabel, optionClass } from './selectUtils';
import useSelect from './useSelect';

export interface SelectWithSearchProps extends Omit<TextInputProps, 'onSelect'> {
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
  /** Text shown when no search results match. Defaults to 'No results found'. */
  noSearchResultPlaceholder?: string;
  /** Custom call-to-action element at bottom of dropdown. */
  cta?: JSX.Element;
  /** Show loading spinner for lazy loading. */
  isLazyLoading?: boolean;
  /** Callback when scrolling for lazy loading. */
  onLazyLoad?: (scrollProgress: number) => void;
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
    'noSearchResultPlaceholder',
    'cta',
    'isLazyLoading',
    'onLazyLoad',
    'helperText',
    'label',
    'required',
    'disabled',
    'isLoading',
    'placeholder',
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
            {...otherProps}
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
          class={optionClass(option, highlightedOption())}
          onClick={() => handleOptionClick(option)}
          onMouseEnter={() => setHighlightedOption(option)}
        >
          <OptionLabel option={option} selectedOption={selectedOption()} />
        </div>
      )}
    />
  );
}
