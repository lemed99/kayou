import { JSX } from 'solid-js';
/**
 * Color variants for the Textarea component.
 */
export type TextareaColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';
/**
 * Props for the Textarea component.
 */
export interface TextareaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'> {
    /**
     * Helper text displayed below the textarea.
     */
    helperText?: string;
    /**
     * Label displayed above the textarea.
     */
    label?: string;
    /**
     * Color variant of the textarea.
     * @default 'gray'
     */
    color?: TextareaColor;
    /**
     * Whether the textarea is in a loading state.
     * @default false
     */
    isLoading?: boolean;
}
/**
 * Textarea component for multi-line text input.
 */
declare const Textarea: (props: TextareaProps) => JSX.Element;
export default Textarea;
