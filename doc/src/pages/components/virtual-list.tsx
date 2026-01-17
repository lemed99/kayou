import { createSignal } from 'solid-js';

import { VirtualList, VirtualListHandle } from '@lib/components/VirtualList';

import DocPage from '../../components/DocPage';

export default function VirtualListPage() {
  return (
    <DocPage
      title="VirtualList"
      description="A high-performance virtualized list component that efficiently renders large datasets by only rendering visible items. Instead of creating DOM nodes for every item, it calculates which items are currently visible in the viewport and only renders those, plus a small buffer (overscan) above and below. As users scroll, items are recycled and repositioned, maintaining smooth 60fps scrolling even with tens of thousands of items. Each row is enforced to the exact rowHeight specified, enabling instant scroll position calculations without measuring DOM elements. Supports keyboard navigation, accessibility features, imperative scroll control, and customizable row rendering. For variable height rows, use DynamicVirtualList instead."
      keyConcepts={[
        {
          term: 'Virtualization',
          explanation:
            'The technique of only rendering visible items in the DOM. VirtualList maintains a "window" of rendered items that moves as users scroll, dramatically reducing memory usage and improving performance.',
        },
        {
          term: 'Fixed Row Height',
          explanation:
            'Each row must have the exact height specified in rowHeight. This constraint enables instant calculation of scroll positions and visible ranges without costly DOM measurements.',
        },
        {
          term: 'Overscan',
          explanation:
            'Extra items rendered above and below the visible area. This buffer prevents blank areas from appearing during fast scrolling. Default is 2 items.',
        },
        {
          term: 'Imperative Handle',
          explanation:
            'The ref prop provides a handle with scrollToIndex method for programmatic scrolling. Useful for "scroll to top" buttons or keyboard navigation.',
        },
      ]}
      value="Applications frequently deal with large datasets: audit logs, transaction histories, user directories, product catalogs. Without virtualization, rendering these lists causes browser lag, high memory usage, and poor user experience. VirtualList enables smooth handling of 100,000+ items with minimal memory footprint, making it essential for data-intensive dashboards and admin interfaces. The built-in accessibility support ensures compliance with accessibility requirements."
      props={[
        {
          name: 'items',
          type: 'Accessor<T[]>',
          default: '-',
          description:
            'Reactive accessor returning the array of items to render. Must be a function/accessor, not a raw array.',
          required: true,
        },
        {
          name: 'rootHeight',
          type: 'number',
          default: '-',
          description:
            'Maximum visible height of the list container in pixels. Determines how many items are visible at once.',
          required: true,
        },
        {
          name: 'rowHeight',
          type: 'number',
          default: '-',
          description:
            'Fixed height of each row in pixels. This height is enforced on each row wrapper (with overflow: hidden), ensuring accurate scroll calculations. Content exceeding this height will be clipped.',
          required: true,
        },
        {
          name: 'children',
          type: '(item: T, index: Accessor<number>) => JSX.Element',
          default: '-',
          description:
            'Render function for each item. Receives the item and a reactive index accessor.',
          required: true,
        },
        {
          name: 'overscanCount',
          type: 'number',
          default: '2',
          description:
            'Number of extra items to render above and below the visible area. Helps prevent flickering during fast scrolling.',
        },
        {
          name: 'containerWidth',
          type: 'string | number',
          default: 'auto',
          description:
            'Width of the container. Can be a pixel number or CSS string. If not set, width is calculated from content.',
        },
        {
          name: 'containerPadding',
          type: 'number',
          default: '4',
          description: 'Padding inside the container in pixels.',
        },
        {
          name: 'rowClass',
          type: 'string',
          default: '-',
          description: 'CSS class applied to each row wrapper div.',
        },
        {
          name: 'fallback',
          type: 'JSX.Element',
          default: '-',
          description: 'Content to display when items array is empty.',
        },
        {
          name: 'loading',
          type: 'JSX.Element',
          default: '-',
          description:
            'Loading indicator displayed at the end of the list. Useful for infinite scroll implementations.',
        },
        {
          name: 'setContainerRef',
          type: '(el: HTMLElement) => void',
          default: '-',
          description: 'Callback to receive the container DOM element reference.',
        },
        {
          name: 'setScrollPosition',
          type: '(scrollTop: number) => void',
          default: '-',
          description:
            'Callback fired on scroll with current scroll position. Useful for scroll position persistence.',
        },
        {
          name: 'ref',
          type: '(handle: VirtualListHandle) => void',
          default: '-',
          description:
            'Imperative handle ref providing scrollToIndex method for programmatic scrolling.',
        },
        {
          name: 'id',
          type: 'string',
          default: '-',
          description: 'HTML id attribute for the container.',
        },
        {
          name: 'role',
          type: 'string',
          default: '-',
          description:
            'ARIA role for accessibility (e.g., "listbox", "grid"). Enables keyboard navigation when set.',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: 'Accessible label for the list.',
        },
        {
          name: 'aria-multiselectable',
          type: 'boolean',
          default: '-',
          description: 'Indicates if multiple items can be selected.',
        },
        {
          name: 'aria-activedescendant',
          type: 'string',
          default: '-',
          description: 'ID of the currently active/focused item for accessibility.',
        },
        {
          name: 'onKeyDown',
          type: '(e: KeyboardEvent) => void',
          default: '-',
          description:
            'Keyboard event handler. Called before built-in navigation. Use e.preventDefault() to override.',
        },
      ]}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Simple virtualized list rendering 1000 items efficiently.',
          code: `const items = () => Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: \`Item \${i + 1}\`
}));

<VirtualList
  items={items}
  rootHeight={300}
  rowHeight={40}
>
  {(item) => (
    <div class="p-2 border-b border-gray-200">
      {item.name}
    </div>
  )}
</VirtualList>`,
          component: () => {
            const items = () =>
              Array.from({ length: 50 }, (_, i) => ({
                id: i,
                name: `Item ${i + 1}`,
              }));
            return (
              <VirtualList
                items={items}
                rootHeight={200}
                rowHeight={40}
                containerWidth={300}
              >
                {(item) => (
                  <div class="border-b border-gray-200 bg-white p-2">{item.name}</div>
                )}
              </VirtualList>
            );
          },
        },
        {
          title: 'With Selection',
          description:
            'Selectable list with keyboard navigation. Use arrow keys, Home, End, PageUp, PageDown to navigate.',
          code: `const [selectedId, setSelectedId] = createSignal<number | null>(null);
const items = () => Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: \`Option \${i + 1}\`
}));

<VirtualList
  items={items}
  rootHeight={200}
  rowHeight={36}
  role="listbox"
  aria-label="Select an option"
  aria-activedescendant={selectedId() !== null ? \`option-\${selectedId()}\` : undefined}
>
  {(item) => (
    <div
      id={\`option-\${item.id}\`}
      role="option"
      aria-selected={selectedId() === item.id}
      class={selectedId() === item.id ? 'bg-blue-100' : 'bg-white'}
      onClick={() => setSelectedId(item.id)}
    >
      {item.name}
    </div>
  )}
</VirtualList>`,
          component: () => {
            const [selectedId, setSelectedId] = createSignal<number | null>(null);
            const items = () =>
              Array.from({ length: 100 }, (_, i) => ({
                id: i,
                name: `Option ${i + 1}`,
              }));
            return (
              <VirtualList
                items={items}
                rootHeight={200}
                rowHeight={36}
                containerWidth={300}
                role="listbox"
                aria-label="Select an option"
                aria-activedescendant={
                  selectedId() !== null ? `option-${selectedId()}` : undefined
                }
              >
                {(item) => (
                  <div
                    id={`option-${item.id}`}
                    role="option"
                    aria-selected={selectedId() === item.id}
                    class={`cursor-pointer px-3 py-2 transition-colors ${
                      selectedId() === item.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.name}
                  </div>
                )}
              </VirtualList>
            );
          },
        },
        {
          title: 'Scroll To Index',
          description:
            'Use the imperative handle to programmatically scroll to specific items.',
          code: `let listHandle: VirtualListHandle | undefined;
const [targetIndex, setTargetIndex] = createSignal(0);
const items = () => Array.from({ length: 500 }, (_, i) => \`Item \${i + 1}\`);

<input
  type="number"
  min={0}
  max={499}
  value={targetIndex()}
  onInput={(e) => setTargetIndex(Number(e.target.value))}
/>
<button onClick={() => listHandle?.scrollToIndex(targetIndex(), 'smooth')}>
  Scroll to Item
</button>

<VirtualList
  ref={(handle) => (listHandle = handle)}
  items={items}
  rootHeight={200}
  rowHeight={40}
>
  {(item, index) => <div class="p-2">{item}</div>}
</VirtualList>`,
          component: () => {
            let listHandle: VirtualListHandle | undefined;
            const [targetIndex, setTargetIndex] = createSignal(0);
            const items = () => Array.from({ length: 500 }, (_, i) => `Item ${i + 1}`);

            return (
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={499}
                    value={targetIndex()}
                    onInput={(e) =>
                      setTargetIndex(Number((e.target as HTMLInputElement).value))
                    }
                    class="w-20 rounded border border-gray-300 px-2 py-1"
                  />
                  <button
                    onClick={() => listHandle?.scrollToIndex(targetIndex(), 'smooth')}
                    class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    Scroll to Item
                  </button>
                </div>
                <VirtualList
                  ref={(handle) => (listHandle = handle)}
                  items={items}
                  rootHeight={200}
                  rowHeight={40}
                  containerWidth={300}
                >
                  {(item, index) => (
                    <div class="border-b border-gray-200 bg-white p-2">
                      {item} (index: {index()})
                    </div>
                  )}
                </VirtualList>
              </div>
            );
          },
        },
        {
          title: 'With Loading Indicator',
          description:
            'Display a loading indicator at the end of the list for infinite scroll.',
          code: `const [items, setItems] = createSignal(
  Array.from({ length: 50 }, (_, i) => \`Item \${i + 1}\`)
);
const [loading, setLoading] = createSignal(false);

<VirtualList
  items={items}
  rootHeight={200}
  rowHeight={40}
  loading={loading() && (
    <div class="p-4 text-center text-gray-500">
      Loading more items...
    </div>
  )}
>
  {(item) => <div class="p-2">{item}</div>}
</VirtualList>`,
          component: () => {
            const [loading, setLoading] = createSignal(false);
            const [items, setItems] = createSignal(
              Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`),
            );

            const loadMore = () => {
              setLoading(true);
              setTimeout(() => {
                const currentLength = items().length;
                setItems([
                  ...items(),
                  ...Array.from(
                    { length: 20 },
                    (_, i) => `Item ${currentLength + i + 1}`,
                  ),
                ]);
                setLoading(false);
              }, 1000);
            };

            return (
              <div class="space-y-3">
                <button
                  onClick={loadMore}
                  disabled={loading()}
                  class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading() ? 'Loading...' : 'Load More'}
                </button>
                <VirtualList
                  items={items}
                  rootHeight={200}
                  rowHeight={40}
                  containerWidth={300}
                  loading={
                    loading() && (
                      <div class="p-4 text-center text-gray-500">
                        Loading more items...
                      </div>
                    )
                  }
                >
                  {(item) => (
                    <div class="border-b border-gray-200 bg-white p-2">{item}</div>
                  )}
                </VirtualList>
              </div>
            );
          },
        },
        {
          title: 'Empty State',
          description: 'Display a fallback when there are no items.',
          code: `const [items, setItems] = createSignal<string[]>([]);

<VirtualList
  items={items}
  rootHeight={200}
  rowHeight={40}
  fallback={
    <div class="p-8 text-center text-gray-500">
      No items to display
    </div>
  }
>
  {(item) => <div class="p-2">{item}</div>}
</VirtualList>`,
          component: () => {
            const [items, setItems] = createSignal<string[]>([]);
            const [hasItems, setHasItems] = createSignal(false);

            return (
              <div class="space-y-3">
                <button
                  onClick={() => {
                    setHasItems(!hasItems());
                    setItems(
                      hasItems()
                        ? Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`)
                        : [],
                    );
                  }}
                  class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  Toggle Items
                </button>
                <VirtualList
                  items={items}
                  rootHeight={200}
                  rowHeight={40}
                  containerWidth={300}
                  fallback={
                    <div class="p-8 text-center text-gray-500">No items to display</div>
                  }
                >
                  {(item) => (
                    <div class="border-b border-gray-200 bg-white p-2">{item}</div>
                  )}
                </VirtualList>
              </div>
            );
          },
        },
        {
          title: 'Custom Row Styling',
          description: 'Apply custom classes to row wrappers using rowClass.',
          code: `const items = () => Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`
}));

<VirtualList
  items={items}
  rootHeight={250}
  rowHeight={60}
  rowClass="border-b border-gray-100"
>
  {(item) => (
    <div class="p-2">
      <div class="font-medium">{item.name}</div>
      <div class="text-sm text-gray-500">{item.email}</div>
    </div>
  )}
</VirtualList>`,
          component: () => {
            const items = () =>
              Array.from({ length: 100 }, (_, i) => ({
                id: i,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
              }));

            return (
              <VirtualList
                items={items}
                rootHeight={250}
                rowHeight={60}
                containerWidth={300}
                rowClass="border-b border-gray-100 bg-white"
              >
                {(item) => (
                  <div class="p-2">
                    <div class="font-medium">{item.name}</div>
                    <div class="text-sm text-gray-500">{item.email}</div>
                  </div>
                )}
              </VirtualList>
            );
          },
        },
        {
          title: 'Scroll Position Persistence',
          description:
            'Track scroll position to restore it later (e.g., after navigation).',
          code: `const [scrollPosition, setScrollPosition] = createSignal(0);
const items = () => Array.from({ length: 200 }, (_, i) => \`Item \${i + 1}\`);

<p>Scroll position: {scrollPosition()}px</p>

<VirtualList
  items={items}
  rootHeight={200}
  rowHeight={40}
  setScrollPosition={setScrollPosition}
>
  {(item) => <div class="p-2">{item}</div>}
</VirtualList>`,
          component: () => {
            const [scrollPosition, setScrollPosition] = createSignal(0);
            const items = () => Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`);

            return (
              <div class="space-y-3">
                <p class="text-sm text-gray-600">Scroll position: {scrollPosition()}px</p>
                <VirtualList
                  items={items}
                  rootHeight={200}
                  rowHeight={40}
                  containerWidth={300}
                  setScrollPosition={setScrollPosition}
                >
                  {(item) => (
                    <div class="border-b border-gray-200 bg-white p-2">{item}</div>
                  )}
                </VirtualList>
              </div>
            );
          },
        },
      ]}
      usage={`import { VirtualList, VirtualListHandle } from '@exowpee/the_rock';
import { createSignal } from 'solid-js';

// Basic usage with accessor
const [items, setItems] = createSignal([...]);

<VirtualList
  items={items}
  rootHeight={400}
  rowHeight={50}
>
  {(item, index) => (
    <div>{item.name} (#{index()})</div>
  )}
</VirtualList>

// With imperative scroll control
let listHandle: VirtualListHandle | undefined;

<VirtualList
  ref={(handle) => (listHandle = handle)}
  items={items}
  rootHeight={400}
  rowHeight={50}
>
  {(item) => <div>{item.name}</div>}
</VirtualList>

// Scroll to item
listHandle?.scrollToIndex(50, 'smooth');

// Accessible listbox pattern
const [selectedId, setSelectedId] = createSignal<string | null>(null);

<VirtualList
  items={items}
  rootHeight={300}
  rowHeight={40}
  role="listbox"
  aria-label="Select an item"
  aria-activedescendant={selectedId() ?? undefined}
>
  {(item) => (
    <div
      id={item.id}
      role="option"
      aria-selected={selectedId() === item.id}
      onClick={() => setSelectedId(item.id)}
    >
      {item.name}
    </div>
  )}
</VirtualList>

// VirtualListHandle type reference
type VirtualListHandle = {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};

// Keyboard Navigation (when role is set):
// - Home: Scroll to first item
// - End: Scroll to last item
// - PageUp: Scroll up by one page
// - PageDown: Scroll down by one page

// Important: Row Height Enforcement
// ---------------------------------
// Each row wrapper has enforced height and overflow: hidden.
// This ensures scroll calculations are always accurate.
// Content taller than rowHeight will be clipped.
//
// Design your row content to fit within rowHeight.
// If you need variable height rows, use DynamicVirtualList instead.`}
      relatedHooks={[
        {
          name: 'useVirtualList',
          path: '/hooks/use-virtual-list',
          description:
            'Core virtualization logic that calculates visible items, container height, and scroll positions.',
        },
      ]}
    />
  );
}
