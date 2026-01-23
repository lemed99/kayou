import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const BluetoothConnectIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M3 7L15 17L9 22V2L15 7L3 17M18 12H18.01M15 12H15.01M21 12H21.01"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
