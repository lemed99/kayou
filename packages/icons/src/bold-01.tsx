import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Bold01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M6 12H14C16.2091 12 18 10.2091 18 8C18 5.79086 16.2091 4 14 4H6V12ZM6 12H15C17.2091 12 19 13.7909 19 16C19 18.2091 17.2091 20 15 20H6V12Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
