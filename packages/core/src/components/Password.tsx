import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import {
  CheckCircleBrokenIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
} from '@exowpee/solidly-icons';
import { twMerge } from 'tailwind-merge';

import HelperText from './HelperText';
import Label from './Label';
import TextInput, { type TextInputProps } from './TextInput';

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

export interface PasswordProps extends Omit<TextInputProps, 'type'> {
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
   * Label for the show password button.
   * @default 'Show password'
   */
  showPasswordLabel?: string;

  /**
   * Label for the hide password button.
   * @default 'Hide password'
   */
  hidePasswordLabel?: string;

  /**
   * Additional CSS class for the strength indicator container.
   */
  strengthClass?: string;

  /**
   * Additional CSS class for the requirements container.
   */
  requirementsClass?: string;
}

const strengthConfig: Record<
  PasswordStrength,
  { color: string; label: string; width: string }
> = {
  weak: {
    color: 'bg-red-500',
    label: 'Weak',
    width: 'w-1/4',
  },
  fair: {
    color: 'bg-yellow-500',
    label: 'Fair',
    width: 'w-2/4',
  },
  good: {
    color: 'bg-blue-500',
    label: 'Good',
    width: 'w-3/4',
  },
  strong: {
    color: 'bg-green-500',
    label: 'Strong',
    width: 'w-full',
  },
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
    'showStrength',
    'showRequirements',
    'requirements',
    'calculateStrength',
    'onStrengthChange',
    'onRequirementsChange',
    'showPasswordLabel',
    'hidePasswordLabel',
    'strengthClass',
    'requirementsClass',
    'value',
    'helperText',
    'label',
    'color',
    'id',
  ]);

  const [showPassword, setShowPassword] = createSignal(false);
  const [passwordValue, setPasswordValue] = createSignal('');

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

  // Update internal value when controlled value changes
  createEffect(() => {
    const val = local.value;
    if (val !== undefined) {
      setPasswordValue(String(val));
    }
  });

  // Fire callbacks when strength changes
  createEffect(() => {
    const s = strength();
    local.onStrengthChange?.(s);
  });

  // Fire callbacks when requirements change
  createEffect(() => {
    const { met, unmet } = requirementStatus();
    local.onRequirementsChange?.(met, unmet);
  });

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const value = e.currentTarget.value;
    setPasswordValue(value);
    // Call original onInput if provided
    if (typeof inputProps.onInput === 'function') {
      (inputProps.onInput as typeof handleInput)(e);
    }
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine color based on strength when password has value
  const computedColor = createMemo(() => {
    if (local.color) return local.color;
    if (!passwordValue()) return 'gray';

    const s = strength();
    if (s === 'weak') return 'failure';
    if (s === 'fair') return 'warning';
    if (s === 'good' || s === 'strong') return 'success';
    return 'gray';
  });

  const ToggleButton = () => (
    <button
      type="button"
      onClick={toggleVisibility}
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label={
        showPassword()
          ? (local.hidePasswordLabel ?? 'Hide password')
          : (local.showPasswordLabel ?? 'Show password')
      }
      tabIndex={-1}
    >
      <Show when={showPassword()} fallback={<EyeIcon class="size-5" />}>
        <EyeOffIcon class="size-5" />
      </Show>
    </button>
  );

  return (
    <div class="w-full">
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label for={inputId()} value={local.label} color={computedColor()} />
          <Show when={inputProps.required}>
            <span class="ml-0.5 font-medium text-red-500">*</span>
          </Show>
        </div>
      </Show>

      <div class="relative">
        <TextInput
          {...inputProps}
          id={inputId()}
          type={showPassword() ? 'text' : 'password'}
          value={passwordValue()}
          onInput={handleInput}
          color={computedColor()}
          inputClass={twMerge('pr-10', inputProps.inputClass)}
          aria-describedby={
            [
              local.showStrength ? strengthId() : null,
              local.showRequirements ? requirementsId() : null,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        <ToggleButton />
      </div>

      <Show when={local.showStrength && passwordValue()}>
        <div id={strengthId()} class={twMerge('mt-2', local.strengthClass)}>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">
              Password strength
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
              {strengthConfig[strength()].label}
            </span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
              aria-label={`Password strength: ${strengthConfig[strength()].label}`}
            />
          </div>
        </div>
      </Show>

      <Show when={local.showRequirements}>
        <div id={requirementsId()} class={twMerge('mt-3', local.requirementsClass)}>
          <p class="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            Password requirements:
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
                        : 'text-gray-500 dark:text-gray-400',
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

      <Show when={local.helperText}>
        <HelperText content={local.helperText!} color={computedColor()} />
      </Show>
    </div>
  );
}
