import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const LinkedinIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="2" y="9" width="4" height="12" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
