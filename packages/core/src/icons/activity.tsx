import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ActivityIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M22 12H18L15 21L9 3L6 12H2" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
