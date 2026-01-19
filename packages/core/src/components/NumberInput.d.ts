import { JSX } from 'solid-js';
import { TextInputProps } from './TextInput';
type ExtendedTextInputProps = Omit<TextInputProps, 'type' | 'onBlur' | 'showArrows' | 'onArrowUp' | 'onArrowDown' | 'arrowUpLabel' | 'arrowDownLabel'>;
export interface NumberInputProps extends ExtendedTextInputProps {
    /** Allow empty/null values. Defaults to true. */
    nullable?: boolean;
    /** Decimal places for float type. Defaults to 3. */
    precision?: number;
    /** Increment/decrement step amount. Defaults to 1. */
    step?: number;
    /** Show up/down arrow buttons. Defaults to false. */
    showArrows?: boolean;
    /** Allow negative number input. Defaults to false. */
    allowNegativeValues?: boolean;
    /** Number format: 'integer' or 'float'. Defaults to 'integer'. */
    type?: 'integer' | 'float';
    /** Callback with typed numeric value. Returns number or null if empty. */
    onValueChange?: (value: number | null) => void;
    /** Accessible label for increment button. Defaults to 'Increase value'. */
    arrowUpLabel?: string;
    /** Accessible label for decrement button. Defaults to 'Decrease value'. */
    arrowDownLabel?: string;
    /** Delay in ms before processing value after user stops typing. Defaults to 1000. Set to 0 to disable. */
    debounceDelay?: number;
}
declare const NumberInput: (props: NumberInputProps) => JSX.Element;
export default NumberInput;
