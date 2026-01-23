// Re-export utility hooks from @exowpee/solidly-hooks
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
} from '@exowpee/solidly-hooks';

// Component-specific hooks - @exowpee/solidly
export { useDataTableFilters } from './useDataTableFilters';
export { useDatePicker } from './useDatePicker';
export { useDynamicVirtualList } from './useDynamicVirtualList';
export { useFloating } from './useFloating';
export { default as useSelect } from './useSelect';
export { useToast } from './useToast';
export { useVirtualList } from './useVirtualList';

// useFloating types
export type {
  Alignment,
  ArrowPosition,
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
  getElementRect,
  getScrollableAncestor,
  getViewportRect,
  hasFixedAncestor,
} from './useFloating/utils';
