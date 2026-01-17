import { createSignal } from 'solid-js';

import DatePicker, { DateValue } from '@lib/components/DatePicker';
import { DatePickerProvider } from '@lib/context/DatePickerContext';
import DocPage from '../../components/DocPage';

export default function DatePickerPage() {
  return (
    <DatePickerProvider locale="en-US">
      <DocPage
        title="DatePicker"
        description="A flexible date picker component with calendar popup supporting single date, multiple dates, and date range selection. It renders an input field that opens a calendar popup when clicked. The calendar supports full keyboard navigation, allowing users to move between days with arrow keys, jump between months, and select dates with Enter. The component respects locale settings for day/month names and date formatting, making it suitable for international applications. It uses the floating UI engine to position the calendar optimally within the viewport. Features min/max date constraints and accessibility support. Must be wrapped in a DatePickerProvider for context."
        keyConcepts={[
          {
            term: 'Selection Type',
            explanation:
              'The DatePicker supports three modes: "single" for one date, "range" for start/end dates, and "multiple" for selecting several individual dates.',
          },
          {
            term: 'Locale',
            explanation:
              'The locale prop determines how dates are formatted and which language is used for day/month names. Common values include "en-US", "fr-FR", and "de-DE".',
          },
          {
            term: 'Min/Max Constraints',
            explanation:
              'Use minDate and maxDate props to restrict the selectable date range. Dates outside this range appear disabled in the calendar.',
          },
          {
            term: 'DateValue Type',
            explanation:
              'The value type varies by selection mode: { date } for single, { startDate, endDate } for range, and { multipleDates } for multiple selection.',
          },
        ]}
        value="Date selection is critical in many workflows: scheduling, reporting, compliance tracking, and data filtering all depend on accurate date handling. This DatePicker provides a polished, accessible experience that works across locales and respects business rules via min/max constraints. The range selection mode is particularly valuable for reporting dashboards where users frequently filter data by time periods."
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
        ]}
        examples={[
          {
            title: 'Single Date Selection',
            description: 'Basic date picker for selecting a single date.',
            code: `const [date, setDate] = createSignal<DateValue>({});

<DatePicker
  type="single"
  locale="en-US"
  label="Select Date"
  value={date()}
  onChange={setDate}
/>`,
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
            code: `const [range, setRange] = createSignal<DateValue>({});

<DatePicker
  type="range"
  locale="en-US"
  label="Select Date Range"
  value={range()}
  onChange={setRange}
  helperText="Click to select start date, then end date"
/>`,
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
            code: `const [dates, setDates] = createSignal<DateValue>({});

<DatePicker
  type="multiple"
  locale="en-US"
  label="Select Multiple Dates"
  value={dates()}
  onChange={setDates}
  helperText="Click dates to add or remove them"
/>`,
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
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Appointment Date"
  minDate="2026-01-01"
  maxDate="2026-12-31"
  helperText="Select a date in 2026"
/>`,
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
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Birth Date"
  displayFormat="MM/DD/YYYY"
  placeholder="MM/DD/YYYY"
/>`,
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
            code: `<DatePicker type="single" locale="fr-FR" label="Date (French)" />
<DatePicker type="single" locale="de-DE" label="Date (German)" />
<DatePicker type="single" locale="es-ES" label="Date (Spanish)" />`,
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
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Start Date"
  required
/>`,
            component: () => (
              <DatePicker type="single" locale="en-US" label="Start Date" required />
            ),
          },
          {
            title: 'Disabled State',
            description: 'Disabled date picker cannot be interacted with.',
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Locked Date"
  disabled
  value={{ date: '2026-01-15' }}
/>`,
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
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Available Dates"
  isLoading
/>`,
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
            code: `<DatePicker
  type="single"
  locale="en-US"
  label="Opens Above"
  popoverPosition="top"
/>`,
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
            code: `const [selectedDate, setSelectedDate] = createSignal<DateValue>({});
const [message, setMessage] = createSignal('');

<DatePicker
  type="single"
  locale="en-US"
  label="Select Date"
  value={selectedDate()}
  onChange={(value) => {
    setSelectedDate(value);
    if (value.date) {
      setMessage(\`Selected: \${value.date}\`);
    }
  }}
  helperText={message()}
/>`,
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
        ]}
        usage={`import { DatePicker, DatePickerProvider } from '@exowpee/the_rock';
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

// DateValue type reference
interface DateValue {
  date?: string;         // For single mode (ISO format)
  startDate?: string;    // For range mode start
  endDate?: string;      // For range mode end
  multipleDates?: string[]; // For multiple mode
}

// Keyboard Navigation:
// - Arrow keys: Navigate days/weeks
// - Enter/Space: Select focused date
// - Escape: Close calendar
// - Enter/Space/ArrowDown on input: Open calendar`}
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
