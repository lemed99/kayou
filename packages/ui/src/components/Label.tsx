import { JSX, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { capitalizeFirstWord } from '../helpers';

/**
 * Color variants for the Label component.
 */
export type LabelColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

/**
 * Props for the Label component.
 */
export interface LabelProps extends Omit<
  JSX.LabelHTMLAttributes<HTMLLabelElement>,
  'color'
> {
  /**
   * Color variant of the label.
   * @default 'gray'
   */
  color?: LabelColor;
  /**
   * Text value to display in the label.
   */
  value?: string;
  children?: JSX.Element;
  /**
   * Whether to capitalize the first word of the label.
   * @default false
   */
  capitalizeFirstWord?: boolean;
}

const theme = {
  base: 'text-sm font-medium',
  colors: {
    gray: 'text-neutral-900 dark:text-neutral-300',
    info: 'text-blue-500 dark:text-blue-600',
    failure: 'text-red-700 dark:text-red-500',
    warning: 'text-yellow-500 dark:text-yellow-600',
    success: 'text-green-700 dark:text-green-500',
  },
};

/**
 * Label component for form field labels.
 */
const Label = (props: LabelProps): JSX.Element => {
  const [local, labelProps] = splitProps(props, [
    'color',
    'class',
    'value',
    'children',
    'capitalizeFirstWord',
  ]);

  const color = createMemo(() => local.color ?? 'gray');

  const value = createMemo(() => {
    if (local.capitalizeFirstWord) {
      return capitalizeFirstWord(local.value ?? '');
    }
    return local.value;
  });

  return (
    <label
      {...labelProps}
      class={twMerge(theme.base, theme.colors[color()], local.class)}
    >
      {value() ?? local.children ?? ''}
    </label>
  );
};

export default Label;
