import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building01Icon,
  CheckCircleIcon,
  Lock01Icon,
  Mail01Icon,
  ShieldTickIcon,
  Star01Icon,
  User01Icon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// Modern card signup
const ModernCardSignup = () => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
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
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        {/* Card */}
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg">
              <User01Icon class="size-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start your 14-day free trial. No credit card required.
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
              <span class="bg-white px-3 text-gray-400 dark:bg-gray-800 dark:text-gray-500">or sign up with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-5">
            <TextInput
              id="name"
              type="text"
              label="Full name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="John Doe"
              icon={User01Icon}
            />
            <TextInput
              id="email"
              type="email"
              label="Email address"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@company.com"
              icon={Mail01Icon}
            />
            <div>
              <TextInput
                id="password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Create a strong password"
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

            <Checkbox
              id="terms"
              label={
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms</a>
                  {' '}and{' '}
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
                </span>
              }
            />

            <Button
              type="submit"
              color="info"
              class="w-full"
              disabled={isLoading()}
              isLoading={isLoading()}
            >
              <Show when={!isLoading()}>
                <span class="flex items-center gap-2">
                  Create account <ArrowRightIcon class="size-4" />
                </span>
              </Show>
              <Show when={isLoading()}>
                Creating account...
              </Show>
            </Button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
          </p>
        </div>

        {/* Trust badges */}
        <div class="mt-6 flex items-center justify-center gap-6">
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldTickIcon class="size-4" />
            <span>SSL Secured</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <Star01Icon class="size-4" />
            <span>50k+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Split screen signup
const PremiumSplitSignup = () => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const benefits = [
    { icon: '🚀', title: 'Ship faster', description: 'Build products in half the time' },
    { icon: '🎨', title: 'Beautiful UI', description: '100+ premium components' },
    { icon: '🔒', title: 'Enterprise security', description: 'SOC 2 compliant' },
  ];

  return (
    <div class="flex min-h-full">
      {/* Left side - Features */}
      <div class="relative hidden w-1/2 overflow-hidden bg-indigo-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
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
            <h2 class="text-4xl font-bold text-white">
              Join 50,000+<br />developers today
            </h2>
            <p class="mt-4 text-lg text-indigo-100">
              The fastest way to build modern web applications
            </p>
          </div>

          {/* Benefits */}
          <div class="space-y-4">
            <For each={benefits}>
              {(benefit) => (
                <div class="flex items-start gap-4 rounded-xl bg-white/10 p-4">
                  <span class="text-2xl">{benefit.icon}</span>
                  <div>
                    <p class="font-semibold text-white">{benefit.title}</p>
                    <p class="text-sm text-indigo-200">{benefit.description}</p>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Social proof */}
          <div class="flex items-center gap-4">
            <div class="flex -space-x-2">
              <For each={[1, 2, 3, 4, 5]}>
                {() => (
                  <div class="size-8 rounded-full border-2 border-indigo-600 bg-indigo-400" />
                )}
              </For>
            </div>
            <div class="text-sm text-indigo-200">
              <span class="font-semibold text-white">4.9/5</span> from 2,000+ reviews
            </div>
          </div>
        </div>

        <div class="relative z-10 text-sm text-indigo-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div class="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Get started with your 14-day free trial
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
                Sign up with Google
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
              id="split-name"
              type="text"
              label="Full name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="John Doe"
            />
            <TextInput
              id="split-email"
              type="email"
              label="Work email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="john@company.com"
            />
            <TextInput
              id="split-password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="8+ characters"
            />

            <Checkbox
              id="split-terms"
              label="I agree to the Terms of Service and Privacy Policy"
            />

            <Button type="submit" color="info" class="w-full">
              Create free account
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Multi-step wizard signup
const MultiStepSignup = () => {
  const [step, setStep] = createSignal(1);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [name, setName] = createSignal('');
  const [company, setCompany] = createSignal('');
  const [role, setRole] = createSignal('');

  const steps = [
    { number: 1, title: 'Account', icon: Mail01Icon },
    { number: 2, title: 'Profile', icon: User01Icon },
    { number: 3, title: 'Complete', icon: CheckCircleIcon },
  ];

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-lg space-y-8">
        {/* Progress steps */}
        <div class="flex items-center justify-between">
          <For each={steps}>
            {(s, i) => (
              <>
                <div class="flex flex-col items-center">
                  <div
                    class={`flex size-12 items-center justify-center rounded-full text-sm font-medium transition-all ${
                      step() > s.number
                        ? 'bg-green-500 text-white'
                        : step() === s.number
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Show when={step() > s.number} fallback={<Dynamic component={s.icon} class="size-5" />}>
                      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </Show>
                  </div>
                  <span class={`mt-2 text-xs font-medium ${step() >= s.number ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
                <Show when={i() < steps.length - 1}>
                  <div class={`flex-1 h-0.5 mx-2 rounded ${step() > s.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </Show>
              </>
            )}
          </For>
        </div>

        {/* Form card */}
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Show when={step() === 1}>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Create your account</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and create a secure password
                </p>
              </div>

              <div class="space-y-4">
                <TextInput
                  id="step-email"
                  type="email"
                  label="Email address"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  placeholder="you@example.com"
                  icon={Mail01Icon}
                />
                <TextInput
                  id="step-password"
                  type="password"
                  label="Password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  placeholder="Create a strong password"
                  icon={Lock01Icon}
                />
              </div>

              <Button type="button" color="info" class="w-full" onClick={() => setStep(2)}>
                <span class="flex items-center gap-2">
                  Continue <ArrowRightIcon class="size-4" />
                </span>
              </Button>
            </div>
          </Show>

          <Show when={step() === 2}>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Tell us about yourself</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This helps us personalize your experience
                </p>
              </div>

              <div class="space-y-4">
                <TextInput
                  id="step-name"
                  type="text"
                  label="Full name"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  placeholder="John Doe"
                  icon={User01Icon}
                />
                <TextInput
                  id="step-company"
                  type="text"
                  label="Company (optional)"
                  value={company()}
                  onInput={(e) => setCompany(e.currentTarget.value)}
                  placeholder="Acme Inc"
                  icon={Building01Icon}
                />
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    What's your role?
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <For each={['Developer', 'Designer', 'Manager', 'Founder']}>
                      {(r) => (
                        <Button
                          type="button"
                          color={role() === r ? 'info' : 'light'}
                          onClick={() => setRole(r)}
                        >
                          {r}
                        </Button>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <Button type="button" color="light" class="flex-1" onClick={() => setStep(1)}>
                  <span class="flex items-center gap-2">
                    <ArrowLeftIcon class="size-4" /> Back
                  </span>
                </Button>
                <Button type="button" color="info" class="flex-1" onClick={() => setStep(3)}>
                  <span class="flex items-center gap-2">
                    Continue <ArrowRightIcon class="size-4" />
                  </span>
                </Button>
              </div>
            </div>
          </Show>

          <Show when={step() === 3}>
            <div class="space-y-6 text-center">
              <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <svg class="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">You're all set, {name() || 'there'}!</h2>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your account has been created successfully.<br />
                  Check your email to verify your account.
                </p>
              </div>

              <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  A verification link has been sent to<br />
                  <span class="font-semibold text-gray-900 dark:text-white">{email()}</span>
                </p>
              </div>

              <Button type="button" color="info" class="w-full">
                Go to Dashboard
              </Button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

const modernCardCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { ArrowRightIcon, Lock01Icon, Mail01Icon, User01Icon, ShieldTickIcon, Star01Icon } from '@exowpee/solidly/icons';

export default function SignupPage() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
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
    setIsLoading(true);
    // Handle signup...
  };

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg">
              <User01Icon class="size-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p class="mt-2 text-sm text-gray-500">Start your 14-day free trial.</p>
          </div>

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
              id="name"
              label="Full name"
              icon={User01Icon}
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="John Doe"
            />
            <TextInput
              id="email"
              type="email"
              label="Email address"
              icon={Mail01Icon}
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@company.com"
            />
            <div>
              <TextInput
                id="password"
                type="password"
                label="Password"
                icon={Lock01Icon}
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Create a strong password"
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

            <Checkbox
              id="terms"
              label="I agree to the Terms and Privacy Policy"
            />

            <Button
              type="submit"
              color="info"
              class="w-full gap-2"
              disabled={isLoading()}
              isLoading={isLoading()}
            >
              <Show when={!isLoading()}>
                Create account <ArrowRightIcon class="size-4" />
              </Show>
              <Show when={isLoading()}>
                Creating account...
              </Show>
            </Button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" class="font-semibold text-blue-600">Sign in</a>
          </p>
        </div>

        <div class="mt-6 flex items-center justify-center gap-6">
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldTickIcon class="size-4" />
            <span>SSL Secured</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <Star01Icon class="size-4" />
            <span>50k+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const splitScreenCode = `import { createSignal, For } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';

export default function SplitSignupPage() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const benefits = [
    { icon: '🚀', title: 'Ship faster', description: 'Build in half the time' },
    { icon: '🎨', title: 'Beautiful UI', description: '100+ components' },
    { icon: '🔒', title: 'Enterprise security', description: 'SOC 2 compliant' },
  ];

  return (
    <div class="flex min-h-screen">
      {/* Left - Feature showcase */}
      <div class="hidden w-1/2 bg-indigo-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <LogoIcon class="size-6 text-white" />
          </div>
          <span class="text-xl font-bold text-white">Solidly Pro</span>
        </div>

        <div class="space-y-8">
          <h2 class="text-4xl font-bold text-white">Join 50,000+ developers</h2>
          <p class="text-lg text-indigo-100">
            The fastest way to build modern web applications
          </p>
          <div class="space-y-4">
            <For each={benefits}>{(b) => (
              <div class="flex gap-4 rounded-xl bg-white/10 p-4">
                <span class="text-2xl">{b.icon}</span>
                <div>
                  <p class="font-semibold text-white">{b.title}</p>
                  <p class="text-sm text-indigo-200">{b.description}</p>
                </div>
              </div>
            )}</For>
          </div>
        </div>

        <div class="text-sm text-indigo-200">
          &copy; 2024 Solidly. All rights reserved.
        </div>
      </div>

      {/* Right - Form */}
      <div class="flex w-full items-center justify-center px-6 lg:w-1/2 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p class="mt-2 text-gray-500">Get started with your 14-day free trial</p>

          <div class="mt-8 space-y-3">
            <Button color="light" class="w-full justify-center gap-3">
              <GoogleIcon class="size-5" />
              Sign up with Google
            </Button>
          </div>

          <form class="mt-6 space-y-5">
            <TextInput
              id="name"
              label="Full name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="John Doe"
            />
            <TextInput
              id="email"
              type="email"
              label="Work email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="john@company.com"
            />
            <TextInput
              id="password"
              type="password"
              label="Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="8+ characters"
            />

            <Checkbox id="terms" label="I agree to the Terms of Service" />

            <Button type="submit" color="info" class="w-full">
              Create free account
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" class="font-semibold text-blue-600">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const multiStepCode = `import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, ArrowRightIcon, Mail01Icon, User01Icon, Building01Icon, CheckCircleIcon, Lock01Icon } from '@exowpee/solidly/icons';

export default function MultiStepSignupPage() {
  const [step, setStep] = createSignal(1);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [name, setName] = createSignal('');
  const [role, setRole] = createSignal('');

  const steps = [
    { number: 1, title: 'Account', icon: Mail01Icon },
    { number: 2, title: 'Profile', icon: User01Icon },
    { number: 3, title: 'Complete', icon: CheckCircleIcon },
  ];

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="w-full max-w-lg space-y-8">
        {/* Progress */}
        <div class="flex items-center justify-between">
          <For each={steps}>{(s, i) => (
            <>
              <div class="flex flex-col items-center">
                <div class={\`flex size-12 items-center justify-center rounded-full \${
                  step() > s.number ? 'bg-green-500 text-white' :
                  step() === s.number ? 'bg-blue-600 text-white shadow-lg' :
                  'bg-gray-200 text-gray-500'
                }\`}>
                  <Show when={step() > s.number} fallback={<Dynamic component={s.icon} class="size-5" />}>
                    <CheckIcon class="size-5" />
                  </Show>
                </div>
                <span class="mt-2 text-xs">{s.title}</span>
              </div>
              <Show when={i() < steps.length - 1}>
                <div class={\`flex-1 h-0.5 mx-2 \${step() > s.number ? 'bg-green-500' : 'bg-gray-200'}\`} />
              </Show>
            </>
          )}</For>
        </div>

        {/* Form card */}
        <div class="rounded-2xl border bg-white p-8 shadow-xl dark:bg-gray-800">
          <Show when={step() === 1}>
            <h2 class="text-xl font-bold">Create your account</h2>
            <div class="mt-6 space-y-4">
              <TextInput
                id="email"
                type="email"
                label="Email address"
                icon={Mail01Icon}
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
              <TextInput
                id="password"
                type="password"
                label="Password"
                icon={Lock01Icon}
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <Button color="info" class="mt-6 w-full gap-2" onClick={() => setStep(2)}>
              Continue <ArrowRightIcon class="size-4" />
            </Button>
          </Show>

          <Show when={step() === 2}>
            <h2 class="text-xl font-bold">Tell us about yourself</h2>
            <div class="mt-6 space-y-4">
              <TextInput
                id="name"
                label="Full name"
                icon={User01Icon}
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
              />
              <div class="grid grid-cols-2 gap-3">
                <For each={['Developer', 'Designer', 'Manager', 'Founder']}>
                  {(r) => (
                    <Button
                      color={role() === r ? 'info' : 'light'}
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </Button>
                  )}
                </For>
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <Button color="light" class="flex-1 gap-2" onClick={() => setStep(1)}>
                <ArrowLeftIcon class="size-4" /> Back
              </Button>
              <Button color="info" class="flex-1 gap-2" onClick={() => setStep(3)}>
                Continue <ArrowRightIcon class="size-4" />
              </Button>
            </div>
          </Show>

          <Show when={step() === 3}>
            <div class="text-center">
              <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-green-500">
                <CheckIcon class="size-10 text-white" />
              </div>
              <h2 class="mt-4 text-xl font-bold">You're all set!</h2>
              <p class="mt-2 text-gray-500">Check your email to verify.</p>
              <Button color="info" class="mt-8 w-full">Go to Dashboard</Button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}`;

export default function SignupBlockPage() {
  return (
    <BlocksDocPage
      title="Signup"
      description="Professional user registration forms with social authentication, password strength indicators, and multi-step wizards. All variants use Solidly components (Button, TextInput, Checkbox) and are fully responsive with dark mode support."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'modern-card',
          title: 'Modern Card',
          description: 'Clean card layout with password strength meter and social auth.',
          component: ModernCardSignup,
          code: modernCardCode,
        },
        {
          id: 'premium-split',
          title: 'Split Screen',
          description: 'Two-column layout with benefits showcase and social proof.',
          component: PremiumSplitSignup,
          code: splitScreenCode,
        },
        {
          id: 'multi-step',
          title: 'Multi-Step Wizard',
          description: 'Step-by-step registration with visual progress and role selection.',
          component: MultiStepSignup,
          code: multiStepCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Checkbox', path: '/components/checkbox' },
      ]}
      relatedBlocks={[
        { name: 'Login', path: '/blocks/authentication/login', description: 'User login forms' },
        { name: 'OTP Verification', path: '/blocks/authentication/otp-verification', description: 'Email verification' },
      ]}
    />
  );
}

// Export components for iframe preview
export { ModernCardSignup, PremiumSplitSignup, MultiStepSignup };
