import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronUpDoubleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M17 18L12 13L7 18M17 11L12 6L7 11"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
