import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Expand06Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M16 8L21 3M21 3H16M21 3V8M8 8L3 3M3 3L3 8M3 3L8 3M8 16L3 21M3 21H8M3 21L3 16M16 16L21 21M21 21V16M21 21H16"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
