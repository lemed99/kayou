import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
