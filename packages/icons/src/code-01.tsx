import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Code01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M16 18L22 12L16 6M8 6L2 12L8 18"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
