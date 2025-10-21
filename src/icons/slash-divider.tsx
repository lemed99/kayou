import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const SlashDividerIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M7 22L17 2" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
