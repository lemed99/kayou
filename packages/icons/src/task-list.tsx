import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const TaskListIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <rect
      x="3"
      y="5"
      width="6"
      height="6"
      rx="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="m3 17 2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 6h8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 12h8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 18h8" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
