import { createSignal } from 'solid-js';

import {
  DynamicVirtualList,
  DynamicVirtualListHandle,
} from '@kayou/ui';
import DocPage from '../../../components/DocPage';

// Sample data with variable content lengths
const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description:
      i % 3 === 0
        ? 'Short description.'
        : i % 3 === 1
          ? 'Medium length description that takes up a bit more space and wraps to multiple lines.'
          : 'This is a much longer description that demonstrates how the dynamic virtual list handles variable height content. It contains multiple sentences and will definitely wrap to several lines depending on the container width.',
  }));

export default function DynamicVirtualListPage() {
  return (
    <DocPage
      title="DynamicVirtualList"
      description="Virtualized list supporting variable row heights with automatic measurement and caching."
      keyConcepts={[
        {
          term: 'Dynamic Measurement',
          explanation:
            'Measures actual rendered heights and caches them for scroll calculations.',
        },
        {
          term: 'Estimated Row Height',
          explanation:
            'Initial estimate before measurement; closer to average improves accuracy.',
        },
        {
          term: 'Height Cache',
          explanation: 'Cached heights auto-update via ResizeObserver when items resize.',
        },
        {
          term: 'Binary Search',
          explanation: 'O(log n) scroll position calculation over cumulative heights.',
        },
      ]}
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
            'Maximum visible height of the list container in pixels. Determines the viewport size.',
          required: true,
        },
        {
          name: 'estimatedRowHeight',
          type: 'number',
          default: '-',
          description:
            'Initial estimate for row height in pixels. Used before actual measurements are available. Should be close to average expected height for best initial render.',
          required: true,
        },
        {
          name: 'children',
          type: '(item: T, index: Accessor<number>) => JSX.Element',
          default: '-',
          description:
            'Render function for each item. Receives the item and a reactive index accessor. Content can have any height.',
          required: true,
        },
        {
          name: 'overscanCount',
          type: 'number',
          default: '2',
          description:
            'Number of extra items to render above and below the visible area. Helps prevent flickering during scrolling.',
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
          name: 'rowRole',
          type: 'string',
          default: '-',
          description:
            'ARIA role for each row item (e.g., "option" for listbox, "row" for grid). Automatically adds aria-setsize and aria-posinset.',
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
          name: 'setAverageRowHeight',
          type: '(height: number) => void',
          default: '-',
          description:
            'Callback fired when average row height is recalculated. Useful for persisting estimated height for future renders.',
        },
        {
          name: 'ref',
          type: '(handle: DynamicVirtualListHandle) => void',
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
          title: 'Basic Usage with Variable Heights',
          description:
            'Items with different content lengths are rendered with their natural heights.',
          component: () => {
            const items = () => generateItems(100);
            return (
              <DynamicVirtualList
                items={items}
                rootHeight={300}
                estimatedRowHeight={80}
                containerWidth={350}
              >
                {(item) => (
                  <div class="border-b border-gray-200 bg-white p-3">
                    <div class="font-medium">{item.title}</div>
                    <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                )}
              </DynamicVirtualList>
            );
          },
        },
        {
          title: 'Chat Messages',
          description: 'Perfect for chat interfaces where messages vary in length.',
          component: () => {
            const messages = () =>
              Array.from({ length: 50 }, (_, i) => ({
                id: i,
                sender: i % 2 === 0 ? 'Alice' : 'You',
                text:
                  i % 4 === 0
                    ? 'Hi!'
                    : i % 4 === 1
                      ? 'Hello! How are you doing today?'
                      : i % 4 === 2
                        ? "I'm great, thanks for asking! I wanted to discuss the project we've been working on."
                        : 'Sure, what would you like to talk about? I have some ideas I want to share with you about the upcoming features.',
                isMe: i % 2 === 1,
              }));

            return (
              <DynamicVirtualList
                items={messages}
                rootHeight={300}
                estimatedRowHeight={60}
                containerWidth={350}
              >
                {(msg) => (
                  <div class={`p-2 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                    <span class="mb-1 block text-xs text-gray-500">{msg.sender}</span>
                    <div
                      class={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
              </DynamicVirtualList>
            );
          },
        },
        {
          title: 'With Selection and Accessibility',
          description: 'Accessible listbox with variable height options.',
          component: () => {
            const [selectedId, setSelectedId] = createSignal<number | null>(null);
            const items = () => generateItems(50);

            return (
              <DynamicVirtualList
                items={items}
                rootHeight={250}
                estimatedRowHeight={80}
                containerWidth={350}
                role="listbox"
                rowRole="option"
                aria-label="Select an item"
                aria-activedescendant={
                  selectedId() !== null ? `item-${selectedId()}` : undefined
                }
              >
                {(item) => (
                  <div
                    id={`item-${item.id}`}
                    aria-selected={selectedId() === item.id}
                    class={`cursor-pointer border-b border-gray-100 p-3 transition-colors ${
                      selectedId() === item.id
                        ? 'bg-blue-50'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div class="font-medium">{item.title}</div>
                    <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                )}
              </DynamicVirtualList>
            );
          },
        },
        {
          title: 'Scroll To Index',
          description:
            'Programmatically scroll to items. Scroll positions are calculated using actual measured heights.',
          component: () => {
            let listHandle: DynamicVirtualListHandle | undefined;
            const [targetIndex, setTargetIndex] = createSignal(0);
            const items = () => generateItems(100);

            return (
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={targetIndex()}
                    onInput={(e) =>
                      setTargetIndex(Number((e.target as HTMLInputElement).value))
                    }
                    class="w-20 rounded border border-gray-300 px-2 py-1"
                  />
                  <button
                    onClick={() => listHandle?.scrollToIndex(targetIndex(), 'smooth')}
                    class="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    Scroll to Item
                  </button>
                </div>
                <DynamicVirtualList
                  ref={(handle) => (listHandle = handle)}
                  items={items}
                  rootHeight={250}
                  estimatedRowHeight={80}
                  containerWidth={350}
                >
                  {(item, index) => (
                    <div class="border-b border-gray-200 bg-white p-3">
                      <div class="font-medium">
                        {item.title} (index: {index()})
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>
                  )}
                </DynamicVirtualList>
              </div>
            );
          },
        },
        {
          title: 'Track Average Row Height',
          description:
            'Monitor the calculated average height for better initial estimates in future renders.',
          component: () => {
            const [avgHeight, setAvgHeight] = createSignal(0);
            const items = () => generateItems(100);

            return (
              <div class="space-y-3">
                <p class="text-sm text-gray-600">
                  Average row height: {avgHeight().toFixed(1)}px
                </p>
                <DynamicVirtualList
                  items={items}
                  rootHeight={250}
                  estimatedRowHeight={80}
                  containerWidth={350}
                  setAverageRowHeight={setAvgHeight}
                >
                  {(item) => (
                    <div class="border-b border-gray-200 bg-white p-3">
                      <div class="font-medium">{item.title}</div>
                      <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>
                  )}
                </DynamicVirtualList>
              </div>
            );
          },
        },
        {
          title: 'Expandable Items',
          description:
            'Items can change height dynamically. The list automatically adjusts.',
          component: () => {
            const [expandedId, setExpandedId] = createSignal<number | null>(null);
            const items = () =>
              Array.from({ length: 50 }, (_, i) => ({
                id: i,
                title: `Expandable Item ${i + 1}`,
                details: `This is the expanded content for item ${i + 1}. It contains additional information that is only shown when the item is expanded. Click again to collapse.`,
              }));

            return (
              <DynamicVirtualList
                items={items}
                rootHeight={300}
                estimatedRowHeight={50}
                containerWidth={350}
              >
                {(item) => (
                  <div
                    class="cursor-pointer border-b border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                    onClick={() =>
                      setExpandedId(expandedId() === item.id ? null : item.id)
                    }
                  >
                    <div class="flex items-center justify-between font-medium">
                      {item.title}
                      <span class="text-gray-400">
                        {expandedId() === item.id ? '▼' : '▶'}
                      </span>
                    </div>
                    {expandedId() === item.id && (
                      <p class="mt-2 text-sm text-gray-600">{item.details}</p>
                    )}
                  </div>
                )}
              </DynamicVirtualList>
            );
          },
        },
        {
          title: 'Empty State',
          description: 'Display a fallback when there are no items.',
          component: () => {
            const [items, setItems] = createSignal<
              typeof generateItems extends (n: number) => infer R ? R : never
            >([]);
            const [hasItems, setHasItems] = createSignal(false);

            return (
              <div class="space-y-3">
                <button
                  onClick={() => {
                    setHasItems(!hasItems());
                    setItems(hasItems() ? generateItems(20) : []);
                  }}
                  class="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  Toggle Items
                </button>
                <DynamicVirtualList
                  items={items}
                  rootHeight={200}
                  estimatedRowHeight={80}
                  containerWidth={350}
                  fallback={
                    <div class="p-8 text-center text-gray-500">No items to display</div>
                  }
                >
                  {(item) => (
                    <div class="border-b border-gray-200 bg-white p-3">
                      <div class="font-medium">{item.title}</div>
                      <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>
                  )}
                </DynamicVirtualList>
              </div>
            );
          },
        },
      ]}
      usage={`
        import { DynamicVirtualList, DynamicVirtualListHandle } from '@kayou/ui';

        <DynamicVirtualList items={items} rootHeight={400} estimatedRowHeight={60}>{(item) => <div>{item.text}</div>}</DynamicVirtualList>
        <DynamicVirtualList items={items} rootHeight={400} estimatedRowHeight={60} ref={(h) => listHandle = h} role="listbox">{(item) => <div>{item.text}</div>}</DynamicVirtualList>
      `}
      relatedHooks={[
        {
          name: 'useDynamicVirtualList',
          path: '/hooks/use-dynamic-virtual-list',
          description:
            'Core virtualization logic for variable height items with dynamic measurement and binary search.',
        },
      ]}
    />
  );
}
