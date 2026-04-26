import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const HighlighterIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="m9 11-6 6v3h9l3-3" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
