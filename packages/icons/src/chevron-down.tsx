import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronDownIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
