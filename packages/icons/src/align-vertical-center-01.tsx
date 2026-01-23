import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignVerticalCenter01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M3 12H21M12 2V8.5M12 8.5L16 4.5M12 8.5L8 4.5M12 22V15.5M12 15.5L16 19.5M12 15.5L8 19.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
