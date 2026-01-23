import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const EqualIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M5 9H19M5 15H19" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
