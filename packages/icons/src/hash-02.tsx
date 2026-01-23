import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Hash02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M9.49999 3L6.49999 21M17.5 3L14.5 21M20.5 8H3.5M19.5 16H2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
