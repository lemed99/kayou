import { createSignal } from 'solid-js';

import NumberInput from '@lib/components/NumberInput';
import DocPage from '../../components/DocPage';

export default function NumberInputPage() {
  return (
    <DocPage
      title="NumberInput"
      description="A specialized input component optimized for numeric data entry. Unlike generic text inputs, NumberInput understands numbers—it supports integers and floating-point values, enforces min/max constraints, respects step increments, and provides optional arrow buttons for quick adjustments. The component features intelligent debounced value processing that auto-formats and validates after 2 seconds of inactivity, preventing premature validation errors while typing. It includes full clipboard support (Ctrl/Cmd+C/V/X), keyboard navigation (Arrow Up/Down to increment/decrement), and typed callbacks that return actual numbers rather than strings."
      keyConcepts={[
        {
          term: 'Debounced Processing',
          explanation:
            'Values are processed and formatted after 2 seconds of inactivity (configurable via debounceDelay). This allows users to type freely without interruption, then see their input validated and formatted. Set debounceDelay to 0 for blur-only processing.',
        },
        {
          term: 'Typed Callbacks',
          explanation:
            'The onValueChange callback returns number | null, not strings. This eliminates parsing logic in parent components and ensures type safety for numeric operations.',
        },
        {
          term: 'Constraint Enforcement',
          explanation:
            'Min/max values are enforced on blur and through arrow buttons. The step prop controls increment/decrement amounts. For floats, precision controls decimal places.',
        },
      ]}
      value="Numeric inputs are critical for financial data, quantities, measurements, and configuration values. Proper number handling prevents data corruption (leading zeros, invalid characters), ensures consistent precision for calculations, and provides a superior UX with keyboard shortcuts and smart validation timing."
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
          name: 'nullable',
          type: 'boolean',
          default: 'true',
          description: 'Allows empty/null values',
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
          name: 'debounceDelay',
          type: 'number',
          default: '2000',
          description:
            'Delay in ms before processing value after typing. Set to 0 to disable.',
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
      ]}
      examples={[
        {
          title: 'Basic Integer Input',
          description: 'Simple number input for integers.',
          code: `<NumberInput placeholder="Enter a number" />`,
          component: () => <NumberInput placeholder="Enter a number" />,
        },
        {
          title: 'With Arrow Buttons',
          description: 'Number input with increment/decrement buttons.',
          code: `<NumberInput showArrows placeholder="0" />`,
          component: () => <NumberInput showArrows placeholder="0" />,
        },
        {
          title: 'Float Input',
          description: 'Allows decimal values with configurable precision.',
          code: `<NumberInput
  type="float"
  precision={2}
  placeholder="0.00"
  label="Price"
/>`,
          component: () => (
            <NumberInput type="float" precision={2} placeholder="0.00" label="Price" />
          ),
        },
        {
          title: 'With Min and Max',
          description: 'Constrained to a specific range.',
          code: `<NumberInput
  min={0}
  max={100}
  showArrows
  label="Percentage"
  helperText="Value between 0 and 100"
/>`,
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
          code: `<NumberInput
  step={5}
  showArrows
  label="Quantity"
  helperText="Step by 5"
/>`,
          component: () => (
            <NumberInput step={5} showArrows label="Quantity" helperText="Step by 5" />
          ),
        },
        {
          title: 'Negative Values',
          description: 'Allows negative number input.',
          code: `<NumberInput
  allowNegativeValues
  showArrows
  label="Temperature"
  helperText="Can be negative"
/>`,
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
          code: `const [value, setValue] = createSignal<number | null>(null);

<NumberInput
  showArrows
  label="Quantity"
  value={value()?.toString() ?? ''}
  onValueChange={setValue}
  helperText={\`Numeric value: \${value()}\`}
/>`,
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
          code: `<NumberInput
  type="float"
  precision={4}
  step={0.0001}
  showArrows
  label="Coordinates"
/>`,
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
          title: 'Debounced Value Processing',
          description:
            'Value is automatically processed after 2 seconds of inactivity. Type and wait to see the value format and emit.',
          code: `const [value, setValue] = createSignal<number | null>(null);
const [lastUpdate, setLastUpdate] = createSignal('');

<NumberInput
  type="float"
  precision={2}
  label="Debounced Input"
  onValueChange={(v) => {
    setValue(v);
    setLastUpdate(new Date().toLocaleTimeString());
  }}
  helperText={\`Value: \${value()} | Last update: \${lastUpdate()}\`}
/>`,
          component: () => {
            const [value, setValue] = createSignal<number | null>(null);
            const [lastUpdate, setLastUpdate] = createSignal('');
            return (
              <NumberInput
                type="float"
                precision={2}
                label="Debounced Input"
                onValueChange={(v) => {
                  setValue(v);
                  setLastUpdate(new Date().toLocaleTimeString());
                }}
                helperText={`Value: ${value()} | Last update: ${lastUpdate()}`}
              />
            );
          },
        },
        {
          title: 'Custom Debounce Delay',
          description: 'Set a custom delay (1 second) or disable debounce entirely.',
          code: `<NumberInput
  debounceDelay={1000}
  label="1 Second Delay"
  helperText="Processes after 1s of inactivity"
/>

<NumberInput
  debounceDelay={0}
  label="No Debounce"
  helperText="Only processes on blur"
/>`,
          component: () => (
            <div class="flex flex-col gap-4">
              <NumberInput
                debounceDelay={1000}
                label="1 Second Delay"
                helperText="Processes after 1s of inactivity"
              />
              <NumberInput
                debounceDelay={0}
                label="No Debounce"
                helperText="Only processes on blur"
              />
            </div>
          ),
        },
      ]}
      usage={`import { NumberInput } from '@exowpee/the_rock';

// Basic integer input
<NumberInput placeholder="Enter quantity" />

// With arrow buttons and constraints
<NumberInput
  showArrows
  min={0}
  max={100}
  step={5}
/>

// Float input with precision
<NumberInput
  type="float"
  precision={2}
  label="Price"
  placeholder="0.00"
/>

// With typed callback
const [quantity, setQuantity] = createSignal<number | null>(null);
<NumberInput
  showArrows
  onValueChange={setQuantity}
/>

// Allowing negative values
<NumberInput
  allowNegativeValues
  label="Temperature (°C)"
/>

// Custom debounce delay (1 second)
<NumberInput
  debounceDelay={1000}
  onValueChange={(v) => console.log('Value:', v)}
/>

// Disable debounce (process only on blur)
<NumberInput debounceDelay={0} />`}
    />
  );
}
