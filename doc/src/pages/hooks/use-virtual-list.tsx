import HookDocPage from '../../components/HookDocPage';

export default function UseVirtualListPage() {
  return (
    <HookDocPage
      title="useVirtualList"
      description="A hook for implementing list virtualization with fixed row heights. Calculates which items should be visible based on scroll position and returns the necessary data for rendering only the visible portion of a large list. When using this hook directly, you must enforce the rowHeight on each rendered row to ensure accurate scroll calculations. For variable heights, use useDynamicVirtualList instead."
      parameters={[
        {
          name: 'items',
          type: 'Accessor<T[]>',
          description: 'Reactive accessor returning the array of items to virtualize.',
        },
        {
          name: 'rootHeight',
          type: 'number',
          description: 'The visible height of the container in pixels.',
        },
        {
          name: 'rowHeight',
          type: 'number',
          description:
            'Fixed height of each row in pixels. You must enforce this height on each rendered row (e.g., style={{ height: rowHeight + "px", overflow: "hidden" }}) to ensure scroll calculations are accurate.',
        },
        {
          name: 'overscanCount',
          type: 'number',
          description:
            'Number of extra items to render above and below visible area to reduce flicker during scrolling.',
        },
        {
          name: 'setScrollPosition',
          type: '(scrollTop: number) => void',
          description: 'Optional callback to track scroll position changes.',
        },
      ]}
      returnType="[Accessor<VirtualListResult<T>>, (e: Event) => void, (index: number, behavior?: ScrollBehavior) => { scrollTop: number; behavior: ScrollBehavior }]"
      returns={[
        {
          name: 'virtual',
          type: 'Accessor<VirtualListResult<T>>',
          description:
            'Reactive accessor containing virtualization state: containerHeight, viewerTop, visibleItems, startIndex, and totalItems.',
        },
        {
          name: 'handleScroll',
          type: '(e: Event) => void',
          description:
            'Scroll event handler to attach to the scrollable container. Updates internal scroll position.',
        },
        {
          name: 'scrollToIndex',
          type: '(index: number, behavior?: ScrollBehavior) => { scrollTop: number; behavior: ScrollBehavior }',
          description:
            'Returns scroll parameters for programmatic scrolling to a specific index. Does not perform the scroll - use returned values with element.scrollTo().',
        },
      ]}
      usage={`
        import { useVirtualList } from '@exowpee/solidly';
      `}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Create a custom virtualized list with the hook.',
          code: `
            import { useVirtualList } from '@exowpee/solidly;
            import { createSignal, For } from 'solid-js';

            function CustomVirtualList() {
              const [items] = createSignal(
                Array.from({ length: 10000 }, (_, i) => \`Item \${i + 1}\`)
              );

              const [virtual, handleScroll] = useVirtualList({
                items,
                rootHeight: 400,
                rowHeight: 40,
                overscanCount: 3,
              });

              return (
                <div
                  style={{
                    height: '400px',
                    overflow: 'auto',
                  }}
                  onScroll={handleScroll}
                >
                  <div
                    style={{
                      height: \`\${virtual().containerHeight}px\`,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: \`\${virtual().viewerTop}px\`,
                        width: '100%',
                      }}
                    >
                      <For each={virtual().visibleItems}>
                        {(item, i) => (
                          <div style={{ height: '40px', overflow: 'hidden' }}>
                            {item}
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              );
            }
          `,
        },
        {
          title: 'Understanding VirtualListResult',
          description: 'The virtual accessor returns an object with these properties.',
          code: `
            const [virtual, handleScroll] = useVirtualList({
              items: () => myItems,
              rootHeight: 400,
              rowHeight: 40,
              overscanCount: 2,
            });

            // Access virtual list state
            const state = virtual();

            state.containerHeight  // Total height of all items (items.length * rowHeight)
            state.viewerTop        // Top position for the visible content container
            state.visibleItems     // Array of items currently visible (+ overscan)
            state.startIndex       // Index of the first visible item
            state.totalItems       // Total number of items

            // Example with 1000 items, rowHeight 40, scrolled to middle:
            // containerHeight: 40000 (1000 * 40)
            // viewerTop: 19800 (startIndex * rowHeight)
            // visibleItems: [items[495], items[496], ..., items[515]] (~20 items)
            // startIndex: 495
            // totalItems: 1000
          `,
        },
        {
          title: 'Programmatic Scrolling',
          description:
            'Use scrollToIndex to calculate scroll position for a specific item.',
          code: `
            import { useVirtualList } from '@exowpee/solidly;
            import { createSignal } from 'solid-js';

            function ScrollableList() {
              let containerRef: HTMLDivElement | undefined;
              const [items] = createSignal(
                Array.from({ length: 500 }, (_, i) => \`Item \${i + 1}\`)
              );

              const [virtual, handleScroll, scrollToIndex] = useVirtualList({
                items,
                rootHeight: 300,
                rowHeight: 40,
                overscanCount: 2,
              });

              const goToItem = (index: number) => {
                const { scrollTop, behavior } = scrollToIndex(index, 'smooth');
                containerRef?.scrollTo({ top: scrollTop, behavior });
              };

              return (
                <div>
                  <button onClick={() => goToItem(0)}>Go to Start</button>
                  <button onClick={() => goToItem(250)}>Go to Middle</button>
                  <button onClick={() => goToItem(499)}>Go to End</button>

                  <div
                    ref={containerRef}
                    style={{ height: '300px', overflow: 'auto' }}
                    onScroll={handleScroll}
                  >
                    {/* Render virtual list content */}
                  </div>
                </div>
              );
            }
          `,
        },
        {
          title: 'Tracking Scroll Position',
          description: 'Use setScrollPosition to persist or react to scroll changes.',
          code: `
            import { useVirtualList } from '@exowpee/solidly;
            import { createSignal, createEffect } from 'solid-js';

            function ListWithScrollTracking() {
              const [items] = createSignal([...]);
              const [scrollTop, setScrollTop] = createSignal(0);

              const [virtual, handleScroll] = useVirtualList({
                items,
                rootHeight: 400,
                rowHeight: 40,
                overscanCount: 2,
                setScrollPosition: setScrollTop,
              });

              // React to scroll position changes
              createEffect(() => {
                console.log('Current scroll:', scrollTop());
                // Could save to localStorage for persistence
              });

              // Calculate current visible item
              const currentItem = () => Math.floor(scrollTop() / 40);

              return (
                <div>
                  <p>Viewing item #{currentItem()}</p>
                  {/* Render list */}
                </div>
              );
            }
          `,
        },
        {
          title: 'Enforcing Row Height',
          description:
            'You must enforce the rowHeight on each rendered row to ensure accurate scroll calculations.',
          code: `
            // IMPORTANT: Each row MUST have the exact rowHeight specified
            // The VirtualList component does this automatically, but when using
            // the hook directly, you must enforce it yourself.

            const ROW_HEIGHT = 50;

            const [virtual, handleScroll] = useVirtualList({
              items,
              rootHeight: 400,
              rowHeight: ROW_HEIGHT,
              overscanCount: 2,
            });

            // In your render:
            <For each={virtual().visibleItems}>
              {(item) => (
                <div
                  style={{
                    height: \`\${ROW_HEIGHT}px\`,  // Enforce exact height
                    overflow: 'hidden',            // Clip overflow content
                  }}
                >
                  {item.content}
                </div>
              )}
            </For>

            // If you need variable row heights, use useDynamicVirtualList instead:
            import { useDynamicVirtualList } from '@exowpee/solidly;
          `,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types used by useVirtualList.',
          code: `
            // Configuration type
            type VirtualListConfig<T extends readonly unknown[]> = {
              items: Accessor<T>;
              rootHeight: number;
              rowHeight: number;
              overscanCount: number;
              setScrollPosition?: (scrollTop: number) => void;
            };

            // Result type returned by the virtual accessor
            type VirtualListResult<T extends readonly unknown[]> = {
              /** Total height of all items (items.length * rowHeight) */
              containerHeight: number;
              /** Top offset for the visible content container */
              viewerTop: number;
              /** Array of currently visible items (including overscan) */
              visibleItems: T[number][];
              /** Index of the first visible item */
              startIndex: number;
              /** Total number of items in the list */
              totalItems: number;
            };

            // Return type of the hook
            type UseVirtualListReturn<T> = [
              Accessor<VirtualListResult<T>>,
              (e: Event) => void,
              (index: number, behavior?: ScrollBehavior) => {
                scrollTop: number;
                behavior: ScrollBehavior;
              }
            ];
          `,
        },
      ]}
    />
  );
}
