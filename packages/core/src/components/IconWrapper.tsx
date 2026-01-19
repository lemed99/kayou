import { JSX } from 'solid-js';

import { twMerge } from 'tailwind-merge';

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
export const IconWrapper = (
  props: IconProps & { children: JSX.Element },
): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width={props.strokeWidth || 1.5}
    stroke="currentColor"
    class={twMerge('size-4', props.class)}
  >
    {props.children}
  </svg>
);
