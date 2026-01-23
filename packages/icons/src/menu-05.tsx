import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Menu05Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M3 8.5H21M3 15.5H21" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
