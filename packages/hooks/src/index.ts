// @exowpee/solidly-hooks - Utility hooks and contexts for SolidJS

// Hooks
export {
  useMutation,
  useIntl,
  useCustomResource,
  useTheme,
  type Mutation,
  type MutationOptions,
  type MutationProps,
  type MutationTriggerOptions,
  type CustomResource,
  type CustomResourceProps,
} from './hooks';

// Contexts and Providers
export {
  IntlContext,
  IntlProvider,
  CustomResourceContext,
  CustomResourceProvider,
  ThemeContext,
  ThemeProvider,
  type IntlProviderProps,
  type CustomResourceContextValue,
  type CustomResourceProviderProps,
  type PendingEntry,
  type ResourceOptions,
  type ThemeContextType,
  type ThemeType,
} from './context';

// Helpers (for advanced use cases)
export { cache, getCacheRow, insertOrUpdateCacheRow } from './helpers';
