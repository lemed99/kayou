import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowDownLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M17 7L7 17M7 17H17M7 17V7" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
