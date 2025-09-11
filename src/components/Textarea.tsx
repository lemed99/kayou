import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import HelperText from './HelperText';
import Label from './Label';

type TextareaColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

export interface TextareaProps
  extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'> {
  helperText?: string;
  label?: string;
  color?: TextareaColor;
}

const theme = {
  base: 'p-2.5 text-sm block w-full rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-[-1px]',
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
};

const Textarea = (props: TextareaProps) => {
  const [local, textareaProps] = splitProps(props, [
    'color',
    'class',
    'helperText',
    'label',
    'ref',
    'required',
  ]);

  const color = createMemo(() => local.color || 'gray');

  return (
    <div>
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label value={local.label} color={color()} />
          <Show when={local.required}>
            <span class="ml-0.5 font-medium text-red-500">*</span>
          </Show>
        </div>
      </Show>

      <textarea
        class={twMerge(theme.base, theme.colors[color()], local.class)}
        ref={local.ref}
        {...textareaProps}
      />

      <Show when={local.helperText}>
        <HelperText content={local.helperText as string} color={color()} />
      </Show>
    </div>
  );
};

export default Textarea;
