import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowNarrowUpLeftIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M18 18L6 6M6 6V14M6 6H14" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
