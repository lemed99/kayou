import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const TiktokIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
