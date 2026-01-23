import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Download02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
