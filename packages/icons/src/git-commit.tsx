import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const GitCommitIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M15.9998 12C15.9998 14.2091 14.2089 16 11.9998 16C9.79067 16 7.9998 14.2091 7.9998 12M15.9998 12C15.9998 9.79086 14.2089 8 11.9998 8C9.79067 8 7.9998 9.79086 7.9998 12M15.9998 12H21.9998M7.9998 12H2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
