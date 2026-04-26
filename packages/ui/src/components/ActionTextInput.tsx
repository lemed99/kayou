import { JSX, Show, createMemo, createUniqueId, splitProps } from 'solid-js';

import { type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Button, { ButtonColor, ButtonVariant } from './Button';
import HelperText from './HelperText';
import Label from './Label';
import Spinner from './Spinner';
import TextInput, { type TextInputProps } from './TextInput';
import Tooltip from './Tooltip';

export interface ActionTextInputProps extends Omit<
  TextInputProps,
  'addon' | 'addonPosition'
> {
  /** Icon rendered in the action button. */
  actionIcon: (props: IconProps) => JSX.Element;
  /** Accessible label for the action button. */
  actionLabel: string;
  /** Called when the action button is clicked. */
  onActionClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  /** Button type for the action CTA. Defaults to 'button'. */
  actionType?: 'button' | 'submit' | 'reset';
  /** Form id to associate with the action CTA when used as a submit button. */
  actionForm?: string;
  /** Disable the action CTA. Defaults to false. */
  actionDisabled?: boolean;
  /** Show a loading spinner in the action CTA. Defaults to false. */
  actionLoading?: boolean;
  /** Whether to render the action CTA. Defaults to true. */
  actionVisible?: boolean;
  /** Additional CSS class for the action button. */
  actionClass?: string;
  /** Additional CSS class for the action button wrapper. */
  actionWrapperClass?: string;
  /** Color for the action */
  actionColor?: Exclude<ButtonColor, 'theme'>;
  /** Variant for the action */
  actionVariant?: ButtonVariant;
}

const ActionTextInput = (props: ActionTextInputProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'actionIcon',
    'actionLabel',
    'onActionClick',
    'actionType',
    'actionForm',
    'actionDisabled',
    'actionLoading',
    'actionVisible',
    'actionClass',
    'actionWrapperClass',
    'helperText',
    'label',
    'color',
    'actionColor',
    'actionVariant',
    'id',
    'aria-describedby',
    'wrapperClass',
    'inputClass',
    'capitalizeFirstWord',
  ]);

  const uniqueId = createUniqueId();
  const inputId = createMemo(() => local.id || `action-text-input-${uniqueId}`);
  const helperId = createMemo(() =>
    local.helperText ? `${inputId()}-helper` : undefined,
  );
  const ariaDescribedBy = createMemo(
    () => [local['aria-describedby'], helperId()].filter(Boolean).join(' ') || undefined,
  );
  const color = createMemo(() => local.color ?? 'gray');
  const actionColor = createMemo(() => local.actionColor ?? 'info');
  const actionVariant = createMemo(() => local.actionVariant ?? 'solid');
  const actionType = createMemo(() => local.actionType ?? 'button');
  const actionVisible = createMemo(() => local.actionVisible ?? true);
  const actionLoading = createMemo(() => local.actionLoading ?? false);
  const actionDisabled = createMemo(() =>
    Boolean(
      inputProps.disabled ||
      inputProps.isLoading ||
      local.actionDisabled ||
      actionLoading(),
    ),
  );

  let inputRef: HTMLInputElement | undefined;

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
          <Show when={inputProps.required}>
            <span aria-hidden="true" class="ml-0.5 font-medium text-red-500">
              *
            </span>
          </Show>
        </div>
      </Show>

      <div class="relative">
        <TextInput
          {...inputProps}
          id={inputId()}
          ref={(el) => {
            if (typeof inputProps.ref === 'function') {
              inputProps.ref(el);
            }
            inputRef = el;
          }}
          color={color()}
          helperText={undefined}
          label={undefined}
          wrapperClass={undefined}
          inputClass={twMerge(actionVisible() && 'pr-10', local.inputClass)}
          aria-describedby={ariaDescribedBy()}
        />

        <Show when={actionVisible()}>
          <div
            class={twMerge(
              'absolute inset-y-0 right-0 flex items-center pr-3',
              local.actionWrapperClass,
            )}
          >
            <Tooltip content={local.actionLabel}>
              <Button
                type={actionType()}
                form={local.actionForm}
                onClick={(event) => {
                  local.onActionClick?.(event);
                  inputRef?.blur();
                }}
                color={actionColor()}
                variant={actionVariant()}
                class={twMerge('px-2 py-1.5', local.actionClass)}
                disabled={actionDisabled()}
                aria-label={local.actionLabel}
              >
                <Show
                  when={actionLoading()}
                  fallback={local.actionIcon({ class: 'size-4' })}
                >
                  <Spinner size="sm" color="transparent" />
                </Show>
              </Button>
            </Tooltip>
          </div>
        </Show>
      </div>

      <Show when={local.helperText}>
        <HelperText id={helperId()} content={local.helperText!} color={color()} />
      </Show>
    </div>
  );
};

export default ActionTextInput;
