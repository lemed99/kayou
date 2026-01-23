import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowsUpIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M7 20V4M7 4L3 8M7 4L11 8M17 20V9M17 9L13 13M17 9L21 13"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
