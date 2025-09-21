import { For, JSX, splitProps } from 'solid-js';

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
  helperText?: string;
}

export default function Select(props: SelectProps) {
  const [local, otherProps] = splitProps(props, [
    'options',
    'onSelect',
    'value',
    'helperText',
  ]);

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
            readOnly={true}
            value={selectedOption()?.label || ''}
            placeholder={props.placeholder}
            class="w-full"
            onKeyDown={handleKeyDown}
            style={{
              'padding-right': '36px',
              cursor: props.disabled ? 'not-allowed' : 'pointer',
            }}
            {...otherProps}
          />

          <ChevronDownButton />
        </>
      }
      optionsComponent={
        <For each={local.options}>
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
