import { createSignal, For, onCleanup, Show, type JSX } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  Mail02Icon,
  ShieldTickIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

// ============================================================================
// Variant 1: Card Layout
// ============================================================================
const OtpVerificationCard = (): JSX.Element => {
  const [otp, setOtp] = createSignal(['', '', '', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);
  const [countdown, setCountdown] = createSignal(60);
  const [canResend, setCanResend] = createSignal(false);

  let timer: ReturnType<typeof setInterval> | undefined;
  const startCountdown = (): void => {
    setCountdown(60);
    setCanResend(false);
    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  startCountdown();
  onCleanup(() => clearInterval(timer));

  const handleInput = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-card-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent): void => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-card-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent): void => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text').slice(0, 6) ?? '';
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp()];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const handleResend = (): void => {
    if (canResend()) {
      startCountdown();
    }
  };

  const isComplete = (): boolean => otp().every((digit) => digit !== '');

  return (
    <div class="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div class="w-full max-w-md">
        <Show
          when={!verified()}
          fallback={
            <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div class="text-center">
                <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircleIcon class="size-7 text-green-600 dark:text-green-400" />
                </div>
                <h1 class="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                  Verification Complete
                </h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your email has been verified successfully.
                </p>
                <div class="mt-6">
                  <Button color="info" class="w-full">
                    Continue to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          }
        >
          <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="text-center">
              <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Mail02Icon class="size-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 class="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                Check your email
              </h1>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We sent a verification code to
              </p>
              <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                john@example.com
              </p>
            </div>

            <form onSubmit={handleSubmit} class="mt-8 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter 6-digit code
                </label>
                <div class="flex justify-between gap-2">
                  <For each={otp()}>
                    {(digit, index) => (
                      <TextInput
                        id={`otp-card-${index()}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onInput={(e) => handleInput(index(), e.currentTarget.value)}
                        onKeyDown={(e) => handleKeyDown(index(), e)}
                        onPaste={handlePaste}
                        inputClass="!w-12 !px-0 text-center text-lg font-semibold"
                      />
                    )}
                  </For>
                </div>
              </div>

              <Button
                type="submit"
                color="info"
                class="w-full"
                disabled={!isComplete() || verifying()}
                isLoading={verifying()}
              >
                {verifying() ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the code?{' '}
                  <Show
                    when={canResend()}
                    fallback={
                      <span class="font-medium text-gray-500">Resend in {countdown()}s</span>
                    }
                  >
                    <button
                      type="button"
                      onClick={handleResend}
                      class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Click to resend
                    </button>
                  </Show>
                </p>
              </div>

              <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button color="gray" class="w-full" onClick={() => window.history.back()}>
                  <span class="flex items-center gap-2">
                    <ArrowLeftIcon class="size-4" />
                    Back to login
                  </span>
                </Button>
              </div>
            </form>
          </div>

          <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <ShieldTickIcon class="size-4" />
            <span>Secure 256-bit SSL encryption</span>
          </div>
        </Show>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 2: Split Screen
// ============================================================================
const OtpVerificationSplit = (): JSX.Element => {
  const [otp, setOtp] = createSignal(['', '', '', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);

  const handleInput = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-split-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent): void => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-split-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent): void => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text').slice(0, 6) ?? '';
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp()];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const isComplete = (): boolean => otp().every((digit) => digit !== '');

  return (
    <div class="flex min-h-full">
      {/* Left panel - Info */}
      <div class="hidden w-1/2 bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-center">
        <div class="mx-auto max-w-md text-white">
          <ShieldTickIcon class="size-12" />
          <h2 class="mt-6 text-3xl font-bold">Secure Verification</h2>
          <p class="mt-4 text-lg text-blue-100">
            We've sent a one-time verification code to your email. This extra step helps protect
            your account from unauthorized access.
          </p>

          <div class="mt-10 space-y-4">
            <div class="flex items-center gap-3">
              <CheckCircleIcon class="size-5 text-blue-200" />
              <span class="text-blue-100">Code expires in 10 minutes</span>
            </div>
            <div class="flex items-center gap-3">
              <CheckCircleIcon class="size-5 text-blue-200" />
              <span class="text-blue-100">Check spam folder if not received</span>
            </div>
            <div class="flex items-center gap-3">
              <CheckCircleIcon class="size-5 text-blue-200" />
              <span class="text-blue-100">Enable 2FA for extra security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div class="flex flex-1 items-center justify-center bg-white p-8 dark:bg-gray-900">
        <div class="w-full max-w-md">
          <Show
            when={!verified()}
            fallback={
              <div class="text-center">
                <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircleIcon class="size-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Email Verified!
                </h1>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  Your email has been verified successfully.
                </p>
                <div class="mt-8">
                  <Button color="info" class="w-full">
                    Continue to Dashboard
                  </Button>
                </div>
              </div>
            }
          >
            <div class="mb-6 lg:hidden">
              <div class="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Mail02Icon class="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Enter verification code
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              We sent a 6-digit code to{' '}
              <span class="font-medium text-gray-900 dark:text-white">john@example.com</span>
            </p>

            <form onSubmit={handleSubmit} class="mt-8 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification code
                </label>
                <div class="flex gap-2">
                  <For each={otp()}>
                    {(digit, index) => (
                      <TextInput
                        id={`otp-split-${index()}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onInput={(e) => handleInput(index(), e.currentTarget.value)}
                        onKeyDown={(e) => handleKeyDown(index(), e)}
                        onPaste={handlePaste}
                        inputClass="!w-12 !px-0 text-center text-lg font-semibold"
                      />
                    )}
                  </For>
                </div>
              </div>

              <Button
                type="submit"
                color="info"
                class="w-full"
                disabled={!isComplete() || verifying()}
                isLoading={verifying()}
              >
                {verifying() ? 'Verifying...' : 'Verify Code'}
              </Button>

              <div class="flex items-center justify-between text-sm">
                <p class="text-gray-600 dark:text-gray-400">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Resend
                  </button>
                </p>
                <button
                  type="button"
                  class="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Change email
                </button>
              </div>

              <Button color="gray" class="w-full" onClick={() => window.history.back()}>
                <span class="flex items-center gap-2">
                  <ArrowLeftIcon class="size-4" />
                  Back to login
                </span>
              </Button>
            </form>
          </Show>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 3: Minimal
// ============================================================================
const OtpVerificationMinimal = (): JSX.Element => {
  const [otp, setOtp] = createSignal(['', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleInput = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;
    setError('');
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-minimal-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent): void => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-minimal-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent): void => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text').slice(0, 4) ?? '';
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp()];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const code = otp().join('');
    if (code.length < 4) {
      setError('Please enter all digits');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const isComplete = (): boolean => otp().every((digit) => digit !== '');

  return (
    <div class="flex min-h-full items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
      <div class="w-full max-w-sm">
        <Show
          when={!verified()}
          fallback={
            <div class="text-center">
              <CheckCircleIcon class="mx-auto size-12 text-green-500" />
              <h1 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Verified successfully
              </h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You're all set! Redirecting you now...
              </p>
            </div>
          }
        >
          <div class="text-center">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Enter code</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              We sent a code to{' '}
              <span class="text-gray-900 dark:text-white">j***@example.com</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} class="mt-8">
            <div class="flex justify-center gap-3">
              <For each={otp()}>
                {(digit, index) => (
                  <TextInput
                    id={`otp-minimal-${index()}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onInput={(e) => handleInput(index(), e.currentTarget.value)}
                    onKeyDown={(e) => handleKeyDown(index(), e)}
                    onPaste={handlePaste}
                    color={error() ? 'failure' : 'gray'}
                    inputClass="!w-14 !h-14 !px-0 text-center text-2xl font-bold"
                  />
                )}
              </For>
            </div>

            <Show when={error()}>
              <p class="mt-2 text-center text-sm text-red-600 dark:text-red-400">{error()}</p>
            </Show>

            <div class="mt-6">
              <Button
                type="submit"
                color="dark"
                class="w-full"
                disabled={!isComplete() || verifying()}
                isLoading={verifying()}
              >
                {verifying() ? 'Verifying' : 'Continue'}
              </Button>
            </div>

            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Didn't get a code?{' '}
              <button
                type="button"
                class="font-medium text-gray-900 hover:underline dark:text-white"
              >
                Resend
              </button>
            </p>
          </form>
        </Show>
      </div>
    </div>
  );
};

// ============================================================================
// Code string for documentation
// ============================================================================
const cardCode = `import { createSignal, For, onCleanup, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, CheckCircleIcon, Mail02Icon, ShieldTickIcon } from '@exowpee/solidly/icons';

export default function OtpVerification() {
  const [otp, setOtp] = createSignal(['', '', '', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);
  const [countdown, setCountdown] = createSignal(60);
  const [canResend, setCanResend] = createSignal(false);

  let timer;
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  startCountdown();
  onCleanup(() => clearInterval(timer));

  const handleInput = (index, value) => {
    if (!/^\\d*$/.test(value)) return;
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(\`otp-\${index + 1}\`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      document.getElementById(\`otp-\${index - 1}\`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1500);
  };

  const isComplete = () => otp().every((d) => d !== '');

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div class="w-full max-w-md">
        <Show when={!verified()} fallback={/* Success state */}>
          <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div class="text-center">
              <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-100">
                <Mail02Icon class="size-7 text-blue-600" />
              </div>
              <h1 class="mt-5 text-xl font-semibold">Check your email</h1>
              <p class="mt-2 text-sm text-gray-600">We sent a verification code to</p>
              <p class="mt-1 text-sm font-medium">john@example.com</p>
            </div>

            <form onSubmit={handleSubmit} class="mt-8 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Enter 6-digit code</label>
                <div class="flex justify-between gap-2">
                  <For each={otp()}>
                    {(digit, index) => (
                      <TextInput
                        id={\`otp-\${index()}\`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onInput={(e) => handleInput(index(), e.currentTarget.value)}
                        onKeyDown={(e) => handleKeyDown(index(), e)}
                        inputClass="!w-12 !px-0 text-center text-lg font-semibold"
                      />
                    )}
                  </For>
                </div>
              </div>

              <Button type="submit" color="info" class="w-full" disabled={!isComplete()} isLoading={verifying()}>
                {verifying() ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div class="text-center text-sm text-gray-600">
                Didn't receive the code?{' '}
                <Show when={canResend()} fallback={<span>Resend in {countdown()}s</span>}>
                  <button type="button" onClick={startCountdown} class="font-medium text-blue-600">
                    Click to resend
                  </button>
                </Show>
              </div>
            </form>
          </div>
        </Show>
      </div>
    </div>
  );
}`;

const splitCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { ArrowLeftIcon, CheckCircleIcon, Mail02Icon, ShieldTickIcon } from '@exowpee/solidly/icons';

export default function OtpVerificationSplit() {
  const [otp, setOtp] = createSignal(['', '', '', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);

  const handleInput = (index, value) => {
    if (!/^\\d*$/.test(value)) return;
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(\`otp-\${index + 1}\`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      document.getElementById(\`otp-\${index - 1}\`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1500);
  };

  return (
    <div class="flex min-h-screen">
      {/* Left panel */}
      <div class="hidden w-1/2 bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-center">
        <div class="mx-auto max-w-md text-white">
          <ShieldTickIcon class="size-12" />
          <h2 class="mt-6 text-3xl font-bold">Secure Verification</h2>
          <p class="mt-4 text-lg text-blue-100">
            We've sent a one-time verification code to your email.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div class="flex flex-1 items-center justify-center bg-white p-8">
        <div class="w-full max-w-md">
          <h1 class="text-2xl font-bold">Enter verification code</h1>
          <p class="mt-2 text-gray-600">
            We sent a 6-digit code to <span class="font-medium">john@example.com</span>
          </p>

          <form onSubmit={handleSubmit} class="mt-8 space-y-6">
            <div class="flex gap-2">
              <For each={otp()}>
                {(digit, index) => (
                  <TextInput
                    id={\`otp-\${index()}\`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onInput={(e) => handleInput(index(), e.currentTarget.value)}
                    onKeyDown={(e) => handleKeyDown(index(), e)}
                    inputClass="!w-12 !px-0 text-center text-lg font-semibold"
                  />
                )}
              </For>
            </div>

            <Button type="submit" color="info" class="w-full" isLoading={verifying()}>
              {verifying() ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Button color="gray" class="w-full">
              <span class="flex items-center gap-2">
                <ArrowLeftIcon class="size-4" />
                Back to login
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}`;

const minimalCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput } from '@exowpee/solidly';
import { CheckCircleIcon } from '@exowpee/solidly/icons';

export default function OtpVerificationMinimal() {
  const [otp, setOtp] = createSignal(['', '', '', '']);
  const [verified, setVerified] = createSignal(false);
  const [verifying, setVerifying] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleInput = (index, value) => {
    if (!/^\\d*$/.test(value)) return;
    setError('');
    const newOtp = [...otp()];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) document.getElementById(\`otp-\${index + 1}\`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      document.getElementById(\`otp-\${index - 1}\`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp().join('').length < 4) { setError('Please enter all digits'); return; }
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1500);
  };

  const isComplete = () => otp().every((d) => d !== '');

  return (
    <div class="flex min-h-screen items-center justify-center bg-white px-4">
      <div class="w-full max-w-sm">
        <Show when={!verified()} fallback={
          <div class="text-center">
            <CheckCircleIcon class="mx-auto size-12 text-green-500" />
            <h1 class="mt-4 text-lg font-semibold">Verified successfully</h1>
          </div>
        }>
          <div class="text-center">
            <h1 class="text-lg font-semibold">Enter code</h1>
            <p class="mt-1 text-sm text-gray-500">We sent a code to j***@example.com</p>
          </div>

          <form onSubmit={handleSubmit} class="mt-8">
            <div class="flex justify-center gap-3">
              <For each={otp()}>
                {(digit, index) => (
                  <TextInput
                    id={\`otp-\${index()}\`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onInput={(e) => handleInput(index(), e.currentTarget.value)}
                    onKeyDown={(e) => handleKeyDown(index(), e)}
                    color={error() ? 'failure' : 'gray'}
                    inputClass="!w-14 !h-14 !px-0 text-center text-2xl font-bold"
                  />
                )}
              </For>
            </div>

            <Show when={error()}>
              <p class="mt-2 text-center text-sm text-red-600">{error()}</p>
            </Show>

            <Button type="submit" color="dark" class="mt-6 w-full" disabled={!isComplete()} isLoading={verifying()}>
              {verifying() ? 'Verifying' : 'Continue'}
            </Button>

            <p class="mt-6 text-center text-sm text-gray-500">
              Didn't get a code? <button type="button" class="font-medium text-gray-900">Resend</button>
            </p>
          </form>
        </Show>
      </div>
    </div>
  );
}`;

// ============================================================================
// Export Page
// ============================================================================
export default function OtpVerificationBlockPage(): JSX.Element {
  return (
    <BlocksDocPage
      title="OTP Verification"
      description="One-time password verification forms with auto-focus between inputs, countdown timers, and success states."
      category="Authentication"
      variants={[
        {
          id: 'card',
          title: 'Card Layout',
          description: 'Centered card with countdown timer and resend functionality.',
          component: OtpVerificationCard,
          code: cardCode,
        },
        {
          id: 'split',
          title: 'Split Screen',
          description: 'Split layout with information panel on the left side.',
          component: OtpVerificationSplit,
          code: splitCode,
        },
        {
          id: 'minimal',
          title: 'Minimal',
          description: 'Clean 4-digit verification with minimal styling.',
          component: OtpVerificationMinimal,
          code: minimalCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
      ]}
      relatedBlocks={[
        { name: 'Signup', path: '/blocks/authentication/signup', description: 'User registration' },
        { name: 'Login', path: '/blocks/authentication/login', description: 'User login' },
        {
          name: 'Reset Password',
          path: '/blocks/authentication/reset-password',
          description: 'Password reset',
        },
      ]}
    />
  );
}

// Export components for iframe preview
export { OtpVerificationCard, OtpVerificationSplit, OtpVerificationMinimal };
