import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '../components/IconWrapper';

export const ChevronSelectorVerticalIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path d="M7 15L12 20L17 15M7 9L12 4L17 9" stroke-linecap="round" stroke-linejoin="round"/>
  </IconWrapper>
);
