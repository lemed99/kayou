import { StartServer, createHandler } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="35+ accessible, production-ready UI components and utility hooks for SolidJS. Styled with Tailwind CSS. Includes forms, data tables, charts, date pickers, and more."
          />
          <title>Kayou UI - Component Library</title>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          {/* OpenGraph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Kayou UI - Component Library" />
          <meta
            property="og:description"
            content="35+ accessible, production-ready UI components and utility hooks for SolidJS. Styled with Tailwind CSS."
          />
          <meta property="og:site_name" content="Kayou UI" />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Kayou UI - Component Library" />
          <meta
            name="twitter:description"
            content="35+ accessible, production-ready UI components and utility hooks for SolidJS. Styled with Tailwind CSS."
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          {/* Dark mode FOUC prevention - eslint-disable-next-line solid/no-innerhtml */}
          <script
            // eslint-disable-next-line solid/no-innerhtml
            innerHTML={`
            (function () {
              var stored = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (stored === 'dark' || (!stored && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })();
          `}
          />
          {assets}
        </head>
        <body class="bg-white text-sm text-neutral-900 dark:bg-neutral-950/[98%] dark:text-white">
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
