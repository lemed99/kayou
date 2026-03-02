import DocPage from '../../../components/DocPage';

export default function SidebarPage() {
  return (
    <DocPage
      title="Sidebar"
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
            'Fixed area at top with logo, custom content, header menu items, and pinned items. Automatically shows border when header items or pinned items exist.',
        },
        {
          term: 'Pinned Items',
          explanation:
            'Pin menu items (without children) to the header for quick access. Stored in localStorage when pinnedStorageKey is set.',
        },
        {
          term: 'Footer Section',
          explanation:
            'Add menu items and custom content (e.g., promo cards) at the bottom.',
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
          name: 'labels',
          type: 'Partial<SidebarLabels>',
          default: 'DEFAULT_SIDEBAR_LABELS',
          description: 'Visible text labels for the sidebar',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<SidebarAriaLabels>',
          default: 'DEFAULT_SIDEBAR_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'SidebarItem',
          kind: 'type',
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
        {
          name: 'SidebarLabels',
          kind: 'type',
          description: 'Visible text labels for the sidebar',
          props: [
            { name: 'pinned', type: 'string', default: '"Pinned"', description: 'Label for the pinned section' },
            { name: 'unpin', type: 'string', default: '"Unpin"', description: 'Label for the unpin action' },
            { name: 'pin', type: 'string', default: '"Pin"', description: 'Label for the pin action' },
          ],
        },
        {
          name: 'SidebarAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            { name: 'collapse', type: 'string', default: '"Collapse sidebar"', description: 'Aria label for collapse button' },
            { name: 'expand', type: 'string', default: '"Expand sidebar"', description: 'Aria label for expand button' },
            { name: 'sidebar', type: 'string', default: '"Sidebar"', description: 'Aria label for sidebar navigation' },
          ],
        },
      ]}
      playground={`
        import { Sidebar } from '@kayou/ui';
        import { Home01Icon, Users01Icon, Settings01Icon, BarChart01Icon, Mail01Icon, HelpCircleIcon, BookOpen01Icon, SearchSmIcon, Star01Icon, XCloseIcon } from '@kayou/icons';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [isOpen, setIsOpen] = createSignal(true);

          const items = [
            { id: 'home', label: 'Home', icon: Home01Icon, path: '#home', isActive: true, pinnable: true },
            {
              id: 'analytics', label: 'Analytics', icon: BarChart01Icon,
              children: [
                { id: 'overview', label: 'Overview', path: '#analytics/overview', pinnable: true },
                { id: 'reports', label: 'Reports', path: '#analytics/reports', pinnable: true, badge: 5 },
              ],
            },
            {
              id: 'users', label: 'Users', icon: Users01Icon,
              children: [
                { id: 'all-users', label: 'All Users', path: '#users/all', pinnable: true, badge: 12 },
                { id: 'roles', label: 'Roles', path: '#users/roles', pinnable: true },
              ],
            },
            { id: 'messages', label: 'Messages', icon: Mail01Icon, path: '#messages', badge: 3, pinnable: true },
            { id: 'settings', label: 'Settings', icon: Settings01Icon, path: '#settings', pinnable: true },
          ];

          const headerItems = [
            { id: 'search', label: 'Search', icon: SearchSmIcon, path: '#search' },
            { id: 'favorites', label: 'Favorites', icon: Star01Icon, path: '#favorites' },
          ];

          const footerItems = [
            { id: 'docs', label: 'Documentation', icon: BookOpen01Icon, path: '#docs' },
            { id: 'help', label: 'Help & Support', icon: HelpCircleIcon, path: '#help' },
          ];

          const PromoCard = () => (
            <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800">
              <div class="mb-2 flex items-center justify-between">
                <span class="font-semibold text-neutral-900 dark:text-white">5 Days left!</span>
                <button type="button" class="cursor-pointer text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                  <XCloseIcon  />
                </button>
              </div>
              <div class="mb-2 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div class="h-1.5 w-3/4 rounded-full bg-amber-400" />
              </div>
              <p class="text-xs text-wrap text-neutral-500 dark:text-neutral-400">Trial ending soon. Upgrade to stay active.</p>
            </div>
          );

          return (
            <div class="h-[600px]">
              <Sidebar
                items={items}
                isMobile={false}
                isSidebarOpen={isOpen()}
                setIsSidebarOpen={setIsOpen}
                headerItems={headerItems}
                pinnedStorageKey="kayou-sidebar-playground-demo"
                pinnedLabel="Pinned"
                footerContent={<PromoCard />}
                footerItems={footerItems}
              >
                <span class="text-lg font-bold">My App</span>
              </Sidebar>
            </div>
          );
        }
      `}
      usage={`
        import { Sidebar, type SidebarItem } from '@kayou/ui';

        <Sidebar items={items} isMobile={false} />
        <Sidebar items={items} isMobile={false} isSidebarOpen={isOpen()} setIsSidebarOpen={setIsOpen}>Logo</Sidebar>
        <Sidebar items={items} isMobile={false} footerItems={footerItems} pinnedStorageKey="my-app-pinned" />
      `}
    />
  );
}
