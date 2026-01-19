import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Expand01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M14 10L21 3M21 3H15M21 3V9M10 14L3 21M3 21H9M3 21L3 15" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
