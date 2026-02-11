import DocPage from '../../../components/DocPage';

export default function VirtualListPage() {
  return (
    <DocPage
      title="VirtualList"
      description="Virtualized list that renders only visible items for large datasets. Requires fixed row heights. Supports keyboard navigation, imperative scroll control, and accessibility."
      keyConcepts={[
        {
          term: 'Virtualization',
          explanation: 'Renders only visible items; window moves as user scrolls.',
        },
        {
          term: 'Fixed Row Height',
          explanation:
            'Exact rowHeight required for instant scroll position calculation.',
        },
        {
          term: 'Overscan',
          explanation:
            'Extra items rendered off-screen prevent blanks during fast scroll.',
        },
        {
          term: 'Imperative Handle',
          explanation: 'ref provides scrollToIndex for programmatic scrolling.',
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
      playground={`
import { VirtualList } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [selectedId, setSelectedId] = createSignal(null);
  const [scrollPos, setScrollPos] = createSignal(0);
  const [targetIndex, setTargetIndex] = createSignal(0);
  let listHandle;

  const items = () =>
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
    }));

  return (
    <div class="space-y-4">
      {/* Scroll-to-index controls */}
      <div class="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={199}
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
        Scroll position: {scrollPos()}px
        {selectedId() !== null ? \` | Selected: User \${selectedId() + 1}\` : ''}
      </p>

      {/* Selectable list with keyboard navigation and scroll tracking */}
      <VirtualList
        ref={(handle) => (listHandle = handle)}
        items={items}
        rootHeight={300}
        rowHeight={56}
        containerWidth={350}
        rowClass="border-b border-gray-100"
        role="listbox"
        aria-label="User list"
        aria-activedescendant={
          selectedId() !== null ? \`user-\${selectedId()}\` : undefined
        }
        setScrollPosition={setScrollPos}
        fallback={
          <div class="p-8 text-center text-gray-500">No items to display</div>
        }
      >
        {(item) => (
          <div
            id={\`user-\${item.id}\`}
            role="option"
            aria-selected={selectedId() === item.id}
            class={\`cursor-pointer p-2 transition-colors \${
              selectedId() === item.id
                ? 'bg-blue-100 text-blue-900'
                : 'bg-white hover:bg-gray-50'
            }\`}
            onClick={() => setSelectedId(item.id)}
          >
            <div class="font-medium">{item.name}</div>
            <div class="text-sm text-gray-500">{item.email}</div>
          </div>
        )}
      </VirtualList>
    </div>
  );
}
`}
      usage={`
        import { VirtualList, VirtualListHandle } from '@kayou/ui';

        <VirtualList items={items} rootHeight={400} rowHeight={50}>{(item) => <div>{item.name}</div>}</VirtualList>
        <VirtualList items={items} rootHeight={400} rowHeight={50} ref={(h) => listHandle = h} role="listbox" aria-label="Items">{(item) => <div>{item.name}</div>}</VirtualList>
      `}
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
