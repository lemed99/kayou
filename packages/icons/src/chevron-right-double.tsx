import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronRightDoubleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M6 17L11 12L6 7M13 17L18 12L13 7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
