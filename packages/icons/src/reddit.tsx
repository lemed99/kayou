import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const RedditIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <circle cx="12" cy="14" r="7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 7V3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 3l4 1" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="9.5" cy="13" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13" r="0.5" fill="currentColor" stroke="none" />
    <path d="M9 17c1.5 1 4.5 1 6 0" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
