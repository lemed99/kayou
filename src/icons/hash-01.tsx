import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Hash01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 8H20M4 16H20M8 3V21M16 3V21" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
