import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const EqualNotIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M5 9H19M5 15H19M19 5L5 19" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
