import { Component, JSX, ValidComponent } from 'solid-js';
/**
 * Props for the Breadcrumb component.
 */
export interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {
    children?: JSX.Element;
}
/**
 * Props for individual breadcrumb items.
 */
export interface BreadcrumbItemProps extends Omit<JSX.LiHTMLAttributes<HTMLLIElement>, 'ref'> {
    /**
     * URL for the breadcrumb link. If not provided, renders as text.
     */
    href?: string;
    children?: JSX.Element;
    ref?: HTMLLIElement;
    /**
     * Whether this item represents the current page.
     * @default false
     */
    isCurrent?: boolean;
    /**
     * Custom component to render the link (e.g., Router's Link component).
     * @default 'a'
     */
    as?: ValidComponent | Component<{
        href?: string;
        class?: string;
        children?: JSX.Element;
    }>;
}
declare const _default: ((props: BreadcrumbProps) => JSX.Element) & {
    Item: (props: BreadcrumbItemProps) => JSX.Element;
};
export default _default;
