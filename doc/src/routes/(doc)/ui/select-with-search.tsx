import { createSignal } from 'solid-js';

import { SelectWithSearch } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

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
      description="Searchable dropdown for selecting a single option from large datasets. Features type-to-filter, keyboard navigation, virtualization, and a custom CTA slot."
      keyConcepts={[
        {
          term: 'Type-to-Filter',
          explanation: 'Case-insensitive search narrows options instantly.',
        },
        {
          term: 'Auto-Fill Mode',
          explanation: 'autoFillSearchKey fills input with selected label.',
        },
        {
          term: 'Virtualization',
          explanation: 'optionRowHeight enables rendering only visible options.',
        },
        {
          term: 'Lazy Loading',
          explanation: 'onLazyLoad callback enables infinite scroll patterns.',
        },
      ]}
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
        {
          name: 'backgroundScrollBehavior',
          type: '"prevent" | "close" | "follow"',
          default: '"close"',
          description:
            'How to handle background scroll when dropdown is open. "close" closes on scroll, "follow" updates position and hides when anchor exits, "prevent" locks scroll.',
        },
        {
          name: 'labels',
          type: 'Partial<SelectLabels>',
          default: 'DEFAULT_SELECT_LABELS',
          description: 'Visible text labels for the dropdown',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<SelectAriaLabels>',
          default: 'DEFAULT_SELECT_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'SelectLabels',
          kind: 'type',
          description: 'Visible text labels for the dropdown',
          props: [
            { name: 'noResults', type: 'string', default: '"No results found"', description: 'Message shown when no options match' },
          ],
        },
        {
          name: 'SelectAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            { name: 'selectOptions', type: 'string', default: '"Select options"', description: 'Aria label for the options listbox' },
            { name: 'searchOptions', type: 'string', default: '"Search options"', description: 'Aria label for the search input' },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic SelectWithSearch',
          description: 'Simple searchable dropdown.',
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
            const [, setSelected] = createSignal<(typeof userOptions)[0] | null>(null);
            return (
              <SelectWithSearch
                options={userOptions}
                onSelect={(opt) => setSelected(opt || null)}
                placeholder="Search users..."
                cta={
                  <button
                    class="w-full cursor-pointer border-t border-gray-200 p-2 text-sm text-blue-600 hover:bg-blue-50"
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
      usage={`
        import { SelectWithSearch } from '@kayou/ui';

        <SelectWithSearch options={options} onSelect={handleSelect} placeholder="Search..." />
        <SelectWithSearch options={options} onSelect={handleSelect} autoFillSearchKey />
        <SelectWithSearch options={options} onSelect={handleSelect} label="Category" idValue="preselected" />
      `}
    />
  );
}
