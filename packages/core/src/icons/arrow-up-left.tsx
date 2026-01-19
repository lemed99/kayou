import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowUpLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M17 17L7 7M7 7V17M7 7H17" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
