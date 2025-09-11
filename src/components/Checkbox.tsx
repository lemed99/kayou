import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import Label from './Label';

interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelPosition?: 'left' | 'right';
  labelClass?: string;
}

const textInputTheme = {
  base: 'h-4 w-4 cursor-pointer rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-white shrink-0 appearance-none bg-white',
};

const checked = `
  checked:border-transparent
  checked:bg-blue-600
  dark:checked:bg-blue-500
  dark:checked:border-blue-500
  checked:bg-[url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0ndHJ1ZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBmaWxsPSdub25lJyB2aWV3Qm94PScwIDAgMTYgMTInPiA8cGF0aCBzdHJva2U9J3doaXRlJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS13aWR0aD0nMycgZD0nTTEgNS45MTcgNS43MjQgMTAuNSAxNSAxLjUnLz4gPC9zdmc+')]
  checked:bg-[length:0.55em_0.55em]
  checked:bg-center
  checked:bg-no-repeat 
`;

const Checkbox = (props: CheckboxProps) => {
  const [local, inputProps] = splitProps(props, ['label', 'labelPosition', 'labelClass']);

  const labelPosition = createMemo(() => local.labelPosition || 'right');

  return (
    <Label
      class={twMerge(
        'inline-block cursor-pointer',
        local.label && 'inline-flex items-center gap-x-2',
        local.labelClass,
      )}
    >
      <Show when={local.label && labelPosition() === 'left'}>
        <span class="text-sm text-gray-700 dark:text-gray-300">{local.label}</span>
      </Show>
      <input
        {...inputProps}
        class={twMerge(textInputTheme.base, checked, inputProps.class)}
        type="checkbox"
      />
      <Show when={local.label && labelPosition() === 'right'}>
        <span class="text-sm text-gray-700 dark:text-gray-300">{local.label}</span>
      </Show>
    </Label>
  );
};

export default Checkbox;
