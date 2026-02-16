import { JSX, Show, createUniqueId, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

/**
 * Color variants for the ToggleSwitch component.
 */
export type ToggleSwitchColor =
  | 'blue'
  | 'dark'
  | 'failure'
  | 'gray'
  | 'success'
  | 'warning';

/**
 * Props for the ToggleSwitch component.
 */
export interface ToggleSwitchProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
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

const toggleClassName = `
  after:content-[""]
  after:absolute
  after:top-0.5
  after:left-0.5
  after:bg-white
  after:border-neutral-300
  after:border
  after:rounded-full
  after:h-4
  after:w-4
  after:transition-all
  after:duration-150
`;

const theme = {
  root: {
    base: 'flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900',
    active: {
      on: 'cursor-pointer',
      off: 'cursor-not-allowed opacity-50',
    },
    label: 'mr-2 text-sm font-medium text-neutral-900 dark:text-neutral-300',
  },
  toggle: {
    base: toggleClassName + ' h-5 w-9 rounded-full border transition-all',
    checked: {
      on: 'after:translate-x-full after:border-white',
      off: 'border-neutral-200 bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800',
      color: {
        blue: 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500',
        dark: 'bg-neutral-700 border-neutral-900 dark:bg-neutral-600 dark:border-neutral-700',
        failure: 'bg-red-700 border-red-900 dark:bg-red-600 dark:border-red-700',
        gray: 'bg-neutral-500 border-neutral-600 dark:bg-neutral-400 dark:border-neutral-500',
        success: 'bg-green-500 border-green-500 dark:bg-green-400 dark:border-green-400',
        warning:
          'bg-yellow-600 border-yellow-600 dark:bg-yellow-500 dark:border-yellow-500',
      },
    },
  },
};

/**
 * ToggleSwitch component for boolean input.
 * Uses role="switch" and aria-checked for accessibility.
 */
const ToggleSwitch = (props: ToggleSwitchProps): JSX.Element => {
  const [local, otherProps] = splitProps(props, [
    'checked',
    'class',
    'color',
    'disabled',
    'label',
    'name',
    'onChange',
  ]);

  const id = createUniqueId();

  const handleClick = () => {
    local.onChange?.(!local.checked);
  };

  return (
    <>
      <Show when={local.name && local.checked}>
        <input hidden name={local.name} type="checkbox" class="sr-only" />
      </Show>
      <button
        {...otherProps}
        aria-checked={local.checked}
        disabled={local.disabled}
        id={`${id}-toggleswitch`}
        onClick={handleClick}
        role="switch"
        type="button"
        class={twMerge(
          theme.root.base,
          theme.root.active[local.disabled ? 'off' : 'on'],
          local.class,
        )}
      >
        <span class={theme.root.label}>{local.label}</span>

        <div class="relative">
          <div
            class={twMerge(
              theme.toggle.base,
              theme.toggle.checked[local.checked ? 'on' : 'off'],
              local.checked && theme.toggle.checked.color[local.color || 'blue'],
            )}
          />
        </div>
      </button>
    </>
  );
};

export default ToggleSwitch;
