import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronUpIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 15L12 9L6 15" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
