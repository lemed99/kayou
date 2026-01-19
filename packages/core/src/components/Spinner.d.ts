import { JSX } from 'solid-js/jsx-runtime';
/**
 * Color variants for the Spinner component.
 */
export type SpinnerColor = 'gray' | 'dark' | 'failure' | 'info' | 'light' | 'success' | 'warning' | 'blue';
/**
 * Size variants for the Spinner component.
 */
export type SpinnerSize = 'xs' | 'sm' | 'md';
/**
 * Props for the Spinner component.
 */
export interface SpinnerProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
    /**
     * Color variant of the spinner.
     * @default 'info'
     */
    color?: SpinnerColor;
    /**
     * Size of the spinner.
     * @default 'sm'
     */
    size?: SpinnerSize;
}
/**
 * Spinner component for loading indicators.
 * Includes screen reader text for accessibility.
 */
declare const Spinner: (props: SpinnerProps) => JSX.Element;
export default Spinner;
