import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Badge, Button } from '@exowpee/solidly';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChevronDownIcon,
  CreditCard01Icon,
  Download01Icon,
  Globe01Icon,
  RefreshCw01Icon,
  ShoppingCart01Icon,
  TrendUp01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from '@exowpee/solidly-pro';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// Variant 1: Full Analytics (Complete dashboard with all charts)
// ============================================================================
const AnalyticsFull = () => {
  const [dateRange] = createSignal('Last 30 days');
  const [activeTab, setActiveTab] = createSignal<'overview' | 'revenue' | 'traffic'>('overview');

  const metrics = [
    {
      label: 'Total Revenue',
      value: '$128,430',
      change: 12.5,
      icon: CreditCard01Icon,
      sparkline: [30, 40, 35, 50, 49, 60, 70, 65, 80, 81, 95, 100],
    },
    {
      label: 'Total Orders',
      value: '3,842',
      change: 8.2,
      icon: ShoppingCart01Icon,
      sparkline: [20, 25, 30, 35, 40, 38, 45, 50, 55, 60, 58, 65],
    },
    {
      label: 'Unique Visitors',
      value: '48,392',
      change: -3.1,
      icon: Users01Icon,
      sparkline: [50, 45, 48, 42, 40, 38, 35, 40, 42, 38, 36, 35],
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: 0.8,
      icon: TrendUp01Icon,
      sparkline: [2.1, 2.3, 2.5, 2.4, 2.8, 2.9, 3.0, 2.8, 3.1, 3.0, 3.2, 3.24],
    },
  ];

  const revenueData = [
    { date: 'Jan', revenue: 18500, profit: 8200, expenses: 10300 },
    { date: 'Feb', revenue: 22000, profit: 10500, expenses: 11500 },
    { date: 'Mar', revenue: 19800, profit: 9100, expenses: 10700 },
    { date: 'Apr', revenue: 28500, profit: 14200, expenses: 14300 },
    { date: 'May', revenue: 32000, profit: 16800, expenses: 15200 },
    { date: 'Jun', revenue: 35200, profit: 18900, expenses: 16300 },
    { date: 'Jul', revenue: 38000, profit: 20100, expenses: 17900 },
    { date: 'Aug', revenue: 42500, profit: 23200, expenses: 19300 },
    { date: 'Sep', revenue: 39800, profit: 21500, expenses: 18300 },
    { date: 'Oct', revenue: 45200, profit: 25100, expenses: 20100 },
    { date: 'Nov', revenue: 52000, profit: 29500, expenses: 22500 },
    { date: 'Dec', revenue: 58000, profit: 33200, expenses: 24800 },
  ];

  const trafficSources = [
    { name: 'Organic Search', visitors: 18420, percentage: 38, color: '#3b82f6' },
    { name: 'Direct', visitors: 12300, percentage: 25, color: '#22c55e' },
    { name: 'Social Media', visitors: 9800, percentage: 20, color: '#f59e0b' },
    { name: 'Referral', visitors: 5400, percentage: 11, color: '#ef4444' },
    { name: 'Email', visitors: 2872, percentage: 6, color: '#8b5cf6' },
  ];

  const topProducts = [
    { name: 'MacBook Pro 16"', sales: 432, revenue: '$1,296,000', growth: 24 },
    { name: 'iPhone 15 Pro Max', sales: 856, revenue: '$941,600', growth: 18 },
    { name: 'AirPods Pro', sales: 1243, revenue: '$310,750', growth: 32 },
    { name: 'Apple Watch Ultra', sales: 389, revenue: '$310,411', growth: -5 },
    { name: 'iPad Pro 12.9"', sales: 234, revenue: '$280,800', growth: 12 },
  ];

  const MiniSparkline = (props: { data: number[]; positive: boolean }) => {
    const max = Math.max(...props.data);
    const min = Math.min(...props.data);
    const range = max - min || 1;
    const points = props.data.map((v, i) => {
      const x = (i / (props.data.length - 1)) * 80;
      const y = 24 - ((v - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg class="h-6 w-20" viewBox="0 0 80 28">
        <polyline
          points={points}
          fill="none"
          stroke={props.positive ? '#22c55e' : '#ef4444'}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  return (
    <div class="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-16 items-center justify-between px-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Track your business metrics</p>
          </div>
          <div class="flex items-center gap-3">
            <Button color="light" size="sm">
              <span class="flex items-center gap-2">
                <CalendarIcon class="size-4" />
                {dateRange()}
                <ChevronDownIcon class="size-4" />
              </span>
            </Button>
            <Button color="light" size="sm">
              <span class="flex items-center gap-2">
                <Download01Icon class="size-4" />
                Export
              </span>
            </Button>
            <Button color="blue" size="sm">Generate Report</Button>
          </div>
        </div>

        <div class="flex gap-6 px-6">
          <For each={[
            { id: 'overview', label: 'Overview' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'traffic', label: 'Traffic' },
          ] as const}>
            {(tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                class={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab() === tab.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            )}
          </For>
        </div>
      </header>

      <main class="p-6">
        {/* Metrics Grid */}
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <For each={metrics}>
            {(metric) => (
              <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  </div>
                  <div class="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Dynamic component={metric.icon} class="size-5" />
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <Show
                      when={metric.change >= 0}
                      fallback={
                        <span class="flex items-center gap-0.5 text-sm font-medium text-red-600 dark:text-red-400">
                          <ArrowDownIcon class="size-3.5" />
                          {Math.abs(metric.change)}%
                        </span>
                      }
                    >
                      <span class="flex items-center gap-0.5 text-sm font-medium text-green-600 dark:text-green-400">
                        <ArrowUpIcon class="size-3.5" />
                        {metric.change}%
                      </span>
                    </Show>
                    <span class="text-xs text-gray-500">vs last period</span>
                  </div>
                  <MiniSparkline data={metric.sparkline} positive={metric.change >= 0} />
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Charts Row */}
        <div class="mb-6 grid gap-6 lg:grid-cols-3">
          <div class="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue Analytics</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Monthly breakdown</p>
              </div>
              <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5">
                  <div class="size-2.5 rounded-full bg-blue-500" />
                  <span class="text-gray-500 dark:text-gray-400">Revenue</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="size-2.5 rounded-full bg-green-500" />
                  <span class="text-gray-500 dark:text-gray-400">Profit</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="size-2.5 rounded-full bg-red-400" />
                  <span class="text-gray-500 dark:text-gray-400">Expenses</span>
                </div>
              </div>
            </div>
            <div class="h-[320px]">
              <ResponsiveContainer>
                {(size) => (
                  <LineChart data={revenueData} width={600} height={320} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Revenue analytics">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Line dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot />
                    <Line dataKey="profit" stroke="#22c55e" strokeWidth={2} dot />
                    <Line dataKey="expenses" stroke="#f87171" strokeWidth={2} dot />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div class="mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Traffic Sources</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Where visitors come from</p>
            </div>
            <div class="h-[180px]">
              <ResponsiveContainer>
                {(size) => (
                  <PieChart width={180} height={180} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Traffic sources">
                    <Pie
                      data={trafficSources}
                      dataKey="visitors"
                      labelKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      fill="#3b82f6"
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
            <div class="mt-4 space-y-3">
              <For each={trafficSources}>
                {(source) => (
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="size-2.5 rounded-full" style={{ background: source.color }} />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{source.name}</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{source.percentage}%</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div class="border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Best performing products this period</p>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <For each={topProducts}>
              {(product, index) => (
                <div class="flex items-center justify-between p-4">
                  <div class="flex items-center gap-3">
                    <span class="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {index() + 1}
                    </span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{product.sales} sales</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900 dark:text-white">{product.revenue}</p>
                    <p class={`text-sm ${product.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Variant 2: Sales Focus (Revenue-centric dashboard)
// ============================================================================
const AnalyticsSales = () => {
  const salesData = [
    { month: 'Jan', sales: 12400 },
    { month: 'Feb', sales: 14500 },
    { month: 'Mar', sales: 13200 },
    { month: 'Apr', sales: 18900 },
    { month: 'May', sales: 22300 },
    { month: 'Jun', sales: 24100 },
  ];

  const dailySales = [
    { day: 'Mon', amount: 4200 },
    { day: 'Tue', amount: 3800 },
    { day: 'Wed', amount: 5100 },
    { day: 'Thu', amount: 4900 },
    { day: 'Fri', amount: 6200 },
    { day: 'Sat', amount: 5800 },
    { day: 'Sun', amount: 3200 },
  ];

  const salesByRegion = [
    { region: 'North America', amount: 48200, percentage: 42 },
    { region: 'Europe', amount: 32100, percentage: 28 },
    { region: 'Asia Pacific', amount: 21800, percentage: 19 },
    { region: 'Others', amount: 12600, percentage: 11 },
  ];

  const recentTransactions = [
    { id: '#TXN-001', customer: 'John Smith', amount: '$1,240.00', date: 'Today, 2:30 PM', status: 'completed' },
    { id: '#TXN-002', customer: 'Sarah Johnson', amount: '$890.00', date: 'Today, 1:15 PM', status: 'pending' },
    { id: '#TXN-003', customer: 'Mike Wilson', amount: '$2,100.00', date: 'Today, 11:45 AM', status: 'completed' },
    { id: '#TXN-004', customer: 'Emily Davis', amount: '$560.00', date: 'Yesterday', status: 'completed' },
  ];

  return (
    <div class="min-h-full bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-900">
      {/* Header */}
      <header class="bg-white/80 px-6 py-6 backdrop-blur-sm dark:bg-gray-900/80">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
            <p class="text-gray-500 dark:text-gray-400">Monitor your sales performance in real-time</p>
          </div>
          <div class="flex items-center gap-3">
            <Button color="light" size="sm">
              <span class="flex items-center gap-2">
                <CalendarIcon class="size-4" />
                Last 30 days
              </span>
            </Button>
            <Button color="blue" size="sm">Export Report</Button>
          </div>
        </div>
      </header>

      <main class="p-6">
        {/* Revenue Hero */}
        <div class="mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-blue-100">Total Revenue</p>
              <p class="mt-2 text-5xl font-bold">$114,700</p>
              <div class="mt-3 flex items-center gap-2">
                <Badge color="success" size="sm" class="!bg-green-400/20 !text-green-100">
                  <ArrowUpIcon class="size-3" />
                  +18.2%
                </Badge>
                <span class="text-sm text-blue-200">vs last month</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-blue-200">Orders</p>
                <p class="text-2xl font-bold">2,847</p>
              </div>
              <div>
                <p class="text-sm text-blue-200">Avg. Order</p>
                <p class="text-2xl font-bold">$40.29</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div class="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Monthly Sales Trend */}
          <div class="rounded-xl border border-gray-200/50 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Monthly Sales Trend</h2>
            <div class="h-[280px]">
              <ResponsiveContainer>
                {(size) => (
                  <LineChart data={salesData} width={400} height={280} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Monthly sales">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Line dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Performance */}
          <div class="rounded-xl border border-gray-200/50 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Daily Performance</h2>
            <div class="h-[280px]">
              <ResponsiveContainer>
                {(size) => (
                  <LineChart data={dailySales} width={400} height={280} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Daily sales">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Line dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div class="grid gap-6 lg:grid-cols-2">
          {/* Sales by Region */}
          <div class="rounded-xl border border-gray-200/50 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Sales by Region</h2>
            <div class="space-y-4">
              <For each={salesByRegion}>
                {(region) => (
                  <div>
                    <div class="mb-2 flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{region.region}</span>
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">${region.amount.toLocaleString()}</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Recent Transactions */}
          <div class="rounded-xl border border-gray-200/50 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
              <Button color="light" size="xs">View All</Button>
            </div>
            <div class="space-y-3">
              <For each={recentTransactions}>
                {(txn) => (
                  <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{txn.customer}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{txn.id} • {txn.date}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">{txn.amount}</p>
                      <Badge color={txn.status === 'completed' ? 'success' : 'warning'} size="sm">
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Variant 3: Real-time (Live metrics with activity stream)
// ============================================================================
const AnalyticsRealtime = () => {
  const [isLive] = createSignal(true);

  const liveMetrics = [
    { label: 'Active Users', value: '1,284', trend: 'up', change: 23 },
    { label: 'Page Views', value: '4,521', trend: 'up', change: 12 },
    { label: 'Sessions', value: '892', trend: 'down', change: -5 },
    { label: 'Bounce Rate', value: '32.4%', trend: 'up', change: 2 },
  ];

  const topPages = [
    { page: '/products/macbook-pro', views: 423, unique: 312 },
    { page: '/checkout', views: 387, unique: 298 },
    { page: '/products/iphone-15', views: 356, unique: 287 },
    { page: '/cart', views: 298, unique: 234 },
    { page: '/account/dashboard', views: 245, unique: 198 },
  ];

  const liveActivity = [
    { type: 'purchase', user: 'John D.', action: 'completed purchase', amount: '$129.00', time: 'Just now', country: '🇺🇸' },
    { type: 'signup', user: 'Sarah M.', action: 'signed up', time: '2s ago', country: '🇬🇧' },
    { type: 'cart', user: 'Mike W.', action: 'added to cart', product: 'AirPods Pro', time: '5s ago', country: '🇨🇦' },
    { type: 'purchase', user: 'Emily K.', action: 'completed purchase', amount: '$89.00', time: '12s ago', country: '🇦🇺' },
    { type: 'view', user: 'Anonymous', action: 'viewing product page', product: 'MacBook Air', time: '15s ago', country: '🇩🇪' },
    { type: 'cart', user: 'Tom H.', action: 'added to cart', product: 'iPhone 15', time: '23s ago', country: '🇫🇷' },
  ];

  const countries = [
    { name: 'United States', visitors: 523, percentage: 38, flag: '🇺🇸' },
    { name: 'United Kingdom', visitors: 234, percentage: 17, flag: '🇬🇧' },
    { name: 'Germany', visitors: 189, percentage: 14, flag: '🇩🇪' },
    { name: 'Canada', visitors: 156, percentage: 11, flag: '🇨🇦' },
    { name: 'Australia', visitors: 134, percentage: 10, flag: '🇦🇺' },
    { name: 'Others', visitors: 137, percentage: 10, flag: '🌍' },
  ];

  return (
    <div class="min-h-full bg-gray-950">
      {/* Header */}
      <header class="border-b border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-white">Real-time Analytics</h1>
            <Show when={isLive()}>
              <div class="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1">
                <div class="size-2 animate-pulse rounded-full bg-green-500" />
                <span class="text-sm font-medium text-green-400">Live</span>
              </div>
            </Show>
          </div>
          <div class="flex items-center gap-3">
            <Button color="light" size="sm" class="!bg-gray-800 !text-gray-300 hover:!bg-gray-700">
              <span class="flex items-center gap-2">
                <RefreshCw01Icon class="size-4" />
                Refresh
              </span>
            </Button>
            <Button color="light" size="sm" class="!bg-gray-800 !text-gray-300 hover:!bg-gray-700">
              <span class="flex items-center gap-2">
                <Globe01Icon class="size-4" />
                All Regions
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main class="p-6">
        {/* Live Metrics */}
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <For each={liveMetrics}>
            {(metric) => (
              <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <p class="text-sm text-gray-400">{metric.label}</p>
                <div class="mt-2 flex items-baseline justify-between">
                  <span class="text-3xl font-bold text-white">{metric.value}</span>
                  <span class={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.trend === 'up' ? <ArrowUpIcon class="size-3" /> : <ArrowDownIcon class="size-3" />}
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {/* Live Activity Stream */}
          <div class="rounded-xl border border-gray-800 bg-gray-900 lg:col-span-2">
            <div class="border-b border-gray-800 p-5">
              <h2 class="text-lg font-semibold text-white">Live Activity</h2>
              <p class="text-sm text-gray-400">Real-time user actions</p>
            </div>
            <div class="max-h-[400px] overflow-auto">
              <For each={liveActivity}>
                {(activity) => (
                  <div class="flex items-center gap-4 border-b border-gray-800 px-5 py-3 last:border-0">
                    <div class={`flex size-10 items-center justify-center rounded-lg ${
                      activity.type === 'purchase' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'signup' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'cart' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {activity.type === 'purchase' && <CreditCard01Icon class="size-5" />}
                      {activity.type === 'signup' && <Users01Icon class="size-5" />}
                      {activity.type === 'cart' && <ShoppingCart01Icon class="size-5" />}
                      {activity.type === 'view' && <Globe01Icon class="size-5" />}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-white">
                        <span class="font-medium">{activity.user}</span>{' '}
                        <span class="text-gray-400">{activity.action}</span>
                        {activity.product && <span class="text-gray-300"> "{activity.product}"</span>}
                      </p>
                      <p class="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div class="text-right">
                      {activity.amount && <p class="font-semibold text-green-400">{activity.amount}</p>}
                      <span class="text-lg">{activity.country}</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Right Column */}
          <div class="space-y-6">
            {/* Top Pages */}
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 class="mb-4 text-lg font-semibold text-white">Top Pages</h2>
              <div class="space-y-3">
                <For each={topPages}>
                  {(page, index) => (
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-500">{index() + 1}.</span>
                        <span class="truncate text-sm text-gray-300" style={{ "max-width": "160px" }}>{page.page}</span>
                      </div>
                      <span class="text-sm font-medium text-white">{page.views}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* By Country */}
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 class="mb-4 text-lg font-semibold text-white">Visitors by Country</h2>
              <div class="space-y-3">
                <For each={countries}>
                  {(country) => (
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span class="text-sm text-gray-300">{country.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-white">{country.visitors}</span>
                        <span class="text-xs text-gray-500">({country.percentage}%)</span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const fullCode = `import { createSignal, For, Show } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import {
  ArrowDownIcon, ArrowUpIcon, CalendarIcon, CreditCard01Icon,
  Download01Icon, ShoppingCart01Icon, TrendUp01Icon, Users01Icon,
} from '@exowpee/solidly/icons';
import {
  CartesianGrid, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, XAxis, YAxis,
} from '@exowpee/solidly-pro';

export default function AnalyticsDashboard() {
  const metrics = [
    { label: 'Total Revenue', value: '$128,430', change: 12.5, icon: CreditCard01Icon },
    { label: 'Total Orders', value: '3,842', change: 8.2, icon: ShoppingCart01Icon },
    // ... more metrics with sparkline data
  ];

  const revenueData = [
    { date: 'Jan', revenue: 18500, profit: 8200, expenses: 10300 },
    // ... 12 months of data
  ];

  const trafficSources = [
    { name: 'Organic Search', visitors: 18420, percentage: 38, color: '#3b82f6' },
    // ... more sources
  ];

  // Mini sparkline SVG component
  const MiniSparkline = (props) => {
    const points = props.data.map((v, i) => \`\${x},\${y}\`).join(' ');
    return <svg><polyline points={points} stroke={props.color} /></svg>;
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white">
        <div class="flex h-16 items-center justify-between px-6">
          <h1 class="text-xl font-bold">Analytics</h1>
          <div class="flex gap-3">
            <Button color="light"><span class="flex items-center gap-2"><CalendarIcon class="size-4" /> Last 30 days</span></Button>
            <Button color="blue">Generate Report</Button>
          </div>
        </div>
        {/* Tab navigation */}
      </header>

      <main class="p-6">
        {/* Metrics grid with sparklines */}
        <div class="grid gap-4 lg:grid-cols-4">
          <For each={metrics}>{(m) => (
            <div class="rounded-xl border bg-white p-5">
              <p class="text-sm text-gray-500">{m.label}</p>
              <p class="text-2xl font-bold">{m.value}</p>
              <div class="flex justify-between">
                <span class={m.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {m.change >= 0 ? '+' : ''}{m.change}%
                </span>
                <MiniSparkline data={m.sparkline} />
              </div>
            </div>
          )}</For>
        </div>

        {/* LineChart + PieChart */}
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => \`$\${v/1000}k\`} />
                <Line dataKey="revenue" stroke="#3b82f6" />
                <Line dataKey="profit" stroke="#22c55e" />
                <Line dataKey="expenses" stroke="#f87171" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={trafficSources} dataKey="visitors" innerRadius={45} outerRadius={70} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products table */}
      </main>
    </div>
  );
}`;

const salesCode = `import { For } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import { ArrowUpIcon, CalendarIcon } from '@exowpee/solidly/icons';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, XAxis, YAxis,
} from '@exowpee/solidly-pro';

export default function SalesAnalytics() {
  const salesData = [
    { month: 'Jan', sales: 12400 },
    { month: 'Feb', sales: 14500 },
    // ... more data
  ];

  const dailySales = [
    { day: 'Mon', amount: 4200 },
    { day: 'Tue', amount: 3800 },
    // ... more data
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Revenue Hero Card */}
      <div class="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
        <p class="text-sm text-blue-100">Total Revenue</p>
        <p class="text-5xl font-bold">$114,700</p>
        <Badge color="success">+18.2%</Badge>
      </div>

      {/* Charts */}
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-xl bg-white/70 p-6 backdrop-blur-sm">
          <h2>Monthly Sales Trend</h2>
          <ResponsiveContainer>
            <LineChart data={salesData}>
              <CartesianGrid />
              <XAxis dataKey="month" />
              <YAxis />
              <Line dataKey="sales" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div class="rounded-xl bg-white/70 p-6 backdrop-blur-sm">
          <h2>Daily Performance</h2>
          <ResponsiveContainer>
            <BarChart data={dailySales}>
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales by Region + Transactions */}
    </div>
  );
}`;

const realtimeCode = `import { createSignal, For, Show } from 'solid-js';
import { Button } from '@exowpee/solidly';
import {
  ArrowUpIcon, ArrowDownIcon, CreditCard01Icon,
  Globe01Icon, RefreshCw01Icon, ShoppingCart01Icon, Users01Icon,
} from '@exowpee/solidly/icons';

export default function RealtimeAnalytics() {
  const [isLive] = createSignal(true);

  const liveMetrics = [
    { label: 'Active Users', value: '1,284', trend: 'up', change: 23 },
    { label: 'Page Views', value: '4,521', trend: 'up', change: 12 },
    // ... more metrics
  ];

  const liveActivity = [
    { type: 'purchase', user: 'John D.', action: 'completed purchase', amount: '$129.00', time: 'Just now', country: '🇺🇸' },
    { type: 'signup', user: 'Sarah M.', action: 'signed up', time: '2s ago', country: '🇬🇧' },
    // ... more activity
  ];

  return (
    <div class="min-h-screen bg-gray-950">
      <header class="border-b border-gray-800 px-6 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-white">Real-time Analytics</h1>
          <Show when={isLive()}>
            <div class="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1">
              <div class="size-2 animate-pulse rounded-full bg-green-500" />
              <span class="text-sm text-green-400">Live</span>
            </div>
          </Show>
        </div>
      </header>

      {/* Dark theme metrics cards */}
      <div class="grid gap-4 lg:grid-cols-4">
        <For each={liveMetrics}>{(metric) => (
          <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p class="text-sm text-gray-400">{metric.label}</p>
            <span class="text-3xl font-bold text-white">{metric.value}</span>
            <span class={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
              {metric.change}%
            </span>
          </div>
        )}</For>
      </div>

      {/* Live Activity Stream */}
      <div class="rounded-xl border border-gray-800 bg-gray-900">
        <For each={liveActivity}>{(activity) => (
          <div class="flex items-center gap-4 border-b border-gray-800 px-5 py-3">
            <div class="size-10 rounded-lg bg-green-500/20">
              <CreditCard01Icon class="text-green-400" />
            </div>
            <div>
              <p class="text-white">{activity.user} {activity.action}</p>
              <p class="text-xs text-gray-500">{activity.time}</p>
            </div>
            <span class="font-semibold text-green-400">{activity.amount}</span>
            <span>{activity.country}</span>
          </div>
        )}</For>
      </div>
    </div>
  );
}`;

// ============================================================================
// Export Page
// ============================================================================
export default function AnalyticsBlockPage() {
  return (
    <BlocksDocPage
      title="Analytics"
      description="Premium analytics dashboards with multi-line revenue charts, donut charts for traffic sources, KPI cards with sparklines, and real-time activity feeds. Built with LineChart, PieChart, BarChart, and ResponsiveContainer Pro components."
      category="Dashboard"
      isPro
      variants={[
        {
          id: 'full',
          title: 'Full Analytics',
          description:
            'Complete dashboard with revenue charts, traffic sources pie chart, metrics with sparklines, and top products table.',
          component: AnalyticsFull,
          code: fullCode,
        },
        {
          id: 'sales',
          title: 'Sales Focus',
          description:
            'Revenue-centric dashboard with hero card, monthly trends, daily bar chart, and regional breakdown.',
          component: AnalyticsSales,
          code: salesCode,
        },
        {
          id: 'realtime',
          title: 'Real-time',
          description:
            'Dark-themed live analytics with activity stream, live metrics, top pages, and visitor geography.',
          component: AnalyticsRealtime,
          code: realtimeCode,
        },
      ]}
      usedComponents={[
        { name: 'LineChart', path: '/components/line-chart', isPro: true },
        { name: 'PieChart', path: '/components/pie-chart', isPro: true },
        { name: 'BarChart', path: '/components/bar-chart', isPro: true },
        { name: 'ResponsiveContainer', path: '/components/responsive-container', isPro: true },
        { name: 'Button', path: '/components/button' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Admin Panel', path: '/blocks/dashboard/admin-panel', description: 'E-commerce admin with sidebar' },
        { name: 'Overview', path: '/blocks/dashboard/overview', description: 'Simple overview dashboard' },
      ]}
    />
  );
}

// Export components for iframe preview
export { AnalyticsFull, AnalyticsSales, AnalyticsRealtime };
