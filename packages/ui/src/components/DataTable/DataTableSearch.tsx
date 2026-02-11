import { JSX, Show } from 'solid-js';

import { SearchRefractionIcon, XCloseIcon } from '@kayou/icons';

import { useDataTableInternal } from './DataTableInternalContext';

export function DataTableSearch(): JSX.Element {
  const ctx = useDataTableInternal();

  return (
    <div class="flex w-full shrink-0 border-b border-gray-200 px-6 dark:border-neutral-800">
      <div class="relative flex w-full max-w-md items-center">
        <SearchRefractionIcon class="size-5 text-gray-400 dark:text-neutral-500" />
        <input
          ref={ctx.setSearchRef}
          value={ctx.searchKey()}
          onInput={(e) => ctx.handleSearchChange(e.target.value)}
          placeholder={ctx.labels().searchPlaceholder}
          aria-label={ctx.ariaLabels().search}
          onFocus={(e) => e.target.select()}
          class="w-full bg-transparent py-3 pl-2 text-sm outline-none dark:text-white"
        />
        <Show when={ctx.searchKey()}>
          <button
            type="button"
            aria-label={ctx.ariaLabels().clearSearch}
            onClick={() => {
              ctx.handleSearchChange('');
              ctx.searchRef()?.focus();
            }}
            class="absolute right-0 top-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            <XCloseIcon class="size-4" aria-hidden="true" />
          </button>
        </Show>
      </div>
    </div>
  );
}
