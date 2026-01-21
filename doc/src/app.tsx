import { type Component, type JSX, Show, Suspense } from 'solid-js';

import { ToastProvider } from '@exowpee/solidly/context';
import { useLocation } from '@solidjs/router';

import Navbar from './components/Navbar';
import DocLayout from './layouts/DocLayout';

const App: Component<{ children: JSX.Element }> = (props): JSX.Element => {
  const location = useLocation();

  // Check if we're on the preview page (no chrome)
  const isPreviewPage = () => location.pathname.startsWith('/preview');

  // Check if we're on a docs page (has sidebar)
  const isDocsPage = () => {
    const path = location.pathname;
    return (
      path.startsWith('/components') ||
      path.startsWith('/hooks') ||
      path.startsWith('/contexts') ||
      path.startsWith('/overview')
    );
  };

  // Determine which layout to use
  const getLayout = (children: JSX.Element) => {
    if (isDocsPage()) {
      return <DocLayout>{children}</DocLayout>;
    }
    return children;
  };

  return (
    <Show
      when={!isPreviewPage()}
      fallback={
        // Preview pages render without any chrome
        <Suspense>{props.children}</Suspense>
      }
    >
      <ToastProvider methods={{}}>
        <div class="min-h-dvh bg-white dark:bg-gray-900">
          {/* Global Navbar (includes banner) */}
          <Navbar />

          {/* Main Content Area */}
          <main>
            <Suspense>{getLayout(props.children)}</Suspense>
          </main>
        </div>
      </ToastProvider>
    </Show>
  );
};

export default App;
