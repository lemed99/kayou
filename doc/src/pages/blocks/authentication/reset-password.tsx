import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  Lock01Icon,
  ShieldTickIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// Modern card reset password
const ModernCardResetPassword = () => {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const getPasswordStrength = () => {
    const pwd = password();
    if (!pwd) return { level: 0, text: '', color: '' };
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 8) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (pwd.length < 12) return { level: 3, text: 'Good', color: 'bg-blue-500' };
    return { level: 4, text: 'Strong', color: 'bg-green-500' };
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (password() !== confirmPassword()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Show when={!success()}>
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg">
                <Lock01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Set new password</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your new password must be different from previous passwords.
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5">
              <div>
                <TextInput
                  id="password"
                  type="password"
                  label="New password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  placeholder="Enter new password"
                  icon={Lock01Icon}
                />
                <Show when={password()}>
                  <div class="mt-2">
                    <div class="flex gap-1">
                      <For each={[1, 2, 3, 4]}>
                        {(i) => (
                          <div class={`h-1 flex-1 rounded-full transition-colors ${i <= getPasswordStrength().level ? getPasswordStrength().color : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </For>
                    </div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password strength: <span class="font-medium">{getPasswordStrength().text}</span>
                    </p>
                  </div>
                </Show>
              </div>

              <TextInput
                id="confirm-password"
                type="password"
                label="Confirm password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Confirm your password"
                icon={Lock01Icon}
                color={confirmPassword() && password() !== confirmPassword() ? 'failure' : 'gray'}
              />
              <Show when={confirmPassword() && password() !== confirmPassword()}>
                <p class="text-xs text-red-500">Passwords do not match</p>
              </Show>

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading() || password() !== confirmPassword()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Reset password <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>
                  Resetting...
                </Show>
              </Button>

              <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeftIcon class="size-4" />
                Back to login
              </a>
            </form>
          </Show>

          <Show when={success()}>
            <div class="text-center">
              <div class="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <svg class="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Password reset!</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your password has been successfully reset.<br />
                You can now sign in with your new password.
              </p>

              <Button type="button" color="info" class="mt-8 w-full">
                Continue to login
              </Button>
            </div>
          </Show>
        </div>

        <div class="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldTickIcon class="size-4" />
          <span>Your password is encrypted end-to-end</span>
        </div>
      </div>
    </div>
  );
};

// Split screen reset password
const SplitScreenResetPassword = () => {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  const requirements = [
    { text: 'At least 8 characters', check: () => password().length >= 8 },
    { text: 'Contains uppercase letter', check: () => /[A-Z]/.test(password()) },
    { text: 'Contains lowercase letter', check: () => /[a-z]/.test(password()) },
    { text: 'Contains a number', check: () => /\d/.test(password()) },
  ];

  return (
    <div class="flex min-h-full">
      {/* Left side */}
      <div class="relative hidden w-1/2 overflow-hidden bg-violet-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
              <ShieldTickIcon class="size-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">Solidly Pro</span>
          </div>
        </div>

        <div class="relative z-10 space-y-6">
          <h2 class="text-3xl font-bold text-white">
            Create a strong,<br />secure password
          </h2>
          <p class="text-lg text-violet-100">
            A good password protects your account from unauthorized access.
          </p>

          <div class="rounded-xl bg-white/10 p-6">
            <h3 class="mb-4 font-semibold text-white">Password requirements</h3>
            <div class="space-y-3">
              <For each={requirements}>
                {(req) => (
                  <div class="flex items-center gap-3">
                    <div class={`flex size-5 items-center justify-center rounded-full transition-colors ${req.check() ? 'bg-green-400 text-white' : 'bg-white/20 text-white/50'}`}>
                      <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class={`text-sm transition-colors ${req.check() ? 'text-white' : 'text-violet-200'}`}>
                      {req.text}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="relative z-10 text-sm text-violet-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right side */}
      <div class="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <Show when={!success()}>
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create new password</h1>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                Enter a strong password for your account.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} class="space-y-6">
              <TextInput
                id="split-password"
                type="password"
                label="New password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter new password"
              />
              <TextInput
                id="split-confirm-password"
                type="password"
                label="Confirm password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Confirm your password"
              />

              {/* Mobile requirements */}
              <div class="rounded-lg border border-gray-200 p-4 lg:hidden dark:border-gray-700">
                <p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Password must have:</p>
                <div class="space-y-2">
                  <For each={requirements}>
                    {(req) => (
                      <div class="flex items-center gap-2 text-xs">
                        <div class={`size-4 rounded-full ${req.check() ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        <span class={req.check() ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>{req.text}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <Button type="submit" color="info" class="w-full" disabled={password() !== confirmPassword() || password().length < 8}>
                Reset password
              </Button>

              <a href="#" class="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeftIcon class="size-4" />
                Back to login
              </a>
            </form>
          </Show>

          <Show when={success()}>
            <div class="text-center">
              <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircleIcon class="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">All done!</h1>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                Your password has been reset successfully.
              </p>

              <Button type="button" color="info" class="mt-8 w-full">
                Sign in
              </Button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

// Minimal reset password
const MinimalResetPassword = () => {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  return (
    <div class="flex min-h-full flex-col items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-sm">
        <Show when={!success()}>
          <div class="mb-10 flex justify-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
              <Lock01Icon class="size-6 text-white dark:text-gray-900" />
            </div>
          </div>

          <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Create new password
          </h1>
          <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Must be at least 8 characters
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} class="mt-10 space-y-6">
            <TextInput
              id="minimal-password"
              type="password"
              label="New password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="••••••••"
            />
            <TextInput
              id="minimal-confirm"
              type="password"
              label="Confirm password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              placeholder="••••••••"
            />

            <Button type="submit" color="dark" class="w-full" disabled={password() !== confirmPassword()}>
              Reset password
            </Button>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <a href="#" class="font-medium text-gray-900 hover:underline dark:text-white">
              Back to login
            </a>
          </p>
        </Show>

        <Show when={success()}>
          <div class="text-center">
            <div class="mb-8 flex justify-center">
              <div class="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg class="size-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Password updated</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You can now sign in with your new password.
            </p>

            <Button type="button" color="dark" class="mt-10 w-full">
              Sign in
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
};

const modernCardCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, ArrowRightIcon, Lock01Icon, ShieldTickIcon } from '@exowpee/solidly/icons';

export default function ResetPasswordPage() {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const getPasswordStrength = () => {
    const pwd = password();
    if (!pwd) return { level: 0, text: '', color: '' };
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 8) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (pwd.length < 12) return { level: 3, text: 'Good', color: 'bg-blue-500' };
    return { level: 4, text: 'Strong', color: 'bg-green-500' };
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (password() !== confirmPassword()) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setSuccess(true); }, 1500);
  };

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Show when={!success()}>
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg">
                <Lock01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold">Set new password</h1>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5">
              <div>
                <TextInput
                  id="password"
                  type="password"
                  label="New password"
                  icon={Lock01Icon}
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                />
                <Show when={password()}>
                  <div class="mt-2 flex gap-1">
                    <For each={[1, 2, 3, 4]}>
                      {(i) => (
                        <div class={\`h-1 flex-1 rounded-full \${i <= getPasswordStrength().level ? getPasswordStrength().color : 'bg-gray-200'}\`} />
                      )}
                    </For>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Password strength: {getPasswordStrength().text}
                  </p>
                </Show>
              </div>

              <TextInput
                id="confirm-password"
                type="password"
                label="Confirm password"
                icon={Lock01Icon}
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                color={confirmPassword() && password() !== confirmPassword() ? 'failure' : 'gray'}
              />

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading() || password() !== confirmPassword()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Reset password <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>
                  Resetting...
                </Show>
              </Button>

              <a href="/login" class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ArrowLeftIcon class="size-4" /> Back to login
              </a>
            </form>
          </Show>

          <Show when={success()}>
            <div class="text-center">
              <div class="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <CheckIcon class="size-10 text-white" />
              </div>
              <h1 class="text-2xl font-bold">Password reset!</h1>
              <Button color="info" class="mt-8 w-full">Continue to login</Button>
            </div>
          </Show>
        </div>

        <div class="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldTickIcon class="size-4" />
          <span>Your password is encrypted end-to-end</span>
        </div>
      </div>
    </div>
  );
}`;

const splitScreenCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, ShieldTickIcon, CheckCircleIcon } from '@exowpee/solidly/icons';

export default function SplitResetPasswordPage() {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  const requirements = [
    { text: 'At least 8 characters', check: () => password().length >= 8 },
    { text: 'Contains uppercase letter', check: () => /[A-Z]/.test(password()) },
    { text: 'Contains lowercase letter', check: () => /[a-z]/.test(password()) },
    { text: 'Contains a number', check: () => /\\d/.test(password()) },
  ];

  return (
    <div class="flex min-h-screen">
      {/* Left - Requirements showcase */}
      <div class="hidden w-1/2 bg-violet-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <ShieldTickIcon class="size-5 text-white" />
          </div>
          <span class="text-xl font-bold text-white">Solidly Pro</span>
        </div>

        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white">Create a strong password</h2>
          <div class="rounded-xl bg-white/10 p-6">
            <h3 class="mb-4 font-semibold text-white">Requirements</h3>
            <For each={requirements}>{(req) => (
              <div class="flex items-center gap-3">
                <div class={\`flex size-5 items-center justify-center rounded-full \${req.check() ? 'bg-green-400' : 'bg-white/20'}\`}>
                  <CheckIcon class="size-3" />
                </div>
                <span class={\`text-sm \${req.check() ? 'text-white' : 'text-violet-200'}\`}>
                  {req.text}
                </span>
              </div>
            )}</For>
          </div>
        </div>

        <div class="text-sm text-violet-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right - Form */}
      <div class="flex w-full items-center justify-center px-6 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <Show when={!success()}>
            <h1 class="text-2xl font-bold">Create new password</h1>
            <p class="mt-2 text-gray-500">Enter a strong password for your account.</p>

            <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} class="mt-8 space-y-6">
              <TextInput
                id="password"
                type="password"
                label="New password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <TextInput
                id="confirm-password"
                type="password"
                label="Confirm password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              />
              <Button type="submit" color="info" class="w-full" disabled={password() !== confirmPassword()}>
                Reset password
              </Button>
            </form>
          </Show>

          <Show when={success()}>
            <div class="text-center">
              <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircleIcon class="size-8 text-green-600" />
              </div>
              <h1 class="text-2xl font-bold">All done!</h1>
              <Button color="info" class="mt-8 w-full">Sign in</Button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}`;

const minimalCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { Lock01Icon } from '@exowpee/solidly/icons';

export default function MinimalResetPasswordPage() {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div class="w-full max-w-sm">
        <Show when={!success()}>
          <div class="mb-10 flex justify-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
              <Lock01Icon class="size-6 text-white dark:text-gray-900" />
            </div>
          </div>

          <h1 class="text-center text-2xl font-semibold">Create new password</h1>
          <p class="mt-2 text-center text-sm text-gray-500">Must be at least 8 characters</p>

          <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} class="mt-10 space-y-6">
            <TextInput
              id="password"
              type="password"
              label="New password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <TextInput
              id="confirm"
              type="password"
              label="Confirm password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <Button type="submit" color="dark" class="w-full" disabled={password() !== confirmPassword()}>
              Reset password
            </Button>
          </form>
        </Show>

        <Show when={success()}>
          <div class="text-center">
            <div class="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckIcon class="size-8 text-green-600" />
            </div>
            <h1 class="text-2xl font-semibold">Password updated</h1>
            <Button color="dark" class="mt-10 w-full">Sign in</Button>
          </div>
        </Show>
      </div>
    </div>
  );
}`;

export default function ResetPasswordBlockPage() {
  return (
    <BlocksDocPage
      title="Reset Password"
      description="Professional password reset forms with password strength indicators and real-time validation. All variants use Solidly components (Button, TextInput) and are fully responsive with dark mode support."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'modern-card',
          title: 'Modern Card',
          description: 'Clean card layout with password strength meter and success animation.',
          component: ModernCardResetPassword,
          code: modernCardCode,
        },
        {
          id: 'split-screen',
          title: 'Split Screen',
          description: 'Two-column layout with real-time password requirements validation.',
          component: SplitScreenResetPassword,
          code: splitScreenCode,
        },
        {
          id: 'minimal',
          title: 'Minimal',
          description: 'Clean, focused design with centered layout.',
          component: MinimalResetPassword,
          code: minimalCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
      ]}
      relatedBlocks={[
        { name: 'Forgot Password', path: '/blocks/authentication/forgot-password', description: 'Request password reset' },
        { name: 'Login', path: '/blocks/authentication/login', description: 'User login forms' },
      ]}
    />
  );
}

// Export components for iframe preview
export { ModernCardResetPassword, SplitScreenResetPassword, MinimalResetPassword };
