import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowNarrowUpRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M6 18L18 6M18 6H10M18 6V14" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
