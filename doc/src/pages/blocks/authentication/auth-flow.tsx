import { createSignal, createMemo, For, Show, batch } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building07Icon,
  CheckIcon,
  Lock01Icon,
  Mail01Icon,
  ShieldTickIcon,
  User01Icon,
  Users01Icon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// Types
// ============================================================================

type AuthScreen =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'otp-verification'
  | 'reset-password'
  | 'org-select'
  | 'success';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  otp?: string;
  orgName?: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  memberCount: number;
}

// ============================================================================
// Validation Helpers
// ============================================================================

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return undefined;
};

const validateName = (name: string): string | undefined => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return undefined;
};

const validateOtp = (otp: string): string | undefined => {
  if (!otp) return 'Verification code is required';
  if (otp.length !== 6) return 'Code must be 6 digits';
  if (!/^\d+$/.test(otp)) return 'Code must contain only numbers';
  return undefined;
};

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Excellent', color: 'bg-emerald-500' };
};

// ============================================================================
// Complete Auth Flow Component
// ============================================================================

const CompleteAuthFlow = () => {
  // Navigation state
  const [screen, setScreen] = createSignal<AuthScreen>('login');
  const [previousScreen, setPreviousScreen] = createSignal<AuthScreen | null>(null);

  // Form data
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [name, setName] = createSignal('');
  const [rememberMe, setRememberMe] = createSignal(false);
  const [agreeTerms, setAgreeTerms] = createSignal(false);

  // UI state
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [isLoading, setIsLoading] = createSignal(false);
  const [selectedOrg, setSelectedOrg] = createSignal<Organization | null>(null);
  const [otpDigits, setOtpDigits] = createSignal(['', '', '', '', '', '']);

  // Mock organizations for multi-tenant flow
  const organizations: Organization[] = [
    { id: '1', name: 'Acme Corporation', slug: 'acme', role: 'Admin', memberCount: 45 },
    { id: '2', name: 'TechStartup Inc', slug: 'techstartup', role: 'Member', memberCount: 12 },
    { id: '3', name: 'Design Studio', slug: 'design-studio', role: 'Owner', memberCount: 8 },
  ];

  // Derived state
  const passwordStrength = createMemo(() => getPasswordStrength(password()));
  const otpValue = createMemo(() => otpDigits().join(''));

  // Navigation helpers
  const navigateTo = (newScreen: AuthScreen) => {
    setPreviousScreen(screen());
    setScreen(newScreen);
    setErrors({});
  };

  const goBack = () => {
    if (previousScreen()) {
      setScreen(previousScreen()!);
      setPreviousScreen(null);
    }
  };

  const resetForm = () => {
    batch(() => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setOtpDigits(['', '', '', '', '', '']);
      setErrors({});
      setRememberMe(false);
      setAgreeTerms(false);
      setSelectedOrg(null);
    });
  };

  // Form handlers (wrapped for void return type)
  const handleLogin = (e: Event) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email());
    const passwordError = validatePassword(password());

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Check if user has multiple organizations
      if (email().includes('@multi')) {
        navigateTo('org-select');
      } else {
        navigateTo('success');
      }
    }, 1500);
  };

  const handleSignup = (e: Event) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    const nameError = validateName(name());
    const emailError = validateEmail(email());
    const passwordError = validatePassword(password());

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (password() !== confirmPassword()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms()) {
      newErrors.name = 'You must agree to the terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Send verification email, go to OTP screen
      navigateTo('otp-verification');
    }, 1500);
  };

  const handleForgotPassword = (e: Event) => {
    e.preventDefault();
    const emailError = validateEmail(email());

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Email sent, go to OTP verification
      navigateTo('otp-verification');
    }, 1500);
  };

  const handleOtpVerify = (e: Event) => {
    e.preventDefault();
    const otpError = validateOtp(otpValue());

    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // If coming from forgot password, go to reset password
      // If coming from signup, go to success
      if (previousScreen() === 'forgot-password') {
        navigateTo('reset-password');
      } else {
        navigateTo('success');
      }
    }, 1500);
  };

  const handleResetPassword = (e: Event) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    const passwordError = validatePassword(password());
    if (passwordError) newErrors.password = passwordError;
    if (password() !== confirmPassword()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('success');
    }, 1500);
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('success');
    }, 1000);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...otpDigits()];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpDigits(['', '', '', '', '', '']);
    }, 1000);
  };

  const startOver = () => {
    resetForm();
    navigateTo('login');
  };

  // ============================================================================
  // Render Screens
  // ============================================================================

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-md">
        {/* Login Screen */}
        <Show when={screen() === 'login'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                <Lock01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Social Login */}
            <div class="mb-6 grid grid-cols-2 gap-3">
              <Button color="light" class="justify-center gap-2">
                <svg class="size-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button color="light" class="justify-center gap-2">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <div class="relative mb-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="bg-white px-3 text-gray-400 dark:bg-gray-800">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} class="space-y-5">
              <TextInput
                id="login-email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@company.com"
                icon={Mail01Icon}
                error={errors().email}
              />
              <TextInput
                id="login-password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter your password"
                icon={Lock01Icon}
                error={errors().password}
              />

              <div class="flex items-center justify-between">
                <Checkbox
                  id="remember"
                  label="Keep me signed in"
                  checked={rememberMe()}
                  onChange={(e) => setRememberMe(e.currentTarget.checked)}
                />
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot password?
                </button>
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
                <Show when={isLoading()}>Signing in...</Show>
              </Button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('signup')}
                class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Create free account
              </button>
            </p>

            <p class="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
              Tip: Use email with "@multi" to test organization selection
            </p>
          </div>
        </Show>

        {/* Signup Screen */}
        <Show when={screen() === 'signup'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={goBack}
              class="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon class="size-4" />
              Back to login
            </button>

            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-600 shadow-lg">
                <User01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start your 14-day free trial
              </p>
            </div>

            <form onSubmit={handleSignup} class="space-y-5">
              <TextInput
                id="signup-name"
                label="Full name"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                placeholder="John Doe"
                icon={User01Icon}
                error={errors().name}
              />
              <TextInput
                id="signup-email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@company.com"
                icon={Mail01Icon}
                error={errors().email}
              />
              <div>
                <TextInput
                  id="signup-password"
                  type="password"
                  label="Password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  placeholder="Min. 8 characters"
                  icon={Lock01Icon}
                  error={errors().password}
                />
                <Show when={password()}>
                  <div class="mt-2">
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class={`h-full transition-all ${passwordStrength().color}`}
                          style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                        />
                      </div>
                      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {passwordStrength().label}
                      </span>
                    </div>
                  </div>
                </Show>
              </div>
              <TextInput
                id="signup-confirm"
                type="password"
                label="Confirm password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Re-enter your password"
                icon={Lock01Icon}
                error={errors().confirmPassword}
              />

              <div class="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeTerms()}
                  onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
                />
                <label for="terms" class="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                color="success"
                class="w-full gap-2"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Create account <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>Creating account...</Show>
              </Button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in
              </button>
            </p>
          </div>
        </Show>

        {/* Forgot Password Screen */}
        <Show when={screen() === 'forgot-password'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={goBack}
              class="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon class="size-4" />
              Back to login
            </button>

            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-500 shadow-lg">
                <Mail01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleForgotPassword} class="space-y-5">
              <TextInput
                id="forgot-email"
                type="email"
                label="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Enter your email"
                icon={Mail01Icon}
                error={errors().email}
              />

              <Button
                type="submit"
                color="warning"
                class="w-full gap-2"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Send reset code <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>Sending...</Show>
              </Button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Back to login
              </button>
            </p>
          </div>
        </Show>

        {/* OTP Verification Screen */}
        <Show when={screen() === 'otp-verification'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={goBack}
              class="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon class="size-4" />
              Back
            </button>

            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
                <ShieldTickIcon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We sent a verification code to{' '}
                <span class="font-medium text-gray-900 dark:text-white">{email()}</span>
              </p>
            </div>

            <form onSubmit={handleOtpVerify} class="space-y-6">
              <div>
                <label class="mb-3 block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter 6-digit code
                </label>
                <div class="flex justify-center gap-2">
                  <For each={otpDigits()}>
                    {(digit, index) => (
                      <input
                        id={`otp-${index()}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onInput={(e) => handleOtpDigitChange(index(), e.currentTarget.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index(), e)}
                        class="size-12 rounded-lg border border-gray-300 bg-white text-center text-xl font-semibold text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    )}
                  </For>
                </div>
                <Show when={errors().otp}>
                  <p class="mt-2 text-center text-sm text-red-500">{errors().otp}</p>
                </Show>
              </div>

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading() || otpValue().length !== 6}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Verify code <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>Verifying...</Show>
              </Button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading()}
                class="font-semibold text-blue-600 hover:text-blue-500 disabled:opacity-50 dark:text-blue-400"
              >
                Resend
              </button>
            </p>
          </div>
        </Show>

        {/* Reset Password Screen */}
        <Show when={screen() === 'reset-password'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg">
                <Lock01Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Set new password</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your new password must be different from previous passwords
              </p>
            </div>

            <form onSubmit={handleResetPassword} class="space-y-5">
              <div>
                <TextInput
                  id="reset-password"
                  type="password"
                  label="New password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  placeholder="Enter new password"
                  icon={Lock01Icon}
                  error={errors().password}
                />
                <Show when={password()}>
                  <div class="mt-2">
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class={`h-full transition-all ${passwordStrength().color}`}
                          style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                        />
                      </div>
                      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {passwordStrength().label}
                      </span>
                    </div>
                  </div>
                </Show>
              </div>
              <TextInput
                id="reset-confirm"
                type="password"
                label="Confirm new password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Re-enter new password"
                icon={Lock01Icon}
                error={errors().confirmPassword}
              />

              <Button
                type="submit"
                color="info"
                class="w-full gap-2"
                disabled={isLoading()}
                isLoading={isLoading()}
              >
                <Show when={!isLoading()}>
                  Reset password <ArrowRightIcon class="size-4" />
                </Show>
                <Show when={isLoading()}>Resetting...</Show>
              </Button>
            </form>
          </div>
        </Show>

        {/* Organization Selection Screen */}
        <Show when={screen() === 'org-select'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-8 text-center">
              <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
                <Building07Icon class="size-7 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Select workspace</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Choose the organization you want to sign into
              </p>
            </div>

            <div class="space-y-3">
              <For each={organizations}>
                {(org) => (
                  <button
                    type="button"
                    onClick={() => handleOrgSelect(org)}
                    disabled={isLoading()}
                    class="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20"
                  >
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                      {org.name.charAt(0)}
                    </div>
                    <div class="flex-1 overflow-hidden">
                      <p class="truncate font-semibold text-gray-900 dark:text-white">{org.name}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {org.slug}.app · {org.role}
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
              onClick={() => navigateTo('login')}
              class="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Use a different account
            </button>
          </div>
        </Show>

        {/* Success Screen */}
        <Show when={screen() === 'success'}>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="text-center">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckIcon class="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Success!</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Show when={selectedOrg()} fallback="You're now signed in to your account.">
                  You're now signed in to {selectedOrg()?.name}.
                </Show>
              </p>

              <div class="mt-8 space-y-3">
                <Button color="info" class="w-full" onClick={startOver}>
                  Start over (Demo)
                </Button>
              </div>
            </div>
          </div>
        </Show>

        {/* Trust badges */}
        <Show when={screen() === 'login' || screen() === 'signup'}>
          <div class="mt-6 flex items-center justify-center gap-6">
            <div class="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldTickIcon class="size-4" />
              <span>256-bit SSL</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock01Icon class="size-4" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

// ============================================================================
// Code Snippet for Documentation
// ============================================================================

const authFlowCode = `import { createSignal, createMemo, For, Show, batch } from 'solid-js';
import { Button, Checkbox, TextInput } from '@exowpee/solidly';
import { Lock01Icon, Mail01Icon, User01Icon } from '@exowpee/solidly/icons';

type AuthScreen = 'login' | 'signup' | 'forgot-password' | 'otp-verification' | 'reset-password' | 'success';

// Validation helpers
const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Invalid email';
  return undefined;
};

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Min 8 characters';
  return undefined;
};

export default function AuthFlow() {
  const [screen, setScreen] = createSignal<AuthScreen>('login');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isLoading, setIsLoading] = createSignal(false);

  const navigateTo = (newScreen: AuthScreen) => {
    setScreen(newScreen);
    setErrors({});
  };

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(email());
    const passwordError = validatePassword(password());

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await loginApi({ email: email(), password: password() });
    setIsLoading(false);
    navigateTo('success');
  };

  return (
    <div class="max-w-md mx-auto p-8">
      <Show when={screen() === 'login'}>
        <form onSubmit={handleLogin} class="space-y-5">
          <TextInput
            label="Email"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            error={errors().email}
            icon={Mail01Icon}
          />
          <TextInput
            label="Password"
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            error={errors().password}
            icon={Lock01Icon}
          />

          <div class="flex justify-between items-center">
            <Checkbox label="Remember me" />
            <button type="button" onClick={() => navigateTo('forgot-password')}>
              Forgot password?
            </button>
          </div>

          <Button type="submit" isLoading={isLoading()} class="w-full">
            Sign in
          </Button>

          <p class="text-center">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigateTo('signup')}>
              Sign up
            </button>
          </p>
        </form>
      </Show>

      <Show when={screen() === 'signup'}>
        {/* Signup form with validation */}
      </Show>

      <Show when={screen() === 'forgot-password'}>
        {/* Forgot password form */}
      </Show>

      <Show when={screen() === 'otp-verification'}>
        {/* OTP input with auto-focus */}
      </Show>

      <Show when={screen() === 'reset-password'}>
        {/* Reset password with strength indicator */}
      </Show>
    </div>
  );
}`;

// ============================================================================
// Page Export
// ============================================================================

export default function AuthFlowPage() {
  return (
    <BlocksDocPage
      title="Auth Flow"
      description="Complete, production-ready authentication flow with form validation, screen navigation, OTP verification, password reset, and multi-tenant organization selection. All screens are interconnected and ready to use."
      category="Authentication"
      isPro
      variants={[
        {
          id: 'complete-flow',
          title: 'Complete Flow',
          description:
            'Full authentication flow including login, signup, forgot password, OTP verification, reset password, and organization selection. Try the flow by clicking through the screens.',
          component: CompleteAuthFlow,
          code: authFlowCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Checkbox', path: '/components/checkbox' },
      ]}
      relatedBlocks={[
        { name: 'Organization Auth', path: '/blocks/authentication/organization-auth', description: 'Multi-tenant workspace flows' },
        { name: 'Login', path: '/blocks/authentication/login', description: 'Standalone login variants' },
        { name: 'Signup', path: '/blocks/authentication/signup', description: 'Standalone signup variants' },
      ]}
    />
  );
}

// Export component for iframe preview
export { CompleteAuthFlow };
