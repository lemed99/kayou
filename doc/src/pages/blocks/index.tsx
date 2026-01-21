import { For, type JSX } from 'solid-js';

import { Diamond01Icon } from '@exowpee/solidly/icons';
import { A } from '@solidjs/router';

interface BlockItem {
  name: string;
  path: string;
  description: string;
  preview?: string;
}

interface BlockCategory {
  title: string;
  description: string;
  blocks: BlockItem[];
}

const blockCategories: BlockCategory[] = [
  {
    title: 'Authentication',
    description: 'Secure login, signup, and verification flows with modern designs.',
    blocks: [
      {
        name: 'Auth Flow',
        path: '/blocks/authentication/auth-flow',
        description: 'Complete authentication flow with validation, navigation, OTP, and org selection.',
      },
      {
        name: 'Login',
        path: '/blocks/authentication/login',
        description: 'Sign in forms with social auth, split screen, and minimal variants.',
      },
      {
        name: 'Signup',
        path: '/blocks/authentication/signup',
        description: 'User registration with validation and step-by-step flows.',
      },
      {
        name: 'Forgot Password',
        path: '/blocks/authentication/forgot-password',
        description: 'Password recovery request with email verification.',
      },
      {
        name: 'Reset Password',
        path: '/blocks/authentication/reset-password',
        description: 'New password setup with strength indicators.',
      },
      {
        name: 'OTP Verification',
        path: '/blocks/authentication/otp-verification',
        description: 'Two-factor authentication code entry.',
      },
      {
        name: 'Organization Auth',
        path: '/blocks/authentication/organization-auth',
        description: 'Multi-tenant login, workspace signup, and team invitations.',
      },
    ],
  },
  {
    title: 'Dashboard',
    description: 'Admin panels, analytics, and overview layouts for data-driven applications.',
    blocks: [
      {
        name: 'Analytics',
        path: '/blocks/dashboard/analytics',
        description: 'Charts, metrics, and KPI displays with real-time data.',
      },
      {
        name: 'Admin Panel',
        path: '/blocks/dashboard/admin-panel',
        description: 'Full admin layout with Sidebar navigation and DataTable.',
      },
      {
        name: 'Overview',
        path: '/blocks/dashboard/overview',
        description: 'Dashboard home with summary cards and activity feeds.',
      },
    ],
  },
  {
    title: 'Settings',
    description: 'User preference and account management interfaces.',
    blocks: [
      {
        name: 'Profile',
        path: '/blocks/settings/profile',
        description: 'Personal information and avatar management.',
      },
      {
        name: 'Account',
        path: '/blocks/settings/account',
        description: 'Account settings with security and preferences.',
      },
      {
        name: 'Notifications',
        path: '/blocks/settings/notifications',
        description: 'Communication preferences and alert settings.',
      },
    ],
  },
  {
    title: 'Data Management',
    description: 'Tables, lists, and CRUD interfaces for managing data.',
    blocks: [
      {
        name: 'Table View',
        path: '/blocks/data-management/table-view',
        description: 'DataTable with filtering, sorting, and row selection.',
      },
      {
        name: 'List View',
        path: '/blocks/data-management/list-view',
        description: 'Card-based list with search and pagination.',
      },
      {
        name: 'CRUD Interface',
        path: '/blocks/data-management/crud-interface',
        description: 'Create, read, update, delete operations in one view.',
      },
      {
        name: 'Search & Filter',
        path: '/blocks/data-management/search-filter',
        description: 'Advanced search with multi-select filters.',
      },
    ],
  },
  {
    title: 'Messaging',
    description: 'Real-time chat and messaging interfaces with virtualized lists.',
    blocks: [
      {
        name: 'In-App Messages',
        path: '/blocks/messaging/in-app-messages',
        description: 'Chat interfaces with DynamicVirtualList, typing indicators, and read receipts.',
      },
    ],
  },
];

function BlockCard(props: { block: BlockItem }): JSX.Element {
  return (
    <A
      href={props.block.path}
      class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
    >
      {/* Preview placeholder */}
      <div class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-900">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
            <svg
              class="size-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
        </div>
        {/* Hover overlay */}
        <div class="absolute inset-0 flex items-center justify-center bg-blue-600/0 transition-colors group-hover:bg-blue-600/10 dark:group-hover:bg-blue-500/10">
          <span class="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-blue-600 opacity-0 shadow-lg transition-all group-hover:opacity-100 dark:bg-gray-900/90 dark:text-blue-400">
            View Block
          </span>
        </div>
      </div>

      {/* Content */}
      <div class="flex flex-1 flex-col p-4">
        <h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {props.block.name}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{props.block.description}</p>
      </div>
    </A>
  );
}

function CategorySection(props: { category: BlockCategory }): JSX.Element {
  return (
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {props.category.title}
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{props.category.description}</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <For each={props.category.blocks}>{(block) => <BlockCard block={block} />}</For>
      </div>
    </section>
  );
}

export default function BlocksPage(): JSX.Element {
  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="flex items-center gap-3">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Blocks</h1>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-sm">
              <Diamond01Icon class="size-4" />
              Pro
            </span>
          </div>
          <p class="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Premium, production-ready page sections built with Solidly components. Copy and
            paste into your project to ship faster.
          </p>
          <div class="mt-6 flex flex-wrap gap-4">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg
                class="size-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Built with Solidly Pro components
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg
                class="size-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Fully responsive
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg
                class="size-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Dark mode included
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Grid */}
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <For each={blockCategories}>
          {(category) => <CategorySection category={category} />}
        </For>
      </div>
    </div>
  );
}
