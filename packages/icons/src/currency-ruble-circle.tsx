import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const CurrencyRubleCircleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M9.5 6.5H14C15.3807 6.5 16.5 7.61929 16.5 9C16.5 10.3807 15.3807 11.5 14 11.5H9.5V6.5ZM9.5 6.5V17.5M9.75 11.5H8M13 14.75H8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
