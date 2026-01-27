import { createSignal } from 'solid-js';

import { MultiSelect } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

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
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan rwerwe rer wer. wer wer ewr. ew r we rw' },
];

export default function MultiSelectPage() {
  return (
    <DocPage
      title="MultiSelect"
      description="Dropdown for selecting multiple options from a list. Features search filtering, virtualization for large lists, keyboard navigation, and customizable display values."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes for multi-select styling',
        },
      ]}
      keyConcepts={[
        {
          term: 'Selection Display',
          explanation:
            'Labels concatenated by default; use displayValue for custom text.',
        },
        {
          term: 'Search Mode',
          explanation: 'withSearch adds filter input for large option lists.',
        },
        {
          term: 'Controlled Values',
          explanation: 'values prop accepts array of selected option values.',
        },
        {
          term: 'Clear All',
          explanation: 'clearValues=true clears all selections programmatically.',
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
          title: 'Basic MultiSelect',
          description: 'Simple multi-select dropdown.',
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
            const [, setSelected] = createSignal<typeof countryOptions>([]);
            return (
              <MultiSelect
                options={countryOptions}
                onMultiSelect={(opts) => setSelected(opts || [])}
                withSearch
                searchPlaceholder="Search countries..."
                placeholder="Select countries"
                optionRowHeight={32}
              />
            );
          },
        },
        {
          title: 'With Label and Helper Text',
          description: 'MultiSelect with label above and helper text below.',
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
          component: () => {
            // eslint-disable-next-line solid/reactivity
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
      usage={`
        import { MultiSelect } from '@kayou/ui';

        <MultiSelect options={options} onMultiSelect={handleSelect} placeholder="Select..." />
        <MultiSelect options={options} onMultiSelect={handleSelect} withSearch />
        <MultiSelect options={options} values={['opt1', 'opt2']} label="Categories" onMultiSelect={handleSelect} />
      `}
      relatedHooks={[
        {
          name: 'useSelect',
          path: '/hooks/use-select',
          description:
            'Core selection logic including keyboard navigation, option filtering, and multi-select handling.',
        },
        {
          name: 'useFloating',
          path: '/hooks/use-floating',
          description:
            'Positioning engine for the dropdown menu, handling placement and viewport boundaries.',
        },
      ]}
    />
  );
}
