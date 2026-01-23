import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
