import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Heading01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 4V20M18 4V20M8 4H4M18 12L6 12M8 20H4M20 20H16M20 4H16" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
