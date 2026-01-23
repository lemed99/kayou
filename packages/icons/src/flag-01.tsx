import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Flag01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3L4 22"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
