import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const Heading4Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 12h8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 18V6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17 10v4h4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M21 10v8" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
