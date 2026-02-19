// @kayou/hooks - Utility hooks and contexts for SolidJS

// Hooks
export {
  useMutation,
  useIntl,
  useCustomResource,
  useTheme,
  useToast,
  useFloating,
  useVirtualList,
  useDynamicVirtualList,
  useForm,
  type UseFormOptions,
  type UseFormReturn,
  type Mutation,
  type MutationOptions,
  type MutationProps,
  type MutationTriggerOptions,
  type CustomResource,
  type CustomResourceProps,
  type Alignment,
  type ArrowPosition,
  type BackgroundScrollBehavior,
  type Dimensions,
  type FloatingPosition,
  type Placement,
  type UseFloatingOptions,
  type UseFloatingReturn,
  canFitWithinContainer,
  computeArrowPosition,
  computePosition,
  getAllScrollableAncestors,
  getElementRect,
  getScrollableAncestor,
  getViewportRect,
  hasFixedAncestor,
  isElementVisibleInAncestors,
} from './hooks';

// Contexts and Providers
export {
  IntlContext,
  IntlProvider,
  CustomResourceContext,
  CustomResourceProvider,
  ThemeContext,
  ThemeProvider,
  ToastContext,
  ToastProvider,
  type IntlProviderProps,
  type CustomResourceContextValue,
  type CustomResourceProviderProps,
  type PendingEntry,
  type ResourceOptions,
  type ThemeContextType,
  type ThemeType,
  type ToastAPI,
  type ToastMethodProps,
  FormContext,
  FormProvider,
  useFormContext,
  type FormContextType,
  type FormProviderProps,
} from './context';

// Validators (access via `useForm.validators.required()`, etc.)
export { type FieldValidator, type FormSchema } from './validators';

// Helpers (for advanced use cases)
export { cache, getCacheRow, insertOrUpdateCacheRow, isValidCacheData, preventBackgroundScroll } from './helpers';
