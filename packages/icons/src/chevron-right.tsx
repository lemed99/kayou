import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
