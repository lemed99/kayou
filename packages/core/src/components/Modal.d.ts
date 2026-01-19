import { JSX } from 'solid-js';
/**
 * Size variants for the Modal component.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'screen';
/**
 * Position options for the Modal component.
 */
export type ModalPosition = 'top-center' | 'center';
/**
 * Props for the Modal component.
 */
export interface ModalProps extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
    /**
     * Whether the modal is visible.
     * @default false
     */
    show?: boolean;
    /**
     * Size variant of the modal.
     * @default 'md'
     */
    size?: ModalSize;
    /**
     * Position of the modal on screen.
     * @default 'top-center'
     */
    position?: ModalPosition;
    /**
     * Callback fired when the modal is closed.
     */
    onClose: (event: MouseEvent) => void;
    children: JSX.Element;
}
/**
 * Modal dialog component with backdrop and close button.
 * Uses role="dialog" and aria-modal for accessibility.
 */
declare const Modal: (props: ModalProps) => JSX.Element;
export default Modal;
