import DocPage from '../../../components/DocPage';

export default function PaginationPage() {
  return (
    <DocPage
      title="Pagination"
      description="Page navigation with first/prev/next/last buttons and direct page input."
      keyConcepts={[
        {
          term: 'Controlled Component',
          explanation:
            'Provide current page, total, and onChange callback for data fetching.',
        },
        {
          term: 'Direct Page Input',
          explanation:
            'Type page number directly; validates bounds before triggering onChange.',
        },
        {
          term: 'Navigation Buttons',
          explanation: 'First/prev/next/last buttons with auto-disable at boundaries.',
        },
      ]}
      props={[
        {
          name: 'total',
          type: 'number',
          default: '-',
          description: 'Total number of pages (required)',
        },
        {
          name: 'page',
          type: 'number',
          default: '-',
          description: 'Current page number, 1-indexed (required)',
        },
        {
          name: 'onChange',
          type: '(page: number) => void',
          default: '-',
          description: 'Callback fired when the page changes (required)',
        },
        {
          name: 'labels',
          type: 'Partial<PaginationLabels>',
          default: 'DEFAULT_PAGINATION_LABELS',
          description: 'Visible text labels for the pagination component',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<PaginationAriaLabels>',
          default: 'DEFAULT_PAGINATION_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'PaginationLabels',
          kind: 'type',
          description: 'Visible text labels for the pagination component',
          props: [
            { name: 'page', type: 'string', default: '"Page"', description: 'Label for the page input' },
            { name: 'of', type: 'string', default: '"of"', description: 'Label between current page and total' },
            { name: 'pageN', type: '(n: number) => string', default: '(n) => `Page ${n}`', description: 'Function to generate page label' },
          ],
        },
        {
          name: 'PaginationAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            { name: 'goToFirst', type: 'string', default: '"Go to first page"', description: 'Aria label for first page button' },
            { name: 'goToPrevious', type: 'string', default: '"Go to previous page"', description: 'Aria label for previous page button' },
            { name: 'goToNext', type: 'string', default: '"Go to next page"', description: 'Aria label for next page button' },
            { name: 'goToLast', type: 'string', default: '"Go to last page"', description: 'Aria label for last page button' },
            { name: 'page', type: 'string', default: '"Page"', description: 'Aria label for page input' },
          ],
        },
      ]}
      playground={`
        import { Pagination } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [page, setPage] = createSignal(1);

          return (
            <Pagination total={10} page={page()} onChange={setPage} />
          );
        }
      `}
      usage={`
        import { Pagination } from '@kayou/ui';

        <Pagination total={10} page={page()} onChange={setPage} />
      `}
    />
  );
}
