import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ArrowsRightIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M4 7H15M15 7L11 11M15 7L11 3M4 17H20M20 17L16 21M20 17L16 13" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
