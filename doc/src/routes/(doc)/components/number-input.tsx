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
      playground={`
        import { NumberInput } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-6 w-72">
              <NumberInput
                label="Quantity"
                placeholder="Enter a number"
                min={0}
                max={100}
                showArrows
              />

              <NumberInput
                type="float"
                precision={2}
                label="Price"
                placeholder="0.00"
                showArrows
                step={0.01}
              />
            </div>
          );
        }
      `}
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
