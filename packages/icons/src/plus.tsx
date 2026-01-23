import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const PlusIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M12 5V19M5 12H19" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
