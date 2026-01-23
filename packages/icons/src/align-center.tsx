import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignCenterIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M18 10H6M21 6H3M21 14H3M18 18H6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
