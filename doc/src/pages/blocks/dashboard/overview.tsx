import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Badge, Button } from '@exowpee/solidly';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BarChart01Icon,
  Bell01Icon,
  CalendarIcon,
  ChevronDownIcon,
  CreditCard01Icon,
  File02Icon,
  DotsHorizontalIcon,
  PlusIcon,
  ShoppingCart01Icon,
  TrendUp01Icon,
  User01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from '@exowpee/solidly-pro';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// Variant 1: Modern Card (Premium glassmorphism with gradient accents)
// ============================================================================
const OverviewModern = () => {
  const [greeting] = createSignal(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  const stats = [
    {
      title: 'Total Revenue',
      value: '$54,239',
      change: 12.5,
      trend: 'up' as const,
      icon: CreditCard01Icon,
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-500/10 to-cyan-400/10',
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: 8.2,
      trend: 'up' as const,
      icon: Users01Icon,
      gradient: 'from-violet-500 to-purple-400',
      bgGradient: 'from-violet-500/10 to-purple-400/10',
    },
    {
      title: 'Orders Today',
      value: '384',
      change: -3.1,
      trend: 'down' as const,
      icon: ShoppingCart01Icon,
      gradient: 'from-orange-500 to-amber-400',
      bgGradient: 'from-orange-500/10 to-amber-400/10',
    },
    {
      title: 'Conversion',
      value: '4.28%',
      change: 2.4,
      trend: 'up' as const,
      icon: TrendUp01Icon,
      gradient: 'from-green-500 to-emerald-400',
      bgGradient: 'from-green-500/10 to-emerald-400/10',
    },
  ];

  const quickActions = [
    { name: 'New Project', icon: PlusIcon, color: 'blue' },
    { name: 'Add User', icon: User01Icon, color: 'violet' },
    { name: 'Create Report', icon: File02Icon, color: 'orange' },
    { name: 'View Analytics', icon: BarChart01Icon, color: 'green' },
  ];

  const activities = [
    { id: 1, user: 'Sarah Wilson', action: 'created a new project', time: '2 min ago', avatar: 'SW' },
    { id: 2, user: 'Mike Johnson', action: 'uploaded 3 files', time: '5 min ago', avatar: 'MJ' },
    { id: 3, user: 'Emily Davis', action: 'completed a task', time: '12 min ago', avatar: 'ED' },
    { id: 4, user: 'John Smith', action: 'left a comment', time: '1 hour ago', avatar: 'JS' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Review Q4 report', due: 'Today, 3:00 PM', priority: 'high' },
    { id: 2, title: 'Team standup meeting', due: 'Today, 4:30 PM', priority: 'medium' },
    { id: 3, title: 'Submit project proposal', due: 'Tomorrow', priority: 'high' },
    { id: 4, title: 'Client presentation', due: 'Jan 25', priority: 'medium' },
  ];

  const chartData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 },
  ];

  return (
    <div class="min-h-full bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 p-6 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      {/* Header */}
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()()}, John!
          </h1>
          <p class="mt-1 text-gray-500 dark:text-gray-400">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div class="flex gap-3">
          <Button color="light" size="sm">
            <span class="flex items-center gap-2">
              <CalendarIcon class="size-4" />
              Last 7 days
              <ChevronDownIcon class="size-4" />
            </span>
          </Button>
          <Button color="info" size="sm">
            <span class="flex items-center gap-2">
              <PlusIcon class="size-4" />
              New Project
            </span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <For each={stats}>
          {(stat) => (
            <div class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-gray-300/50 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-900/70 dark:hover:border-gray-600/50">
              <div class={`absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br ${stat.bgGradient} blur-2xl transition-all group-hover:scale-110`} />
              <div class="relative flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div class="mt-2 flex items-center gap-1">
                    <Show
                      when={stat.trend === 'up'}
                      fallback={
                        <span class="flex items-center gap-0.5 text-sm font-medium text-red-600 dark:text-red-400">
                          <ArrowDownIcon class="size-3.5" />
                          {Math.abs(stat.change)}%
                        </span>
                      }
                    >
                      <span class="flex items-center gap-0.5 text-sm font-medium text-green-600 dark:text-green-400">
                        <ArrowUpIcon class="size-3.5" />
                        {stat.change}%
                      </span>
                    </Show>
                    <span class="text-xs text-gray-400 dark:text-gray-500">vs last week</span>
                  </div>
                </div>
                <div class={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Dynamic component={stat.icon} class="size-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Main Content Grid */}
      <div class="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div class="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm lg:col-span-2 dark:border-gray-700/50 dark:bg-gray-900/70">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Weekly Overview</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Performance metrics for this week</p>
            </div>
            <Button color="light" size="xs">View Details</Button>
          </div>
          <div class="h-[280px]">
            <ResponsiveContainer>
              {(size) => (
                <LineChart data={chartData} width={500} height={280} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Weekly overview chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Line dataKey="value" stroke="#3b82f6" strokeWidth={2} dot />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-3">
            <For each={quickActions}>
              {(action) => (
                <button class="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-center transition-all hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-gray-600 dark:hover:bg-gray-700/50">
                  <div class={`flex size-10 items-center justify-center rounded-lg bg-${action.color}-100 text-${action.color}-600 dark:bg-${action.color}-900/30 dark:text-${action.color}-400`}>
                    <Dynamic component={action.icon} class="size-5" />
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{action.name}</span>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <div class="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h2>
            <Badge color="default" size="sm">{upcomingTasks.length} tasks</Badge>
          </div>
          <div class="space-y-3">
            <For each={upcomingTasks}>
              {(task) => (
                <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700/50 dark:bg-gray-900/30">
                  <div class={`size-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{task.due}</p>
                  </div>
                  <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <DotsHorizontalIcon class="size-4" />
                  </button>
                </div>
              )}
            </For>
          </div>
          <Button color="light" class="mt-4 w-full">
            <span class="flex items-center gap-2">
              View all tasks
              <ArrowRightIcon class="size-4" />
            </span>
          </Button>
        </div>

        {/* Recent Activity */}
        <div class="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <Bell01Icon class="size-4" />
            </button>
          </div>
          <div class="space-y-4">
            <For each={activities}>
              {(activity) => (
                <div class="flex items-start gap-3">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
                    {activity.avatar}
                  </div>
                  <div class="flex-1 pt-0.5">
                    <p class="text-sm text-gray-900 dark:text-white">
                      <span class="font-medium">{activity.user}</span>{' '}
                      <span class="text-gray-500 dark:text-gray-400">{activity.action}</span>
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
          <Button color="light" class="mt-4 w-full">
            <span class="flex items-center gap-2">
              View all activity
              <ArrowRightIcon class="size-4" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 2: Compact (Dense layout with mini charts)
// ============================================================================
const OverviewCompact = () => {
  const stats = [
    { label: 'Revenue', value: '$48.2k', change: '+12%', color: 'blue' },
    { label: 'Orders', value: '1,429', change: '+8%', color: 'green' },
    { label: 'Visitors', value: '32.4k', change: '-3%', color: 'red' },
    { label: 'Conversion', value: '3.8%', change: '+5%', color: 'green' },
  ];

  const projects = [
    { name: 'Website Redesign', progress: 75, status: 'On Track', deadline: 'Jan 28' },
    { name: 'Mobile App', progress: 45, status: 'At Risk', deadline: 'Feb 15' },
    { name: 'API Integration', progress: 90, status: 'On Track', deadline: 'Jan 22' },
    { name: 'Dashboard v2', progress: 30, status: 'On Track', deadline: 'Mar 1' },
  ];

  const teamMembers = [
    { name: 'Alice', avatar: 'A', status: 'online' },
    { name: 'Bob', avatar: 'B', status: 'online' },
    { name: 'Charlie', avatar: 'C', status: 'away' },
    { name: 'Diana', avatar: 'D', status: 'offline' },
    { name: 'Eve', avatar: 'E', status: 'online' },
  ];

  const notifications = [
    { title: 'New message from Sarah', time: '2m', unread: true },
    { title: 'Project deadline reminder', time: '1h', unread: true },
    { title: 'System update completed', time: '3h', unread: false },
  ];

  return (
    <div class="min-h-full bg-gray-100 p-4 dark:bg-gray-900">
      {/* Compact Header */}
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <Badge color="success" size="sm">Live</Badge>
        </div>
        <div class="flex items-center gap-2">
          <Button color="light" size="xs">
            <span class="flex items-center gap-1.5">
              <CalendarIcon class="size-3.5" />
              Today
            </span>
          </Button>
          <Button color="info" size="xs">
            <span class="flex items-center gap-1.5">
              <PlusIcon class="size-3.5" />
              New
            </span>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div class="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <For each={stats}>
          {(stat) => (
            <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <div class="mt-1 flex items-baseline justify-between">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span class={`text-xs font-medium ${stat.color === 'green' ? 'text-green-600' : stat.color === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Main Grid */}
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Projects */}
        <div class="md:col-span-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-white">Projects</h2>
            <Button color="light" size="xs">View All</Button>
          </div>
          <div class="space-y-3">
            <For each={projects}>
              {(project) => (
                <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{project.name}</span>
                    <Badge
                      color={project.status === 'On Track' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        class={`h-full rounded-full ${project.status === 'On Track' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{project.progress}%</span>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-400">Due {project.deadline}</p>
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Team & Notifications */}
        <div class="space-y-4">
          {/* Team */}
          <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
            <h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Team</h2>
            <div class="flex -space-x-2">
              <For each={teamMembers}>
                {(member) => (
                  <div class="relative">
                    <div class="flex size-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-medium text-white dark:border-gray-800">
                      {member.avatar}
                    </div>
                    <div class={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                      member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                )}
              </For>
              <button class="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 dark:border-gray-600">
                <PlusIcon class="size-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900 dark:text-white">Alerts</h2>
              <Badge color="failure" size="sm">2</Badge>
            </div>
            <div class="space-y-2">
              <For each={notifications}>
                {(notif) => (
                  <div class={`flex items-center gap-2 rounded-lg p-2 text-sm ${notif.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <div class={`size-1.5 rounded-full ${notif.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span class="flex-1 truncate text-gray-700 dark:text-gray-300">{notif.title}</span>
                    <span class="text-xs text-gray-400">{notif.time}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <h2 class="mb-3 font-semibold text-gray-900 dark:text-white">Goals</h2>
          <div class="space-y-4">
            <div>
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Monthly Revenue</span>
                <span class="font-medium text-gray-900 dark:text-white">$48.2k / $60k</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-full w-[80%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>
            <div>
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">New Customers</span>
                <span class="font-medium text-gray-900 dark:text-white">342 / 500</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-full w-[68%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
              </div>
            </div>
            <div>
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                <span class="font-medium text-gray-900 dark:text-white">89 / 100</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-full w-[89%] rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 3: Focus View (Minimal with prominent main metric)
// ============================================================================
const OverviewFocus = () => {
  const [selectedMetric, setSelectedMetric] = createSignal('revenue');

  const mainMetrics = {
    revenue: { value: '$128,430', label: 'Total Revenue', change: 12.5, period: 'This month' },
    orders: { value: '3,842', label: 'Total Orders', change: 8.2, period: 'This month' },
    customers: { value: '12,847', label: 'Active Customers', change: 15.3, period: 'This month' },
  };

  const chartData = [
    { name: 'Week 1', revenue: 28500, orders: 842 },
    { name: 'Week 2', revenue: 32000, orders: 956 },
    { name: 'Week 3', revenue: 29800, orders: 891 },
    { name: 'Week 4', revenue: 38130, orders: 1153 },
  ];

  const topPerformers = [
    { name: 'MacBook Pro 16"', sales: 432, revenue: '$1.29M', icon: '💻' },
    { name: 'iPhone 15 Pro', sales: 856, revenue: '$941K', icon: '📱' },
    { name: 'AirPods Pro', sales: 1243, revenue: '$311K', icon: '🎧' },
  ];

  const recentOrders = [
    { id: '#12847', customer: 'John Smith', amount: '$432.00', status: 'completed' },
    { id: '#12846', customer: 'Sarah Johnson', amount: '$1,245.00', status: 'processing' },
    { id: '#12845', customer: 'Mike Brown', amount: '$89.00', status: 'completed' },
  ];

  const current = () => mainMetrics[selectedMetric() as keyof typeof mainMetrics];

  return (
    <div class="flex min-h-full flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header class="border-b border-gray-200 px-8 py-6 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
            <p class="mt-1 text-gray-500 dark:text-gray-400">Your business at a glance</p>
          </div>
          <div class="flex items-center gap-3">
            <Button color="light" size="sm">
              <span class="flex items-center gap-2">
                <CalendarIcon class="size-4" />
                This Month
              </span>
            </Button>
            <Button color="info" size="sm">Download Report</Button>
          </div>
        </div>

        {/* Metric Tabs */}
        <div class="mt-6 flex gap-2">
          <For each={Object.entries(mainMetrics)}>
            {([key, metric]) => (
              <button
                onClick={() => setSelectedMetric(key)}
                class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedMetric() === key
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {metric.label}
              </button>
            )}
          </For>
        </div>
      </header>

      {/* Main Content */}
      <div class="flex-1 p-8">
        {/* Focus Metric */}
        <div class="mb-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 dark:from-gray-900 dark:to-gray-900">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">{current().label}</p>
              <p class="mt-2 text-5xl font-bold text-white">{current().value}</p>
              <div class="mt-3 flex items-center gap-2">
                <Badge color="success" size="sm" class="gap-1">
                  <ArrowUpIcon class="size-3" />
                  {current().change}%
                </Badge>
                <span class="text-sm text-gray-400">vs last period</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-400">{current().period}</p>
              <div class="mt-4 flex -space-x-2">
                <div class="size-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-blue-500 to-purple-500" />
                <div class="size-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-green-500 to-teal-500" />
                <div class="size-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-orange-500 to-red-500" />
                <div class="flex size-8 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-700 text-xs text-white">
                  +5
                </div>
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div class="mt-8 h-[200px]">
            <ResponsiveContainer>
              {(size) => (
                <LineChart data={chartData} width={500} height={200} rwidth={size.rwidth} rheight={size.rheight} ariaLabel="Weekly trend chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Line dataKey={selectedMetric() === 'orders' ? 'orders' : 'revenue'} stroke="#3b82f6" strokeWidth={2} dot />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid */}
        <div class="grid gap-6 lg:grid-cols-2">
          {/* Top Performers */}
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900 dark:text-white">Top Products</h2>
              <Button color="light" size="xs">View All</Button>
            </div>
            <div class="space-y-4">
              <For each={topPerformers}>
                {(product, index) => (
                  <div class="flex items-center gap-4">
                    <span class="text-2xl">{product.icon}</span>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{product.sales} sales</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">{product.revenue}</p>
                      <p class="text-sm text-gray-400">#{index() + 1}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Recent Orders */}
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <Button color="light" size="xs">View All</Button>
            </div>
            <div class="space-y-3">
              <For each={recentOrders}>
                {(order) => (
                  <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                    <div class="flex items-center gap-3">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
                        <ShoppingCart01Icon class="size-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{order.id}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                      <Badge
                        color={order.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const modernCode = `import { createSignal, For, Show } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import {
  ArrowUpIcon, ArrowDownIcon, CalendarIcon, CreditCard01Icon,
  PlusIcon, TrendUp01Icon, Users01Icon, ShoppingCart01Icon,
} from '@exowpee/solidly/icons';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from '@exowpee/solidly-pro';

export default function OverviewDashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$54,239', change: 12.5, trend: 'up', icon: CreditCard01Icon, gradient: 'from-blue-500 to-cyan-400' },
    { title: 'Active Users', value: '2,847', change: 8.2, trend: 'up', icon: Users01Icon, gradient: 'from-violet-500 to-purple-400' },
    { title: 'Orders Today', value: '384', change: -3.1, trend: 'down', icon: ShoppingCart01Icon, gradient: 'from-orange-500 to-amber-400' },
    { title: 'Conversion', value: '4.28%', change: 2.4, trend: 'up', icon: TrendUp01Icon, gradient: 'from-green-500 to-emerald-400' },
  ];

  const chartData = [
    { name: 'Mon', value: 2400 }, { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 }, { name: 'Thu', value: 3908 },
    // ... more data
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Stats with glassmorphism cards */}
      <div class="grid gap-4 lg:grid-cols-4">
        <For each={stats}>
          {(stat) => (
            <div class="group relative overflow-hidden rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
              <div class={\`absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br \${stat.bgGradient} blur-2xl\`} />
              <div class="relative flex items-start justify-between">
                <div>
                  <p class="text-sm text-gray-500">{stat.title}</p>
                  <p class="mt-2 text-3xl font-bold">{stat.value}</p>
                  <span class={\`text-sm \${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}\`}>
                    {stat.trend === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />} {Math.abs(stat.change)}%
                  </span>
                </div>
                <div class={\`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br \${stat.gradient}\`}>
                  <Dynamic component={stat.icon} class="size-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Weekly Chart */}
      <div class="mt-6 rounded-2xl bg-white/70 p-6 backdrop-blur-sm lg:col-span-2">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Line dataKey="value" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions, Tasks, Activity */}
    </div>
  );
}`;

const compactCode = `import { For } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import { CalendarIcon, PlusIcon } from '@exowpee/solidly/icons';

export default function CompactDashboard() {
  const stats = [
    { label: 'Revenue', value: '$48.2k', change: '+12%', color: 'green' },
    { label: 'Orders', value: '1,429', change: '+8%', color: 'green' },
    { label: 'Visitors', value: '32.4k', change: '-3%', color: 'red' },
    { label: 'Conversion', value: '3.8%', change: '+5%', color: 'green' },
  ];

  const projects = [
    { name: 'Website Redesign', progress: 75, status: 'On Track' },
    { name: 'Mobile App', progress: 45, status: 'At Risk' },
  ];

  return (
    <div class="min-h-screen bg-gray-100 p-4">
      {/* Compact Stats Row */}
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <For each={stats}>
          {(stat) => (
            <div class="rounded-xl bg-white p-4">
              <p class="text-xs text-gray-500">{stat.label}</p>
              <div class="flex items-baseline justify-between">
                <span class="text-xl font-bold">{stat.value}</span>
                <span class={\`text-xs \${stat.color === 'green' ? 'text-green-600' : 'text-red-600'}\`}>
                  {stat.change}
                </span>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Projects with progress bars */}
      <div class="mt-4 rounded-xl bg-white p-4">
        <For each={projects}>
          {(project) => (
            <div class="rounded-lg bg-gray-50 p-3">
              <div class="flex items-center justify-between">
                <span class="font-medium">{project.name}</span>
                <Badge color={project.status === 'On Track' ? 'success' : 'warning'}>
                  {project.status}
                </Badge>
              </div>
              <div class="mt-2 h-1.5 rounded-full bg-gray-200">
                <div class="h-full rounded-full bg-green-500" style={{ width: \`\${project.progress}%\` }} />
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}`;

const focusCode = `import { createSignal, For } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import { ArrowUpIcon, CalendarIcon } from '@exowpee/solidly/icons';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from '@exowpee/solidly-pro';

export default function FocusDashboard() {
  const [selectedMetric, setSelectedMetric] = createSignal('revenue');

  const metrics = {
    revenue: { value: '$128,430', label: 'Total Revenue', change: 12.5 },
    orders: { value: '3,842', label: 'Total Orders', change: 8.2 },
    customers: { value: '12,847', label: 'Active Customers', change: 15.3 },
  };

  const chartData = [
    { name: 'Week 1', revenue: 28500, orders: 842 },
    { name: 'Week 2', revenue: 32000, orders: 956 },
  ];

  return (
    <div class="flex min-h-screen flex-col bg-white">
      {/* Metric Tabs */}
      <div class="flex gap-2 px-8 py-6">
        <For each={Object.entries(metrics)}>
          {([key, metric]) => (
            <button
              onClick={() => setSelectedMetric(key)}
              class={\`rounded-lg px-4 py-2 \${selectedMetric() === key ? 'bg-gray-900 text-white' : 'text-gray-600'}\`}
            >
              {metric.label}
            </button>
          )}
        </For>
      </div>

      {/* Focus Card with Dark Background */}
      <div class="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <p class="text-sm text-gray-400">{metrics[selectedMetric()].label}</p>
        <p class="mt-2 text-5xl font-bold text-white">{metrics[selectedMetric()].value}</p>
        <Badge color="success" size="sm">
          <ArrowUpIcon class="size-3" /> {metrics[selectedMetric()].change}%
        </Badge>

        {/* Chart inside dark card */}
        <div class="mt-8 h-[200px]">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Line dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}`;

// ============================================================================
// Export Page
// ============================================================================
export default function OverviewBlockPage() {
  return (
    <BlocksDocPage
      title="Overview"
      description="Premium dashboard overview pages with stats cards, charts, activity feeds, and quick actions. Perfect as a landing page after login."
      category="Dashboard"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Card',
          description:
            'Glassmorphism cards with gradient accents, weekly chart, quick actions, tasks, and activity feed.',
          component: OverviewModern,
          code: modernCode,
        },
        {
          id: 'compact',
          title: 'Compact',
          description:
            'Dense layout with mini stats, project progress bars, team avatars, and notification alerts.',
          component: OverviewCompact,
          code: compactCode,
        },
        {
          id: 'focus',
          title: 'Focus View',
          description:
            'Minimal design with prominent main metric, dark hero card, and switchable metric tabs.',
          component: OverviewFocus,
          code: focusCode,
        },
      ]}
      usedComponents={[
        { name: 'LineChart', path: '/components/line-chart', isPro: true },
        { name: 'ResponsiveContainer', path: '/components/responsive-container', isPro: true },
        { name: 'Button', path: '/components/button' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Analytics', path: '/blocks/dashboard/analytics', description: 'Full analytics dashboard' },
        { name: 'Admin Panel', path: '/blocks/dashboard/admin-panel', description: 'Admin dashboard with sidebar' },
      ]}
    />
  );
}

// Export components for iframe preview
export { OverviewModern, OverviewCompact, OverviewFocus };
