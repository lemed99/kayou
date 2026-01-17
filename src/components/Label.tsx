import { JSX, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

/**
 * Color variants for the Label component.
 */
export type LabelColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

/**
 * Props for the Label component.
 */
export interface LabelProps
  extends Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, 'color'> {
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
}

const theme = {
  base: 'text-sm font-medium',
  disabled: 'opacity-50',
  colors: {
    gray: 'text-gray-900 dark:text-gray-300',
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
  const [local, labelProps] = splitProps(props, ['color', 'class', 'value', 'children']);

  const color = createMemo(() => local.color || 'gray');

  return (
    <label
      class={twMerge(theme.base, theme.colors[color()], local.class)}
      {...labelProps}
    >
      {local.value ?? local.children ?? ''}
    </label>
  );
};

export default Label;
