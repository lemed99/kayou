import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const TwitchIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 6v6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15 6v6" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
