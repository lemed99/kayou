import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const BarChart06Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M9 8V21M21 17V21M3 3V21M15 13V21"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
