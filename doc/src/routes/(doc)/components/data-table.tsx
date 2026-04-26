import DocPage from '../../../components/DocPage';

export default function DataTablePage() {
  return (
    <DocPage
      title="DataTable"
      description="Table with virtualization, page-based or cursor-based pagination, row selection, sorting, and a comprehensive filter system."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes for table styling',
        },
      ]}
      keyConcepts={[
        {
          term: 'Pagination Modes',
          explanation:
            'The footer supports either page-based pagination or cursor-based pagination via the paginationType prop. The consumer controls the active page or cursor and handles data fetching.',
        },
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
        {
          term: 'Sorting',
          explanation:
            'Controlled multi-column sorting via sorts/onSortsChange. Click column headers to add them to the sort stack. Click again to cycle direction (asc → desc → remove). The consumer handles actual data sorting.',
        },
        {
          term: 'Row Identity',
          explanation:
            'Use rowKey to identify rows by a stable key (e.g. "id") instead of index. Selections persist across data changes when rowKey is set.',
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
            'Column configurations with key, label, width (percentage), optional render function, tooltip, and align (left|center|right)',
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
          name: 'rowKey',
          type: 'string | ((row: T) => string)',
          default: '-',
          description:
            'Key or accessor to uniquely identify rows. When set, selections persist across data changes. Falls back to index-based selection if not provided.',
        },
        {
          name: 'bulkActions',
          type: '(selectedKeys: Set<string>, clearSelection: () => void) => JSX.Element',
          default: '-',
          description:
            'Render prop for bulk action buttons shown in the selection bar when rows are selected. Receives the selected keys and a function to clear the selection.',
        },
        {
          name: 'onRowClick',
          type: '(row: T, index: number) => void',
          default: '-',
          description:
            'Callback fired when a data row is clicked. Does not fire when clicking checkboxes or expand buttons.',
        },
        {
          name: 'emptyState',
          type: 'JSX.Element',
          default: '-',
          description:
            'Custom JSX to show when data is empty. Falls back to the noData label text.',
        },
        {
          name: 'rowClass',
          type: 'string | ((row: T, index: number) => string)',
          default: '-',
          description:
            'Additional CSS class(es) for data rows. Can be a static string or a function that returns a class per row.',
        },
        {
          name: 'columnLocking',
          type: 'boolean',
          default: 'false',
          description:
            'Allow users to lock a column so it stays visible during horizontal scroll. A lock icon appears on hover in column headers. Only one column at a time.',
        },
        {
          name: 'columnResizing',
          type: 'boolean',
          default: 'false',
          description:
            'Enable column resizing by dragging the border between column headers.',
        },
        {
          name: 'rowLocking',
          type: 'boolean',
          default: 'false',
          description:
            'Allow users to lock a single row so it pins to the viewport edge when scrolled past. A lock icon appears on hover. Only works with virtualization.',
        },
        {
          name: 'expandRow',
          type: '(row: T) => JSX.Element',
          default: '-',
          description:
            'Render prop for per-row detail panels. Shows an expand/collapse button on each row. The panel animates open below the row.',
        },
        {
          name: 'rowContextMenu',
          type: '(row: T, index: number, closeMenu: () => void) => JSX.Element',
          default: '-',
          description:
            'Render prop for a right-click context menu on rows. Renders a popover at the click position.',
        },
        {
          name: 'searchBar',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show the search bar',
        },
        {
          name: 'searchDebounceMs',
          type: 'number',
          default: '300',
          description:
            'Debounce delay in ms for the onSearchChange callback. Set to 0 to disable debouncing.',
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
          name: 'sorts',
          type: 'SortEntry[]',
          default: '[]',
          description: 'Sort state (controlled). Each entry has a key and direction.',
        },
        {
          name: 'onSortsChange',
          type: '(sorts: SortEntry[]) => void',
          default: '-',
          description:
            'Callback when sort changes. Each click adds/cycles/removes a column in the sort stack.',
        },
        {
          name: 'sortableColumns',
          type: 'string[]',
          default: '-',
          description:
            'Which columns can be sorted. Defaults to all columns if onSortsChange is provided.',
        },
        {
          name: 'paginationType',
          type: '"cursor" | "page"',
          default: '"cursor"',
          description:
            'Pagination model used by the footer controls. When omitted, page mode is inferred if page props are provided.',
        },
        {
          name: 'currentPage',
          type: 'number',
          default: '-',
          description: 'Current page number for page-based pagination.',
        },
        {
          name: 'pageTotal',
          type: 'number',
          default: '-',
          description: 'Total number of pages for page-based pagination.',
        },
        {
          name: 'onPageChange',
          type: '(page: number) => void',
          default: '-',
          description:
            'Callback fired when page-based pagination changes to a different page.',
        },
        {
          name: 'prevCursor',
          type: 'DataTableCursor',
          default: '-',
          description:
            'Cursor for the previous page. Set to null when there is no previous page.',
        },
        {
          name: 'currentCursor',
          type: 'DataTableCursor',
          default: '-',
          description: 'Cursor for the current page.',
        },
        {
          name: 'nextCursor',
          type: 'DataTableCursor',
          default: '-',
          description:
            'Cursor for the next page. Set to null when there is no next page.',
        },
        {
          name: 'onCursorChange',
          type: '(cursor: DataTableCursor) => void',
          default: '-',
          description:
            'Callback fired when pagination moves to a different cursor. The consumer is responsible for fetching and swapping page data.',
        },
        {
          name: 'onSearchChange',
          type: '(search: string) => void',
          default: '-',
          description:
            'Callback fired when the search value changes (debounced by searchDebounceMs)',
        },
        {
          name: 'onPerPageChange',
          type: '(perPage: number) => void',
          default: '-',
          description: 'Callback fired when the per-page value changes',
        },
        {
          name: 'onSelectionChange',
          type: '(selectedKeys: Set<string>) => void',
          default: '-',
          description:
            'Callback fired when row selection changes. Emits a Set of row keys (strings).',
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
          name: 'footer',
          type: 'boolean',
          default: 'true',
          description: 'Whether to show the footer with cursor navigation controls',
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
        {
          name: 'id',
          type: 'string',
          default: '-',
          description:
            'Stable identifier for this table instance. Required for state persistence via DataTableProvider. Must be unique among tables within the same provider scope.',
        },
      ]}
      subComponents={[
        {
          name: 'DataTableProvider',
          kind: 'component',
          description:
            'Context provider for shared DataTable configuration. Provides per-page options, state persistence via sessionStorage, and saved config persistence via localStorage.',
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
                'Storage key for persisting table state (sessionStorage) and saved configurations (localStorage). Each table instance is automatically assigned a unique internal ID.',
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
            {
              name: 'sortAscending',
              type: 'string',
              default: '"Sort ascending"',
              description: 'Aria label for the sort ascending action.',
            },
            {
              name: 'sortDescending',
              type: 'string',
              default: '"Sort descending"',
              description: 'Tooltip and aria label for the sort descending action.',
            },
            {
              name: 'clearSort',
              type: 'string',
              default: '"Clear sort"',
              description:
                'Tooltip and aria label shown when clicking will clear the sort.',
            },
            {
              name: 'sortPriority',
              type: 'string',
              default: '"Sort priority"',
              description:
                'Aria label prefix for sort priority badges (e.g. "Sort priority 1").',
            },
            {
              name: 'addFilter',
              type: 'string',
              default: '"Add filter"',
              description: 'Text for the add filter link in the filter popover.',
            },
            {
              name: 'resetFilter',
              type: 'string',
              default: '"Reset"',
              description: 'Text for the reset button in the filter popover.',
            },
            {
              name: 'applyFilter',
              type: 'string',
              default: '"Apply"',
              description: 'Text for the apply/submit button in the filter popover.',
            },
            {
              name: 'noFilters',
              type: 'string',
              default: '"No filters are being applied."',
              description: 'Text shown when no filters have been added.',
            },
            {
              name: 'error',
              type: 'string',
              default: '"An error occurred"',
              description: 'Message displayed when the table is in an error state.',
            },
            {
              name: 'noData',
              type: 'string',
              default: '"No data available"',
              description: 'Message displayed when the data array is empty.',
            },
            {
              name: 'seeMore',
              type: 'string',
              default: '"See more"',
              description: 'Text for the expand button.',
            },
            {
              name: 'collapse',
              type: 'string',
              default: '"See less"',
              description: 'Text for the collapse button when expanded.',
            },
            {
              name: 'elementsPerPage',
              type: 'string',
              default: '"per page"',
              description: 'Text label for the per-page control.',
            },
            {
              name: 'previousPage',
              type: 'string',
              default: '"Previous"',
              description: 'Text label for the previous-page button.',
            },
            {
              name: 'nextPage',
              type: 'string',
              default: '"Next"',
              description: 'Text label for the next-page button.',
            },
            {
              name: 'selectedElements',
              type: '(count: number, total: number) => string',
              default: '(c, t) => `${c} of ${t} selected`',
              description: 'Function to format the selected elements count text.',
            },
            {
              name: 'saveConfiguration',
              type: 'string',
              default: '"Save configuration"',
              description: 'Text for the save configuration button.',
            },
            {
              name: 'configurations',
              type: 'string',
              default: '"Configurations"',
              description: 'Text for the configurations popover trigger button.',
            },
            {
              name: 'defaultConfiguration',
              type: 'string',
              default: '"Default"',
              description: 'Text for the default configuration option.',
            },
            {
              name: 'saveConfigTitle',
              type: 'string',
              default: '"Save configuration"',
              description: 'Title for the save configuration drawer.',
            },
            {
              name: 'editConfigTitle',
              type: 'string',
              default: '"Edit configuration"',
              description: 'Title for the edit configuration drawer.',
            },
            {
              name: 'configNameLabel',
              type: 'string',
              default: '"Configuration name"',
              description: 'Label for the configuration name text input.',
            },
            {
              name: 'configNamePlaceholder',
              type: 'string',
              default: '"Enter a name..."',
              description: 'Placeholder for the configuration name text input.',
            },
            {
              name: 'save',
              type: 'string',
              default: '"Save"',
              description: 'Text for the save/submit button in the drawer.',
            },
            {
              name: 'deleteConfiguration',
              type: 'string',
              default: '"Delete"',
              description: 'Text for the delete configuration button.',
            },
            {
              name: 'confirmDelete',
              type: 'string',
              default: '"Confirm deletion?"',
              description: 'Text for the delete confirmation prompt.',
            },
            {
              name: 'cancel',
              type: 'string',
              default: '"Cancel"',
              description: 'Text for the cancel button in the delete confirmation.',
            },
            {
              name: 'maxConfigsReached',
              type: 'string',
              default: '"Maximum of 3 configurations reached"',
              description:
                'Text shown when the maximum number of saved configurations is reached.',
            },
            {
              name: 'createNewConfiguration',
              type: 'string',
              default: '"Create new configuration"',
              description: 'Title for the create new option in the choose drawer.',
            },
            {
              name: 'createNewConfigurationDescription',
              type: 'string',
              default: '"Save current settings as a new configuration"',
              description: 'Description for the create new option in the choose drawer.',
            },
            {
              name: 'updateCurrentConfiguration',
              type: 'string',
              default: '"Update current configuration"',
              description: 'Title for the update current option in the choose drawer.',
            },
            {
              name: 'updateCurrentConfigurationDescription',
              type: 'string',
              default: '"Overwrite the active configuration with current settings"',
              description:
                'Description for the update current option in the choose drawer.',
            },
            {
              name: 'back',
              type: 'string',
              default: '"Back"',
              description:
                'Text for the back button when navigating from create form to choose screen.',
            },
            {
              name: 'expandRow',
              type: 'string',
              default: '"Expand row"',
              description: 'Aria label for the expand row button.',
            },
            {
              name: 'collapseRow',
              type: 'string',
              default: '"Collapse row"',
              description: 'Aria label for the collapse row button.',
            },
            {
              name: 'lockColumn',
              type: 'string',
              default: '"Lock column"',
              description: 'Tooltip and aria label for the lock column button.',
            },
            {
              name: 'unlockColumn',
              type: 'string',
              default: '"Unlock column"',
              description: 'Tooltip and aria label for the unlock column button.',
            },
            {
              name: 'configPopoverContentTitle',
              type: 'string',
              default: '"Saved configurations"',
              description: 'Title for the saved configurations popover.',
            },
            {
              name: 'saveAsNew',
              type: 'string',
              default: '"Save as new"',
              description: 'Text for the "Save as new" button in the config drawer.',
            },
            {
              name: 'configDeleted',
              type: 'string',
              default: '"Configuration deleted"',
              description: 'Text shown in the toast when a configuration is deleted.',
            },
            {
              name: 'undo',
              type: 'string',
              default: '"Undo"',
              description: 'Text for the undo action in the deletion toast.',
            },
            {
              name: 'resizeColumn',
              type: 'string',
              default: '"Resize column"',
              description: 'Tooltip for the column resize handle.',
            },
            {
              name: 'resetColumnSize',
              type: 'string',
              default: '"Double-click to reset"',
              description:
                'Tooltip shown on the resize handle for resetting column size.',
            },
            {
              name: 'lockRow',
              type: 'string',
              default: '"Lock row"',
              description: 'Tooltip and aria label for the lock row button.',
            },
            {
              name: 'unlockRow',
              type: 'string',
              default: '"Unlock row"',
              description: 'Tooltip and aria label for the unlock row button.',
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
            {
              name: 'goToPreviousPage',
              type: 'string',
              default: '"Go to previous page"',
              description: 'Aria label for the previous-page button.',
            },
            {
              name: 'goToNextPage',
              type: 'string',
              default: '"Go to next page"',
              description: 'Aria label for the next-page button.',
            },
          ],
        },
      ]}
      playground={`
import { Button, DataTable, DataTableProvider, Select, DatePickerProvider } from '@kayou/ui';
import { createMemo, createSignal } from 'solid-js';

export default function Example() {
  const [currentCursor, setCurrentCursor] = createSignal('cursor-1');
  const [perPage, setPerPage] = createSignal(20);
  const [sorts, setSorts] = createSignal([]);

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', age: 32, department: 'Engineering', joinedAt: '2022-03-15', notes: 'Manages social media campaigns and brand partnerships.', contractPeriod: ['2022-03-15', '2024-03-14'], isActiveContract: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', age: 28, department: 'Marketing', joinedAt: '2023-01-10', notes: 'Team lead for the frontend platform.', contractPeriod: ['2023-01-10', '2024-01-09'], isActiveContract: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', age: 45, department: 'Sales', joinedAt: '2021-06-22', notes: 'On leave.', contractPeriod: ['2021-06-22', '2023-06-21'], isActiveContract: false },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'active', age: 35, department: 'Engineering', joinedAt: '2022-09-01', notes: 'Responsible for the component library documentation and code reviews.', contractPeriod: ['2022-09-01', '2024-08-31'], isActiveContract: true },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'pending', age: 29, department: 'Support', joinedAt: '2024-11-05', notes: 'Awaiting access approval.', contractPeriod: ['2024-11-05', '2025-11-04'], isActiveContract: false },
    { id: 6, name: 'Diana Ross', email: 'diana@example.com', role: 'Admin', status: 'active', age: 41, department: 'HR', joinedAt: '2020-04-18', notes: 'Handles recruitment pipeline and employee relations.', contractPeriod: ['2020-04-18', '2023-04-17'], isActiveContract: false },
    { id: 7, name: 'Edward Kim', email: 'edward@example.com', role: 'User', status: 'active', age: 26, department: 'Engineering', joinedAt: '2024-02-14', notes: 'Junior developer.', contractPeriod: ['2024-02-14', '2025-02-13'], isActiveContract: true },
    { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'Editor', status: 'active', age: 38, department: 'Marketing', joinedAt: '2021-11-30', notes: 'Content strategist overseeing blog posts and whitepapers.', contractPeriod: ['2021-11-30', '2023-11-29'], isActiveContract: false },
    { id: 9, name: 'George Chen', email: 'george@example.com', role: 'Admin', status: 'active', age: 50, department: 'Engineering', joinedAt: '2019-08-12', notes: 'VP of Engineering.', contractPeriod: ['2019-08-12', '2022-08-11'], isActiveContract: false },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', role: 'User', status: 'inactive', age: 31, department: 'Sales', joinedAt: '2022-05-20', notes: 'Transferred to the London office.', contractPeriod: ['2022-05-20', '2024-05-19'], isActiveContract: true },
    { id: 11, name: 'Ivan Petrov', email: 'ivan@example.com', role: 'User', status: 'active', age: 27, department: 'Support', joinedAt: '2023-07-03', notes: 'Tier 2 support specialist handling escalations.', contractPeriod: ['2023-07-03', '2024-07-02'], isActiveContract: true },
    { id: 12, name: 'Julia Martinez', email: 'julia@example.com', role: 'Editor', status: 'pending', age: 33, department: 'HR', joinedAt: '2025-01-08', notes: 'New hire.', contractPeriod: ['2025-01-08', '2026-01-07'], isActiveContract: false },
    { id: 13, name: 'Kevin O\\'Brien', email: 'kevin@example.com', role: 'User', status: 'active', age: 36, department: 'Engineering', joinedAt: '2021-10-25', notes: 'Backend services and API design.', contractPeriod: ['2021-10-25', '2023-10-24'], isActiveContract: false },
    { id: 14, name: 'Laura Nguyen', email: 'laura@example.com', role: 'Admin', status: 'active', age: 44, department: 'Engineering', joinedAt: '2020-01-06', notes: 'Infrastructure and DevOps lead.', contractPeriod: ['2020-01-06', '2023-01-05'], isActiveContract: false },
    { id: 15, name: 'Marcus Taylor', email: 'marcus@example.com', role: 'User', status: 'active', age: 23, department: 'Support', joinedAt: '2024-06-17', notes: 'Tier 1 support, night shift.', contractPeriod: ['2024-06-17', '2025-06-16'], isActiveContract: true },
    { id: 16, name: 'Nina Patel', email: 'nina@example.com', role: 'Editor', status: 'active', age: 30, department: 'Marketing', joinedAt: '2023-03-28', notes: 'Manages email campaigns and newsletters.', contractPeriod: ['2023-03-28', '2024-03-27'], isActiveContract: true },
    { id: 17, name: 'Oscar Fernandez', email: 'oscar@example.com', role: 'User', status: 'inactive', age: 52, department: 'Sales', joinedAt: '2018-12-01', notes: 'Retired from active sales, advisory role.', contractPeriod: ['2018-12-01', '2021-11-30'], isActiveContract: false },
    { id: 18, name: 'Patricia Wong', email: 'patricia@example.com', role: 'Admin', status: 'active', age: 39, department: 'HR', joinedAt: '2021-02-14', notes: 'Compensation and benefits specialist.', contractPeriod: ['2021-02-14', '2023-02-13'], isActiveContract: false },
    { id: 19, name: 'Quentin Blake', email: 'quentin@example.com', role: 'User', status: 'pending', age: 25, department: 'Engineering', joinedAt: '2025-02-01', notes: 'Intern converting to full-time.', contractPeriod: ['2025-02-01', '2026-01-31'], isActiveContract: false },
    { id: 20, name: 'Rachel Adams', email: 'rachel@example.com', role: 'Editor', status: 'active', age: 34, department: 'Marketing', joinedAt: '2022-08-09', notes: 'SEO and analytics lead.', contractPeriod: ['2022-08-09', '2024-08-08'], isActiveContract: true },
    { id: 21, name: 'Samuel Green', email: 'samuel@example.com', role: 'User', status: 'active', age: 29, department: 'Engineering', joinedAt: '2023-05-15', notes: 'Mobile development specialist.', contractPeriod: ['2023-05-15', '2024-05-14'], isActiveContract: true },
    { id: 22, name: 'Tara Singh', email: 'tara@example.com', role: 'Admin', status: 'active', age: 47, department: 'Engineering', joinedAt: '2019-11-20', notes: 'Security and compliance officer.', contractPeriod: ['2019-11-20', '2022-11-19'], isActiveContract: false },
    { id: 23, name: 'Ulrich Braun', email: 'ulrich@example.com', role: 'User', status: 'active', age: 33, department: 'Sales', joinedAt: '2022-07-11', notes: 'EMEA regional account manager.', contractPeriod: ['2022-07-11', '2023-07-10'], isActiveContract: false },
    { id: 24, name: 'Valentina Rossi', email: 'valentina@example.com', role: 'Editor', status: 'active', age: 28, department: 'Marketing', joinedAt: '2024-01-22', notes: 'Social media and community management.', contractPeriod: ['2024-01-22', '2025-01-21'], isActiveContract: true },
    { id: 25, name: 'William Harris', email: 'william@example.com', role: 'User', status: 'inactive', age: 55, department: 'HR', joinedAt: '2017-09-05', notes: 'On sabbatical.', contractPeriod: ['2017-09-05', '2022-09-04'], isActiveContract: false },
    { id: 26, name: 'Xena Cooper', email: 'xena@example.com', role: 'User', status: 'active', age: 31, department: 'Support', joinedAt: '2023-10-30', notes: 'Customer success manager for enterprise clients.', contractPeriod: ['2023-10-30', '2024-10-29'], isActiveContract: true },
    { id: 27, name: 'Yusuf Ahmed', email: 'yusuf@example.com', role: 'Admin', status: 'active', age: 42, department: 'Engineering', joinedAt: '2020-06-14', notes: 'Data platform and analytics infrastructure.', contractPeriod: ['2020-06-14', '2023-06-13'], isActiveContract: false },
    { id: 28, name: 'Zoe Mitchell', email: 'zoe@example.com', role: 'Editor', status: 'pending', age: 26, department: 'Marketing', joinedAt: '2025-03-01', notes: 'Joining the design content team.', contractPeriod: ['2025-03-01', '2026-02-28'], isActiveContract: false },
    { id: 29, name: 'Aaron Phillips', email: 'aaron@example.com', role: 'User', status: 'active', age: 37, department: 'Engineering', joinedAt: '2021-04-07', notes: 'QA automation and testing frameworks.', contractPeriod: ['2021-04-07', '2023-04-06'], isActiveContract: false },
    { id: 30, name: 'Bianca Torres', email: 'bianca@example.com', role: 'User', status: 'active', age: 24, department: 'Support', joinedAt: '2024-08-19', notes: 'Bilingual support agent, English and Spanish.', contractPeriod: ['2024-08-19', '2025-08-18'], isActiveContract: true },
    { id: 31, name: 'Carlos Rivera', email: 'carlos@example.com', role: 'Admin', status: 'active', age: 46, department: 'Sales', joinedAt: '2019-03-25', notes: 'Head of sales, North America.', contractPeriod: ['2019-03-25', '2022-03-24'], isActiveContract: false },
    { id: 32, name: 'Daphne Laurent', email: 'daphne@example.com', role: 'Editor', status: 'active', age: 32, department: 'HR', joinedAt: '2022-12-10', notes: 'Training and onboarding programs.', contractPeriod: ['2022-12-10', '2023-12-09'], isActiveContract: false },
    { id: 33, name: 'Ethan Park', email: 'ethan@example.com', role: 'User', status: 'active', age: 27, department: 'Engineering', joinedAt: '2023-09-16', notes: 'Frontend performance optimization.', contractPeriod: ['2023-09-16', '2024-09-15'], isActiveContract: true },
    { id: 34, name: 'Freya Johansson', email: 'freya@example.com', role: 'User', status: 'inactive', age: 40, department: 'Marketing', joinedAt: '2020-10-02', notes: 'Moved to partner relations team.', contractPeriod: ['2020-10-02', '2022-10-01'], isActiveContract: false },
    { id: 35, name: 'Gabriel Santos', email: 'gabriel@example.com', role: 'Admin', status: 'active', age: 38, department: 'Engineering', joinedAt: '2021-08-23', notes: 'Cloud architecture and cost optimization.', contractPeriod: ['2021-08-23', '2023-08-22'], isActiveContract: false },
    { id: 36, name: 'Hana Yamamoto', email: 'hana@example.com', role: 'Editor', status: 'active', age: 29, department: 'Marketing', joinedAt: '2023-02-05', notes: 'Product marketing and launch coordination.', contractPeriod: ['2023-02-05', '2024-02-04'], isActiveContract: true },
    { id: 37, name: 'Isaac Cohen', email: 'isaac@example.com', role: 'User', status: 'pending', age: 22, department: 'Support', joinedAt: '2025-04-01', notes: 'New graduate, starting next month.', contractPeriod: ['2025-04-01', '2026-03-31'], isActiveContract: false },
    { id: 38, name: 'Jasmine Ali', email: 'jasmine@example.com', role: 'User', status: 'active', age: 35, department: 'Engineering', joinedAt: '2022-01-18', notes: 'Machine learning and recommendation systems.', contractPeriod: ['2022-01-18', '2024-01-17'], isActiveContract: true },
    { id: 39, name: 'Kyle Morgan', email: 'kyle@example.com', role: 'Editor', status: 'active', age: 43, department: 'Sales', joinedAt: '2020-07-29', notes: 'Sales enablement content and demo scripts.', contractPeriod: ['2020-07-29', '2022-07-28'], isActiveContract: false },
    { id: 40, name: 'Lily Zhang', email: 'lily@example.com', role: 'Admin', status: 'active', age: 36, department: 'HR', joinedAt: '2021-05-11', notes: 'Diversity and inclusion initiatives.', contractPeriod: ['2021-05-11', '2023-05-10'], isActiveContract: false },
    { id: 41, name: 'Mason Reed', email: 'mason@example.com', role: 'User', status: 'active', age: 30, department: 'Engineering', joinedAt: '2023-06-20', notes: 'Database administration and query optimization.', contractPeriod: ['2023-06-20', '2024-06-19'], isActiveContract: true },
    { id: 42, name: 'Nora Eriksson', email: 'nora@example.com', role: 'User', status: 'active', age: 28, department: 'Marketing', joinedAt: '2024-04-08', notes: 'Event planning and conference logistics.', contractPeriod: ['2024-04-08', '2025-04-07'], isActiveContract: true },
    { id: 43, name: 'Oliver Grant', email: 'oliver@example.com', role: 'Editor', status: 'inactive', age: 48, department: 'Engineering', joinedAt: '2018-06-15', notes: 'Transitioned to external consulting.', contractPeriod: ['2018-06-15', '2021-06-14'], isActiveContract: false },
    { id: 44, name: 'Priya Sharma', email: 'priya@example.com', role: 'Admin', status: 'active', age: 34, department: 'Support', joinedAt: '2021-12-03', notes: 'Head of customer support operations.', contractPeriod: ['2021-12-03', '2023-12-02'], isActiveContract: false },
    { id: 45, name: 'Ryan O\\'Connor', email: 'ryan@example.com', role: 'User', status: 'active', age: 26, department: 'Engineering', joinedAt: '2024-03-12', notes: 'CI/CD pipelines and build tooling.', contractPeriod: ['2024-03-12', '2025-03-11'], isActiveContract: true },
    { id: 46, name: 'Sofia Morales', email: 'sofia@example.com', role: 'Editor', status: 'active', age: 31, department: 'Marketing', joinedAt: '2022-11-07', notes: 'Video production and creative direction.', contractPeriod: ['2022-11-07', '2023-11-06'], isActiveContract: false },
    { id: 47, name: 'Thomas Weber', email: 'thomas@example.com', role: 'User', status: 'pending', age: 39, department: 'Sales', joinedAt: '2025-01-20', notes: 'Pending background check completion.', contractPeriod: ['2025-01-20', '2026-01-19'], isActiveContract: false },
    { id: 48, name: 'Uma Krishnan', email: 'uma@example.com', role: 'User', status: 'active', age: 33, department: 'Engineering', joinedAt: '2022-06-28', notes: 'Accessibility and internationalization specialist.', contractPeriod: ['2022-06-28', '2024-06-27'], isActiveContract: true },
    { id: 49, name: 'Victor Dumont', email: 'victor@example.com', role: 'Admin', status: 'active', age: 51, department: 'HR', joinedAt: '2019-05-09', notes: 'Legal compliance and policy oversight.', contractPeriod: ['2019-05-09', '2022-05-08'], isActiveContract: false },
    { id: 50, name: 'Wendy Chu', email: 'wendy@example.com', role: 'Editor', status: 'active', age: 27, department: 'Engineering', joinedAt: '2024-09-23', notes: 'Technical writing and API documentation.', contractPeriod: ['2024-09-23', '2025-09-22'], isActiveContract: true },
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
      align: 'center',
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
    { key: 'age', label: 'Age', width: 8, align: 'right' },
    { key: 'joinedAt', label: 'Joined', width: 10 },
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
        <span class="block w-64 text-sm text-neutral-600 dark:text-neutral-400">
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
      operators: ['include', 'isNull', 'isNotNull', 'in'],
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Editor', label: 'Editor' },
        { value: 'User', label: 'User' },
      ],
    },
    { key: 'age', label: 'Age', fieldType: 'number', dataType: 'number' },
    { key: 'joinedAt', label: 'Joined', fieldType: 'datepicker', dataType: 'date', dateConfig: { locale: 'en-US' } },
    { key: 'contractPeriod', label: 'Contract Period', dataType: 'array', fieldType: 'datepicker', dateConfig: { locale: 'en-US' } },
    { key: 'isActiveContract', label: 'Contract active', dataType: 'boolean', fieldType: 'select', options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ], dateConfig: { locale: 'en-US' } },
  ]

  const pageIndex = createMemo(() => {
    const cursor = currentCursor();
    const match = /^cursor-(\\d+)$/.exec(cursor);
    return Math.max(0, Number(match?.[1] ?? 1) - 1);
  });

  const totalPages = createMemo(() => Math.ceil(users.length / perPage()));

  const visibleUsers = createMemo(() => {
    const start = pageIndex() * perPage();
    return users.slice(start, start + perPage());
  });

  const prevCursor = createMemo(() =>
    pageIndex() <= 0 ? null : \`cursor-\${pageIndex()}\`,
  );

  const nextCursor = createMemo(() =>
    pageIndex() + 1 >= totalPages() ? null : \`cursor-\${pageIndex() + 2}\`,
  );

  return (
  <DatePickerProvider locale="en-US">
      <DataTableProvider storageKey="users" perPageOptions={[5, 10, 20, 25, 50]}>
        <div class="mb-3 text-sm text-neutral-600 dark:text-neutral-400" data-cursor-state>
          Showing page {pageIndex() + 1} of {totalPages()} with cursor {currentCursor()}
        </div>
        <DataTable
          id="playground"
          paginationType="cursor"
          data={visibleUsers()}
          columns={columns}
          rowKey="id"
          searchBar
          rowSelection
          bulkActions={(selectedKeys, clearSelection) => (
            <>
              <Button size="xs" color="danger" onClick={() => { console.log('Delete:', [...selectedKeys]); clearSelection(); }}>
                Delete
              </Button>
              <Button size="xs" color="theme" onClick={() => console.log('Export:', [...selectedKeys])}>
                Export
              </Button>
            </>
          )}
          configureColumns
          defaultColumns={['name', 'email', 'status', 'role', 'age', 'department', 'notes']}
          expandable
          defaultRowsCount={4}
          estimatedRowHeight={56}
          sorts={sorts()}
          onSortsChange={setSorts}
          sortableColumns={['name', 'age', 'status']}
          filterConfigs={filterConfigs}
          onFiltersChange={(filters) => {
            console.log('Active filters:', [...filters.entries()].map(([k, f]) => \`\${k}: \${f.operator} \${f.value}\`));
          }}
          prevCursor={prevCursor()}
          currentCursor={currentCursor()}
          nextCursor={nextCursor()}
          onCursorChange={setCurrentCursor}
          onSearchChange={(search) => console.log('search:', search)}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setCurrentCursor('cursor-1');
            console.log('perPage:', pp);
          }}
          onSelectionChange={(sel) => console.log('selection:', [...sel])}
          perPageControl
          footer
          loading={false}
          onRowClick={(row, index) => console.log('Row clicked:', row.name, index)}
          columnLocking
          columnResizing
          rowLocking
          expandRow={(row) => (
            <div class="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
              <p><strong>Notes:</strong> {String(row.notes)}</p>
              <p class="mt-1"><strong>Department:</strong> {String(row.department)}</p>
            </div>
          )}
          rowContextMenu={(row, _index, closeMenu) => (
            <div class="py-1">
              <button class="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => { console.log('View', row.name); closeMenu(); }}>
                View profile
              </button>
              <button class="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => { console.log('Edit', row.name); closeMenu(); }}>
                Edit
              </button>
              <button class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100 dark:text-red-400 dark:hover:bg-neutral-800" onClick={() => { console.log('Delete', row.name); closeMenu(); }}>
                Delete
              </button>
            </div>
          )}
          labels={{
            error: 'Failed to load data',
            noData: 'No users found',
            seeMore: 'See more',
            collapse: 'See less',
            elementsPerPage: 'per page',
            previousPage: 'Previous',
            nextPage: 'Next',
            selectedElements: (count, total) => \`\${count} of \${total} selected\`,
          }}
        />
      </DataTableProvider>
    </DatePickerProvider>
  );
}
`}
      usage={`
        import { DataTable, type DataTableCursor, type FilterConfig } from '@kayou/ui';

        // Basic usage (all text is configurable via labels)
        <DataTable data={users} columns={columns} loading={isLoading()} labels={{ error: 'Error', noData: 'No data' }} />

        // With sorting (click columns to add to sort stack)
        <DataTable data={users} columns={columns} sorts={sorts()} onSortsChange={setSorts} sortableColumns={['name', 'age']} ... />

        // With row identity (selections persist across data changes)
        <DataTable data={users} columns={columns} rowKey="id" rowSelection onSelectionChange={(keys) => console.log(keys)} ... />

        // With filters and cursor-based pagination
        <DataTable
          data={users}
          columns={columns}
          paginationType="cursor"
          rowSelection
          searchBar
          filterConfigs={filterConfigs}
          prevCursor={prevCursor()}
          currentCursor={currentCursor()}
          nextCursor={nextCursor()}
          onCursorChange={(cursor: DataTableCursor) => setCurrentCursor(cursor)}
          ...
        />

        // With page-based pagination
        <DataTable
          data={users}
          columns={columns}
          paginationType="page"
          currentPage={page()}
          pageTotal={10}
          onPageChange={setPage}
          ...
        />

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
