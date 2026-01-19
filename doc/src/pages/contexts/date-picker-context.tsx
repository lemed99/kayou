import ContextDocPage from '../../components/ContextDocPage';

export default function DatePickerContextPage() {
  return (
    <ContextDocPage
      title="DatePickerContext"
      description="A context provider for DatePicker state management. Provides month caching for calendar rendering performance and locale configuration for date formatting. The cache is persisted to localStorage for cross-session performance benefits. Required wrapper for using DatePicker components and the useDatePicker hook."
      providerProps={[
        {
          name: 'locale',
          type: 'string',
          description:
            'Locale identifier for date formatting following BCP 47 format (e.g., "en-US", "fr-FR", "de-DE"). Determines day/month names and date formatting rules.',
          required: true,
        },
      ]}
      contextValue={[
        {
          name: 'monthCache',
          type: 'DaysMap',
          description:
            'Record of cached month data. Keys are "year-monthIndex" strings, values are arrays of ISO date strings representing the 42 days shown in a 6-week calendar grid.',
        },
        {
          name: 'setMonthCache',
          type: '(key: string, days: string[]) => void',
          description:
            'Function to cache days for a specific month. Automatically persists to localStorage for cross-session caching.',
        },
        {
          name: 'clearDatePickerGlobal',
          type: '() => void',
          description:
            'Clears all cached month data from both memory and localStorage. Useful when switching users or resetting application state.',
        },
        {
          name: 'locale',
          type: 'string',
          description:
            'The current locale passed to the provider, accessible reactively.',
        },
      ]}
      contextType="DatePickerContextType | undefined"
      usage={`import { DatePickerProvider } from '@exowpee/solidly';`}
      examples={[
        {
          title: 'Basic Provider Setup',
          description:
            'Wrap your application with DatePickerProvider to enable DatePicker components.',
          code: `import { DatePickerProvider } from '@exowpee/solidly;

function App() {
  return (
    <DatePickerProvider locale="en-US">
      <YourApplication />
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Dynamic Locale Switching',
          description: 'Change locale at runtime by updating the locale prop.',
          code: `import { createSignal } from 'solid-js';
import { DatePickerProvider, DatePicker } from '@exowpee/solidly;

function App() {
  const [locale, setLocale] = createSignal('en-US');

  return (
    <DatePickerProvider locale={locale()}>
      <div>
        <select onChange={(e) => setLocale(e.target.value)}>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="fr-FR">Français</option>
          <option value="de-DE">Deutsch</option>
          <option value="es-ES">Español</option>
          <option value="ja-JP">日本語</option>
        </select>

        <DatePicker
          type="single"
          locale={locale()}
          label="Select Date"
        />
      </div>
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Using with useDatePicker Hook',
          description: 'Access context values through the useDatePicker hook.',
          code: `import { DatePickerProvider, useDatePicker } from '@exowpee/solidly;

function DateInfo() {
  const { locale, monthCache, clearDatePickerGlobal } = useDatePicker();

  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>Cached months: {Object.keys(monthCache).length}</p>
      <button onClick={clearDatePickerGlobal}>
        Clear Cache
      </button>
    </div>
  );
}

function App() {
  return (
    <DatePickerProvider locale="en-US">
      <DateInfo />
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Multiple DatePickers',
          description:
            'All DatePicker components within the provider share the same cache and locale.',
          code: `import { DatePickerProvider, DatePicker } from '@exowpee/solidly;
import { createSignal } from 'solid-js';

function BookingForm() {
  const [checkIn, setCheckIn] = createSignal({});
  const [checkOut, setCheckOut] = createSignal({});

  return (
    <DatePickerProvider locale="en-US">
      <form>
        <DatePicker
          type="single"
          locale="en-US"
          label="Check-in Date"
          value={checkIn()}
          onChange={setCheckIn}
        />
        <DatePicker
          type="single"
          locale="en-US"
          label="Check-out Date"
          value={checkOut()}
          onChange={setCheckOut}
          minDate={checkIn().date}
        />
      </form>
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Cache Behavior',
          description:
            'The month cache stores pre-calculated calendar grids for performance.',
          code: `// The cache stores 42 days (6 weeks) for each month viewed
// This avoids recalculating day positions each time a month is displayed

// Cache key format: "year-monthIndex"
// monthIndex is 0-based (0 = January, 11 = December)

// Example cache entry:
{
  "2026-0": [
    "2025-12-29", // Monday before Jan 1
    "2025-12-30",
    "2025-12-31",
    "2026-01-01",
    "2026-01-02",
    // ... 42 total days
    "2026-02-08"  // Last day in 6-week grid
  ]
}

// Cache is persisted to localStorage under key "DatePickerCache"
// Automatically loaded on mount, saved on each update`,
        },
        {
          title: 'SSR Considerations',
          description:
            'The provider handles SSR safely by checking for window availability.',
          code: `// The DatePickerProvider is SSR-safe:
// - localStorage access is wrapped in try/catch
// - typeof window checks prevent SSR errors
// - Cache loading happens in onMount (client-side only)

// For SSR frameworks (SolidStart, Astro, etc.):
import { DatePickerProvider, DatePicker } from '@exowpee/solidly;

// Works safely in SSR context
function App() {
  return (
    <DatePickerProvider locale="en-US">
      {/* DatePicker will render correctly after hydration */}
      <DatePicker type="single" locale="en-US" />
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Provider Placement',
          description: 'Best practices for where to place the DatePickerProvider.',
          code: `// Option 1: App-level provider (recommended for most apps)
// All DatePickers share the same cache
function App() {
  return (
    <DatePickerProvider locale="en-US">
      <Router>
        <Routes />
      </Router>
    </DatePickerProvider>
  );
}

// Option 2: Page-level provider
// Useful when different pages need different locales
function BookingPage() {
  return (
    <DatePickerProvider locale="en-US">
      <BookingForm />
    </DatePickerProvider>
  );
}

function AdminPage() {
  return (
    <DatePickerProvider locale="de-DE">
      <AdminDashboard />
    </DatePickerProvider>
  );
}

// Option 3: Nested providers
// Inner provider overrides outer provider's locale
function App() {
  return (
    <DatePickerProvider locale="en-US">
      <MainContent />
      <DatePickerProvider locale="ja-JP">
        <JapaneseSection />
      </DatePickerProvider>
    </DatePickerProvider>
  );
}`,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types for DatePickerContext.',
          code: `// Context value type
interface DatePickerContextType {
  monthCache: DaysMap;
  setMonthCache: (key: string, days: string[]) => void;
  clearDatePickerGlobal: () => void;
  locale: string;
}

// Cache map type
type DaysMap = Record<string, string[]>;

// Provider props
interface DatePickerProviderProps {
  locale: string;
  children: JSX.Element;
}

// The context is typed as possibly undefined
const DatePickerContext = createContext<DatePickerContextType | undefined>(undefined);`,
        },
      ]}
    />
  );
}
