import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const ArrowCircleBrokenRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M3.33789 7C5.06694 4.01099 8.29866 2 12.0001 2C17.5229 2 22.0001 6.47715 22.0001 12C22.0001 17.5228 17.5229 22 12.0001 22C8.29866 22 5.06694 19.989 3.33789 17M12 16L16 12M16 12L12 8M16 12H2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
