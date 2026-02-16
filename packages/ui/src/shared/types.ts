import { JSX } from 'solid-js';

/**
 * Option item used by Select, SelectWithSearch, and MultiSelect components.
 */
export interface Option {
  /** Unique value identifying this option. */
  value: string;
  /** Display text shown to the user. */
  label: string;
  /** Optional custom renderer for the label. */
  labelWrapper?: (label: string) => JSX.Element;
  /** Whether this option is disabled and cannot be selected. @default false */
  disabled?: boolean;
}
