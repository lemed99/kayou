import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const OrderedListIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <line x1="10" y1="6" x2="21" y2="6" stroke-linecap="round" stroke-linejoin="round" />
    <line
      x1="10"
      y1="12"
      x2="21"
      y2="12"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="10"
      y1="18"
      x2="21"
      y2="18"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M4 6h1v4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 10h2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
