import { JSX } from 'solid-js';
import { TextInputProps } from './TextInput';
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
export default function Select(props: SelectProps): JSX.Element;
