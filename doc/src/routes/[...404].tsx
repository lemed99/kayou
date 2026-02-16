export default function NotFound() {
  return (
    <div class="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 class="text-4xl font-bold text-neutral-900 dark:text-white">404</h1>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Page not found</p>
      <a href="/" class="mt-6 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400">
        Go back home
      </a>
    </div>
  );
}
