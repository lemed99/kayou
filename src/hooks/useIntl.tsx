import { IntlShape } from "@formatjs/intl";
import { useContext } from "solid-js";
import { IntlContext } from "../context/IntlContext";

export const useIntl = (): IntlShape => {
  const intl = useContext(IntlContext);
  if (!intl) {
    throw new Error('useIntl must be used within an IntlProvider');
  }
  return intl;
};
