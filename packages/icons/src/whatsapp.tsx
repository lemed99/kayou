import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const WhatsappIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
