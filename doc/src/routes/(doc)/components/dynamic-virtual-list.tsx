import DocPage from '../../../components/DocPage';

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
      playground={`
import { DynamicVirtualList } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [selectedId, setSelectedId] = createSignal(null);
  const [expandedId, setExpandedId] = createSignal(null);
  const [avgHeight, setAvgHeight] = createSignal(0);
  const [targetIndex, setTargetIndex] = createSignal(0);
  let listHandle;

  const items = () =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: \`Item \${i + 1}\`,
      description:
        i % 3 === 0
          ? 'Short description.'
          : i % 3 === 1
            ? 'Medium length description that takes up a bit more space and wraps to multiple lines.'
            : 'This is a much longer description that demonstrates how the dynamic virtual list handles variable height content. It contains multiple sentences and will wrap to several lines.',
      details: \`Expanded content for item \${i + 1}. This additional information is only shown when the item is expanded. Click again to collapse.\`,
    }));

  return (
    <div class="space-y-4">
      {/* Scroll-to-index controls */}
      <div class="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={99}
          value={targetIndex()}
          onInput={(e) => setTargetIndex(Number(e.target.value))}
          class="w-20 rounded border border-gray-300 px-2 py-1"
        />
        <button
          onClick={() => listHandle?.scrollToIndex(targetIndex(), 'smooth')}
          class="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Scroll to Item
        </button>
      </div>

      <p class="text-sm text-gray-600">
        Average row height: {avgHeight().toFixed(1)}px
        {selectedId() !== null ? \` | Selected: Item \${selectedId() + 1}\` : ''}
      </p>

      {/* Dynamic list with selection, expandable items, and accessibility */}
      <DynamicVirtualList
        ref={(handle) => (listHandle = handle)}
        items={items}
        rootHeight={350}
        estimatedRowHeight={80}
        containerWidth={400}
        role="listbox"
        rowRole="option"
        aria-label="Select an item"
        aria-activedescendant={
          selectedId() !== null ? \`item-\${selectedId()}\` : undefined
        }
        setAverageRowHeight={setAvgHeight}
        fallback={
          <div class="p-8 text-center text-gray-500">No items to display</div>
        }
      >
        {(item) => (
          <div
            id={\`item-\${item.id}\`}
            aria-selected={selectedId() === item.id}
            class={\`cursor-pointer border-b border-gray-100 p-3 transition-colors \${
              selectedId() === item.id
                ? 'bg-blue-50'
                : 'bg-white hover:bg-gray-50'
            }\`}
            onClick={() => {
              setSelectedId(item.id);
              setExpandedId(expandedId() === item.id ? null : item.id);
            }}
          >
            <div class="flex items-center justify-between font-medium">
              {item.title}
              <span class="text-gray-400">
                {expandedId() === item.id ? '\\u25BC' : '\\u25B6'}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-600">{item.description}</p>
            {expandedId() === item.id && (
              <p class="mt-2 text-sm text-blue-700">{item.details}</p>
            )}
          </div>
        )}
      </DynamicVirtualList>
    </div>
  );
}
`}
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
