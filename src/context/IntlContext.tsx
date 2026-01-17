import { Accessor, ParentComponent, createContext, createMemo } from 'solid-js';

import { IntlShape, createIntl, createIntlCache } from '@formatjs/intl';

/**
 * Context for FormatJS internationalization.
 * Provides an accessor to the IntlShape object with formatting methods.
 */
export const IntlContext = createContext<Accessor<IntlShape>>();

/**
 * Props for the IntlProvider component.
 */
export interface IntlProviderProps {
  /** Locale identifier (e.g., 'en-US', 'fr-FR') */
  locale: string;
  /** Key-value map of translated messages */
  messages: Record<string, string>;
}

/**
 * Provider for FormatJS internationalization.
 * Wraps children with IntlContext providing formatting methods.
 *
 * @example Basic usage
 * ```tsx
 * import messages from './locales/en.json';
 *
 * <IntlProvider locale="en-US" messages={messages}>
 *   <App />
 * </IntlProvider>
 * ```
 *
 * @example Dynamic locale switching
 * ```tsx
 * const [locale, setLocale] = createSignal('en-US');
 * const messages = { 'en-US': enMessages, 'fr-FR': frMessages };
 *
 * <IntlProvider locale={locale()} messages={messages[locale()]}>
 *   <App />
 * </IntlProvider>
 * ```
 *
 * @example Using with useIntl hook
 * ```tsx
 * const intl = useIntl();
 * const greeting = intl.formatMessage({ id: 'greeting' });
 * const date = intl.formatDate(new Date(), { dateStyle: 'long' });
 * const price = intl.formatNumber(99.99, { style: 'currency', currency: 'USD' });
 * ```
 */
export const IntlProvider: ParentComponent<IntlProviderProps> = (props) => {
  const cache = createIntlCache();

  /**
   * Memoized intl object that recomputes when locale or messages change.
   * Uses FormatJS cache for formatter memoization.
   */
  const intl = createMemo(() =>
    createIntl({ locale: props.locale, messages: props.messages }, cache),
  );

  return <IntlContext.Provider value={intl}>{props.children}</IntlContext.Provider>;
};
