import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M16 10H3M20 6H3M20 14H3M16 18H3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
