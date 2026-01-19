import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const BluetoothOnIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 7L18 17L12 22V2L18 7L6 17" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
