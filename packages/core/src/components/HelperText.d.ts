import { JSX } from 'solid-js';
/**
 * Color variants for the HelperText component.
 */
export type HelperTextColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';
/**
 * Props for the HelperText component.
 */
export interface HelperTextProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
    /**
     * The helper text content to display.
     */
    content: string;
    class?: string;
    /**
     * Color variant of the helper text.
     * @default 'gray'
     */
    color?: HelperTextColor;
}
/**
 * HelperText component for displaying form field hints or error messages.
 */
declare const HelperText: (props: HelperTextProps) => JSX.Element;
export default HelperText;
