import { JSX } from 'solid-js';

export interface Option {
  value: string;
  label: string;
  labelWrapper?: (label: string) => JSX.Element;
}
