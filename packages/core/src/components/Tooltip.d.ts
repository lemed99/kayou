import { JSX } from 'solid-js';
/**
 * Placement options for the Tooltip.
 */
export type TooltipPlacement = 'top' | 'bottom' | 'right' | 'left';
/**
 * Theme options for the Tooltip.
 */
export type TooltipTheme = 'dark' | 'light' | 'auto';
/**
 * Props for the Tooltip component.
 */
export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Position of the tooltip relative to the trigger element.
     * @default 'top'
     */
    placement?: TooltipPlacement;
    /**
     * Theme variant of the tooltip.
     * @default 'auto'
     */
    theme?: TooltipTheme;
    /**
     * Content to display inside the tooltip.
     */
    content: string | JSX.Element;
    /**
     * Whether to hide the tooltip.
     * @default false
     */
    hidden?: boolean;
    /**
     * Delay in milliseconds before showing the tooltip.
     * @default 0
     */
    showDelay?: number;
    /**
     * Delay in milliseconds before hiding the tooltip.
     * @default 0
     */
    hideDelay?: number;
    /**
     * Additional CSS classes for the trigger wrapper element.
     */
    wrapperClass?: string;
}
/**
 * Tooltip component for displaying contextual information on hover or focus.
 * Supports keyboard navigation and screen readers.
 */
declare const Tooltip: (props: TooltipProps) => JSX.Element;
export default Tooltip;
