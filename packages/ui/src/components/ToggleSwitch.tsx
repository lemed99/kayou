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
  after:border-gray-300
  after:border
  after:rounded-full
  after:h-4
  after:w-4
  after:transition-all
  after:duration-150
`;

const theme = {
  root: {
    base: 'flex items-center rounded-lg focus:outline-none',
    active: {
      on: 'cursor-pointer',
      off: 'cursor-not-allowed opacity-50',
    },
    label: 'mr-2 text-sm font-medium text-gray-900 dark:text-neutral-300',
  },
  toggle: {
    base: toggleClassName + ' h-5 w-9 rounded-full border transition-all',
    checked: {
      on: 'after:translate-x-full after:border-white',
      off: 'border-gray-200 bg-gray-200 dark:border-neutral-700 dark:bg-neutral-800',
      color: {
        blue: 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500',
        dark: 'bg-gray-700 border-gray-900 dark:bg-gray-600 dark:border-gray-700',
        failure: 'bg-red-700 border-red-900 dark:bg-red-600 dark:border-red-700',
        gray: 'bg-gray-500 border-gray-600 dark:bg-gray-400 dark:border-gray-500',
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

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    local.onChange?.(!local.checked);
  };

  return (
    <>
      <Show when={local.name && local.checked}>
        <input
          checked={local.checked}
          hidden
          name={local.name}
          readOnly
          type="checkbox"
          class="sr-only"
        />
      </Show>
      <button
        aria-checked={local.checked}
        aria-labelledby={`${id}-toggleswitch-label`}
        disabled={local.disabled}
        id={`${id}-toggleswitch`}
        onClick={handleClick}
        role="switch"
        tabIndex={0}
        type="button"
        class={twMerge(
          theme.root.base,
          theme.root.active[local.disabled ? 'off' : 'on'],
          local.class,
        )}
        {...otherProps}
      >
        <span id={`${id}-toggleswitch-label`} class={theme.root.label}>
          {local.label}
        </span>

        <div class="relative">
          <div
            class={twMerge(
              theme.toggle.base,
              theme.toggle.checked[local.checked ? 'on' : 'off'],
              !local.disabled &&
                local.checked &&
                theme.toggle.checked.color[local.color || 'blue'],
            )}
          />
        </div>
      </button>
    </>
  );
};

export default ToggleSwitch;
