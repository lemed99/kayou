import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const PinterestIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 6a4 4 0 0 0-1.2 7.8c-.1.5-.3 1.3-.5 2l-1.3 4.2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15 15.5c.5.3 1 .5 1.5.5a4 4 0 0 0 1.5-7.7" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
