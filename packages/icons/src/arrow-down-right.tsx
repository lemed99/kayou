import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowDownRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M7 7L17 17M17 17V7M17 17H7" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
