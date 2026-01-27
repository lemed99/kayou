import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const SpotifyIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 15c3.5-1 7-1 10.5.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7 12c4.5-1.5 9-1.5 13.5.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6 9c5-2 11-2 16 .5" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
