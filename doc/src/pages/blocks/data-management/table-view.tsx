import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Badge, Button, Popover } from '@exowpee/solidly';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  Download01Icon,
  Edit01Icon,
  FilterLinesIcon,
  Mail01Icon,
  DotsHorizontalIcon,
  PlusIcon,
  RefreshCw01Icon,
  SearchMdIcon,
  Trash01Icon,
  User01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import { DataTable, type FilterConfig } from '@exowpee/solidly-pro';
import BlocksDocPage from '../../../components/BlocksDocPage';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager';
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  joined: string;
  department: string;
  lastActive: string;
  avatar?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
}

const allUsers: User[] = [
  { id: 1, name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Admin', status: 'Active', joined: 'Jan 12, 2024', department: 'Engineering', lastActive: '2 hours ago', plan: 'Enterprise' },
  { id: 2, name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Manager', status: 'Active', joined: 'Feb 3, 2024', department: 'Marketing', lastActive: '5 min ago', plan: 'Pro' },
  { id: 3, name: 'Isabella Nguyen', email: 'isabella.n@email.com', role: 'Editor', status: 'Pending', joined: 'Mar 15, 2024', department: 'Design', lastActive: '1 day ago', plan: 'Pro' },
  { id: 4, name: 'William Kim', email: 'william.kim@email.com', role: 'Viewer', status: 'Active', joined: 'Apr 20, 2024', department: 'Sales', lastActive: '3 hours ago', plan: 'Free' },
  { id: 5, name: 'Sofia Davis', email: 'sofia.davis@email.com', role: 'Editor', status: 'Inactive', joined: 'May 8, 2024', department: 'Engineering', lastActive: '2 weeks ago', plan: 'Pro' },
  { id: 6, name: 'Liam Johnson', email: 'liam.j@email.com', role: 'Admin', status: 'Active', joined: 'Jun 1, 2024', department: 'HR', lastActive: '30 min ago', plan: 'Enterprise' },
  { id: 7, name: 'Emma Wilson', email: 'emma.wilson@email.com', role: 'Manager', status: 'Active', joined: 'Jul 10, 2024', department: 'Engineering', lastActive: '1 hour ago', plan: 'Pro' },
  { id: 8, name: 'Noah Brown', email: 'noah.brown@email.com', role: 'Viewer', status: 'Suspended', joined: 'Aug 22, 2024', department: 'Marketing', lastActive: '1 month ago', plan: 'Free' },
  { id: 9, name: 'Ava Garcia', email: 'ava.garcia@email.com', role: 'Editor', status: 'Active', joined: 'Sep 5, 2024', department: 'Design', lastActive: '15 min ago', plan: 'Pro' },
  { id: 10, name: 'Ethan Martinez', email: 'ethan.m@email.com', role: 'Viewer', status: 'Pending', joined: 'Oct 18, 2024', department: 'Sales', lastActive: '3 days ago', plan: 'Free' },
  { id: 11, name: 'Mia Thompson', email: 'mia.thompson@email.com', role: 'Manager', status: 'Active', joined: 'Nov 2, 2024', department: 'Operations', lastActive: '45 min ago', plan: 'Enterprise' },
  { id: 12, name: 'James Anderson', email: 'james.a@email.com', role: 'Editor', status: 'Active', joined: 'Dec 8, 2024', department: 'Engineering', lastActive: '10 min ago', plan: 'Pro' },
];

// ============================================================================
// Variant 1: Modern Card Layout
// ============================================================================
const TableViewModern = () => {
  const [activeTab, setActiveTab] = createSignal<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [isRefreshing, setIsRefreshing] = createSignal(false);

  const getFilteredData = () => {
    let filtered = allUsers;
    if (activeTab() === 'active') filtered = filtered.filter(u => u.status === 'Active');
    else if (activeTab() === 'inactive') filtered = filtered.filter(u => u.status === 'Inactive' || u.status === 'Suspended');
    else if (activeTab() === 'pending') filtered = filtered.filter(u => u.status === 'Pending');

    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.department.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'Active').length,
    inactive: allUsers.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length,
    pending: allUsers.filter(u => u.status === 'Pending').length,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      width: 25,
      render: (value: unknown, record: User | undefined) => (
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white shadow-lg shadow-blue-500/25">
            {record?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{record?.name}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{record?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 12,
      render: (value: unknown) => {
        const colors: Record<string, 'success' | 'failure' | 'warning' | 'gray'> = {
          Active: 'success', Inactive: 'gray', Pending: 'warning', Suspended: 'failure',
        };
        return <Badge color={colors[String(value)] || 'gray'} size="sm">{String(value)}</Badge>;
      },
    },
    {
      key: 'role',
      label: 'Role',
      width: 12,
      render: (value: unknown) => (
        <span class="text-sm text-gray-700 dark:text-gray-300">{String(value)}</span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      width: 14,
      render: (value: unknown) => (
        <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      width: 10,
      render: (value: unknown) => {
        const planColors: Record<string, string> = {
          Free: 'text-gray-500 dark:text-gray-400',
          Pro: 'text-blue-600 dark:text-blue-400 font-medium',
          Enterprise: 'text-purple-600 dark:text-purple-400 font-medium',
        };
        return <span class={`text-sm ${planColors[String(value)] || ''}`}>{String(value)}</span>;
      },
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      width: 12,
      render: (value: unknown) => (
        <span class="text-sm text-gray-500 dark:text-gray-400">{String(value)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 10,
      render: () => (
        <Popover
          position="bottom-end"
          content={
            <div class="w-44 p-1.5">
              <button class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <User01Icon class="size-4" />
                View profile
              </button>
              <button class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <Edit01Icon class="size-4" />
                Edit user
              </button>
              <button class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <Mail01Icon class="size-4" />
                Send email
              </button>
              <hr class="my-1.5 border-gray-100 dark:border-gray-700" />
              <button class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                <Trash01Icon class="size-4" />
                Delete user
              </button>
            </div>
          }
        >
          <Button color="light" size="xs" class="!p-1.5">
            <DotsHorizontalIcon class="size-4" />
          </Button>
        </Popover>
      ),
    },
  ];

  const filterConfigs: FilterConfig<User>[] = [
    { key: 'role', label: 'Role', fieldType: 'select', dataType: 'string', options: [{ label: 'Admin', value: 'Admin' }, { label: 'Manager', value: 'Manager' }, { label: 'Editor', value: 'Editor' }, { label: 'Viewer', value: 'Viewer' }] },
    { key: 'department', label: 'Department', fieldType: 'select', dataType: 'string', options: [{ label: 'Engineering', value: 'Engineering' }, { label: 'Marketing', value: 'Marketing' }, { label: 'Design', value: 'Design' }, { label: 'Sales', value: 'Sales' }, { label: 'HR', value: 'HR' }, { label: 'Operations', value: 'Operations' }] },
    { key: 'plan', label: 'Plan', fieldType: 'select', dataType: 'string', options: [{ label: 'Free', value: 'Free' }, { label: 'Pro', value: 'Pro' }, { label: 'Enterprise', value: 'Enterprise' }] },
  ];

  const tabs = [
    { id: 'all' as const, label: 'All Users', count: stats.total },
    { id: 'active' as const, label: 'Active', count: stats.active },
    { id: 'inactive' as const, label: 'Inactive', count: stats.inactive },
    { id: 'pending' as const, label: 'Pending', count: stats.pending },
  ];

  return (
    <div class="min-h-full bg-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header with glassmorphism */}
      <header class="border-b border-gray-200 bg-white  dark:border-gray-700/50 dark:bg-gray-900/70">
        <div class="px-6 py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3">
                <div class="rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-500/25">
                  <Users01Icon class="size-5 text-white" />
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Manage your team and permissions
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Button
                color="light"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing()}
              >
                <span class="flex items-center gap-2">
                  <RefreshCw01Icon class={`size-4 ${isRefreshing() ? 'animate-spin' : ''}`} />
                  {isRefreshing() ? 'Refreshing...' : 'Refresh'}
                </span>
              </Button>
              <Popover
                position="bottom-end"
                content={
                  <div class="w-44 p-1.5">
                    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      Export as CSV
                    </button>
                    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      Export as Excel
                    </button>
                    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      Export as PDF
                    </button>
                  </div>
                }
              >
                <Button color="light" size="sm">
                  <span class="flex items-center gap-2">
                    <Download01Icon class="size-4" />
                    Export
                    <ChevronDownIcon class="size-4" />
                  </span>
                </Button>
              </Popover>
              <Button color="blue" size="sm" class="shadow-lg shadow-blue-500/25">
                <span class="flex items-center gap-2">
                  <PlusIcon class="size-4" />
                  Add Member
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats with glassmorphism cards */}
        <div class="grid grid-cols-2 gap-3 border-t border-gray-200 px-4 py-4 sm:gap-4 sm:px-6 lg:grid-cols-4 dark:border-gray-700/50">
          <For each={[
            { icon: Users01Icon, value: stats.total, label: 'Total members', color: 'blue' },
            { icon: () => <div class="size-2.5 rounded-full bg-green-500" />, value: stats.active, label: 'Active', color: 'green' },
            { icon: () => <div class="size-2.5 rounded-full bg-gray-400" />, value: stats.inactive, label: 'Inactive', color: 'gray' },
            { icon: () => <div class="size-2.5 rounded-full bg-yellow-500" />, value: stats.pending, label: 'Pending', color: 'yellow' },
          ]}>
            {(stat) => (
              <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div class={`flex size-10 items-center justify-center rounded-lg bg-${stat.color}-100 text-${stat.color}-600 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-400`}>
                  <Dynamic component={stat.icon} class="size-5" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            )}
          </For>
        </div>
      </header>

      {/* Table Section */}
      <div class="p-6">
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl  dark:border-gray-700/50 dark:bg-gray-900/70">
          {/* Tabs + Search */}
          <div class="flex items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
            <div class="flex">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    class={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-all ${
                      activeTab() === tab.id
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span class={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      activeTab() === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                )}
              </For>
            </div>
            <div class="flex items-center gap-3 py-2">
              <div class="relative">
                <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  class="w-64 rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
                />
              </div>
              <Button color="light" size="sm">
                <span class="flex items-center gap-2">
                  <FilterLinesIcon class="size-4" />
                  Filters
                </span>
              </Button>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            data={getFilteredData()}
            columns={columns}
            loading={false}
            error={null}
            rowSelection
            configureColumns
            perPageControl
            filterConfigs={filterConfigs}
            filterMode="internal"
            errorMessage="Failed to load team members"
            noDataMessage="No team members found"
            seeMoreText="View all members"
            elementsPerPageText="members per page"
            selectedElementsText={(count, total) => `${count} of ${total} selected`}
            filterButtonText="Advanced Filters"
            addFilterText="Add filter"
            resetText="Clear all"
            applyText="Apply filters"
            noFiltersText="No filters active"
            footer
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 2: Split Layout with Sidebar
// ============================================================================
const TableViewSplit = () => {
  const [selectedUser, setSelectedUser] = createSignal<User | null>(null);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filterStatus, setFilterStatus] = createSignal<string | null>(null);
  const [filterDepartment, setFilterDepartment] = createSignal<string | null>(null);

  const getFilteredData = () => {
    let filtered = allUsers;
    if (filterStatus()) filtered = filtered.filter(u => u.status === filterStatus());
    if (filterDepartment()) filtered = filtered.filter(u => u.department === filterDepartment());
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  const departments = [...new Set(allUsers.map(u => u.department))];
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

  const columns = [
    {
      key: 'name',
      label: 'User',
      width: 35,
      render: (value: unknown, record: User | undefined) => (
        <button
          onClick={() => setSelectedUser(record || null)}
          class="flex items-center gap-3 text-left"
        >
          <div class="flex size-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-medium text-white">
            {record?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p class="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">{record?.name}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{record?.email}</p>
          </div>
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 15,
      render: (value: unknown) => {
        const colors: Record<string, 'success' | 'failure' | 'warning' | 'gray'> = {
          Active: 'success', Inactive: 'gray', Pending: 'warning', Suspended: 'failure',
        };
        return <Badge color={colors[String(value)] || 'gray'} size="sm">{String(value)}</Badge>;
      },
    },
    {
      key: 'role',
      label: 'Role',
      width: 15,
      render: (value: unknown) => <span class="text-sm text-gray-600 dark:text-gray-300">{String(value)}</span>,
    },
    {
      key: 'department',
      label: 'Department',
      width: 20,
      render: (value: unknown) => <span class="text-sm text-gray-600 dark:text-gray-300">{String(value)}</span>,
    },
    {
      key: 'plan',
      label: 'Plan',
      width: 15,
      render: (value: unknown) => {
        const v = String(value);
        const colors: Record<string, string> = {
          Free: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
          Pro: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          Enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        };
        return <span class={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[v]}`}>{v}</span>;
      },
    },
  ];

  const filterConfigs: FilterConfig<User>[] = [
    { key: 'role', label: 'Role', fieldType: 'select', dataType: 'string', options: [{ label: 'Admin', value: 'Admin' }, { label: 'Manager', value: 'Manager' }, { label: 'Editor', value: 'Editor' }, { label: 'Viewer', value: 'Viewer' }] },
  ];

  return (
    <div class="flex h-[700px] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Filters */}
      <aside class="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Refine your search</p>
        </div>

        {/* Search */}
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <div class="relative">
            <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Name or email..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <div class="space-y-1">
            <button
              onClick={() => setFilterStatus(null)}
              class={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !filterStatus()
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              All statuses
            </button>
            <For each={statuses}>
              {(status) => (
                <button
                  onClick={() => setFilterStatus(status)}
                  class={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    filterStatus() === status
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {status}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Department Filter */}
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
          <div class="space-y-1">
            <button
              onClick={() => setFilterDepartment(null)}
              class={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !filterDepartment()
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              All departments
            </button>
            <For each={departments}>
              {(dept) => (
                <button
                  onClick={() => setFilterDepartment(dept)}
                  class={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    filterDepartment() === dept
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {dept}
                </button>
              )}
            </For>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex flex-1 flex-col overflow-hidden">
        <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Team Directory</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">{getFilteredData().length} members</p>
          </div>
          <Button color="blue" size="sm">
            <span class="flex items-center gap-2">
              <PlusIcon class="size-4" />
              Add Member
            </span>
          </Button>
        </header>

        <div class="flex flex-1 overflow-hidden">
          {/* Table */}
          <div class="flex-1 overflow-auto">
            <DataTable
              data={getFilteredData()}
              columns={columns}
              loading={false}
              error={null}
              rowSelection
              perPageControl
              filterConfigs={filterConfigs}
              filterMode="internal"
              footer
            />
          </div>

          {/* Detail Panel */}
          <Show when={selectedUser()}>
            <aside class="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 dark:text-white">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                >
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mt-6 flex flex-col items-center">
                <div class="flex size-20 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-bold text-white shadow-xl">
                  {selectedUser()?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{selectedUser()?.name}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{selectedUser()?.email}</p>
                <Badge color={selectedUser()?.status === 'Active' ? 'success' : 'gray'} size="sm" class="mt-2">
                  {selectedUser()?.status}
                </Badge>
              </div>

              <div class="mt-6 space-y-4">
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</p>
                  <p class="mt-1 font-medium text-gray-900 dark:text-white">{selectedUser()?.role}</p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Department</p>
                  <p class="mt-1 font-medium text-gray-900 dark:text-white">{selectedUser()?.department}</p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Plan</p>
                  <p class="mt-1 font-medium text-gray-900 dark:text-white">{selectedUser()?.plan}</p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</p>
                  <p class="mt-1 font-medium text-gray-900 dark:text-white">{selectedUser()?.joined}</p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Active</p>
                  <p class="mt-1 font-medium text-gray-900 dark:text-white">{selectedUser()?.lastActive}</p>
                </div>
              </div>

              <div class="mt-6 flex gap-2">
                <Button color="blue" size="sm" class="flex-1">
                  <span class="flex items-center gap-1">
                    <Mail01Icon class="size-4" />
                    Email
                  </span>
                </Button>
                <Button color="light" size="sm" class="flex-1">
                  <span class="flex items-center gap-1">
                    <Edit01Icon class="size-4" />
                    Edit
                  </span>
                </Button>
              </div>
            </aside>
          </Show>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Variant 3: Minimal Compact Design
// ============================================================================
const TableViewMinimal = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [sortField, setSortField] = createSignal<'name' | 'status' | 'joined'>('name');
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');

  const getFilteredData = () => {
    let filtered = allUsers;
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      const dir = sortDirection() === 'asc' ? 1 : -1;
      if (sortField() === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortField() === 'status') return a.status.localeCompare(b.status) * dir;
      if (sortField() === 'joined') return a.joined.localeCompare(b.joined) * dir;
      return 0;
    });
  };

  const toggleSort = (field: 'name' | 'status' | 'joined') => {
    if (sortField() === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = (props: { field: 'name' | 'status' | 'joined' }) => (
    <Show when={sortField() === props.field}>
      {sortDirection() === 'asc' ? (
        <ArrowUpIcon class="size-3.5" />
      ) : (
        <ArrowDownIcon class="size-3.5" />
      )}
    </Show>
  );

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      {/* Minimal Header */}
      <header class="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Team</h1>
          <div class="flex items-center gap-4">
            <div class="relative">
              <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="w-56 rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button color="dark" size="sm">
              <span class="flex items-center gap-2">
                <PlusIcon class="size-4" />
                Add
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Minimal Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th class="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('status')}
                  class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Department
              </th>
              <th class="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('joined')}
                  class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Joined
                  <SortIcon field="joined" />
                </button>
              </th>
              <th class="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            <For each={getFilteredData()}>
              {(user) => (
                <tr class="group border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex size-8 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-gray-700">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class={`inline-flex items-center gap-1.5 text-sm ${
                      user.status === 'Active' ? 'text-green-600 dark:text-green-400' :
                      user.status === 'Pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span class={`size-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' :
                        user.status === 'Pending' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.role}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.department}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.joined}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button class="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                        <Edit01Icon class="size-4" />
                      </button>
                      <button class="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400">
                        <Trash01Icon class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Minimal Footer */}
      <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Showing {getFilteredData().length} of {allUsers.length} members
        </p>
        <div class="flex items-center gap-2">
          <Button color="light" size="xs" disabled>Previous</Button>
          <Button color="light" size="xs">Next</Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const tableViewModernCode = `import { createSignal, For } from 'solid-js';
import { Badge, Button, Popover } from '@exowpee/solidly';
import { DataTable, type FilterConfig } from '@exowpee/solidly-pro';
import { Users01Icon, PlusIcon, SearchMdIcon, RefreshCw01Icon } from '@exowpee/solidly/icons';

export default function TableViewModern() {
  const [activeTab, setActiveTab] = createSignal('all');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [isRefreshing, setIsRefreshing] = createSignal(false);

  const users = [...]; // Your user data

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value, record) => (
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            {record?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p class="font-medium">{record?.name}</p>
            <p class="text-xs text-gray-500">{record?.email}</p>
          </div>
        </div>
      ),
    },
    // ... more columns
  ];

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white ">
        {/* Glassmorphism header with stats */}
      </header>
      <div class="p-6">
        <div class="rounded-2xl border border-gray-200 bg-white ">
          <DataTable data={users} columns={columns} rowSelection footer />
        </div>
      </div>
    </div>
  );
}`;

const tableViewSplitCode = `import { createSignal, Show, For } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import { DataTable } from '@exowpee/solidly-pro';

export default function TableViewSplit() {
  const [selectedUser, setSelectedUser] = createSignal(null);
  const [filterStatus, setFilterStatus] = createSignal(null);

  return (
    <div class="flex h-screen">
      {/* Sidebar Filters */}
      <aside class="w-64 border-r bg-white p-5">
        <h2>Filters</h2>
        <div class="space-y-1">
          {statuses.map(status => (
            <button
              onClick={() => setFilterStatus(status)}
              class={filterStatus() === status ? 'bg-blue-50 text-blue-700' : ''}
            >
              {status}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 overflow-hidden">
        <DataTable data={filteredData()} columns={columns} />
      </main>

      {/* Detail Panel */}
      <Show when={selectedUser()}>
        <aside class="w-80 border-l p-6">
          <UserDetails user={selectedUser()} />
        </aside>
      </Show>
    </div>
  );
}`;

const tableViewMinimalCode = `import { createSignal, For } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { ArrowUpIcon, ArrowDownIcon, SearchMdIcon } from '@exowpee/solidly/icons';

export default function TableViewMinimal() {
  const [sortField, setSortField] = createSignal('name');
  const [sortDirection, setSortDirection] = createSignal('asc');

  const toggleSort = (field) => {
    if (sortField() === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div class="min-h-screen bg-white">
      <header class="border-b px-6 py-4">
        <h1>Team</h1>
        <input type="text" placeholder="Search..." class="border-0 bg-gray-100" />
      </header>

      <table class="w-full">
        <thead>
          <tr>
            <th>
              <button onClick={() => toggleSort('name')}>
                Name {sortField() === 'name' && (sortDirection() === 'asc' ? '↑' : '↓')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedUsers()}>
            {(user) => (
              <tr class="hover:bg-gray-50">
                <td>{user.name}</td>
                {/* ... */}
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}`;

export default function TableViewBlockPage() {
  return (
    <BlocksDocPage
      title="Table View"
      description="Premium data tables with multiple layouts: modern glassmorphism cards, split view with sidebar filters and detail panel, or minimal compact design. Built with DataTable Pro component, featuring row selection, column configuration, and pagination."
      category="Data Management"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Card Layout',
          description: 'Glassmorphism design with gradient backgrounds, stat cards, and animated refreshing.',
          component: TableViewModern,
          code: tableViewModernCode,
        },
        {
          id: 'split',
          title: 'Split Layout',
          description: 'Three-column layout with sidebar filters, main table, and detail panel.',
          component: TableViewSplit,
          code: tableViewSplitCode,
        },
        {
          id: 'minimal',
          title: 'Minimal Compact',
          description: 'Clean, borderless design with sortable columns and hover actions.',
          component: TableViewMinimal,
          code: tableViewMinimalCode,
        },
      ]}
      usedComponents={[
        { name: 'DataTable', path: '/components/data-table', isPro: true },
        { name: 'Sidebar', path: '/components/sidebar', isPro: true },
        { name: 'Popover', path: '/components/popover' },
        { name: 'Button', path: '/components/button' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Admin Panel', path: '/blocks/dashboard/admin-panel', description: 'E-commerce admin with sidebar and DataTable' },
        { name: 'Analytics', path: '/blocks/dashboard/analytics', description: 'Analytics dashboard with charts' },
        { name: 'CRUD Interface', path: '/blocks/data-management/crud-interface', description: 'Create, read, update, delete operations' },
      ]}
    />
  );
}

// Export components for iframe preview
export { TableViewModern, TableViewSplit, TableViewMinimal };
