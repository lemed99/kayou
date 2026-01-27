import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const TwitterXIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 4l7.07 9.524M4 20l7.07-9.524m0 0L20 4M11.07 13.476L20 20" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
