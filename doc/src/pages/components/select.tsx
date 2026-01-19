import { createSignal } from 'solid-js';

import { Select } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

export default function SelectPage() {
  const [, setSelected1] = createSignal<string | undefined>();
  const [, setSelected2] = createSignal<string | undefined>();
  const [selected3, setSelected3] = createSignal<string | undefined>('banana');

  return (
    <DocPage
      title="Select"
      description="Dropdown for single option selection with keyboard navigation, virtual scrolling, and validation states."
      keyConcepts={[
        {
          term: 'Options Array',
          explanation:
            'An array of objects with value and label properties. The value is the internal identifier, while label is displayed to users. Options can include custom labelWrapper for rich rendering.',
        },
        {
          term: 'Virtual Scrolling',
          explanation:
            'When optionRowHeight is set, only visible options are rendered in the DOM. This enables smooth performance even with thousands of options.',
        },
        {
          term: 'Controlled vs Uncontrolled',
          explanation:
            'Pass a value prop and onSelect handler for controlled usage. The component manages its own open/close state but delegates selection to the parent.',
        },
        {
          term: 'Keyboard Navigation',
          explanation:
            'Full keyboard support including Arrow Up/Down to navigate, Enter to select, Escape to close, and Home/End to jump to first/last option.',
        },
      ]}
      props={[
        {
          name: 'options',
          type: 'SelectOption[]',
          default: '-',
          description:
            'Array of options to display. Each option has value, label, and optional labelWrapper',
        },
        {
          name: 'onSelect',
          type: '(option?: SelectOption) => void',
          default: '-',
          description: 'Callback fired when an option is selected (required)',
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Currently selected value',
        },
        {
          name: 'optionRowHeight',
          type: 'number',
          default: '-',
          description:
            'Height of each option row in pixels. When set, enables virtual scrolling for better performance with large lists',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: 'Placeholder text when no option is selected',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label displayed above the select',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the select',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling and validation states',
        },
        {
          name: 'sizing',
          type: '"xs" | "sm" | "md"',
          default: '"md"',
          description: 'Size variant of the select input',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the select is disabled',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Whether the field is required (shows asterisk)',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Whether the select is in a loading state',
        },
      ]}
      examples={[
        {
          title: 'Basic Select',
          description: 'Simple select with options.',
          code: `const [selected, setSelected] = createSignal();

<Select
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ]}
  placeholder="Select a fruit"
  onSelect={(opt) => setSelected(opt?.value)}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                options={fruitOptions}
                placeholder="Select a fruit"
                onSelect={(opt) => setSelected1(opt?.value)}
              />
            </div>
          ),
        },
        {
          title: 'With Label and Helper Text',
          description: 'Select with label and helper text.',
          code: `<Select
  label="Country"
  helperText="Select your country of residence"
  options={countryOptions}
  placeholder="Choose a country"
  onSelect={handleSelect}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                label="Country"
                helperText="Select your country of residence"
                options={countryOptions}
                placeholder="Choose a country"
                onSelect={(opt) => setSelected2(opt?.value)}
              />
            </div>
          ),
        },
        {
          title: 'With Default Value',
          description: 'Select with a pre-selected value.',
          code: `<Select
  label="Favorite Fruit"
  options={fruitOptions}
  value="banana"
  onSelect={handleSelect}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                label="Favorite Fruit"
                options={fruitOptions}
                value={selected3()}
                onSelect={(opt) => setSelected3(opt?.value)}
              />
            </div>
          ),
        },
        {
          title: 'Validation States',
          description: 'Different color states for validation feedback.',
          code: `<Select color="success" helperText="Valid selection" ... />
<Select color="failure" helperText="Please select an option" ... />`,
          component: () => (
            <div class="flex w-64 flex-col gap-4">
              <Select
                label="Success"
                color="success"
                helperText="Valid selection"
                options={fruitOptions}
                value="apple"
                onSelect={() => {}}
              />
              <Select
                label="Error"
                color="failure"
                helperText="Please select an option"
                options={fruitOptions}
                placeholder="Select..."
                onSelect={() => {}}
              />
            </div>
          ),
        },
        {
          title: 'Required Field',
          description: 'Select marked as required.',
          code: `<Select
  label="Category"
  required
  options={options}
  onSelect={handleSelect}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                label="Category"
                required
                options={fruitOptions}
                placeholder="Select category"
                onSelect={() => {}}
              />
            </div>
          ),
        },
        {
          title: 'Disabled State',
          description: 'Select in disabled state.',
          code: `<Select
  label="Disabled Select"
  disabled
  options={options}
  value="apple"
  onSelect={() => {}}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                label="Disabled Select"
                disabled
                options={fruitOptions}
                value="apple"
                onSelect={() => {}}
              />
            </div>
          ),
        },
        {
          title: 'Loading State',
          description: 'Select in loading state.',
          code: `<Select
  label="Loading Select"
  isLoading
  options={options}
  onSelect={() => {}}
/>`,
          component: () => (
            <div class="w-64">
              <Select
                label="Loading Select"
                isLoading
                options={fruitOptions}
                placeholder="Loading..."
                onSelect={() => {}}
              />
            </div>
          ),
        },
      ]}
      usage={`import { Select } from '@exowpee/solidly';

// Basic usage
const [selected, setSelected] = createSignal();

<Select
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]}
  placeholder="Select an option"
  onSelect={(opt) => setSelected(opt?.value)}
/>

// With label and validation
<Select
  label="Category"
  required
  color={hasError() ? 'failure' : 'gray'}
  helperText={hasError() ? 'Required field' : undefined}
  options={categories}
  value={selectedCategory()}
  onSelect={(opt) => setSelectedCategory(opt?.value)}
/>

// Virtual scrolling for large lists
<Select
  options={largeOptionsList}
  optionRowHeight={32}
  onSelect={handleSelect}
/>

// Custom label rendering
<Select
  options={[
    {
      value: 'premium',
      label: 'Premium Plan',
      labelWrapper: (label) => (
        <div class="flex items-center gap-2">
          <span class="text-yellow-500">★</span>
          {label}
        </div>
      ),
    },
  ]}
  onSelect={handleSelect}
/>`}
      relatedHooks={[
        {
          name: 'useSelect',
          path: '/hooks/use-select',
          description:
            'Core selection logic including keyboard navigation, option filtering, and accessibility.',
        },
        {
          name: 'useVirtualList',
          path: '/hooks/use-virtual-list',
          description:
            'Virtualization engine used when optionRowHeight is set for large option lists.',
        },
      ]}
    />
  );
}
