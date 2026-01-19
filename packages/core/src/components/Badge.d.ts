import { JSX } from 'solid-js';
/**
 * Color variants for the Badge component.
 */
export type BadgeColor = 'gray' | 'failure' | 'warning' | 'success' | 'dark' | 'default';
/**
 * Size variants for the Badge component.
 */
export type BadgeSize = 'xs' | 'sm';
/**
 * Props for the Badge component.
 */
export interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * The color variant of the badge.
     * @default 'default'
     */
    color?: BadgeColor;
    /**
     * The size of the badge.
     * @default 'xs'
     */
    size?: BadgeSize;
}
/**
 * Badge component for displaying small status indicators or labels.
 */
declare const Badge: (props: BadgeProps) => JSX.Element;
export default Badge;
