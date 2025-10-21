import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const CheckIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
