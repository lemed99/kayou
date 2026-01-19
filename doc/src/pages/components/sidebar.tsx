import { createSignal } from 'solid-js';

import { Sidebar, SidebarItem } from '@exowpee/solidly-pro';

import DocPage from '../../components/DocPage';

const HomeIcon = (props: { class: string }) => (
  <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const UsersIcon = (props: { class: string }) => (
  <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const SettingsIcon = (props: { class: string }) => (
  <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ChartIcon = (props: { class: string }) => (
  <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const basicItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, path: '#home', isActive: true },
  { id: 'users', label: 'Users', icon: UsersIcon, path: '#users' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '#settings' },
];

const itemsWithCollapse: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    path: '#dashboard',
    isActive: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: ChartIcon,
    children: [
      { id: 'overview', label: 'Overview', path: '#analytics/overview' },
      { id: 'reports', label: 'Reports', path: '#analytics/reports' },
      { id: 'realtime', label: 'Real-time', path: '#analytics/realtime' },
    ],
  },
  {
    id: 'users-section',
    label: 'Users',
    icon: UsersIcon,
    children: [
      { id: 'all-users', label: 'All Users', path: '#users/all' },
      { id: 'roles', label: 'Roles', path: '#users/roles' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '#settings' },
];

export default function SidebarPage() {
  const [isOpen1, setIsOpen1] = createSignal(true);
  const [isOpen2, setIsOpen2] = createSignal(true);
  const [isOpen3, setIsOpen3] = createSignal(false);

  return (
    <DocPage
      title="Sidebar"
      isPro
      description="Vertical navigation with nested collapsible sections. Features icon-only collapsed mode with popovers, animated transitions, and full keyboard/ARIA support."
      keyConcepts={[
        {
          term: 'Collapsible Mode',
          explanation:
            'The sidebar can toggle between full-width (with labels) and icon-only modes. When collapsed, nested items appear in popovers on hover, maintaining access to the full navigation structure.',
        },
        {
          term: 'Nested Navigation',
          explanation:
            'Items with children create collapsible sections. These expand inline when the sidebar is open, or appear as popovers when collapsed, supporting deep navigation hierarchies.',
        },
        {
          term: 'Links vs Actions',
          explanation:
            'Items with path render as anchor tags for navigation. Items with onClick render as buttons for actions (logout, open modal). This distinction is important for accessibility and SEO.',
        },
      ]}
      props={[
        {
          name: 'items',
          type: 'SidebarItem[]',
          default: '[]',
          description:
            'Array of navigation items. Each item can have label, icon, path, isActive, onClick, and nested children',
        },
        {
          name: 'isMobile',
          type: 'boolean',
          default: '-',
          description: 'Whether the sidebar is in mobile mode (required)',
        },
        {
          name: 'isSidebarOpen',
          type: 'boolean',
          default: 'true',
          description: 'Whether the sidebar is expanded or collapsed to icon-only mode',
        },
        {
          name: 'setIsSidebarOpen',
          type: 'Setter<boolean>',
          default: '-',
          description:
            'Setter function to toggle sidebar state. When provided, shows the toggle button',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Content to render in the sidebar header (e.g., logo, title)',
        },
        {
          name: 'innerClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the inner scrollable container',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the sidebar root element',
        },
      ]}
      examples={[
        {
          title: 'Basic Sidebar',
          description: 'Simple sidebar with navigation items and icons.',
          code: `const items = [
  { id: 'home', label: 'Home', icon: HomeIcon, path: '/home', isActive: true },
  { id: 'users', label: 'Users', icon: UsersIcon, path: '/users' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-64 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
              <Sidebar items={basicItems} isMobile={false} />
            </div>
          ),
        },
        {
          title: 'With Header and Toggle',
          description: 'Sidebar with header content and collapsible toggle button.',
          code: `const [isOpen, setIsOpen] = createSignal(true);

<Sidebar
  items={items}
  isMobile={false}
  isSidebarOpen={isOpen()}
  setIsSidebarOpen={setIsOpen}
>
  <span class="font-bold text-lg">My App</span>
</Sidebar>`,
          component: () => (
            <div class="h-64 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-800">
              <Sidebar
                items={basicItems}
                isMobile={false}
                isSidebarOpen={isOpen1()}
                setIsSidebarOpen={setIsOpen1}
              >
                <span class="text-lg font-bold">My App</span>
              </Sidebar>
            </div>
          ),
        },
        {
          title: 'Collapsible Sections',
          description: 'Sidebar with nested items that expand/collapse.',
          code: `const items = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: ChartIcon,
    children: [
      { id: 'overview', label: 'Overview', path: '/analytics/overview' },
      { id: 'reports', label: 'Reports', path: '/analytics/reports' },
    ],
  },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-80 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-800">
              <Sidebar
                items={itemsWithCollapse}
                isMobile={false}
                isSidebarOpen={isOpen2()}
                setIsSidebarOpen={setIsOpen2}
              >
                <span class="text-lg font-bold">Dashboard</span>
              </Sidebar>
            </div>
          ),
        },
        {
          title: 'Collapsed Mode with Popovers',
          description: 'When collapsed, nested items appear in popovers on hover.',
          code: `<Sidebar
  items={itemsWithNested}
  isMobile={false}
  isSidebarOpen={false}
  setIsSidebarOpen={setIsOpen}
/>`,
          component: () => (
            <div class="h-80 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-800">
              <Sidebar
                items={itemsWithCollapse}
                isMobile={false}
                isSidebarOpen={isOpen3()}
                setIsSidebarOpen={setIsOpen3}
              >
                <span class="text-lg font-bold">App</span>
              </Sidebar>
            </div>
          ),
        },
        {
          title: 'Click Actions',
          description: 'Items can use onClick instead of path for custom actions.',
          code: `const items = [
  {
    id: 'action',
    label: 'Click Action',
    icon: SettingsIcon,
    onClick: () => alert('Clicked!'),
  },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-48 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
              <Sidebar
                items={[
                  {
                    id: 'action1',
                    label: 'Show Alert',
                    icon: SettingsIcon,
                    onClick: () => alert('Button clicked!'),
                  },
                  {
                    id: 'link1',
                    label: 'Go to Home',
                    icon: HomeIcon,
                    path: '#home',
                  },
                ]}
                isMobile={false}
              />
            </div>
          ),
        },
      ]}
      usage={`import { Sidebar, SidebarItem } from '@exowpee/solidly';

// Define navigation items
const items: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    path: '/home',
    isActive: true,
  },
  {
    id: 'users',
    label: 'Users',
    icon: UsersIcon,
    path: '/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    children: [
      { id: 'profile', label: 'Profile', path: '/settings/profile' },
      { id: 'security', label: 'Security', path: '/settings/security' },
    ],
  },
];

// Basic usage
<Sidebar items={items} isMobile={false} />

// With header and toggle
const [isOpen, setIsOpen] = createSignal(true);

<Sidebar
  items={items}
  isMobile={false}
  isSidebarOpen={isOpen()}
  setIsSidebarOpen={setIsOpen}
>
  <img src="/logo.svg" alt="Logo" class="h-8" />
</Sidebar>

// With click handlers instead of paths
const actionItems: SidebarItem[] = [
  {
    id: 'logout',
    label: 'Logout',
    icon: LogoutIcon,
    onClick: () => handleLogout(),
  },
];

// SidebarItem interface
interface SidebarItem {
  id: string;           // Unique identifier (required)
  label: JSX.Element;   // Display label
  icon?: Component;     // Optional icon component
  path?: string;        // Navigation URL (renders as link)
  isActive?: boolean;   // Whether item is currently active
  onClick?: Function;   // Click handler (renders as button when no path)
  children?: SidebarItem[]; // Nested items (creates collapsible section)
  class?: string;       // Additional CSS classes
}`}
    />
  );
}
