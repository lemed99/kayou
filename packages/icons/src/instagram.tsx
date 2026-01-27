import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const InstagramIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="12" cy="12" r="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </IconWrapper>
);
