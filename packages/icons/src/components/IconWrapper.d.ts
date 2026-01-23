import { JSX } from 'solid-js';

/**
 * Props for the IconWrapper component.
 */
export interface IconProps {
  /**
   * SVG stroke width.
   * @default 1.5
   */
  strokeWidth?: number;
  class?: string;
}
/**
 * IconWrapper component for wrapping SVG icon paths.
 * Decorative by default (aria-hidden="true").
 */
export declare const IconWrapper: (
  props: IconProps & {
    children: JSX.Element;
  },
) => JSX.Element;
