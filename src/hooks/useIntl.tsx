import { ParentComponent, createContext, useContext } from 'solid-js';

import { IntlShape, createIntl, createIntlCache } from '@formatjs/intl';

const IntlContext = createContext<IntlShape>();

export const IntlProvider: ParentComponent<{
  locale: string;
  messages: Record<string, string>;
}> = (props) => {
  const cache = createIntlCache();

  const intl = createIntl(
    {
      get locale() {
        return props.locale;
      },
      get messages() {
        return props.messages;
      },
    },
    cache,
  );

  return <IntlContext.Provider value={intl}>{props.children}</IntlContext.Provider>;
};

export const useIntl = (): IntlShape => {
  const intl = useContext(IntlContext);
  if (!intl) {
    throw new Error('useIntl must be used within an IntlProvider');
  }
  return intl;
};
