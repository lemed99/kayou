import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowsDownIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M17 4V15M17 15L13 11M17 15L21 11M7 4V20M7 20L3 16M7 20L11 16"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
