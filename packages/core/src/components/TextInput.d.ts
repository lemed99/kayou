import { JSX } from 'solid-js';
export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    /** Input size variant. Defaults to 'md'. */
    sizing?: 'xs' | 'sm' | 'md';
    /** Helper text displayed below the input. */
    helperText?: string;
    /** Label text displayed above the input. */
    label?: string;
    /** Addon element displayed before the input. */
    addon?: JSX.Element;
    /** Icon component rendered inside the input. */
    icon?: (props: {
        class: string;
    }) => JSX.Element;
    /** Color variant for styling and validation states. Defaults to 'gray'. */
    color?: 'gray' | 'info' | 'failure' | 'warning' | 'success';
    /** Show increment/decrement arrow buttons. Defaults to false. */
    showArrows?: boolean;
    /** Adjust input width to fit content. Defaults to false. */
    fitContent?: boolean;
    /** Callback when increment arrow is pressed. */
    onArrowUp?: (event: MouseEvent) => void;
    /** Callback when decrement arrow is pressed. */
    onArrowDown?: (event: MouseEvent) => void;
    /** Callback when increment arrow is released. */
    onArrowUpMouseUp?: (event: MouseEvent) => void;
    /** Callback when decrement arrow is released. */
    onArrowDownMouseUp?: (event: MouseEvent) => void;
    /** Ref callback for the increment button. */
    upBtnRef?: (el: HTMLButtonElement) => void;
    /** Ref callback for the decrement button. */
    downBtnRef?: (el: HTMLButtonElement) => void;
    /** Show loading spinner and disable input. Defaults to false. */
    isLoading?: boolean;
    /** Additional CSS class for the input element. */
    inputClass?: string;
    /** Accessible label for the increment arrow button. Defaults to 'Increase value'. */
    arrowUpLabel?: string;
    /** Accessible label for the decrement arrow button. Defaults to 'Decrease value'. */
    arrowDownLabel?: string;
}
declare const TextInput: (props: TextInputProps) => JSX.Element;
export default TextInput;
