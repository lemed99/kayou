import { type MergeProps, mergeProps } from 'solid-js';

export function defaultProps<T, K extends keyof T>(
  defaults: Required<Pick<T, K>>,
  props: T,
): MergeProps<[Required<Pick<T, K>>, T]> {
  const resolvedProps = mergeProps(defaults, props);
  return resolvedProps;
}
