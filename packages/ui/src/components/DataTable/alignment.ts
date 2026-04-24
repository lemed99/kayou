import type { DataTableColumnAlignment } from './DataTable';

export interface DataTableColumnAlignmentClasses {
  justifyClass: 'justify-start' | 'justify-center' | 'justify-end';
  textClass: 'text-left' | 'text-center' | 'text-right';
}

const ALIGNMENT_CLASS_MAP: Record<
  DataTableColumnAlignment,
  DataTableColumnAlignmentClasses
> = {
  left: {
    justifyClass: 'justify-start',
    textClass: 'text-left',
  },
  center: {
    justifyClass: 'justify-center',
    textClass: 'text-center',
  },
  right: {
    justifyClass: 'justify-end',
    textClass: 'text-right',
  },
};

export function getDataTableColumnAlignmentClasses(
  alignment?: DataTableColumnAlignment,
): DataTableColumnAlignmentClasses {
  return ALIGNMENT_CLASS_MAP[alignment ?? 'left'];
}
