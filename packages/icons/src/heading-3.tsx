import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Heading3Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 12h8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
