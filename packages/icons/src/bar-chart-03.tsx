import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const BarChart03Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 20V4M18 20V16M12 20V10" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
