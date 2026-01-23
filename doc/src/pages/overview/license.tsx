import { CheckCircleIcon, Scale01Icon } from '@exowpee/solidly-icons';

import ArticlePage from '../../components/ArticlePage';

export default function LicensePage() {
  return (
    <ArticlePage
      title="License"
      description="Solidly is open source software licensed under the MIT License. Use it freely in personal and commercial projects."
      badge={{
        text: 'MIT License',
        icon: <Scale01Icon class="size-4" />,
        color: 'green',
      }}
    >
      {/* What You Can Do */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          What You Can Do
        </h2>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <h3 class="font-medium text-gray-950 dark:text-white">Commercial Use</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Use Solidly in commercial applications without any license fees.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <h3 class="font-medium text-gray-950 dark:text-white">Modification</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Modify the source code to fit your needs.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <h3 class="font-medium text-gray-950 dark:text-white">Distribution</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Distribute the software in source or binary form.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <h3 class="font-medium text-gray-950 dark:text-white">Private Use</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Use Solidly in private, internal applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* License Text */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">MIT License</h2>
        <div class="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          <pre class="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300">
            {`MIT License

Copyright (c) 2024 Exowpee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>
      </section>

      {/* Icons Attribution */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Icons Attribution
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Solidly includes icons from{' '}
          <a
            href="https://www.untitledui.com/icons"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Untitled UI Icons
          </a>
          . These icons are free to use in personal and commercial projects. No
          attribution is required, but appreciated.
        </p>
        <div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong class="text-gray-950 dark:text-white">Note:</strong> While the icons
            are free, the full Untitled UI design system (Figma files, additional
            variants) is a commercial product. Visit{' '}
            <a
              href="https://www.untitledui.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline dark:text-blue-400"
            >
              untitledui.com
            </a>{' '}
            for more information.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div class="mt-6 space-y-4">
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">
              Can I use Solidly in a client project?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Yes! You can use Solidly in any project, including client work and
              commercial applications.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">
              Do I need to credit Solidly in my project?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The MIT license only requires you to include the license text in copies of
              the software. Attribution in your app's UI is appreciated but not required.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">
              Can I fork and modify Solidly?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Absolutely! Feel free to fork, modify, and even redistribute your modified
              version. Just keep the license intact.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">
              Is there a paid/premium version?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              No, Solidly is completely free and open source. All features, components,
              hooks, and icons are available at no cost.
            </p>
          </div>
        </div>
      </section>
    </ArticlePage>
  );
}
