import { useContext } from 'solid-js';

import { IntlShape } from '@formatjs/intl';

import { IntlContext } from '../context/IntlContext';

/**
 * Hook to access the FormatJS internationalization API.
 * Provides methods for formatting dates, numbers, and messages.
 * Must be used within an IntlProvider.
 *
 * @returns IntlShape object with formatting methods
 * @throws Error if used outside IntlProvider
 *
 * @example Basic message formatting
 * ```tsx
 * const intl = useIntl();
 * const message = intl.formatMessage({ id: 'greeting' });
 * ```
 *
 * @example Message with interpolation
 * ```tsx
 * const intl = useIntl();
 * const welcome = intl.formatMessage(
 *   { id: 'welcome', defaultMessage: 'Hello, {name}!' },
 *   { name: userName() }
 * );
 * ```
 *
 * @example Date and number formatting
 * ```tsx
 * const intl = useIntl();
 * const date = intl.formatDate(new Date(), { dateStyle: 'long' });
 * const price = intl.formatNumber(99.99, { style: 'currency', currency: 'USD' });
 * const percent = intl.formatNumber(0.25, { style: 'percent' });
 * ```
 *
 * @example Relative time formatting
 * ```tsx
 * const intl = useIntl();
 * const relative = intl.formatRelativeTime(-2, 'day'); // "2 days ago"
 * ```
 */
export const useIntl = (): IntlShape => {
  const intl = useContext(IntlContext);
  if (!intl) {
    throw new Error('useIntl must be used within an IntlProvider');
  }
  return intl();
};
