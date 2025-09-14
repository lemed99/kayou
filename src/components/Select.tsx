import { For, JSX, ParentComponent, Show, createMemo, splitProps } from 'solid-js';

import HelperText from './HelperText';

type SelectSize = 'sm' | 'md' | 'lg';
type SelectColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  sizing?: SelectSize;
  helperText?: string;
  addon?: JSX.Element;
  icon?: (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element;
  color?: SelectColor;
  options?: { label: string; value: string }[];
  defaultValue?: string | number | readonly string[] | undefined;
}

const style = `
  bg-[url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0ndHJ1ZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBmaWxsPSdub25lJyB2aWV3Qm94PScwIDAgMTAgNic+IDxwYXRoIHN0cm9rZT0nIzZCNzI4MCcgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyBzdHJva2Utd2lkdGg9JzInIGQ9J20xIDEgNCA0IDQtNCcvPiA8L3N2Zz4=')]
  bg-[right_0.75rem_center]
  bg-no-repeat
  bg-[length:0.75em_0.75em]
  pr-[2.5rem]`;

const selectTheme = {
  base: 'flex',
  addon:
    'inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400',
  field: {
    base: 'relative w-full',
    icon: {
      base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
      svg: 'h-5 w-5 text-gray-500 dark:text-gray-400',
    },
    select: {
      base: 'block w-full border disabled:cursor-not-allowed appearance-none disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-[-1px]',
      withIcon: {
        on: 'pl-10',
        off: '',
      },
      withAddon: {
        on: 'rounded-r-lg',
        off: 'rounded-lg',
      },
      withShadow: {
        on: 'shadow-sm dark:shadow-sm-light',
        off: '',
      },
      sizes: {
        sm: 'p-2 text-xs',
        md: 'p-2.5 text-sm',
        lg: 'text-md p-4',
      },
      colors: {
        gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:outline-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:outline-blue-500',
        info: 'border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-700 focus:outline-blue-500 dark:border-blue-400 dark:bg-blue-100 dark:focus:outline-blue-500',
        failure:
          'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:outline-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:outline-red-500',
        warning:
          'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:outline-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:outline-yellow-500',
        success:
          'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:outline-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:outline-green-500',
      },
    },
  },
};

const Select: ParentComponent<SelectProps> = (props) => {
  const [local, selectProps] = splitProps(props, [
    'color',
    'sizing',
    'options',
    'defaultValue',
    'addon',
    'icon',
    'helperText',
    'class',
  ]);

  const color = createMemo(() => local.color || 'gray');
  const sizing = createMemo(() => local.sizing || 'md');

  return (
    <div class={`${selectTheme.base} ${local.class}`}>
      <Show when={local.addon}>
        <span class={selectTheme.addon}>{local.addon}</span>
      </Show>
      <div class={selectTheme.field.base}>
        <Show when={local.icon}>
          <div class={selectTheme.field.icon.base}>
            {local.icon?.({ class: selectTheme.field.icon.svg })}
          </div>
        </Show>
        <select
          class={` ${selectTheme.field.select.base} ${selectTheme.field.select.colors[color()]} ${selectTheme.field.select.withAddon[local.addon ? 'on' : 'off']} ${selectTheme.field.select.withIcon[local.icon ? 'on' : 'off']} ${selectTheme.field.select.sizes[sizing()]} ${selectTheme.base} ${style} `}
          {...selectProps}
        >
          <For each={local.options}>
            {(option) => (
              <option value={option.value} selected={local.defaultValue === option.value}>
                {option.label}
              </option>
            )}
          </For>
        </select>
        <Show when={local.helperText}>
          <HelperText content={local.helperText as string} color={local.color} />
        </Show>
      </div>
    </div>
  );
};

export default Select;
