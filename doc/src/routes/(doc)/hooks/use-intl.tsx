import HookDocPage from '../../../components/HookDocPage';

export default function UseIntlPage() {
  return (
    <HookDocPage
      title="useIntl"
      description="A hook to access the FormatJS internationalization API. Provides methods for formatting messages, dates, numbers, relative times, and lists according to the current locale. Must be used within an IntlProvider."
      returnType="IntlShape"
      usage={`
        import { useIntl, IntlProvider } from '@kayou/hooks';
      `}
      examples={[
        {
          title: 'Provider Setup',
          description:
            'Wrap your application with IntlProvider to enable internationalization.',
          code: `
            import { IntlProvider } from '@kayou/hooks';
            import messages from './locales/en.json';

            function App() {
              return (
                <IntlProvider locale="en-US" messages={messages}>
                  <Dashboard />
                </IntlProvider>
              );
            }
          `,
        },
        {
          title: 'Dynamic Locale Switching',
          description:
            'Change locale at runtime by updating the locale and messages props.',
          code: `
            import { createSignal } from 'solid-js';
            import { IntlProvider } from '@kayou/hooks';

            const allMessages = {
              'en-US': { greeting: 'Hello!', language: 'English' },
              'fr-FR': { greeting: 'Bonjour!', language: 'French' },
              'es-ES': { greeting: '\u00a1Hola!', language: 'Spanish' },
            };

            function App() {
              const [locale, setLocale] = createSignal('en-US');

              return (
                <IntlProvider locale={locale()} messages={allMessages[locale()]}>
                  <select onChange={(e) => setLocale(e.target.value)}>
                    <option value="en-US">English</option>
                    <option value="fr-FR">Fran\u00e7ais</option>
                    <option value="es-ES">Espa\u00f1ol</option>
                  </select>
                  <GreetingComponent />
                </IntlProvider>
              );
            }
          `,
        },
        {
          title: 'Basic Usage',
          description: 'Access the IntlShape object with formatting methods.',
          code: `
            import { useIntl } from '@kayou/hooks;

            function MyComponent() {
              const intl = useIntl();

              // Format a translated message
              const greeting = intl.formatMessage({ id: 'greeting' });

              // Format with interpolation
              const welcome = intl.formatMessage(
                { id: 'welcome', defaultMessage: 'Hello, {name}!' },
                { name: userName() }
              );

              // Format a date
              const date = intl.formatDate(new Date(), { dateStyle: 'long' });

              // Format a number as currency
              const price = intl.formatNumber(99.99, {
                style: 'currency',
                currency: 'USD',
              });

              // Format relative time
              const timeAgo = intl.formatRelativeTime(-2, 'day'); // "2 days ago"

              return (
                <div>
                  <h1>{greeting}</h1>
                  <p>{welcome}</p>
                  <p>Today: {date}</p>
                  <p>Price: {price}</p>
                  <p>Posted: {timeAgo}</p>
                </div>
              );
            }
          `,
        },
        {
          title: 'Return Value',
          description:
            'The hook returns an IntlShape object from FormatJS with formatting methods.',
          code: `
            const intl = useIntl();

            // Properties
            intl.locale;        // Current locale string (e.g., "en-US")
            intl.messages;      // Message dictionary

            // Formatting methods
            intl.formatMessage(descriptor, values);
            intl.formatDate(date, options);
            intl.formatTime(date, options);
            intl.formatNumber(value, options);
            intl.formatRelativeTime(value, unit, options);
            intl.formatList(list, options);
            intl.formatDisplayName(value, options);
          `,
        },
        {
          title: 'Message Formatting',
          description: 'Format translated messages with optional interpolation values.',
          code: `
            const intl = useIntl();

            // Simple message
            const greeting = intl.formatMessage({ id: 'greeting' });
            // Output: "Hello!"

            // With interpolation
            const welcome = intl.formatMessage(
              { id: 'welcome' },
              { name: 'John' }
            );
            // Output: "Welcome, John!"

            // With default message (fallback if ID not found)
            const fallback = intl.formatMessage({
              id: 'missing.key',
              defaultMessage: 'Default text here',
            });

            // Pluralization (requires ICU syntax in messages)
            // Message: "{count, plural, =0 {No items} one {# item} other {# items}}"
            const items = intl.formatMessage(
              { id: 'items' },
              { count: 5 }
            );
            // Output: "5 items"
          `,
        },
        {
          title: 'Date Formatting',
          description:
            'Format dates according to the current locale with various style options.',
          code: `
            const intl = useIntl();
            const date = new Date('2024-03-15');

            // Preset styles
            intl.formatDate(date, { dateStyle: 'full' });
            // Output: "Friday, March 15, 2024"

            intl.formatDate(date, { dateStyle: 'long' });
            // Output: "March 15, 2024"

            intl.formatDate(date, { dateStyle: 'medium' });
            // Output: "Mar 15, 2024"

            intl.formatDate(date, { dateStyle: 'short' });
            // Output: "3/15/24"

            // Custom format
            intl.formatDate(date, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'long',
            });
            // Output: "Friday, Mar 15, 2024"
          `,
        },
        {
          title: 'Number Formatting',
          description:
            'Format numbers with locale-specific separators, currencies, and percentages.',
          code: `
            const intl = useIntl();

            // Basic number formatting
            intl.formatNumber(1234567.89);
            // Output (en-US): "1,234,567.89"
            // Output (de-DE): "1.234.567,89"

            // Currency
            intl.formatNumber(99.99, {
              style: 'currency',
              currency: 'USD',
            });
            // Output: "$99.99"

            intl.formatNumber(99.99, {
              style: 'currency',
              currency: 'EUR',
            });
            // Output: "€99.99"

            // Percentage
            intl.formatNumber(0.25, { style: 'percent' });
            // Output: "25%"

            // Compact notation
            intl.formatNumber(1500000, { notation: 'compact' });
            // Output: "1.5M"

            // Units
            intl.formatNumber(100, {
              style: 'unit',
              unit: 'kilometer-per-hour',
            });
            // Output: "100 km/h"
          `,
        },
        {
          title: 'Relative Time Formatting',
          description: 'Format relative time strings like "2 days ago" or "in 3 hours".',
          code: `
            const intl = useIntl();

            // Past times (negative values)
            intl.formatRelativeTime(-1, 'second'); // "1 second ago"
            intl.formatRelativeTime(-30, 'minute'); // "30 minutes ago"
            intl.formatRelativeTime(-2, 'hour');    // "2 hours ago"
            intl.formatRelativeTime(-1, 'day');     // "yesterday" or "1 day ago"
            intl.formatRelativeTime(-3, 'week');    // "3 weeks ago"
            intl.formatRelativeTime(-1, 'month');   // "last month"
            intl.formatRelativeTime(-2, 'year');    // "2 years ago"

            // Future times (positive values)
            intl.formatRelativeTime(1, 'day');      // "tomorrow" or "in 1 day"
            intl.formatRelativeTime(5, 'minute');   // "in 5 minutes"
            intl.formatRelativeTime(2, 'week');     // "in 2 weeks"

            // Numeric style (always shows number)
            intl.formatRelativeTime(-1, 'day', { numeric: 'always' });
            // Output: "1 day ago" (instead of "yesterday")
          `,
        },
        {
          title: 'List Formatting',
          description: 'Format arrays into locale-appropriate lists with conjunctions.',
          code: `
            const intl = useIntl();

            // Conjunction list (and)
            intl.formatList(['Apple', 'Banana', 'Cherry']);
            // Output (en): "Apple, Banana, and Cherry"
            // Output (es): "Apple, Banana y Cherry"

            // Disjunction list (or)
            intl.formatList(['Red', 'Blue', 'Green'], { type: 'disjunction' });
            // Output: "Red, Blue, or Green"

            // Unit list (no conjunction)
            intl.formatList(['5 ft', '10 in'], { type: 'unit' });
            // Output: "5 ft, 10 in"

            // Short style
            intl.formatList(['A', 'B', 'C'], { style: 'short' });
            // Output: "A, B, & C"

            // Narrow style
            intl.formatList(['A', 'B', 'C'], { style: 'narrow' });
            // Output: "A, B, C"
          `,
        },
      ]}
    />
  );
}
