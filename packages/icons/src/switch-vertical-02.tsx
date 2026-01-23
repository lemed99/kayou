import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const SwitchVertical02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M7 4V20M7 20L3 16M7 20L11 16M17 20V4M17 4L13 8M17 4L21 8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
