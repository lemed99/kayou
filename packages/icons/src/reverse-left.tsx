import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ReverseLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M4 7H14C17.3137 7 20 9.68629 20 13C20 16.3137 17.3137 19 14 19H4M4 7L8 3M4 7L8 11"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
