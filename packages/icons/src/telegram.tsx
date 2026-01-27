import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const TelegramIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="m22 2-7 20-4-9-9-4z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M22 2 11 13" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
