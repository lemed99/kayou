import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const CurrencyRupeeIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M6 3H18M6 8H18M14.5 21L6 13H9C15.667 13 15.667 3 9 3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
