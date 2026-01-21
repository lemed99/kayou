import { For, Show, createSignal } from 'solid-js';

import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import {
  ArrowRightIcon,
  Building07Icon,
  CheckIcon,
  Lock01Icon,
  Mail01Icon,
  UserPlus01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';

import BlocksDocPage from '../../../components/BlocksDocPage';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: string;
  memberCount: number;
}

// Organization Select Login - User selects workspace before credentials
const OrganizationSelectLogin = () => {
  const [step, setStep] = createSignal<'email' | 'select' | 'credentials'>('email');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [selectedOrg, setSelectedOrg] = createSignal<Organization | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const organizations: Organization[] = [
    { id: '1', name: 'Acme Corporation', slug: 'acme', role: 'Admin', memberCount: 45 },
    {
      id: '2',
      name: 'TechStartup Inc',
      slug: 'techstartup',
      role: 'Member',
      memberCount: 12,
    },
    {
      id: '3',
      name: 'Design Studio',
      slug: 'design-studio',
      role: 'Owner',
      memberCount: 8,
    },
  ];

  const handleEmailSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('select');
    }, 1000);
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    setStep('credentials');
  };

  const handleLogin = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Logo & Header */}
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
              <Building07Icon class="size-7 text-white" />
            </div>
            <Show when={step() === 'email'}>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter your email to find your organizations
              </p>
            </Show>
            <Show when={step() === 'select'}>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Select workspace
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Choose the organization you want to sign into
              </p>
            </Show>
            <Show when={step() === 'credentials'}>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Sign in to {selectedOrg()?.name}
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter your password to continue
              </p>
            </Show>
          </div>

          {/* Step 1: Email Input */}
          <Show when={step() === 'email'}>
            <form onSubmit={handleEmailSubmit} class="space-y-5">
              <TextInput
                id="org-email"
                type="email"
                label="Work email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@company.com"
                icon={Mail01Icon}
              />
              <Button
                type="submit"
                color="info"
                class="w-full"
                disabled={isLoading() || !email()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  <span class="flex items-center gap-2">
                    Continue <ArrowRightIcon class="size-4" />
                  </span>
                </Show>
                <Show when={isLoading()}>Finding workspaces...</Show>
              </Button>
            </form>

            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div class="relative flex justify-center text-xs">
                  <span class="bg-white px-3 text-gray-400 dark:bg-gray-800">or</span>
                </div>
              </div>
              <Button color="light" class="mt-4 w-full justify-center">
                <span class="flex items-center gap-2">
                  <UserPlus01Icon class="size-4" />
                  Create new organization
                </span>
              </Button>
            </div>
          </Show>

          {/* Step 2: Organization Selection */}
          <Show when={step() === 'select'}>
            <div class="space-y-3">
              <For each={organizations}>
                {(org) => (
                  <button
                    type="button"
                    onClick={() => handleOrgSelect(org)}
                    class="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20"
                  >
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                      {org.name.charAt(0)}
                    </div>
                    <div class="flex-1 overflow-hidden">
                      <p class="truncate font-semibold text-gray-900 dark:text-white">
                        {org.name}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {org.slug}.solidly.app · {org.role}
                      </p>
                    </div>
                    <div class="flex items-center gap-1.5 text-sm text-gray-400">
                      <Users01Icon class="size-4" />
                      <span>{org.memberCount}</span>
                    </div>
                  </button>
                )}
              </For>
            </div>

            <button
              type="button"
              onClick={() => setStep('email')}
              class="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Use a different email
            </button>
          </Show>

          {/* Step 3: Password */}
          <Show when={step() === 'credentials'}>
            <div class="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
              <div class="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                {selectedOrg()?.name.charAt(0)}
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {selectedOrg()?.name}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{email()}</p>
              </div>
            </div>

            <form onSubmit={handleLogin} class="space-y-5">
              <TextInput
                id="org-password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter your password"
                icon={Lock01Icon}
              />

              <div class="flex items-center justify-between">
                <Checkbox id="org-remember" label="Stay signed in" />
                <a
                  href="#"
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                color="info"
                class="w-full"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  <span class="flex items-center gap-2">
                    Sign in <ArrowRightIcon class="size-4" />
                  </span>
                </Show>
                <Show when={isLoading()}>Signing in...</Show>
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setStep('select')}
              class="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Choose different workspace
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
};

// Organization Signup - Create new workspace during registration
const OrganizationSignup = () => {
  const [step, setStep] = createSignal<'account' | 'organization' | 'invite'>('account');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [orgName, setOrgName] = createSignal('');
  const [orgSlug, setOrgSlug] = createSignal('');
  const [inviteEmails, setInviteEmails] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOrgNameChange = (value: string) => {
    setOrgName(value);
    setOrgSlug(generateSlug(value));
  };

  const handleAccountSubmit = (e: Event) => {
    e.preventDefault();
    setStep('organization');
  };

  const handleOrgSubmit = (e: Event) => {
    e.preventDefault();
    setStep('invite');
  };

  const handleComplete = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const steps = [
    { id: 'account', label: 'Account' },
    { id: 'organization', label: 'Organization' },
    { id: 'invite', label: 'Team' },
  ];

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-lg">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Progress Steps */}
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <For each={steps}>
                {(s, index) => (
                  <div class="flex items-center">
                    <div
                      class="flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors"
                      classList={{
                        'bg-indigo-600 text-white':
                          step() === s.id ||
                          steps.findIndex((x) => x.id === step()) > index(),
                        'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400':
                          step() !== s.id &&
                          steps.findIndex((x) => x.id === step()) <= index(),
                      }}
                    >
                      <Show
                        when={steps.findIndex((x) => x.id === step()) > index()}
                        fallback={index() + 1}
                      >
                        <CheckIcon class="size-4" />
                      </Show>
                    </div>
                    <span class="ml-2 hidden text-sm font-medium text-gray-700 sm:block dark:text-gray-300">
                      {s.label}
                    </span>
                    <Show when={index() < steps.length - 1}>
                      <div class="mx-4 h-0.5 w-12 bg-gray-200 dark:bg-gray-700" />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Step 1: Account Creation */}
          <Show when={step() === 'account'}>
            <div class="mb-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Create your account
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start with your personal details
              </p>
            </div>

            <form onSubmit={handleAccountSubmit} class="space-y-5">
              <TextInput
                id="signup-name"
                label="Full name"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                placeholder="John Doe"
              />
              <TextInput
                id="signup-email"
                type="email"
                label="Work email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="john@company.com"
                icon={Mail01Icon}
              />
              <TextInput
                id="signup-password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Min. 8 characters"
                icon={Lock01Icon}
              />

              <Button type="submit" color="info" class="w-full">
                <span class="flex items-center gap-2">
                  Continue <ArrowRightIcon class="size-4" />
                </span>
              </Button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in
              </a>
            </p>
          </Show>

          {/* Step 2: Organization Setup */}
          <Show when={step() === 'organization'}>
            <div class="mb-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Create your workspace
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Set up your organization's home
              </p>
            </div>

            <form onSubmit={handleOrgSubmit} class="space-y-5">
              <TextInput
                id="org-name"
                label="Organization name"
                value={orgName()}
                onInput={(e) => handleOrgNameChange(e.currentTarget.value)}
                placeholder="Acme Inc"
                icon={Building07Icon}
              />
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Workspace URL
                </label>
                <div class="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  <span class="flex h-10 items-center border-r border-gray-300 bg-gray-100 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    solidly.app/
                  </span>
                  <input
                    type="text"
                    value={orgSlug()}
                    onInput={(e) => setOrgSlug(e.currentTarget.value)}
                    placeholder="acme"
                    class="h-10 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none dark:text-white"
                  />
                </div>
              </div>

              <div class="flex gap-3">
                <Button
                  type="button"
                  color="light"
                  class="flex-1"
                  onClick={() => setStep('account')}
                >
                  Back
                </Button>
                <Button type="submit" color="info" class="flex-1">
                  <span class="flex items-center gap-2">
                    Continue <ArrowRightIcon class="size-4" />
                  </span>
                </Button>
              </div>
            </form>
          </Show>

          {/* Step 3: Invite Team */}
          <Show when={step() === 'invite'}>
            <div class="mb-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Invite your team
              </h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Collaboration is better together
              </p>
            </div>

            <form onSubmit={handleComplete} class="space-y-5">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Invite by email
                </label>
                <textarea
                  value={inviteEmails()}
                  onInput={(e) => setInviteEmails(e.currentTarget.value)}
                  placeholder="sarah@company.com, mike@company.com"
                  rows={3}
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                />
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple emails with commas
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                    {orgName().charAt(0) || 'A'}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {orgName() || 'Your Organization'}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      solidly.app/{orgSlug() || 'your-org'}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <Button
                  type="button"
                  color="light"
                  class="flex-1"
                  onClick={() => setStep('organization')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  color="info"
                  class="flex-1"
                  disabled={isLoading()}
                  isLoading={isLoading()}
                >
                  <Show when={!isLoading()}>
                    <span class="flex items-center gap-2">
                      Create workspace <ArrowRightIcon class="size-4" />
                    </span>
                  </Show>
                  <Show when={isLoading()}>Creating...</Show>
                </Button>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                class="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Skip for now
              </button>
            </form>
          </Show>
        </div>
      </div>
    </div>
  );
};

// Team Invitation Accept - Join organization via invite
const TeamInvitationAccept = () => {
  const [name, setName] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const invitation = {
    email: 'sarah@example.com',
    organization: 'Acme Corporation',
    invitedBy: 'John Doe',
    invitedByAvatar: null,
    role: 'Member',
  };

  const handleJoin = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Invitation Header */}
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <UserPlus01Icon class="size-8 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              You're invited!
            </h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Join{' '}
              <span class="font-semibold text-gray-900 dark:text-white">
                {invitation.organization}
              </span>
            </p>
          </div>

          {/* Invitation Details */}
          <div class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div class="flex items-center gap-4">
              <div class="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                {invitation.organization.charAt(0)}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {invitation.organization}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Invited by {invitation.invitedBy}
                </p>
              </div>
              <div class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {invitation.role}
              </div>
            </div>
          </div>

          {/* Accepted Email */}
          <div class="mb-6">
            <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
              <Mail01Icon class="size-5 text-gray-400" />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {invitation.email}
              </span>
              <CheckIcon class="ml-auto size-5 text-green-500" />
            </div>
          </div>

          {/* Create Account Form */}
          <form onSubmit={handleJoin} class="space-y-5">
            <TextInput
              id="invite-name"
              label="Your name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="Sarah Johnson"
            />
            <TextInput
              id="invite-password"
              type="password"
              label="Create password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Min. 8 characters"
              icon={Lock01Icon}
            />

            <div class="flex items-start gap-3">
              <Checkbox
                id="invite-terms"
                label={
                  <span>
                    I agree to the{' '}
                    <a
                      href="#"
                      class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Privacy Policy
                    </a>
                  </span>
                }
              />
            </div>

            <Button
              type="submit"
              color="success"
              class="w-full"
              disabled={isLoading()}
              isLoading={isLoading()}
            >
              <Show when={!isLoading()}>
                <span class="flex items-center gap-2">
                  <UserPlus01Icon class="size-4" />
                  Accept invitation
                </span>
              </Show>
              <Show when={isLoading()}>Joining workspace...</Show>
            </Button>
          </form>

          {/* Existing Account */}
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="bg-white px-3 text-gray-400 dark:bg-gray-800">
                  Already have an account?
                </span>
              </div>
            </div>
            <Button color="light" class="mt-4 w-full justify-center">
              Sign in to existing account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Code snippets for documentation
const orgSelectCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { Building07Icon, Lock01Icon, Mail01Icon, Users01Icon } from '@exowpee/solidly/icons';

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  memberCount: number;
}

export default function OrganizationLogin() {
  const [step, setStep] = createSignal<'email' | 'select' | 'credentials'>('email');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [selectedOrg, setSelectedOrg] = createSignal<Organization | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  // Fetch user's organizations after email entry
  const handleEmailSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    // const orgs = await fetchOrganizations(email());
    setStep('select');
    setIsLoading(false);
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    setStep('credentials');
  };

  return (
    <div class="w-full max-w-md mx-auto">
      {/* Step 1: Email to find orgs */}
      <Show when={step() === 'email'}>
        <form onSubmit={handleEmailSubmit}>
          <TextInput
            label="Work email"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            icon={Mail01Icon}
          />
          <Button type="submit" isLoading={isLoading()}>
            Find workspaces
          </Button>
        </form>
      </Show>

      {/* Step 2: Select organization */}
      <Show when={step() === 'select'}>
        <For each={organizations}>{(org) => (
          <button onClick={() => handleOrgSelect(org)}>
            <span>{org.name}</span>
            <span>{org.role}</span>
          </button>
        )}</For>
      </Show>

      {/* Step 3: Enter password */}
      <Show when={step() === 'credentials'}>
        <form onSubmit={handleLogin}>
          <TextInput
            label="Password"
            type="password"
            value={password()}
            icon={Lock01Icon}
          />
          <Button type="submit">Sign in to {selectedOrg()?.name}</Button>
        </form>
      </Show>
    </div>
  );
}`;

const orgSignupCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { Building07Icon, Mail01Icon, Lock01Icon } from '@exowpee/solidly/icons';

export default function OrganizationSignup() {
  const [step, setStep] = createSignal<'account' | 'organization' | 'invite'>('account');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [orgName, setOrgName] = createSignal('');
  const [orgSlug, setOrgSlug] = createSignal('');
  const [inviteEmails, setInviteEmails] = createSignal('');

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOrgNameChange = (value: string) => {
    setOrgName(value);
    setOrgSlug(generateSlug(value));
  };

  return (
    <div class="w-full max-w-lg mx-auto">
      {/* Step indicators */}
      <div class="flex items-center justify-between mb-8">
        {['Account', 'Organization', 'Team'].map((label, i) => (
          <div class="flex items-center">
            <div class={\`size-8 rounded-full \${i <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}\`}>
              {i + 1}
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Account */}
      <Show when={step() === 'account'}>
        <TextInput label="Full name" value={name()} />
        <TextInput label="Work email" type="email" value={email()} />
        <TextInput label="Password" type="password" value={password()} />
        <Button onClick={() => setStep('organization')}>Continue</Button>
      </Show>

      {/* Step 2: Organization */}
      <Show when={step() === 'organization'}>
        <TextInput
          label="Organization name"
          value={orgName()}
          onInput={(e) => handleOrgNameChange(e.currentTarget.value)}
        />
        <div class="flex items-center">
          <span>solidly.app/</span>
          <input value={orgSlug()} />
        </div>
        <Button onClick={() => setStep('invite')}>Continue</Button>
      </Show>

      {/* Step 3: Invite team */}
      <Show when={step() === 'invite'}>
        <textarea
          value={inviteEmails()}
          placeholder="sarah@company.com, mike@company.com"
        />
        <Button>Create workspace</Button>
      </Show>
    </div>
  );
}`;

const teamInviteCode = `import { createSignal, Show } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { Lock01Icon, Mail01Icon, UserPlus01Icon } from '@exowpee/solidly/icons';

interface Invitation {
  email: string;
  organization: string;
  invitedBy: string;
  role: string;
}

export default function TeamInvitationAccept() {
  const [name, setName] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  // Get invitation details from URL token
  const invitation: Invitation = {
    email: 'sarah@example.com',
    organization: 'Acme Corporation',
    invitedBy: 'John Doe',
    role: 'Member',
  };

  const handleJoin = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    // await acceptInvitation({ name: name(), password: password() });
  };

  return (
    <div class="w-full max-w-md mx-auto">
      {/* Invitation header */}
      <div class="text-center mb-8">
        <UserPlus01Icon class="size-12 text-green-500" />
        <h1>You're invited!</h1>
        <p>Join {invitation.organization}</p>
      </div>

      {/* Invitation details card */}
      <div class="rounded-xl border p-4">
        <span>{invitation.organization}</span>
        <span>Invited by {invitation.invitedBy}</span>
        <span>{invitation.role}</span>
      </div>

      {/* Create account form */}
      <form onSubmit={handleJoin}>
        <TextInput label="Your name" value={name()} />
        <TextInput label="Create password" type="password" value={password()} />
        <Checkbox label="I agree to the Terms" />
        <Button type="submit" color="success" isLoading={isLoading()}>
          <UserPlus01Icon />
          Accept invitation
        </Button>
      </form>

      {/* Existing account option */}
      <Button color="light">Sign in to existing account</Button>
    </div>
  );
}`;

export default function OrganizationAuthPage() {
  return (
    <BlocksDocPage
      title="Organization Auth"
      description="Multi-tenant authentication flows for SaaS applications. Handle organization selection during login, workspace creation during signup, and team invitation acceptance. All variants support dark mode and are fully responsive."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'org-select-login',
          title: 'Organization Select',
          description:
            'Multi-step login with email lookup and workspace selection before credentials.',
          component: OrganizationSelectLogin,
          code: orgSelectCode,
        },
        {
          id: 'org-signup',
          title: 'Workspace Signup',
          description:
            'Step-by-step registration with account creation, organization setup, and team invites.',
          component: OrganizationSignup,
          code: orgSignupCode,
        },
        {
          id: 'team-invite',
          title: 'Team Invitation',
          description:
            'Accept invitation to join an existing organization with account creation.',
          component: TeamInvitationAccept,
          code: teamInviteCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Checkbox', path: '/components/checkbox' },
      ]}
      relatedBlocks={[
        {
          name: 'Login',
          path: '/blocks/authentication/login',
          description: 'Standard login forms',
        },
        {
          name: 'Signup',
          path: '/blocks/authentication/signup',
          description: 'User registration forms',
        },
        {
          name: 'OTP Verification',
          path: '/blocks/authentication/otp-verification',
          description: 'Two-factor verification',
        },
      ]}
    />
  );
}

// Export components for iframe preview
export { OrganizationSelectLogin, OrganizationSignup, TeamInvitationAccept };
