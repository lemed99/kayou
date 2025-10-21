import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowNarrowDownRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 6L18 18M18 18V10M18 18H10" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
