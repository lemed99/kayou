import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const TerminalIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 17L10 11L4 5M12 19H20" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
