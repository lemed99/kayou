import HookDocPage from '../../../components/HookDocPage';

export default function UseDynamicVirtualListPage() {
  return (
    <HookDocPage
      title="useDynamicVirtualList"
      description="A hook for implementing list virtualization with variable row heights. Unlike useVirtualList which requires fixed heights, this hook measures each row's actual height using ResizeObserver and uses binary search for efficient scroll position calculations. Used internally by DynamicVirtualList but can be used directly for custom implementations."
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
          name: 'estimatedRowHeight',
          type: 'number',
          description:
            'Initial estimate for row height. Used before actual measurements. Once items are measured, the average measured height is used instead.',
        },
        {
          name: 'overscanCount',
          type: 'number',
          description:
            'Number of extra items to render above and below visible area to reduce flicker.',
        },
        {
          name: 'setScrollPosition',
          type: '(scrollTop: number) => void',
          description: 'Optional callback to track scroll position changes.',
        },
        {
          name: 'setAverageRowHeight',
          type: '(height: number) => void',
          description:
            'Optional callback fired when average row height is recalculated. Useful for persisting better estimates.',
        },
      ]}
      returnType="[Accessor<DynamicVirtualListResult<T>>, (e: Event) => void, (index: Accessor<number>, el: HTMLElement) => void, (index: number, behavior?: ScrollBehavior) => { scrollTop: number; behavior: ScrollBehavior }]"
      returns={[
        {
          name: 'virtual',
          type: 'Accessor<DynamicVirtualListResult<T>>',
          description:
            'Reactive accessor containing virtualization state: containerHeight, viewerTop, visibleItems, startIndex, endIndex, and totalItems.',
        },
        {
          name: 'handleScroll',
          type: '(e: Event) => void',
          description:
            'Scroll event handler to attach to the scrollable container. Updates internal scroll position.',
        },
        {
          name: 'registerSize',
          type: '(index: Accessor<number>, el: HTMLElement) => void',
          description:
            'Callback to register a row element for height measurement. Pass to ref of each row element.',
        },
        {
          name: 'scrollToIndex',
          type: '(index: number, behavior?: ScrollBehavior) => { scrollTop: number; behavior: ScrollBehavior }',
          description:
            'Returns scroll parameters for programmatic scrolling. Uses actual measured heights when available.',
        },
      ]}
      usage={`
        import { useDynamicVirtualList } from '@kayou/hooks';
      `}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Create a custom virtualized list with variable row heights.',
          code: `
            import { useDynamicVirtualList } from '@kayou/hooks';
            import { createSignal, For } from 'solid-js';

            function CustomDynamicList() {
              const [items] = createSignal([
                { id: 1, text: 'Short' },
                { id: 2, text: 'This is a longer message that will wrap...' },
                // ... more items
              ]);

              const [virtual, handleScroll, registerSize] = useDynamicVirtualList({
                items,
                rootHeight: 400,
                estimatedRowHeight: 60,
                overscanCount: 3,
              });

              return (
                <div
                  style={{ height: '400px', overflow: 'auto' }}
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
                        {(item, i) => {
                          const index = () => virtual().startIndex + i();
                          return (
                            <div ref={(el) => registerSize(index, el)}>
                              {item.text}
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </div>
              );
            }
          `,
        },
        {
          title: 'Understanding registerSize',
          description:
            'The registerSize function is crucial - it must be called for each row to measure heights.',
          code: `
            const [virtual, handleScroll, registerSize] = useDynamicVirtualList({
              items,
              rootHeight: 400,
              estimatedRowHeight: 60,
              overscanCount: 2,
            });

            // IMPORTANT: registerSize takes an index accessor, not a raw number
            // This allows the hook to track which row is being measured

            <For each={virtual().visibleItems}>
              {(item, i) => {
                // Create an accessor that returns the actual item index
                const itemIndex = () => virtual().startIndex + i();

                return (
                  <div ref={(el) => registerSize(itemIndex, el)}>
                    {/* Row content - can be any height */}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                );
              }}
            </For>

            // The hook will:
            // 1. Set up a ResizeObserver on the element
            // 2. Store the measured height in an internal map
            // 3. Recalculate positions when heights change
            // 4. Clean up observers when items scroll out of view
          `,
        },
        {
          title: 'Understanding DynamicVirtualListResult',
          description: 'The virtual accessor returns detailed state about visible items.',
          code: `
            const [virtual, handleScroll, registerSize] = useDynamicVirtualList({
              items: () => myItems,
              rootHeight: 400,
              estimatedRowHeight: 60,
              overscanCount: 2,
            });

            // Access virtual list state
            const state = virtual();

            state.containerHeight  // Total height based on measured/estimated heights
            state.viewerTop        // Top position for visible content (uses prefix sums)
            state.visibleItems     // Array of items currently visible (+ overscan)
            state.startIndex       // Index of first visible item
            state.endIndex         // Index after last visible item (exclusive)
            state.totalItems       // Total number of items

            // Unlike useVirtualList, heights are computed per-item:
            // - Items with measured heights use actual values
            // - Items without measurements use average or estimated height
            // - Binary search finds visible range efficiently
          `,
        },
        {
          title: 'Programmatic Scrolling',
          description: 'Scroll to specific items using calculated positions.',
          code: `
            import { useDynamicVirtualList } from '@kayou/hooks';
            import { createSignal } from 'solid-js';

            function ScrollableList() {
              let containerRef: HTMLDivElement | undefined;
              const [items] = createSignal([...]);

              const [virtual, handleScroll, registerSize, scrollToIndex] =
                useDynamicVirtualList({
                  items,
                  rootHeight: 300,
                  estimatedRowHeight: 60,
                  overscanCount: 2,
                });

              const goToItem = (index: number) => {
                // scrollToIndex calculates position using prefix heights
                // It uses measured heights when available, estimates otherwise
                const { scrollTop, behavior } = scrollToIndex(index, 'smooth');
                containerRef?.scrollTo({ top: scrollTop, behavior });
              };

              return (
                <div>
                  <button onClick={() => goToItem(0)}>First</button>
                  <button onClick={() => goToItem(50)}>Middle</button>
                  <button onClick={() => goToItem(items().length - 1)}>Last</button>

                  <div ref={containerRef} onScroll={handleScroll}>
                    {/* Render list */}
                  </div>
                </div>
              );
            }
          `,
        },
        {
          title: 'Tracking Average Height',
          description: 'Get the calculated average height for better future estimates.',
          code: `
            import { useDynamicVirtualList } from '@kayou/hooks';
            import { createSignal, createEffect } from 'solid-js';

            function ListWithHeightTracking() {
              const [items] = createSignal([...]);
              const [avgHeight, setAvgHeight] = createSignal(60);

              const [virtual, handleScroll, registerSize] = useDynamicVirtualList({
                items,
                rootHeight: 400,
                estimatedRowHeight: 60,
                overscanCount: 2,
                setAverageRowHeight: setAvgHeight,
              });

              // avgHeight is updated as rows are measured
              createEffect(() => {
                console.log('Average row height:', avgHeight());
                // Could save to localStorage for next session:
                // localStorage.setItem('avgRowHeight', avgHeight().toString());
              });

              // Use measured average for better initial estimates
              // const savedHeight = localStorage.getItem('avgRowHeight');
              // const initialEstimate = savedHeight ? parseFloat(savedHeight) : 60;

              return (/* ... */);
            }
          `,
        },
        {
          title: 'How Height Calculation Works',
          description: 'Understanding the internal height management.',
          code: `
            // The hook maintains several data structures:

            // 1. sizeMap: Map<number, number>
            //    - Stores measured heights per index
            //    - Updated via ResizeObserver when rows render

            // 2. observerMap: Map<number, { observer, index }>
            //    - Tracks active ResizeObservers
            //    - Cleaned up when items scroll out of view

            // 3. getPrefixHeights(): { offsets: number[], total: number }
            //    - Computes cumulative heights for all items
            //    - offsets[i] = sum of heights from 0 to i-1
            //    - Uses measured height if available, otherwise average/estimate

            // Example with 5 items, heights [40, 80, 60, ?, ?]:
            // Measured: items 0, 1, 2
            // Average: (40 + 80 + 60) / 3 = 60
            // Offsets: [0, 40, 120, 180, 240]
            // Total: 300

            // Binary search finds first visible item:
            // - Given scrollTop = 100
            // - Find smallest i where offsets[i] >= 100
            // - Result: i = 2 (offset 120)
            // - With overscan: startIndex = max(0, 2 - overscan)
          `,
        },
        {
          title: 'Cleanup and Memory Management',
          description: 'The hook handles cleanup automatically.',
          code: `
            // The hook manages memory efficiently:

            // 1. When items scroll out of view:
            //    - ResizeObservers are disconnected
            //    - But measured heights are retained in sizeMap
            //    - This prevents re-measuring when scrolling back

            // 2. When items are removed from the array:
            //    - Stale entries are cleaned from sizeMap
            //    - Corresponding observers are disconnected

            // 3. On component unmount (via onCleanup):
            //    - All observers are disconnected
            //    - Maps are cleared

            // This cleanup happens automatically:
            createEffect(
              on(items, (currentItems) => {
                // If items were removed, clean up stale entries
                if (currentItems.length < previousLength) {
                  for (let i = currentItems.length; i < previousLength; i++) {
                    cleanupObserver(i);
                    sizeMap.delete(i);
                  }
                }
              })
            );
          `,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types used by useDynamicVirtualList.',
          code: `
            // Configuration type
            type DynamicVirtualListConfig<T extends readonly unknown[]> = {
              items: Accessor<T>;
              rootHeight: number;
              estimatedRowHeight: number;
              overscanCount: number;
              setScrollPosition?: (scrollTop: number) => void;
              setAverageRowHeight?: (height: number) => void;
            };

            // Result type returned by the virtual accessor
            type DynamicVirtualListResult<T extends readonly unknown[]> = {
              /** Total height based on measured + estimated heights */
              containerHeight: number;
              /** Top offset for visible content (prefix sum) */
              viewerTop: number;
              /** Array of currently visible items */
              visibleItems: T[number][];
              /** Index of first visible item */
              startIndex: number;
              /** Index after last visible item (exclusive) */
              endIndex: number;
              /** Total number of items */
              totalItems: number;
            };

            // Return type of the hook
            type UseDynamicVirtualListReturn<T> = [
              Accessor<DynamicVirtualListResult<T>>,
              (e: Event) => void,
              (index: Accessor<number>, el: HTMLElement) => void,
              (index: number, behavior?: ScrollBehavior) => {
                scrollTop: number;
                behavior: ScrollBehavior;
              }
            ];
          `,
        },
        {
          title: 'Comparison with useVirtualList',
          description: 'When to use each hook.',
          code: `
            // useVirtualList (fixed heights):
            // ✓ Simpler implementation
            // ✓ More performant (no height measurements)
            // ✓ Predictable scroll positions
            // ✗ All rows must have identical heights

            // useDynamicVirtualList (variable heights):
            // ✓ Supports any row height
            // ✓ Handles dynamic content (expandable, images loading)
            // ✓ Accurate scroll-to-index with measured heights
            // ✗ More overhead (ResizeObserver per visible row)
            // ✗ Initial scroll estimates may be less accurate

            // Use useVirtualList when:
            // - Rendering tables with fixed row heights
            // - Simple lists with uniform items
            // - Performance is critical

            // Use useDynamicVirtualList when:
            // - Chat messages with varying lengths
            // - Cards with different content amounts
            // - Expandable/collapsible items
            // - Items with images that affect height
          `,
        },
      ]}
    />
  );
}
