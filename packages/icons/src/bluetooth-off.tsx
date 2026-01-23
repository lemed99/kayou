import { JSX } from 'solid-js';

import { IconProps, IconWrapper } from './components/IconWrapper';

export const BluetoothOffIcon = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    <path
      d="M6 17L12 12V22L17.4398 17.4668M12 7V2L18 7L15.0817 9.43194M21 21L3 3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconWrapper>
);
