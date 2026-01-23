import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowUpIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M12 19V5M12 5L5 12M12 5L19 12"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
