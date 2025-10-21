import { JSX } from 'solid-js';

import { twMerge } from 'tailwind-merge';

export interface IconProps {
  strokeWidth?: number;
  class?: string;
}

export const IconWrapper = (props: IconProps & { children: JSX.Element }) => (
  <svg
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
