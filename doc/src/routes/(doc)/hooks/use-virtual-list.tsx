import HookDocPage from '../../../components/HookDocPage';

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
        import { useVirtualList } from '@kayou/hooks';
      `}
    />
  );
}
