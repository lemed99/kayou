import HookDocPage from '../../components/HookDocPage';

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
      usage={`import { useFloating } from '@exowpee/solidly';`}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Create a simple floating element that positions below a trigger.',
          code: `import { useFloating } from '@exowpee/solidly;
import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

function BasicFloating() {
  const [isOpen, setIsOpen] = createSignal(false);

  const { refs, floatingStyles, container } = useFloating({
    placement: 'bottom',
    offset: 8,
    isOpen,
  });

  return (
    <>
      <button
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen())}
      >
        Toggle
      </button>

      <Show when={isOpen()}>
        <Portal mount={container()}>
          <div ref={refs.setFloating} style={floatingStyles()}>
            Floating content
          </div>
        </Portal>
      </Show>
    </>
  );
}`,
        },
        {
          title: 'With Arrow',
          description: 'Add an arrow pointing to the reference element.',
          code: `import { useFloating } from '@exowpee/solidly;
import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

function FloatingWithArrow() {
  const [isOpen, setIsOpen] = createSignal(false);

  const { refs, floatingStyles, arrowStyles, container } = useFloating({
    placement: 'top',
    offset: 10,
    isOpen,
    renderArrow: true,
    arrowAlignment: 'center',
  });

  return (
    <>
      <button
        ref={refs.setReference}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Hover me
      </button>

      <Show when={isOpen()}>
        <Portal mount={container()}>
          <div ref={refs.setFloating} style={floatingStyles()}>
            <div ref={refs.setArrow} style={arrowStyles()!}>
              {/* Arrow SVG or element */}
            </div>
            Tooltip content
          </div>
        </Portal>
      </Show>
    </>
  );
}`,
        },
        {
          title: 'Placement Options',
          description: 'All available placement values.',
          code: `// Primary placements
placement: 'top'      // Centered above
placement: 'bottom'   // Centered below
placement: 'left'     // Centered to the left
placement: 'right'    // Centered to the right

// With alignment variations
placement: 'top-start'    // Above, aligned to start
placement: 'top-end'      // Above, aligned to end
placement: 'bottom-start' // Below, aligned to start
placement: 'bottom-end'   // Below, aligned to end
placement: 'left-start'   // Left, aligned to start
placement: 'left-end'     // Left, aligned to end
placement: 'right-start'  // Right, aligned to start
placement: 'right-end'    // Right, aligned to end

// The hook automatically flips placement if there's
// not enough space in the preferred direction`,
        },
        {
          title: 'Reactive Placement',
          description:
            'The placement accessor returns the actual placement after any flipping.',
          code: `const { placement, floatingStyles } = useFloating({
  placement: 'bottom', // Preferred placement
  isOpen,
  offset: 8,
});

// If there's not enough space below, placement() might return 'top'
createEffect(() => {
  console.log('Current placement:', placement());
  // Could be 'bottom' or 'top' depending on available space
});`,
        },
        {
          title: 'Manual Update',
          description: 'Trigger a manual position update when content changes.',
          code: `const { refs, floatingStyles, update } = useFloating({
  placement: 'bottom',
  isOpen,
});

// After changing content that affects size
function handleContentChange() {
  setContent(newContent);
  // Position will auto-update due to ResizeObserver,
  // but you can manually trigger if needed:
  update();
}`,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types used by useFloating.',
          code: `type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

type Alignment = 'start' | 'end' | 'center';

interface UseFloatingOptions {
  placement?: Placement;
  offset?: number;
  isOpen: Accessor<boolean>;
  renderArrow?: boolean;
  arrowAlignment?: Alignment;
  arrowOffset?: number;
  arrowInset?: number;
}

interface UseFloatingReturn {
  floatingStyles: Accessor<JSX.CSSProperties>;
  arrowStyles: Accessor<JSX.CSSProperties | null>;
  placement: Accessor<Placement>;
  update: () => void;
  container: Accessor<Node>;
  refs: {
    setReference: (el: HTMLElement | null) => void;
    setFloating: (el: HTMLElement | null) => void;
    setArrow: (el: HTMLElement | null) => void;
    reference: Accessor<HTMLElement | null>;
    floating: Accessor<HTMLElement | null>;
    arrow: Accessor<HTMLElement | null>;
  };
}`,
        },
      ]}
    />
  );
}
