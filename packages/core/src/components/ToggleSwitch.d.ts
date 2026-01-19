import { JSX } from 'solid-js';
/**
 * Color variants for the ToggleSwitch component.
 */
export type ToggleSwitchColor = 'blue' | 'dark' | 'failure' | 'gray' | 'success' | 'warning';
/**
 * Props for the ToggleSwitch component.
 */
export interface ToggleSwitchProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    /**
     * Whether the switch is in the on state.
     */
    checked: boolean;
    /**
     * Color variant of the switch when active.
     * @default 'blue'
     */
    color?: ToggleSwitchColor;
    /**
     * Label text for the switch.
     */
    label: string;
    /**
     * Callback fired when the switch state changes.
     */
    onChange: (checked: boolean) => void;
    /**
     * Form input name for hidden checkbox.
     */
    name?: string;
}
/**
 * ToggleSwitch component for boolean input.
 * Uses role="switch" and aria-checked for accessibility.
 */
declare const ToggleSwitch: (props: ToggleSwitchProps) => JSX.Element;
export default ToggleSwitch;
