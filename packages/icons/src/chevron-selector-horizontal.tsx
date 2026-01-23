import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ChevronSelectorHorizontalIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M9 7L4 12L9 17M15 7L20 12L15 17"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
