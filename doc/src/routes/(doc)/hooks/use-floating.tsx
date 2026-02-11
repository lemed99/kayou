import HookDocPage from '../../../components/HookDocPage';

export default function UseFloatingPage() {
  return (
    <HookDocPage
      title="useFloating"
      description="A positioning engine hook for floating UI elements like tooltips, popovers, and dropdowns. Automatically handles positioning relative to a reference element, viewport boundary detection, placement flipping when there's not enough space, and optional arrow positioning. This is the foundation for components like Tooltip and Popover."
      parameters={[
        {
          name: 'placement',
          type: 'Placement',
          default: '"bottom"',
          description:
            'Initial placement of the floating element. Options: "top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end".',
        },
        {
          name: 'offset',
          type: 'number',
          default: '8',
          description: 'Distance in pixels between the reference and floating element.',
        },
        {
          name: 'isOpen',
          type: 'Accessor<boolean>',
          description:
            'Reactive accessor that controls when positioning calculations run. Position is only computed when isOpen returns true.',
          required: true,
        },
        {
          name: 'renderArrow',
          type: 'boolean',
          default: 'false',
          description:
            'Whether to calculate arrow positioning. When true, arrow styles will be computed.',
        },
        {
          name: 'arrowAlignment',
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: 'Alignment of the arrow along the edge of the floating element.',
        },
        {
          name: 'arrowOffset',
          type: 'number',
          default: '0',
          description:
            'Additional offset for the arrow position along the edge of the floating element in pixels.',
        },
        {
          name: 'arrowInset',
          type: 'number',
          default: '0',
          description:
            'Controls how far the arrow is inset into the floating element, perpendicular to its edge. Useful for aligning the arrow with borders.',
        },
        {
          name: 'backgroundScrollBehavior',
          type: '"prevent" | "close" | "follow"',
          default: '"close"',
          description:
            'How to handle background scroll when floating is open. "close" closes the floating element on scroll, "follow" updates position and hides when anchor exits viewport, "prevent" locks background scroll.',
        },
        {
          name: 'onClose',
          type: '() => void',
          description:
            'Callback fired when the floating element should close. Required for "close" and "follow" behaviors.',
        },
      ]}
      returnType="UseFloatingReturn"
      returns={[
        {
          name: 'floatingStyles',
          type: 'Accessor<JSX.CSSProperties>',
          description:
            'Reactive accessor returning CSS styles (position, top, left) to apply to the floating element.',
        },
        {
          name: 'arrowStyles',
          type: 'Accessor<JSX.CSSProperties | null>',
          description:
            'Reactive accessor returning CSS styles for the arrow element. Returns null if renderArrow is false.',
        },
        {
          name: 'placement',
          type: 'Accessor<Placement>',
          description:
            'Reactive accessor returning the current placement. May differ from initial placement if the element was flipped due to viewport constraints.',
        },
        {
          name: 'isAnchorVisible',
          type: 'Accessor<boolean>',
          description:
            'Reactive accessor indicating whether the anchor element is visible within its scrollable ancestors. Useful with backgroundScrollBehavior: "follow" to hide the floating element when anchor scrolls out of view.',
        },
        {
          name: 'update',
          type: '() => void',
          description:
            'Manually trigger a position recalculation. Useful after content changes.',
        },
        {
          name: 'container',
          type: 'Accessor<Node>',
          description:
            'Reactive accessor returning the container element where the floating element should be portaled.',
        },
        {
          name: 'refs.setReference',
          type: '(el: HTMLElement | null) => void',
          description: 'Ref callback to set the reference (trigger) element.',
        },
        {
          name: 'refs.setFloating',
          type: '(el: HTMLElement | null) => void',
          description: 'Ref callback to set the floating element.',
        },
        {
          name: 'refs.setArrow',
          type: '(el: HTMLElement | null) => void',
          description: 'Ref callback to set the arrow element.',
        },
        {
          name: 'refs.reference',
          type: 'Accessor<HTMLElement | null>',
          description: 'Accessor to get the reference element.',
        },
        {
          name: 'refs.floating',
          type: 'Accessor<HTMLElement | null>',
          description: 'Accessor to get the floating element.',
        },
        {
          name: 'refs.arrow',
          type: 'Accessor<HTMLElement | null>',
          description: 'Accessor to get the arrow element.',
        },
      ]}
      usage={`
        import { useFloating } from '@kayou/hooks';
      `}
    />
  );
}
