import { createSignal } from 'solid-js';

import type { DateValue } from '@exowpee/solidly';
import { DatePicker, DatePickerProvider } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function DatePickerPage() {
  return (
    <DatePickerProvider locale="en-US">
      <DocPage
        title="DatePicker"
        description="Calendar input supporting single, multiple, and range selection with locale-aware formatting. Requires DatePickerProvider."
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
        ]}
        examples={[
          {
            title: 'Single Date Selection',
            description: 'Basic date picker for selecting a single date.',
            component: () => {
              const [date, setDate] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Select Date"
                  value={date()}
                  onChange={setDate}
                />
              );
            },
          },
          {
            title: 'Date Range Selection',
            description: 'Select a start and end date for ranges like booking periods.',
            component: () => {
              const [range, setRange] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="range"
                  locale="en-US"
                  label="Select Date Range"
                  value={range()}
                  onChange={setRange}
                  helperText="Click to select start date, then end date"
                />
              );
            },
          },
          {
            title: 'Multiple Date Selection',
            description: 'Select multiple individual dates.',
            component: () => {
              const [dates, setDates] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="multiple"
                  locale="en-US"
                  label="Select Multiple Dates"
                  value={dates()}
                  onChange={setDates}
                  helperText="Click dates to add or remove them"
                />
              );
            },
          },
          {
            title: 'With Min/Max Constraints',
            description: 'Restrict selectable dates to a specific range.',
            component: () => (
              <DatePicker
                type="single"
                locale="en-US"
                label="Appointment Date"
                minDate="2026-01-01"
                maxDate="2026-12-31"
                helperText="Select a date in 2026"
              />
            ),
          },
          {
            title: 'Custom Display Format',
            description: 'Change how dates are displayed in the input.',
            component: () => (
              <DatePicker
                type="single"
                locale="en-US"
                label="Birth Date"
                displayFormat="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
              />
            ),
          },
          {
            title: 'Different Locales',
            description: 'Date picker adapts to different locales for day/month names.',
            component: () => (
              <div class="flex flex-col gap-4">
                <DatePicker type="single" locale="fr-FR" label="Date (French)" />
                <DatePicker type="single" locale="de-DE" label="Date (German)" />
                <DatePicker type="single" locale="es-ES" label="Date (Spanish)" />
              </div>
            ),
          },
          {
            title: 'Required Field',
            description: 'Mark the date picker as required.',
            component: () => (
              <DatePicker type="single" locale="en-US" label="Start Date" required />
            ),
          },
          {
            title: 'Disabled State',
            description: 'Disabled date picker cannot be interacted with.',
            component: () => (
              <DatePicker
                type="single"
                locale="en-US"
                label="Locked Date"
                disabled
                value={{ date: '2026-01-15' }}
              />
            ),
          },
          {
            title: 'Loading State',
            description: 'Show loading spinner while fetching date constraints.',
            component: () => (
              <DatePicker
                type="single"
                locale="en-US"
                label="Available Dates"
                isLoading
              />
            ),
          },
          {
            title: 'Popover Position',
            description: 'Control whether the calendar opens above or below the input.',
            component: () => (
              <DatePicker
                type="single"
                locale="en-US"
                label="Opens Above"
                popoverPosition="top"
              />
            ),
          },
          {
            title: 'Controlled with Callback',
            description: 'Handle date changes with a callback function.',
            component: () => {
              const [selectedDate, setSelectedDate] = createSignal<DateValue>({});
              const [message, setMessage] = createSignal(
                'Select a date to see the ISO value',
              );
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Select Date"
                  value={selectedDate()}
                  onChange={(value) => {
                    setSelectedDate(value);
                    if (value.date) {
                      setMessage(`Selected: ${value.date}`);
                    }
                  }}
                  helperText={message()}
                />
              );
            },
          },
          {
            title: 'Date with Time Selection',
            description:
              'Enable time picker to select date, hour, minute, and second. Click "Confirm" to apply.',
            component: () => {
              const [dateTime, setDateTime] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Appointment"
                  showTime
                  value={dateTime()}
                  onChange={setDateTime}
                  helperText="Select date and click Confirm"
                />
              );
            },
          },
          {
            title: '12-Hour Time Format',
            description: 'Use 12-hour format with AM/PM selector.',
            component: () => {
              const [dateTime, setDateTime] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Meeting Time"
                  showTime
                  timeFormat="12h"
                  value={dateTime()}
                  onChange={setDateTime}
                />
              );
            },
          },
          {
            title: 'Time with Custom Steps',
            description: 'Set minute and second increments for the time picker.',
            component: () => {
              const [dateTime, setDateTime] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Slot Booking"
                  showTime
                  minuteStep={15}
                  secondStep={15}
                  value={dateTime()}
                  onChange={setDateTime}
                  helperText="15-minute and 15-second intervals"
                />
              );
            },
          },
          {
            title: 'With Shortcuts (Single)',
            description:
              'Quick selection buttons for common dates like Today and Yesterday.',
            component: () => {
              const [date, setDate] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Quick Select"
                  showShortcuts
                  value={date()}
                  onChange={setDate}
                />
              );
            },
          },
          {
            title: 'With Shortcuts (Range)',
            description: 'Quick selection for date ranges like This Week, Last Month.',
            component: () => {
              const [range, setRange] = createSignal<DateValue>({});
              return (
                <DatePicker
                  type="range"
                  locale="en-US"
                  label="Report Period"
                  showShortcuts
                  value={range()}
                  onChange={setRange}
                />
              );
            },
          },
          {
            title: 'Week Starts on Sunday',
            description:
              'Configure the calendar to start the week on Sunday instead of Monday.',
            component: () => (
              <div class="flex flex-col gap-4">
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Week starts Sunday"
                  weekStartsOn={0}
                />
                <DatePicker
                  type="single"
                  locale="en-US"
                  label="Week starts Monday (default)"
                  weekStartsOn={1}
                />
              </div>
            ),
          },
        ]}
        usage={`
        import { DatePicker, DatePickerProvider } from '@exowpee/solidly';
        import { createSignal } from 'solid-js';

        // Wrap your app with DatePickerProvider
        function App() {
          return (
            <DatePickerProvider locale="en-US">
              <YourComponents />
            </DatePickerProvider>
          );
        }

        // Single date selection
        const [date, setDate] = createSignal<DateValue>({});

        <DatePicker
          type="single"
          locale="en-US"
          label="Select Date"
          value={date()}
          onChange={setDate}
        />

        // Date range selection
        const [range, setRange] = createSignal<DateValue>({});

        <DatePicker
          type="range"
          locale="en-US"
          label="Date Range"
          value={range()}
          onChange={setRange}
        />

        // Multiple dates
        const [dates, setDates] = createSignal<DateValue>({});

        <DatePicker
          type="multiple"
          locale="en-US"
          label="Select Dates"
          value={dates()}
          onChange={setDates}
        />

        // With constraints
        <DatePicker
          type="single"
          locale="en-US"
          minDate="2026-01-01"
          maxDate="2026-12-31"
        />

        // With time selection (uses dropdowns and Confirm button)
        const [dateTime, setDateTime] = createSignal<DateValue>({});

        <DatePicker
          type="single"
          locale="en-US"
          label="Appointment"
          showTime
          timeFormat="24h"
          minuteStep={15}
          secondStep={15}
          value={dateTime()}
          onChange={setDateTime}
        />

        // With shortcuts
        <DatePicker
          type="single"
          locale="en-US"
          label="Quick Select"
          showShortcuts
          value={date()}
          onChange={setDate}
        />

        // Week starts on Sunday (US style)
        <DatePicker
          type="single"
          locale="en-US"
          weekStartsOn={0}
        />

        // Week starts on Monday (default, European style)
        <DatePicker
          type="single"
          locale="en-US"
          weekStartsOn={1}
        />

        // Custom shortcuts in provider
        const customShortcuts = [
          {
            id: 'today',
            label: 'Today',
            getValue: () => ({ date: new Date().toISOString().split('T')[0] }),
          },
          {
            id: 'next-week',
            label: 'Next Week',
            getValue: () => {
              const start = new Date();
              start.setDate(start.getDate() + 7 - start.getDay() + 1);
              const end = new Date(start);
              end.setDate(end.getDate() + 6);
              return {
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
              };
            },
          },
        ];

        <DatePickerProvider locale="en-US" shortcuts={customShortcuts}>
          <App />
        </DatePickerProvider>

        // DateValue type reference
        interface DateValue {
          date?: string;         // For single mode (ISO format)
          startDate?: string;    // For range mode start
          endDate?: string;      // For range mode end
          multipleDates?: string[]; // For multiple mode
          hour?: number;         // Selected hour (0-23)
          minute?: number;       // Selected minute (0-59)
          second?: number;       // Selected second (0-59)
        }

        // DatePickerShortcut type reference
        interface DatePickerShortcut {
          id: string;            // Unique identifier
          label: string;         // Display label
          getValue: () => { date?: string; startDate?: string; endDate?: string };
        }

        // Keyboard Navigation:
        // - Arrow keys: Navigate days/weeks
        // - Enter/Space: Select focused date
        // - Escape: Close calendar
        // - Enter/Space/ArrowDown on input: Open calendar
      `}
        relatedHooks={[
          {
            name: 'useFloating',
            path: '/hooks/use-floating',
            description:
              'Positioning engine for the calendar popup, handling placement and viewport boundary detection.',
          },
          {
            name: 'useDatePicker',
            path: '/hooks/use-date-picker',
            description:
              'Core date picker logic including date selection, formatting, and calendar navigation.',
          },
        ]}
        relatedContexts={[
          {
            name: 'DatePickerContext',
            path: '/contexts/date-picker-context',
            description:
              'Provides shared state and configuration for date picker components. Required wrapper.',
          },
        ]}
      />
    </DatePickerProvider>
  );
}
