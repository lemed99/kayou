import { createSignal, For, Show } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import {
  ArrowRightIcon,
  Lock01Icon,
  Mail01Icon,
  ShieldTickIcon,
  Star01Icon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// Modern card-based login
const ModernCardLogin = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        {/* Card */}
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Logo & Header */}
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
              <Lock01Icon class="size-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Social buttons */}
          <div class="mb-6 grid grid-cols-2 gap-3">
            <Button color="light" class="justify-center">
              <span class="flex items-center gap-2">
                <svg class="size-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </span>
            </Button>
            <Button color="light" class="justify-center">
              <span class="flex items-center gap-2">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-white px-3 text-gray-400 dark:bg-gray-800 dark:text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-5">
            <TextInput
              id="email"
              type="email"
              label="Email address"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@company.com"
              icon={Mail01Icon}
            />
            <TextInput
              id="password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
              icon={Lock01Icon}
            />

            <div class="flex items-center justify-between">
              <Checkbox id="remember" label="Keep me signed in" />
              <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
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
              <Show when={isLoading()}>
                Signing in...
              </Show>
            </Button>
          </form>

          {/* Footer */}
          <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Create free account
            </a>
          </p>
        </div>

        {/* Trust badges */}
        <div class="mt-6 flex items-center justify-center gap-6">
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldTickIcon class="size-4" />
            <span>256-bit SSL</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <Star01Icon class="size-4" />
            <span>4.9/5 rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Split screen with feature highlights
const PremiumSplitLogin = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const features = [
    { title: 'Real-time Analytics', description: 'Track your metrics instantly' },
    { title: 'Team Collaboration', description: 'Work together seamlessly' },
    { title: 'Advanced Security', description: 'Enterprise-grade protection' },
  ];

  return (
    <div class="flex min-h-full">
      {/* Left side - Feature showcase */}
      <div class="relative hidden w-1/2 overflow-hidden bg-blue-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
              <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">Solidly Pro</span>
          </div>
        </div>

        <div class="relative z-10 space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-white">
              Start building with premium components
            </h2>
            <p class="mt-3 text-lg text-blue-100">
              Join 10,000+ developers creating amazing products
            </p>
          </div>

          {/* Feature list */}
          <div class="space-y-4">
            <For each={features}>
              {(feature) => (
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <svg class="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-white">{feature.title}</p>
                    <p class="text-sm text-blue-200">{feature.description}</p>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Testimonial */}
          <div class="rounded-2xl border border-white/10 bg-white/10 p-6">
            <div class="flex gap-1">
              <For each={[1, 2, 3, 4, 5]}>
                {() => <Star01Icon class="size-4 text-yellow-400" />}
              </For>
            </div>
            <p class="mt-3 text-white">
              "The best component library I've ever used. It saved us weeks of development time."
            </p>
            <div class="mt-4 flex items-center gap-3">
              <div class="size-10 rounded-full bg-blue-500" />
              <div>
                <p class="font-semibold text-white">Sarah Chen</p>
                <p class="text-sm text-blue-200">CTO at TechStartup</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10 text-sm text-blue-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div class="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social login */}
          <div class="mb-6 space-y-3">
            <Button color="light" class="w-full justify-center">
              <span class="flex items-center gap-3">
                <svg class="size-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </span>
            </Button>
            <Button color="light" class="w-full justify-center">
              <span class="flex items-center gap-3">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-3 text-gray-400 dark:bg-gray-900 dark:text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form class="space-y-5">
            <TextInput
              id="split-email"
              type="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="name@company.com"
            />
            <TextInput
              id="split-password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
            />

            <div class="flex items-center justify-between">
              <Checkbox id="split-remember" label="Remember for 30 days" />
              <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Forgot password?
              </a>
            </div>

            <Button type="submit" color="info" class="w-full">
              Sign in
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            New to Solidly?{' '}
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Minimal elegant login
const MinimalLogin = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  return (
    <div class="flex min-h-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-sm">
        {/* Logo */}
        <div class="mb-10 flex justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
            <svg class="size-6 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Sign in to your account
        </h1>

        <form class="mt-10 space-y-6">
          <div class="space-y-5">
            <TextInput
              id="minimal-email"
              type="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="hello@example.com"
            />
            <div>
              <TextInput
                id="minimal-password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••••"
              />
              <div class="mt-2 text-right">
                <a href="#" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <Button type="submit" color="dark" class="w-full">
            Sign in
          </Button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-3 text-gray-400 dark:bg-gray-900 dark:text-gray-600">or</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <Button color="light" class="justify-center px-3">
              <svg class="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </Button>
            <Button color="light" class="justify-center px-3">
              <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Button>
            <Button color="light" class="justify-center px-3">
              <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="#" class="font-medium text-gray-900 hover:underline dark:text-white">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

const modernCardCode = `import { createSignal, Show } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { ArrowRightIcon, Lock01Icon, Mail01Icon, ShieldTickIcon, Star01Icon } from '@exowpee/solidly/icons';

export default function LoginPage() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle login...
  };

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Logo */}
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
              <Lock01Icon class="size-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Social buttons */}
          <div class="mb-6 grid grid-cols-2 gap-3">
            <Button color="light" class="justify-center gap-2">
              <GoogleIcon class="size-5" />
              Google
            </Button>
            <Button color="light" class="justify-center gap-2">
              <GitHubIcon class="size-5" />
              GitHub
            </Button>
          </div>

          <form onSubmit={handleSubmit} class="space-y-5">
            <TextInput
              id="email"
              type="email"
              label="Email address"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@company.com"
              icon={Mail01Icon}
            />
            <TextInput
              id="password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
              icon={Lock01Icon}
            />

            <div class="flex items-center justify-between">
              <Checkbox id="remember" label="Keep me signed in" />
              <a href="/forgot-password" class="text-sm font-medium text-blue-600">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              color="info"
              class="w-full gap-2"
              disabled={isLoading()}
              isLoading={isLoading()}
            >
              <Show when={!isLoading()}>
                Sign in <ArrowRightIcon class="size-4" />
              </Show>
              <Show when={isLoading()}>
                Signing in...
              </Show>
            </Button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" class="font-semibold text-blue-600">Create free account</a>
          </p>
        </div>

        {/* Trust badges */}
        <div class="mt-6 flex items-center justify-center gap-6">
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldTickIcon class="size-4" />
            <span>256-bit SSL</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <Star01Icon class="size-4" />
            <span>4.9/5 rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const splitScreenCode = `import { createSignal, For } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { Star01Icon } from '@exowpee/solidly/icons';

export default function SplitLoginPage() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const features = [
    { title: 'Real-time Analytics', description: 'Track metrics instantly' },
    { title: 'Team Collaboration', description: 'Work together seamlessly' },
    { title: 'Advanced Security', description: 'Enterprise-grade protection' },
  ];

  return (
    <div class="flex min-h-screen">
      {/* Left - Feature showcase */}
      <div class="hidden w-1/2 bg-blue-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <LogoIcon class="size-6 text-white" />
          </div>
          <span class="text-xl font-bold text-white">Solidly Pro</span>
        </div>

        <div class="space-y-8">
          <h2 class="text-3xl font-bold text-white">
            Start building with premium components
          </h2>
          <p class="text-lg text-blue-100">
            Join 10,000+ developers creating amazing products
          </p>

          <div class="space-y-4">
            <For each={features}>{(f) => (
              <div class="flex gap-3">
                <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                  <CheckIcon class="size-4 text-white" />
                </div>
                <div>
                  <p class="font-semibold text-white">{f.title}</p>
                  <p class="text-sm text-blue-200">{f.description}</p>
                </div>
              </div>
            )}</For>
          </div>

          {/* Testimonial card */}
          <div class="rounded-2xl border border-white/10 bg-white/10 p-6">
            <div class="flex gap-1">
              <For each={[1,2,3,4,5]}>{() => (
                <Star01Icon class="size-4 text-yellow-400" />
              )}</For>
            </div>
            <p class="mt-3 text-white">"The best component library I've ever used."</p>
            <div class="mt-4 flex items-center gap-3">
              <div class="size-10 rounded-full bg-blue-500" />
              <div>
                <p class="font-semibold text-white">Sarah Chen</p>
                <p class="text-sm text-blue-200">CTO at TechStartup</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-sm text-blue-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right - Form */}
      <div class="flex w-full items-center justify-center px-6 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </p>

          <div class="mt-8 space-y-3">
            <Button color="light" class="w-full justify-center gap-3">
              <GoogleIcon class="size-5" />
              Continue with Google
            </Button>
            <Button color="light" class="w-full justify-center gap-3">
              <GitHubIcon class="size-5" />
              Continue with GitHub
            </Button>
          </div>

          <form class="mt-6 space-y-5">
            <TextInput
              id="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="name@company.com"
            />
            <TextInput
              id="password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
            />

            <div class="flex items-center justify-between">
              <Checkbox id="remember" label="Remember for 30 days" />
              <a href="/forgot-password" class="text-sm font-medium text-blue-600">
                Forgot password?
              </a>
            </div>

            <Button type="submit" color="info" class="w-full">
              Sign in
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            New to Solidly?{' '}
            <a href="/signup" class="font-semibold text-blue-600">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const minimalCode = `import { createSignal } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';

export default function MinimalLoginPage() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div class="w-full max-w-sm">
        {/* Centered logo */}
        <div class="mb-10 flex justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
            <LogoIcon class="size-6 text-white dark:text-gray-900" />
          </div>
        </div>

        <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Sign in to your account
        </h1>

        <form class="mt-10 space-y-6">
          <div class="space-y-5">
            <TextInput
              id="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="hello@example.com"
            />
            <div>
              <TextInput
                id="password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••••"
              />
              <div class="mt-2 text-right">
                <a href="/forgot-password" class="text-sm text-gray-500">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <Button type="submit" color="dark" class="w-full">
            Sign in
          </Button>

          {/* Social icons row */}
          <div class="grid grid-cols-3 gap-3">
            <Button color="light" class="justify-center px-3">
              <GoogleIcon class="size-5" />
            </Button>
            <Button color="light" class="justify-center px-3">
              <GitHubIcon class="size-5" />
            </Button>
            <Button color="light" class="justify-center px-3">
              <XIcon class="size-5" />
            </Button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" class="font-medium text-gray-900 dark:text-white">Sign up</a>
        </p>
      </div>
    </div>
  );
}`;

export default function LoginBlockPage() {
  return (
    <BlocksDocPage
      title="Login"
      description="Professional login pages with social authentication, trust indicators, and elegant typography. All variants use Solidly components (Button, TextInput, Checkbox) and are fully responsive with dark mode support."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'modern-card',
          title: 'Modern Card',
          description: 'Clean card layout with social auth, loading states, and trust badges.',
          component: ModernCardLogin,
          code: modernCardCode,
        },
        {
          id: 'premium-split',
          title: 'Split Screen',
          description: 'Two-column layout with feature highlights, testimonial, and social login.',
          component: PremiumSplitLogin,
          code: splitScreenCode,
        },
        {
          id: 'minimal',
          title: 'Minimal',
          description: 'Clean, elegant design with centered logo and compact social auth icons.',
          component: MinimalLogin,
          code: minimalCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Checkbox', path: '/components/checkbox' },
      ]}
      relatedBlocks={[
        { name: 'Signup', path: '/blocks/authentication/signup', description: 'User registration forms' },
        { name: 'Forgot Password', path: '/blocks/authentication/forgot-password', description: 'Password reset request flow' },
        { name: 'OTP Verification', path: '/blocks/authentication/otp-verification', description: 'One-time password verification' },
      ]}
    />
  );
}

// Export components for iframe preview
export { ModernCardLogin, PremiumSplitLogin, MinimalLogin };
