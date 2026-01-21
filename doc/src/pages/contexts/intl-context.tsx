import ContextDocPage from '../../components/ContextDocPage';

export default function IntlContextPage() {
  return (
    <ContextDocPage
      title="IntlContext"
      description="A context provider for internationalization (i18n) using FormatJS. IntlContext wraps your application to provide locale-aware formatting methods for messages, dates, numbers, and more. It integrates seamlessly with the useIntl hook for accessing formatting capabilities throughout your component tree."
      relatedHooks={[
        {
          name: 'useIntl',
          path: '/hooks/use-intl',
          description:
            'The hook to access the IntlShape object with all formatting methods.',
        },
      ]}
      providerProps={[
        {
          name: 'locale',
          type: 'string',
          description:
            'Locale identifier following BCP 47 format (e.g., "en-US", "fr-FR", "de-DE"). Determines formatting rules for dates, numbers, and pluralization.',
          required: true,
        },
        {
          name: 'messages',
          type: 'Record<string, string>',
          description:
            'Key-value map of translated messages for the current locale. Keys are message IDs, values are translated strings with optional ICU message syntax.',
          required: true,
        },
      ]}
      contextType="Accessor<IntlShape>"
      usage={`import { IntlProvider } from '@exowpee/solidly';`}
      examples={[
        {
          title: 'Basic Provider Setup',
          description:
            'Wrap your application with IntlProvider to enable internationalization.',
          code: `import { IntlProvider } from '@exowpee/solidly;
import messages from './locales/en.json';

function App() {
  return (
    <IntlProvider locale="en-US" messages={messages}>
      <Dashboard />
    </IntlProvider>
  );
}`,
        },
        {
          title: 'Message File Format',
          description:
            'Messages use ICU Message Format syntax for interpolation, pluralization, and selection.',
          code: `// locales/en.json
{
  "greeting": "Hello!",
  "welcome": "Welcome, {name}!",
  "notifications": "{count, plural, =0 {No notifications} one {# notification} other {# notifications}}",
  "gender": "{gender, select, male {He} female {She} other {They}} liked your post",
  "orderDate": "Order placed on {date, date, long}",
  "price": "Total: {amount, number, ::currency/USD}"
}

// locales/fr.json
{
  "greeting": "Bonjour!",
  "welcome": "Bienvenue, {name}!",
  "notifications": "{count, plural, =0 {Aucune notification} one {# notification} other {# notifications}}"
}`,
        },
        {
          title: 'Dynamic Locale Switching',
          description:
            'Change locale at runtime by updating the locale and messages props.',
          code: `import { createSignal } from 'solid-js';
import { IntlProvider } from '@exowpee/solidly;

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
}`,
        },
        {
          title: 'Using with useIntl Hook',
          description: 'Access the IntlShape object through the useIntl hook.',
          code: `import { useIntl } from '@exowpee/solidly;

function GreetingComponent() {
  const intl = useIntl();

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'greeting' })}</h1>
      <p>{intl.formatMessage({ id: 'welcome' }, { name: 'John' })}</p>
      <p>{intl.formatDate(new Date(), { dateStyle: 'long' })}</p>
      <p>{intl.formatNumber(99.99, { style: 'currency', currency: 'USD' })}</p>
    </div>
  );
}`,
        },
        {
          title: 'FormatJS Features',
          description: 'The IntlShape object provides many formatting methods.',
          code: `const intl = useIntl();

// Message formatting
intl.formatMessage({ id: 'greeting' });
intl.formatMessage({ id: 'welcome' }, { name: 'John' });

// Date formatting
intl.formatDate(new Date(), { dateStyle: 'long' });
intl.formatDate(new Date(), { year: 'numeric', month: 'short', day: 'numeric' });

// Time formatting
intl.formatTime(new Date(), { timeStyle: 'short' });

// Number formatting
intl.formatNumber(1234.56); // "1,234.56"
intl.formatNumber(0.25, { style: 'percent' }); // "25%"
intl.formatNumber(99.99, { style: 'currency', currency: 'USD' }); // "$99.99"

// Relative time
intl.formatRelativeTime(-1, 'day'); // "yesterday" or "1 day ago"
intl.formatRelativeTime(2, 'hour'); // "in 2 hours"

// List formatting
intl.formatList(['Apple', 'Banana', 'Cherry']); // "Apple, Banana, and Cherry"`,
        },
      ]}
    />
  );
}
