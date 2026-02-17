import DocPage from '../../../components/DocPage';

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
          term: 'Disabled Options',
          explanation:
            'Individual options can be disabled to prevent selection while remaining visible.',
        },
        {
          term: 'Clear All',
          explanation: 'clearValues=true clears all selections programmatically.',
        },
      ]}
      props={[
        {
          name: 'options',
          type: 'Option[]',
          default: '-',
          description: 'Array of options to display in the dropdown. Set disabled on individual options to prevent selection.',
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
          name: 'labels',
          type: 'Partial<SelectLabels>',
          default: '{ noResults: "No results found", searchPlaceholder: "Search..." }',
          description: 'i18n labels for visible texts (noResults, searchPlaceholder)',
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
        {
          name: 'referenceClass',
          type: 'string',
          default: '-',
          description: 'Custom class for the reference (trigger wrapper) element',
        },
        {
          name: 'floatingClass',
          type: 'string',
          default: '-',
          description: 'Custom class for the floating (dropdown) element',
        },
      ]}
      subComponents={[
        {
          name: 'Option',
          kind: 'type',
          description: 'Option item shared by Select, SelectWithSearch, and MultiSelect',
          props: [
            { name: 'value', type: 'string', default: '-', description: 'Unique value identifying this option' },
            { name: 'label', type: 'string', default: '-', description: 'Display text shown to the user' },
            { name: 'labelWrapper', type: '(label: string) => JSX.Element', default: '-', description: 'Optional custom renderer for the label' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether this option is disabled and cannot be selected' },
          ],
        },
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
      playground={`
        import { MultiSelect } from '@kayou/ui';

        export default function Example() {
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
          ];

          return (
            <div class="flex flex-col gap-6 w-72">
              {/* Basic multi-select */}
              <MultiSelect
                options={frameworkOptions}
                onMultiSelect={() => {}}
                label="Frameworks"
                placeholder="Select frameworks"
              />

              {/* With search filtering */}
              <MultiSelect
                options={countryOptions}
                onMultiSelect={() => {}}
                withSearch
                label="Countries"
                labels={{ searchPlaceholder: "Search countries..." }}
                placeholder="Select countries"
              />

              {/* Disabled options */}
              <MultiSelect
                options={[
                  { value: 'react', label: 'React' },
                  { value: 'solid', label: 'SolidJS' },
                  { value: 'vue', label: 'Vue', disabled: true },
                  { value: 'angular', label: 'Angular', disabled: true },
                  { value: 'svelte', label: 'Svelte' },
                ]}
                onMultiSelect={() => {}}
                label="With Disabled Options"
                helperText="Vue and Angular are disabled"
                placeholder="Select frameworks"
              />
            </div>
          );
        }
      `}
      usage={`
        import { MultiSelect } from '@kayou/ui';

        <MultiSelect options={options} onMultiSelect={handleSelect} placeholder="Select..." />
        <MultiSelect options={options} onMultiSelect={handleSelect} withSearch />
        <MultiSelect options={options} values={['opt1', 'opt2']} label="Categories" onMultiSelect={handleSelect} />

        {/* Disabled options */}
        <MultiSelect
          options={[
            { value: '1', label: 'Available' },
            { value: '2', label: 'Unavailable', disabled: true },
            { value: '3', label: 'Also available' },
          ]}
          onMultiSelect={handleSelect}
        />
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
