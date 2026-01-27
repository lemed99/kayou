import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const SlackIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <rect x="13" y="2" width="3" height="8" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19 8h2a1.5 1.5 0 1 1 0 3h-2" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="8" y="14" width="3" height="8" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 16H3a1.5 1.5 0 1 1 0-3h2" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="14" y="13" width="8" height="3" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M16 19v2a1.5 1.5 0 1 1-3 0v-2" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="2" y="8" width="8" height="3" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 5V3a1.5 1.5 0 1 1 3 0v2" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
