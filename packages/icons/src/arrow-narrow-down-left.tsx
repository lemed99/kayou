import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowNarrowDownLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 6L6 18M6 18H14M6 18V10" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
