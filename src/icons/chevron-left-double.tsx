import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ChevronLeftDoubleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 17L13 12L18 7M11 17L6 12L11 7" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
