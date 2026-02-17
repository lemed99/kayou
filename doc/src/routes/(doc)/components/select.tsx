import DocPage from '../../../components/DocPage';

export default function SelectPage() {
  return (
    <DocPage
      title="Select"
      description="Dropdown for single option selection with keyboard navigation, virtual scrolling, and validation states."
      keyConcepts={[
        {
          term: 'Options Array',
          explanation: 'Objects with value (internal) and label (displayed) properties.',
        },
        {
          term: 'Virtual Scrolling',
          explanation: 'Set optionRowHeight for smooth performance with large lists.',
        },
        {
          term: 'Controlled vs Uncontrolled',
          explanation: 'Pass value and onSelect for controlled mode.',
        },
        {
          term: 'Keyboard Navigation',
          explanation: 'Arrow keys, Enter, Escape, and Home/End supported.',
        },
        {
          term: 'Disabled Options',
          explanation:
            'Individual options can be disabled to prevent selection while remaining visible.',
        },
        {
          term: 'Custom Trigger',
          explanation:
            'Pass inputComponent to replace the default TextInput with any element (e.g. a button).',
        },
      ]}
      props={[
        {
          name: 'options',
          type: 'Option[]',
          default: '-',
          description:
            'Array of options to display. Each option has value, label, optional labelWrapper, and optional disabled',
        },
        {
          name: 'onSelect',
          type: '(option?: Option) => void',
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
        {
          name: 'inputComponent',
          type: '(triggerProps: SelectTriggerProps) => JSX.Element',
          default: '-',
          description:
            'Custom trigger element. When provided, replaces the default TextInput. Receives select state (selectedOption, isOpen, onKeyDown, listboxId, highlightedOptionId, disabled) for rendering and accessibility.',
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
          description: 'Visible text labels for the select dropdown',
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
          name: 'SelectTriggerProps',
          kind: 'type',
          description: 'Props passed to a custom trigger element via the inputComponent render function',
          props: [
            { name: 'selectedOption', type: '() => Option | null', default: '-', description: 'Accessor for the currently selected option' },
            { name: 'isOpen', type: '() => boolean', default: '-', description: 'Accessor for whether the dropdown is open' },
            { name: 'onKeyDown', type: '(e: KeyboardEvent) => void', default: '-', description: 'Keyboard handler for arrow keys, Enter, Escape, etc.' },
            { name: 'listboxId', type: 'string', default: '-', description: 'ID of the listbox element, for aria-controls' },
            { name: 'highlightedOptionId', type: '() => string | undefined', default: '-', description: 'ID of the highlighted option, for aria-activedescendant' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the select is disabled' },
          ],
        },
        {
          name: 'SelectLabels',
          kind: 'type',
          description: 'Visible text labels for the select dropdown',
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
        import { Select } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const fruitOptions = [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'cherry', label: 'Cherry' },
            { value: 'date', label: 'Date' },
            { value: 'elderberry', label: 'Elderberry' },
          ];

          const [selected, setSelected] = createSignal('banana');

          return (
            <div class="flex flex-col gap-6 w-72">
              {/* Basic select */}
              <Select
                options={fruitOptions}
                placeholder="Select a fruit"
                label="Fruit"
                onSelect={(opt) => {}}
              />

              {/* Controlled with pre-selected value */}
              <Select
                label="Favorite Fruit"
                helperText="Pre-selected value"
                options={fruitOptions}
                value={selected()}
                onSelect={(opt) => setSelected(opt?.value)}
              />

              {/* Disabled options */}
              <Select
                label="With Disabled Options"
                helperText="Cherry and Date are disabled"
                options={[
                  { value: 'apple', label: 'Apple' },
                  { value: 'banana', label: 'Banana' },
                  { value: 'cherry', label: 'Cherry', disabled: true },
                  { value: 'date', label: 'Date', disabled: true },
                  { value: 'elderberry', label: 'Elderberry' },
                ]}
                placeholder="Select a fruit"
                onSelect={(opt) => {}}
              />

              {/* Custom trigger (button) */}
              <Select
                options={fruitOptions}
                onSelect={(opt) => {}}
                inputComponent={(triggerProps) => (
                  <button
                    type="button"
                    class="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    onKeyDown={triggerProps.onKeyDown}
                    role="combobox"
                    aria-expanded={triggerProps.isOpen()}
                    aria-controls={triggerProps.listboxId}
                    aria-activedescendant={triggerProps.highlightedOptionId()}
                    aria-haspopup="listbox"
                    disabled={triggerProps.disabled}
                  >
                    {triggerProps.selectedOption()?.label ?? 'Pick a fruit...'}
                  </button>
                )}
              />
            </div>
          );
        }
      `}
      usage={`
        import { Select } from '@kayou/ui';

        <Select options={options} placeholder="Select..." onSelect={handleSelect} />
        <Select options={options} label="Category" required onSelect={handleSelect} />
        <Select options={options} color="failure" helperText="Required" onSelect={handleSelect} />
        <Select options={largeList} optionRowHeight={32} onSelect={handleSelect} />

        {/* Disabled options */}
        <Select
          options={[
            { value: '1', label: 'Available' },
            { value: '2', label: 'Unavailable', disabled: true },
            { value: '3', label: 'Also available' },
          ]}
          onSelect={handleSelect}
        />

        {/* Custom trigger element */}
        <Select
          options={options}
          onSelect={handleSelect}
          inputComponent={(triggerProps) => (
            <button
              onKeyDown={triggerProps.onKeyDown}
              role="combobox"
              aria-expanded={triggerProps.isOpen()}
              aria-controls={triggerProps.listboxId}
              aria-haspopup="listbox"
            >
              {triggerProps.selectedOption()?.label ?? 'Choose...'}
            </button>
          )}
        />
      `}
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
