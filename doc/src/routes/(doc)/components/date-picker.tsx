import DocPage from '../../../components/DocPage';

export default function DatePickerPage() {
  return (
    <DocPage
      title="DatePicker"
      description="Calendar input supporting single, multiple, and range selection with locale-aware formatting."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for calendar popup transitions',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Selection Type',
          explanation: 'Three modes: single, range (start/end), or multiple dates.',
        },
        {
          term: 'Locale',
          explanation:
            'Controls date formatting and day/month names (e.g., "en-US", "fr-FR").',
        },
        {
          term: 'Min/Max Constraints',
          explanation: 'Restrict selectable dates; out-of-range dates appear disabled.',
        },
        {
          term: 'DateValue Type',
          explanation:
            'Value shape varies by mode: { date }, { startDate, endDate }, or { multipleDates }.',
        },
        {
          term: 'Time Selection',
          explanation: 'showTime adds hour/minute/second dropdowns (single mode only).',
        },
        {
          term: 'Shortcuts',
          explanation:
            'Quick selection buttons (Today, This Week, etc.) via showShortcuts.',
        },
        {
          term: 'Week Start',
          explanation: 'weekStartsOn: 0 for Sunday, 1 for Monday (default).',
        },
      ]}
      provider={{
        name: 'DatePickerProvider',
        description:
          'This component requires DatePickerProvider to be wrapped around your application or the component tree containing DatePicker instances. The provider manages month caching for calendar performance and provides locale configuration.',
        example: `import { DatePicker, DatePickerProvider } from '@kayou/ui';

function App() {
  return (
    <DatePickerProvider locale="en-US">
      {/* All DatePicker components must be inside the provider */}
      <YourComponents />
    </DatePickerProvider>
  );
}

// With custom shortcuts
<DatePickerProvider
  locale="fr-FR"
  shortcuts={[
    {
      id: 'today',
      label: "Aujourd'hui",
      getValue: () => ({ date: new Date().toISOString().split('T')[0] }),
    },
  ]}
>
  <App />
</DatePickerProvider>`,
        props: [
          {
            name: 'locale',
            type: 'string',
            default: '-',
            description:
              'Locale identifier for date formatting (e.g., "en-US", "fr-FR"). This is passed to Intl.DateTimeFormat for localized month/day names.',
            required: true,
          },
          {
            name: 'shortcuts',
            type: 'DatePickerShortcut[]',
            default: 'DEFAULT_DATE_SHORTCUTS',
            description:
              'Custom shortcuts for quick date selection. Pass an empty array to disable all shortcuts. See the DatePickerShortcut type below.',
          },
        ],
      }}
      props={[
        {
          name: 'type',
          type: '"single" | "multiple" | "range"',
          default: '-',
          description: 'Selection mode: single date, multiple dates, or date range.',
          required: true,
        },
        {
          name: 'locale',
          type: 'string',
          default: '-',
          description:
            'Locale identifier for date formatting and day/month names (e.g., "en-US", "fr-FR").',
          required: true,
        },
        {
          name: 'value',
          type: 'DateValue',
          default: '-',
          description:
            'Current date value(s). Object with date, startDate/endDate, or multipleDates depending on type.',
        },
        {
          name: 'onChange',
          type: '(value: DateValue) => void',
          default: '-',
          description: 'Callback fired when the date selection changes.',
        },
        {
          name: 'displayFormat',
          type: 'string',
          default: '"DD/MM/YYYY"',
          description: 'Display format for dates in the input field.',
        },
        {
          name: 'minDate',
          type: 'string',
          default: '-',
          description: 'Minimum selectable date in ISO format (YYYY-MM-DD).',
        },
        {
          name: 'maxDate',
          type: 'string',
          default: '-',
          description: 'Maximum selectable date in ISO format (YYYY-MM-DD).',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label displayed above the input.',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the input.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: 'displayFormat value',
          description: 'Placeholder text when no date is selected.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the date picker input.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows loading state on the input.',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Marks the field as required with visual indicator.',
        },
        {
          name: 'popoverPosition',
          type: '"top" | "bottom"',
          default: '"bottom"',
          description: 'Position of the calendar popup relative to the input.',
        },
        {
          name: 'displayValue',
          type: 'string',
          default: '-',
          description: 'Custom display value to override the formatted date.',
        },
        {
          name: 'inputClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the input element.',
        },
        {
          name: 'calendarClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the calendar popup.',
        },
        {
          name: 'style',
          type: 'JSX.CSSProperties',
          default: '-',
          description: 'Custom inline styles for the input.',
        },
        {
          name: 'showTime',
          type: 'boolean',
          default: 'false',
          description:
            'Show time picker alongside the calendar. Only works with single type.',
        },
        {
          name: 'timeFormat',
          type: '"12h" | "24h"',
          default: '"24h"',
          description: 'Time format for the time picker display.',
        },
        {
          name: 'minuteStep',
          type: 'number',
          default: '1',
          description: 'Minute step increment for the time picker.',
        },
        {
          name: 'secondStep',
          type: 'number',
          default: '1',
          description: 'Second step increment for the time picker.',
        },
        {
          name: 'showShortcuts',
          type: 'boolean',
          default: 'false',
          description: 'Show shortcuts panel on the left side of the calendar.',
        },
        {
          name: 'shortcuts',
          type: 'DatePickerShortcut[]',
          default: 'Provider shortcuts',
          description:
            'Custom shortcuts for this instance. Overrides provider shortcuts.',
        },
        {
          name: 'weekStartsOn',
          type: '0 | 1',
          default: '1',
          description: 'Day the week starts on. 0 for Sunday, 1 for Monday.',
        },
        {
          name: 'backgroundScrollBehavior',
          type: '"prevent" | "close" | "follow"',
          default: '"close"',
          description:
            'How to handle background scroll when calendar is open. "close" closes on scroll, "follow" updates position and hides when anchor exits, "prevent" locks scroll.',
        },
        {
          name: 'labels',
          type: 'Partial<DatePickerLabels>',
          default: 'DEFAULT_DATE_PICKER_LABELS',
          description: 'Visible text labels for the date picker',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<DatePickerAriaLabels>',
          default: 'DEFAULT_DATE_PICKER_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'DatePickerShortcut',
          kind: 'type',
          description: 'Configuration object for quick date selection shortcuts.',
          props: [
            {
              name: 'id',
              type: 'string',
              default: '-',
              description: 'Unique identifier for the shortcut.',
              required: true,
            },
            {
              name: 'label',
              type: 'string',
              default: '-',
              description: 'Display label shown in the shortcuts panel.',
              required: true,
            },
            {
              name: 'getValue',
              type: '() => { date?: string; startDate?: string; endDate?: string }',
              default: '-',
              description:
                'Function that returns the date value when the shortcut is clicked.',
              required: true,
            },
          ],
        },
        {
          name: 'DateValue',
          kind: 'type',
          description:
            'Value object for DatePicker. Shape varies by selection mode.',
          props: [
            {
              name: 'date',
              type: 'string',
              default: '-',
              description: 'Selected date in ISO format (single mode).',
            },
            {
              name: 'startDate',
              type: 'string',
              default: '-',
              description: 'Start date in ISO format (range mode).',
            },
            {
              name: 'endDate',
              type: 'string',
              default: '-',
              description: 'End date in ISO format (range mode).',
            },
            {
              name: 'multipleDates',
              type: 'string[]',
              default: '-',
              description: 'Array of selected dates in ISO format (multiple mode).',
            },
            {
              name: 'hour',
              type: 'number',
              default: '-',
              description: 'Selected hour (0-23) when showTime is enabled.',
            },
            {
              name: 'minute',
              type: 'number',
              default: '-',
              description: 'Selected minute (0-59) when showTime is enabled.',
            },
            {
              name: 'second',
              type: 'number',
              default: '-',
              description: 'Selected second (0-59) when showTime is enabled.',
            },
          ],
        },
        {
          name: 'DatePickerLabels',
          kind: 'type',
          description: 'Visible text labels for the date picker.',
          props: [
            {
              name: 'done',
              type: 'string',
              default: '"Done"',
              description: 'Label for the done/confirm button.',
            },
          ],
        },
        {
          name: 'DatePickerAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers.',
          props: [
            {
              name: 'previousMonth',
              type: 'string',
              default: '"Previous month"',
              description: 'Aria label for the previous month button.',
            },
            {
              name: 'nextMonth',
              type: 'string',
              default: '"Next month"',
              description: 'Aria label for the next month button.',
            },
            {
              name: 'selectMonth',
              type: 'string',
              default: '"Select month"',
              description: 'Aria label for the month selector.',
            },
            {
              name: 'selectYear',
              type: 'string',
              default: '"Select year"',
              description: 'Aria label for the year selector.',
            },
            {
              name: 'enterCustomYear',
              type: 'string',
              default: '"Enter custom year"',
              description: 'Aria label for the custom year input.',
            },
            {
              name: 'confirmYear',
              type: 'string',
              default: '"Confirm year"',
              description: 'Aria label for the confirm year button.',
            },
            {
              name: 'hour',
              type: 'string',
              default: '"Hour"',
              description: 'Aria label for the hour selector.',
            },
            {
              name: 'minute',
              type: 'string',
              default: '"Minute"',
              description: 'Aria label for the minute selector.',
            },
            {
              name: 'second',
              type: 'string',
              default: '"Second"',
              description: 'Aria label for the second selector.',
            },
            {
              name: 'chooseDate',
              type: 'string',
              default: '"Choose date"',
              description: 'Aria label for the date picker trigger.',
            },
            {
              name: 'selectDate',
              type: 'string',
              default: '"Select date"',
              description: 'Aria label for selecting a date.',
            },
            {
              name: 'calendar',
              type: 'string',
              default: '"Calendar"',
              description: 'Aria label for the calendar region.',
            },
          ],
        },
      ]}
      playground={`
        import { DatePicker, DatePickerProvider } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [singleDate, setSingleDate] = createSignal({});
          const [rangeDate, setRangeDate] = createSignal({});
          const [mutipleRangeDate, setMutipleRangeDate] = createSignal({});
          const [dateTime, setDateTime] = createSignal({});

          return (
            <DatePickerProvider locale="en-US">
              <div class="flex flex-col gap-6">
                {/* Single date */}
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Select Date"
                  value={singleDate()}
                  onChange={setSingleDate}
                />

                {/* Date range */}
                <DatePicker
                  type="range"
                  locale="en-US"
                  label="Date Range"
                  value={rangeDate()}
                  onChange={setRangeDate}
                  helperText="Click to select start, then end date"
                />

                {/* With time selection */}
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Appointment Time"
                  showTime
                  value={dateTime()}
                  onChange={setDateTime}
                  helperText="Select date and time"
                />

                {/* Multiple date ranges */}
                <DatePicker
                  type="multipleRange"
                  locale="en-US"
                  label="Date Ranges"
                  value={mutipleRangeDate()}
                  onChange={setMutipleRangeDate}
                />
              </div>
            </DatePickerProvider>
          );
        }
      `}
      usage={`
        import { DatePicker, DatePickerProvider, type DateValue } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        const [value, setValue] = createSignal<DateValue>({});

        // Single date
        <DatePicker type="single" locale="en-US" value={value()} onChange={setValue} />

        // Date range
        <DatePicker type="range" locale="en-US" value={value()} onChange={setValue} />

        // Multiple dates
        <DatePicker type="multiple" locale="en-US" value={value()} onChange={setValue} />

        // With time selection
        <DatePicker type="single" locale="en-US" showTime value={value()} onChange={setValue} />

        // With quick shortcuts
        <DatePicker type="single" locale="en-US" showShortcuts value={value()} onChange={setValue} />
      `}
      relatedHooks={[
        {
          name: 'useFloating',
          path: '/hooks/use-floating',
          description:
            'Positioning engine for the calendar popup, handling placement and viewport boundary detection.',
        },
      ]}
    />
  );
}
