import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 10H8M21 6H4M21 14H4M21 18H8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
