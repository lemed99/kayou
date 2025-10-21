import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Underline01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 21H20" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
