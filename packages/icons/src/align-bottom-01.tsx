import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const AlignBottom01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M3 21H21M12 3V17M12 17L19 10M12 17L5 10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
