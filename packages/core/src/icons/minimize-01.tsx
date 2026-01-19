import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Minimize01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 14H10M10 14V20M10 14L3 21M20 10H14M14 10V4M14 10L21 3" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
