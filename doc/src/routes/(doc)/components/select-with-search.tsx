import DocPage from '../../../components/DocPage';

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
          term: 'Infinite Scroll',
          explanation: 'onLoadMore callback enables loading more options on scroll.',
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
          name: 'isLoadingMore',
          type: 'boolean',
          default: 'false',
          description: 'Show loading spinner when loading more options',
        },
        {
          name: 'onLoadMore',
          type: '(scrollProgress: number) => void',
          default: '-',
          description:
            'Callback fired when scrolling down past 80% of the list. Use with isLoadingMore to load more options.',
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
      playground={`
        import { SelectWithSearch } from '@kayou/ui';

        export default function Example() {
          const countryOptions = [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
            { value: 'jp', label: 'Japan' },
            { value: 'br', label: 'Brazil' },
          ];

          return (
            <div class="w-72">
              <SelectWithSearch
                options={countryOptions}
                onSelect={(opt) => {}}
                placeholder="Search countries..."
                label="Country"
                autoFillSearchKey
              />
            </div>
          );
        }
      `}
      usage={`
        import { SelectWithSearch } from '@kayou/ui';

        <SelectWithSearch options={options} onSelect={handleSelect} placeholder="Search..." />
        <SelectWithSearch options={options} onSelect={handleSelect} autoFillSearchKey />
        <SelectWithSearch options={options} onSelect={handleSelect} label="Category" idValue="preselected" />
      `}
    />
  );
}
