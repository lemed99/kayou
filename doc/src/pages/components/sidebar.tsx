import { createSignal } from 'solid-js';

import { Sidebar, type SidebarItem } from '@exowpee/solidly-pro';
import {
  BarChart01Icon,
  BookOpen01Icon,
  Headphones01Icon,
  HelpCircleIcon,
  Home01Icon,
  Mail01Icon,
  SearchSmIcon,
  Settings01Icon,
  Star01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';

import DocPage from '../../components/DocPage';

const basicItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home01Icon, path: '#home', isActive: true },
  { id: 'users', label: 'Users', icon: Users01Icon, path: '#users' },
  { id: 'settings', label: 'Settings', icon: Settings01Icon, path: '#settings' },
];

const itemsWithCollapse: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home01Icon,
    path: '#dashboard',
    isActive: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart01Icon,
    children: [
      { id: 'overview', label: 'Overview', path: '#analytics/overview' },
      { id: 'reports', label: 'Reports', path: '#analytics/reports' },
      { id: 'realtime', label: 'Real-time', path: '#analytics/realtime' },
    ],
  },
  {
    id: 'users-section',
    label: 'Users',
    icon: Users01Icon,
    children: [
      { id: 'all-users', label: 'All Users', path: '#users/all' },
      { id: 'roles', label: 'Roles', path: '#users/roles' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: Settings01Icon, path: '#settings' },
];

const itemsWithBadges: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home01Icon, path: '#home', isActive: true },
  { id: 'users', label: 'Users', icon: Users01Icon, path: '#users', badge: 12 },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings01Icon,
    path: '#settings',
    badge: '+8',
  },
];

const itemsWithPinnable: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home01Icon,
    path: '#dashboard',
    isActive: true,
    pinnable: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart01Icon,
    children: [
      { id: 'overview', label: 'Overview', path: '#analytics/overview', pinnable: true },
      { id: 'reports', label: 'Reports', path: '#analytics/reports', pinnable: true },
      { id: 'realtime', label: 'Real-time', path: '#analytics/realtime', pinnable: true },
    ],
  },
  {
    id: 'users-section',
    label: 'Users',
    icon: Users01Icon,
    children: [
      { id: 'all-users', label: 'All Users', path: '#users/all', pinnable: true },
      { id: 'roles', label: 'Roles', path: '#users/roles', pinnable: true },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings01Icon,
    path: '#settings',
    pinnable: true,
  },
];

const footerItems: SidebarItem[] = [
  { id: 'help', label: 'Help & Support', icon: HelpCircleIcon, path: '#help' },
  { id: 'contact', label: 'Contact us', icon: Headphones01Icon, path: '#contact' },
];

// Full layout example data
const fullLayoutItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home01Icon,
    path: '#home',
    isActive: true,
    pinnable: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart01Icon,
    children: [
      { id: 'overview', label: 'Overview', path: '#analytics/overview', pinnable: true },
      {
        id: 'reports',
        label: 'Reports',
        path: '#analytics/reports',
        pinnable: true,
        badge: 5,
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users01Icon,
    children: [
      {
        id: 'all-users',
        label: 'All Users',
        path: '#users/all',
        pinnable: true,
        badge: 12,
      },
      { id: 'roles', label: 'Roles', path: '#users/roles', pinnable: true },
    ],
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: Mail01Icon,
    path: '#messages',
    badge: 3,
    pinnable: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings01Icon,
    path: '#settings',
    pinnable: true,
  },
];

const fullLayoutHeaderItems: SidebarItem[] = [
  { id: 'search', label: 'Search', icon: SearchSmIcon, path: '#search' },
  { id: 'favorites', label: 'Favorites', icon: Star01Icon, path: '#favorites' },
];

const fullLayoutFooterItems: SidebarItem[] = [
  { id: 'docs', label: 'Documentation', icon: BookOpen01Icon, path: '#docs' },
  { id: 'help', label: 'Help & Support', icon: HelpCircleIcon, path: '#help' },
];

const PromoCard = () => (
  <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-2 flex items-center justify-between">
      <span class="font-semibold text-gray-900 dark:text-white">5 Days left!</span>
      <button
        type="button"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="mb-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div class="h-1.5 w-3/4 rounded-full bg-amber-400" />
    </div>
    <p class="text-xs text-wrap text-gray-500 dark:text-gray-400">
      Trial ending soon. Upgrade to stay active.
    </p>
  </div>
);

export default function SidebarPage() {
  const [isOpen1, setIsOpen1] = createSignal(true);
  const [isOpen2, setIsOpen2] = createSignal(true);
  const [isOpen3, setIsOpen3] = createSignal(false);
  const [isOpen4, setIsOpen4] = createSignal(true);
  const [isOpen5, setIsOpen5] = createSignal(true);
  const [isOpenFull, setIsOpenFull] = createSignal(true);

  return (
    <DocPage
      title="Sidebar"
      isPro
      description="Vertical navigation with nested collapsible sections. Features icon-only collapsed mode with popovers, animated transitions, and full keyboard/ARIA support."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for collapse/expand animations',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Collapsible Mode',
          explanation:
            'Toggle between full-width and icon-only; nested items show in popovers.',
        },
        {
          term: 'Nested Navigation',
          explanation: 'Children create collapsible sections or popovers when collapsed.',
        },
        {
          term: 'Links vs Actions',
          explanation: 'path renders anchor tags; onClick renders buttons.',
        },
        {
          term: 'Notification Badges',
          explanation: 'Display counts or labels (e.g., "+8") next to menu items.',
        },
        {
          term: 'Header Section',
          explanation:
            'Fixed area at top with logo, custom content, header menu items, and pinned items. Optionally separated from body by a border (showHeaderBorder).',
        },
        {
          term: 'Pinned Items',
          explanation:
            'Pin menu items (without children) to the header for quick access. Stored in localStorage when pinnedStorageKey is set.',
        },
        {
          term: 'Footer Section',
          explanation:
            'Add menu items and custom content (e.g., promo cards) at the bottom. Optionally separated from body by a border (showFooterBorder).',
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
        {
          name: 'headerContent',
          type: 'JSX.Element',
          default: '-',
          description:
            'Custom content to render in the header section (below logo, above header menu items)',
        },
        {
          name: 'headerItems',
          type: 'SidebarItem[]',
          default: '[]',
          description: 'Menu items to render in the header section (above pinned items)',
        },
        {
          name: 'footerContent',
          type: 'JSX.Element',
          default: '-',
          description:
            'Custom content to render above footer menu items (e.g., promo cards)',
        },
        {
          name: 'footerItems',
          type: 'SidebarItem[]',
          default: '[]',
          description: 'Menu items to render in the footer section',
        },
        {
          name: 'pinnedItems',
          type: 'string[]',
          default: '-',
          description: 'Array of pinned item IDs (controlled mode)',
        },
        {
          name: 'onPinnedChange',
          type: '(pinnedIds: string[]) => void',
          default: '-',
          description: 'Callback when pinned items change',
        },
        {
          name: 'pinnedLabel',
          type: 'string',
          default: '"Pinned"',
          description: 'Label for the pinned section',
        },
        {
          name: 'pinnedStorageKey',
          type: 'string',
          default: '-',
          description:
            'LocalStorage key for persisting pinned items. When provided, pinned items are automatically saved and restored.',
        },
        {
          name: 'showHeaderBorder',
          type: 'boolean',
          default: 'true',
          description: 'Whether to show the border between header and body sections.',
        },
        {
          name: 'showFooterBorder',
          type: 'boolean',
          default: 'true',
          description: 'Whether to show the border between body and footer sections.',
        },
      ]}
      subComponents={[
        {
          name: 'SidebarItem',
          description: 'Configuration object for sidebar menu items',
          props: [
            {
              name: 'id',
              type: 'string',
              default: '-',
              description: 'Unique identifier (required)',
            },
            {
              name: 'label',
              type: 'JSX.Element',
              default: '-',
              description: 'Display label',
            },
            {
              name: 'icon',
              type: '(props: { class: string }) => JSX.Element',
              default: '-',
              description: 'Optional icon component',
            },
            {
              name: 'path',
              type: 'string',
              default: '-',
              description: 'Navigation URL (renders as link)',
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: 'false',
              description: 'Whether item is currently active',
            },
            {
              name: 'onClick',
              type: '(event: MouseEvent) => void',
              default: '-',
              description: 'Click handler (renders as button when no path)',
            },
            {
              name: 'children',
              type: 'SidebarItem[]',
              default: '-',
              description: 'Nested items (creates collapsible section)',
            },
            {
              name: 'badge',
              type: 'string | number',
              default: '-',
              description:
                'Notification badge (e.g., 12 or "+8"). Only for items without children.',
            },
            {
              name: 'pinnable',
              type: 'boolean',
              default: 'false',
              description: 'Whether item can be pinned (only for items without children)',
            },
            {
              name: 'class',
              type: 'string',
              default: '-',
              description: 'Additional CSS classes',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Sidebar',
          description: 'Simple sidebar with navigation items and icons.',
          code: `const items = [
  { id: 'home', label: 'Home', icon: Home01Icon, path: '/home', isActive: true },
  { id: 'users', label: 'Users', icon: Users01Icon, path: '/users' },
  { id: 'settings', label: 'Settings', icon: Settings01Icon, path: '/settings' },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-64 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
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
            <div class="h-64 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-900">
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
  { id: 'dashboard', label: 'Dashboard', icon: Home01Icon, path: '/dashboard' },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart01Icon,
    children: [
      { id: 'overview', label: 'Overview', path: '/analytics/overview' },
      { id: 'reports', label: 'Reports', path: '/analytics/reports' },
    ],
  },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-80 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-900">
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
            <div class="h-80 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 dark:bg-gray-900">
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
    icon: Settings01Icon,
    onClick: () => alert('Clicked!'),
  },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-48 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
              <Sidebar
                items={[
                  {
                    id: 'action1',
                    label: 'Show Alert',
                    icon: Settings01Icon,
                    onClick: () => alert('Button clicked!'),
                  },
                  {
                    id: 'link1',
                    label: 'Go to Home',
                    icon: Home01Icon,
                    path: '#home',
                  },
                ]}
                isMobile={false}
              />
            </div>
          ),
        },
        {
          title: 'Notification Badges',
          description: 'Display notification counts or labels on menu items.',
          code: `const items = [
  { id: 'home', label: 'Home', icon: Home01Icon, path: '#home', isActive: true },
  { id: 'users', label: 'Users', icon: Users01Icon, path: '#users', badge: 12 },
  { id: 'settings', label: 'Settings', icon: Settings01Icon, path: '#settings', badge: '+8' },
];

<Sidebar items={items} isMobile={false} />`,
          component: () => (
            <div class="h-64 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
              <Sidebar items={itemsWithBadges} isMobile={false} />
            </div>
          ),
        },
        {
          title: 'Footer with Menu Items',
          description: 'Add footer menu items and custom content like promo cards.',
          code: `const footerItems = [
  { id: 'help', label: 'Help & Support', icon: HelpCircleIcon, path: '#help' },
  { id: 'contact', label: 'Contact us', icon: Headphones01Icon, path: '#contact' },
];

<Sidebar
  items={items}
  isMobile={false}
  footerContent={<PromoCard />}
  footerItems={footerItems}
/>`,
          component: () => (
            <div class="h-96 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
              <Sidebar
                items={basicItems}
                isMobile={false}
                isSidebarOpen={isOpen4()}
                setIsSidebarOpen={setIsOpen4}
                footerContent={<PromoCard />}
                footerItems={footerItems}
              >
                <span class="text-lg font-bold">My App</span>
              </Sidebar>
            </div>
          ),
        },
        {
          title: 'Pinnable Items',
          description:
            'Pin frequently used menu items (without children) or submenu items to the top for quick access. Hover over items to see the pin button. Uses localStorage to persist pinned items across sessions.',
          code: `const items = [
  { id: 'dashboard', label: 'Dashboard', icon: Home01Icon, path: '#dashboard', pinnable: true },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart01Icon,
    children: [
      { id: 'overview', label: 'Overview', path: '#analytics/overview', pinnable: true },
      { id: 'reports', label: 'Reports', path: '#analytics/reports', pinnable: true },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users01Icon,
    children: [
      { id: 'all-users', label: 'All Users', path: '#users/all', pinnable: true },
      { id: 'roles', label: 'Roles', path: '#users/roles', pinnable: true },
    ],
  },
];

// Simple usage with localStorage persistence
<Sidebar
  items={items}
  isMobile={false}
  pinnedStorageKey="my-app-pinned-items"
/>

// Or controlled mode for custom state management
const [pinnedItems, setPinnedItems] = createSignal(['overview']);

<Sidebar
  items={items}
  isMobile={false}
  pinnedItems={pinnedItems()}
  onPinnedChange={setPinnedItems}
/>`,
          component: () => (
            <div class="h-96 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
              <Sidebar
                items={itemsWithPinnable}
                isMobile={false}
                isSidebarOpen={isOpen5()}
                setIsSidebarOpen={setIsOpen5}
                pinnedStorageKey="solidly-sidebar-pinned-demo"
              >
                <span class="text-lg font-bold">Dashboard</span>
              </Sidebar>
            </div>
          ),
        },
        {
          title: 'Complete Layout',
          description:
            'Full sidebar layout with header section (logo, header items, pinned), scrollable body (main menu), and footer section (promo card, footer items). Use showHeaderBorder and showFooterBorder props to control section separators.',
          code: `<Sidebar
  items={mainItems}
  isMobile={false}
  isSidebarOpen={isOpen()}
  setIsSidebarOpen={setIsOpen}
  // Header section
  headerItems={headerItems}
  pinnedStorageKey="my-app-pinned"
  pinnedLabel="Pinned"
  // Footer section
  footerContent={<PromoCard />}
  footerItems={footerItems}
>
  <span class="text-lg font-bold">My App</span>
</Sidebar>`,
          component: () => (
            <div class="rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
              <Sidebar
                items={fullLayoutItems}
                isMobile={false}
                isSidebarOpen={isOpenFull()}
                setIsSidebarOpen={setIsOpenFull}
                headerItems={fullLayoutHeaderItems}
                pinnedStorageKey="solidly-sidebar-full-demo"
                pinnedLabel="Pinned"
                footerContent={<PromoCard />}
                footerItems={fullLayoutFooterItems}
                showHeaderBorder
              >
                <span class="text-lg font-bold">My App</span>
              </Sidebar>
            </div>
          ),
        },
      ]}
      usage={`import { Sidebar, type SidebarItem } from '@exowpee/solidly-pro';

// Define navigation items
const items: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home01Icon,
    path: '/home',
    isActive: true,
    pinnable: true, // Can be pinned to top
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users01Icon,
    path: '/users',
    badge: 12, // Notification badge
    pinnable: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings01Icon,
    children: [
      { id: 'profile', label: 'Profile', path: '/settings/profile', pinnable: true },
      { id: 'security', label: 'Security', path: '/settings/security', pinnable: true },
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

// With header content and menu items
const headerItems: SidebarItem[] = [
  { id: 'search', label: 'Search', icon: SearchIcon, path: '/search' },
];

<Sidebar
  items={items}
  isMobile={false}
  headerContent={<SearchBox />}
  headerItems={headerItems}
/>

// With footer content and menu items
const footerItems: SidebarItem[] = [
  { id: 'help', label: 'Help & Support', icon: HelpCircleIcon, path: '/help' },
  { id: 'contact', label: 'Contact us', icon: Headphones01Icon, path: '/contact' },
];

<Sidebar
  items={items}
  isMobile={false}
  footerContent={<PromoCard />}
  footerItems={footerItems}
/>

// With pinned items and localStorage persistence
<Sidebar
  items={items}
  isMobile={false}
  pinnedStorageKey="my-app-sidebar-pinned"
  pinnedLabel="Favorites"
/>

// Or with controlled state (for custom logic)
const [pinnedItems, setPinnedItems] = createSignal(['home', 'profile']);

<Sidebar
  items={items}
  isMobile={false}
  pinnedItems={pinnedItems()}
  onPinnedChange={setPinnedItems}
/>`}
    />
  );
}
