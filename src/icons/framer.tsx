import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const FramerIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M12 15.5V22.5L5 15.5M5 15.5V8.5H12M5 15.5H19L12 8.5M12 8.5H19V1.5H5L12 8.5Z" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
