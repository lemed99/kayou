import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { ChevronDownIcon, ChevronUpIcon, type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import HelperText from './HelperText';
import Label from './Label';
import Spinner from './Spinner';

export interface TextInputAriaLabels {
  increase: string;
  decrease: string;
}

const DEFAULT_TEXT_INPUT_ARIA_LABELS: TextInputAriaLabels = {
  increase: 'Increase value',
  decrease: 'Decrease value',
};

export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /** Input size variant. Defaults to 'md'. */
  sizing?: 'xs' | 'sm' | 'md';
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Label text displayed above the input. */
  label?: string;
  /** Addon element displayed beside the input; side controlled by `addonPosition`. */
  addon?: JSX.Element;
  /** Addon element displayed to the left of the input. */
  addonLeft?: JSX.Element;
  /** Addon element displayed to the right of the input. */
  addonRight?: JSX.Element;
  /** Addon side relative to the input. Defaults to 'left'. */
  addonPosition?: 'left' | 'right';
  /** Icon component rendered inside the input. */
  icon?: (props: IconProps) => JSX.Element;
  /** Color variant for styling and validation states. Defaults to 'gray'. */
  color?: 'gray' | 'info' | 'failure' | 'warning' | 'success';
  /** Show increment/decrement arrow buttons. Defaults to false. */
  showArrows?: boolean;
  /** Adjust input width to fit content. Defaults to false. */
  fitContent?: boolean;
  /** Callback when increment arrow is pressed. */
  onArrowUp?: (event: MouseEvent) => void;
  /** Callback when decrement arrow is pressed. */
  onArrowDown?: (event: MouseEvent) => void;
  /** Callback when increment arrow is released. */
  onArrowUpMouseUp?: (event: MouseEvent) => void;
  /** Callback when decrement arrow is released. */
  onArrowDownMouseUp?: (event: MouseEvent) => void;
  /** Ref callback for the increment button. */
  upBtnRef?: (el: HTMLButtonElement) => void;
  /** Ref callback for the decrement button. */
  downBtnRef?: (el: HTMLButtonElement) => void;
  /** Show loading spinner and disable input. Defaults to false. */
  isLoading?: boolean;
  /** Additional CSS class for the input element. */
  inputClass?: string;
  /** Additional CSS class for the input wrapper. */
  wrapperClass?: string;
  /** Additional CSS class for the addon wrapper. */
  addonClass?: string;
  /** Additional CSS class for the left addon wrapper. */
  addonLeftClass?: string;
  /** Additional CSS class for the right addon wrapper. */
  addonRightClass?: string;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<TextInputAriaLabels>;
  /** Whether to capitalize the first word of the label. */
  capitalizeFirstWord?: boolean;
}

const theme = {
  base: 'flex',
  addon: {
    base: 'inline-flex items-center border border-neutral-300 bg-neutral-200 px-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-400',
    position: {
      left: 'rounded-l-lg border-r-0',
      right: 'rounded-r-lg border-l-0',
    },
  },
  field: {
    base: 'relative w-full',
    icon: {
      base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5',
      svg: 'size-4 text-neutral-500 dark:text-neutral-400',
    },
    arrows: {
      base: 'absolute inset-y-0 right-0 flex items-center flex-col gap-0.5 justify-center pr-3',
      button:
        'border border-neutral-300 px-1 text-neutral-500 dark:text-neutral-400 cursor-pointer dark:border-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 active:bg-neutral-200 dark:active:bg-neutral-700 data-[active]:bg-neutral-200 dark:data-[active]:bg-neutral-700',
    },
    input: {
      base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-[-1px]',
      sizes: {
        xs: 'p-1.5 text-xs',
        sm: 'p-2 text-sm',
        md: 'p-2.5 text-sm',
      },
      colors: {
        gray: 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:outline-blue-600 dark:focus:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
        info: 'border-blue-500 bg-blue-50 text-blue-900 focus:outline-blue-500 dark:border-blue-500 dark:bg-blue-100 dark:focus:outline-blue-500',
        failure:
          'border-red-500 bg-red-50 text-red-900 focus:outline-red-500 dark:border-red-500 dark:bg-red-100 dark:focus:outline-red-500',
        warning:
          'border-yellow-500 bg-yellow-50 text-yellow-900 focus:outline-yellow-500 dark:border-yellow-500 dark:bg-yellow-100 dark:focus:outline-yellow-500',
        success:
          'border-green-500 bg-green-50 text-green-900 focus:outline-green-500 dark:border-green-500 dark:bg-green-100 dark:focus:outline-green-500',
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
        both: 'rounded-none',
        left: 'rounded-r-lg rounded-l-none',
        right: 'rounded-l-lg rounded-r-none',
        off: 'rounded-lg',
      },
      withShadow: {
        on: 'shadow-sm dark:shadow-sm-light',
        off: '',
      },
    },
  },
};

const TextInput = (props: TextInputProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'color',
    'class',
    'addon',
    'addonLeft',
    'addonRight',
    'addonPosition',
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
    'inputClass',
    'id',
    'ariaLabels',
    'aria-describedby',
    'wrapperClass',
    'addonClass',
    'addonLeftClass',
    'addonRightClass',
    'capitalizeFirstWord',
  ]);
  const a = createMemo(() => ({
    ...DEFAULT_TEXT_INPUT_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  // Generate unique IDs for accessibility associations
  const uniqueId = createUniqueId();
  const inputId = createMemo(() => local.id || `textinput-${uniqueId}`);
  const helperId = createMemo(() =>
    local.helperText ? `${inputId()}-helper` : undefined,
  );
  const ariaDescribedBy = createMemo(
    () => [local['aria-describedby'], helperId()].filter(Boolean).join(' ') || undefined,
  );

  const color = createMemo(() => local.color || 'gray');
  const sizing = createMemo(() => local.sizing || 'md');
  const showArrows = createMemo(() => local.showArrows || false);
  const fitContent = createMemo(() => local.fitContent || false);
  const addonPosition = createMemo(() => local.addonPosition || 'left');
  const resolvedAddonLeft = createMemo(
    () => local.addonLeft ?? (addonPosition() === 'left' ? local.addon : undefined),
  );
  const resolvedAddonRight = createMemo(
    () => local.addonRight ?? (addonPosition() === 'right' ? local.addon : undefined),
  );
  const hasLeftAddon = createMemo(() => Boolean(resolvedAddonLeft()));
  const hasRightAddon = createMemo(() => Boolean(resolvedAddonRight()));

  // Determine ARIA attributes based on state
  const ariaInvalid = createMemo(() => (color() === 'failure' ? true : undefined));
  const ariaBusy = createMemo(() => (local.isLoading ? true : undefined));

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
    if (!inputRef) {
      return;
    }

    if (!fitContent()) {
      if ('fieldSizing' in inputRef.style) {
        (inputRef.style as unknown as Record<string, string>).fieldSizing = '';
      }
      inputRef.style.width = '';
      return;
    }

    if ('fieldSizing' in inputRef.style) {
      (inputRef.style as unknown as Record<string, string>).fieldSizing = 'content';
      inputRef.style.width = '';
      return;
    }

    const updateWidth = () => {
      if (!inputRef) return;
      const value = String(local.value ?? inputRef.placeholder ?? '');
      const span = document.createElement('span');
      const cs = window.getComputedStyle(inputRef);
      span.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
        font-family: ${cs.fontFamily};
        font-size: ${cs.fontSize};
        font-weight: ${cs.fontWeight};
        letter-spacing: ${cs.letterSpacing};
        padding: ${cs.padding};
        border: ${cs.border};
        box-sizing: ${cs.boxSizing};
      `;
      span.textContent = value;
      document.body.appendChild(span);

      const width = parseFloat(window.getComputedStyle(span).width);
      document.body.removeChild(span);

      inputRef.style.width = `${Math.max(width, 25)}px`;
    };

    updateWidth();
  });

  const leftAddonClass = createMemo(() =>
    twMerge(
      theme.addon.base,
      theme.addon.position.left,
      local.addonClass,
      local.addonLeftClass,
    ),
  );
  const rightAddonClass = createMemo(() =>
    twMerge(
      theme.addon.base,
      theme.addon.position.right,
      local.addonClass,
      local.addonRightClass,
    ),
  );
  const inputAddonState = createMemo<'off' | 'left' | 'right' | 'both'>(() => {
    if (hasLeftAddon() && hasRightAddon()) {
      return 'both';
    }

    if (hasLeftAddon()) {
      return 'left';
    }

    if (hasRightAddon()) {
      return 'right';
    }

    return 'off';
  });

  return (
    <div class={twMerge('w-full', local.wrapperClass)}>
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label
            for={inputId()}
            value={local.label}
            color={color()}
            capitalizeFirstWord={local.capitalizeFirstWord}
          />
          <Show when={props.required}>
            <span aria-hidden="true" class="ml-0.5 font-medium text-red-500">
              *
            </span>
          </Show>
        </div>
      </Show>
      <div class={twMerge(theme.base, local.class)}>
        <Show when={hasLeftAddon()}>
          <span class={leftAddonClass()}>{resolvedAddonLeft()}</span>
        </Show>
        <div class={theme.field.base}>
          <Show when={local.icon && !local.isLoading}>
            <div class={theme.field.icon.base}>
              {local.icon?.({ class: theme.field.icon.svg })}
            </div>
          </Show>
          <Show when={local.isLoading}>
            <div class={theme.field.icon.base}>
              <Spinner size="sm" color="transparent" />
            </div>
          </Show>

          <input
            {...inputProps}
            id={inputId()}
            class={twMerge(
              theme.field.input.base,
              theme.field.input.colors[color()],
              theme.field.input.sizes[sizing()],
              theme.field.input.withAddon[inputAddonState()],
              theme.field.input.withIcon[local.icon || local.isLoading ? 'on' : 'off'],
              theme.field.input.withArrows[showArrows() ? 'on' : 'off'],
              local.inputClass,
            )}
            ref={(el) => handleRef(el)}
            disabled={local.disabled || local.isLoading}
            placeholder={local.placeholder}
            value={local.value}
            aria-invalid={ariaInvalid()}
            aria-busy={ariaBusy()}
            aria-describedby={ariaDescribedBy()}
          />

          <Show when={showArrows()}>
            <div class={theme.field.arrows.base}>
              <button
                type="button"
                ref={local.upBtnRef}
                onClick={() => inputRef?.focus()}
                onMouseDown={(e) => local.onArrowUp?.(e)}
                onMouseUp={(e) => local.onArrowUpMouseUp?.(e)}
                class={twMerge(theme.field.arrows.button, 'rounded-t')}
                tabIndex={-1}
                disabled={local.disabled || local.isLoading}
                aria-label={a().increase}
              >
                <ChevronUpIcon class="size-2.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                ref={local.downBtnRef}
                onClick={() => inputRef?.focus()}
                onMouseDown={(e) => local.onArrowDown?.(e)}
                onMouseUp={(e) => local.onArrowDownMouseUp?.(e)}
                class={twMerge(theme.field.arrows.button, 'rounded-b')}
                tabIndex={-1}
                disabled={local.disabled || local.isLoading}
                aria-label={a().decrease}
              >
                <ChevronDownIcon class="size-2.5" aria-hidden="true" />
              </button>
            </div>
          </Show>
        </div>
        <Show when={hasRightAddon()}>
          <span class={rightAddonClass()}>{resolvedAddonRight()}</span>
        </Show>
      </div>

      <Show when={local.helperText}>
        <HelperText id={helperId()} content={local.helperText!} color={color()} />
      </Show>
    </div>
  );
};

export default TextInput;
