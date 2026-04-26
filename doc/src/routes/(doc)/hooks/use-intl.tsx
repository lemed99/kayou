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
      provider={{
        name: 'IntlProvider',
        description:
          'Wraps your application to provide internationalization context to all useIntl hooks. Supplies the current locale and translated messages.',
        example: `
          import { IntlProvider } from '@kayou/hooks';

          const messages = {
            greeting: 'Hello!',
            welcome: 'Welcome, {name}!',
          };

          function App() {
            return (
              <IntlProvider locale="en-US" messages={messages}>
                <MyApp />
              </IntlProvider>
            );
          }
        `,
        props: [
          {
            name: 'locale',
            type: 'string',
            required: true,
            default: '-',
            description:
              'Locale identifier used for formatting (e.g., "en-US", "fr-FR").',
          },
          {
            name: 'messages',
            type: 'Record<string, string>',
            required: true,
            default: '-',
            description: 'Key-value map of translated messages for the current locale.',
          },
        ],
      }}
    />
  );
}
