import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const SwitchHorizontal02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M4 17H20M20 17L16 13M20 17L16 21M20 7H4M4 7L8 3M4 7L8 11"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
