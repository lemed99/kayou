import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const MinusIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M5 12H19" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
