import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const BarChart02Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 20V4M6 20V16M12 20V10" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
