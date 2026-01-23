import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const LetterSpacing02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M2 18H22M2 18L5 15M2 18L5 21M22 18L19 15M22 18L19 21M7 3H17M12 3V14"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
