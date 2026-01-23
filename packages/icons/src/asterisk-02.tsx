import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Asterisk02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M12 4V20M18 6L6 18M20 12H4M18 18L6 6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
