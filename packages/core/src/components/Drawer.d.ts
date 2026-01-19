import { JSX } from 'solid-js';
/**
 * Position options for the Drawer component.
 */
export type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';
/**
 * Props for the Drawer component.
 */
export interface DrawerProps extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
    children?: JSX.Element;
    /**
     * Whether the drawer is visible.
     * @default false
     */
    show?: boolean;
    /**
     * Position from which the drawer slides in.
     * @default 'right'
     */
    position?: DrawerPosition;
    /**
     * Width of the drawer (for left/right positions).
     */
    width?: string;
    /**
     * Height of the drawer (for top/bottom positions).
     */
    height?: string;
    /**
     * Callback fired when the drawer is closed.
     */
    onClose: (event: MouseEvent) => void;
    /**
     * Whether to show rounded edges on the drawer.
     * @default false
     */
    roundedEdges?: boolean;
    /**
     * Whether to show the header with close button.
     * @default false
     */
    showHeader?: boolean;
    /**
     * Additional CSS classes for the body content.
     */
    bodyClass?: string;
}
/**
 * Drawer component that slides in from the edge of the screen.
 * Uses role="dialog" and aria-modal for accessibility.
 */
declare const Drawer: (props: DrawerProps) => JSX.Element;
export default Drawer;
