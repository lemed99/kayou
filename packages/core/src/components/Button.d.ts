import { JSX } from 'solid-js';
/**
 * Color variants for the Button component.
 */
export type ButtonColor = 'gray' | 'dark' | 'failure' | 'info' | 'light' | 'success' | 'warning' | 'blue';
/**
 * Size variants for the Button component.
 */
export type ButtonSize = 'xs' | 'sm' | 'md';
export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The color variant of the button.
     * @default 'info'
     */
    color?: ButtonColor;
    /**
     * The size of the button.
     * @default 'md'
     */
    size?: ButtonSize;
    /**
     * Shows a loading spinner and disables interactions.
     * @default false
     */
    isLoading?: boolean;
}
declare const Button: (props: ButtonProps) => JSX.Element;
export default Button;
