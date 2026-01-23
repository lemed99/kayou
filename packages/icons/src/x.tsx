import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const XIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M17 7L7 17M7 7L17 17" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
