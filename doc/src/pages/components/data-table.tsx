import { createSignal } from 'solid-js';

import { DataTable, type FilterConfig } from '@exowpee/solidly-pro';

import DocPage from '../../components/DocPage';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  age: number;
  department: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    age: 32,
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    age: 28,
    department: 'Marketing',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'inactive',
    age: 45,
    department: 'Sales',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'active',
    age: 35,
    department: 'Engineering',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'pending',
    age: 29,
    department: 'Support',
  },
  {
    id: 6,
    name: 'Diana Ross',
    email: 'diana@example.com',
    role: 'Admin',
    status: 'active',
    age: 41,
    department: 'HR',
  },
];

const columns = [
  { key: 'name', label: 'Name', width: 25 },
  { key: 'email', label: 'Email', width: 30 },
  { key: 'role', label: 'Role', width: 15 },
  { key: 'status', label: 'Status', width: 15 },
  { key: 'department', label: 'Department', width: 15 },
];

const filterConfigs: FilterConfig<User>[] = [
  {
    key: 'name',
    label: 'Name',
    fieldType: 'text',
    dataType: 'string',
  },
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
    dataType: 'array',
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'Editor', label: 'Editor' },
      { value: 'User', label: 'User' },
    ],
  },
  {
    key: 'age',
    label: 'Age',
    fieldType: 'number',
    dataType: 'number',
  },
];

export default function DataTablePage() {
  const [, setPage] = createSignal(1);

  return (
    <DocPage
      title="DataTable"
      description="Table with virtualization, pagination, row selection, and a comprehensive filter system."
      keyConcepts={[
        {
          term: 'Virtualization',
          explanation:
            'For large datasets, the table can render only visible rows using either fixed-height (VirtualList) or dynamic-height (DynamicVirtualList) virtualization. Set rowHeight for fixed or estimatedRowHeight for dynamic.',
        },
        {
          term: 'Filter System',
          explanation:
            'Built-in filter system with filterConfigs prop. Supports operators like equal, contains, include, greaterThan, lessThan, gte, lte, between, isEmpty, isNotEmpty. Field types include text, number, select, selectSearch, multiSelect, datepicker, dateRange.',
        },
        {
          term: 'Filter Modes',
          explanation:
            'Internal mode applies filters client-side. External mode (filterMode="external") only tracks filter state for server-side filtering via onFiltersChange callback.',
        },
        {
          term: 'Popover Filter UI',
          explanation:
            'The filter system uses a popover-based UI. Click the "Filter" button to open a popover where you can add filters with Column/Operator/Value dropdowns. Filters are only applied when you click the "Filter" submit button.',
        },
        {
          term: 'CSS Grid Layout',
          explanation:
            'Uses div-based CSS Grid instead of HTML tables for maximum flexibility. This allows virtualization to work correctly and supports complex interactive content within cells.',
        },
        {
          term: 'Expandable View',
          explanation:
            'When expandable is true and data exceeds defaultRowsCount, shows a "see more" button that opens a full-screen modal with the complete virtualized table.',
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
            'Whether the table can expand to full-view mode when data exceeds defaultRowsCount',
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
          description: 'Callback when filters change (for controlled mode)',
        },
        {
          name: 'filterMode',
          type: '"internal" | "external"',
          default: '"internal"',
          description:
            'Internal applies filters client-side. External only tracks state for server-side filtering.',
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
      ]}
      examples={[
        {
          title: 'Basic Table',
          description: 'Simple table with data and columns.',
          code: `const columns = [
  { key: 'name', label: 'Name', width: 25 },
  { key: 'email', label: 'Email', width: 30 },
  { key: 'role', label: 'Role', width: 15 },
  { key: 'status', label: 'Status', width: 15 },
  { key: 'department', label: 'Department', width: 15 },
];

<DataTable
  data={users}
  columns={columns}
  loading={false}
  error={null}
  errorMessage="Failed to load data"
  noDataMessage="No users found"
  seeMoreText="See more"
    elementsPerPageText="per page"
  selectedElementsText={(count, total) => \`\${count} of \${total} selected\`}
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'With Row Selection',
          description: 'Table with selectable rows.',
          code: `<DataTable
  data={users}
  columns={columns}
  rowSelection
  loading={false}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              rowSelection
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'With Search Bar',
          description: 'Table with a search input.',
          code: `<DataTable
  data={users}
  columns={columns}
  searchBar
  loading={false}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              searchBar
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'With Filter System',
          description:
            'Table with built-in filter system supporting text, select, multiSelect, and number filters.',
          code: `const filterConfigs: FilterConfig<User>[] = [
  {
    key: 'name',
    label: 'Name',
    fieldType: 'text',
    dataType: 'string',
  },
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
    dataType: 'array',
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'Editor', label: 'Editor' },
      { value: 'User', label: 'User' },
    ],
  },
  {
    key: 'age',
    label: 'Age',
    fieldType: 'number',
    dataType: 'number',
  },
];

<DataTable
  data={users}
  columns={columns}
  filterConfigs={filterConfigs}
  loading={false}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              filterConfigs={filterConfigs}
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
              filterButtonText="Filter"
              addFilterText="Add filter"
              resetText="Reset"
              applyText="Apply"
            />
          ),
        },
        {
          title: 'With Pagination',
          description: 'Table with pagination controls.',
          code: `const [page, setPage] = createSignal(1);

<DataTable
  data={users}
  columns={columns}
  pageTotal={5}
  onPageChange={setPage}
  perPageControl
  footer
  loading={false}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              pageTotal={5}
              onPageChange={setPage}
              perPageControl
              footer
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'Loading State',
          description: 'Table in loading state with skeleton.',
          code: `<DataTable
  data={[]}
  columns={columns}
  loading={true}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={[]}
              columns={columns}
              loading={true}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'Error State',
          description: 'Table in error state.',
          code: `<DataTable
  data={[]}
  columns={columns}
  loading={false}
  error={new Error('Network error')}
  errorMessage="Failed to load users. Please try again."
  ...
/>`,
          component: () => (
            <DataTable
              data={[]}
              columns={columns}
              loading={false}
              error={new Error('Network error')}
              errorMessage="Failed to load users. Please try again."
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'Expandable Table',
          description:
            'Table that shows limited rows with a "see more" button to expand to full view.',
          code: `<DataTable
  data={users}
  columns={columns}
  expandable
  defaultRowsCount={3}
  rowHeight={56}
  loading={false}
  error={null}
  ...
/>`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={columns}
              expandable
              defaultRowsCount={3}
              rowHeight={56}
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
        {
          title: 'Custom Cell Rendering',
          description: 'Table with custom render functions for cells.',
          code: `const columnsWithRender = [
  { key: 'name', label: 'Name', width: 25 },
  { key: 'email', label: 'Email', width: 30 },
  {
    key: 'status',
    label: 'Status',
    width: 20,
    render: (value) => (
      <span class={\`px-2 py-1 rounded text-xs font-medium \${
        value === 'active'
          ? 'bg-green-100 text-green-800'
          : value === 'inactive'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
      }\`}>
        {value}
      </span>
    ),
  },
];

<DataTable data={users} columns={columnsWithRender} ... />`,
          component: () => (
            <DataTable
              data={sampleUsers}
              columns={[
                { key: 'name', label: 'Name', width: 25 },
                { key: 'email', label: 'Email', width: 30 },
                {
                  key: 'status',
                  label: 'Status',
                  width: 20,
                  render: (value) => (
                    <span
                      class={`rounded px-2 py-1 text-xs font-medium ${
                        value === 'active'
                          ? 'bg-green-100 text-green-800'
                          : value === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {String(value)}
                    </span>
                  ),
                },
                { key: 'role', label: 'Role', width: 15 },
                { key: 'department', label: 'Department', width: 10 },
              ]}
              loading={false}
              error={null}
              errorMessage="Failed to load data"
              noDataMessage="No users found"
              seeMoreText="See more"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
            />
          ),
        },
      ]}
      usage={`import { DataTable } from '@exowpee/solidly;
import type { FilterConfig } from '@exowpee/solidly;

// Basic usage
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', width: 30 },
    { key: 'email', label: 'Email', width: 40 },
    { key: 'status', label: 'Status', width: 30 },
  ]}
  loading={isLoading()}
  error={error()}
  errorMessage="Failed to load data"
  noDataMessage="No data available"
  seeMoreText="See more"
    elementsPerPageText="per page"
  selectedElementsText={(count, total) => \`\${count} of \${total} selected\`}
/>

// With all features
<DataTable
  data={users}
  columns={columns}
  loading={isLoading()}
  validating={isValidating()}
  error={error()}
  errorMessage="Failed to load data"
  noDataMessage="No data available"
  seeMoreText="See more"
    elementsPerPageText="per page"
  selectedElementsText={(count, total) => \`\${count} of \${total} selected\`}
  rowSelection
  searchBar
  configureColumns
  expandable
  defaultRowsCount={5}
  rowHeight={56}
  pageTotal={totalPages()}
  onPageChange={handlePageChange}
  perPageControl
/>

// With filter system (popover-based UI)
// Click "Filter" button to open popover with Column/Operator/Value inputs
// Filters are only applied when clicking the submit button
const filterConfigs: FilterConfig<User>[] = [
  {
    key: 'name',
    label: 'Name',
    fieldType: 'text',
    dataType: 'string',
    operators: ['contains', 'equal'],
    defaultOperator: 'contains',
  },
  {
    key: 'status',
    label: 'Status',
    fieldType: 'select',
    dataType: 'string',
    options: statusOptions,
  },
  {
    key: 'createdAt',
    label: 'Created',
    fieldType: 'dateRange',
    dataType: 'date',
  },
];

<DataTable
  data={users}
  columns={columns}
  filterConfigs={filterConfigs}
  filterMode="internal"  // or "external" for server-side
  filterButtonText="Filter"
  addFilterText="Add filter"
  resetText="Reset"
  applyText="Apply"
  ...
/>

// Server-side filtering (controlled)
const [filters, setFilters] = createSignal<FilterState>(new Map());

createEffect(() => {
  // Fetch data based on filter state
  fetchUsers({ filters: filters() });
});

<DataTable
  data={users}
  columns={columns}
  filterConfigs={filterConfigs}
  filterState={filters()}
  onFiltersChange={setFilters}
  filterMode="external"
  ...
/>`}
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
