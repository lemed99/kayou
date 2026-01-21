import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Button, TextInput, ToggleSwitch, Badge } from '@exowpee/solidly';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  DeleteIcon,
  Key01Icon,
  Laptop01Icon,
  Lock01Icon,
  RefreshCw01Icon,
  ShieldTickIcon,
  Phone01Icon,
  CheckIcon,
  XCircleIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// VARIANT 1: Modern Card - Glassmorphism with security focus
// ============================================================================
const AccountModern = () => {
  const [currentPassword, setCurrentPassword] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [twoFactor, setTwoFactor] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  const passwordStrength = () => {
    const pwd = newPassword();
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25;
    return strength;
  };

  const strengthColor = () => {
    const s = passwordStrength();
    if (s <= 25) return 'bg-red-500';
    if (s <= 50) return 'bg-orange-500';
    if (s <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strengthLabel = () => {
    const s = passwordStrength();
    if (s === 0) return '';
    if (s <= 25) return 'Weak';
    if (s <= 50) return 'Fair';
    if (s <= 75) return 'Good';
    return 'Strong';
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
  };

  const sessions = [
    { device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: 'Active now', icon: Laptop01Icon, current: true },
    { device: 'iPhone 14 Pro', location: 'San Francisco, CA', lastActive: '2 hours ago', icon: Phone01Icon, current: false },
    { device: 'Chrome on Windows', location: 'New York, NY', lastActive: '3 days ago', icon: Laptop01Icon, current: false },
  ];

  return (
    <div class="min-h-full bg-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      {/* Background decorations */}
      <div class="pointer-events-none fixed inset-0 overflow-hidden">
        <div class="absolute -left-40 -top-40 size-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div class="absolute -bottom-40 -right-40 size-96 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account security and preferences.
          </p>
        </div>

        <div class="space-y-6">
          {/* Security Score Card */}
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-blue-600 p-6 shadow-xl">
            <div class="absolute -right-20 -top-20 size-64 rounded-full bg-blue-400/30 blur-2xl" />
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex size-14 items-center justify-center rounded-xl bg-blue-500">
                  <ShieldTickIcon class="size-7 text-white" />
                </div>
                <div>
                  <p class="text-sm text-blue-100">Security Score</p>
                  <p class="text-3xl font-bold text-white">85%</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-blue-100">Status</p>
                <Badge color="success" class="mt-1">Good</Badge>
              </div>
            </div>
            <div class="relative mt-4">
              <div class="h-2 overflow-hidden rounded-full bg-blue-500">
                <div class="h-full w-[85%] rounded-full bg-white transition-all" />
              </div>
              <p class="mt-2 text-xs text-blue-100">Enable 2FA to improve your security score</p>
            </div>
          </div>

          {/* Change Password */}
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-800/70">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Key01Icon class="size-5 text-blue-500" />
              Change Password
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your password associated with your account.
            </p>
            <form class="mt-6 space-y-5">
              <TextInput
                id="current-password"
                type="password"
                label="Current Password"
                value={currentPassword()}
                onInput={(e) => setCurrentPassword(e.currentTarget.value)}
                icon={Lock01Icon}
              />
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <TextInput
                    id="new-password"
                    type="password"
                    label="New Password"
                    value={newPassword()}
                    onInput={(e) => setNewPassword(e.currentTarget.value)}
                    icon={Key01Icon}
                  />
                  <Show when={newPassword()}>
                    <div class="mt-2">
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-gray-500 dark:text-gray-400">Password strength</span>
                        <span class={passwordStrength() >= 75 ? 'text-green-600' : 'text-gray-500'}>{strengthLabel()}</span>
                      </div>
                      <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class={`h-full transition-all ${strengthColor()}`}
                          style={{ width: `${passwordStrength()}%` }}
                        />
                      </div>
                    </div>
                  </Show>
                </div>
                <TextInput
                  id="confirm-password"
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword()}
                  onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                  icon={Key01Icon}
                />
              </div>
              <div class="flex justify-end pt-2">
                <Button
                  type="button"
                  color={saved() ? 'success' : 'info'}
                  onClick={handleSave}
                  disabled={saving()}
                >
                  {saving() ? (
                    <span class="flex items-center gap-2">
                      <RefreshCw01Icon class="size-4 animate-spin" />
                      Updating...
                    </span>
                  ) : saved() ? (
                    <span class="flex items-center gap-2">
                      <CheckIcon class="size-4" />
                      Updated!
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-800/70">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class={`flex size-12 items-center justify-center rounded-xl ${twoFactor() ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <ShieldTickIcon class={`size-6 ${twoFactor() ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account.
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
            </div>
            <Show when={twoFactor()}>
              <div class="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
                <div class="flex items-start gap-3">
                  <CheckCircleIcon class="mt-0.5 size-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p class="font-medium text-green-800 dark:text-green-400">2FA is enabled</p>
                    <p class="mt-1 text-sm text-green-700 dark:text-green-400/80">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          {/* Active Sessions */}
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-800/70">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Laptop01Icon class="size-5 text-blue-500" />
              Active Sessions
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your active sessions on other devices.
            </p>
            <div class="mt-6 space-y-3">
              <For each={sessions}>
                {(session) => (
                  <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div class="flex items-center gap-4">
                      <div class="flex size-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Dynamic component={session.icon} class="size-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p class="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                          {session.device}
                          <Show when={session.current}>
                            <Badge color="success" size="sm">Current</Badge>
                          </Show>
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    <Show when={!session.current}>
                      <Button color="light" size="sm">Revoke</Button>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Danger Zone */}
          <div class="overflow-hidden rounded-2xl border border-red-200 bg-red-50/70 p-6  dark:border-red-900/50 dark:bg-red-900/20">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-red-800 dark:text-red-400">
              <AlertCircleIcon class="size-5" />
              Danger Zone
            </h2>
            <p class="mt-1 text-sm text-red-600 dark:text-red-400/80">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <div class="mt-6">
              <Button color="failure">
                <span class="flex items-center gap-2">
                  <DeleteIcon class="size-4" />
                  Delete Account
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT 2: Split Layout - Sidebar navigation
// ============================================================================
const AccountSplit = () => {
  const [activeTab, setActiveTab] = createSignal('password');
  const [twoFactor, setTwoFactor] = createSignal(true);

  const tabs = [
    { id: 'password', label: 'Password', icon: Key01Icon },
    { id: 'security', label: 'Security', icon: ShieldTickIcon },
    { id: 'sessions', label: 'Sessions', icon: Laptop01Icon },
    { id: 'danger', label: 'Danger Zone', icon: AlertCircleIcon, danger: true },
  ];

  const sessions = [
    { device: 'MacBook Pro', location: 'San Francisco, CA', browser: 'Chrome', current: true },
    { device: 'iPhone 14', location: 'San Francisco, CA', browser: 'Safari', current: false },
    { device: 'Windows PC', location: 'New York, NY', browser: 'Firefox', current: false },
  ];

  return (
    <div class="min-h-full bg-gray-50 dark:bg-gray-900">
      <div class="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account security and preferences.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="lg:sticky lg:top-8 lg:self-start">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {/* Security Status */}
              <div class="border-b border-gray-200 p-6 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div class="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <ShieldTickIcon class="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Account Secure</p>
                    <p class="text-sm text-green-600 dark:text-green-400">2FA enabled</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav class="p-2">
                <For each={tabs}>
                  {(tab) => (
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      class={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                        activeTab() === tab.id
                          ? tab.danger
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : tab.danger
                            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Dynamic component={tab.icon} class="size-5" />
                      {tab.label}
                    </button>
                  )}
                </For>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            {activeTab() === 'password' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your password to keep your account secure.
                </p>
                <form class="mt-6 space-y-5">
                  <TextInput id="current-pwd" type="password" label="Current Password" />
                  <TextInput id="new-pwd" type="password" label="New Password" />
                  <TextInput id="confirm-pwd" type="password" label="Confirm New Password" />
                  <div class="flex justify-end gap-3 pt-4">
                    <Button color="light">Cancel</Button>
                    <Button color="info">Update Password</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab() === 'security' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configure your account security options.
                </p>
                <div class="mt-6 space-y-6">
                  {/* 2FA Toggle */}
                  <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div class="flex items-center gap-4">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <ShieldTickIcon class="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Protect your account with 2FA</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
                  </div>

                  {/* Backup Codes */}
                  <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div class="flex items-center gap-4">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Key01Icon class="size-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Backup Codes</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Generate recovery codes</p>
                      </div>
                    </div>
                    <Button color="light" size="sm">Generate</Button>
                  </div>

                  {/* Login Alerts */}
                  <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div class="flex items-center gap-4">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        <AlertCircleIcon class="size-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Login Alerts</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Get notified of new logins</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} label="" />
                  </div>
                </div>
              </div>
            )}

            {activeTab() === 'sessions' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage devices where you're currently logged in.
                </p>
                <div class="mt-6 space-y-4">
                  <For each={sessions}>
                    {(session) => (
                      <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <div class="flex items-center gap-4">
                          <div class="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                            <Laptop01Icon class="size-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <p class="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                              {session.device}
                              <Show when={session.current}>
                                <Badge color="success" size="sm">Current</Badge>
                              </Show>
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {session.browser} • {session.location}
                            </p>
                          </div>
                        </div>
                        <Show when={!session.current}>
                          <Button color="light" size="sm">Revoke</Button>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
                <div class="mt-6">
                  <Button color="failure" class="w-full justify-center">
                    Revoke All Other Sessions
                  </Button>
                </div>
              </div>
            )}

            {activeTab() === 'danger' && (
              <div>
                <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Irreversible and destructive actions.
                </p>
                <div class="mt-6 space-y-4">
                  <div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <h3 class="font-medium text-red-800 dark:text-red-400">Delete Account</h3>
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400/80">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <div class="mt-4">
                      <Button color="failure">Delete My Account</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT 3: Compact - Single column with collapsible sections
// ============================================================================
const AccountCompact = () => {
  const [expanded, setExpanded] = createSignal<string | null>('password');
  const [twoFactor, setTwoFactor] = createSignal(false);

  const toggle = (section: string) => {
    setExpanded(expanded() === section ? null : section);
  };

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div class="text-center">
          <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShieldTickIcon class="size-8 text-gray-700 dark:text-gray-300" />
          </div>
          <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Account Security</h1>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            Keep your account safe and secure
          </p>
        </div>

        <div class="mt-8 border-t border-gray-200 dark:border-gray-800" />

        {/* Accordion Sections */}
        <div class="mt-8 space-y-4">
          {/* Password Section */}
          <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => toggle('password')}
              class="flex w-full items-center justify-between p-4 text-left"
            >
              <div class="flex items-center gap-3">
                <Key01Icon class="size-5 text-gray-500" />
                <span class="font-medium text-gray-900 dark:text-white">Password</span>
              </div>
              <svg
                class={`size-5 text-gray-400 transition-transform ${expanded() === 'password' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Show when={expanded() === 'password'}>
              <div class="border-t border-gray-200 p-4 dark:border-gray-800">
                <form class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input
                      type="password"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                      type="password"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                  <Button color="dark" class="w-full justify-center">Update Password</Button>
                </form>
              </div>
            </Show>
          </div>

          {/* 2FA Section */}
          <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => toggle('2fa')}
              class="flex w-full items-center justify-between p-4 text-left"
            >
              <div class="flex items-center gap-3">
                <ShieldTickIcon class="size-5 text-gray-500" />
                <span class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
                <Badge color={twoFactor() ? 'success' : 'gray'} size="sm">
                  {twoFactor() ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <svg
                class={`size-5 text-gray-400 transition-transform ${expanded() === '2fa' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Show when={expanded() === '2fa'}>
              <div class="border-t border-gray-200 p-4 dark:border-gray-800">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account using authenticator app.
                    </p>
                  </div>
                  <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
                </div>
              </div>
            </Show>
          </div>

          {/* Sessions Section */}
          <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => toggle('sessions')}
              class="flex w-full items-center justify-between p-4 text-left"
            >
              <div class="flex items-center gap-3">
                <Laptop01Icon class="size-5 text-gray-500" />
                <span class="font-medium text-gray-900 dark:text-white">Active Sessions</span>
                <Badge color="default" size="sm">3 devices</Badge>
              </div>
              <svg
                class={`size-5 text-gray-400 transition-transform ${expanded() === 'sessions' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Show when={expanded() === 'sessions'}>
              <div class="border-t border-gray-200 p-4 dark:border-gray-800">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <Laptop01Icon class="size-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">MacBook Pro</p>
                        <p class="text-xs text-gray-500">Current session</p>
                      </div>
                    </div>
                    <Badge color="success" size="sm">Active</Badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <Phone01Icon class="size-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">iPhone 14</p>
                        <p class="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <button class="text-sm text-red-600 hover:text-red-700">Revoke</button>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          {/* Danger Zone */}
          <div class="overflow-hidden rounded-xl border border-red-200 dark:border-red-900/50">
            <button
              onClick={() => toggle('danger')}
              class="flex w-full items-center justify-between p-4 text-left"
            >
              <div class="flex items-center gap-3">
                <XCircleIcon class="size-5 text-red-500" />
                <span class="font-medium text-red-600 dark:text-red-400">Delete Account</span>
              </div>
              <svg
                class={`size-5 text-red-400 transition-transform ${expanded() === 'danger' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Show when={expanded() === 'danger'}>
              <div class="border-t border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">
                  This will permanently delete your account and all data. This action cannot be undone.
                </p>
                <div class="mt-4">
                  <Button color="failure" class="w-full justify-center">Delete Account</Button>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Code examples
// ============================================================================
const modernCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput, ToggleSwitch, Badge } from '@exowpee/solidly';
import { Key01Icon, ShieldTickIcon, Lock01Icon, RefreshCw01Icon, CheckIcon, AlertCircleIcon, DeleteIcon } from '@exowpee/solidly/icons';

export default function AccountSettings() {
  const [newPassword, setNewPassword] = createSignal('');
  const [twoFactor, setTwoFactor] = createSignal(false);
  const [saving, setSaving] = createSignal(false);

  const passwordStrength = () => {
    const pwd = newPassword();
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25;
    return strength;
  };

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-4xl px-4 py-8">
        {/* Security Score Card */}
        <div class="rounded-2xl bg-blue-600 p-6 shadow-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <ShieldTickIcon class="size-7 text-white" />
              <div>
                <p class="text-sm text-blue-100">Security Score</p>
                <p class="text-3xl font-bold text-white">85%</p>
              </div>
            </div>
            <Badge color="success">Good</Badge>
          </div>
        </div>

        {/* Change Password */}
        <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg ">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Key01Icon class="size-5 text-blue-500" />
            Change Password
          </h2>
          <form class="mt-6 space-y-5">
            <TextInput id="current" type="password" label="Current Password" icon={Lock01Icon} />
            <TextInput
              id="new"
              type="password"
              label="New Password"
              value={newPassword()}
              onInput={(e) => setNewPassword(e.currentTarget.value)}
            />
            <Show when={newPassword()}>
              <div class="h-1.5 rounded-full bg-gray-200">
                <div class="h-full rounded-full bg-green-500" style={{ width: \`\${passwordStrength()}%\` }} />
              </div>
            </Show>
            <Button color="info" disabled={saving()}>
              {saving() ? <RefreshCw01Icon class="size-4 animate-spin" /> : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold">Two-Factor Authentication</h2>
              <p class="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
          </div>
        </div>

        {/* Danger Zone */}
        <div class="mt-6 rounded-2xl border border-red-200 bg-red-50/70 p-6">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-red-800">
            <AlertCircleIcon class="size-5" />
            Danger Zone
          </h2>
          <Button color="failure" class="mt-4">
            <span class="flex items-center gap-2">
              <DeleteIcon class="size-4" />
              Delete Account
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}`;

const splitCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput, ToggleSwitch, Badge } from '@exowpee/solidly';
import { Key01Icon, ShieldTickIcon, Laptop01Icon, AlertCircleIcon } from '@exowpee/solidly/icons';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = createSignal('password');
  const [twoFactor, setTwoFactor] = createSignal(true);

  const tabs = [
    { id: 'password', label: 'Password', icon: Key01Icon },
    { id: 'security', label: 'Security', icon: ShieldTickIcon },
    { id: 'sessions', label: 'Sessions', icon: Laptop01Icon },
    { id: 'danger', label: 'Danger Zone', icon: AlertCircleIcon, danger: true },
  ];

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-6xl px-4 py-8">
        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="rounded-xl border bg-white">
            <div class="border-b p-6">
              <div class="flex items-center gap-3">
                <ShieldTickIcon class="size-6 text-green-600" />
                <div>
                  <p class="font-semibold">Account Secure</p>
                  <p class="text-sm text-green-600">2FA enabled</p>
                </div>
              </div>
            </div>
            <nav class="p-2">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    class={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 \${
                      activeTab() === tab.id
                        ? tab.danger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        : tab.danger ? 'text-red-600' : 'text-gray-700'
                    }\`}
                  >
                    <Dynamic component={tab.icon} class="size-5" />
                    {tab.label}
                  </button>
                )}
              </For>
            </nav>
          </div>

          {/* Content */}
          <div class="rounded-xl border bg-white p-6">
            {activeTab() === 'password' && (
              <form class="space-y-5">
                <TextInput id="current" type="password" label="Current Password" />
                <TextInput id="new" type="password" label="New Password" />
                <Button color="info">Update Password</Button>
              </form>
            )}
            {activeTab() === 'security' && (
              <div class="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p class="font-medium">Two-Factor Authentication</p>
                  <p class="text-sm text-gray-500">Protect your account with 2FA</p>
                </div>
                <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

const compactCode = `import { createSignal, Show } from 'solid-js';
import { Button, Badge, ToggleSwitch } from '@exowpee/solidly';
import { Key01Icon, ShieldTickIcon, Laptop01Icon, XCircleIcon } from '@exowpee/solidly/icons';

export default function AccountSettings() {
  const [expanded, setExpanded] = createSignal<string | null>('password');
  const [twoFactor, setTwoFactor] = createSignal(false);

  const toggle = (section: string) => {
    setExpanded(expanded() === section ? null : section);
  };

  return (
    <div class="min-h-full bg-white">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div class="text-center">
          <ShieldTickIcon class="mx-auto size-8 text-gray-700" />
          <h1 class="mt-4 text-2xl font-bold">Account Security</h1>
        </div>

        {/* Accordion Sections */}
        <div class="mt-8 space-y-4">
          {/* Password Section */}
          <div class="overflow-hidden rounded-xl border">
            <button
              onClick={() => toggle('password')}
              class="flex w-full items-center justify-between p-4"
            >
              <div class="flex items-center gap-3">
                <Key01Icon class="size-5 text-gray-500" />
                <span class="font-medium">Password</span>
              </div>
              <svg class={\`size-5 transition-transform \${expanded() === 'password' ? 'rotate-180' : ''}\`}>
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Show when={expanded() === 'password'}>
              <div class="border-t p-4">
                <form class="space-y-4">
                  <input type="password" placeholder="Current Password" class="w-full rounded-lg border px-3 py-2" />
                  <input type="password" placeholder="New Password" class="w-full rounded-lg border px-3 py-2" />
                  <Button color="dark" class="w-full justify-center">Update Password</Button>
                </form>
              </div>
            </Show>
          </div>

          {/* 2FA Section */}
          <div class="overflow-hidden rounded-xl border">
            <button onClick={() => toggle('2fa')} class="flex w-full items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <ShieldTickIcon class="size-5" />
                <span class="font-medium">Two-Factor Authentication</span>
                <Badge color={twoFactor() ? 'success' : 'gray'}>{twoFactor() ? 'Enabled' : 'Disabled'}</Badge>
              </div>
            </button>
            <Show when={expanded() === '2fa'}>
              <div class="border-t p-4">
                <ToggleSwitch checked={twoFactor()} onChange={setTwoFactor} label="" />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export default function AccountBlockPage() {
  return (
    <BlocksDocPage
      title="Account"
      description="Account settings page for password management, two-factor authentication, active sessions, and account deletion with premium security-focused designs."
      category="Settings"
      variants={[
        {
          id: 'modern',
          title: 'Modern Card',
          description: 'Glassmorphism design with security score, password strength indicator, and animated states.',
          component: AccountModern,
          code: modernCode,
        },
        {
          id: 'split',
          title: 'Split Layout',
          description: 'Sidebar navigation with security status indicator and tabbed content.',
          component: AccountSplit,
          code: splitCode,
        },
        {
          id: 'compact',
          title: 'Compact Accordion',
          description: 'Clean single-column layout with collapsible sections.',
          component: AccountCompact,
          code: compactCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'ToggleSwitch', path: '/components/toggle-switch' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        {
          name: 'Profile',
          path: '/blocks/settings/profile',
          description: 'Profile settings page',
        },
        {
          name: 'Notifications',
          path: '/blocks/settings/notifications',
          description: 'Notification preferences',
        },
      ]}
    />
  );
}

// Export components for iframe preview
export { AccountModern, AccountSplit, AccountCompact };
