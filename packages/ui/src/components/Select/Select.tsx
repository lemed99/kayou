import { JSX, createSignal, splitProps } from 'solid-js';

import { ChevronDownButton, OptionLabel, optionClass } from '../../helpers/selectUtils';
import useSelect from './useSelect';
import TextInput, { TextInputProps } from '../TextInput';

/**
 * Option item for the Select component.
 */
export interface SelectOption {
  /** Unique value for the option. */
  value: string;
  /** Display label for the option. */
  label: string;
  /** Optional custom label renderer. */
  labelWrapper?: (label: string) => JSX.Element;
}

/**
 * Props for the Select component.
 */
export interface SelectProps extends Omit<TextInputProps, 'onSelect'> {
  /** Array of options to display in the dropdown. */
  options: SelectOption[];
  /** Callback fired when an option is selected. */
  onSelect: (option?: SelectOption) => void;
  /** Currently selected value. */
  value?: string;
  /** Height of each option row in pixels. */
  optionRowHeight?: number;
}

/**
 * Select dropdown component for single option selection.
 */
export default function Select(props: SelectProps): JSX.Element {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'value',
    'style',
    'optionRowHeight',
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
    selectedOption,
    handleKeyDown,
  } = useSelect(local, 'select');

  return (
    <Layout
      inputComponent={
        <div>
          <TextInput
            ref={setInputRef}
            required={local.required}
            value={selectedOption()?.label || ''}
            placeholder={props.placeholder}
            class="w-full"
            onKeyDown={handleKeyDown}
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

          <ChevronDownButton
            onFocus={() => inputRef()?.focus()}
            disabled={props.disabled || props.isLoading}
          />
        </div>
      }
      optionsComponent={(option) => (
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
