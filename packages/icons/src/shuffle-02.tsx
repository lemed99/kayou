import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Shuffle02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 16V21M21 21H16M21 21L15 15M3 3L9 9M16 3H21M21 3V8M21 3L3 21"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
