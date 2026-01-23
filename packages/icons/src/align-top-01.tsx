import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignTop01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M21 3H3M12 21V7M12 7L5 14M12 7L19 14"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
