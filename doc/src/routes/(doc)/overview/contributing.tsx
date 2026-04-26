import {
  GitBranch01Icon,
  GitPullRequestIcon,
  HeartIcon,
  MessageSquare01Icon,
} from '@kayou/icons';

import BaseDocPage from '../../../components/BaseDocPage';

const cloneCode = `git clone https://github.com/lemed99/kayou.git
cd kayou
pnpm install
pnpm dev`;

const branchCode = `git checkout -b feature/my-new-feature`;

const commitCode = `git commit -m "feat: add new component"
git push origin feature/my-new-feature`;

export default function ContributingPage() {
  return (
    <BaseDocPage
      title="Contributing"
      description="We welcome contributions from the community! Whether it's fixing bugs, adding usefull features, or improving documentation, your help makes Kayou better for everyone."
    >
      {/* Ways to Contribute */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">
          Ways to Contribute
        </h2>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <GitPullRequestIcon class="size-8 text-blue-600 dark:text-blue-400" />
            <h3 class="mt-4 font-semibold text-neutral-950 dark:text-white">
              Code Contributions
            </h3>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Fix bugs, add new components, improve existing features, or optimize
              performance.
            </p>
          </div>
          <div class="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <MessageSquare01Icon class="size-8 text-purple-600 dark:text-purple-400" />
            <h3 class="mt-4 font-semibold text-neutral-950 dark:text-white">
              Documentation
            </h3>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Improve documentation, add examples, fix typos, or translate to other
              languages.
            </p>
          </div>
          <div class="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <GitBranch01Icon class="size-8 text-green-600 dark:text-green-400" />
            <h3 class="mt-4 font-semibold text-neutral-950 dark:text-white">
              Bug Reports
            </h3>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Report bugs with detailed reproduction steps to help us identify and fix
              issues.
            </p>
          </div>
          <div class="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <HeartIcon class="size-8 text-pink-600 dark:text-pink-400" />
            <h3 class="mt-4 font-semibold text-neutral-950 dark:text-white">
              Feature Requests
            </h3>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Suggest new features or improvements that would benefit the community.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">
          Getting Started
        </h2>
        <div class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-neutral-950 dark:text-white">
              1. Fork and Clone the Repository
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              Fork the repository on GitHub, then clone your fork locally:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <pre class="bg-[#282c34] px-4 py-3 font-mono text-xs text-white">
                {cloneCode}
              </pre>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-950 dark:text-white">
              2. Create a Feature Branch
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              Create a new branch for your changes:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <pre class="bg-[#282c34] px-4 py-3 font-mono text-xs text-white">
                {branchCode}
              </pre>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-950 dark:text-white">
              3. Make Your Changes
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              Implement your changes, following our coding guidelines and conventions.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-950 dark:text-white">
              4. Commit and Push
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              Commit your changes with a descriptive message:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <pre class="bg-[#282c34] px-4 py-3 font-mono text-xs text-white">
                {commitCode}
              </pre>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-neutral-950 dark:text-white">
              5. Open a Pull Request
            </h3>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">
              Open a pull request on GitHub. Describe your changes and reference any
              related issues.
            </p>
          </div>
        </div>
      </section>

      {/* Coding Guidelines */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">
          Coding Guidelines
        </h2>
        <ul class="mt-6 space-y-3 text-neutral-600 dark:text-neutral-400">
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              1
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">TypeScript</strong> — All
              code must be written in TypeScript with proper type annotations.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              2
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">Formatting</strong> — Use
              Prettier for code formatting. Run{' '}
              <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-900">
                pnpm format
              </code>{' '}
              before committing.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              3
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">Linting</strong> — All code
              must pass ESLint checks. Run{' '}
              <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-900">
                pnpm lint
              </code>{' '}
              to check.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              4
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">Testing</strong> — Add
              tests for new features and ensure existing tests pass.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              5
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">Documentation</strong> —
              Update documentation for any API changes.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              6
            </span>
            <span>
              <strong class="text-neutral-950 dark:text-white">Accessibility</strong> —
              Ensure all components follow WAI-ARIA guidelines.
            </span>
          </li>
        </ul>
      </section>

      {/* Commit Convention */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">
          Commit Convention
        </h2>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">
          We follow the Conventional Commits specification. Each commit message should
          have the format:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table class="w-full text-sm">
            <thead class="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-neutral-900 dark:text-white">
                  Type
                </th>
                <th class="px-4 py-3 text-left font-medium text-neutral-900 dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">feat</td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  New feature
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">fix</td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">Bug fix</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">docs</td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Documentation changes
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  style
                </td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Code style (formatting, semicolons)
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  refactor
                </td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Code refactoring (no feature change)
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">perf</td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Performance improvement
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">test</td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Adding or fixing tests
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  chore
                </td>
                <td class="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Build process, tooling changes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </BaseDocPage>
  );
}
