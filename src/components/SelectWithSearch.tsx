import { JSX, Show, splitProps } from 'solid-js';

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
  optionRowHeight?: number;
  noSearchResultPlaceholder: string;
  cta?: JSX.Element;
  isLazyLoading?: boolean;
  onLazyLoad?: (scrollProgress: number) => void;
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
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
            required={local.required}
            onKeyDown={handleKeyDown}
            {...otherProps}
          />

          <Show when={searchKey() && !props.disabled && !props.isLoading}>
            <ClearContentButton
              onClick={() => {
                setSelectedOption(null);
                setSearchKey('');
                setFilteredOptions(local.options);
                setHighlightedOption(null);
                (searchRef() as HTMLElement)?.focus();
                props.onSelect({ value: '', label: '' });
              }}
            />
          </Show>
        </>
      }
      optionsComponent={(option: Option) => (
        <div
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
