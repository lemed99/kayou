import { JSX, createSignal, splitProps } from 'solid-js';

import { ChevronDownButton, OptionLabel, optionClass } from '../helpers/selectUtils';
import useSelect from '../hooks/useSelect';
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
  optionRowHeight?: number;
  helperText?: string;
}

export default function Select(props: SelectProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'value',
    'style',
    'optionRowHeight',
    'helperText',
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
        <>
          <TextInput
            ref={setInputRef}
            readOnly={true}
            value={selectedOption()?.label || ''}
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

          <ChevronDownButton onClick={() => inputRef()?.focus()} />
        </>
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
