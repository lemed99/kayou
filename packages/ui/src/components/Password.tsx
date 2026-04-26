import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
  splitProps,
  untrack,
} from 'solid-js';

import { type UseFormReturn } from '@kayou/hooks';
import { CheckCircleBrokenIcon, CircleIcon, EyeIcon, EyeOffIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import HelperText from './HelperText';
import Label from './Label';
import TextInput, { type TextInputProps } from './TextInput';

type PasswordFormAdapter = Pick<
  UseFormReturn<Record<string, unknown>>,
  | 'values'
  | 'touched'
  | 'setValue'
  | 'setTouched'
  | 'setFieldError'
  | 'fieldError'
  | 'registerSubmitValidator'
>;

const toPasswordString = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  ) {
    return value.toString();
  }
  return '';
};

/**
 * Password strength levels.
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Requirement validation rule for password.
 */
export interface PasswordRequirement {
  /** Unique key for the requirement */
  key: string;
  /** Display label for the requirement */
  label: string;
  /** Validation function that returns true if requirement is met */
  validate: (password: string) => boolean;
}

/**
 * Default password requirements.
 */
export const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    validate: (password) => password.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least one uppercase letter',
    validate: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    label: 'At least one lowercase letter',
    validate: (password) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    label: 'At least one number',
    validate: (password) => /\d/.test(password),
  },
  {
    key: 'special',
    label: 'At least one special character',
    validate: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export interface PasswordLabels {
  weak: string;
  fair: string;
  good: string;
  strong: string;
  passwordStrength: string;
  passwordRequirements: string;
}

export const DEFAULT_PASSWORD_LABELS: PasswordLabels = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
  passwordStrength: 'Password strength',
  passwordRequirements: 'Password requirements:',
};

export interface PasswordAriaLabels {
  showPassword: string;
  hidePassword: string;
}

export const DEFAULT_PASSWORD_ARIA_LABELS: PasswordAriaLabels = {
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

export interface PasswordProps extends Omit<
  TextInputProps,
  | 'type'
  | 'form'
  | 'labels'
  | 'ariaLabels'
  | 'onInput'
  | 'onChange'
  | 'oninput'
  | 'onchange'
> {
  /**
   * Optional useForm instance for explicit field coupling.
   * When paired with `name`, the password writes its value and errors into the form.
   */
  form?: PasswordFormAdapter;

  /**
   * Optional override for the internal validation message pushed into the form.
   */
  validationMessage?: string;

  /**
   * Minimum strength required before the password value is exposed through `onChange`.
   * When unmet, `onChange` receives an empty string while `onInput` still receives the typed value.
   */
  requiredStrength?: PasswordStrength;

  /**
   * Callback fired on each keystroke with the actual typed password.
   */
  onInput?: (value: string) => void;

  /**
   * Callback fired on each input update with the exposed password.
   * This value respects `requiredStrength`, so it is empty until the threshold is met.
   */
  onChange?: (value: string) => void;

  /**
   * Show the password strength indicator.
   * @default false
   */
  showStrength?: boolean;

  /**
   * Show password requirements checklist.
   * @default false
   */
  showRequirements?: boolean;

  /**
   * Custom password requirements. Uses DEFAULT_REQUIREMENTS if not provided.
   */
  requirements?: PasswordRequirement[];

  /**
   * Custom function to calculate password strength.
   * If not provided, strength is calculated based on requirements met.
   */
  calculateStrength?: (
    password: string,
    metRequirements: number,
    totalRequirements: number,
  ) => PasswordStrength;

  /**
   * Callback fired when password strength changes.
   */
  onStrengthChange?: (strength: PasswordStrength) => void;

  /**
   * Callback fired when requirements validation changes.
   */
  onRequirementsChange?: (met: string[], unmet: string[]) => void;

  /**
   * Additional CSS class for the strength indicator container.
   */
  strengthClass?: string;

  /**
   * Additional CSS class for the requirements container.
   */
  requirementsClass?: string;
  /**
   * Labels for i18n support (visible text).
   */
  labels?: Partial<PasswordLabels>;
  /**
   * Aria labels for i18n support (screen-reader-only text).
   */
  ariaLabels?: Partial<PasswordAriaLabels>;
  /** Whether to capitalize the first word of the label. */
  capitalizeFirstWord?: boolean;
}

const strengthConfig: Record<PasswordStrength, { color: string; width: string }> = {
  weak: { color: 'bg-red-500', width: 'w-1/4' },
  fair: { color: 'bg-yellow-500', width: 'w-2/4' },
  good: { color: 'bg-blue-500', width: 'w-3/4' },
  strong: { color: 'bg-green-500', width: 'w-full' },
};

const strengthRank: Record<PasswordStrength, number> = {
  weak: 0,
  fair: 1,
  good: 2,
  strong: 3,
};

/**
 * Default strength calculation based on requirements met.
 */
const defaultCalculateStrength = (
  _password: string,
  metRequirements: number,
  totalRequirements: number,
): PasswordStrength => {
  const ratio = metRequirements / totalRequirements;
  if (ratio <= 0.25) return 'weak';
  if (ratio <= 0.5) return 'fair';
  if (ratio <= 0.75) return 'good';
  return 'strong';
};

/**
 * Password input component with show/hide toggle, strength indicator, and requirements validation.
 */
export default function Password(props: PasswordProps): JSX.Element {
  const [local, inputProps] = splitProps(props, [
    'requiredStrength',
    'showStrength',
    'showRequirements',
    'requirements',
    'calculateStrength',
    'onStrengthChange',
    'onRequirementsChange',
    'strengthClass',
    'requirementsClass',
    'value',
    'form',
    'validationMessage',
    'helperText',
    'label',
    'color',
    'id',
    'labels',
    'ariaLabels',
    'onInput',
    'onChange',
    'onBlur',
    'capitalizeFirstWord',
  ]);

  const l = createMemo(() => ({ ...DEFAULT_PASSWORD_LABELS, ...local.labels }));
  const a = createMemo(() => ({ ...DEFAULT_PASSWORD_ARIA_LABELS, ...local.ariaLabels }));
  const [showPassword, setShowPassword] = createSignal(false);
  const fieldName = createMemo(() =>
    typeof inputProps.name === 'string' && inputProps.name.length > 0
      ? inputProps.name
      : undefined,
  );
  const initialFormValue = (() => {
    const name = fieldName();
    if (!local.form || !name) return undefined;
    const value = local.form.values[name];
    return toPasswordString(value);
  })();
  // `value` seeds the initial password, but the field is internally uncontrolled after mount.
  const initialPasswordValue =
    initialFormValue ?? (local.value !== undefined ? toPasswordString(local.value) : '');
  const [passwordValue, setPasswordValue] = createSignal(initialPasswordValue);
  const [showFormValidationMessage, setShowFormValidationMessage] = createSignal(false);

  const uniqueId = createUniqueId();
  const inputId = createMemo(() => local.id || `password-${uniqueId}`);
  const strengthId = createMemo(() => `${inputId()}-strength`);
  const requirementsId = createMemo(() => `${inputId()}-requirements`);

  const requirements = createMemo(() => local.requirements ?? DEFAULT_REQUIREMENTS);

  // Track which requirements are met
  const requirementStatus = createMemo(() => {
    const password = passwordValue();
    const met: string[] = [];
    const unmet: string[] = [];

    for (const req of requirements()) {
      if (req.validate(password)) {
        met.push(req.key);
      } else {
        unmet.push(req.key);
      }
    }

    return { met, unmet };
  });

  // Calculate strength
  const strength = createMemo((): PasswordStrength => {
    const password = passwordValue();
    if (!password) return 'weak';

    const { met } = requirementStatus();
    const calculator = local.calculateStrength ?? defaultCalculateStrength;
    return calculator(password, met.length, requirements().length);
  });

  const meetsRequiredStrength = createMemo(() => {
    const requiredStrength = local.requiredStrength;
    if (!requiredStrength) return true;

    const password = passwordValue();
    if (!password) return false;

    return strengthRank[strength()] >= strengthRank[requiredStrength];
  });

  // `onChange` consumers only receive the real password once the configured threshold is satisfied.
  const exposedValue = createMemo(() =>
    local.requiredStrength && !meetsRequiredStrength() ? '' : passwordValue(),
  );

  const isPasswordEmpty = createMemo(() => passwordValue().length === 0);

  const passwordValidationError = createMemo(() => {
    if (isPasswordEmpty()) {
      return inputProps.required
        ? local.validationMessage || 'Password is required'
        : undefined;
    }

    if (local.requiredStrength) {
      if (meetsRequiredStrength()) return undefined;

      const currentStrength = passwordValue()
        ? l()[strength()].toLowerCase()
        : l().weak.toLowerCase();
      const requiredStrength = l()[local.requiredStrength].toLowerCase();

      return (
        local.validationMessage ??
        `Password strength is currently ${currentStrength.toLocaleLowerCase()}. It must be at least ${requiredStrength.toLocaleLowerCase()}.`
      );
    }

    if (requirementStatus().unmet.length === 0) return undefined;

    const unmetRequirementLabels = requirements()
      .filter((req) => requirementStatus().unmet.includes(req.key))
      .map((req) => req.label.toLowerCase());

    return (
      local.validationMessage ??
      `Password is missing: ${unmetRequirementLabels.join(', ')}.`
    );
  });

  const formFieldError = createMemo(() => {
    const form = local.form;
    const name = fieldName();
    if (!form || !name) return undefined;
    return form.fieldError(name);
  });

  const hasVisibleFormErrors = createMemo(() => Boolean(formFieldError()));

  // Fire callbacks when strength changes (deferred to skip initial mount)
  createEffect(
    on(
      strength,
      (s) => {
        local.onStrengthChange?.(s);
      },
      { defer: true },
    ),
  );

  // Fire callbacks when requirements change (deferred to skip initial mount)
  createEffect(
    on(
      requirementStatus,
      ({ met, unmet }) => {
        local.onRequirementsChange?.(met, unmet);
      },
      { defer: true },
    ),
  );

  createEffect(() => {
    const form = local.form;
    const name = fieldName();
    if (!form || !name) return;

    const nextValue = form.values[name];
    const normalizedValue = toPasswordString(nextValue);

    if (normalizedValue !== untrack(passwordValue)) {
      setPasswordValue(normalizedValue);
    }
  });

  const dispatchChangeToConsumer = () => {
    const nextValue = exposedValue();
    local.onChange?.(nextValue);
  };

  const hideFormValidationMessage = () => {
    const form = local.form;
    const name = fieldName();
    if (!form || !name) return;

    form.setTouched(name, false);
    form.setFieldError(name, undefined);
  };

  const syncFormValue = (value: string) => {
    const form = local.form;
    const name = fieldName();
    if (!form || !name) return;

    form.setValue(name, value);
  };

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const value = e.currentTarget.value;
    setPasswordValue(value);
    syncFormValue(value);
    if (showFormValidationMessage()) {
      setShowFormValidationMessage(false);
      hideFormValidationMessage();
    }
    local.onInput?.(value);
    handleChange();
  };

  const handleChange = () => {
    dispatchChangeToConsumer();
  };

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    const blurHandler = local.onBlur;
    if (typeof blurHandler === 'function') {
      blurHandler(
        e as FocusEvent & {
          currentTarget: HTMLInputElement;
          target: HTMLInputElement;
        },
      );
    } else if (Array.isArray(blurHandler)) {
      blurHandler[0](
        blurHandler[1],
        e as FocusEvent & {
          currentTarget: HTMLInputElement;
          target: HTMLInputElement;
        },
      );
    }
  };

  let inputRef: HTMLInputElement | undefined;

  createEffect(() => {
    const form = local.form;
    const name = fieldName();

    if (!form || !name || !form.registerSubmitValidator) return;

    const unregister = form.registerSubmitValidator(`password:${name}`, () => {
      const error = passwordValidationError();
      return error ? { [name]: error } : {};
    });

    onCleanup(unregister);
  });

  const toggleVisibility = () => {
    const cursorPos = inputRef?.selectionStart ?? passwordValue().length;
    setShowPassword((prev) => !prev);
    // Restore cursor position after the type change
    requestAnimationFrame(() => {
      inputRef?.setSelectionRange(cursorPos, cursorPos);
    });
  };

  // Determine color based on strength when password has value and showStrength is enabled
  const computedColor = createMemo(() => {
    if (passwordValue() && local.requiredStrength && !meetsRequiredStrength()) {
      return 'failure';
    }

    if (local.color) return local.color;
    if (!local.showStrength || !passwordValue()) return 'gray';

    const s = strength();
    if (s === 'weak') return 'failure';
    if (s === 'fair') return 'warning';
    if (s === 'good' || s === 'strong') return 'success';
    return 'gray';
  });

  const resolvedColor = createMemo(() => {
    if (hasVisibleFormErrors()) return 'failure';
    return computedColor();
  });

  const resolvedHelperText = createMemo(() => {
    if (hasVisibleFormErrors()) {
      return formFieldError();
    }

    return local.helperText;
  });

  const showValidationRequirements = createMemo(
    () => local.showRequirements || hasVisibleFormErrors(),
  );

  const showValidationStrength = createMemo(
    () => local.showStrength && !hasVisibleFormErrors(),
  );

  const toggleIconColors: Record<string, string> = {
    gray: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-500 tansition-all',
    info: 'text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 tansition-all',
    failure:
      'text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600 tansition-all',
    warning:
      'text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-600 tansition-all',
    success:
      'text-green-500 hover:text-green-700 dark:text-green-500 dark:hover:text-green-600 tansition-all',
  };

  return (
    <div class="w-full">
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label
            for={inputId()}
            capitalizeFirstWord={local.capitalizeFirstWord}
            value={local.label}
            color={resolvedColor()}
          />
          <Show when={inputProps.required}>
            <span class="ml-0.5 font-medium text-red-500">*</span>
          </Show>
        </div>
      </Show>

      <div class="relative">
        <TextInput
          {...inputProps}
          ref={(el) => {
            inputRef = el;
          }}
          id={inputId()}
          type={showPassword() ? 'text' : 'password'}
          placeholder="●●●●●●●●"
          value={passwordValue()}
          onInput={handleInput}
          onBlur={handleBlur}
          color={resolvedColor()}
          inputClass={twMerge('pr-10', inputProps.inputClass)}
          aria-describedby={
            [
              showValidationStrength() ? strengthId() : null,
              showValidationRequirements() ? requirementsId() : null,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        <button
          type="button"
          onClick={toggleVisibility}
          onMouseDown={(e) => e.preventDefault()}
          class={twMerge(
            'absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 transition-all',
            toggleIconColors[resolvedColor()],
          )}
          aria-label={showPassword() ? a().hidePassword : a().showPassword}
        >
          <Show when={showPassword()} fallback={<EyeIcon class="size-5" />}>
            <EyeOffIcon class="size-5" />
          </Show>
        </button>
      </div>

      <Show when={resolvedHelperText()}>
        <HelperText content={resolvedHelperText()!} color={resolvedColor()} />
      </Show>

      <Show when={showValidationStrength() && passwordValue()}>
        <div id={strengthId()} class={twMerge('mt-2', local.strengthClass)}>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-xs text-neutral-600 dark:text-neutral-400">
              {l().passwordStrength}
            </span>
            <span
              class={twMerge(
                'text-xs font-medium',
                strength() === 'weak' && 'text-red-600 dark:text-red-400',
                strength() === 'fair' && 'text-yellow-600 dark:text-yellow-400',
                strength() === 'good' && 'text-blue-600 dark:text-blue-400',
                strength() === 'strong' && 'text-green-600 dark:text-green-400',
              )}
            >
              {l()[strength()]}
            </span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              class={twMerge(
                'h-full rounded-full transition-all duration-300',
                strengthConfig[strength()].color,
                strengthConfig[strength()].width,
              )}
              role="progressbar"
              aria-valuenow={
                strength() === 'weak'
                  ? 25
                  : strength() === 'fair'
                    ? 50
                    : strength() === 'good'
                      ? 75
                      : 100
              }
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${l().passwordStrength}: ${l()[strength()]}`}
            />
          </div>
        </div>
      </Show>

      <Show when={showValidationRequirements()}>
        <div id={requirementsId()} class={twMerge('mt-3', local.requirementsClass)}>
          <p class="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {l().passwordRequirements}
          </p>
          <ul class="space-y-1">
            <For each={requirements()}>
              {(req) => {
                const isMet = createMemo(() => requirementStatus().met.includes(req.key));
                return (
                  <li
                    class={twMerge(
                      'flex items-center gap-2 text-xs transition-colors',
                      isMet()
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-neutral-500 dark:text-neutral-400',
                    )}
                  >
                    <Show when={isMet()} fallback={<CircleIcon />}>
                      <CheckCircleBrokenIcon />
                    </Show>
                    <span>{req.label}</span>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
}
