import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const MouseIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M12 9V6M12 22C8.13401 22 5 18.866 5 15V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V15C19 18.866 15.866 22 12 22Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
