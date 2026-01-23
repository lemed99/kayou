import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignJustifyIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 10H3M21 18H3M21 6H3M21 14H3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
