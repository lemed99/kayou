import { createSignal } from 'solid-js';

import MultiSelect from '@lib/components/MultiSelect';
import DocPage from '../../components/DocPage';

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

export default function MultiSelectPage() {
  return (
    <DocPage
      title="MultiSelect"
      description="A dropdown component for selecting multiple options from a list. Features search functionality, keyboard navigation, virtualization for large lists, and customizable display values. Built on top of TextInput with full accessibility support."
      props={[
        {
          name: 'options',
          type: 'Array<{ value: string; label: string }>',
          default: '-',
          description: 'Array of options to display in the dropdown',
          required: true,
        },
        {
          name: 'onMultiSelect',
          type: '(options?: Option[]) => void',
          default: '-',
          description: 'Callback fired when selection changes',
          required: true,
        },
        {
          name: 'values',
          type: 'string[]',
          default: '-',
          description: 'Array of currently selected option values',
        },
        {
          name: 'withSearch',
          type: 'boolean',
          default: 'false',
          description: 'Enables search/filter functionality in dropdown',
        },
        {
          name: 'displayValue',
          type: 'string',
          default: '-',
          description: 'Custom display value to show in the input',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: 'Placeholder text when no selection',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          default: '-',
          description: 'Placeholder text for the search input',
        },
        {
          name: 'noSearchResultPlaceholder',
          type: 'string',
          default: '-',
          description: 'Message shown when search yields no results',
        },
        {
          name: 'clearValues',
          type: 'boolean',
          default: 'false',
          description: 'When true, clears all selected values',
        },
        {
          name: 'optionRowHeight',
          type: 'number',
          default: '-',
          description: 'Height in pixels for each option row (enables virtualization)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the select',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows loading state',
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
      ]}
      examples={[
        {
          title: 'Basic MultiSelect',
          description: 'Simple multi-select dropdown.',
          code: `const [selected, setSelected] = createSignal([]);

<MultiSelect
  options={[
    { value: 'react', label: 'React' },
    { value: 'solid', label: 'SolidJS' },
    { value: 'vue', label: 'Vue' },
  ]}
  onMultiSelect={(opts) => setSelected(opts || [])}
  placeholder="Select frameworks"
/>`,
          component: () => {
            const [, setSelected] = createSignal<typeof sampleOptions>([]);
            return (
              <MultiSelect
                options={sampleOptions}
                onMultiSelect={(opts) => setSelected(opts || [])}
                placeholder="Select frameworks"
              />
            );
          },
        },
        {
          title: 'With Search',
          description: 'Enables filtering options by typing.',
          code: `<MultiSelect
  options={countryOptions}
  onMultiSelect={handleSelect}
  withSearch
  searchPlaceholder="Search countries..."
  placeholder="Select countries"
/>`,
          component: () => {
            const [, setSelected] = createSignal<typeof countryOptions>([]);
            return (
              <MultiSelect
                options={countryOptions}
                onMultiSelect={(opts) => setSelected(opts || [])}
                withSearch
                searchPlaceholder="Search countries..."
                placeholder="Select countries"
              />
            );
          },
        },
        {
          title: 'With Label and Helper Text',
          description: 'MultiSelect with label above and helper text below.',
          code: `<MultiSelect
  options={options}
  onMultiSelect={handleSelect}
  label="Technologies"
  helperText="Select all that apply"
  placeholder="Choose technologies"
/>`,
          component: () => {
            const [, setSelected] = createSignal<typeof sampleOptions>([]);
            return (
              <MultiSelect
                options={sampleOptions}
                onMultiSelect={(opts) => setSelected(opts || [])}
                label="Technologies"
                helperText="Select all that apply"
                placeholder="Choose technologies"
              />
            );
          },
        },
        {
          title: 'Pre-selected Values',
          description: 'MultiSelect with initial selected values.',
          code: `<MultiSelect
  options={options}
  values={['solid', 'react']}
  onMultiSelect={handleSelect}
  placeholder="Select frameworks"
/>`,
          component: () => {
            const [, setSelected] = createSignal<typeof sampleOptions>([]);
            return (
              <MultiSelect
                options={sampleOptions}
                values={['solid', 'react']}
                onMultiSelect={(opts) => setSelected(opts || [])}
                placeholder="Select frameworks"
              />
            );
          },
        },
        {
          title: 'Disabled State',
          description: 'MultiSelect that cannot be interacted with.',
          code: `<MultiSelect
  options={options}
  values={['solid']}
  onMultiSelect={handleSelect}
  disabled
  placeholder="Disabled"
/>`,
          component: () => (
            <MultiSelect
              options={sampleOptions}
              values={['solid']}
              onMultiSelect={() => {}}
              disabled
              placeholder="Disabled"
            />
          ),
        },
        {
          title: 'Loading State',
          description: 'Shows loading spinner while fetching options.',
          code: `<MultiSelect
  options={[]}
  onMultiSelect={handleSelect}
  isLoading
  placeholder="Loading..."
/>`,
          component: () => (
            <MultiSelect
              options={[]}
              onMultiSelect={() => {}}
              isLoading
              placeholder="Loading..."
            />
          ),
        },
        {
          title: 'Controlled Selection',
          description: 'Interactive example with controlled state.',
          code: `const [selected, setSelected] = createSignal<Option[]>([]);

<MultiSelect
  options={options}
  values={selected().map(o => o.value)}
  onMultiSelect={(opts) => setSelected(opts || [])}
  withSearch
  label="Frameworks"
  helperText={\`Selected: \${selected().length}\`}
/>`,
          component: () => {
            const [selected, setSelected] = createSignal<typeof sampleOptions>([]);
            return (
              <MultiSelect
                options={sampleOptions}
                values={selected().map((o) => o.value)}
                onMultiSelect={(opts) => setSelected(opts || [])}
                withSearch
                label="Frameworks"
                helperText={`Selected: ${selected().length}`}
              />
            );
          },
        },
        {
          title: 'Custom Display Value',
          description: 'Override the displayed text in the input.',
          code: `<MultiSelect
  options={options}
  values={['solid', 'react', 'vue']}
  displayValue="3 frameworks selected"
  onMultiSelect={handleSelect}
/>`,
          component: () => (
            <MultiSelect
              options={sampleOptions}
              values={['solid', 'react', 'vue']}
              displayValue="3 frameworks selected"
              onMultiSelect={() => {}}
            />
          ),
        },
      ]}
      usage={`import { MultiSelect } from '@exowpee/the_rock';

// Basic usage
const [selected, setSelected] = createSignal([]);

<MultiSelect
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ]}
  onMultiSelect={(opts) => setSelected(opts || [])}
  placeholder="Select options"
/>

// With search functionality
<MultiSelect
  options={options}
  onMultiSelect={handleSelect}
  withSearch
  searchPlaceholder="Search..."
/>

// With label and controlled values
<MultiSelect
  options={options}
  values={selected().map(o => o.value)}
  onMultiSelect={setSelected}
  label="Categories"
  helperText="Select multiple categories"
/>

// Custom display value
<MultiSelect
  options={options}
  values={selectedValues}
  displayValue={\`\${selectedValues.length} selected\`}
  onMultiSelect={handleSelect}
/>`}
    />
  );
}
