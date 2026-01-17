import HookDocPage from '../../components/HookDocPage';

export default function UseDatePickerPage() {
  return (
    <HookDocPage
      title="useDatePicker"
      description="A hook to access the DatePicker context. Provides month cache for calendar rendering performance and locale configuration for date formatting. Must be used within a DatePickerProvider."
      returnType="DatePickerContextType"
      returns={[
        {
          name: 'monthCache',
          type: 'DaysMap',
          description:
            'Cached month data where keys are "year-month" strings and values are arrays of ISO date strings. Used for calendar grid rendering performance.',
        },
        {
          name: 'setMonthCache',
          type: '(key: string, days: string[]) => void',
          description:
            'Function to add or update cached days for a specific month. Automatically persists to localStorage.',
        },
        {
          name: 'clearDatePickerGlobal',
          type: '() => void',
          description: 'Clears all cached month data from memory and localStorage.',
        },
        {
          name: 'locale',
          type: 'string',
          description: 'Current locale for date formatting (e.g., "en-US", "fr-FR").',
        },
      ]}
      usage={`import { useDatePicker } from '@exowpee/the_rock';`}
      examples={[
        {
          title: 'Basic Usage',
          description:
            'Access the DatePicker context to get locale and cache information.',
          code: `import { useDatePicker } from '@exowpee/the_rock';

function MyDateComponent() {
  const { locale, monthCache } = useDatePicker();

  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>Cached months: {Object.keys(monthCache).length}</p>
    </div>
  );
}`,
        },
        {
          title: 'Clearing the Cache',
          description:
            'Use clearDatePickerGlobal to clear all cached month data, useful when switching users or resetting state.',
          code: `import { useDatePicker } from '@exowpee/the_rock';

function ClearCacheButton() {
  const { clearDatePickerGlobal } = useDatePicker();

  const handleClear = () => {
    clearDatePickerGlobal();
    console.log('Date picker cache cleared');
  };

  return (
    <button onClick={handleClear}>
      Clear Date Cache
    </button>
  );
}`,
        },
        {
          title: 'Using Locale for Custom Formatting',
          description:
            'Access the locale to format dates consistently with the DatePicker.',
          code: `import { useDatePicker } from '@exowpee/the_rock';

function FormattedDate(props: { date: Date }) {
  const { locale } = useDatePicker();

  const formatted = props.date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <span>{formatted}</span>;
}

// Usage
<FormattedDate date={new Date()} />
// Output (en-US): "Tuesday, January 14, 2026"
// Output (fr-FR): "mardi 14 janvier 2026"`,
        },
        {
          title: 'Checking Cache Status',
          description: 'Inspect the month cache to see which months have been cached.',
          code: `import { useDatePicker } from '@exowpee/the_rock';
import { For, Show } from 'solid-js';

function CacheInspector() {
  const { monthCache } = useDatePicker();

  const cachedMonths = () => Object.keys(monthCache);

  return (
    <div>
      <h3>Cached Months</h3>
      <Show
        when={cachedMonths().length > 0}
        fallback={<p>No months cached yet</p>}
      >
        <ul>
          <For each={cachedMonths()}>
            {(key) => {
              const [year, month] = key.split('-');
              const date = new Date(parseInt(year), parseInt(month));
              return (
                <li>
                  {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  ({monthCache[key].length} days)
                </li>
              );
            }}
          </For>
        </ul>
      </Show>
    </div>
  );
}`,
        },
        {
          title: 'Error Handling',
          description: 'The hook throws an error if used outside a DatePickerProvider.',
          code: `import { useDatePicker } from '@exowpee/the_rock';

// This will throw an error!
function BadComponent() {
  // Error: useDatePicker must be used within DatePickerProvider
  const { locale } = useDatePicker();
  return <div>{locale}</div>;
}

// Correct usage - wrap with provider
function App() {
  return (
    <DatePickerProvider locale="en-US">
      <GoodComponent />
    </DatePickerProvider>
  );
}

function GoodComponent() {
  const { locale } = useDatePicker(); // Works correctly
  return <div>{locale}</div>;
}`,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types used by useDatePicker.',
          code: `// Return type of useDatePicker
interface DatePickerContextType {
  /** Cached month data for calendar rendering performance */
  monthCache: DaysMap;
  /** Add or update cached days for a month */
  setMonthCache: (key: string, days: string[]) => void;
  /** Clear all cached month data from memory and localStorage */
  clearDatePickerGlobal: () => void;
  /** Current locale for date formatting */
  locale: string;
}

// Cache map type
type DaysMap = Record<string, string[]>;
// Example: { "2026-0": ["2025-12-29", "2025-12-30", ...] }
// Key format: "year-monthIndex" (monthIndex is 0-based)`,
        },
      ]}
    />
  );
}
