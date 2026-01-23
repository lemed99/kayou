import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const TerminalCircleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M7 15L10 12L7 9M13 15H17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
