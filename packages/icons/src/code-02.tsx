import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Code02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
