import { JSX } from 'solid-js/jsx-runtime';
/**
 * Props for the Skeleton component.
 */
export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Width of the skeleton. Can be a number (px) or string (e.g., '100%').
     * @default 50
     */
    width?: string | number;
    /**
     * Height of the skeleton. Can be a number (px) or string (e.g., '100%').
     * @default 10
     */
    height?: string | number;
    /**
     * Gray shade for light mode (100-900).
     * @default 100
     */
    gray?: number;
    /**
     * Gray shade for dark mode (100-900).
     * @default 700
     */
    darkGray?: number;
}
/**
 * Skeleton component for loading placeholders.
 * Uses aria-busy and aria-label for accessibility.
 */
declare const Skeleton: (props: SkeletonProps) => JSX.Element;
export default Skeleton;
