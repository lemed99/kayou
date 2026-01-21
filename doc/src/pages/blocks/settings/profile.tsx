import { createSignal, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Button, TextInput, Textarea, Badge } from '@exowpee/solidly';
import {
  Camera01Icon,
  Edit02Icon,
  Globe02Icon,
  Image01Icon,
  Link01Icon,
  Mail02Icon,
  MarkerPin01Icon,
  CheckIcon,
  User02Icon,
  UserCircleIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// VARIANT 1: Modern Card - Glassmorphism with animated elements
// ============================================================================
const ProfileModern = () => {
  const [name, setName] = createSignal('John Doe');
  const [email, setEmail] = createSignal('john@example.com');
  const [bio, setBio] = createSignal('Software engineer passionate about building great products.');
  const [website, setWebsite] = createSignal('https://johndoe.com');
  const [location, setLocation] = createSignal('San Francisco, CA');
  const [saved, setSaved] = createSignal(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div class="min-h-full bg-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Background decorations */}
      <div class="pointer-events-none fixed inset-0 overflow-hidden">
        <div class="absolute -left-40 -top-40 size-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div class="absolute -bottom-40 -right-40 size-96 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your public profile information.
          </p>
        </div>

        <div class="space-y-6">
          {/* Profile Header Card */}
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl  dark:border-gray-700/50 dark:bg-gray-900/70">
            <div class="absolute -right-20 -top-20 size-64 rounded-full hidden" />

            <div class="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div class="group relative">
                <div class="flex size-28 items-center justify-center rounded-2xl bg-blue-600 text-4xl font-bold text-white shadow-lg shadow-blue-500/30">
                  JD
                </div>
                <button class="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-lg transition-transform hover:scale-110 dark:bg-gray-700 dark:text-white">
                  <Camera01Icon class="size-5" />
                </button>
              </div>

              {/* Info */}
              <div class="flex-1 text-center sm:text-left">
                <div class="flex flex-col items-center gap-2 sm:flex-row">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{name()}</h2>
                  <Badge color="default">Pro Member</Badge>
                </div>
                <p class="mt-1 text-gray-500 dark:text-gray-400">{email()}</p>
                <div class="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
                  <span class="flex items-center gap-1">
                    <MarkerPin01Icon class="size-4" />
                    {location()}
                  </span>
                  <span class="flex items-center gap-1">
                    <Globe02Icon class="size-4" />
                    {website()}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <Button color="light">
                <span class="flex items-center gap-2">
                  <Edit02Icon class="size-4" />
                  Edit Cover
                </span>
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-900/70">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <User02Icon class="size-5 text-blue-500" />
              Personal Information
            </h2>
            <form class="mt-6 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <TextInput
                  id="name"
                  type="text"
                  label="Full Name"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  icon={UserCircleIcon}
                />
                <TextInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  icon={Mail02Icon}
                />
              </div>

              <TextInput
                id="location"
                type="text"
                label="Location"
                value={location()}
                onInput={(e) => setLocation(e.currentTarget.value)}
                icon={MarkerPin01Icon}
                placeholder="City, Country"
              />

              <div>
                <Textarea
                  id="bio"
                  label="Bio"
                  value={bio()}
                  onInput={(e) => setBio(e.currentTarget.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <TextInput
                id="website"
                type="url"
                label="Website"
                value={website()}
                onInput={(e) => setWebsite(e.currentTarget.value)}
                icon={Link01Icon}
                placeholder="https://example.com"
              />

              <div class="flex justify-end pt-2">
                <Button
                  type="button"
                  color={saved() ? 'success' : 'info'}
                  onClick={handleSave}
                >
                  {saved() ? (
                    <span class="flex items-center gap-2">
                      <CheckIcon class="size-4" />
                      Saved!
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Social Links */}
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg  dark:border-gray-700/50 dark:bg-gray-900/70">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Globe02Icon class="size-5 text-blue-500" />
              Social Links
            </h2>
            <div class="mt-6 space-y-4">
              <For each={[
                { name: 'Twitter', placeholder: '@username', icon: 'twitter', color: 'text-sky-500' },
                { name: 'GitHub', placeholder: 'username', icon: 'github', color: 'text-gray-900 dark:text-white' },
                { name: 'LinkedIn', placeholder: 'in/username', icon: 'linkedin', color: 'text-blue-600' },
              ]}>{(social) => (
                <div class="flex items-center gap-4">
                  <div class={`flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 ${social.color}`}>
                    <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                      {social.icon === 'twitter' && (
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      )}
                      {social.icon === 'github' && (
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      )}
                      {social.icon === 'linkedin' && (
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      )}
                    </svg>
                  </div>
                  <TextInput
                    type="text"
                    placeholder={social.placeholder}
                    class="flex-1"
                  />
                </div>
              )}</For>
            </div>
            <div class="mt-6 flex justify-end">
              <Button color="info">Save Links</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VARIANT 2: Split Layout - Sidebar navigation with content area
// ============================================================================
const ProfileSplit = () => {
  const [activeTab, setActiveTab] = createSignal('personal');
  const [name] = createSignal('John Doe');
  const [email, setEmail] = createSignal('john@example.com');
  const [bio, setBio] = createSignal('Software engineer passionate about building great products.');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User02Icon },
    { id: 'photo', label: 'Photo', icon: Image01Icon },
    { id: 'social', label: 'Social Links', icon: Globe02Icon },
  ];

  return (
    <div class="min-h-full bg-gray-50 dark:bg-gray-900">
      <div class="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your public profile information.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="lg:sticky lg:top-8 lg:self-start">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              {/* Profile Summary */}
              <div class="border-b border-gray-200 p-6 dark:border-gray-700">
                <div class="flex flex-col items-center text-center">
                  <div class="flex size-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    JD
                  </div>
                  <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">{name()}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{email()}</p>
                  <Badge color="default" class="mt-2">Pro Member</Badge>
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
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
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
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            {activeTab() === 'personal' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal details here.
                </p>
                <form class="mt-6 space-y-5">
                  <div class="grid gap-5 sm:grid-cols-2">
                    <TextInput
                      id="first-name"
                      type="text"
                      label="First Name"
                      value="John"
                    />
                    <TextInput
                      id="last-name"
                      type="text"
                      label="Last Name"
                      value="Doe"
                    />
                  </div>
                  <TextInput
                    id="email-split"
                    type="email"
                    label="Email Address"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                  />
                  <TextInput
                    id="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                  />
                  <Textarea
                    id="bio-split"
                    label="Bio"
                    value={bio()}
                    onInput={(e) => setBio(e.currentTarget.value)}
                    rows={4}
                  />
                  <div class="flex justify-end gap-3 pt-4">
                    <Button color="light">Cancel</Button>
                    <Button color="info">Save Changes</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab() === 'photo' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your profile photo and cover image.
                </p>
                <div class="mt-6 space-y-6">
                  {/* Profile Photo */}
                  <div class="flex items-center gap-6">
                    <div class="flex size-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                      JD
                    </div>
                    <div class="space-y-2">
                      <div class="flex gap-2">
                        <Button color="light" size="sm">Change photo</Button>
                        <Button color="light" size="sm">Remove</Button>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</label>
                    <div class="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 dark:border-gray-600">
                      <div class="text-center">
                        <Image01Icon class="mx-auto size-12 text-gray-400" />
                        <div class="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                          <label class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload a file</span>
                            <input type="file" class="sr-only" />
                          </label>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab() === 'social' && (
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add your social media profiles.
                </p>
                <div class="mt-6 space-y-4">
                  <TextInput
                    id="twitter"
                    label="Twitter"
                    placeholder="https://twitter.com/username"
                    icon={Globe02Icon}
                  />
                  <TextInput
                    id="github"
                    label="GitHub"
                    placeholder="https://github.com/username"
                    icon={Globe02Icon}
                  />
                  <TextInput
                    id="linkedin"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/username"
                    icon={Globe02Icon}
                  />
                  <TextInput
                    id="portfolio"
                    label="Portfolio"
                    placeholder="https://yoursite.com"
                    icon={Link01Icon}
                  />
                </div>
                <div class="mt-6 flex justify-end">
                  <Button color="info">Save Links</Button>
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
// VARIANT 3: Minimal - Clean single-column layout
// ============================================================================
const ProfileMinimal = () => {
  const [name, setName] = createSignal('John Doe');
  const [email, setEmail] = createSignal('john@example.com');
  const [bio, setBio] = createSignal('Software engineer passionate about building great products.');

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Profile Header */}
        <div class="flex flex-col items-center text-center">
          <div class="relative">
            <div class="flex size-24 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white dark:bg-white dark:text-gray-900">
              JD
            </div>
            <button class="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-900 dark:bg-gray-700 dark:text-gray-300">
              <Camera01Icon class="size-4" />
            </button>
          </div>
          <h1 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{name()}</h1>
          <p class="text-gray-500 dark:text-gray-400">{email()}</p>
        </div>

        {/* Divider */}
        <div class="my-8 border-t border-gray-200 dark:border-gray-800" />

        {/* Form */}
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="mt-2 w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="mt-2 w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">Bio</label>
            <textarea
              value={bio()}
              onInput={(e) => setBio(e.currentTarget.value)}
              rows={3}
              class="mt-2 w-full resize-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">Website</label>
            <input
              type="url"
              placeholder="https://"
              class="mt-2 w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div class="pt-6">
            <Button color="dark" class="w-full justify-center">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Code examples
// ============================================================================
const modernCode = `import { createSignal } from 'solid-js';
import { Button, TextInput, Textarea, Badge } from '@exowpee/solidly';
import { Camera01Icon, User02Icon, Mail02Icon, Globe02Icon, Link01Icon, MarkerPin01Icon, CheckIcon } from '@exowpee/solidly/icons';

export default function ProfileSettings() {
  const [name, setName] = createSignal('John Doe');
  const [email, setEmail] = createSignal('john@example.com');
  const [bio, setBio] = createSignal('Software engineer...');
  const [saved, setSaved] = createSignal(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-4xl px-4 py-8">
        {/* Profile Header Card */}
        <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl ">
          <div class="flex items-center gap-6">
            <div class="group relative">
              <div class="flex size-28 items-center justify-center rounded-2xl bg-blue-600 text-4xl font-bold text-white shadow-lg">
                JD
              </div>
              <button class="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-xl bg-white shadow-lg">
                <Camera01Icon class="size-5" />
              </button>
            </div>
            <div>
              <h2 class="text-2xl font-bold">{name()}</h2>
              <Badge color="default">Pro Member</Badge>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg ">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <User02Icon class="size-5 text-blue-500" />
            Personal Information
          </h2>
          <form class="mt-6 space-y-5">
            <TextInput
              id="name"
              label="Full Name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              icon={UserCircleIcon}
            />
            <Textarea id="bio" label="Bio" value={bio()} rows={3} />
            <Button color={saved() ? 'success' : 'info'} onClick={handleSave}>
              {saved() ? 'Saved!' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}`;

const splitCode = `import { createSignal, For } from 'solid-js';
import { Button, TextInput, Textarea, Badge } from '@exowpee/solidly';
import { User02Icon, Image01Icon, Globe02Icon } from '@exowpee/solidly/icons';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = createSignal('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User02Icon },
    { id: 'photo', label: 'Photo', icon: Image01Icon },
    { id: 'social', label: 'Social Links', icon: Globe02Icon },
  ];

  return (
    <div class="min-h-full bg-gray-50">
      <div class="mx-auto max-w-6xl px-4 py-8">
        <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div class="rounded-xl border bg-white">
            <div class="border-b p-6 text-center">
              <div class="mx-auto size-20 rounded-full bg-blue-600" />
              <h3 class="mt-4 font-semibold">John Doe</h3>
              <Badge color="default" class="mt-2">Pro Member</Badge>
            </div>
            <nav class="p-2">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    class={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 \${
                      activeTab() === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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
            {activeTab() === 'personal' && (
              <form class="space-y-5">
                <TextInput id="name" label="Full Name" />
                <TextInput id="email" type="email" label="Email" />
                <Textarea id="bio" label="Bio" rows={4} />
                <Button color="info">Save Changes</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

const minimalCode = `import { createSignal } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { Camera01Icon } from '@exowpee/solidly/icons';

export default function ProfileSettings() {
  const [name, setName] = createSignal('John Doe');
  const [email, setEmail] = createSignal('john@example.com');
  const [bio, setBio] = createSignal('Software engineer...');

  return (
    <div class="min-h-full bg-white">
      <div class="mx-auto max-w-2xl px-4 py-12">
        {/* Profile Header */}
        <div class="flex flex-col items-center text-center">
          <div class="relative">
            <div class="flex size-24 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
              JD
            </div>
            <button class="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-gray-100">
              <Camera01Icon class="size-4" />
            </button>
          </div>
          <h1 class="mt-4 text-xl font-semibold">{name()}</h1>
        </div>

        <div class="my-8 border-t" />

        {/* Minimal Form */}
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="mt-2 w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Bio</label>
            <textarea
              value={bio()}
              rows={3}
              class="mt-2 w-full resize-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2"
            />
          </div>
          <Button color="dark" class="w-full justify-center">
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}`;

export default function ProfileBlockPage() {
  return (
    <BlocksDocPage
      title="Profile"
      description="Profile settings page for managing user information, profile photo, and social links with multiple premium design variants."
      category="Settings"
      variants={[
        {
          id: 'modern',
          title: 'Modern Card',
          description: 'Glassmorphism design with gradient backgrounds and animated elements.',
          component: ProfileModern,
          code: modernCode,
        },
        {
          id: 'split',
          title: 'Split Layout',
          description: 'Sidebar navigation with tabbed content area for organized settings.',
          component: ProfileSplit,
          code: splitCode,
        },
        {
          id: 'minimal',
          title: 'Minimal',
          description: 'Clean single-column layout with borderless inputs.',
          component: ProfileMinimal,
          code: minimalCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Textarea', path: '/components/textarea' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        {
          name: 'Account',
          path: '/blocks/settings/account',
          description: 'Account settings and security',
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
export { ProfileModern, ProfileSplit, ProfileMinimal };
