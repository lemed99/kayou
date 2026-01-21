import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Button, ToggleSwitch, Checkbox, Badge } from '@exowpee/solidly';
import {
  Bell01Icon,
  CheckCircleIcon,
  Mail02Icon,
  Announcement01Icon,
  RefreshCw01Icon,
  Settings01Icon,
  Phone01Icon,
  CheckIcon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// VARIANT 1: Modern Card - Glassmorphism with visual categories
// ============================================================================
const NotificationsModern = () => {
  const [emailAll, setEmailAll] = createSignal(true);
  const [pushAll, setPushAll] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
  };

  const categories = [
    {
      id: 'activity',
      title: 'Activity',
      icon: Users01Icon,
      color: 'blue',
      items: [
        { id: 'comments', label: 'Comments', description: 'When someone comments on your post', email: true, push: false },
        { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', email: true, push: true },
        { id: 'follows', label: 'New Followers', description: 'When someone follows you', email: false, push: false },
      ],
    },
    {
      id: 'updates',
      title: 'Updates',
      icon: Settings01Icon,
      color: 'purple',
      items: [
        { id: 'product', label: 'Product Updates', description: 'News about product and features', email: true, push: false },
        { id: 'security', label: 'Security Alerts', description: 'Important security notifications', email: true, push: true },
        { id: 'newsletter', label: 'Newsletter', description: 'Weekly digest and tips', email: true, push: false },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Announcement01Icon,
      color: 'green',
      items: [
        { id: 'promotions', label: 'Promotions', description: 'Deals, offers, and discounts', email: false, push: false },
        { id: 'tips', label: 'Tips & Tutorials', description: 'How to get the most out of our product', email: true, push: false },
      ],
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
  };

  return (
    <div class="min-h-full bg-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      {/* Background decorations */}
      <div class="pointer-events-none fixed inset-0 overflow-hidden">
        <div class="absolute -left-40 -top-40 size-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div class="absolute -bottom-40 -right-40 size-96 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose what notifications you want to receive.
          </p>
        </div>

        <div class="space-y-6">
          {/* Global Settings Card */}
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-800/70">
            <div class="absolute -right-20 -top-20 size-64 rounded-full hidden" />

            <h2 class="relative flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Bell01Icon class="size-5 text-blue-500" />
              Global Settings
            </h2>
            <div class="relative mt-6 grid gap-4 sm:grid-cols-2">
              <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Mail02Icon class="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Email</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Receive via email</p>
                  </div>
                </div>
                <ToggleSwitch checked={emailAll()} onChange={setEmailAll} label="" />
              </div>
              <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Phone01Icon class="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Push</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Receive on devices</p>
                  </div>
                </div>
                <ToggleSwitch checked={pushAll()} onChange={setPushAll} label="" />
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <For each={categories}>
            {(category) => (
              <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg  dark:border-gray-700/50 dark:bg-gray-800/70">
                {/* Category Header */}
                <div class={`${colorClasses[category.color as keyof typeof colorClasses]} p-4`}>
                  <div class="flex items-center gap-3">
                    <div class="flex size-10 items-center justify-center rounded-lg bg-black/10">
                      <Dynamic component={category.icon} class="size-5 text-white" />
                    </div>
                    <h2 class="text-lg font-semibold text-white">{category.title}</h2>
                  </div>
                </div>

                {/* Items */}
                <div class="divide-y divide-gray-200/50 p-4 dark:divide-gray-700/50">
                  <For each={category.items}>
                    {(item) => (
                      <div class="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <div class="flex items-center gap-4">
                          <label class="flex cursor-pointer items-center gap-2">
                            <Checkbox id={`${item.id}-email`} checked={item.email} />
                            <span class="text-sm text-gray-600 dark:text-gray-400">Email</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2">
                            <Checkbox id={`${item.id}-push`} checked={item.push} />
                            <span class="text-sm text-gray-600 dark:text-gray-400">Push</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>

          {/* Save Button */}
          <div class="flex justify-end">
            <Button
              color={saved() ? 'success' : 'info'}
              onClick={handleSave}
              disabled={saving()}
              class="flex items-center gap-2"
            >
              {saving() ? (
                <>
                  <RefreshCw01Icon class="size-4 animate-spin" />
                  Saving...
                </>
              ) : saved() ? (
                <>
                  <CheckIcon class="size-4" />
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT 2: Split Layout - Sidebar with category navigation
// ============================================================================
const NotificationsSplit = () => {
  const [activeCategory, setActiveCategory] = createSignal('activity');
  const [emailAll, setEmailAll] = createSignal(true);
  const [pushAll, setPushAll] = createSignal(true);

  const categories = [
    {
      id: 'activity',
      title: 'Activity',
      icon: Users01Icon,
      count: 3,
      items: [
        { id: 'comments', label: 'Comments', description: 'When someone comments on your post', email: true, push: false },
        { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', email: true, push: true },
        { id: 'follows', label: 'New Followers', description: 'When someone follows you', email: false, push: false },
      ],
    },
    {
      id: 'updates',
      title: 'Updates',
      icon: Settings01Icon,
      count: 3,
      items: [
        { id: 'product', label: 'Product Updates', description: 'News about product and features', email: true, push: false },
        { id: 'security', label: 'Security Alerts', description: 'Important security notifications', email: true, push: true },
        { id: 'newsletter', label: 'Newsletter', description: 'Weekly digest and tips', email: true, push: false },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Announcement01Icon,
      count: 2,
      items: [
        { id: 'promotions', label: 'Promotions', description: 'Deals, offers, and discounts', email: false, push: false },
        { id: 'tips', label: 'Tips & Tutorials', description: 'How to get the most out of our product', email: true, push: false },
      ],
    },
  ];

  const currentCategory = () => categories.find((c) => c.id === activeCategory());

  return (
    <div class="min-h-full bg-gray-50 dark:bg-gray-900">
      <div class="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your notification preferences.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="lg:sticky lg:top-8 lg:self-start">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {/* Global toggles */}
              <div class="space-y-3 border-b border-gray-200 p-4 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                  <ToggleSwitch checked={emailAll()} onChange={setEmailAll} label="" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Push</span>
                  <ToggleSwitch checked={pushAll()} onChange={setPushAll} label="" />
                </div>
              </div>

              {/* Category Navigation */}
              <nav class="p-2">
                <For each={categories}>
                  {(category) => (
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      class={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                        activeCategory() === category.id
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div class="flex items-center gap-3">
                        <Dynamic component={category.icon} class="size-5" />
                        {category.title}
                      </div>
                      <Badge color="gray" size="sm">{category.count}</Badge>
                    </button>
                  )}
                </For>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b border-gray-200 p-6 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <Show when={currentCategory()}>
                  {(cat) => (
                    <>
                      <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Dynamic component={cat().icon} class="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{cat().title}</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{cat().items.length} notification types</p>
                      </div>
                    </>
                  )}
                </Show>
              </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <Show when={currentCategory()}>
                {(cat) => (
                  <For each={cat().items}>
                    {(item) => (
                      <div class="flex items-center justify-between p-6">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <div class="flex items-center gap-6">
                          <label class="flex cursor-pointer items-center gap-2">
                            <Checkbox id={`split-${item.id}-email`} checked={item.email} />
                            <span class="text-sm text-gray-600 dark:text-gray-400">Email</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2">
                            <Checkbox id={`split-${item.id}-push`} checked={item.push} />
                            <span class="text-sm text-gray-600 dark:text-gray-400">Push</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </For>
                )}
              </Show>
            </div>

            <div class="border-t border-gray-200 p-6 dark:border-gray-700">
              <Button color="info" class="w-full justify-center">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT 3: Compact - Toggle list with quick actions
// ============================================================================
const NotificationsCompact = () => {
  const [emailEnabled, setEmailEnabled] = createSignal(true);
  const [pushEnabled, setPushEnabled] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  const [notifications, setNotifications] = createSignal([
    { id: 'comments', label: 'Comments', enabled: true },
    { id: 'mentions', label: 'Mentions', enabled: true },
    { id: 'follows', label: 'New Followers', enabled: false },
    { id: 'product', label: 'Product Updates', enabled: true },
    { id: 'security', label: 'Security Alerts', enabled: true },
    { id: 'newsletter', label: 'Newsletter', enabled: true },
    { id: 'promotions', label: 'Promotions', enabled: false },
    { id: 'tips', label: 'Tips & Tutorials', enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const enabledCount = () => notifications().filter((n) => n.enabled).length;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div class="text-center">
          <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Bell01Icon class="size-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            {enabledCount()} of {notifications().length} enabled
          </p>
        </div>

        {/* Quick toggles */}
        <div class="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setEmailEnabled(!emailEnabled())}
            class={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              emailEnabled()
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Mail02Icon class="size-4" />
            Email {emailEnabled() ? 'On' : 'Off'}
          </button>
          <button
            onClick={() => setPushEnabled(!pushEnabled())}
            class={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              pushEnabled()
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Phone01Icon class="size-4" />
            Push {pushEnabled() ? 'On' : 'Off'}
          </button>
        </div>

        <div class="mt-8 border-t border-gray-200 dark:border-gray-800" />

        {/* Notification list */}
        <div class="mt-8 space-y-2">
          <For each={notifications()}>
            {(notification) => (
              <button
                onClick={() => toggleNotification(notification.id)}
                class={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                  notification.enabled
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700'
                }`}
              >
                <span class={`font-medium ${notification.enabled ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {notification.label}
                </span>
                <div class={`flex size-6 items-center justify-center rounded-full ${
                  notification.enabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Show when={notification.enabled}>
                    <CheckCircleIcon class="size-4" />
                  </Show>
                </div>
              </button>
            )}
          </For>
        </div>

        {/* Save */}
        <div class="mt-8">
          <Button
            color={saved() ? 'success' : 'dark'}
            onClick={handleSave}
            class="w-full justify-center"
          >
            {saved() ? (
              <span class="flex items-center gap-2">
                <CheckIcon class="size-4" />
                Preferences Saved!
              </span>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Code examples
// ============================================================================
const modernCode = `import { createSignal, For } from 'solid-js';
import { Button, ToggleSwitch, Checkbox, Badge } from '@exowpee/solidly';
import { Bell01Icon, Mail02Icon, Phone01Icon, Users01Icon, Settings01Icon, Announcement01Icon } from '@exowpee/solidly/icons';

export default function NotificationSettings() {
  const [emailAll, setEmailAll] = createSignal(true);
  const [pushAll, setPushAll] = createSignal(false);

  const categories = [
    {
      id: 'activity',
      title: 'Activity',
      icon: Users01Icon,
      color: 'blue',
      items: [
        { id: 'comments', label: 'Comments', description: 'When someone comments', email: true, push: false },
        { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', email: true, push: true },
      ],
    },
    // ...more categories
  ];

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-4xl px-4 py-8">
        {/* Global Settings */}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg ">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Bell01Icon class="size-5 text-blue-500" />
            Global Settings
          </h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="flex items-center justify-between rounded-xl border p-4">
              <div class="flex items-center gap-3">
                <Mail02Icon class="size-5 text-blue-600" />
                <span>Email</span>
              </div>
              <ToggleSwitch checked={emailAll()} onChange={setEmailAll} label="" />
            </div>
            <div class="flex items-center justify-between rounded-xl border p-4">
              <div class="flex items-center gap-3">
                <Phone01Icon class="size-5 text-purple-600" />
                <span>Push</span>
              </div>
              <ToggleSwitch checked={pushAll()} onChange={setPushAll} label="" />
            </div>
          </div>
        </div>

        {/* Category Cards with gradient headers */}
        <For each={categories}>
          {(category) => (
            <div class="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div class={\`bg-\${category.color}-600 p-4\`}>
                <Dynamic component={category.icon} class="size-5 text-white" />
                <h2 class="text-lg font-semibold text-white">{category.title}</h2>
              </div>
              {/* Items with checkboxes */}
            </div>
          )}
        </For>

        <Button color="info">Save Preferences</Button>
      </div>
    </div>
  );
}`;

const splitCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, ToggleSwitch, Checkbox, Badge } from '@exowpee/solidly';
import { Users01Icon, Settings01Icon, Announcement01Icon } from '@exowpee/solidly/icons';

export default function NotificationSettings() {
  const [activeCategory, setActiveCategory] = createSignal('activity');
  const [emailAll, setEmailAll] = createSignal(true);

  const categories = [
    { id: 'activity', title: 'Activity', icon: Users01Icon, count: 3, items: [...] },
    { id: 'updates', title: 'Updates', icon: Settings01Icon, count: 3, items: [...] },
    { id: 'marketing', title: 'Marketing', icon: Announcement01Icon, count: 2, items: [...] },
  ];

  const currentCategory = () => categories.find((c) => c.id === activeCategory());

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-6xl px-4 py-8">
        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="rounded-xl border bg-white">
            <div class="space-y-3 border-b p-4">
              <div class="flex items-center justify-between">
                <span>Email</span>
                <ToggleSwitch checked={emailAll()} onChange={setEmailAll} label="" />
              </div>
            </div>
            <nav class="p-2">
              <For each={categories}>
                {(category) => (
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    class={\`flex w-full items-center justify-between rounded-lg px-4 py-3 \${
                      activeCategory() === category.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }\`}
                  >
                    <div class="flex items-center gap-3">
                      <Dynamic component={category.icon} class="size-5" />
                      {category.title}
                    </div>
                    <Badge color="gray">{category.count}</Badge>
                  </button>
                )}
              </For>
            </nav>
          </div>

          {/* Content */}
          <div class="rounded-xl border bg-white">
            <Show when={currentCategory()}>
              {(cat) => (
                <For each={cat().items}>
                  {(item) => (
                    <div class="flex items-center justify-between p-6">
                      <div>
                        <p class="font-medium">{item.label}</p>
                        <p class="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div class="flex gap-6">
                        <Checkbox id={\`\${item.id}-email\`} checked={item.email} label="Email" />
                        <Checkbox id={\`\${item.id}-push\`} checked={item.push} label="Push" />
                      </div>
                    </div>
                  )}
                </For>
              )}
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const compactCode = `import { createSignal, For, Show } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { Bell01Icon, Mail02Icon, Phone01Icon, CheckCircleIcon, CheckIcon } from '@exowpee/solidly/icons';

export default function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = createSignal(true);
  const [pushEnabled, setPushEnabled] = createSignal(false);

  const [notifications, setNotifications] = createSignal([
    { id: 'comments', label: 'Comments', enabled: true },
    { id: 'mentions', label: 'Mentions', enabled: true },
    { id: 'security', label: 'Security Alerts', enabled: true },
    { id: 'promotions', label: 'Promotions', enabled: false },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div class="min-h-full bg-white">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div class="text-center">
          <Bell01Icon class="mx-auto size-8 text-blue-600" />
          <h1 class="mt-4 text-2xl font-bold">Notifications</h1>
        </div>

        {/* Quick toggles */}
        <div class="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setEmailEnabled(!emailEnabled())}
            class={\`flex items-center gap-2 rounded-full px-4 py-2 \${
              emailEnabled() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }\`}
          >
            <Mail02Icon class="size-4" />
            Email {emailEnabled() ? 'On' : 'Off'}
          </button>
          <button onClick={() => setPushEnabled(!pushEnabled())}>
            <Phone01Icon class="size-4" />
            Push
          </button>
        </div>

        {/* Toggle list */}
        <div class="mt-8 space-y-2">
          <For each={notifications()}>
            {(notification) => (
              <button
                onClick={() => toggleNotification(notification.id)}
                class={\`flex w-full items-center justify-between rounded-xl border p-4 \${
                  notification.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }\`}
              >
                <span>{notification.label}</span>
                <Show when={notification.enabled}>
                  <CheckCircleIcon class="size-4 text-blue-600" />
                </Show>
              </button>
            )}
          </For>
        </div>

        <Button color="dark" class="mt-8 w-full justify-center">Save Preferences</Button>
      </div>
    </div>
  );
}`;

export default function NotificationsBlockPage() {
  return (
    <BlocksDocPage
      title="Notifications"
      description="Notification preferences page with global toggles and granular control over email and push notifications with multiple premium design variants."
      category="Settings"
      variants={[
        {
          id: 'modern',
          title: 'Modern Card',
          description: 'Glassmorphism design with gradient category headers and visual hierarchy.',
          component: NotificationsModern,
          code: modernCode,
        },
        {
          id: 'split',
          title: 'Split Layout',
          description: 'Sidebar navigation with category-based content and global toggles.',
          component: NotificationsSplit,
          code: splitCode,
        },
        {
          id: 'compact',
          title: 'Compact Toggle',
          description: 'Simple toggle list with quick channel controls.',
          component: NotificationsCompact,
          code: compactCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'ToggleSwitch', path: '/components/toggle-switch' },
        { name: 'Checkbox', path: '/components/checkbox' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        {
          name: 'Profile',
          path: '/blocks/settings/profile',
          description: 'Profile settings page',
        },
        {
          name: 'Account',
          path: '/blocks/settings/account',
          description: 'Account settings page',
        },
      ]}
    />
  );
}

// Export components for iframe preview
export { NotificationsModern, NotificationsSplit, NotificationsCompact };
