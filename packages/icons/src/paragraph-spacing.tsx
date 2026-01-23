import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ParagraphSpacingIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 10H13M21 6H13M21 14H13M21 18H13M6 20L6 4M6 20L3 17M6 20L9 17M6 4L3 7M6 4L9 7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
