import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowNarrowLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M20 12H4M4 12L10 18M4 12L10 6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
