import DocPage from '../../../components/DocPage';

export default function TimePickerPage() {
  return (
    <DocPage
      title="TimePicker"
      description="Time input with hour, minute, and optional second fields, supporting 12h and 24h format."
      keyConcepts={[
        {
          term: 'TimeValue',
          explanation:
            'Value object with hour (0-23), minute (0-59), and second (0-59). Always uses 24h internally.',
        },
        {
          term: '12h / 24h Format',
          explanation:
            'format="12h" shows an AM/PM dropdown; the value is always stored in 24h format.',
        },
        {
          term: 'Step Control',
          explanation:
            'minuteStep and secondStep control the increment/decrement amounts and wrap behavior.',
        },
        {
          term: 'Form Integration',
          explanation:
            'Supports label, helperText, required, color, disabled, isLoading, and name for form submission.',
        },
      ]}
      props={[
        {
          name: 'value',
          type: 'TimeValue',
          default: '{ hour: 0, minute: 0, second: 0 }',
          description: 'Current time value.',
        },
        {
          name: 'onChange',
          type: '(value: TimeValue) => void',
          default: '-',
          description: 'Callback fired when the time changes.',
        },
        {
          name: 'format',
          type: '"12h" | "24h"',
          default: '"24h"',
          description: 'Time display format.',
        },
        {
          name: 'minuteStep',
          type: 'number',
          default: '1',
          description: 'Minute step increment.',
        },
        {
          name: 'secondStep',
          type: 'number',
          default: '1',
          description: 'Second step increment.',
        },
        {
          name: 'showSeconds',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show the seconds input.',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label text above the input.',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text below the input.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Shows required asterisk next to the label.',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling and validation states.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the input.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows a loading spinner and disables the input.',
        },
        {
          name: 'sizing',
          type: '"xs" | "sm" | "md"',
          default: '"md"',
          description: 'Input size variant.',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TimePickerAriaLabels>',
          default: 'DEFAULT_TIME_PICKER_ARIA_LABELS',
          description: 'Accessibility labels for screen readers.',
        },
      ]}
      subComponents={[
        {
          name: 'TimeValue',
          kind: 'type',
          description: 'Object representing a time in 24h format.',
          props: [
            {
              name: 'hour',
              type: 'number',
              default: '0',
              description: 'Hour in 24h format (0-23).',
              required: true,
            },
            {
              name: 'minute',
              type: 'number',
              default: '0',
              description: 'Minute (0-59).',
              required: true,
            },
            {
              name: 'second',
              type: 'number',
              default: '0',
              description: 'Second (0-59).',
              required: true,
            },
          ],
        },
        {
          name: 'TimePickerAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for the TimePicker component.',
          props: [
            {
              name: 'timePicker',
              type: 'string',
              default: '"Time selection"',
              description: 'Aria label for the time picker group.',
            },
            {
              name: 'hour',
              type: 'string',
              default: '"Hour"',
              description: 'Aria label for the hour input.',
            },
            {
              name: 'minute',
              type: 'string',
              default: '"Minute"',
              description: 'Aria label for the minute input.',
            },
            {
              name: 'second',
              type: 'string',
              default: '"Second"',
              description: 'Aria label for the second input.',
            },
          ],
        },
      ]}
      playground={`
        import { createSignal } from 'solid-js';
        import { TimePicker, type TimeValue } from '@kayou/ui';

        export default function Example() {
          const [time24h, setTime24h] = createSignal<TimeValue>({ hour: 14, minute: 30, second: 0 });
          const [time12h, setTime12h] = createSignal<TimeValue>({ hour: 9, minute: 0, second: 0 });
          const [secTime, setSecTime] = createSignal<TimeValue>({ hour: 0, minute: 0, second: 0 });
          const [stepTime, setStepTime] = createSignal<TimeValue>({ hour: 10, minute: 0, second: 0 });
          const [midnight, setMidnight] = createSignal<TimeValue>({ hour: 0, minute: 0, second: 0 });
          const [secStep, setSecStep] = createSignal<TimeValue>({ hour: 8, minute: 0, second: 0 });

          return (
            <div class="flex flex-col gap-6 w-80">
              <div data-section="basic-24h">
                <TimePicker label="Start Time" value={time24h()} onChange={setTime24h} />
                <p data-testid="basic-24h-value" class="mt-1 text-xs text-neutral-500">
                  {time24h().hour + ':' + time24h().minute + ':' + time24h().second}
                </p>
              </div>

              <div data-section="format-12h">
                <TimePicker label="Meeting Time" format="12h" value={time12h()} onChange={setTime12h} />
                <p data-testid="format-12h-value" class="mt-1 text-xs text-neutral-500">
                  {time12h().hour + ':' + time12h().minute + ':' + time12h().second}
                </p>
              </div>

              <div data-section="with-seconds">
                <TimePicker label="Precise Time" showSeconds value={secTime()} onChange={setSecTime} />
                <p data-testid="with-seconds-value" class="mt-1 text-xs text-neutral-500">
                  {secTime().hour + ':' + secTime().minute + ':' + secTime().second}
                </p>
              </div>

              <div data-section="step-control">
                <TimePicker label="Appointment" minuteStep={15} value={stepTime()} onChange={setStepTime} />
                <p data-testid="step-value" class="mt-1 text-xs text-neutral-500">
                  {stepTime().hour + ':' + stepTime().minute}
                </p>
              </div>

              <div data-section="midnight-12h">
                <TimePicker label="Midnight" format="12h" value={midnight()} onChange={setMidnight} />
                <p data-testid="midnight-12h-value" class="mt-1 text-xs text-neutral-500">
                  {midnight().hour + ':' + midnight().minute + ':' + midnight().second}
                </p>
              </div>

              <div data-section="second-step">
                <TimePicker label="Seconds" showSeconds secondStep={15} value={secStep()} onChange={setSecStep} />
                <p data-testid="second-step-value" class="mt-1 text-xs text-neutral-500">
                  {secStep().hour + ':' + secStep().minute + ':' + secStep().second}
                </p>
              </div>

              <div data-section="disabled">
                <TimePicker label="Disabled" disabled value={{ hour: 10, minute: 0, second: 0 }} />
              </div>

              <div data-section="loading">
                <TimePicker label="Loading" isLoading />
              </div>

              <div data-section="validation">
                <TimePicker label="Error" color="failure" helperText="Time is required" required />
                <TimePicker label="Warning" color="warning" helperText="Outside business hours" />
                <TimePicker label="Success" color="success" helperText="Time is valid" />
              </div>

              <div data-section="sizing">
                <div class="flex flex-col gap-2">
                  <TimePicker sizing="xs" />
                  <TimePicker label="Small" sizing="sm" />
                  <TimePicker label="Medium" sizing="md" />
                </div>
              </div>
            </div>
          );
        }
      `}
      usage={`
        import { TimePicker, type TimeValue } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        const [time, setTime] = createSignal<TimeValue>({ hour: 0, minute: 0, second: 0 });

        // Basic 24h format
        <TimePicker label="Start Time" value={time()} onChange={setTime} />

        // 12h format with AM/PM
        <TimePicker format="12h" label="Time" value={time()} onChange={setTime} />

        // With seconds and step control
        <TimePicker showSeconds minuteStep={15} label="Alarm" />

        // Validation state
        <TimePicker color="failure" helperText="Invalid time" />
      `}
    />
  );
}
