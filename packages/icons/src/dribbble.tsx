import { JSX } from 'solid-js';
import { IconProps, IconWrapper } from './components/IconWrapper';

export const DribbbleIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" stroke-linecap="round" stroke-linejoin="round" />
  </IconWrapper>
);
