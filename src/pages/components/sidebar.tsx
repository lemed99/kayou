import Sidebar, { TSideBarItems } from '../../components/SideBar';
import DocPage from '../../doc/components/DocPage';
import { HomeIcon, XMarkIcon } from '../../icons';

const items: TSideBarItems[] = [
  {
    label: 'Home',
    icon: HomeIcon,
    // isActive: true,
    id: 'home',
    onClick: () => alert('Home clicked'),
  },
  {
    label: 'Settings',
    icon: XMarkIcon,
    // isActive: true,
    id: 'settings',
    children: [
      {
        label: 'Profile',
        id: 'profile',
        onClick: () => alert('Profile clicked'),
      },
      {
        label: 'Security',
        id: 'security',
        isActive: true,
        onClick: () => alert('Security clicked'),
      },
    ],
  },
];

export default function SidebarDocs() {
  return (
    <DocPage
      title="Sidebar"
      description="A flexible sidebar navigation component with support for nested items, icons, and active state."
      usage={`import Sidebar from "@exowpee/solid-components/SideBar";

<Sidebar
  items={[
    { label: "Home", icon: HomeIcon, isActive: true, id: "home" },
    {
      label: "Settings",
      icon: Cog6ToothIcon,
      id: "settings",
      children: [
        { label: "Profile", id: "profile" },
        { label: "Security", id: "security" },
      ],
    },
  ]}
  isMobile={false}
/>
`}
      props={[
        {
          name: 'items',
          type: 'TSideBarItems[]',
          default: '[]',
          description: 'Sidebar navigation items, can be nested.',
        },
        {
          name: 'isMobile',
          type: 'boolean',
          default: 'false',
          description: 'If true, disables popover for nested items.',
        },
        {
          name: 'innerClass',
          type: 'string',
          default: 'undefined',
          description: 'Custom class for the sidebar inner container.',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: 'undefined',
          description: 'Additional elements to render inside the sidebar.',
        },
        {
          name: 'class',
          type: 'string',
          default: 'undefined',
          description: 'Custom class for the sidebar root element.',
        },
      ]}
      examples={[
        {
          title: 'Basic Sidebar',
          description: 'A sidebar with a home item and a settings group.',
          code: `<Sidebar
  items={[
    { label: "Home", icon: HomeIcon, isActive: true, id: "home" },
    {
      label: "Settings",
      icon: Cog6ToothIcon,
      id: "settings",
      children: [
        { label: "Profile", id: "profile" },
        { label: "Security", id: "security" },
      ],
    },
  ]}
  isMobile={false}
/>`,
          component: () => <Sidebar items={items} isMobile={false} />,
        },
        {
          title: 'Sidebar with Custom Content',
          description: 'You can add custom content as children.',
          code: `<Sidebar items={items} isMobile={false}>
  <div class="mb-2 px-2 text-xs text-gray-500">Custom Section</div>
</Sidebar>`,
          component: () => (
            <Sidebar
              items={items}
              isMobile={false}
              innerClass="bg-gray-100 dark:bg-gray-800"
            >
              <div class="mb-2 px-2 text-xs text-gray-500">Custom Section</div>
            </Sidebar>
          ),
        },
      ]}
    />
  );
}
