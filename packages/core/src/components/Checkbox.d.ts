import { JSX } from 'solid-js';
/**
 * Color variants for the Checkbox component.
 */
export type CheckboxColor = 'blue' | 'dark';
/**
 * Props for the Checkbox component.
 */
export interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Label text or element for the checkbox.
     */
    label?: JSX.Element;
    /**
     * Position of the label relative to the checkbox.
     * @default 'right'
     */
    labelPosition?: 'left' | 'right';
    /**
     * Additional CSS classes for the label wrapper.
     */
    labelClass?: string;
    /**
     * Additional CSS classes for the label text span.
     */
    labelSpanClass?: string;
    /**
     * Color variant for the checked state.
     * @default 'blue'
     */
    color?: CheckboxColor;
}
/**
 * Checkbox component with label support.
 */
declare const Checkbox: (props: CheckboxProps) => JSX.Element;
export default Checkbox;
