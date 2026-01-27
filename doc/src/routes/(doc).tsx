import { type ParentProps } from 'solid-js';

import DocLayout from '../layouts/DocLayout';

export default function DocWrapper(props: ParentProps) {
  return <DocLayout>{props.children}</DocLayout>;
}
