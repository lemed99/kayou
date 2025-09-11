// components/Pagination.tsx
import { Component, For, JSX, createMemo, createSignal, mergeProps } from 'solid-js';

import Button from './Button';

interface PaginationProps {
  total: number; // total number of pages
  currentPage?: number; // controlled current page
  defaultPage?: number; // uncontrolled initial page
  siblingCount?: number; // how many pages to show around current
  boundaryCount?: number; // pages to show at the start and end
  onPageChange?: (page: number) => void;
  classNames?: {
    button?: string;
    buttonActive?: string;
    buttonDisabled?: string;
    buttonEllipsis?: string;
    buttonFirst?: string;
    buttonLast?: string;
    buttonNext?: string;
    buttonPrevious?: string;
  };
  renderItem?: (page: number, isCurrent: boolean) => JSX.Element;
}

export const Pagination: Component<PaginationProps> = (rawProps) => {
  const props = mergeProps(
    {
      siblingCount: 1,
      boundaryCount: 1,
      defaultPage: 1,
      class: '',
    },
    rawProps,
  );

  const [internalPage, setInternalPage] = createSignal(props.defaultPage);

  const currentPage = () =>
    props.currentPage !== undefined ? props.currentPage : internalPage();

  const totalPages = () => Math.max(1, props.total);

  const setPage = (page: number) => {
    if (props.currentPage === undefined) {
      setInternalPage(page);
    }
    props.onPageChange?.(page);
  };

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const paginationRange = createMemo(() => {
    const total = totalPages();
    const page = currentPage();
    const siblingCount = props.siblingCount;
    const boundaryCount = props.boundaryCount;

    const totalVisible = siblingCount * 2 + boundaryCount * 2 + 1; // +2 for current and 2 dots

    if (total <= totalVisible) {
      return range(1, total);
    }

    const startPages = range(1, boundaryCount);
    const endPages = range(total - boundaryCount + 1, total);

    const siblingsStart = Math.max(boundaryCount + 2, page - siblingCount);
    const siblingsEnd = Math.min(total - boundaryCount - 1, page + siblingCount);

    const showStartEllipsis = siblingsStart > boundaryCount + 2;
    const showEndEllipsis = siblingsEnd < total - boundaryCount - 1;

    const pages = [];

    pages.push(...startPages);

    if (showStartEllipsis) {
      pages.push(-1); // ellipsis
    } else {
      pages.push(...range(boundaryCount + 1, siblingsStart - 1));
    }

    pages.push(...range(siblingsStart, siblingsEnd));

    if (showEndEllipsis) {
      pages.push(-2); // ellipsis
    } else {
      pages.push(...range(siblingsEnd + 1, total - boundaryCount));
    }

    pages.push(...endPages);

    return pages;
  });

  const isActivePage = (page: number) => page === currentPage();

  const defaultRenderItem = (page: number) => {
    if (page === -1 || page === -2) {
      return <span class="px-2">...</span>;
    }

    return (
      <Button
        onClick={() => setPage(page)}
        class={`h-7 rounded px-1 py-1 ${
          isActivePage(page)
            ? props.classNames?.buttonActive
              ? props.classNames?.buttonActive
              : 'bg-blue-600 text-white'
            : props.classNames?.buttonDisabled
              ? props.classNames?.buttonDisabled
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        size="xs"
      >
        {page}
      </Button>
    );
  };

  return (
    <nav class={`flex items-center gap-1 ${props.class}`}>
      <Button
        onClick={() => setPage(Math.max(1, currentPage() - 1))}
        disabled={currentPage() === 1}
        class={`h-7 cursor-pointer rounded bg-slate-50 px-2 py-1 text-sm text-gray-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${
          props.classNames?.buttonPrevious || ''
        } ${currentPage() === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        size="xs"
      >
        &laquo;
      </Button>

      <For each={paginationRange()}>
        {(page) =>
          props.renderItem
            ? props.renderItem(page, isActivePage(page))
            : defaultRenderItem(page)
        }
      </For>

      <Button
        onClick={() => setPage(Math.min(totalPages(), currentPage() + 1))}
        disabled={currentPage() === totalPages()}
        class={`h-7 cursor-pointer rounded bg-slate-50 px-2 py-1 text-sm text-gray-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${
          props.classNames?.buttonNext || ''
        }`}
        size="xs"
      >
        &raquo;
      </Button>
    </nav>
  );
};
