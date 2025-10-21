import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowNarrowDownIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
