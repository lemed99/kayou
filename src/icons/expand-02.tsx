import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Expand02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M3 21L21 3M3 21H9M3 21L3 15M21 3H15M21 3V9" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
