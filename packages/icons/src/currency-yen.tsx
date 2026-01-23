import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const CurrencyYenIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M11.9999 20.5V11.5M11.9999 11.5L18.5 3.5M11.9999 11.5L5.5 3.5M17.9999 11.5H5.99986M16.9999 15.5H6.99986"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
