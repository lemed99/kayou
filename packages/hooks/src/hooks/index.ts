// Hooks - @kayou/hooks
export {
  useMutation,
  type Mutation,
  type MutationOptions,
  type MutationProps,
  type MutationTriggerOptions,
} from './useMutation';
export { useIntl } from './useIntl';
export {
  useCustomResource,
  type CustomResource,
  type CustomResourceProps,
} from './useCustomResource';
export { useTheme } from './useTheme';
export { useToast } from './useToast';
export { useFloating } from './useFloating';
export { useVirtualList } from './useVirtualList';
export { useDynamicVirtualList } from './useDynamicVirtualList';
export {
  useForm,
  type FormPath,
  type UseFormOptions,
  type UseFormReturn,
} from './useForm';
export { useShortcut, type UseShortcutOptions, type UseShortcutReturn } from './useShortcut';

// useFloating types
export type {
  Alignment,
  ArrowPosition,
  BackgroundScrollBehavior,
  Dimensions,
  FloatingPosition,
  Placement,
  UseFloatingOptions,
  UseFloatingReturn,
} from './useFloating/types';

// useFloating utilities
export {
  canFitWithinContainer,
  computeArrowPosition,
  computePosition,
  getAllScrollableAncestors,
  getElementRect,
  getScrollableAncestor,
  getViewportRect,
  hasFixedAncestor,
  isElementVisibleInAncestors,
} from './useFloating/utils';
