import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Heading02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M6 4V20M18 4V20M9.5 4V20M11.5 4H4M18 12H9.5M11.5 20H4M20 20H16M20 4H16"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
