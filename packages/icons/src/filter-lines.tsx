import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const FilterLinesIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 12H18M3 6H21M9 18H15" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
