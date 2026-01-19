import { For } from 'solid-js';

const plans = [
  {
    name: 'Open Source',
    price: 'Free',
    description: 'Perfect for personal projects and learning',
    features: [
      'All components included',
      'MIT License',
      'Community support',
      'GitHub issues',
      'Full source code access',
    ],
    cta: 'Get Started',
    ctaHref: '/components/button',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'one-time',
    description: 'For professional developers and teams',
    features: [
      'Everything in Open Source',
      'Premium components',
      'Priority support',
      'Figma design files',
      'Advanced examples',
      'Commercial license',
    ],
    cta: 'Coming Soon',
    ctaHref: '#',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams and organizations',
    features: [
      'Everything in Pro',
      'Custom components',
      'Dedicated support',
      'SLA guarantee',
      'Training sessions',
      'Custom integrations',
    ],
    cta: 'Contact Us',
    ctaHref: 'mailto:contact@therock.dev',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        {/* Header */}
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl dark:text-white">
            Simple, transparent pricing
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Start for free with our open source components. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div class="mt-16 grid gap-8 lg:grid-cols-3">
          <For each={plans}>
            {(plan) => (
              <div
                class={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-950/20 dark:ring-blue-400'
                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                {plan.highlighted && (
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span class="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div class="text-center">
                  <h2 class="text-xl font-semibold text-gray-950 dark:text-white">
                    {plan.name}
                  </h2>
                  <div class="mt-4 flex items-baseline justify-center gap-1">
                    <span class="text-4xl font-bold text-gray-950 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <ul class="mt-8 space-y-3">
                  <For each={plan.features}>
                    {(feature) => (
                      <li class="flex items-start gap-3">
                        <svg
                          class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    )}
                  </For>
                </ul>

                <a
                  href={plan.ctaHref}
                  class={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-950 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            )}
          </For>
        </div>

        {/* FAQ Section */}
        <div class="mt-24">
          <h2 class="text-center text-2xl font-bold text-gray-950 dark:text-white">
            Frequently asked questions
          </h2>
          <dl class="mx-auto mt-10 max-w-2xl space-y-6">
            <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <dt class="font-semibold text-gray-950 dark:text-white">
                Is the open source version really free?
              </dt>
              <dd class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Yes! All core components are available under the MIT license. You can use
                them in personal and commercial projects without any cost.
              </dd>
            </div>
            <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <dt class="font-semibold text-gray-950 dark:text-white">
                What's included in the Pro version?
              </dt>
              <dd class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Pro includes premium components, Figma design files, advanced examples,
                and priority support. It's a one-time purchase with lifetime access.
              </dd>
            </div>
            <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <dt class="font-semibold text-gray-950 dark:text-white">
                Can I use this for client projects?
              </dt>
              <dd class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Absolutely! The open source components can be used in any project. For
                client work requiring premium components, you'll need the Pro license.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
