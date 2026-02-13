import { JSX, createEffect, createSignal, splitProps } from 'solid-js';

import { type BackgroundScrollBehavior } from '@kayou/hooks';

import { ChevronDownButton } from '../../shared';
import TextInput, { TextInputProps } from '../TextInput';
import { OptionLabel, optionClass } from './selectUtils';
import useSelect from './useSelect';

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
 * Props passed to a custom trigger element for the Select component.
 */
export interface SelectTriggerProps {
  /** The currently selected option, or null if none selected. */
  selectedOption: () => SelectOption | null;
  /** Whether the dropdown is currently open. */
  isOpen: () => boolean;
  /** Keyboard event handler for arrow keys, Enter, Escape, etc. Attach to your trigger element. */
  onKeyDown: (e: KeyboardEvent & { currentTarget: HTMLElement; target: Element }) => void;
  /** ID of the listbox element, for `aria-controls`. */
  listboxId: string;
  /** ID of the currently highlighted option, for `aria-activedescendant`. */
  highlightedOptionId: () => string | undefined;
  /** Whether the select is disabled. */
  disabled?: boolean;
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
  /** How to handle background scroll when dropdown is open. @default 'close' */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
  /** Custom trigger element. When provided, replaces the default TextInput. */
  inputComponent?: (triggerProps: SelectTriggerProps) => JSX.Element;
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
    'backgroundScrollBehavior',
    'inputComponent',
  ]);

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>();

  const {
    Layout,
    highlightedOption,
    handleOptionClick,
    setHighlightedOption,
    selectedOption,
    handleKeyDown,
    isOpen,
    listboxId,
  } = useSelect(local, 'select');

  const getOptionId = (option: SelectOption | null) =>
    option ? `${listboxId}-option-${option.value}` : undefined;

  // Manually sync aria-expanded to the DOM since prop drilling through
  // splitProps/spread can break SolidJS fine-grained reactivity
  createEffect(() => {
    const open = isOpen();
    const el = inputRef();
    if (el) {
      el.setAttribute('aria-expanded', String(open));
    }
  });

  return (
    <Layout
      inputComponent={
        local.inputComponent ? (
          local.inputComponent({
            selectedOption,
            isOpen,
            onKeyDown: handleKeyDown,
            listboxId,
            highlightedOptionId: () => getOptionId(highlightedOption()),
            disabled: props.disabled,
          })
        ) : (
          <div>
            <TextInput
              {...otherProps}
              ref={setInputRef}
              required={local.required}
              value={selectedOption()?.label || ''}
              placeholder={props.placeholder}
              class="w-full"
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={isOpen()}
              aria-controls={listboxId}
              aria-activedescendant={getOptionId(highlightedOption())}
              aria-haspopup="listbox"
              inputMode="none"
              autocomplete="off"
              style={{
                'caret-color': 'transparent',
                'padding-right': '36px',
                cursor: props.disabled || props.isLoading ? 'not-allowed' : 'pointer',
                ...(typeof local.style === 'object' && local.style !== null
                  ? local.style
                  : {}),
              }}
            />

            <ChevronDownButton
              onFocus={() => inputRef()?.focus()}
              disabled={props.disabled || props.isLoading}
            />
          </div>
        )
      }
      optionsComponent={(option) => (
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
