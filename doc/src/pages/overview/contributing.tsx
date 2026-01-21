/* eslint-disable solid/no-innerhtml */
import {
  GitBranch01Icon,
  GitPullRequestIcon,
  HeartIcon,
  MessageSquare01Icon,
} from '@exowpee/solidly/icons';

import { formatCodeToHTML } from '../../helpers/formatCodeToHTML';

const cloneCode = `git clone https://github.com/exowpee/solidly.git
cd solidly
pnpm install
pnpm dev`;

const branchCode = `git checkout -b feature/my-new-feature`;

const commitCode = `git commit -m "feat: add new component"
git push origin feature/my-new-feature`;

export default function ContributingPage() {
  const getTheme = () =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <div class="mx-auto max-w-4xl">
      {/* Header */}
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
          <HeartIcon class="size-4" />
          Open Source
        </div>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
          Contributing
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We welcome contributions from the community! Whether it's fixing bugs, adding
          features, or improving documentation, your help makes Solidly better for
          everyone.
        </p>
      </div>

      {/* Ways to Contribute */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Ways to Contribute
        </h2>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <GitPullRequestIcon class="size-8 text-blue-600 dark:text-blue-400" />
            <h3 class="mt-4 font-semibold text-gray-950 dark:text-white">
              Code Contributions
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fix bugs, add new components, improve existing features, or optimize
              performance.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <MessageSquare01Icon class="size-8 text-purple-600 dark:text-purple-400" />
            <h3 class="mt-4 font-semibold text-gray-950 dark:text-white">
              Documentation
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Improve documentation, add examples, fix typos, or translate to other
              languages.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <GitBranch01Icon class="size-8 text-green-600 dark:text-green-400" />
            <h3 class="mt-4 font-semibold text-gray-950 dark:text-white">Bug Reports</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Report bugs with detailed reproduction steps to help us identify and fix
              issues.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <HeartIcon class="size-8 text-pink-600 dark:text-pink-400" />
            <h3 class="mt-4 font-semibold text-gray-950 dark:text-white">
              Feature Requests
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Suggest new features or improvements that would benefit the community.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Getting Started
        </h2>
        <div class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-950 dark:text-white">
              1. Fork and Clone the Repository
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Fork the repository on GitHub, then clone your fork locally:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(cloneCode, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-950 dark:text-white">
              2. Create a Feature Branch
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Create a new branch for your changes:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(branchCode, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-950 dark:text-white">
              3. Make Your Changes
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Implement your changes, following our coding guidelines and conventions.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-950 dark:text-white">
              4. Commit and Push
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Commit your changes with a descriptive message:
            </p>
            <div class="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(commitCode, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-950 dark:text-white">
              5. Open a Pull Request
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Open a pull request on GitHub. Describe your changes and reference any
              related issues.
            </p>
          </div>
        </div>
      </section>

      {/* Coding Guidelines */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Coding Guidelines
        </h2>
        <ul class="mt-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              1
            </span>
            <span>
              <strong class="text-gray-950 dark:text-white">TypeScript</strong> — All code
              must be written in TypeScript with proper type annotations.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              2
            </span>
            <span>
              <strong class="text-gray-950 dark:text-white">Formatting</strong> — Use
              Prettier for code formatting. Run{' '}
              <code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-900">
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
              <strong class="text-gray-950 dark:text-white">Linting</strong> — All code
              must pass ESLint checks. Run{' '}
              <code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-900">
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
              <strong class="text-gray-950 dark:text-white">Testing</strong> — Add tests
              for new features and ensure existing tests pass.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              5
            </span>
            <span>
              <strong class="text-gray-950 dark:text-white">Documentation</strong> —
              Update documentation for any API changes.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              6
            </span>
            <span>
              <strong class="text-gray-950 dark:text-white">Accessibility</strong> —
              Ensure all components follow WAI-ARIA guidelines.
            </span>
          </li>
        </ul>
      </section>

      {/* Commit Convention */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Commit Convention
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          We follow the Conventional Commits specification. Each commit message should
          have the format:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">feat</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">New feature</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">fix</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">Bug fix</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">docs</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Documentation changes
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  style
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Code style (formatting, semicolons)
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  refactor
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Code refactoring (no feature change)
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">perf</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Performance improvement
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">test</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Adding or fixing tests
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                  chore
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                  Build process, tooling changes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Links */}
      <section class="mb-12 rounded-2xl bg-gray-100 p-8 dark:bg-gray-900">
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">Resources</h2>
        <div class="mt-4 flex flex-wrap gap-4">
          <a
            href="https://github.com/exowpee/solidly"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            GitHub Repository
          </a>
          <a
            href="https://github.com/exowpee/solidly/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Issue Tracker
          </a>
          <a
            href="https://github.com/exowpee/solidly/discussions"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Discussions
          </a>
        </div>
      </section>
    </div>
  );
}
