import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Menu04Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M3 12H21M3 6H21M9 18H21" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
