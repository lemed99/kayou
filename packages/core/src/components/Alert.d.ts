import { JSX } from 'solid-js';
/**
 * Color variants for the Alert component.
 */
export type AlertColor = 'info' | 'failure' | 'success' | 'warning' | 'dark';
/**
 * Props for the Alert component.
 */
export interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * The color variant of the alert.
     * @default 'info'
     */
    color?: AlertColor;
    /**
     * Optional icon to display in the alert.
     */
    icon?: (props: {
        class: string;
    }) => JSX.Element;
    /**
     * Additional content to display below the main alert message.
     */
    additionalContent?: JSX.Element;
}
/**
 * Alert component for displaying important messages to users.
 * Uses role="alert" for screen reader accessibility.
 */
declare const Alert: (props: AlertProps) => JSX.Element;
export default Alert;
