import { For, JSX, Show, splitProps } from 'solid-js';

import type { Option } from '../helpers/selectUtils';
import { ClearContentButton, OptionLabel, optionClass } from '../helpers/selectUtils';
import useSelect from '../hooks/useSelect';
import TextInput, { TextInputProps } from './TextInput';

export interface SelectWithSearchProps extends Omit<TextInputProps, 'onSelect'> {
  options: Option[];
  onSelect: (option?: Option) => void;
  clearValue?: boolean;
  autoFillSearchKey?: boolean;
  idValue?: string;
  value?: string;
  noSearchResultPlaceholder: string;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
  helperText?: string;
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'clearValue',
    'autoFillSearchKey',
    'idValue',
    'value',
    'noSearchResultPlaceholder',
    'cta',
    'isLazyLoading',
    'onLazyLoad',
    'helperText',
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
    filteredOptions,
    setFilteredOptions,
    setSelectedOption,
    setSearchKey,
    setSearchRef,
  } = useSelect(local, 'selectWithSearch');

  return (
    <Layout
      inputComponent={
        <>
          <TextInput
            ref={setSearchRef}
            value={searchKey()}
            onInput={handleSearchChange}
            placeholder={props.placeholder}
            onBlur={() => {
              if (!selectedOption() && searchKey())
                props.onSelect({ value: '', label: searchKey() });
            }}
            onFocus={(e) => e.target.select()}
            class="w-full"
            onKeyDown={handleKeyDown}
            {...otherProps}
          />

          <Show when={searchKey() && !props.disabled}>
            <ClearContentButton
              onClick={() => {
                setSelectedOption(null);
                setSearchKey('');
                setFilteredOptions(local.options);
                setHighlightedOption(null);
                (searchRef() as HTMLElement)?.focus();
              }}
            />
          </Show>
        </>
      }
      optionsComponent={
        <For
          each={filteredOptions()}
          fallback={
            <div class="px-2 py-1.5 text-sm">{local.noSearchResultPlaceholder}</div>
          }
        >
          {(option) => (
            <div
              class={optionClass(option, highlightedOption())}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedOption(option)}
            >
              <OptionLabel option={option} selectedOption={selectedOption()} />
            </div>
          )}
        </For>
      }
    />
  );
}
