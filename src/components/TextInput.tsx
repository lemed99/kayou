import { JSX, Show, createEffect, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { ChevronDownIcon, ChevronUpIcon } from '../icons';
import HelperText from './HelperText';
import Label from './Label';
import Spinner from './Spinner';

export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  sizing?: 'xs' | 'sm' | 'md';
  helperText?: string;
  label?: string;
  addon?: JSX.Element;
  icon?: (props: { class: string }) => JSX.Element;
  color?: 'gray' | 'info' | 'failure' | 'warning' | 'success';
  showArrows?: boolean;
  fitContent?: boolean;
  onArrowUp?: (event: MouseEvent) => void;
  onArrowDown?: (event: MouseEvent) => void;
  onArrowUpMouseUp?: (event: MouseEvent) => void;
  onArrowDownMouseUp?: (event: MouseEvent) => void;
  upBtnRef?: (el: HTMLButtonElement) => void;
  downBtnRef?: (el: HTMLButtonElement) => void;
  isLoading?: boolean;
}

const theme = {
  base: 'flex',
  addon:
    'inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400',
  field: {
    base: 'relative w-full',
    icon: {
      base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5',
      svg: 'size-4 text-gray-500 dark:text-gray-400',
    },
    arrows: {
      base: 'absolute inset-y-0 right-0 flex items-center flex-col gap-0.5 justify-center pr-3',
      button:
        'border border-gray-300 px-1 text-gray-500 dark:text-gray-400 cursor-pointer dark:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
    },
    input: {
      base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-[-1px]',
      sizes: {
        xs: 'p-1.5 text-xs',
        sm: 'p-2 text-sm',
        md: 'p-2.5 text-sm',
      },
      colors: {
        gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:outline-blue-600 dark:focus:outline-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
        info: 'border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-700 focus:outline-blue-500 dark:border-blue-400 dark:bg-blue-100 dark:focus:outline-blue-500',
        failure:
          'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:outline-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:outline-red-500',
        warning:
          'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:outline-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:outline-yellow-500',
        success:
          'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:outline-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:outline-green-500',
      },
      withIcon: {
        on: 'pl-9',
        off: '',
      },
      withArrows: {
        on: 'pr-10',
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
    },
  },
};

const TextInput = (props: TextInputProps) => {
  const [local, inputProps] = splitProps(props, [
    'color',
    'class',
    'addon',
    'sizing',
    'icon',
    'helperText',
    'label',
    'ref',
    'showArrows',
    'fitContent',
    'onArrowUp',
    'onArrowDown',
    'onArrowUpMouseUp',
    'onArrowDownMouseUp',
    'upBtnRef',
    'downBtnRef',
    'disabled',
    'isLoading',
    'value',
    'placeholder',
  ]);

  const color = createMemo(() => local.color || 'gray');
  const sizing = createMemo(() => local.sizing || 'md');
  const showArrows = createMemo(() => local.showArrows || false);
  const fitContent = createMemo(() => local.fitContent || false);

  let inputRef: HTMLInputElement | undefined;

  const handleRef = (el: HTMLInputElement) => {
    inputRef = el;
    if (typeof local.ref === 'function') {
      local.ref(el);
    } else if (typeof local.ref === 'object' && 'current' in local.ref) {
      (local.ref as { current: HTMLInputElement | undefined }).current = el;
    }
  };

  createEffect(() => {
    if (!fitContent() || !inputRef) return;
    if ('fieldSizing' in inputRef.style) {
      inputRef.style.fieldSizing = 'content';
      return;
    }

    const updateWidth = () => {
      const value = (props.value || inputRef!.placeholder) as string;
      const span = document.createElement('span');
      span.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
        font-size: ${window.getComputedStyle(inputRef!).fontSize};
        padding: ${window.getComputedStyle(inputRef!).padding};
        border: ${window.getComputedStyle(inputRef!).border};
      `;
      span.textContent = value;
      document.body.appendChild(span);

      const width = parseFloat(window.getComputedStyle(span).width);
      document.body.removeChild(span);

      inputRef!.style.width = `${Math.max(width, 25)}px`;
    };

    updateWidth();
  });

  return (
    <div class="w-full">
      <Show when={props.label}>
        <div class="mb-1 block">
          <Label value={props.label} color={color()} />
          <Show when={props.required}>
            <span class="ml-0.5 font-medium text-red-500">*</span>
          </Show>
        </div>
      </Show>
      <div class={twMerge(theme.base, local.class)}>
        <Show when={local.addon}>
          <span class={theme.addon}>{local.addon}</span>
        </Show>
        <div class={theme.field.base}>
          <Show when={local.icon}>
            <div class={theme.field.icon.base}>
              {local.icon?.({ class: theme.field.icon.svg })}
            </div>
          </Show>
          <Show when={local.isLoading}>
            <div class={twMerge(theme.field.icon.base, local.icon ? 'pl-9' : 'pl-3')}>
              <Spinner size="sm" color={color()} />
            </div>
          </Show>

          <input
            class={twMerge(
              theme.field.input.base,
              theme.field.input.colors[color()],
              theme.field.input.sizes[sizing()],
              theme.field.input.withAddon[local.addon ? 'on' : 'off'],
              theme.field.input.withIcon[local.icon ? 'on' : 'off'],
              theme.field.input.withArrows[showArrows() ? 'on' : 'off'],
            )}
            ref={(el) => handleRef(el)}
            disabled={local.disabled || local.isLoading}
            placeholder={local.isLoading ? '' : local.placeholder}
            value={local.isLoading ? '' : local.value}
            {...inputProps}
          />

          <Show when={showArrows()}>
            <div class={theme.field.arrows.base}>
              <button
                type="button"
                ref={local.upBtnRef}
                onMouseDown={(e) => local.onArrowUp?.(e)}
                onMouseUp={(e) => local.onArrowUpMouseUp?.(e)}
                class={twMerge(theme.field.arrows.button, 'rounded-t')}
                tabIndex={-1}
                disabled={local.disabled || local.isLoading}
              >
                <ChevronUpIcon class="size-2.5" />
              </button>
              <button
                type="button"
                ref={local.downBtnRef}
                onMouseDown={(e) => local.onArrowDown?.(e)}
                onMouseUp={(e) => local.onArrowDownMouseUp?.(e)}
                class={twMerge(theme.field.arrows.button, 'rounded-b')}
                tabIndex={-1}
                disabled={local.disabled || local.isLoading}
              >
                <ChevronDownIcon class="size-2.5" />
              </button>
            </div>
          </Show>
        </div>
      </div>

      <Show when={local.helperText}>
        <HelperText content={local.helperText as string} color={color()} />
      </Show>
    </div>
  );
};

export default TextInput;
