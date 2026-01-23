import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const BarChart01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 20V10M12 20V4M6 20V14" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
