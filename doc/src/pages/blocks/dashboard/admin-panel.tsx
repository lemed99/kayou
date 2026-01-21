import { createSignal, For, type JSX, Show } from 'solid-js';
import { Badge, Button, Drawer, Popover } from '@exowpee/solidly';
import {
  BarChart01Icon,
  Bell01Icon,
  CalendarIcon,
  ChevronDownIcon,
  CreditCard01Icon,
  Download01Icon,
  FilterLinesIcon,
  Home01Icon,
  LogOut01Icon,
  Mail01Icon,
  Menu01Icon,
  PackageIcon,
  PlusIcon,
  SearchMdIcon,
  Settings01Icon,
  ShoppingCart01Icon,
  User01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import {
  CartesianGrid,
  DataTable,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sidebar,
  type SidebarItem,
  XAxis,
  YAxis,
} from '@exowpee/solidly-pro';
import BlocksDocPage from '../../../components/BlocksDocPage';
import { useIsMobile } from '../../../utils/useIsMobile';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  avatar?: string;
  lastActive: string;
  orders: number;
  spent: string;
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: (props: { class: string }) => JSX.Element;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const AdminPanel = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [showNotifications, setShowNotifications] = createSignal(false);
  const [showUserMenu, setShowUserMenu] = createSignal(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (props) => <Home01Icon {...props} />,
      path: '#',
      isActive: true,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (props) => <ShoppingCart01Icon {...props} />,
      path: '#',
    },
    {
      id: 'products',
      label: 'Products',
      icon: (props) => <PackageIcon {...props} />,
      children: [
        { id: 'all-products', label: 'All Products', path: '#' },
        { id: 'categories', label: 'Categories', path: '#' },
        { id: 'inventory', label: 'Inventory', path: '#' },
        { id: 'reviews', label: 'Reviews', path: '#' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: (props) => <Users01Icon {...props} />,
      path: '#',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (props) => <BarChart01Icon {...props} />,
      children: [
        { id: 'overview', label: 'Overview', path: '#' },
        { id: 'reports', label: 'Reports', path: '#' },
        { id: 'real-time', label: 'Real-time', path: '#' },
      ],
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: (props) => <Mail01Icon {...props} />,
      children: [
        { id: 'campaigns', label: 'Campaigns', path: '#' },
        { id: 'discounts', label: 'Discounts', path: '#' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (props) => <Settings01Icon {...props} />,
      path: '#',
    },
  ];

  const stats: StatCard[] = [
    {
      label: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: (props) => <CreditCard01Icon {...props} />,
    },
    {
      label: 'Orders',
      value: '2,350',
      change: '+15.2%',
      trend: 'up',
      icon: (props) => <ShoppingCart01Icon {...props} />,
    },
    {
      label: 'Customers',
      value: '12,234',
      change: '+8.1%',
      trend: 'up',
      icon: (props) => <Users01Icon {...props} />,
    },
    {
      label: 'Conversion',
      value: '3.24%',
      change: '-2.4%',
      trend: 'down',
      icon: (props) => <BarChart01Icon {...props} />,
    },
  ];

  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 4000, orders: 240 },
    { month: 'Feb', revenue: 3000, orders: 198 },
    { month: 'Mar', revenue: 5000, orders: 320 },
    { month: 'Apr', revenue: 4780, orders: 298 },
    { month: 'May', revenue: 5890, orders: 380 },
    { month: 'Jun', revenue: 6390, orders: 420 },
    { month: 'Jul', revenue: 7490, orders: 490 },
  ];

  const categoryData: CategoryData[] = [
    { name: 'Electronics', value: 4500, color: '#3b82f6' },
    { name: 'Clothing', value: 3200, color: '#22c55e' },
    { name: 'Home & Garden', value: 2100, color: '#f59e0b' },
    { name: 'Sports', value: 1800, color: '#ef4444' },
    { name: 'Other', value: 1200, color: '#8b5cf6' },
  ];

  const users: User[] = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Premium', status: 'Active', joined: 'Jan 12, 2024', lastActive: '2 hours ago', orders: 28, spent: '$2,340' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', role: 'Regular', status: 'Active', joined: 'Feb 3, 2024', lastActive: '5 mins ago', orders: 15, spent: '$890' },
    { id: 3, name: 'Emily Davis', email: 'emily@example.com', role: 'Premium', status: 'Inactive', joined: 'Mar 15, 2024', lastActive: '3 days ago', orders: 42, spent: '$4,120' },
    { id: 4, name: 'James Wilson', email: 'james@example.com', role: 'Regular', status: 'Active', joined: 'Apr 20, 2024', lastActive: '1 hour ago', orders: 8, spent: '$456' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'VIP', status: 'Active', joined: 'May 8, 2024', lastActive: 'Just now', orders: 67, spent: '$8,920' },
  ];

  const notifications = [
    { id: 1, title: 'New order received', message: 'Order #12345 from Sarah Johnson', time: '2 mins ago', unread: true },
    { id: 2, title: 'Payment confirmed', message: 'Payment for order #12344 confirmed', time: '15 mins ago', unread: true },
    { id: 3, title: 'Low stock alert', message: 'iPhone 15 Pro is running low', time: '1 hour ago', unread: false },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      width: 25,
      render: (value: unknown, record: User | undefined) => (
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-medium text-white">
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
      key: 'role',
      label: 'Type',
      width: 12,
      render: (value: unknown) => (
        <Badge
          color={value === 'VIP' ? 'dark' : value === 'Premium' ? 'default' : 'gray'}
          size="sm"
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 12,
      render: (value: unknown) => (
        <div class="flex items-center gap-2">
          <div class={`size-2 rounded-full ${value === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span class={value === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
            {String(value)}
          </span>
        </div>
      ),
    },
    { key: 'orders', label: 'Orders', width: 10 },
    { key: 'spent', label: 'Total Spent', width: 12 },
    { key: 'lastActive', label: 'Last Active', width: 14 },
    {
      key: 'actions',
      label: '',
      width: 15,
      render: () => (
        <div class="flex justify-end gap-2">
          <Button color="light" size="xs">View</Button>
          <Button color="light" size="xs">Edit</Button>
        </div>
      ),
    },
  ];

  const sidebarContent = (
    <Sidebar
      items={sidebarItems}
      isMobile={isMobile()}
      isSidebarOpen={isMobile() ? true : isSidebarOpen()}
      setIsSidebarOpen={isMobile() ? setIsMobileDrawerOpen : setIsSidebarOpen}
      class="h-full"
    >
      <div class="flex items-center gap-3">
        <div class="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
          <PackageIcon class="size-5 text-white" />
        </div>
        <Show when={isMobile() || isSidebarOpen()}>
          <div>
            <span class="text-base font-bold text-gray-900 dark:text-white">StoreAdmin</span>
            <p class="text-xs text-gray-500 dark:text-gray-400">E-commerce</p>
          </div>
        </Show>
      </div>
    </Sidebar>
  );

  return (
    <div class="flex h-full min-h-[700px] bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Show when={!isMobile()}>
        <div class={`shrink-0 border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${isSidebarOpen() ? 'w-64' : 'w-16'}`}>
          {sidebarContent}
        </div>
      </Show>

      {/* Mobile Sidebar Drawer */}
      <Show when={isMobile()}>
        <Drawer
          show={isMobileDrawerOpen()}
          onClose={() => setIsMobileDrawerOpen(false)}
          position="left"
        >
          <div class="h-full w-72 bg-white dark:bg-gray-900">
            {sidebarContent}
          </div>
        </Drawer>
      </Show>

      {/* Main content */}
      <div class="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            {/* Mobile menu button */}
            <Show when={isMobile()}>
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <Menu01Icon class="size-5" />
              </button>
            </Show>
            <div class="relative">
              <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="h-9 w-40 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            {/* Date Range */}
            <Button color="light" size="sm" class="hidden lg:flex">
              <span class="flex items-center gap-2">
                <CalendarIcon class="size-4" />
                Last 7 days
                <ChevronDownIcon class="size-4" />
              </span>
            </Button>

            {/* Export */}
            <Button color="light" size="sm" class="hidden sm:flex">
              <span class="flex items-center gap-2">
                <Download01Icon class="size-4" />
                Export
              </span>
            </Button>

            {/* Notifications */}
            <Popover
              isOpen={showNotifications()}
              onOpenChange={setShowNotifications}
              position="bottom-end"
              content={
                <div class="w-80">
                  <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div class="max-h-80 overflow-auto">
                    <For each={notifications}>
                      {(notif) => (
                        <div class={`border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-700 ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                          <p class="mt-1 text-xs text-gray-400">{notif.time}</p>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
                    <button class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                      View all notifications
                    </button>
                  </div>
                </div>
              }
            >
              <button class="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Bell01Icon class="size-5" />
                <span class="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  2
                </span>
              </button>
            </Popover>

            {/* User Menu */}
            <Popover
              isOpen={showUserMenu()}
              onOpenChange={setShowUserMenu}
              position="bottom-end"
              content={
                <div class="w-56 py-1">
                  <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p class="font-medium text-gray-900 dark:text-white">John Doe</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">john@example.com</p>
                  </div>
                  <div class="py-1">
                    <button class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <User01Icon class="size-4" /> Profile
                    </button>
                    <button class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Settings01Icon class="size-4" /> Settings
                    </button>
                  </div>
                  <div class="border-t border-gray-200 py-1 dark:border-gray-700">
                    <button class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700">
                      <LogOut01Icon class="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              }
            >
              <button class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div class="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                  JD
                </div>
                <ChevronDownIcon class="size-4 text-gray-500" />
              </button>
            </Popover>
          </div>
        </header>

        {/* Page content */}
        <main class="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
            </div>
            <Button color="blue">
              <span class="flex items-center gap-2">
                <PlusIcon class="size-4" />
                Add Product
              </span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <For each={stats}>
              {(stat) => (
                <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <div class={`rounded-lg p-2 ${stat.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {stat.icon({ class: 'size-4' })}
                    </div>
                  </div>
                  <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div class="mt-1 flex items-center gap-1">
                    <Badge color={stat.trend === 'up' ? 'success' : 'failure'} size="sm">
                      {stat.change}
                    </Badge>
                    <span class="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Charts Row */}
          <div class="mb-6 grid gap-6 lg:grid-cols-3">
            {/* Revenue Chart */}
            <div class="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Monthly revenue and orders</p>
                </div>
                <div class="flex items-center gap-4 text-xs">
                  <div class="flex items-center gap-1.5">
                    <div class="size-2.5 rounded-full bg-blue-500" />
                    <span class="text-gray-500 dark:text-gray-400">Revenue</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="size-2.5 rounded-full bg-green-500" />
                    <span class="text-gray-500 dark:text-gray-400">Orders</span>
                  </div>
                </div>
              </div>
              <div class="h-[280px]">
                <ResponsiveContainer>
                  {(size) => (
                    <LineChart data={revenueData} width={500} height={280} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Revenue and orders chart">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Line dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot />
                      <Line dataKey="orders" stroke="#22c55e" strokeWidth={2} dot />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category */}
            <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Sales by Category</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Product distribution</p>
              </div>
              <div class="h-[200px]">
                <ResponsiveContainer>
                  {(size) => (
                    <PieChart width={200} height={200} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Sales by category">
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        labelKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#3b82f6"
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div class="mt-4 space-y-2">
                <For each={categoryData}>
                  {(cat) => (
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2">
                        <div class="size-2.5 rounded-full" style={{ background: cat.color }} />
                        <span class="text-gray-600 dark:text-gray-400">{cat.name}</span>
                      </div>
                      <span class="font-medium text-gray-900 dark:text-white">${cat.value.toLocaleString()}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Customers</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manage and view customer activity</p>
              </div>
              <div class="flex gap-2">
                <Button color="light" size="sm">
                  <span class="flex items-center gap-2">
                    <FilterLinesIcon class="size-4" />
                    Filter
                  </span>
                </Button>
                <Button color="blue" size="sm">
                  <span class="flex items-center gap-2">
                    <PlusIcon class="size-4" />
                    Add Customer
                  </span>
                </Button>
              </div>
            </div>
            <DataTable
              data={users}
              columns={columns}
              loading={false}
              error={null}
              rowSelection
              searchBar
              configureColumns
              errorMessage="Failed to load customers"
              noDataMessage="No customers found"
              seeMoreText="View all customers"
              elementsPerPageText="per page"
              selectedElementsText={(count, total) => `${count} of ${total} selected`}
              footer
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const adminPanelCode = `import { createSignal, For, Show } from 'solid-js';
import { Badge, Button, Popover } from '@exowpee/solidly';
import {
  BarChart01Icon, Bell01Icon, CalendarIcon, ChevronDownIcon,
  CreditCard01Icon, Download01Icon, FilterLinesIcon, Home01Icon,
  PackageIcon, PlusIcon, SearchMdIcon, Settings01Icon,
  ShoppingCart01Icon, Users01Icon,
} from '@exowpee/solidly/icons';
import {
  CartesianGrid, DataTable, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Sidebar, type SidebarItem, XAxis, YAxis,
} from '@exowpee/solidly-pro';

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [showNotifications, setShowNotifications] = createSignal(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: (props) => <Home01Icon {...props} />, path: '#', isActive: true },
    { id: 'orders', label: 'Orders', icon: (props) => <ShoppingCart01Icon {...props} />, path: '#' },
    {
      id: 'products', label: 'Products', icon: (props) => <PackageIcon {...props} />,
      children: [
        { id: 'all-products', label: 'All Products', path: '#' },
        { id: 'categories', label: 'Categories', path: '#' },
        { id: 'inventory', label: 'Inventory', path: '#' },
      ],
    },
    { id: 'customers', label: 'Customers', icon: (props) => <Users01Icon {...props} />, path: '#' },
    { id: 'analytics', label: 'Analytics', icon: (props) => <BarChart01Icon {...props} />, path: '#' },
    { id: 'settings', label: 'Settings', icon: (props) => <Settings01Icon {...props} />, path: '#' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up' },
    { label: 'Orders', value: '2,350', change: '+15.2%', trend: 'up' },
    { label: 'Customers', value: '12,234', change: '+8.1%', trend: 'up' },
    { label: 'Conversion', value: '3.24%', change: '-2.4%', trend: 'down' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4000, orders: 240 },
    { month: 'Feb', revenue: 3000, orders: 198 },
    { month: 'Mar', revenue: 5000, orders: 320 },
    // ... more data
  ];

  const categoryData = [
    { name: 'Electronics', value: 4500, color: '#3b82f6' },
    { name: 'Clothing', value: 3200, color: '#22c55e' },
    { name: 'Home & Garden', value: 2100, color: '#f59e0b' },
  ];

  const customers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Premium', status: 'Active', orders: 28, spent: '$2,340' },
    // ... more customers
  ];

  const columns = [
    {
      key: 'name', label: 'Customer', width: 25,
      render: (value, record) => (
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {record?.name[0]}
          </div>
          <div>
            <p class="font-medium">{record?.name}</p>
            <p class="text-xs text-gray-500">{record?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Type', width: 12, render: (v) => <Badge color={v === 'VIP' ? 'purple' : 'blue'}>{v}</Badge> },
    { key: 'status', label: 'Status', width: 12 },
    { key: 'orders', label: 'Orders', width: 10 },
    { key: 'spent', label: 'Total Spent', width: 12 },
  ];

  return (
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with Sidebar component */}
      <div class={\`shrink-0 border-r bg-white dark:bg-gray-900 \${isSidebarOpen() ? 'w-64' : 'w-16'}\`}>
        <Sidebar items={sidebarItems} isMobile={false} isSidebarOpen={isSidebarOpen()} setIsSidebarOpen={setIsSidebarOpen}>
          <div class="flex items-center gap-3">
            <div class="size-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <PackageIcon class="size-5 text-white" />
            </div>
            <span class="font-bold">StoreAdmin</span>
          </div>
        </Sidebar>
      </div>

      <div class="flex flex-1 flex-col">
        {/* Header with notifications Popover */}
        <header class="flex h-16 items-center justify-between border-b bg-white px-6">
          <input type="search" placeholder="Search..." class="w-64 rounded-lg border px-4 py-2" />
          <div class="flex items-center gap-3">
            <Popover trigger={<button><Bell01Icon /></button>} isOpen={showNotifications()} setIsOpen={setShowNotifications}>
              {/* Notifications dropdown */}
            </Popover>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat cards with icons and trends */}
          </div>

          {/* Charts Row: LineChart + PieChart */}
          <div class="mb-6 grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <ResponsiveContainer>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line dataKey="revenue" stroke="#3b82f6" />
                  <Line dataKey="orders" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" innerRadius={50} outerRadius={80} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customers DataTable */}
          <DataTable
            data={customers}
            columns={columns}
            rowSelection
            searchBar
            configureColumns
            footer
          />
        </main>
      </div>
    </div>
  );
}`;

export default function AdminPanelBlockPage() {
  return (
    <BlocksDocPage
      title="Admin Panel"
      description="Complete e-commerce admin dashboard featuring Sidebar navigation with nested menus, real-time charts (LineChart & PieChart), KPI stat cards, notification center with Popover, user dropdown, and a fully-featured DataTable with customer management."
      category="Dashboard"
      isPro
      variants={[
        {
          id: 'default',
          title: 'E-commerce Dashboard',
          description: 'Full-featured admin panel with sidebar, charts, stats, and customer management table.',
          component: AdminPanel,
          code: adminPanelCode,
        },
      ]}
      usedComponents={[
        { name: 'Sidebar', path: '/components/sidebar', isPro: true },
        { name: 'DataTable', path: '/components/data-table', isPro: true },
        { name: 'LineChart', path: '/components/line-chart', isPro: true },
        { name: 'PieChart', path: '/components/pie-chart', isPro: true },
        { name: 'ResponsiveContainer', path: '/components/responsive-container', isPro: true },
        { name: 'Popover', path: '/components/popover' },
        { name: 'Button', path: '/components/button' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Analytics', path: '/blocks/dashboard/analytics', description: 'Advanced analytics with multiple chart types' },
        { name: 'Table View', path: '/blocks/data-management/table-view', description: 'Advanced data table with filtering' },
      ]}
    />
  );
}

// Export components for iframe preview
export { AdminPanel };
