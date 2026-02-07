import { createSignal } from 'solid-js';

import { NumberInput } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function NumberInputPage() {
  return (
    <DocPage
      title="NumberInput"
      description="Numeric input with integer/float support, min/max constraints, step increments, and optional arrow buttons."
      keyConcepts={[
        {
          term: 'Typed Callbacks',
          explanation: 'onValueChange returns number | null for type safety.',
        },
        {
          term: 'Blur Validation',
          explanation:
            'Values are validated, formatted, and clamped on blur. No reformatting during typing.',
        },
        {
          term: 'Constraint Enforcement',
          explanation: 'Min/max enforced on blur; step controls increments.',
        },
      ]}
      props={[
        {
          name: 'type',
          type: '"integer" | "float"',
          default: '"integer"',
          description: 'Number format: integer or floating-point',
        },
        {
          name: 'min',
          type: 'number',
          default: '-',
          description: 'Minimum allowed value',
        },
        {
          name: 'max',
          type: 'number',
          default: '-',
          description: 'Maximum allowed value',
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: 'Increment/decrement step amount',
        },
        {
          name: 'precision',
          type: 'number',
          default: '3',
          description: 'Decimal places for float type',
        },
        {
          name: 'showArrows',
          type: 'boolean',
          default: 'false',
          description: 'Shows up/down arrow buttons',
        },
        {
          name: 'allowZero',
          type: 'boolean',
          default: 'true',
          description: 'Allows zero as a valid value',
        },
        {
          name: 'allowNegativeValues',
          type: 'boolean',
          default: 'false',
          description: 'Allows negative number input',
        },
        {
          name: 'onValueChange',
          type: '(value: number | null) => void',
          default: '-',
          description: 'Callback with typed numeric value',
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
          default: '"gray"',
          description: 'Color variant for styling',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TextInputAriaLabels>',
          default: '{ increase: "Increase value", decrease: "Decrease value" }',
          description: 'Accessibility labels forwarded to underlying TextInput',
        },
      ]}
      examples={[
        {
          title: 'Basic Integer Input',
          description: 'Simple number input for integers.',
          component: () => <NumberInput placeholder="Enter a number" />,
        },
        {
          title: 'With Arrow Buttons',
          description: 'Number input with increment/decrement buttons.',
          component: () => <NumberInput showArrows placeholder="0" />,
        },
        {
          title: 'Float Input',
          description: 'Allows decimal values with configurable precision.',
          component: () => (
            <NumberInput type="float" precision={2} placeholder="0.00" label="Price" />
          ),
        },
        {
          title: 'With Min and Max',
          description: 'Constrained to a specific range.',
          component: () => (
            <NumberInput
              min={0}
              max={100}
              showArrows
              label="Percentage"
              helperText="Value between 0 and 100"
            />
          ),
        },
        {
          title: 'Custom Step',
          description: 'Increment by a custom step value.',
          component: () => (
            <NumberInput step={5} showArrows label="Quantity" helperText="Step by 5" />
          ),
        },
        {
          title: 'Negative Values',
          description: 'Allows negative number input.',
          component: () => (
            <NumberInput
              allowNegativeValues
              showArrows
              label="Temperature"
              helperText="Can be negative"
            />
          ),
        },
        {
          title: 'Controlled with onValueChange',
          description: 'Interactive example with typed numeric callback.',
          component: () => {
            const [value, setValue] = createSignal<number | null>(null);
            return (
              <NumberInput
                showArrows
                label="Quantity"
                value={value()?.toString() ?? ''}
                onValueChange={setValue}
                helperText={`Numeric value: ${value()}`}
              />
            );
          },
        },
        {
          title: 'Float with Custom Precision',
          description: 'Float input with 4 decimal places.',
          component: () => (
            <NumberInput
              type="float"
              precision={4}
              step={0.0001}
              showArrows
              label="Coordinates"
            />
          ),
        },
        {
          title: 'Blur Validation',
          description:
            'Values are validated, formatted, and clamped when the input loses focus. Type a value and click away to see it processed.',
          component: () => {
            const [value, setValue] = createSignal<number | null>(null);
            return (
              <NumberInput
                type="float"
                precision={2}
                label="Price"
                onValueChange={setValue}
                helperText={`Processed value: ${value()}`}
              />
            );
          },
        },
      ]}
      usage={`
        import { NumberInput } from '@kayou/ui';

        <NumberInput placeholder="Enter quantity" />
        <NumberInput showArrows min={0} max={100} step={5} />
        <NumberInput type="float" precision={2} label="Price" />
        <NumberInput allowNegativeValues label="Temperature" />
      `}
    />
  );
}
