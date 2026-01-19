import { createSignal } from 'solid-js';

import { Pagination } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function PaginationPage() {
  const [page1, setPage1] = createSignal(1);
  const [page2, setPage2] = createSignal(5);

  return (
    <DocPage
      title="Pagination"
      description="Page navigation with first/prev/next/last buttons and direct page input."
      keyConcepts={[
        {
          term: 'Controlled Component',
          explanation:
            'Pagination is always controlled—you provide the current page and total pages, and handle the onChange callback. This design integrates naturally with data fetching where page state drives API requests.',
        },
        {
          term: 'Direct Page Input',
          explanation:
            'Users can type a page number directly into the input field for quick navigation to specific pages. The input validates bounds and only triggers onChange with valid page numbers.',
        },
        {
          term: 'Navigation Buttons',
          explanation:
            'Four navigation buttons (first, previous, next, last) with automatic disable states at boundaries. Tooltips explain each button for discoverability.',
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
      ]}
      examples={[
        {
          title: 'Basic Pagination',
          description: 'Simple pagination with 10 pages.',
          code: `const [page, setPage] = createSignal(1);

<Pagination
  total={10}
  page={page()}
  onChange={setPage}
/>`,
          component: () => <Pagination total={10} page={page1()} onChange={setPage1} />,
        },
        {
          title: 'Middle Page',
          description: 'Pagination starting at page 5.',
          code: `<Pagination
  total={20}
  page={5}
  onChange={handleChange}
/>`,
          component: () => <Pagination total={20} page={page2()} onChange={setPage2} />,
        },
        {
          title: 'Single Page',
          description: 'Pagination with only one page (buttons disabled).',
          code: `<Pagination
  total={1}
  page={1}
  onChange={handleChange}
/>`,
          component: () => <Pagination total={1} page={1} onChange={() => {}} />,
        },
      ]}
      usage={`import { Pagination } from '@exowpee/solidly';

// Basic usage
const [page, setPage] = createSignal(1);

<Pagination
  total={10}
  page={page()}
  onChange={setPage}
/>

// With data fetching
const [page, setPage] = createSignal(1);
const [data] = createResource(() => page(), fetchPageData);

<Pagination
  total={totalPages()}
  page={page()}
  onChange={(newPage) => {
    setPage(newPage);
    // Data will refetch automatically
  }}
/>`}
    />
  );
}
