import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowNarrowUpIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M12 20V4M12 4L6 10M12 4L18 10" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
