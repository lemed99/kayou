import { createSignal } from 'solid-js';

import {
  DynamicVirtualList,
  DynamicVirtualListHandle,
} from '@lib/components/DynamicVirtualList';

import DocPage from '../../components/DocPage';

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
      description="A virtualized list component that supports variable row heights. Unlike VirtualList which requires fixed row heights, DynamicVirtualList measures each row's actual height and uses binary search for efficient scroll position calculations. It maintains an internal cache of measured heights. When an item renders for the first time, its height is measured and cached, enabling accurate scrolling behavior even with wildly varying content sizes. The component also tracks average row height, which improves initial render estimates and can be persisted across sessions. Ideal for lists where items have varying content sizes like chat messages, comments, or expandable cards."
      keyConcepts={[
        {
          term: 'Dynamic Measurement',
          explanation:
            'Unlike VirtualList, this component measures actual rendered heights. Items are rendered, measured, and their heights cached for future scroll calculations.',
        },
        {
          term: 'Estimated Row Height',
          explanation:
            'An initial estimate used before actual measurements. Providing a value close to your average item height improves initial render accuracy and reduces layout shifts.',
        },
        {
          term: 'Height Cache',
          explanation:
            'Measured heights are stored in a cache. When items change size (e.g., expansion), the cache updates automatically via ResizeObserver.',
        },
        {
          term: 'Binary Search',
          explanation:
            'Scroll positions are calculated using binary search over cumulative heights, maintaining O(log n) performance even with thousands of variable-height items.',
        },
      ]}
      value="Many interfaces display content with naturally variable heights: email threads, activity feeds, audit logs with varying detail levels, and document previews. DynamicVirtualList handles these scenarios without forcing artificial height constraints that would truncate content or waste space. The height caching and average tracking features optimize repeated renders, which is valuable in dashboards where users frequently navigate between views."
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
          code: `const items = () => [
  { id: 1, text: 'Short item' },
  { id: 2, text: 'This is a much longer item with more content...' },
  { id: 3, text: 'Medium item here' },
];

<DynamicVirtualList
  items={items}
  rootHeight={300}
  estimatedRowHeight={60}
>
  {(item) => (
    <div class="p-3 border-b">
      <p>{item.text}</p>
    </div>
  )}
</DynamicVirtualList>`,
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
          code: `const messages = () => [
  { id: 1, sender: 'Alice', text: 'Hi!', isMe: false },
  { id: 2, sender: 'You', text: 'Hello! How are you?', isMe: true },
  { id: 3, sender: 'Alice', text: 'Great! I wanted to discuss...', isMe: false },
];

<DynamicVirtualList
  items={messages}
  rootHeight={400}
  estimatedRowHeight={50}
>
  {(msg) => (
    <div class={msg.isMe ? 'text-right' : 'text-left'}>
      <div class={msg.isMe ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
        {msg.text}
      </div>
    </div>
  )}
</DynamicVirtualList>`,
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
          code: `const [selectedId, setSelectedId] = createSignal<number | null>(null);

<DynamicVirtualList
  items={items}
  rootHeight={250}
  estimatedRowHeight={60}
  role="listbox"
  rowRole="option"
  aria-label="Select an item"
  aria-activedescendant={selectedId() !== null ? \`item-\${selectedId()}\` : undefined}
>
  {(item) => (
    <div
      id={\`item-\${item.id}\`}
      aria-selected={selectedId() === item.id}
      onClick={() => setSelectedId(item.id)}
    >
      {item.title}
    </div>
  )}
</DynamicVirtualList>`,
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
          code: `let listHandle: DynamicVirtualListHandle | undefined;
const [targetIndex, setTargetIndex] = createSignal(0);

<button onClick={() => listHandle?.scrollToIndex(targetIndex(), 'smooth')}>
  Scroll to Item
</button>

<DynamicVirtualList
  ref={(handle) => (listHandle = handle)}
  items={items}
  rootHeight={250}
  estimatedRowHeight={60}
>
  {(item, index) => <div>{item.title} (#{index()})</div>}
</DynamicVirtualList>`,
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
                    class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
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
          code: `const [avgHeight, setAvgHeight] = createSignal(0);

<p>Average row height: {avgHeight().toFixed(1)}px</p>

<DynamicVirtualList
  items={items}
  rootHeight={250}
  estimatedRowHeight={60}
  setAverageRowHeight={setAvgHeight}
>
  {(item) => <div>{item.content}</div>}
</DynamicVirtualList>`,
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
          code: `const [expandedId, setExpandedId] = createSignal<number | null>(null);

<DynamicVirtualList items={items} rootHeight={300} estimatedRowHeight={50}>
  {(item) => (
    <div onClick={() => setExpandedId(expandedId() === item.id ? null : item.id)}>
      <div>{item.title}</div>
      {expandedId() === item.id && <div>{item.details}</div>}
    </div>
  )}
</DynamicVirtualList>`,
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
          code: `<DynamicVirtualList
  items={() => []}
  rootHeight={200}
  estimatedRowHeight={50}
  fallback={<div class="p-8 text-center">No items</div>}
>
  {(item) => <div>{item}</div>}
</DynamicVirtualList>`,
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
                  class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
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
      usage={`import { DynamicVirtualList, DynamicVirtualListHandle } from '@exowpee/the_rock';
import { createSignal } from 'solid-js';

// Basic usage - items with variable heights
const [items, setItems] = createSignal([
  { id: 1, text: 'Short' },
  { id: 2, text: 'This is a longer message...' },
]);

<DynamicVirtualList
  items={items}
  rootHeight={400}
  estimatedRowHeight={60}
>
  {(item, index) => (
    <div class="p-3">
      <p>{item.text}</p>
    </div>
  )}
</DynamicVirtualList>

// With imperative scroll control
let listHandle: DynamicVirtualListHandle | undefined;

<DynamicVirtualList
  ref={(handle) => (listHandle = handle)}
  items={items}
  rootHeight={400}
  estimatedRowHeight={60}
>
  {(item) => <div>{item.text}</div>}
</DynamicVirtualList>

// Scroll to item (uses actual measured heights)
listHandle?.scrollToIndex(50, 'smooth');

// Track average height for better estimates
const [avgHeight, setAvgHeight] = createSignal(60);

<DynamicVirtualList
  items={items}
  rootHeight={400}
  estimatedRowHeight={avgHeight()}
  setAverageRowHeight={setAvgHeight}
>
  {(item) => <div>{item.text}</div>}
</DynamicVirtualList>

// Accessible listbox with variable height options
<DynamicVirtualList
  items={items}
  rootHeight={300}
  estimatedRowHeight={60}
  role="listbox"
  rowRole="option"
  aria-label="Select an item"
>
  {(item) => (
    <div id={item.id} role="option">
      {item.text}
    </div>
  )}
</DynamicVirtualList>

// DynamicVirtualListHandle type reference
type DynamicVirtualListHandle = {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};

// Keyboard Navigation (when role is set):
// - Home: Scroll to first item
// - End: Scroll to last item
// - PageUp: Scroll up by one page
// - PageDown: Scroll down by one page

// When to use DynamicVirtualList vs VirtualList:
// - Use DynamicVirtualList when item heights vary (chat, comments, cards)
// - Use VirtualList when all items have the same fixed height (tables, simple lists)
// - DynamicVirtualList has slightly more overhead due to height measurements`}
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
