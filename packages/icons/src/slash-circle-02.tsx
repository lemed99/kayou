import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const SlashCircle02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M4.93 4.93L19.07 19.07M19.0699 4.92999L4.92993 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
