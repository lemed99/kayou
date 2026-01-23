import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const MarkerPin02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
