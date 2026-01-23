import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowNarrowRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M4 12H20M20 12L14 6M20 12L14 18"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
