import { createSignal } from 'solid-js';

import {
  DEFAULT_REQUIREMENTS,
  Password,
  type PasswordRequirement,
  type PasswordStrength,
} from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function PasswordPage() {
  return (
    <DocPage
      title="Password"
      description="Password input with show/hide toggle, strength indicator, and customizable requirements validation."
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
          term: 'Customizable Rules',
          explanation:
            'Provide custom requirements or use defaults (length, uppercase, lowercase, number, special).',
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
            'Color variant for styling. Auto-calculated from strength if not set.',
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
            { name: 'weak', type: 'string', default: '"Weak"', description: 'Label for weak strength' },
            { name: 'fair', type: 'string', default: '"Fair"', description: 'Label for fair strength' },
            { name: 'good', type: 'string', default: '"Good"', description: 'Label for good strength' },
            { name: 'strong', type: 'string', default: '"Strong"', description: 'Label for strong strength' },
            { name: 'passwordStrength', type: 'string', default: '"Password strength"', description: 'Label for the strength indicator' },
            { name: 'passwordRequirements', type: 'string', default: '"Password requirements:"', description: 'Label for the requirements section' },
          ],
        },
        {
          name: 'PasswordAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            { name: 'showPassword', type: 'string', default: '"Show password"', description: 'Aria label for show password button' },
            { name: 'hidePassword', type: 'string', default: '"Hide password"', description: 'Aria label for hide password button' },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Simple password input with show/hide toggle.',
          component: () => {
            return (
              <div class="w-full max-w-sm">
                <Password label="Password" placeholder="Enter password" />
              </div>
            );
          },
        },
        {
          title: 'With Strength Indicator',
          description: 'Password input with visual strength meter.',
          component: () => {
            return (
              <div class="w-full max-w-sm">
                <Password label="Password" placeholder="Enter password" showStrength />
              </div>
            );
          },
        },
        {
          title: 'With Requirements Checklist',
          description: 'Password input showing validation requirements in real-time.',
          component: () => {
            return (
              <div class="w-full max-w-sm">
                <Password
                  label="Password"
                  placeholder="Enter password"
                  showRequirements
                />
              </div>
            );
          },
        },
        {
          title: 'Full Featured',
          description: 'Password input with both strength indicator and requirements.',
          component: () => {
            return (
              <div class="w-full max-w-sm">
                <Password
                  label="Create Password"
                  placeholder="Enter a strong password"
                  showStrength
                  showRequirements
                  helperText="Choose a password that meets all requirements"
                />
              </div>
            );
          },
        },
        {
          title: 'Custom Requirements',
          description: 'Password input with custom validation rules.',
          component: () => {
            const customRequirements: PasswordRequirement[] = [
              {
                key: 'minLength',
                label: 'At least 12 characters',
                validate: (password) => password.length >= 12,
              },
              {
                key: 'noSpaces',
                label: 'No spaces allowed',
                validate: (password) => !password.includes(' '),
              },
              {
                key: 'mixedCase',
                label: 'Both uppercase and lowercase',
                validate: (password) => /[a-z]/.test(password) && /[A-Z]/.test(password),
              },
            ];
            return (
              <div class="w-full max-w-sm">
                <Password
                  label="Password"
                  placeholder="Enter password"
                  showRequirements
                  requirements={customRequirements}
                />
              </div>
            );
          },
        },
        {
          title: 'With Callbacks',
          description: 'Track password strength and requirements changes.',
          component: () => {
            const [strength, setStrength] = createSignal<PasswordStrength>('weak');
            const [metCount, setMetCount] = createSignal(0);
            return (
              <div class="w-full max-w-sm space-y-4">
                <Password
                  label="Password"
                  placeholder="Enter password"
                  showStrength
                  onStrengthChange={setStrength}
                  onRequirementsChange={(met) => setMetCount(met.length)}
                />
                <div class="text-sm text-gray-600 dark:text-neutral-400">
                  <p>
                    Strength: <span class="font-medium">{strength()}</span>
                  </p>
                  <p>
                    Requirements met:{' '}
                    <span class="font-medium">
                      {metCount()} / {DEFAULT_REQUIREMENTS.length}
                    </span>
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Controlled Value',
          description: 'Control the password value externally.',
          component: () => {
            const [password, setPassword] = createSignal('');
            return (
              <div class="w-full max-w-sm space-y-4">
                <Password
                  label="Password"
                  placeholder="Enter password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  showStrength
                />
                <button
                  type="button"
                  class="cursor-pointer rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                  onClick={() => setPassword('')}
                >
                  Clear Password
                </button>
              </div>
            );
          },
        },
      ]}
      usage={`
        import { Password } from '@kayou/ui';

        <Password label="Password" placeholder="Enter password" />
        <Password label="Password" showStrength />
        <Password label="Password" showStrength showRequirements />
      `}
    />
  );
}
