import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const XCloseIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
