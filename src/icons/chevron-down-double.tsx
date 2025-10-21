import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ChevronDownDoubleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
