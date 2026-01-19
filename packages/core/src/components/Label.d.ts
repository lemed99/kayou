import { JSX } from 'solid-js';
/**
 * Color variants for the Label component.
 */
export type LabelColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';
/**
 * Props for the Label component.
 */
export interface LabelProps extends Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, 'color'> {
    /**
     * Color variant of the label.
     * @default 'gray'
     */
    color?: LabelColor;
    /**
     * Text value to display in the label.
     */
    value?: string;
    children?: JSX.Element;
}
/**
 * Label component for form field labels.
 */
declare const Label: (props: LabelProps) => JSX.Element;
export default Label;
