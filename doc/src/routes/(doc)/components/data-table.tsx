import DocPage from '../../../components/DocPage';

export default function DataTablePage() {
  return (
    <DocPage
      title="DataTable"
      description="Table with virtualization, pagination, row selection, and a comprehensive filter system."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes for table styling',
        },
      ]}
      keyConcepts={[
        {
          term: 'Virtualization',
          explanation:
            'Renders only visible rows; use rowHeight (fixed) or estimatedRowHeight (dynamic).',
        },
        {
          term: 'Filter System',
          explanation:
            'Built-in filters via filterConfigs with operators (contains, equal, between, etc.).',
        },
        {
          term: 'Filter Callback',
          explanation:
            'Filters fire onFiltersChange with all active filter params. The consumer handles filtering or fetching.',
        },
        {
          term: 'Popover Filter UI',
          explanation: 'Popover with Column/Operator/Value dropdowns; apply on submit.',
        },
        {
          term: 'CSS Grid Layout',
          explanation:
            'Div-based CSS Grid enables virtualization and complex cell content.',
        },
        {
          term: 'Expandable View',
          explanation:
            'Expand button in the toolbar shows all rows inline with virtualization when data exceeds defaultRowsCount.',
        },
        {
          term: 'Infinite Scroll',
          explanation:
            'onLoadMore fires at 80% scroll when virtualization is enabled, allowing progressive data loading.',
        },
      ]}
      props={[
        {
          name: 'data',
          type: 'T[]',
          default: '-',
          description: 'Array of data rows to display (required)',
          required: true,
        },
        {
          name: 'columns',
          type: 'DataTableColumnProps<T>[]',
          default: '-',
          description:
            'Column configurations with key, label, width (percentage), optional render function and tooltip',
          required: true,
        },
        {
          name: 'loading',
          type: 'boolean',
          default: '-',
          description: 'Whether the table is in a loading state (shows skeleton)',
          required: true,
        },
        {
          name: 'error',
          type: 'unknown',
          default: '-',
          description: 'Error state for the table',
          required: true,
        },
        {
          name: 'errorMessage',
          type: 'string',
          default: '-',
          description: 'Message to display when error is truthy',
          required: true,
        },
        {
          name: 'noDataMessage',
          type: 'string',
          default: '-',
          description: 'Message to display when data array is empty',
          required: true,
        },
        {
          name: 'seeMoreText',
          type: 'string',
          default: '-',
          description: 'Text for the expandable "see more" button',
          required: true,
        },
        {
          name: 'filterButtonText',
          type: 'string',
          default: '"Filter"',
          description: 'Text for the filter button that opens the popover',
        },
        {
          name: 'elementsPerPageText',
          type: 'string',
          default: '-',
          description: 'Text label for the per-page control',
          required: true,
        },
        {
          name: 'selectedElementsText',
          type: '(count: number, total: number) => string',
          default: '-',
          description: 'Function to format the selected elements text',
          required: true,
        },
        {
          name: 'validating',
          type: 'boolean',
          default: 'false',
          description: 'Shows a loading overlay while refreshing data',
        },
        {
          name: 'rowSelection',
          type: 'boolean',
          default: 'false',
          description: 'Whether row selection checkboxes are enabled',
        },
        {
          name: 'searchBar',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show the search bar',
        },
        {
          name: 'configureColumns',
          type: 'boolean',
          default: 'false',
          description: 'Whether to allow users to toggle column visibility',
        },
        {
          name: 'expandable',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the table can expand inline to show all rows when data exceeds defaultRowsCount',
        },
        {
          name: 'defaultRowsCount',
          type: 'number',
          default: '5',
          description: 'Number of rows to show before the "see more" button appears',
        },
        {
          name: 'defaultColumns',
          type: 'string[]',
          default: '-',
          description: 'Array of column keys to show by default',
        },
        {
          name: 'pageTotal',
          type: 'number',
          default: '-',
          description: 'Total number of pages for pagination',
        },
        {
          name: 'onPageChange',
          type: '(page: number) => void',
          default: '-',
          description: 'Callback fired when page changes',
        },
        {
          name: 'onSearchChange',
          type: '(search: string) => void',
          default: '-',
          description: 'Callback fired when the search value changes',
        },
        {
          name: 'onPerPageChange',
          type: '(perPage: number) => void',
          default: '-',
          description: 'Callback fired when the per-page value changes',
        },
        {
          name: 'onSelectionChange',
          type: '(selectedIndices: Set<number>) => void',
          default: '-',
          description: 'Callback fired when row selection changes',
        },
        {
          name: 'perPageControl',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show the per-page control dropdown',
        },
        {
          name: 'rowHeight',
          type: 'number',
          default: '-',
          description:
            'Fixed row height in pixels for virtualization (use with expandable)',
        },
        {
          name: 'estimatedRowHeight',
          type: 'number',
          default: '-',
          description:
            'Estimated row height for dynamic virtualization when row heights vary',
        },
        {
          name: 'isLoadingMore',
          type: 'boolean',
          default: 'false',
          description:
            'Shows loading spinner at the bottom of the list when loading more data (infinite scroll)',
        },
        {
          name: 'onLoadMore',
          type: '(scrollProgress: number) => void',
          default: '-',
          description:
            'Callback fired when scrolling past 80% of the list. Requires virtualization (rowHeight or estimatedRowHeight) and expandable mode.',
        },
        {
          name: 'filterConfigs',
          type: 'FilterConfig<T>[]',
          default: '-',
          description:
            'Filter configurations for the built-in filter system. Each config specifies key, label, fieldType, dataType, and optional operators/options.',
        },
        {
          name: 'filterState',
          type: 'FilterState',
          default: '-',
          description: 'Controlled filter state (Map of key to ActiveFilter)',
        },
        {
          name: 'onFiltersChange',
          type: '(filters: FilterState) => void',
          default: '-',
          description:
            'Callback fired when filters change. The consumer is responsible for filtering or fetching data.',
        },
        {
          name: 'addFilterText',
          type: 'string',
          default: '"Add filter"',
          description: 'Text for the add filter link in the filter popover',
        },
        {
          name: 'resetText',
          type: 'string',
          default: '"Reset"',
          description: 'Text for the reset button in the filter popover',
        },
        {
          name: 'applyText',
          type: 'string',
          default: '"Filter"',
          description: 'Text for the apply/submit button in the filter popover',
        },
        {
          name: 'noFiltersText',
          type: 'string',
          default: '"No filters are being applied."',
          description: 'Text shown when no filters have been added yet',
        },
        {
          name: 'filters',
          type: 'JSX.Element',
          default: '-',
          description: 'Custom filter components (legacy, use filterConfigs instead)',
        },
        {
          name: 'activeFilterCount',
          type: 'number',
          default: '0',
          description: 'Number of active filters to display (for custom filters)',
        },
        {
          name: 'footer',
          type: 'boolean',
          default: 'true',
          description: 'Whether to show the footer with pagination controls',
        },
        {
          name: 'labels',
          type: 'Partial<DataTableLabels>',
          default: 'DEFAULT_DATA_TABLE_LABELS',
          description: 'Visible text labels for the data table',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<DataTableAriaLabels>',
          default: 'DEFAULT_DATA_TABLE_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'DataTableProvider',
          kind: 'component',
          description:
            'Context provider for shared DataTable configuration. Provides per-page options and optional state persistence via sessionStorage.',
          props: [
            {
              name: 'perPageOptions',
              type: 'number[]',
              default: '[10, 25, 50, 100]',
              description:
                'Per-page options available to all DataTable instances within this provider.',
            },
            {
              name: 'storageKey',
              type: 'string',
              default: '-',
              description:
                'Session storage key for persisting table state (scroll position, search, expanded, page, per-page, selected columns). Each table gets an auto-generated ID within this key.',
            },
          ],
        },
        {
          name: 'DataTableLabels',
          kind: 'type',
          description: 'Visible text labels for the data table.',
          props: [
            {
              name: 'searchPlaceholder',
              type: 'string',
              default: '"Search..."',
              description: 'Placeholder text for the search input.',
            },
            {
              name: 'filter',
              type: 'string',
              default: '"Filter"',
              description: 'Label for the filter button.',
            },
            {
              name: 'columns',
              type: 'string',
              default: '"Columns"',
              description: 'Label for the columns configuration button.',
            },
          ],
        },
        {
          name: 'DataTableAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers.',
          props: [
            {
              name: 'search',
              type: 'string',
              default: '"Search"',
              description: 'Aria label for the search input.',
            },
            {
              name: 'clearSearch',
              type: 'string',
              default: '"Clear search"',
              description: 'Aria label for the clear search button.',
            },
            {
              name: 'loadingData',
              type: 'string',
              default: '"Loading data"',
              description: 'Aria label for the loading state.',
            },
            {
              name: 'refreshingData',
              type: 'string',
              default: '"Refreshing data"',
              description: 'Aria label for the refreshing state.',
            },
          ],
        },
      ]}
      playground={`
import { DataTable, DataTableProvider, Select } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [page, setPage] = createSignal(1);

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', age: 32, department: 'Engineering', notes: 'Manages social media campaigns and brand partnerships.' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', age: 28, department: 'Marketing', notes: 'Team lead for the frontend platform.' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', age: 45, department: 'Sales', notes: 'On leave.' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'active', age: 35, department: 'Engineering', notes: 'Responsible for the component library documentation and code reviews.' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'pending', age: 29, department: 'Support', notes: 'Awaiting access approval.' },
    { id: 6, name: 'Diana Ross', email: 'diana@example.com', role: 'Admin', status: 'active', age: 41, department: 'HR', notes: 'Handles recruitment pipeline and employee relations.' },
    { id: 7, name: 'Edward Kim', email: 'edward@example.com', role: 'User', status: 'active', age: 26, department: 'Engineering', notes: 'Junior developer.' },
    { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'Editor', status: 'active', age: 38, department: 'Marketing', notes: 'Content strategist overseeing blog posts and whitepapers.' },
    { id: 9, name: 'George Chen', email: 'george@example.com', role: 'Admin', status: 'active', age: 50, department: 'Engineering', notes: 'VP of Engineering.' },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', role: 'User', status: 'inactive', age: 31, department: 'Sales', notes: 'Transferred to the London office.' },
    { id: 11, name: 'Ivan Petrov', email: 'ivan@example.com', role: 'User', status: 'active', age: 27, department: 'Support', notes: 'Tier 2 support specialist handling escalations.' },
    { id: 12, name: 'Julia Martinez', email: 'julia@example.com', role: 'Editor', status: 'pending', age: 33, department: 'HR', notes: 'New hire.' },
  ];

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Support', label: 'Support' },
  ];

  const columns = [
    { key: 'name', label: 'Name', width: 12, render: (value) => <span class="whitespace-nowrap">{String(value)}</span> },
    { key: 'email', label: 'Email', width: 18 },
    {
      key: 'status',
      label: 'Status',
      width: 10,
      tooltip: 'Current account status',
      render: (value) => (
        <span
          class={\`rounded-full px-2 py-0.5 text-xs font-medium \${
            value === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : value === 'inactive'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }\`}
        >
          {String(value)}
        </span>
      ),
    },
    { key: 'role', label: 'Role', width: 10 },
    { key: 'age', label: 'Age', width: 5 },
    {
      key: 'department',
      label: 'Department',
      width: 15,
      render: (value) => (
        <Select
          options={departmentOptions}
          value={String(value)}
          onSelect={() => {}}
          sizing="sm"
          fitContent
        />
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      width: 30,
      render: (value) => (
        <span class="block w-64 text-sm text-gray-600 dark:text-neutral-400">
          {String(value)}
        </span>
      ),
    },
  ];

  const filterConfigs = [
    { key: 'name', label: 'Name', fieldType: 'text', dataType: 'string' },
    {
      key: 'status',
      label: 'Status',
      fieldType: 'select',
      dataType: 'string',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
    },
    {
      key: 'role',
      label: 'Role',
      fieldType: 'multiSelect',
      dataType: 'string',
      operators: ['include', 'isEmpty', 'isNotEmpty'],
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Editor', label: 'Editor' },
        { value: 'User', label: 'User' },
      ],
    },
    { key: 'age', label: 'Age', fieldType: 'number', dataType: 'number' },
  ];

  return (
    <DataTableProvider perPageOptions={[5, 10, 25, 50]}>
      <DataTable
        data={users}
        columns={columns}
        searchBar
        rowSelection
        configureColumns
        defaultColumns={['name', 'email', 'status', 'role', 'department', 'notes']}
        expandable
        defaultRowsCount={4}
        estimatedRowHeight={56}
        filterConfigs={filterConfigs}
        onFiltersChange={(filters) => {
          console.log('Active filters:', [...filters.entries()].map(([k, f]) => \`\${k}: \${f.operator} \${f.value}\`));
        }}
        filterButtonText="Filter"
        addFilterText="Add filter"
        resetText="Reset"
        applyText="Apply"
        pageTotal={3}
        onPageChange={setPage}
        onSearchChange={(search) => console.log('search:', search)}
        onPerPageChange={(pp) => console.log('perPage:', pp)}
        onSelectionChange={(sel) => console.log('selection:', sel.size)}
        perPageControl
        footer
        loading={false}
        errorMessage="Failed to load data"
        noDataMessage="No users found"
        seeMoreText="See more"
        collapseText="See less"
        elementsPerPageText="per page"
        selectedElementsText={(count, total) => \`\${count} of \${total} selected\`}
      />
    </DataTableProvider>
  );
}
`}
      usage={`
        import { DataTable, type FilterConfig } from '@kayou/ui';

        // Basic usage
        <DataTable data={users} columns={columns} loading={isLoading()} errorMessage="Error" noDataMessage="No data" seeMoreText="See more"
              collapseText="See less" elementsPerPageText="per page" selectedElementsText={(c, t) => \`\${c}/\${t}\`} />

        // With filters and pagination
        <DataTable data={users} columns={columns} rowSelection searchBar filterConfigs={filterConfigs} pageTotal={10} onPageChange={setPage} ... />

        // With infinite scroll (requires expandable + virtualization)
        <DataTable data={users} columns={columns} expandable rowHeight={56} isLoadingMore={isLoadingMore()} onLoadMore={() => fetchNextPage()} ... />
      `}
      relatedHooks={[
        {
          name: 'useDataTableFilters',
          path: '/hooks/use-data-table-filters',
          description:
            'Hook for managing filter state and applying filters to data. Can be used standalone for custom filter UIs.',
        },
        {
          name: 'useVirtualList',
          path: '/hooks/use-virtual-list',
          description:
            'Fixed-height virtualization used when rowHeight is set with expandable mode.',
        },
        {
          name: 'useDynamicVirtualList',
          path: '/hooks/use-dynamic-virtual-list',
          description:
            'Dynamic-height virtualization used when estimatedRowHeight is set with expandable mode.',
        },
      ]}
    />
  );
}
