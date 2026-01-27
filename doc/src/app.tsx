import { type JSX, Show, Suspense } from 'solid-js';

import { type RouteSectionProps, Router, useLocation } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';

import Navbar from './components/Navbar';
import './index.css';

// Root layout component
function RootLayout(props: RouteSectionProps): JSX.Element {
  const location = useLocation();

  // Check if we're on the preview page (no chrome)
  const isPreviewPage = () => location.pathname.startsWith('/preview');

  return (
    <Show
      when={!isPreviewPage()}
      fallback={<Suspense>{props.children}</Suspense>}
    >
        <div class="min-h-dvh">
          <Navbar />
          <main>
            <Suspense>{props.children}</Suspense>
          </main>
        </div>
    </Show>
  );
}

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
