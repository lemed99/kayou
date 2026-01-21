import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Key01Icon,
  Lock01Icon,
  Mail01Icon,
  Mail02Icon,
  ShieldTickIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// Modern card forgot password
const ModernCardForgotPassword = () => {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Show when={!submitted()}>
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                <Key01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5">
              <TextInput
                id="email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Enter your email"
                icon={Mail01Icon}
              />

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Send reset link <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>
                  Sending...
                </Show>
              </Button>

              <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeftIcon class="size-4" />
                Back to login
              </a>
            </form>
          </Show>

          <Show when={submitted()}>
            <div class="text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-500 shadow-lg">
                <Mail02Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We sent a password reset link to<br />
                <span class="font-semibold text-gray-900 dark:text-white">{email()}</span>
              </p>

              <div class="mt-8 space-y-4">
                <Button type="button" color="info" class="w-full" onClick={() => window.open('https://mail.google.com', '_blank')}>
                  Open email app
                </Button>

                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email?{' '}
                  <button type="button" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400" onClick={() => setSubmitted(false)}>
                    Click to resend
                  </button>
                </p>

                <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <ArrowLeftIcon class="size-4" />
                  Back to login
                </a>
              </div>
            </div>
          </Show>
        </div>

        <div class="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldTickIcon class="size-4" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

// Split screen forgot password
const SplitScreenForgotPassword = () => {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);

  return (
    <div class="flex min-h-full">
      {/* Left side */}
      <div class="relative hidden w-1/2 overflow-hidden bg-blue-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
              <Lock01Icon class="size-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">Solidly Pro</span>
          </div>
        </div>

        <div class="relative z-10 space-y-6">
          <h2 class="text-3xl font-bold text-white">
            Reset your password<br />in seconds
          </h2>
          <p class="text-lg text-blue-100">
            We'll send you a secure link to create a new password.
          </p>

          <div class="space-y-4">
            <div class="flex items-center gap-3 text-blue-100">
              <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                <svg class="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Secure reset link</span>
            </div>
            <div class="flex items-center gap-3 text-blue-100">
              <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                <svg class="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Link expires in 24 hours</span>
            </div>
            <div class="flex items-center gap-3 text-blue-100">
              <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                <svg class="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>256-bit encryption</span>
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
          <Show when={!submitted()}>
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h1>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} class="space-y-6">
              <TextInput
                id="split-email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@company.com"
              />

              <Button type="submit" color="info" class="w-full">
                Send reset link
              </Button>

              <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeftIcon class="size-4" />
                Back to login
              </a>
            </form>
          </Show>

          <Show when={submitted()}>
            <div class="text-center">
              <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Mail02Icon class="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Check your inbox</h1>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                We've sent a reset link to<br />
                <span class="font-semibold text-gray-900 dark:text-white">{email()}</span>
              </p>

              <div class="mt-8 space-y-4">
                <Button type="button" color="info" class="w-full">
                  Open email app
                </Button>

                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Didn't get the email?{' '}
                  <button class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400" onClick={() => setSubmitted(false)}>
                    Resend
                  </button>
                </p>

                <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <ArrowLeftIcon class="size-4" />
                  Back to login
                </a>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

// Minimal forgot password
const MinimalForgotPassword = () => {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);

  return (
    <div class="flex min-h-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-sm">
        <Show when={!submitted()}>
          <div class="mb-10 flex justify-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
              <Key01Icon class="size-6 text-white dark:text-gray-900" />
            </div>
          </div>

          <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Reset your password
          </h1>
          <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive a reset link
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} class="mt-10 space-y-6">
            <TextInput
              id="minimal-email"
              type="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="hello@example.com"
            />

            <Button type="submit" color="dark" class="w-full">
              Send reset link
            </Button>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{' '}
            <a href="#" class="font-medium text-gray-900 hover:underline dark:text-white">
              Sign in
            </a>
          </p>
        </Show>

        <Show when={submitted()}>
          <div class="text-center">
            <div class="mb-8 flex justify-center">
              <div class="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg class="size-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Email sent</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Check <span class="font-medium text-gray-900 dark:text-white">{email()}</span> for the reset link
            </p>

            <div class="mt-10 space-y-4">
              <Button type="button" color="dark" class="w-full">
                Open email
              </Button>
              <button class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400" onClick={() => setSubmitted(false)}>
                Resend email
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

const modernCardCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, ArrowRightIcon, Key01Icon, Mail01Icon, Mail02Icon, ShieldTickIcon } from '@exowpee/solidly/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    // Send reset email...
    setTimeout(() => { setIsLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Show when={!submitted()}>
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                <Key01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
              <p class="mt-2 text-sm text-gray-500">We'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5">
              <TextInput
                id="email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Enter your email"
                icon={Mail01Icon}
              />

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Send reset link <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>
                  Sending...
                </Show>
              </Button>

              <a href="/login" class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ArrowLeftIcon class="size-4" /> Back to login
              </a>
            </form>
          </Show>

          <Show when={submitted()}>
            <div class="text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-500 shadow-lg">
                <Mail02Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold">Check your email</h1>
              <p class="mt-2 text-sm text-gray-500">Reset link sent to {email()}</p>

              <Button type="button" color="info" class="mt-8 w-full">Open email app</Button>
              <p class="mt-4 text-sm">
                Didn't receive? <button class="text-blue-600" onClick={() => setSubmitted(false)}>Resend</button>
              </p>
            </div>
          </Show>
        </div>

        <div class="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldTickIcon class="size-4" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}`;

const splitScreenCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, Lock01Icon, Mail02Icon } from '@exowpee/solidly/icons';

export default function SplitForgotPasswordPage() {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);

  return (
    <div class="flex min-h-screen">
      {/* Left - Feature showcase */}
      <div class="hidden w-1/2 bg-blue-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <Lock01Icon class="size-5 text-white" />
          </div>
          <span class="text-xl font-bold text-white">Solidly Pro</span>
        </div>

        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white">Reset your password in seconds</h2>
          <div class="space-y-4 text-blue-100">
            <div class="flex items-center gap-3">
              <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                <CheckIcon class="size-4 text-white" />
              </div>
              <span>Secure reset link</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
                <CheckIcon class="size-4 text-white" />
              </div>
              <span>Link expires in 24 hours</span>
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
          <Show when={!submitted()}>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h1>
            <p class="mt-2 text-gray-500">Enter your email and we'll send a reset link.</p>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} class="mt-8 space-y-6">
              <TextInput
                id="email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@company.com"
              />
              <Button type="submit" color="info" class="w-full">Send reset link</Button>
              <a href="/login" class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ArrowLeftIcon class="size-4" /> Back to login
              </a>
            </form>
          </Show>

          <Show when={submitted()}>
            <div class="text-center">
              <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
                <Mail02Icon class="size-8 text-green-600" />
              </div>
              <h1 class="text-2xl font-bold">Check your inbox</h1>
              <p class="mt-2 text-gray-500">Reset link sent to {email()}</p>
              <Button color="info" class="mt-8 w-full">Open email app</Button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}`;

const minimalCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { Key01Icon } from '@exowpee/solidly/icons';

export default function MinimalForgotPasswordPage() {
  const [email, setEmail] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);

  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div class="w-full max-w-sm">
        <Show when={!submitted()}>
          <div class="mb-10 flex justify-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
              <Key01Icon class="size-6 text-white dark:text-gray-900" />
            </div>
          </div>

          <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Reset your password
          </h1>
          <p class="mt-2 text-center text-sm text-gray-500">
            Enter your email to receive a reset link
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} class="mt-10 space-y-6">
            <TextInput
              id="email"
              type="email"
              label="Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="hello@example.com"
            />
            <Button type="submit" color="dark" class="w-full">Send reset link</Button>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <a href="/login" class="font-medium text-gray-900 dark:text-white">Sign in</a>
          </p>
        </Show>

        <Show when={submitted()}>
          <div class="text-center">
            <div class="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckIcon class="size-8 text-green-600" />
            </div>
            <h1 class="text-2xl font-semibold">Email sent</h1>
            <p class="mt-2 text-sm text-gray-500">Check {email()} for the reset link</p>
            <Button color="dark" class="mt-10 w-full">Open email</Button>
          </div>
        </Show>
      </div>
    </div>
  );
}`;

export default function ForgotPasswordBlockPage() {
  return (
    <BlocksDocPage
      title="Forgot Password"
      description="Professional password reset request forms with loading states and email sent confirmation. All variants use Solidly components (Button, TextInput) and are fully responsive with dark mode support."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'modern-card',
          title: 'Modern Card',
          description: 'Clean card layout with loading state and email confirmation.',
          component: ModernCardForgotPassword,
          code: modernCardCode,
        },
        {
          id: 'split-screen',
          title: 'Split Screen',
          description: 'Two-column layout with security features list.',
          component: SplitScreenForgotPassword,
          code: splitScreenCode,
        },
        {
          id: 'minimal',
          title: 'Minimal',
          description: 'Clean, focused design with centered layout.',
          component: MinimalForgotPassword,
          code: minimalCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
      ]}
      relatedBlocks={[
        { name: 'Login', path: '/blocks/authentication/login', description: 'User login forms' },
        { name: 'Reset Password', path: '/blocks/authentication/reset-password', description: 'Set new password' },
      ]}
    />
  );
}

// Export components for iframe preview
export { ModernCardForgotPassword, SplitScreenForgotPassword, MinimalForgotPassword };
