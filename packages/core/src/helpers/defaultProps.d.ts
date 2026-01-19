import { type MergeProps } from 'solid-js';
export declare function defaultProps<T, K extends keyof T>(defaults: Required<Pick<T, K>>, props: T): MergeProps<[Required<Pick<T, K>>, T]>;
