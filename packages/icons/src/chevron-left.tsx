import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M15 18L9 12L15 6" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
