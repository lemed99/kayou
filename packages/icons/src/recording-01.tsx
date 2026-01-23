import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Recording01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M3 10L3 14M7.5 6L7.5 18M12 3V21M16.5 6V18M21 10V14"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
