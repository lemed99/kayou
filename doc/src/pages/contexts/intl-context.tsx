import ContextDocPage from '../../components/ContextDocPage';

export default function IntlContextPage() {
  return (
    <ContextDocPage
      title="IntlContext"
      description="A context provider for internationalization (i18n) using FormatJS. IntlContext wraps your application to provide locale-aware formatting methods for messages, dates, numbers, and more. It integrates seamlessly with the useIntl hook for accessing formatting capabilities throughout your component tree."
      overview="IntlContext establishes the internationalization foundation for your entire application. By wrapping your component tree with the IntlProvider, you make locale information and translated messages available to any descendant component via the useIntl hook. The context manages the current locale setting and a dictionary of translated messages, then provides the FormatJS IntlShape object that contains all formatting methods. When the locale or messages change, all components using useIntl automatically receive the updated values and re-render with the new translations."
      whenToUse={[
        'Building applications that need to support multiple languages',
        'Formatting dates, numbers, and currencies according to user locale preferences',
        'Implementing a language switcher that updates all text dynamically',
        'Ensuring consistent translation patterns across a large component library',
        'Providing locale-aware formatting for international user bases',
      ]}
      keyConcepts={[
        {
          term: 'IntlProvider',
          explanation:
            'The provider component that wraps your application and supplies internationalization context. It accepts a locale and messages, then makes the FormatJS IntlShape available to descendants.',
        },
        {
          term: 'Locale',
          explanation:
            'A BCP 47 language tag (e.g., "en-US", "fr-FR") that determines how dates, numbers, and pluralization rules are applied. Different locales use different date formats, number separators, and grammatical rules.',
        },
        {
          term: 'Messages Dictionary',
          explanation:
            'A key-value object mapping message IDs to translated strings. Each supported language has its own messages file, and the appropriate one is passed to IntlProvider based on user preference.',
        },
        {
          term: 'ICU Message Syntax',
          explanation:
            'The message format standard used in translation strings. Supports variable interpolation ({name}), pluralization ({count, plural, ...}), and select expressions ({gender, select, ...}).',
        },
      ]}
      value="For enterprise applications serving global markets, robust internationalization infrastructure is non-negotiable. IntlContext, powered by FormatJS (the same library behind react-intl), provides battle-tested i18n that handles edge cases like complex pluralization rules, bidirectional text, and locale-specific formatting. It integrates with standard localization workflows and tools, making it easy to work with translation teams and localization platforms. By establishing i18n at the context level, you ensure every component has access to consistent, professional-grade translations without prop drilling or manual setup."
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
