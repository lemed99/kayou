import { createSignal, For, Show } from 'solid-js';
import { Badge, Button, Popover } from '@exowpee/solidly';
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  Edit02Icon,
  FilterLinesIcon,
  FolderIcon,
  Grid01Icon,
  ListIcon,
  DotsHorizontalIcon,
  PlusIcon,
  SearchMdIcon,
  Trash01Icon,
  User01Icon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'In Progress' | 'Planning' | 'Completed' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  dueDate: string;
  progress?: number;
  tags?: string[];
  category?: string;
}

const projectsData: Project[] = [
  { id: 1, title: 'Website Redesign', description: 'Complete overhaul of the company website with new branding and improved UX', status: 'In Progress', priority: 'High', assignee: 'Olivia Martin', dueDate: 'Jan 15, 2025', progress: 65, tags: ['Design', 'Frontend'], category: 'Development' },
  { id: 2, title: 'Mobile App Development', description: 'Build native iOS and Android apps for customer portal with push notifications', status: 'Planning', priority: 'Medium', assignee: 'Jackson Lee', dueDate: 'Feb 28, 2025', progress: 15, tags: ['Mobile', 'Backend'], category: 'Development' },
  { id: 3, title: 'Database Migration', description: 'Migrate from PostgreSQL to distributed database system for better scalability', status: 'Completed', priority: 'High', assignee: 'Isabella Nguyen', dueDate: 'Dec 1, 2024', progress: 100, tags: ['Infrastructure'], category: 'Operations' },
  { id: 4, title: 'API Integration', description: 'Integrate third-party payment gateway and CRM system for seamless data flow', status: 'In Progress', priority: 'Low', assignee: 'William Kim', dueDate: 'Jan 30, 2025', progress: 40, tags: ['Backend', 'Integration'], category: 'Development' },
  { id: 5, title: 'Security Audit', description: 'Comprehensive security assessment and penetration testing of all systems', status: 'On Hold', priority: 'High', assignee: 'Sofia Davis', dueDate: 'Mar 15, 2025', progress: 0, tags: ['Security'], category: 'Operations' },
  { id: 6, title: 'Marketing Campaign', description: 'Q1 digital marketing campaign including social media and email outreach', status: 'Planning', priority: 'Medium', assignee: 'Liam Johnson', dueDate: 'Jan 20, 2025', progress: 25, tags: ['Marketing'], category: 'Marketing' },
  { id: 7, title: 'Performance Optimization', description: 'Optimize application performance and reduce load times by 50%', status: 'In Progress', priority: 'Medium', assignee: 'Emma Wilson', dueDate: 'Feb 10, 2025', progress: 55, tags: ['Backend', 'Frontend'], category: 'Development' },
  { id: 8, title: 'Documentation Update', description: 'Update all technical documentation and create onboarding guides', status: 'Completed', priority: 'Low', assignee: 'Noah Brown', dueDate: 'Dec 20, 2024', progress: 100, tags: ['Documentation'], category: 'Operations' },
];

// ============================================================================
// Variant 1: Modern Card Layout
// ============================================================================
const ListViewModern = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filterStatus, setFilterStatus] = createSignal<string | null>(null);
  const [filterPriority, setFilterPriority] = createSignal<string | null>(null);

  const getStatusColor = (status: string): 'success' | 'default' | 'warning' | 'gray' => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'default';
      case 'Planning': return 'warning';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string): 'failure' | 'warning' | 'gray' => {
    switch (priority) {
      case 'High': return 'failure';
      case 'Medium': return 'warning';
      default: return 'gray';
    }
  };

  const filteredProjects = () => {
    let filtered = projectsData;
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }
    if (filterStatus()) filtered = filtered.filter(p => p.status === filterStatus());
    if (filterPriority()) filtered = filtered.filter(p => p.priority === filterPriority());
    return filtered;
  };

  const stats = {
    total: projectsData.length,
    inProgress: projectsData.filter(p => p.status === 'In Progress').length,
    completed: projectsData.filter(p => p.status === 'Completed').length,
    planning: projectsData.filter(p => p.status === 'Planning').length,
  };

  return (
    <div class="min-h-full bg-gray-50 p-6 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <div class="rounded-xl bg-violet-600 p-2.5 shadow-lg shadow-violet-500/25">
                <FolderIcon class="size-5 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Manage and track all your ongoing projects
                </p>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <Popover
              position="bottom-end"
              content={
                <div class="w-56 p-4">
                  <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                  <div class="mb-4 flex flex-wrap gap-2">
                    <For each={['In Progress', 'Planning', 'Completed', 'On Hold']}>
                      {(status) => (
                        <button
                          onClick={() => setFilterStatus(filterStatus() === status ? null : status)}
                          class={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            filterStatus() === status
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {status}
                        </button>
                      )}
                    </For>
                  </div>
                  <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Priority</p>
                  <div class="flex flex-wrap gap-2">
                    <For each={['High', 'Medium', 'Low']}>
                      {(priority) => (
                        <button
                          onClick={() => setFilterPriority(filterPriority() === priority ? null : priority)}
                          class={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            filterPriority() === priority
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {priority}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              }
            >
              <Button color="light" size="sm">
                <span class="flex items-center gap-2">
                  <FilterLinesIcon class="size-4" />
                  Filter
                </span>
              </Button>
            </Popover>
            <Button color="blue" size="sm" class="shadow-lg shadow-blue-500/25">
              <span class="flex items-center gap-2">
                <PlusIcon class="size-4" />
                New Project
              </span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <For each={[
            { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: 'Completed', value: stats.completed, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
            { label: 'Planning', value: stats.planning, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
          ]}>
            {(stat) => (
              <div class="rounded-xl border border-gray-200 bg-white p-4  dark:border-gray-700/50 dark:bg-gray-900/50">
                <p class="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <div class="relative">
          <SearchMdIcon class="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400  transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* Project Cards */}
      <div class="space-y-4">
        <For each={filteredProjects()}>
          {(project) => (
            <div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm  transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-900/50 dark:hover:border-blue-600/50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {project.title}
                    </h3>
                    <Badge color={getStatusColor(project.status)} size="sm">
                      {project.status}
                    </Badge>
                    <Badge color={getPriorityColor(project.priority)} size="sm">
                      {project.priority}
                    </Badge>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <Show when={project.tags && project.tags.length > 0}>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <For each={project.tags}>
                        {(tag) => (
                          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {tag}
                          </span>
                        )}
                      </For>
                    </div>
                  </Show>

                  {/* Progress Bar */}
                  <Show when={project.progress !== undefined}>
                    <div class="mt-4">
                      <div class="mb-1 flex items-center justify-between text-sm">
                        <span class="text-gray-500 dark:text-gray-400">Progress</span>
                        <span class="font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </Show>

                  <div class="mt-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center gap-2">
                      <User01Icon class="size-4" />
                      {project.assignee}
                    </div>
                    <div class="flex items-center gap-2">
                      <CalendarIcon class="size-4" />
                      Due {project.dueDate}
                    </div>
                  </div>
                </div>

                <Popover
                  position="bottom-end"
                  content={
                    <div class="w-40 p-1.5">
                      <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        <Edit02Icon class="size-4" />
                        Edit
                      </button>
                      <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                        <Trash01Icon class="size-4" />
                        Delete
                      </button>
                    </div>
                  }
                >
                  <button class="rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <DotsHorizontalIcon class="size-5" />
                  </button>
                </Popover>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Load More */}
      <div class="mt-6 flex justify-center">
        <Button color="light">
          <span class="flex items-center gap-2">
            Load More
            <ArrowRightIcon class="size-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 2: Grid Layout with Thumbnails
// ============================================================================
const ListViewGrid = () => {
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = createSignal('');

  const getStatusColor = (status: string): 'success' | 'default' | 'warning' | 'gray' => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'default';
      case 'Planning': return 'warning';
      default: return 'gray';
    }
  };

  const filteredProjects = () => {
    if (!searchQuery()) return projectsData;
    const query = searchQuery().toLowerCase();
    return projectsData.filter(p => p.title.toLowerCase().includes(query));
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Development': return 'bg-blue-600';
      case 'Marketing': return 'bg-pink-600';
      case 'Operations': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div class="min-h-full bg-gray-50 p-6 dark:bg-gray-900">
      {/* Header */}
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filteredProjects().length} projects in your workspace
          </p>
        </div>
        <div class="flex items-center gap-3">
          {/* View Toggle */}
          <div class="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => setViewMode('grid')}
              class={`rounded-md p-2 transition-colors ${
                viewMode() === 'grid'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid01Icon class="size-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              class={`rounded-md p-2 transition-colors ${
                viewMode() === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <ListIcon class="size-4" />
            </button>
          </div>
          <Button color="blue" size="sm">
            <span class="flex items-center gap-2">
              <PlusIcon class="size-4" />
              New Project
            </span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <div class="relative">
          <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full max-w-md rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Grid/List View */}
      <Show when={viewMode() === 'grid'}>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={filteredProjects()}>
            {(project) => (
              <div class="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600">
                {/* Thumbnail Header */}
                <div class={`relative h-32 ${getCategoryColor(project.category)}`}>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <FolderIcon class="size-12 text-white/30" />
                  </div>
                  <div class="absolute bottom-3 left-3">
                    <span class="rounded-full bg-black/20 px-2.5 py-1 text-xs font-medium text-white">
                      {project.category || 'General'}
                    </span>
                  </div>
                  <div class="absolute right-3 top-3">
                    <Badge color={getStatusColor(project.status)} size="sm">
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {project.title}
                  </h3>
                  <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>

                  {/* Progress */}
                  <Show when={project.progress !== undefined}>
                    <div class="mt-3">
                      <div class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class={`h-full rounded-full ${getCategoryColor(project.category)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.progress}% complete</p>
                    </div>
                  </Show>

                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <User01Icon class="size-3.5" />
                      {project.assignee.split(' ')[0]}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon class="size-3.5" />
                      {project.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={viewMode() === 'list'}>
        <div class="space-y-3">
          <For each={filteredProjects()}>
            {(project) => (
              <div class="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600">
                {/* Avatar */}
                <div class={`flex size-12 shrink-0 items-center justify-center rounded-xl ${getCategoryColor(project.category)}`}>
                  <FolderIcon class="size-6 text-white" />
                </div>

                {/* Content */}
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="truncate font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {project.title}
                    </h3>
                    <Badge color={getStatusColor(project.status)} size="sm">
                      {project.status}
                    </Badge>
                  </div>
                  <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>

                {/* Progress */}
                <div class="hidden w-32 shrink-0 sm:block">
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      class={`h-full rounded-full ${getCategoryColor(project.category)}`}
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.progress || 0}%</p>
                </div>

                {/* Meta */}
                <div class="hidden shrink-0 text-right text-sm sm:block">
                  <p class="font-medium text-gray-900 dark:text-white">{project.assignee}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Due {project.dueDate}</p>
                </div>

                {/* Action */}
                <button class="shrink-0 rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700">
                  <ArrowRightIcon class="size-5" />
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

// ============================================================================
// Variant 3: Compact Kanban-style List
// ============================================================================
const ListViewCompact = () => {
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);

  const categories = [...new Set(projectsData.map(p => p.category).filter(Boolean))] as string[];

  const filteredProjects = () => {
    if (!selectedCategory()) return projectsData;
    return projectsData.filter(p => p.category === selectedCategory());
  };

  const groupedByStatus = () => {
    const groups: Record<string, Project[]> = {
      'In Progress': [],
      'Planning': [],
      'Completed': [],
      'On Hold': [],
    };
    filteredProjects().forEach(p => {
      if (groups[p.status]) groups[p.status].push(p);
    });
    return groups;
  };

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <header class="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Projects</h1>
          <Button color="dark" size="sm">
            <span class="flex items-center gap-2">
              <PlusIcon class="size-4" />
              New
            </span>
          </Button>
        </div>

        {/* Category Tabs */}
        <div class="mt-4 flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            class={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              !selectedCategory()
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <For each={categories}>
            {(cat) => (
              <button
                onClick={() => setSelectedCategory(cat)}
                class={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory() === cat
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            )}
          </For>
        </div>
      </header>

      {/* Compact List by Status */}
      <div class="p-6">
        <For each={Object.entries(groupedByStatus())}>
          {([status, projects]) => (
            <Show when={projects.length > 0}>
              <div class="mb-6">
                <div class="mb-3 flex items-center gap-2">
                  <span class={`size-2 rounded-full ${
                    status === 'In Progress' ? 'bg-blue-500' :
                    status === 'Completed' ? 'bg-green-500' :
                    status === 'Planning' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</h2>
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {projects.length}
                  </span>
                </div>

                <div class="space-y-2">
                  <For each={projects}>
                    {(project) => (
                      <div class="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 transition-colors hover:border-gray-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:bg-gray-800">
                        <div class="flex items-center gap-3">
                          <Show when={project.status === 'Completed'}>
                            <CheckCircleIcon class="size-5 text-green-500" />
                          </Show>
                          <Show when={project.status !== 'Completed'}>
                            <div class="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                          </Show>
                          <div>
                            <p class={`font-medium ${
                              project.status === 'Completed'
                                ? 'text-gray-400 line-through dark:text-gray-500'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {project.title}
                            </p>
                            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{project.assignee.split(' ')[0]}</span>
                              <span>·</span>
                              <span>{project.dueDate}</span>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-2">
                          <Show when={project.priority === 'High'}>
                            <span class="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              High
                            </span>
                          </Show>
                          <button class="rounded p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700">
                            <DotsHorizontalIcon class="size-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const listViewModernCode = `import { createSignal, For, Show } from 'solid-js';
import { Badge, Button, Popover } from '@exowpee/solidly';
import { FolderIcon, PlusIcon, SearchMdIcon, CalendarIcon, User01Icon } from '@exowpee/solidly/icons';

export default function ListViewModern() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filterStatus, setFilterStatus] = createSignal(null);

  const projects = [...]; // Your project data

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      {/* Header with gradient icon */}
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-violet-600 p-2.5 shadow-lg">
          <FolderIcon class="size-5 text-white" />
        </div>
        <h1 class="text-2xl font-bold">Projects</h1>
      </div>

      {/* Stats Cards */}
      <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 ">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-2xl font-bold">8</p>
        </div>
        {/* More stats... */}
      </div>

      {/* Project Cards with Progress */}
      <div class="space-y-4">
        <For each={projects}>
          {(project) => (
            <div class="rounded-2xl border border-gray-200 bg-white p-6 ">
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {/* Progress Bar */}
              <div class="mt-4 h-2 rounded-full bg-gray-200">
                <div class="h-full rounded-full bg-blue-500"
                  style={{ width: \`\${project.progress}%\` }} />
              </div>

              <div class="mt-4 flex items-center gap-6 text-sm">
                <span><User01Icon /> {project.assignee}</span>
                <span><CalendarIcon /> {project.dueDate}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}`;

const listViewGridCode = `import { createSignal, For, Show } from 'solid-js';
import { Badge, Button } from '@exowpee/solidly';
import { Grid01Icon, ListIcon, FolderIcon } from '@exowpee/solidly/icons';

export default function ListViewGrid() {
  const [viewMode, setViewMode] = createSignal('grid');

  return (
    <div class="p-6">
      {/* View Toggle */}
      <div class="flex rounded-lg border bg-white p-1">
        <button onClick={() => setViewMode('grid')} class={viewMode() === 'grid' ? 'bg-blue-100 text-blue-600' : ''}>
          <Grid01Icon />
        </button>
        <button onClick={() => setViewMode('list')} class={viewMode() === 'list' ? 'bg-blue-100 text-blue-600' : ''}>
          <ListIcon />
        </button>
      </div>

      {/* Grid View */}
      <Show when={viewMode() === 'grid'}>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={projects}>
            {(project) => (
              <div class="overflow-hidden rounded-xl border bg-white">
                {/* Gradient Header */}
                <div class="h-32 bg-blue-600">
                  <span class="rounded-full bg-black/20 px-2 py-1 text-xs text-white">{project.category}</span>
                </div>
                <div class="p-4">
                  <h3>{project.title}</h3>
                  <div class="h-1.5 rounded-full bg-gray-200">
                    <div class="h-full bg-blue-500" />
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}`;

const listViewCompactCode = `import { createSignal, For, Show } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { CheckCircleIcon, PlusIcon, DotsHorizontalIcon } from '@exowpee/solidly/icons';

export default function ListViewCompact() {
  const [selectedCategory, setSelectedCategory] = createSignal(null);

  const groupedByStatus = () => {
    // Group projects by status
    return { 'In Progress': [...], 'Completed': [...] };
  };

  return (
    <div class="min-h-screen bg-white">
      {/* Header with Category Tabs */}
      <header class="border-b px-6 py-4">
        <div class="flex gap-2">
          <button onClick={() => setSelectedCategory(null)}
            class={!selectedCategory() ? 'bg-gray-900 text-white' : ''}>
            All
          </button>
          {categories.map(cat => (
            <button onClick={() => setSelectedCategory(cat)}
              class={selectedCategory() === cat ? 'bg-gray-900 text-white' : ''}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grouped Tasks */}
      {Object.entries(groupedByStatus()).map(([status, projects]) => (
        <div class="mb-6">
          <h2 class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-blue-500" />
            {status} <span class="text-xs">({projects.length})</span>
          </h2>
          {projects.map(project => (
            <div class="flex items-center gap-3 rounded-lg border p-3">
              <Show when={project.status === 'Completed'}>
                <CheckCircleIcon class="text-green-500" />
              </Show>
              <p class={project.status === 'Completed' ? 'line-through' : ''}>
                {project.title}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}`;

export default function ListViewBlockPage() {
  return (
    <BlocksDocPage
      title="List View"
      description="Premium list views with multiple layouts: modern cards with progress indicators, grid view with thumbnails and view toggle, or compact kanban-style grouped lists."
      category="Data Management"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Card Layout',
          description: 'Glassmorphism cards with progress bars, tags, and filter popover.',
          component: ListViewModern,
          code: listViewModernCode,
        },
        {
          id: 'grid',
          title: 'Grid with Thumbnails',
          description: 'Toggle between grid and list view with gradient thumbnails.',
          component: ListViewGrid,
          code: listViewGridCode,
        },
        {
          id: 'compact',
          title: 'Compact Grouped',
          description: 'Minimal list grouped by status with category tabs.',
          component: ListViewCompact,
          code: listViewCompactCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'Badge', path: '/components/badge' },
        { name: 'Popover', path: '/components/popover' },
      ]}
      relatedBlocks={[
        { name: 'Table View', path: '/blocks/data-management/table-view', description: 'Traditional table layout with DataTable' },
        { name: 'Search & Filter', path: '/blocks/data-management/search-filter', description: 'Search and filter interface' },
        { name: 'CRUD Interface', path: '/blocks/data-management/crud-interface', description: 'Create, read, update, delete operations' },
      ]}
    />
  );
}

// Export components for iframe preview
export { ListViewModern, ListViewGrid, ListViewCompact };
