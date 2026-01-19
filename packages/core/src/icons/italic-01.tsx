import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const Italic01Icon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M19 4H10M14 20H5M15 4L9 20" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
