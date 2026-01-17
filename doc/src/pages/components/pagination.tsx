import { createSignal } from 'solid-js';

import Pagination from '@lib/components/Pagination';
import DocPage from '../../components/DocPage';

export default function PaginationPage() {
  const [page1, setPage1] = createSignal(1);
  const [page2, setPage2] = createSignal(5);

  return (
    <DocPage
      title="Pagination"
      description="A navigation component for moving through paginated content. Pagination is essential for any data-heavy application that displays lists, tables, or search results too large to show at once. This component provides intuitive navigation with buttons for first, previous, next, and last pages, plus an editable page number input for jumping directly to any page. The input validates against min/max bounds, and tooltips provide clear labels for navigation buttons. The controlled design ensures the parent component maintains page state, making it easy to sync with data fetching logic."
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
      value="Proper pagination is essential for application performance and usability. It prevents loading massive datasets into memory, provides clear navigation patterns for large result sets, and gives users control over their browsing experience. Consistent pagination behavior builds user confidence when working with extensive data."
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
      usage={`import { Pagination } from '@exowpee/the_rock';

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
