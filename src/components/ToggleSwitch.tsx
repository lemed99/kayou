import { JSX, Show, createUniqueId, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

export interface ToggleSwitchProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  color?: 'blue' | 'dark' | 'failure' | 'gray' | 'success' | 'warning';
  label: string;
  onChange: (checked: boolean) => void;
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
  after:h-5
  after:w-5
  after:duration-[0.15s]
`;

const theme = {
  root: {
    base: 'group relative flex items-center rounded-lg focus:outline-none',
    active: {
      on: 'cursor-pointer',
      off: 'cursor-not-allowed opacity-50',
    },
    label: 'ml-3 text-sm font-medium text-gray-900 dark:text-gray-300',
  },
  toggle: {
    base: toggleClassName + ' h-6 w-11 rounded-full border',
    checked: {
      on: 'after:translate-x-full after:border-white',
      off: 'border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700',
      color: {
        blue: 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500',
        dark: 'bg-dark-700 border-dark-900',
        failure: 'bg-red-700 border-red-900',
        gray: 'bg-gray-500 border-gray-600',
        success: 'bg-green-500 border-green-500',
        warning: 'bg-yellow-600 border-yellow-600',
      },
    },
  },
};

const ToggleSwitch = (props: ToggleSwitchProps) => {
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
        <div
          class={twMerge(
            theme.toggle.base,
            theme.toggle.checked[local.checked ? 'on' : 'off'],
            !local.disabled &&
              local.checked &&
              theme.toggle.checked.color[local.color || 'blue'],
          )}
        />
        <span id={`${id}-toggleswitch-label`} class={theme.root.label}>
          {local.label}
        </span>
      </button>
    </>
  );
};

export default ToggleSwitch;
