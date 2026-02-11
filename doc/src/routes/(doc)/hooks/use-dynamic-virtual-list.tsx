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
    />
  );
}
