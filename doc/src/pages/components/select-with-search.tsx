import { createSignal } from 'solid-js';

import SelectWithSearch from '@lib/components/SelectWithSearch';

import DocPage from '../../components/DocPage';

const frameworkOptions = [
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
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India' },
  { value: 'mx', label: 'Mexico' },
];

const userOptions = [
  { value: '1', label: 'John Doe' },
  { value: '2', label: 'Jane Smith' },
  { value: '3', label: 'Bob Johnson' },
  { value: '4', label: 'Alice Williams' },
  { value: '5', label: 'Charlie Brown' },
];

export default function SelectWithSearchPage() {
  return (
    <DocPage
      title="SelectWithSearch"
      description="A searchable dropdown component optimized for selecting a single option from large datasets. Unlike basic selects that require scrolling through all options, SelectWithSearch lets users type to filter results instantly, making it practical for lists of hundreds or thousands of items. The component features real-time filtering as users type, full keyboard navigation (arrow keys, Enter, Escape), optional virtualization for handling massive datasets without performance degradation, and a custom CTA slot for actions like 'Add new item'. Built with ARIA combobox semantics for screen reader compatibility."
      keyConcepts={[
        {
          term: 'Type-to-Filter',
          explanation:
            'Users can type to narrow down options instantly. The filter is case-insensitive and matches against the label text, making it easy to find items in large lists.',
        },
        {
          term: 'Auto-Fill Mode',
          explanation:
            'When autoFillSearchKey is true, selecting an option fills the input with that label. This is useful when users need to see their selection clearly after choosing.',
        },
        {
          term: 'Virtualization',
          explanation:
            'Set optionRowHeight to enable virtualization, which renders only visible options. Essential for lists with hundreds of items to maintain smooth scrolling.',
        },
        {
          term: 'Lazy Loading',
          explanation:
            'The onLazyLoad callback fires during scroll, enabling infinite scroll patterns where more options are fetched as users scroll down.',
        },
      ]}
      value="Searchable selects dramatically improve form completion rates for fields with many options (countries, products, users). The type-to-filter pattern matches user expectations from modern autocomplete experiences, reducing time to find and select the right option from seconds to milliseconds."
      relatedHooks={[
        {
          name: 'useSelect',
          path: '/hooks/use-select',
          description:
            'Core selection logic including keyboard navigation, option filtering, and dropdown state management.',
        },
        {
          name: 'useFloating',
          path: '/hooks/use-floating',
          description:
            'Positioning engine for the dropdown menu, handling placement and viewport boundaries.',
        },
      ]}
      props={[
        {
          name: 'options',
          type: 'Array<{ value: string; label: string }>',
          default: '-',
          description: 'Array of options to display in the dropdown',
          required: true,
        },
        {
          name: 'onSelect',
          type: '(option?: Option) => void',
          default: '-',
          description: 'Callback fired when an option is selected',
          required: true,
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Initial search text value',
        },
        {
          name: 'idValue',
          type: 'string',
          default: '-',
          description: 'ID of the option to pre-select by value',
        },
        {
          name: 'autoFillSearchKey',
          type: 'boolean',
          default: 'false',
          description: 'Auto-fill search input with selected option label',
        },
        {
          name: 'clearValue',
          type: 'boolean',
          default: 'false',
          description: 'When true, clears the current selection',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: 'Placeholder text when no selection',
        },
        {
          name: 'noSearchResultPlaceholder',
          type: 'string',
          default: '"No results found"',
          description: 'Message shown when search yields no results',
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
          description: 'Shows loading state with spinner',
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
          name: 'cta',
          type: 'JSX.Element',
          default: '-',
          description: 'Custom call-to-action element at bottom of dropdown',
        },
        {
          name: 'isLazyLoading',
          type: 'boolean',
          default: 'false',
          description: 'Show loading spinner for lazy loading more options',
        },
        {
          name: 'onLazyLoad',
          type: '(scrollProgress: number) => void',
          default: '-',
          description: 'Callback when scrolling for infinite scroll/lazy loading',
        },
      ]}
      examples={[
        {
          title: 'Basic SelectWithSearch',
          description: 'Simple searchable dropdown.',
          code: `const [selected, setSelected] = createSignal(null);

<SelectWithSearch
  options={[
    { value: 'react', label: 'React' },
    { value: 'solid', label: 'SolidJS' },
    { value: 'vue', label: 'Vue' },
  ]}
  onSelect={(opt) => setSelected(opt)}
  placeholder="Search frameworks..."
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof frameworkOptions)[0] | null>(
              null,
            );
            return (
              <SelectWithSearch
                options={frameworkOptions}
                onSelect={(opt) => setSelected(opt || null)}
                placeholder="Search frameworks..."
              />
            );
          },
        },
        {
          title: 'With Auto-Fill',
          description: 'Automatically fills input with selected option label.',
          code: `<SelectWithSearch
  options={countryOptions}
  onSelect={handleSelect}
  autoFillSearchKey
  placeholder="Search countries..."
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof countryOptions)[0] | null>(null);
            return (
              <SelectWithSearch
                options={countryOptions}
                onSelect={(opt) => setSelected(opt || null)}
                autoFillSearchKey
                placeholder="Search countries..."
                optionRowHeight={32}
              />
            );
          },
        },
        {
          title: 'With Label and Helper Text',
          description: 'SelectWithSearch with label above and helper text below.',
          code: `<SelectWithSearch
  options={userOptions}
  onSelect={handleSelect}
  label="Assignee"
  helperText="Select the person to assign"
  placeholder="Search users..."
  autoFillSearchKey
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof userOptions)[0] | null>(null);
            return (
              <SelectWithSearch
                options={userOptions}
                onSelect={(opt) => setSelected(opt || null)}
                label="Assignee"
                helperText="Select the person to assign"
                placeholder="Search users..."
                autoFillSearchKey
              />
            );
          },
        },
        {
          title: 'Pre-selected Value',
          description: 'SelectWithSearch with an initial selected value.',
          code: `<SelectWithSearch
  options={frameworkOptions}
  idValue="solid"
  autoFillSearchKey
  onSelect={handleSelect}
  placeholder="Search frameworks..."
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof frameworkOptions)[0] | null>(
              null,
            );
            return (
              <SelectWithSearch
                options={frameworkOptions}
                idValue="solid"
                autoFillSearchKey
                onSelect={(opt) => setSelected(opt || null)}
                placeholder="Search frameworks..."
              />
            );
          },
        },
        {
          title: 'Disabled State',
          description: 'SelectWithSearch that cannot be interacted with.',
          code: `<SelectWithSearch
  options={frameworkOptions}
  onSelect={handleSelect}
  disabled
  placeholder="Disabled"
/>`,
          component: () => (
            <SelectWithSearch
              options={frameworkOptions}
              onSelect={() => {}}
              disabled
              placeholder="Disabled"
            />
          ),
        },
        {
          title: 'Loading State',
          description: 'Shows loading spinner while fetching options.',
          code: `<SelectWithSearch
  options={[]}
  onSelect={handleSelect}
  isLoading
  placeholder="Loading..."
/>`,
          component: () => (
            <SelectWithSearch
              options={[]}
              onSelect={() => {}}
              isLoading
              placeholder="Loading..."
            />
          ),
        },
        {
          title: 'Controlled Selection',
          description: 'Interactive example with controlled state.',
          code: `const [selected, setSelected] = createSignal(null);

<SelectWithSearch
  options={countryOptions}
  onSelect={(opt) => setSelected(opt)}
  autoFillSearchKey
  label="Country"
  helperText={selected() ? \`Selected: \${selected().label}\` : 'No selection'}
  placeholder="Search countries..."
/>`,
          component: () => {
            const [selected, setSelected] = createSignal<
              (typeof countryOptions)[0] | null
            >(null);
            return (
              <SelectWithSearch
                options={countryOptions}
                onSelect={(opt) => setSelected(opt || null)}
                autoFillSearchKey
                label="Country"
                helperText={
                  selected() ? `Selected: ${selected()!.label}` : 'No selection'
                }
                placeholder="Search countries..."
              />
            );
          },
        },
        {
          title: 'With Custom CTA',
          description: 'Adds a custom action at the bottom of the dropdown.',
          code: `<SelectWithSearch
  options={userOptions}
  onSelect={handleSelect}
  placeholder="Search users..."
  cta={
    <button class="w-full p-2 text-blue-600 hover:bg-blue-50">
      + Add new user
    </button>
  }
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof userOptions)[0] | null>(null);
            return (
              <SelectWithSearch
                options={userOptions}
                onSelect={(opt) => setSelected(opt || null)}
                placeholder="Search users..."
                cta={
                  <button
                    class="w-full border-t border-gray-200 p-2 text-sm text-blue-600 hover:bg-blue-50"
                    onClick={() => alert('Add new user clicked')}
                  >
                    + Add new user
                  </button>
                }
              />
            );
          },
        },
        {
          title: 'Required Field',
          description: 'Shows required indicator on the label.',
          code: `<SelectWithSearch
  options={frameworkOptions}
  onSelect={handleSelect}
  label="Framework"
  required
  placeholder="Select a framework..."
  autoFillSearchKey
/>`,
          component: () => {
            const [, setSelected] = createSignal<(typeof frameworkOptions)[0] | null>(
              null,
            );
            return (
              <SelectWithSearch
                options={frameworkOptions}
                onSelect={(opt) => setSelected(opt || null)}
                label="Framework"
                required
                placeholder="Select a framework..."
                autoFillSearchKey
              />
            );
          },
        },
      ]}
      usage={`import { SelectWithSearch } from '@exowpee/the_rock';

// Basic usage
const [selected, setSelected] = createSignal(null);

<SelectWithSearch
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ]}
  onSelect={(opt) => setSelected(opt)}
  placeholder="Search options..."
/>

// With auto-fill (recommended for most use cases)
<SelectWithSearch
  options={options}
  onSelect={handleSelect}
  autoFillSearchKey
  placeholder="Search..."
/>

// With label and pre-selected value
<SelectWithSearch
  options={options}
  idValue="preselected-id"
  autoFillSearchKey
  onSelect={handleSelect}
  label="Category"
  helperText="Select a category"
/>

// With lazy loading for large datasets
<SelectWithSearch
  options={options}
  onSelect={handleSelect}
  optionRowHeight={32}
  isLazyLoading={isLoading}
  onLazyLoad={(progress) => {
    if (progress > 0.8) loadMoreOptions();
  }}
/>

// With custom CTA
<SelectWithSearch
  options={options}
  onSelect={handleSelect}
  cta={<button>+ Add new item</button>}
/>`}
    />
  );
}
