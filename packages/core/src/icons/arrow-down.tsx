import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowDownIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
