import DocPage from '../../../components/DocPage';

export default function OTPInputPage() {
  return (
    <DocPage
      title="OTPInput"
      description="One-time password input with individual character cells, auto-advance, paste support, and alphanumeric input with uppercase display."
      keyConcepts={[
        {
          term: 'Auto-advance',
          explanation:
            'Focus automatically moves to the next cell after entering a character, and backwards on Backspace.',
        },
        {
          term: 'Paste Support',
          explanation:
            'Pasting a code distributes characters across cells from the focused position.',
        },
        {
          term: 'Controlled & Uncontrolled',
          explanation:
            'Pass value + onValueChange for controlled mode, or omit value for uncontrolled mode.',
        },
      ]}
      props={[
        {
          name: 'length',
          type: 'number',
          default: '6',
          description: 'Number of OTP character cells',
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Current OTP value (enables controlled mode)',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          default: '-',
          description: 'Callback fired when the OTP value changes',
        },
        {
          name: 'onComplete',
          type: '(value: string) => void',
          default: '-',
          description: 'Callback fired when all character cells are filled',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling and validation states',
        },
        {
          name: 'sizing',
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: 'Size of the individual input cells',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables all input cells',
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
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Marks the field as required (shows asterisk)',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for the group container',
        },
        {
          name: 'inputClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS class for individual input cells',
        },
        {
          name: 'autofocus',
          type: 'boolean',
          default: 'false',
          description: 'Auto-focus the first input cell on mount',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<OTPInputAriaLabels>',
          default: '{ otpInput: "One-time password", digit: "Character" }',
          description: 'Accessibility labels for the input group and cells',
        },
      ]}
      subComponents={[
        {
          name: 'OTPInputAriaLabels',
          description: 'Aria label overrides for i18n support.',
          kind: 'type',
          props: [
            {
              name: 'otpInput',
              type: 'string',
              default: '-',
              description: 'Label for the input group when no label prop is provided',
            },
            {
              name: 'digit',
              type: 'string',
              default: '-',
              description:
                'Label prefix for each cell (rendered as "Character 1 of 6")',
            },
          ],
        },
      ]}
      playground={`
        import { createSignal } from 'solid-js';
        import { OTPInput } from '@kayou/ui';

        export default function Example() {
          const [otp, setOtp] = createSignal('');

          return (
            <div class="flex flex-col gap-6">
              <OTPInput
                label="Verification Code"
                helperText="Enter the 6-character code sent to your email"
                onValueChange={setOtp}
                onComplete={(val) => alert('Code entered: ' + val)}
                required
              />

              <OTPInput
                length={4}
                sizing="lg"
                label="PIN Code"
                helperText="4-character PIN"
              />

              <OTPInput
                label="Error State"
                color="failure"
                helperText="Invalid code. Please try again."
                value="A3B"
              />

              <OTPInput
                label="Disabled"
                disabled
                value="XK92PL"
              />
            </div>
          );
        }
      `}
      usage={`
        import { OTPInput } from '@kayou/ui';

        <OTPInput onComplete={(val) => submitCode(val)} />
        <OTPInput length={4} sizing="lg" label="PIN" />
        <OTPInput value={otp()} onValueChange={setOtp} color="failure" helperText="Invalid code" />
        <OTPInput disabled value="XK92PL" />
      `}
    />
  );
}
