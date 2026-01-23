import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const Target01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H18M12 22C6.47715 22 2 17.5228 2 12M12 22V18M2 12C2 6.47715 6.47715 2 12 2M2 12H6M12 2V6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
