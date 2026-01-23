import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const SpacingHeight01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M12 18L12 6M12 18L9 16M12 18L15 16M12 6L9 8M12 6L15 8M21 3H3M21 21H3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
