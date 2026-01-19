import { type JSX, type ParentComponent } from 'solid-js';
import { Placement } from '../hooks/useFloating/types';
/**
 * Props for the Popover component.
 */
export interface PopoverProps {
    /**
     * Content to display inside the popover.
     */
    content: JSX.Element;
    /**
     * Trigger element that opens the popover.
     */
    children: JSX.Element;
    /**
     * Whether to trigger the popover on hover instead of click.
     * @default false
     */
    onHover?: boolean;
    /**
     * Position of the popover relative to the trigger.
     */
    position?: Placement;
    /**
     * Whether the popover is disabled/hidden.
     * @default false
     */
    hidden?: boolean;
    /**
     * Callback fired when the popover closes.
     */
    onClose?: () => void;
    /**
     * Additional CSS classes for the popover content container.
     */
    class?: string;
    /**
     * Offset from the trigger element in pixels.
     * @default 8
     */
    offset?: number;
    /**
     * Additional CSS classes for the floating container.
     */
    floatingClass?: string;
    /**
     * Callback fired when mouse enters the trigger or popover.
     */
    onMouseEnter?: () => void;
    /**
     * Callback fired when mouse leaves the trigger or popover.
     */
    onMouseLeave?: () => void;
    /**
     * Controlled open state. When provided, the component becomes controlled.
     */
    isOpen?: boolean;
    /**
     * Callback fired when the open state changes.
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Additional CSS classes for the wrapper container.
     */
    wrapperClass?: string;
    /**
     * Accessible label for the popover dialog.
     */
    'aria-label'?: string;
}
/**
 * A popover component that displays floating content relative to a trigger element.
 * Supports both click and hover triggers, keyboard navigation, and full accessibility.
 *
 * @example
 * ```tsx
 * <Popover content={<div>Popover content</div>}>
 *   <Button>Open Popover</Button>
 * </Popover>
 * ```
 */
declare const Popover: ParentComponent<PopoverProps>;
export default Popover;
