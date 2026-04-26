import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Heading2Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 12h8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
