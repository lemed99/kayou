import { createSignal } from 'solid-js';

import { useForm } from '@kayou/hooks';
import { Button, Form, Password, type PasswordStrength } from '@kayou/ui';

import DocPage from '../../../components/DocPage';

function PasswordBehaviorExamples() {
  const [passthroughValue, setPassthroughValue] = createSignal('');

  const [thresholdTypedValue, setThresholdTypedValue] = createSignal('');
  const [thresholdAcceptedValue, setThresholdAcceptedValue] = createSignal('');
  const [thresholdStrength, setThresholdStrength] =
    createSignal<PasswordStrength>('weak');

  const [customTypedValue, setCustomTypedValue] = createSignal('');
  const [customAcceptedValue, setCustomAcceptedValue] = createSignal('');
  const [customStrength, setCustomStrength] = createSignal<PasswordStrength>('weak');

  const [colorOverrideTypedValue, setColorOverrideTypedValue] = createSignal('');
  const [colorOverrideAcceptedValue, setColorOverrideAcceptedValue] = createSignal('');
  const [colorOverrideStrength, setColorOverrideStrength] =
    createSignal<PasswordStrength>('weak');

  const [camelChangeValue, setCamelChangeValue] = createSignal('');
  const [submittedPassword, setSubmittedPassword] = createSignal('');
  const form = useForm({
    initialValues: { password: '' },
    onSubmit: (values) => {
      setSubmittedPassword(values.password);
    },
  });

  return (
    <section id="behavior-examples" class="mb-8 scroll-mt-20">
      <h2 class="mb-4 text-2xl font-medium">Behavior Examples</h2>
      <p class="mb-6 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
        These examples show the difference between the typed password and the value
        exposed to consumers when `requiredStrength` is enabled. The supported consumer
        callbacks are `onInput(value: string)` and `onChange(value: string)`.
      </p>

      <div class="grid gap-6 xl:grid-cols-2">
        <div
          data-section="passthrough"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Raw typed value
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            `onInput` always receives the real typed password, even when a required
            strength is configured.
          </p>
          <div class="mt-4">
            <Password
              label="Password"
              placeholder="Type any password"
              onInput={setPassthroughValue}
              showStrength
            />
            <p data-testid="passthrough-typed" class="mt-3 text-xs text-neutral-500">
              Typed value: {passthroughValue() || '[empty]'}
            </p>
          </div>
        </div>

        <div
          data-section="required-strong"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Accepted value with `onChange`
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Use `onInput` for the current typed value and `onChange` for the exposed value
            emitted on each input update after the strength gate is applied.
          </p>
          <div class="mt-4">
            <Password
              label="Create password"
              placeholder="Strong passwords only"
              onInput={setThresholdTypedValue}
              onChange={setThresholdAcceptedValue}
              onStrengthChange={setThresholdStrength}
              requiredStrength="strong"
              showStrength
              showRequirements
              helperText="Type freely; onChange fires on each input update with the gated value."
            />
            <p data-testid="threshold-typed" class="mt-3 text-xs text-neutral-500">
              Typed value: {thresholdTypedValue() || '[empty]'}
            </p>
            <p data-testid="threshold-accepted" class="mt-3 text-xs text-neutral-500">
              Accepted value: {thresholdAcceptedValue() || '[empty]'}
            </p>
            <p data-testid="threshold-strength" class="mt-1 text-xs text-neutral-500">
              Current strength: {thresholdStrength()}
            </p>
            <p data-testid="threshold-status" class="mt-1 text-xs text-neutral-500">
              Status: {thresholdAcceptedValue() ? 'accepted' : 'rejected'}
            </p>
          </div>
        </div>

        <div
          data-section="custom-strength"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Custom strength calculator
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            This example treats any password ending with `z` as `strong`, even if it would
            be weak under the default requirements.
          </p>
          <div class="mt-4">
            <Password
              label="Custom strength"
              placeholder="Try abcdefz"
              onInput={setCustomTypedValue}
              onChange={setCustomAcceptedValue}
              onStrengthChange={setCustomStrength}
              requiredStrength="strong"
              calculateStrength={(password) => {
                if (!password) return 'weak';
                if (password.endsWith('z')) return 'strong';
                if (password.length >= 6) return 'good';
                return 'weak';
              }}
              showStrength
              helperText="onChange fires on each input update after the custom strength check."
            />
            <p data-testid="custom-typed" class="mt-3 text-xs text-neutral-500">
              Typed value: {customTypedValue() || '[empty]'}
            </p>
            <p data-testid="custom-accepted" class="mt-3 text-xs text-neutral-500">
              Accepted value: {customAcceptedValue() || '[empty]'}
            </p>
            <p data-testid="custom-strength" class="mt-1 text-xs text-neutral-500">
              Current strength: {customStrength()}
            </p>
          </div>
        </div>

        <div
          data-section="color-override"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Threshold styling overrides color
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Even with `color=&quot;info&quot;`, the input renders failure styling until
            the strong threshold is met.
          </p>
          <div class="mt-4">
            <Password
              label="Color override"
              placeholder="Explicit color still yields failure"
              onInput={setColorOverrideTypedValue}
              onChange={setColorOverrideAcceptedValue}
              onStrengthChange={setColorOverrideStrength}
              requiredStrength="strong"
              color="info"
              showStrength
              helperText="The field stays visually invalid until the threshold is met."
            />
            <p data-testid="color-override-typed" class="mt-3 text-xs text-neutral-500">
              Typed value: {colorOverrideTypedValue() || '[empty]'}
            </p>
            <p
              data-testid="color-override-accepted"
              class="mt-3 text-xs text-neutral-500"
            >
              Accepted value: {colorOverrideAcceptedValue() || '[empty]'}
            </p>
            <p
              data-testid="color-override-strength"
              class="mt-1 text-xs text-neutral-500"
            >
              Current strength: {colorOverrideStrength()}
            </p>
          </div>
        </div>

        <div
          data-section="change-handler-camel"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            `onChange` returns accepted value
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            `onChange` receives the strength-gated value on each input update, so it is
            the right place to read the exposed password.
          </p>
          <div class="mt-4">
            <Password
              label="Change event"
              placeholder="Accepted value updates on each input"
              onChange={setCamelChangeValue}
              requiredStrength="strong"
              showStrength
            />
            <p data-testid="camel-change-value" class="mt-3 text-xs text-neutral-500">
              Accepted value: {camelChangeValue() || '[empty]'}
            </p>
          </div>
        </div>

        <div
          data-section="form-coupling"
          class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-base font-medium text-neutral-900 dark:text-white">
            Coupled to `useForm`
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Pass `form` and `name` to let `Password` own its validation and push that
            field error into `useForm`. On invalid submit, Password hides the strength
            bar, reveals the requirements list, and shows the field message. Typing hides
            the message again. Do not also add schema or validate rules for the same
            password field.
          </p>
          <div class="mt-4">
            <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
              <div class="flex flex-col gap-3">
                <Password
                  label="Password"
                  name="password"
                  form={form}
                  requiredStrength="strong"
                  showStrength
                />
                <Button type="submit">Submit</Button>
                <p data-testid="form-coupling-submitted" class="text-xs text-neutral-500">
                  Submitted value: {submittedPassword() || '[empty]'}
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PasswordPage() {
  return (
    <DocPage
      title="Password"
      description="Password input with show/hide toggle, customizable strength validation, and optional gating of the value exposed to consumers."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Show/Hide Toggle',
          explanation: 'Toggle password visibility with accessible button and eye icons.',
        },
        {
          term: 'Strength Indicator',
          explanation:
            'Visual progress bar showing password strength (weak, fair, good, strong).',
        },
        {
          term: 'Requirements Validation',
          explanation: 'Real-time checklist of customizable password requirements.',
        },
        {
          term: 'Required Strength Gating',
          explanation:
            'Use `onInput` when you need the live typed password, and `onChange` when you need the live strength-gated value emitted on each input update after applying `requiredStrength`.',
        },
        {
          term: 'Form-owned Password Validation',
          explanation:
            'Pass `form` and `name` to let Password validate itself and write its own field error into useForm.',
        },
      ]}
      props={[
        {
          name: 'showStrength',
          type: 'boolean',
          default: 'false',
          description: 'Show the password strength indicator bar',
        },
        {
          name: 'showRequirements',
          type: 'boolean',
          default: 'false',
          description: 'Show password requirements checklist',
        },
        {
          name: 'requirements',
          type: 'PasswordRequirement[]',
          default: 'DEFAULT_REQUIREMENTS',
          description:
            'Custom password requirements with key, label, and validate function',
        },
        {
          name: 'calculateStrength',
          type: '(password, met, total) => PasswordStrength',
          default: '-',
          description: 'Custom function to calculate password strength',
        },
        {
          name: 'requiredStrength',
          type: 'PasswordStrength',
          default: '-',
          description:
            'Minimum strength required before `onChange` receives the real password value. Below the threshold, `onChange` receives an empty string while `onInput` still receives the typed value.',
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description:
            'Initial password value. The component is internally uncontrolled, so later external value changes do not resync the rendered input.',
        },
        {
          name: 'form',
          type: 'UseFormReturn<Record<string, unknown>>',
          default: '-',
          description:
            'Optional useForm instance. When paired with `name`, Password writes the real value and its internal validation error into the form.',
        },
        {
          name: 'validationMessage',
          type: 'string',
          default: '-',
          description:
            'Optional override for the internal validation message pushed into useForm when the password field is invalid. By default the message explains the current strength or lists the unmet requirements.',
        },
        {
          name: 'onInput',
          type: '(value: string) => void',
          default: '-',
          description:
            'Receives the real typed password on every keystroke. Use this when you need the current visible input value.',
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          default: '-',
          description:
            'Receives the exposed password on each input update. When `requiredStrength` is set, this stays empty until the password meets that threshold.',
        },
        {
          name: 'onStrengthChange',
          type: '(strength: PasswordStrength) => void',
          default: '-',
          description: 'Callback fired when password strength changes',
        },
        {
          name: 'onRequirementsChange',
          type: '(met: string[], unmet: string[]) => void',
          default: '-',
          description: 'Callback fired when requirements validation changes',
        },
        {
          name: 'labels',
          type: 'Partial<PasswordLabels>',
          default: 'DEFAULT_PASSWORD_LABELS',
          description: 'Visible text labels for the password component',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<PasswordAriaLabels>',
          default: 'DEFAULT_PASSWORD_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
        {
          name: 'strengthClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for strength indicator container',
        },
        {
          name: 'requirementsClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for requirements container',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label text displayed above the input',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the input',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: 'Auto (based on strength)',
          description:
            'Color variant for styling. When `requiredStrength` is unmet, failure styling overrides the configured color.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the input',
        },
      ]}
      subComponents={[
        {
          name: 'PasswordLabels',
          kind: 'type',
          description: 'Visible text labels for the password component',
          props: [
            {
              name: 'weak',
              type: 'string',
              default: '"Weak"',
              description: 'Label for weak strength',
            },
            {
              name: 'fair',
              type: 'string',
              default: '"Fair"',
              description: 'Label for fair strength',
            },
            {
              name: 'good',
              type: 'string',
              default: '"Good"',
              description: 'Label for good strength',
            },
            {
              name: 'strong',
              type: 'string',
              default: '"Strong"',
              description: 'Label for strong strength',
            },
            {
              name: 'passwordStrength',
              type: 'string',
              default: '"Password strength"',
              description: 'Label for the strength indicator',
            },
            {
              name: 'passwordRequirements',
              type: 'string',
              default: '"Password requirements:"',
              description: 'Label for the requirements section',
            },
          ],
        },
        {
          name: 'PasswordAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            {
              name: 'showPassword',
              type: 'string',
              default: '"Show password"',
              description: 'Aria label for show password button',
            },
            {
              name: 'hidePassword',
              type: 'string',
              default: '"Hide password"',
              description: 'Aria label for hide password button',
            },
          ],
        },
      ]}
      playground={`
        import { createSignal } from 'solid-js';
        import { useForm } from '@kayou/hooks';
        import { Password, type PasswordStrength } from '@kayou/ui';

        export default function Example() {
          const [acceptedValue, setAcceptedValue] = createSignal('');
          const [strength, setStrength] = createSignal<PasswordStrength>('weak');
          const form = useForm({
            initialValues: { password: '' },
            onSubmit: (values) => console.log(values.password),
          });

          return (
            <div class="w-full max-w-sm">
              <Password
                label="Create Password"
                placeholder="Enter a strong password"
                onChange={setAcceptedValue}
                onStrengthChange={setStrength}
                requiredStrength="strong"
                showStrength
                showRequirements
              />
              <p class="mt-2 text-xs text-neutral-500">
                Accepted value: {acceptedValue() || '[empty]'}
              </p>
              <p class="mt-1 text-xs text-neutral-500">
                Current strength: {strength()}
              </p>
              <Password
                label="Password in a form"
                name="password"
                form={form}
                requiredStrength="strong"
                showStrength
                showRequirements
              />
            </div>
          );
        }
      `}
      usage={`
        import { Password } from '@kayou/ui';
        import { useForm } from '@kayou/hooks';
        import { createSignal } from 'solid-js';

        const [acceptedPassword, setAcceptedPassword] = createSignal('');
        const form = useForm({
          initialValues: { password: '' },
          onSubmit: (values) => console.log(values.password),
        });

        <Password label="Password" placeholder="Enter password" onInput={(value) => console.log(value)} />
        <Password label="Password" showStrength />
        <Password label="Password" showStrength showRequirements />
        <Password label="Password" requiredStrength="strong" onChange={setAcceptedPassword} showStrength showRequirements />
        <Password label="Password" name="password" form={form} requiredStrength="strong" showStrength showRequirements />
      `}
    >
      <PasswordBehaviorExamples />
    </DocPage>
  );
}
