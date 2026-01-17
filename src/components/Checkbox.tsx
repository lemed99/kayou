import { JSX, Show, createMemo, createUniqueId, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import Label from './Label';

/**
 * Color variants for the Checkbox component.
 */
export type CheckboxColor = 'blue' | 'dark';

/**
 * Props for the Checkbox component.
 */
export interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text or element for the checkbox.
   */
  label?: JSX.Element;
  /**
   * Position of the label relative to the checkbox.
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
  /**
   * Additional CSS classes for the label wrapper.
   */
  labelClass?: string;
  /**
   * Additional CSS classes for the label text span.
   */
  labelSpanClass?: string;
  /**
   * Color variant for the checked state.
   * @default 'blue'
   */
  color?: CheckboxColor;
}

const textInputTheme = {
  base: 'size-4 cursor-pointer disabled:cursor-not-allowed rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-white shrink-0 appearance-none bg-white',
};

const checked = (color: CheckboxProps['color']) => `
  checked:border-transparent
  ${color === 'blue' ? 'checked:bg-blue-600' : 'checked:bg-gray-800'}
  ${color === 'blue' ? 'dark:checked:bg-blue-500' : 'dark:checked:bg-gray-500'}
  ${color === 'blue' ? 'dark:checked:border-blue-500' : 'dark:checked:border-gray-500'}
  checked:bg-[url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0ndHJ1ZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBmaWxsPSdub25lJyB2aWV3Qm94PScwIDAgMTYgMTInPiA8cGF0aCBzdHJva2U9J3doaXRlJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS13aWR0aD0nMycgZD0nTTEgNS45MTcgNS43MjQgMTAuNSAxNSAxLjUnLz4gPC9zdmc+')]
  checked:bg-[length:0.55em_0.55em]
  checked:bg-center
  checked:bg-no-repeat 
`;

/**
 * Checkbox component with label support.
 */
const Checkbox = (props: CheckboxProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'label',
    'labelPosition',
    'labelClass',
    'labelSpanClass',
    'color',
  ]);

  const labelPosition = createMemo(() => local.labelPosition || 'right');

  const id = createUniqueId();

  return (
    <Label
      class={twMerge(
        'inline-flex items-center text-sm',
        local.labelClass,
        inputProps.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
      for={id}
    >
      <Show when={local.label && labelPosition() === 'left'}>
        <span
          class={twMerge('pr-2 text-gray-700 dark:text-gray-300', local.labelSpanClass)}
        >
          {local.label}
        </span>
      </Show>
      <input
        {...inputProps}
        id={id}
        class={twMerge(
          textInputTheme.base,
          checked(local.color || 'blue'),
          inputProps.class,
        )}
        type="checkbox"
      />
      <Show when={local.label && labelPosition() === 'right'}>
        <span
          class={twMerge('pl-2 text-gray-700 dark:text-gray-300', local.labelSpanClass)}
        >
          {local.label}
        </span>
      </Show>
    </Label>
  );
};

export default Checkbox;
