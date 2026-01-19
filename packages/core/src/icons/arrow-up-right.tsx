import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowUpRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
